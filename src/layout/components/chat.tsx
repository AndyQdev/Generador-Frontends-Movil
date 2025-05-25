import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare, GripVertical } from 'lucide-react'
import { CardTitle } from '@/components/ui/card'

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

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    const aiResponse = {
      role: 'ai',
      content: `Aquí tienes un ejemplo de código Flutter basado en: "${input}"\n\n// TODO: código generado`
    }

    setMessages((prev) => [...prev, userMessage, aiResponse])
    setInput('')
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
          <CardTitle>Chat</CardTitle>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <Card
            key={index}
            className={msg.role === 'user' ? 'bg-white' : 'bg-muted'}
          >
            <CardContent className="p-4 whitespace-pre-wrap text-sm">
              <strong>{msg.role === 'user' ? 'Tú:' : 'UI Sketch:'}</strong>{' '}
              {msg.content}
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
