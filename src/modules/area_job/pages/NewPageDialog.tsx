import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { API_BASEURL, ENDPOINTS } from '@/utils'
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
  setActiveLoadingImage: (image: { pageId: string, imageUrl: string } | null) => void
}

export default function NewPageDialog({
  open,
  onOpenChange,
  activeProjectId,
  allButtons,
  onPageCreated,
  setActiveLoadingImage
}: NewPageDialogProps) {
  const [newName, setNewName] = useState('')
  const [selectedButtonId, setSelectedButtonId] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleCreatePage = async () => {
    if (!newName.trim()) return
    setCreating(true)
    setIsGenerating(true)

    try {
      /* 1. Crea la página vacía en el backend */
      const pageData = { name: newName, background_color: '#ffffff', grid_enabled: true, device_mode: 'mobile', components: [] }
      const r = await fetch(`${API_BASEURL}${ENDPOINTS.PROJECTS}/${activeProjectId}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(pageData)
      })
      if (!r.ok) throw new Error('No se pudo crear la página')
      const { data: createdPage } = await r.json()

      /* 2. Procesar la imagen ------------- */
      if (selectedImage) {
        console.log('🖼️ Procesando imagen en backend…')
        const form = new FormData()
        form.append('img', selectedImage)
        const imgRes = await fetch(
          `${API_BASEURL}${ENDPOINTS.PROJECTS}/${activeProjectId}/pages/${createdPage.id}/process-image`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: form
          }
        )
        if (!imgRes.ok) throw new Error('No se pudo procesar la imagen')
        const { data: updatedPage } = await imgRes.json()

        // Cargar imagen en memoria para animación
        const url = URL.createObjectURL(selectedImage)

        // ⬇️ 1. Enviamos página con componentes ya cargados
        const pageWithComps = {
          ...updatedPage,
          loadingImage: url // <- sin `loading`, sin `progress`
        }
        onPageCreated(pageWithComps)

        // Emitir evento de creación de página
        const socket = getSocket()
        socket?.emit('page_created', {
          project_id: activeProjectId,
          page: pageWithComps
        })

        onOpenChange(false)

        // ⬇️ 2. Disparamos animación aparte
        setActiveLoadingImage({ pageId: updatedPage.id, imageUrl: url })
      } else {
        // Si no hay imagen, emitir evento con la página básica
        const socket = getSocket()
        socket?.emit('page_created', {
          project_id: activeProjectId,
          page: createdPage
        })
        onPageCreated(createdPage)
        onOpenChange(false)
      }

      toast.success('Página creada exitosamente')
      setNewName('')
      setSelectedImage(null)
      setSelectedButtonId(null)
    } catch (err) {
      console.error(err)
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

              {isGenerating && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm font-medium text-gray-500">Procesando con IA...</p>
                </div>
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
