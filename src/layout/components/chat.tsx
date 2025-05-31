import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'
import { useComponentContext } from '@/context/ComponentContext'
import { API_BASEURL } from '@/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { type Page } from '@/modules/projects/models/page.model'

const ChatSidebar = () => {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'Describe la interfaz Flutter que quieres generar.'
    }
  ])
  const [input, setInput] = useState('')
  const [width, setWidth] = useState(360)
  const resizerRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { updatePage, selectedPage } = useComponentContext()
  const [isThinking, setIsThinking] = useState(false)
  const [pendingPage, setPendingPage] = useState<Page | null>(null)
  useEffect(() => {
    const resizer = resizerRef.current
    const sidebar = sidebarRef.current

    if (!resizer || !sidebar) return

    const startResize = (e: MouseEvent) => {
      e.preventDefault()
      document.addEventListener('mousemove', resize)
      document.addEventListener('mouseup', stopResize)
    }

    const resize = (e: MouseEvent) => {
      const newWidth = e.clientX - sidebar.getBoundingClientRect().left
      if (newWidth >= 320 && newWidth <= 600) {
        setWidth(newWidth)
      }
    }

    const stopResize = () => {
      document.removeEventListener('mousemove', resize)
      document.removeEventListener('mouseup', stopResize)
    }

    resizer.addEventListener('mousedown', startResize)
    return () => {
      resizer.removeEventListener('mousedown', startResize)
      stopResize()
    }
  }, [])
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startLoadingDots = () => {
    let dotCount = 0
    loadingIntervalRef.current = setInterval(() => {
      dotCount = (dotCount + 1) % 4
      const dots = '.'.repeat(dotCount)
      const content = `💡 Generando componente con IA${dots}`
      setMessages(prev => {
        const last = prev[prev.length - 1]
        if (last?.role === 'ai' && last?.content?.startsWith('💡')) {
          const updated = { ...last, content }
          return [...prev.slice(0, -1), updated]
        }
        return prev
      })
    }, 500) // cada 0.5s cambia los puntos
  }

  const stopLoadingDots = () => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current)
      loadingIntervalRef.current = null
    }
  }
  const handleSend = async () => {
    if (!input.trim() || !selectedPage) return

    const prompt = input
    const userMessage = { role: 'user', content: prompt }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    // Mensaje "IA trabajando..."
    const loadingMessage = {
      role: 'ai',
      content: '💡 Generando componente con IA...'
    }
    setMessages((prev) => [...prev, loadingMessage])
    startLoadingDots()
    setIsThinking(true)
    try {
      const body = { prompt, page_id: selectedPage.id }

      const response = await fetch(`${API_BASEURL}/ia/component`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('Error en la respuesta del servidor')

      const data = await response.json()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (data?.page) setPendingPage(data.page)
      const pageFromServer = data.page
      // Elimina el mensaje de "IA trabajando..."
      setMessages((prev) => prev.slice(0, -1))
      stopLoadingDots()
      // Añade el mensaje con el código del componente
      const animatedContent = `✅ Componente generado:\n\`\`\`json\n${JSON.stringify(
        data.components,
        null,
        2
      )}\n\`\`\``

      // Agrega el mensaje vacío primero
      const aiMessage = { role: 'ai', content: '' }
      setMessages((prev) => [...prev, aiMessage])

      // Empieza a animar letra por letra

      animateTyping(animatedContent, aiMessage, () => {
        if (pageFromServer) updatePage(pageFromServer)
      }, 12, 3)
    } catch (error) {
      setMessages((prev) => prev.slice(0, -1)) // quitar mensaje temporal
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: '⚠️ Hubo un error al generar el componente.'
        }
      ])
      stopLoadingDots()
      console.error('Error al generar con IA:', error)
    } finally {
      setIsThinking(false)
    }
  }
  const animateTyping = (
    text: string,
    baseMessage: any,
    onComplete?: () => void,
    delay = 12, // ≈ 60 fps
    step = 3 // ⬅️ añade 3 chars cada vez
  ) => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= text.length) {
        const updated = { ...baseMessage, content: text.slice(0, i) }
        setMessages(prev => [...prev.slice(0, -1), updated])
        i += step // ⬆️ avanza más rápido
      } else {
        clearInterval(interval)
        onComplete?.()
      }
    }, delay)
  }
  const isJSONMessage = (text: string) => {
    return text.startsWith('✅ Componente generado:\n```json')
  }
  return (
    <aside
      ref={sidebarRef}
      style={{ width: `${width}px` }}
      className="min-w-[320px] h-full border-r bg-background dark:bg-dark-background-primary flex flex-col relative z-10"
    >
      <div className="h-14 border-b lg:h-[60px] bg-dark-primary-foreground flex items-center justify-center text-light-text-primary dark:text-dark-text-primary font-medium text-lg">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-7 h-7" />
          <CardTitle>Chat - {selectedPage?.name ?? 'Sin página'}</CardTitle>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <Card key={index} className={msg.role === 'user' ? 'bg-white' : 'bg-muted'}>
            <CardContent className="p-4 whitespace-pre-wrap text-sm font-mono">
              <strong>{msg.role === 'user' ? 'Tú:' : 'UI Sketch:'}</strong>
              <div className="mt-2">
                {isJSONMessage(msg.content)
                  ? (
                  <SyntaxHighlighter
                    language="json"
                    style={oneDark}
                    wrapLongLines
                    customStyle={{
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      padding: '1rem'
                    }}
                  >
                    {
                      msg.content
                        .replace(/^✅ Componente generado:\n```json\n/, '')
                        .replace(/```$/, '')
                        .trim()
                    }
                  </SyntaxHighlighter>
                    )
                  : (
                  <p className={index === messages.length - 1 && msg.content.length < 10 ? 'typing-cursor' : ''}>
                    {msg.content}
                  </p>
                    )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border-t p-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
          }}
          placeholder="Describe tu interfaz Flutter..."
          className="flex-1"
        />
        <Button onClick={handleSend}>Enviar</Button>
      </div>

      {/* Resizer */}
      <div
        ref={resizerRef}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors"
      >
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1 h-8 bg-primary/30 rounded-full" />
      </div>
    </aside>
  )
}

export default ChatSidebar
