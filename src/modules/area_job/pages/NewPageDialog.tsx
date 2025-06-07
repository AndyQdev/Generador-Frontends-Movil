import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { toast } from 'sonner'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { type ButtonComponent } from '../models/Components'
import { type ComponentItem } from './page'
import { getSocket } from '@/lib/socket'

interface NewPageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeProjectId: string
  allButtons: Array<{
    id: string
    label: string
    pageIndex: number
    pageName: string
  }>
  onPageCreated: (newPage: any) => void
  onUpdatePages: (updatedPages: any[]) => void
  pages: any[]
}

export default function NewPageDialog({
  open,
  onOpenChange,
  activeProjectId,
  allButtons,
  onPageCreated,
  onUpdatePages,
  pages
}: NewPageDialogProps) {
  const [newName, setNewName] = useState('')
  const [selectedButtonId, setSelectedButtonId] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [genCode, setGenCode] = useState<string | null>(null)
  const dotsRef = useRef<NodeJS.Timeout | null>(null)

  const startDots = () => {
    let i = 0
    dotsRef.current = setInterval(() => {
      i = (i + 1) % 4
      setLoadingMsg(`🛠️ Generando boceto con IA${'.'.repeat(i)}`)
    }, 400)
  }

  const stopDots = () => {
    if (dotsRef.current) clearInterval(dotsRef.current)
    setLoadingMsg('')
  }

  const typeCode = (
    full: string,
    onComplete?: () => void,
    step = 2,
    delay = 10
  ) => {
    let idx = 0
    const int = setInterval(() => {
      if (idx <= full.length) {
        setGenCode(full.slice(0, idx))
        idx += step
      } else {
        clearInterval(int)
        onComplete?.()
      }
    }, delay)
  }

  const handleCreatePage = async () => {
    if (!newName.trim()) return
    setCreating(true)
    setIsGenerating(true)
    setPreviewUrl(null)
    startDots()
    try {
      // 1. Crear la página
      const pageData = {
        name: newName,
        background_color: '#ffffff',
        grid_enabled: true,
        device_mode: 'mobile',
        components: [],
        order: pages.length + 1
      }

      console.log('📝 Creando página:', pageData)

      const response = await fetch(`${API_BASEURL}${ENDPOINTS.PROJECTS}/${activeProjectId}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(pageData)
      })

      if (!response.ok) throw new Error('No se pudo crear la página')

      const { data: createdPage } = await response.json()
      console.log('✅ Página creada:', createdPage)

      // 2. Si hay imagen, procesarla
      if (selectedImage) {
        console.log('🖼️ Procesando imagen...')
        const imageFormData = new FormData()
        imageFormData.append('img', selectedImage)

        const imageResponse = await fetch(
          `${API_BASEURL}${ENDPOINTS.PROJECTS}/${activeProjectId}/pages/${createdPage.id}/process-image`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: imageFormData
          }
        )

        if (!imageResponse.ok) {
          throw new Error('No se pudo procesar la imagen')
        }

        const { data: updatedPage } = await imageResponse.json()
        console.log('✅ Imagen procesada correctamente:', updatedPage)

        // Actualizar la página creada con los componentes generados
        createdPage.components = updatedPage.components
      }

      stopDots()
      const pretty = JSON.stringify(createdPage.components ?? [], null, 2)

      typeCode(pretty, () => {
        if (selectedButtonId) {
          const updated = [...pages]
          for (const page of updated) {
            const btn = page.components.find(
              (c: ComponentItem) => c.type === 'button' && c.id === selectedButtonId
            ) as ButtonComponent | undefined
            if (btn) {
              console.log('🔗 Actualizando botón:', {
                buttonId: btn.id,
                newRoute: createdPage.id
              })
              btn.route = createdPage.id
              break
            }
          }
          onUpdatePages(updated)
        }

        onPageCreated(createdPage)

        // Emitir evento de creación de página
        const socket = getSocket()
        socket?.emit('page_created', {
          project_id: activeProjectId,
          page: createdPage
        })

        onOpenChange(false)
        setNewName('')
        setSelectedImage(null)
        setSelectedButtonId(null)
        toast.success('Página creada exitosamente')
      }, 8, 2)
    } catch (e) {
      stopDots()
      console.error('Error:', e)
      toast.error('No se pudo crear la página')
    } finally {
      setCreating(false)
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <AlertDialogHeader>
          <DialogTitle>Nueva página</DialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Nombre</label>
            <Input
              value={newName}
              onChange={e => { setNewName(e.target.value) }}
              placeholder="Página de inicio…"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Asociar a botón</label>
            <Select
              value={selectedButtonId ?? ''}
              onValueChange={(value) => { setSelectedButtonId(value) }}
            >
              <SelectTrigger className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                <SelectValue placeholder="Seleccionar botón..." />
              </SelectTrigger>
              <SelectContent>
                {allButtons.map((button) => (
                  <SelectItem key={button.id} value={button.id}>
                    {button.label} (Página: {button.pageName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Imagen de boceto (opcional)</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                setSelectedImage(file)

                if (file) {
                  const url = URL.createObjectURL(file)
                  setPreviewUrl(url)
                } else {
                  setPreviewUrl(null)
                }
              }}
            />
            <div className="mt-3 h-[300px] overflow-y-auto border rounded-md bg-muted p-2">
              {!isGenerating && previewUrl && (
                <img
                  src={previewUrl}
                  className="w-full max-h-full object-cover rounded"
                  alt="Previsualización del boceto"
                />
              )}

              {isGenerating && !genCode && (
                <p className="text-sm font-medium whitespace-pre-line">{loadingMsg}</p>
              )}

              {genCode && (
                <SyntaxHighlighter
                  language="json"
                  style={oneDark}
                  wrapLongLines
                  customStyle={{
                    fontSize: '0.75rem',
                    background: 'transparent',
                    margin: 0,
                    padding: 0
                  }}
                >
                  {genCode}
                </SyntaxHighlighter>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              disabled={creating || isGenerating}
              onClick={() => { onOpenChange(false) }}
              className="px-3 py-1.5 text-sm rounded border hover:bg-gray-100 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              disabled={creating}
              onClick={handleCreatePage}
              className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Guardar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
