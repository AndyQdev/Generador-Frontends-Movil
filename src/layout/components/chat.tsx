import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, X, StopCircle, TestTube } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useComponentContext } from '@/context/ComponentContext'
import { API_BASEURL } from '@/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { type Page } from '@/modules/projects/models/page.model'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AudioWaveLive } from './AudioWaveLive'

interface ChatSidebarProps {
  onClose: () => void
}

const ChatSidebar = ({ onClose }: ChatSidebarProps) => {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'Describe la interfaz Flutter que quieres generar.'
    }
  ])
  const [input, setInput] = useState('')
  const [width, setWidth] = useState(360)
  const [isTestMode, setIsTestMode] = useState(false)
  const [testJson, setTestJson] = useState('')
  const resizerRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { updatePage, selectedPage } = useComponentContext()
  const [isThinking, setIsThinking] = useState(false)
  const [, setPendingPage] = useState<Page | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  // ---- Grabación de audio ----------------------------
  const [isRecording, setIsRecording] = useState(false)
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [, setRecordError] = useState<string | null>(null)
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
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    stopLoadingDots()
    setIsThinking(false)
    setMessages((prev) => prev.slice(0, -1))
    setMessages((prev) => [
      ...prev,
      {
        role: 'ai',
        content: '⚠️ Generación detenida por el usuario.'
      }
    ])
  }
  const handleSendPrompt = async (prompt: string) => {
    if (!prompt || !selectedPage) return

    const loadingMessage = {
      role: 'ai',
      content: '💡 Generando componente con IA...'
    }
    setMessages(prev => [...prev, loadingMessage])
    setIsThinking(true)
    startLoadingDots()
    abortControllerRef.current = new AbortController()

    try {
      const body = { prompt, page_id: selectedPage.id }
      const response = await fetch(`${API_BASEURL}/ia/component`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) throw new Error('Error en la IA')

      const data = await response.json()
      const pageFromServer = data.page
      const pretty = JSON.stringify(data.components ?? data.component ?? {}, null, 2)

      setMessages(prev => prev.slice(0, -1))
      stopLoadingDots()

      const aiMsg = { role: 'ai', content: '' }
      setMessages(prev => [...prev, aiMsg])

      animateTyping(`✅ Componente generado:\n\`\`\`json\n${pretty}\n\`\`\``,
        aiMsg,
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/no-unsafe-argument
        () => pageFromServer && updatePage(pageFromServer),
        8, 4)
    } catch (error) {
      setMessages(prev => prev.slice(0, -1))
      setMessages(prev => [...prev, { role: 'ai', content: '⚠️ Hubo un error al generar el componente.' }])
      stopLoadingDots()
    } finally {
      setIsThinking(false)
    }
  }

  const sendAudioToIA = async () => {
    const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
    const file = new File([blob], 'audio.webm', { type: 'audio/webm' })
    const form = new FormData()
    form.append('file', file)
    form.append('page_id', String(selectedPage?.id ?? ''))
    form.append('mode', 'component')

    const transcribingMessage = { role: 'ai', content: '🎙️ Transcribiendo audio...' }
    setMessages(prev => [...prev, transcribingMessage])
    setIsThinking(true)
    startLoadingDots()

    try {
      const res = await fetch(`${API_BASEURL}/ia/from-audio`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: form
      })
      if (!res.ok) throw new Error('Error transcribiendo audio')

      const data = await res.json()
      const prompt = data.prompt

      setMessages(prev => [
        ...prev.slice(0, -1), // Quita "transcribiendo..."
        { role: 'user', content: prompt }
      ])
      stopLoadingDots()

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await handleSendPrompt(prompt) // ⬅️ ENVÍA el prompt automáticamente
    } catch (e) {
      stopLoadingDots()
      setMessages(prev => prev.slice(0, -1))
      setMessages(prev => [...prev, { role: 'ai', content: '⚠️ Error procesando audio.' }])
    } finally {
      setIsThinking(false)
      setRecorder(null)
    }
  }

  const startRecording = async () => {
    setRecordError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const _rec = new MediaRecorder(stream, { mimeType: 'audio/webm' })

      _rec.ondataavailable = (e) => {
        if (e.data.size) audioChunksRef.current.push(e.data)
      }
      _rec.onstop = () => {
        stream.getTracks().forEach(t => { t.stop() }) // cerramos micrófono
        void sendAudioToIA() // ⬅️ aquí llamamos a la IA
      }

      audioChunksRef.current = []
      _rec.start()
      setRecorder(_rec)
      setIsRecording(true)
    } catch (e) {
      setRecordError('No se pudo acceder al micrófono')
    }
  }

  const cancelRecording = () => {
    recorder?.stream.getTracks().forEach(t => { t.stop() })
    recorder?.stop() // detiene pero NO envía
    setIsRecording(false)
    setRecorder(null)
    audioChunksRef.current = []
  }

  const stopAndSendRecording = () => {
    recorder?.stop() // activará onstop → sendAudioToIA
    setIsRecording(false)
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

    // Crear nuevo AbortController para esta petición
    abortControllerRef.current = new AbortController()

    try {
      const body = { prompt, page_id: selectedPage.id }

      const response = await fetch(`${API_BASEURL}/ia/component`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body),
        signal: abortControllerRef.current.signal
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (pageFromServer) updatePage(pageFromServer)
      }, 8, 4)
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

  const handleTestResponse = () => {
    try {
      const jsonData = JSON.parse(testJson)
      const animatedContent = `✅ Componente generado:\n\`\`\`json\n${JSON.stringify(
        jsonData,
        null,
        2
      )}\n\`\`\``

      const aiMessage = { role: 'ai', content: '' }
      setMessages((prev) => [...prev, aiMessage])

      animateTyping(animatedContent, aiMessage, () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (jsonData.page) updatePage(jsonData.page)
      }, 8, 4)
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: '⚠️ Error en el formato JSON de prueba.'
        }
      ])
    }
  }

  return (
    <aside
      ref={sidebarRef}
      style={{ width: `${width}px` }}
      className="min-w-[320px] h-full border-r bg-background dark:bg-dark-background-primary flex flex-col relative z-10"
    >
      <div className="h-14 border-b lg:h-[60px] bg-dark-primary-foreground flex items-center justify-between px-4 text-light-text-primary dark:text-dark-text-primary font-medium text-lg">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-7 h-7" />
          <CardTitle>Chat - {selectedPage?.name ?? 'Sin página'}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className={isTestMode ? 'text-yellow-500' : ''}>
                <TestTube className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modo Prueba</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isTestMode}
                    onChange={(e) => { setIsTestMode(e.target.checked) }}
                    className="w-4 h-4"
                  />
                  <label>Activar modo prueba</label>
                </div>
                {isTestMode && (
                  <>
                    <Textarea
                      value={testJson}
                      onChange={(e) => { setTestJson(e.target.value) }}
                      placeholder="Ingresa el JSON de prueba..."
                      className="h-[200px] font-mono text-sm"
                    />
                    <Button onClick={handleTestResponse} className="w-full">
                      Probar Respuesta
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === 'user' ? 'self-end' : 'self-start'}
            >
              <Card
                className={
                  msg.role === 'user'
                    ? 'bg-white dark:bg-blue-500 dark:text-gray-100'
                    : 'bg-muted dark:bg-gray-700 dark:text-gray-200'
                }
              >
                <CardContent className="p-4 whitespace-pre-wrap text-sm font-mono">
                  <strong>{msg.role === 'user' ? '' : 'UI Sketch:'}</strong>
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
            </div>
          ))}
        </div>
      </div>

      <div className="border-t p-4 flex gap-2 items-center min-h-[60px]">
        {!isRecording
          ? (
          <>
            <Input
              value={input}
              onChange={(e) => { setInput(e.target.value) }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void handleSend()
                }
              }}
              placeholder={isTestMode ? 'Modo prueba activado...' : 'Describe tu interfaz Flutter...'}
              className="flex-1"
              disabled={isTestMode}
            />
            {isThinking
              ? (
              <Button variant="destructive" onClick={handleStop}>
                <StopCircle className="w-4 h-4 mr-2" />
                Detener
              </Button>
                )
              : (
              <Button
                onClick={handleTestResponse}
                disabled={isTestMode && !testJson.trim()}
              >
                {isTestMode ? 'Probar' : 'Enviar'}
              </Button>
                )}
          </>
            )
          : (
          <div className="flex-1 flex items-center justify-center gap-4">
            <AudioWaveLive />
          </div>
            )}

        {/* Micrófono */}
        {!isRecording && !isThinking && (
          <Button
            variant="ghost"
            size="icon"
            onClick={startRecording}
            title="Grabar audio"
          >
            <i className="fa fa-microphone" />
          </Button>
        )}

        {/* Controles mientras graba */}
        {isRecording && (
          <>
            <Button
              variant="destructive"
              size="icon"
              onClick={cancelRecording}
              title="Cancelar"
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={stopAndSendRecording}
              title="Detener y enviar"
            >
              <StopCircle className="w-4 h-4" />
            </Button>
          </>
        )}
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
