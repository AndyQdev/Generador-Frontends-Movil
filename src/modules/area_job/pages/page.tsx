import { useEffect, useMemo, useRef, useState } from 'react'
import { useComponentContext } from '@/context/ComponentContext'
import { useHeader } from '@/hooks'
import { PrivateRoutes } from '@/models/routes.model'
import { API_BASEURL, ENDPOINTS } from '@/utils'
import { useCreateResource, useGetResource, useUpdateResource } from '@/hooks/useApiResource'
import { type UpdateProject, type Project } from '@/modules/projects/models/project.model'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { HexColorPicker } from 'react-colorful'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Canvas from './Canvas'
import { useParams } from 'react-router-dom'
import { connectSocket, getSocket } from '@/lib/socket'
import throttle from 'lodash.throttle'
import { type ButtonComponent, type ChecklistComponent, type DataTableComponent, type HeaderComponent, type InputComponent, type LabelComponent, type ListarComponent, type LoginComponent, type PaginationComponent, type RadioButtonComponent, type SearchComponent, type SelectComponent, type SidebarComponent } from '../models/Components'

export type ComponentItem =
  | ButtonComponent
  | InputComponent
  | SidebarComponent
  | DataTableComponent
  | LabelComponent
  | SearchComponent
  | PaginationComponent
  | ListarComponent
  | LoginComponent
  | SelectComponent
  | ChecklistComponent
  | RadioButtonComponent
  | HeaderComponent

interface Page {
  id: string
  name: string
  order?: number
  background_color?: string
  grid_enabled?: boolean
  device_mode?: string
  components: ComponentItem[]
}
interface CreatePage {
  name: string
  background_color?: string
  components: ComponentItem[]
}
export default function Editor() {
  useHeader([
    { label: 'Espacio de Trabajo', path: PrivateRoutes.AREA }
  ])
  const { areaId } = useParams()
  const [activeProject, setActiveProject] = useState<Project | undefined>(undefined)
  const { resource: project, mutate } = useGetResource<Project>({ endpoint: ENDPOINTS.ULTIMO_PROJECT })
  const { updateResource: updateProject } = useUpdateResource<UpdateProject>(ENDPOINTS.PROJECTS)
  const { resource: projectId, mutate: mutateId } = useGetResource<Project>({
    endpoint: areaId && areaId !== ':areaId' ? ENDPOINTS.PROJECTS : ENDPOINTS.ULTIMO_PROJECT, // si no es valido, no busca nada
    id: areaId && areaId !== ':areaId' ? areaId : ''
  })
  const { createResource: createPage } = useCreateResource<CreatePage>({
    endpoint: ENDPOINTS.PROJECTS + '/' + activeProject?.id + '/pages'
  })
  const [pages, setPages] = useState<Page[]>([
    { id: '1', name: 'Página 1', components: [] }
  ])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const { setSelectedComponent, selectedComponent, selectedPage } = useComponentContext()
  const prevPagesLen = useRef(0)
  const [openDlg, setOpenDlg] = useState(false)
  const [newName, setNewName] = useState('')
  const [newBg, setNewBg] = useState('#ffffff')
  const [creating, setCreating] = useState(false)
  const [selectedButtonId, setSelectedButtonId] = useState<string | null>(null)
  useEffect(() => {
    if (!activeProject) return
    setPages(activeProject.pages ?? [])
  }, [activeProject])
  // ➋  Observa cambios de longitud
  useEffect(() => {
    if (areaId && areaId !== ':areaId') {
      if (projectId) {
        setActiveProject(projectId)
      }
    } else {
      if (project) {
        setActiveProject(project)
      }
    }
  }, [areaId, projectId, project])
  useEffect(() => {
    if (pages.length > prevPagesLen.current) {
      // se añadió al menos 1 página → ve a la última
      setCurrentPageIndex(pages.length - 1)
    }
    prevPagesLen.current = pages.length
  }, [pages])

  useEffect(() => {
    if (!selectedPage) return

    setPages(prevPages => {
      const updatedPages = structuredClone(prevPages)
      const pageIndex = updatedPages.findIndex(p => p.id === selectedPage.id)

      if (pageIndex !== -1) {
        updatedPages[pageIndex] = selectedPage
      }

      return updatedPages
    })
  }, [selectedPage])
  function isComponentItem(obj: any): obj is ComponentItem {
    return obj && typeof obj === 'object' && 'id' in obj && 'type' in obj
  }
  useEffect(() => {
    if (activeProject?.id) {
      const token = localStorage.getItem('token') // o usa tu contexto de auth
      if (token) {
        const socket = connectSocket(token, activeProject.id)
        console.log('🔌 Conectando socket...')
        socket.on('initial_state', (snapshot) => {
          console.log('📦 Estado inicial recibido:', snapshot)
          console.log('✅ Socket conectado correctamente:', socket.id)
        })
        socket.on('disconnect', (reason) => {
          console.log('⚠️ Socket desconectado:', reason)
        })

        socket.on('connect_error', (error) => {
          console.error('❌ Error de conexión Socket:', error)
        })
        socket.on('component_created', (data) => {
          console.log('🟢 Nuevo componente:', data)
          const { page_id: pageId, component } = data

          setPages(prevPages => {
            const pagesCopy = structuredClone(prevPages)
            const page = pagesCopy.find(p => p.id === pageId)
            if (page) {
              if (isComponentItem(component)) { // Verifica que el componente sea válido
                page.components.push(component)
              } else {
                console.error('El componente recibido no es válido:', component)
              }
            }
            return pagesCopy
          })
        })

        socket.on('component_updated', (data) => {
          console.log('🟡 Componente actualizado:', data)
          const { page_id: pageId, component } = data

          setPages(prevPages => {
            const pagesCopy = structuredClone(prevPages)
            const page = pagesCopy.find(p => p.id === pageId)
            if (page) {
              const idx = page.components.findIndex(c => c.id === component.id)
              if (idx !== -1) {
                page.components[idx] = component
              }
            }
            return pagesCopy
          })
        })

        socket.on('component_deleted', (data) => {
          console.log('🔴 Componente eliminado:', data)
          const { page_id: pageId, component } = data

          setPages(prevPages => {
            const pagesCopy = structuredClone(prevPages)
            const page = pagesCopy.find(p => p.id === pageId)
            if (page) {
              page.components = page.components.filter(c => c.id !== component.id)
            }
            return pagesCopy
          })
        })
        socket.on('component_moving', ({ page_id: pageId, component, origin }) => {
          if (origin === socket.id) return // ignora tu propio drag
          setPages(pages => {
            const next = structuredClone(pages)
            const page = next.find(p => p.id === pageId)
            if (!page) return pages
            const idx = page.components.findIndex(c => c.id === component.id)
            if (idx !== -1) {
              page.components[idx].x = component.x
              page.components[idx].y = component.y
            }
            return next
          })
        })

        socket.on('component_resizing', ({ page_id: pageId, component, origin }) => {
          if (origin === socket.id) return
          setPages(pages => {
            const next = structuredClone(pages)
            const page = next.find(p => p.id === pageId)
            if (!page) return pages
            const idx = page.components.findIndex(c => c.id === component.id)
            if (idx !== -1) {
              Object.assign(page.components[idx], component)
            }
            return next
          })
        })
        socket.on('component_props_changed', ({ page_id: pageId, component, origin }) => {
          if (origin === socket.id) return // ignora tu propio eco

          setPages(prev => {
            const next = structuredClone(prev)
            const page = next.find(p => p.id === pageId)
            if (!page) return prev

            const idx = page.components.findIndex(c => c.id === component.id)
            if (idx !== -1) {
              page.components[idx] = { ...page.components[idx], ...component }
            }
            return next
          })
        })
      }
    }
  }, [activeProject?.id])
  const onSubmit = () => {
    toast.promise(updateProject(
      {
        id: activeProject?.id ?? '',
        create_date: activeProject?.create_date ?? new Date(),
        name: activeProject?.name ?? '',
        descripcion: activeProject?.descripcion ?? '',
        status: activeProject?.status ?? 'En proceso',
        last_modified: new Date(),
        pages
      }
    ), {
      loading: 'Guardando Cambios...',
      success: () => {
        if (mutate) {
          void mutate() // solo si quieres mutar la lista general
        }
        if (mutateId) {
          void mutateId() // solo si quieres mutar el proyecto específico
        }
        return 'Cambios guardados exitosamente'
      },
      error: 'Error al guardar los cambios'
    })
  }
  const throttledEmit = useMemo(() => {
    if (!activeProject?.id) return () => {} // no hace nada aún
    return throttle((component: ComponentItem) => {
      const socket = getSocket()
      if (!socket) return
      socket.emit('component_props_changed', {
        project_id: activeProject.id, // ✅ siempre definido
        page_id: pages[currentPageIndex]?.id,
        component,
        origin: socket.id
      })
    }, 120)
  }, [activeProject?.id, currentPageIndex, pages])
  useEffect(() => {
    if (!selectedComponent) return

    // 1. actualizas el estado local (tal como ya hacías)
    const updatedPages = [...pages]
    const comps = updatedPages[currentPageIndex].components
    const idx = comps.findIndex(c => c.id === selectedComponent.id)
    if (idx !== -1) {
      comps[idx] = selectedComponent
      setPages(updatedPages)
    }

    throttledEmit(selectedComponent)
  }, [selectedComponent])
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, pageId: string, scale: number) => {
    const socket = getSocket()

    e.preventDefault()
    const type = e.dataTransfer.getData('component/type')
    const containerRect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - containerRect.left) / scale
    const y = (e.clientY - containerRect.top) / scale
    const newComponent = (() => {
      switch (type) {
        case 'button':
          return {
            id: Date.now().toString(),
            type: 'button',
            label: 'Botón',
            x,
            y,
            width: 200,
            height: 50,
            style: {
              backgroundColor: '#2563eb',
              borderRadius: 8,
              padding: {
                top: 8,
                bottom: 8,
                left: 12,
                right: 12
              },
              textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#ffffff'
              }
            }
          }
        case 'input':
          return {
            id: Date.now().toString(),
            type: 'input',
            placeholder: 'Escribir placeholder...',
            x,
            y,
            width: 200,
            height: 40,
            style: {
              backgroundColor: '#ffffff',
              borderRadius: 6,
              padding: {
                top: 6,
                bottom: 6,
                left: 10,
                right: 10
              },
              textStyle: {
                fontSize: 14,
                color: '#111827'
              }
            }
          }
        case 'header':
          // eslint-disable-next-line no-case-declarations
          const sidebarId = Date.now().toString() + '-sb'
          return {
            id: Date.now().toString(),
            type: 'header',
            x,
            y,
            width: 390,
            height: 56,
            title: 'UI-SKETCH',
            color: '#2563eb',
            sidebar: {
              id: sidebarId,
              type: 'sidebar',
              title: 'UI-SKETCH',
              x: 0,
              y: 0,
              width: 256,
              height: 700,
              mainColor: '#2563eb',
              asideBg: '#ffffff',
              select: 0,
              sections: [
                { icon: 'home', label: 'Inicio', route: '' },
                { icon: 'file', label: 'Docs', route: '' },
                { icon: 'cog', label: 'Config', route: '' }
              ]
            }
          }
        default:
          throw new Error(`Tipo de componente desconocido: ${type}`)
      }
    })()
    console.log('🟢 Componente creado:', newComponent)
    socket?.emit('component_created', {
      project_id: activeProject?.id,
      page_id: pageId,
      component: newComponent
    })
    const updatedPages = [...pages]
    const pageIndex = updatedPages.findIndex((p) => p.id === pageId)
    if (pageIndex !== -1) {
      if (isComponentItem(newComponent)) { // Verifica que el componente sea válido
        updatedPages[pageIndex].components.push(newComponent)
        setPages(updatedPages)
      } else {
        console.error('El componente no es válido:', newComponent)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const updateComponent = (
    pageIndex: number,
    compIndex: number,
    updated: ComponentItem
  ) => {
    setPages(prev => {
      const clone = structuredClone(prev)
      clone[pageIndex].components[compIndex] = updated
      return clone
    })
  }

  const handleCreatePage = async () => {
    if (!newName.trim()) return // nombre vacío

    setCreating(true)
    try {
      // Crear la nueva página
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      const newPage: any = await createPage({
        name: newName,
        background_color: newBg,
        components: []
      })
      if (newPage !== undefined && newPage !== null) {
        // Actualizar el botón seleccionado con el ID de la nueva página
        if (selectedButtonId) {
          const updatedPages = [...pages]
          for (const page of updatedPages) {
            const button = page.components.find(
              (comp) => comp.type === 'button' && comp.id === selectedButtonId
            ) as ButtonComponent | undefined
            if (button) {
              button.route = newPage.id // Usar el ID de la página creada
              break
            }
          }
          setPages(updatedPages)
        }

        setPages([...pages, newPage]) // Agregar la nueva página a la lista de páginas
        setOpenDlg(false)
        setNewName('')
        setSelectedButtonId(null) // Limpiar selección
        toast.success('Página creada')
      }
    } catch (e) {
      toast.error('No se pudo crear la página')
    } finally {
      setCreating(false)
    }
  }

  const [, setSelectedComponentId] = useState<string | null>(null)
  const handleDeleteComponent = (id: string) => {
    const updatedPages = [...pages]
    updatedPages[currentPageIndex].components = updatedPages[currentPageIndex].components.filter(
      (c) => c.id !== id
    )
    const socket = getSocket()

    socket?.emit('component_deleted', {
      project_id: activeProject?.id,
      page_id: pages[currentPageIndex]?.id,
      component: { id }
    })
    setPages(updatedPages)
    setSelectedComponentId(null)
  }
  // Obtener todos los botones de todas las páginas
  const allButtons = pages.flatMap((page, pageIndex) =>
    page.components
      .filter((comp) => comp.type === 'button')
      .map((button) => ({
        id: button.id,
        label: button.label,
        pageIndex,
        pageName: page.name
      }))
  )

  const handleExport = async () => {
    try {
      const response = await fetch(`${API_BASEURL}${ENDPOINTS.PROJECTS}/${activeProject?.id}/download`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Asegúrate de enviar el token si es necesario
        }
      })

      if (!response.ok) {
        throw new Error('Error al descargar el archivo')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'frontend-angular.zip' // Nombre del archivo descargado
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Archivo descargado exitosamente')
    } catch (error) {
      console.error(error)
      toast.error('Error al descargar el archivo')
    }
  }
  const currentPage = pages[currentPageIndex] ?? null

  return (
    <div className="flex flex-col h-screen w-full">

    {/* ------------ Diálogo Crear página ------------- */}
    <Dialog open={openDlg} onOpenChange={setOpenDlg}>
      <DialogContent>
        <AlertDialogHeader>
          <DialogTitle>Nueva página</DialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Nombre</label>
            <Input
              value={newName}
              onChange={e => { setNewName(e.target.value) }}
              placeholder="Página de inicio…"
            />
          </div>

          {/* Selector de color */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Color de fondo</label>

            {/* preview + código */}
            <div className="flex items-center gap-3">
              <span
                className="block w-8 h-8 rounded border"
                style={{ backgroundColor: newBg }}
              />
              <code className="text-sm">{newBg}</code>
            </div>

            {/* Color picker */}
            <HexColorPicker color={newBg} onChange={setNewBg} className="rounded-md shadow" />
          </div>
          {/* Selector de botón */}
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
                {/* <SelectItem value="">Seleccionar botón...</SelectItem> */}
                {allButtons.map((button) => (
                  <SelectItem key={button.id} value={button.id}>
                    {button.label} (Página: {button.pageName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => { setOpenDlg(false) }}
              className="px-3 py-1.5 text-sm rounded border hover:bg-gray-100"
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
      {/* Lienzo */}
      <Canvas
        pages={pages}
        current={currentPage}
        onSelectPage={(id) => {
          const index = pages.findIndex((p) => p.id === id)
          if (index !== -1) setCurrentPageIndex(index)
        }}
        currentProjectId={activeProject?.id ?? ''}
        setSelectedComponent={setSelectedComponent}
        updateComponent={updateComponent}
        handleDeleteComponent={handleDeleteComponent}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onSubmit={onSubmit}
        handleExport={handleExport}
        setOpenDlg={setOpenDlg}
      />
    </div>
  )
}
