import { useState, useRef, useEffect } from 'react'
import { MessageCircle, SendHorizonal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import clsx from 'clsx'
import Draggable from 'react-draggable'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function IAFloatChat() {
  /* ─── Estado ─────────────────────────────── */
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState('') // texto animado
  const bottomRef = useRef<HTMLDivElement>(null) // ⬇️ auto-scroll

  /* ─── Auto-scroll cada vez que cambia el chat ─── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  /* ─── Enviar pregunta ─────────────────────── */
  const handleSend = async () => {
    if (!question.trim() || loading) return
    const userMsg: ChatMessage = { role: 'user', content: question.trim() }
    setMessages(prev => [...prev, userMsg])
    setQuestion('')
    setLoading(true)
    setTyping('') // limpiamos animación previa

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ia/help`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ question: userMsg.content })
      })

      const { answer = '❌ Sin respuesta' } = await res.json()

      /* ── animar letra por letra ───────────────── */
      let i = 0
      const id = setInterval(() => {
        i++
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setTyping(answer.slice(0, i))
        if (i >= answer.length) {
          clearInterval(id)
          setMessages(prev => [...prev, { role: 'assistant', content: answer }])
          setTyping('')
          setLoading(false)
        }
      }, 18)
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '❌ Error al contactar al asistente.' }
      ])
      setLoading(false)
    }
  }

  /* ─── Enter = enviar  ─────────────────────── */
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  /* ─── Render ──────────────────────────────── */
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* FAB --------------------------------------------------------- */}
      {!open && (
        <Draggable>
            <div className="cursor-move">
                <Button
                    onClick={() => { setOpen(true) }}
                    className="rounded-full p-4 shadow-lg bg-primary text-white w-13 h-13"
                >
                    <MessageCircle className="w-14 h-14" />
                </Button>
            </div>
        </Draggable>
      )}

      {/* Ventana del chat ------------------------------------------- */}
      {open && (
        <div className="w-[400px] h-[550px] bg-white dark:bg-zinc-900 rounded-lg shadow-2xl flex flex-col">

          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b border-zinc-200 dark:border-zinc-700">
            <strong>Asistente IA</strong>
            <button onClick={() => { setOpen(false); setMessages([]) }}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Historial ------------------------------------------------ */}
          <div className="flex-1 overflow-y-auto flex flex-col space-y-2 p-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={clsx(
                  'max-w-[75%] px-3 py-2 rounded-lg text-sm whitespace-pre-wrap',
                  m.role === 'assistant'
                    ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-50 self-start'
                    : 'bg-blue-500 text-white self-end')
                }
              >
                {m.content}
              </div>
            ))}

            {/* Bubble “escribiendo…” -------------------------------- */}
            {loading && (
              <div className="max-w-[75%] px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 self-start text-sm flex items-center gap-1">
                {/* texto que se va completando */}
                <span>{typing}</span>
                {/* tres puntos animados al final */}
                <span className="inline-flex">
                  <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:0s]" />
                  <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:.15s] mx-0.5" />
                  <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:.3s]" />
                </span>
              </div>
            )}
            {/* ancla invisible para el scroll ↓ */}
            <div ref={bottomRef} />
          </div>

          {/* Input --------------------------------------------------- */}
          <div className="border-t border-zinc-200 dark:border-zinc-700 p-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Escribe una pregunta..."
                className="text-sm h-10 flex-1"
                value={question}
                onChange={e => { setQuestion(e.target.value) }}
                onKeyDown={onKeyDown}
              />
              <Button
                size="icon"
                className="h-10 w-10 p-2"
                onClick={handleSend}
                disabled={loading || !question.trim()}
              >
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
