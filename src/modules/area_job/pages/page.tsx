import { useEffect, useMemo, useRef, useState } from 'react'
import { useComponentContext } from '@/context/ComponentContext'
import { useHeader } from '@/hooks'
import { PrivateRoutes } from '@/models/routes.model'
import { API_BASEURL, ENDPOINTS, buildUrl } from '@/utils'
import { useGetResource, useUpdateResource, useDeleteResource } from '@/hooks/useApiResource'
import { type UpdateProject, type Project } from '@/modules/projects/models/project.model'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Canvas from './Canvas'
import { useParams } from 'react-router-dom'
import { connectSocket, getSocket } from '@/lib/socket'
import throttle from 'lodash.throttle'
import { type CardComponent, type BottomNavigationBarComponent, type ButtonComponent, type CheckListComponent, type DataTableComponent, type HeaderComponent, type InputComponent, type LabelComponent, type ListarComponent, type LoginComponent, type PaginationComponent, type RadioButtonComponent, type SearchComponent, type SelectComponent, type SidebarComponent, type TextAreaComponent, type ImagenComponent, type CalendarComponent, type IconComponent } from '../models/Components'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useProjectUsers } from '@/context/ProjectUsersContext'
import { deleteResource } from '@/services/crud.service'
import NewPageDialog from './NewPageDialog'

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
  | CheckListComponent
  | RadioButtonComponent
  | HeaderComponent
  | BottomNavigationBarComponent
  | CardComponent
  | TextAreaComponent
  | ImagenComponent
  | CalendarComponent
  | IconComponent

interface Page {
  id: string
  name: string
  order?: number
  background_color?: string
  grid_enabled?: boolean
  device_mode?: string
  components: ComponentItem[]
}

interface User {
  id: string
  name: string
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
    endpoint: areaId && areaId !== ':areaId' ? ENDPOINTS.PROJECTS : ENDPOINTS.ULTIMO_PROJECT,
    id: areaId && areaId !== ':areaId' ? areaId : ''
  })
  const [pages, setPages] = useState<Page[]>([
    { id: '1', name: 'Página 1', components: [] }
  ])
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const { setSelectedComponent, selectedComponent, selectedPage, setSelectedPage } = useComponentContext()
  const prevPagesLen = useRef(0)
  const [openDlg, setOpenDlg] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [pageToDelete, setPageToDelete] = useState<string | null>(null)
  const { setUsers } = useProjectUsers()
  const [, setUsersInProject] = useState<User[]>([])
  const { deleteResource } = useDeleteResource(ENDPOINTS.PROJECTS + '/pages/' + pageToDelete)

  // Estados para manejar el historial y el portapapeles
  const [history, setHistory] = useState<Page[][]>([pages])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [clipboard, setClipboard] = useState<ComponentItem | null>(null)
  const isHistoryUpdate = useRef(false)
  const lastPagesRef = useRef(pages)

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
      const token = localStorage.getItem('token')
      if (token) {
        const socket = connectSocket(token, activeProject.id)
        console.log('🔌 Conectando socket...')

        socket.on('usersInProject', (usersList: User[]) => {
          console.log('Usuarios en proyecto:', usersList)
          // Eliminar duplicados basados en el ID del usuario
          const uniqueUsers = Array.from(
            new Map(usersList.map(user => [user.id, user])).values()
          )
          setUsersInProject(uniqueUsers)
          setUsers(uniqueUsers)
        })

        socket.on('user_joined', (user: User) => {
          console.log('👋 Usuario conectado:', user)
          setUsersInProject(prev => {
            const exists = prev.some(u => u.id === user.id)
            if (!exists) {
              return [...prev, user]
            }
            return prev
          })
          setUsers(prev => {
            const exists = prev.some(u => u.id === user.id)
            if (!exists) {
              return [...prev, user]
            }
            return prev
          })
        })

        socket.on('user_left', (userId: string) => {
          console.log('👋 Usuario desconectado:', userId)
          setUsersInProject(prev => prev.filter(u => u.id !== userId))
          setUsers(prev => prev.filter(u => u.id !== userId))
        })

        socket.on('initial_state', (snapshot) => {
          console.log('📦 Estado inicial recibido:', snapshot)
          console.log('✅ Socket conectado correctamente:', socket.id)
        })

        socket.on('disconnect', (reason) => {
          console.log('⚠️ Socket desconectado:', reason)
          // Limpiar la lista de usuarios al desconectarse
          setUsersInProject([])
          setUsers([])
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
        return () => {
          socket.off('usersInProject')
          socket.off('user_joined')
          socket.off('user_left')
          socket.off('initial_state')
          socket.off('disconnect')
          socket.off('connect_error')
          socket.disconnect()
        }
      }
    }
  }, [activeProject?.id, setUsers])
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
    if (!activeProject?.id) return () => { } // no hace nada aún
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
    const xPercent = ((e.clientX - containerRect.left) / containerRect.width) * 100
    const yPercent = ((e.clientY - containerRect.top) / containerRect.height) * 100
    const widthPercent = (200 / containerRect.width) * 100
    const heightPercent = (50 / containerRect.height) * 100

    const newComponent = (() => {
      switch (type) {
        case 'button':
          return {
            id: Date.now().toString(),
            type: 'button',
            label: 'Botón',
            x: xPercent,
            y: yPercent,
            width: widthPercent,
            height: heightPercent,
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
            x: xPercent,
            y: yPercent,
            width: widthPercent,
            height: heightPercent,
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
            x: 0,
            y: 3,
            width: 100,
            height: (56 / containerRect.height) * 100,
            title: 'UI-SKETCH',
            color: '#2563eb',
            sidebar: {
              id: sidebarId,
              type: 'sidebar',
              title: 'UI-SKETCH',
              x: 0,
              y: 0,
              width: (256 / containerRect.width) * 100, // ✅ en porcentaje
              height: (700 / containerRect.height) * 100,
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
        case 'bottomNavigationBar':
          return {
            id: Date.now().toString(),
            type: 'bottomNavigationBar',
            x: 0,
            y: 100 - heightPercent,
            width: 100,
            height: heightPercent,
            backgroundColor: '#ffffff',
            activeColor: '#1976d2',
            inactiveColor: '#757575',
            borderRadious: 8,
            locked: true,
            items: [
              { icon: 'home', label: 'Inicio', route: '', isActive: true },
              { icon: 'search', label: 'Buscar', route: '', isActive: false },
              { icon: 'user', label: 'Perfil', route: '', isActive: false }
            ]
          }
        case 'select':
          return {
            id: Date.now().toString(),
            type: 'select',
            x: xPercent,
            y: yPercent,
            width: widthPercent,
            height: heightPercent,
            label: 'Seleccione una opción',
            options: ['Opción 1', 'Opción 2', 'Opción 3'],
            selectedOption: '',
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
        case 'datatable':
          return {
            id: Date.now().toString(),
            type: 'datatable',
            x: xPercent,
            y: yPercent,
            width: widthPercent,
            height: heightPercent,
            headers: ['ID', 'Nombre', 'Descripción'],
            rows: [
              ['1', 'Ejemplo A', 'Fila de prueba'],
              ['2', 'Ejemplo B', 'Otra fila'],
              ['3', 'Ejemplo C', 'Más datos']
            ],
            backgroundColor: '#ffffff'
          }
        case 'checklist':
          return {
            id: Date.now().toString(),
            type: 'checklist',
            label: 'Selecciona opciones',
            x: xPercent,
            y: yPercent,
            width: widthPercent,
            height: heightPercent,
            options: ['Opción 1', 'Opción 2', 'Opción 3'],
            selectedOptions: [],
            style: {
              backgroundColor: '#ffffff',
              textStyle: {
                fontSize: 14,
                color: '#111827'
              }
            }
          }

        case 'radiobutton':
          return {
            id: Date.now().toString(),
            type: 'radiobutton',
            label: 'Selecciona una opción',
            x: xPercent,
            y: yPercent,
            width: widthPercent,
            height: heightPercent,
            options: ['Opción A', 'Opción B', 'Opción C'],
            selectedOption: '',
            style: {
              backgroundColor: '#ffffff',
              textStyle: {
                fontSize: 14,
                color: '#111827'
              }
            }
          }
        case 'card':
          return {
            id: Date.now().toString(),
            type: 'card',
            x: xPercent,
            y: yPercent,
            width: (300 / containerRect.width) * 100,
            height: (300 / containerRect.height) * 100,
            title: 'Título de la tarjeta',
            content: 'Este es el contenido de la tarjeta.',
            style: {
              backgroundColor: '#ffffff',
              borderRadius: 8,
              padding: {
                top: 12,
                bottom: 12,
                left: 16,
                right: 16
              },
              textStyle: {
                fontSize: 14,
                color: '#111827'
              }
            }
          }

        case 'label':
          return {
            id: Date.now().toString(),
            type: 'label',
            x: xPercent,
            y: yPercent,
            width: widthPercent,
            height: heightPercent,
            text: 'Etiqueta de ejemplo',
            style: {
              textStyle: {
                fontSize: 16,
                fontWeight: 'medium',
                color: '#111827'
              }
            }
          }
        case 'textArea':
          return {
            id: Date.now().toString(),
            type: 'textArea',
            x: xPercent,
            y: yPercent,
            width: widthPercent,
            height: heightPercent * 2, // un poco más alto que input
            placeholder: 'Escriba un mensaje...',
            value: '',
            style: {
              backgroundColor: '#ffffff',
              borderRadius: 6,
              padding: {
                top: 8,
                bottom: 8,
                left: 10,
                right: 10
              },
              textStyle: {
                fontSize: 14,
                color: '#111827'
              }
            }
          }

        case 'imagen':
          return {
            id: Date.now().toString(),
            type: 'imagen',
            x: xPercent,
            y: yPercent,
            width: widthPercent - 10,
            height: heightPercent * 3,
            src: 'https://wallpapers.com/images/featured-full/imagenes-de-perfil-geniales-4co57dtwk64fb7lv.jpg', // imagen por defecto
            style: {
              borderRadius: 50
            }
          }
        case 'search':
          return {
            id: Date.now().toString(),
            type: 'search',
            x: xPercent,
            y: yPercent,
            width: widthPercent,
            height: heightPercent,
            placeholder: 'Buscar...',
            value: '',
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
        case 'icon':
          return {
            id: Date.now().toString(),
            type: 'icon',
            icon: 'star', // ícono por defecto
            x: xPercent,
            y: yPercent,
            width: (48 / containerRect.width) * 100, // 48 px convertidos a %
            height: (48 / containerRect.height) * 100, // 48 px convertidos a %
            color: '#2563eb', // color de trazo inicial
            size: 24 // tamaño interno si tu renderer lo usa
          }
        case 'calendar':
          return {
            id: Date.now().toString(),
            type: 'calendar',
            x: xPercent,
            y: yPercent,
            width: widthPercent,
            height: heightPercent,
            selectedDate: new Date().toISOString().split('T')[0], // hoy
            style: {
              backgroundColor: '#ffffff',
              borderRadius: 6,
              textStyle: {
                fontSize: 14,
                color: '#111827'
              }
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
      if (isComponentItem(newComponent)) {
        updatedPages[pageIndex].components.push(newComponent)
        setPages(updatedPages)
        addToHistory(updatedPages)
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
    addToHistory(updatedPages)
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

  const handleDeletePage = (pageId: string) => {
    setPageToDelete(pageId)
    setShowDeleteConfirm(true)
  }

  const confirmDeletePage = async () => {
    if (!pageToDelete) return
    try {
      await deleteResource(pageToDelete)

      setPages(prevPages => {
        const updatedPages = prevPages.filter(p => p.id !== pageToDelete)
        // Si la página eliminada era la actual, seleccionar la primera página disponible
        if (currentPageIndex >= updatedPages.length) {
          setCurrentPageIndex(0)
        }
        return updatedPages
      })

      // Actualizar el proyecto en el servidor
      if (activeProject) {
        await updateProject(
          {
            id: activeProject.id,
            create_date: activeProject.create_date,
            name: activeProject.name,
            descripcion: activeProject.descripcion,
            status: activeProject.status,
            last_modified: new Date(),
            pages: pages.filter(p => p.id !== pageToDelete)
          }
        )
        if (mutate) {
          void mutate()
        }
        if (mutateId) {
          void mutateId()
        }
      }

      toast.success('Página eliminada exitosamente')
    } catch (error) {
      console.error('Error al eliminar la página:', error)
      toast.error('Error al eliminar la página')
    } finally {
      // Limpiar el estado
      setShowDeleteConfirm(false)
      setPageToDelete(null)
      setSelectedComponent(null)
      if (setSelectedPage) {
        setSelectedPage(null)
      }
    }
  }

  const cancelDeletePage = () => {
    setShowDeleteConfirm(false)
    setPageToDelete(null)
  }

  // Función para agregar un nuevo estado al historial
  const addToHistory = (newPages: Page[]) => {
    if (isHistoryUpdate.current) return
    if (JSON.stringify(lastPagesRef.current) === JSON.stringify(newPages)) return

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(structuredClone(newPages))
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    lastPagesRef.current = structuredClone(newPages)
  }

  // Función para deshacer (Ctrl+Z)
  const handleUndo = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault()
      if (historyIndex > 0) {
        isHistoryUpdate.current = true
        const newIndex = historyIndex - 1
        const previousState = structuredClone(history[newIndex])
        const socket = getSocket()
  
        setHistoryIndex(newIndex)
        setPages(previousState)
  
        if (socket) {
          syncPagesDiff(lastPagesRef.current, previousState, activeProject?.id, socket)
        }
  
        lastPagesRef.current = previousState
        setTimeout(() => {
          isHistoryUpdate.current = false
        }, 0)
      }
    }
  }
  

  const syncPagesDiff = (
    prevPages: Page[],
    nextPages: Page[],
    projectId: string | undefined,
    socket: any
  ) => {
    const prevMap = new Map<string, { pageId: string; comp: ComponentItem }>()
    const nextMap = new Map<string, { pageId: string; comp: ComponentItem }>()
  
    for (const page of prevPages) {
      for (const comp of page.components) {
        prevMap.set(comp.id, { pageId: page.id, comp })
      }
    }
  
    for (const page of nextPages) {
      for (const comp of page.components) {
        nextMap.set(comp.id, { pageId: page.id, comp })
      }
    }
  
    // Detectar eliminados (estaban antes, ya no están)
    for (const [id, { pageId }] of prevMap) {
      if (!nextMap.has(id)) {
        socket.emit('component_deleted', {
          project_id: projectId,
          page_id: pageId,
          component: { id }
        })
      }
    }
  
    // Detectar agregados (no estaban antes)
    for (const [id, { pageId, comp }] of nextMap) {
      if (!prevMap.has(id)) {
        socket.emit('component_created', {
          project_id: projectId,
          page_id: pageId,
          component: comp
        })
      }
    }
  
    // Detectar cambios en componentes existentes
    for (const [id, { pageId, comp }] of nextMap) {
      if (prevMap.has(id)) {
        const prevComp = prevMap.get(id)!.comp
        if (JSON.stringify(prevComp) !== JSON.stringify(comp)) {
          socket.emit('component_props_changed', {
            project_id: projectId,
            page_id: pageId,
            component: comp,
            origin: socket.id
          })
        }
      }
    }
  }
  
  // Función para rehacer (Ctrl+Y)
  const handleRedo = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault()
      if (historyIndex < history.length - 1) {
        isHistoryUpdate.current = true
        const newIndex = historyIndex + 1
        const nextState = structuredClone(history[newIndex])
        const socket = getSocket()
  
        setHistoryIndex(newIndex)
        setPages(nextState)
  
        if (socket) {
          syncPagesDiff(lastPagesRef.current, nextState, activeProject?.id, socket)
        }
  
        lastPagesRef.current = nextState
        setTimeout(() => {
          isHistoryUpdate.current = false
        }, 0)
      }
    }
  }
  
  

  // Función para copiar (Ctrl+C)
  const handleCopy = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'c' && selectedComponent) {
      e.preventDefault()
      setClipboard(structuredClone(selectedComponent))
      toast.success('Componente copiado al portapapeles', {
        style: {
          backgroundColor: '#FFD700', // amarillo dorado
          color: '#000'               // texto negro para buen contraste
        },
        icon: '📋'
      })
    }
  }

  // Función para pegar (Ctrl+V)
  const handlePaste = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'v' && clipboard) {
      e.preventDefault()
      const newComponent = {
        ...structuredClone(clipboard),
        id: Date.now().toString(),
        x: clipboard.x + 10, // Desplazar ligeramente para que sea visible
        y: clipboard.y + 10
      }

      const updatedPages = structuredClone(pages)
      updatedPages[currentPageIndex].components.push(newComponent)
      setPages(updatedPages)
      addToHistory(updatedPages)
      const socket = getSocket()
      // Emitir el evento de creación del componente al socket
      if (socket) {
        socket.emit('component_created', {
          project_id: activeProject?.id,
          page_id: pages[currentPageIndex].id,
          component: newComponent
        })
      }

      toast.success('Componente pegado')
    }
  }

  // Efecto para manejar los eventos del teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleUndo(e)
      handleRedo(e)
      handleCopy(e)
      handlePaste(e)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [historyIndex, history, selectedComponent, clipboard, currentPageIndex])

  // Efecto para actualizar el historial cuando cambian las páginas
  useEffect(() => {
    if (!isHistoryUpdate.current) {
      addToHistory(pages)
    }
  }, [pages])

  // Efecto para inicializar el historial
  useEffect(() => {
    if (activeProject?.pages) {
      const initialPages = structuredClone(activeProject.pages)
      setHistory([initialPages])
      setHistoryIndex(0)
      lastPagesRef.current = initialPages
    }
  }, [activeProject?.pages])

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <AlertDialogHeader>
            <DialogTitle>Eliminar página</DialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <p>¿Estás seguro de que deseas eliminar esta página? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={cancelDeletePage}
                className="px-3 py-1.5 text-sm rounded border hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeletePage}
                className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reemplazar el diálogo de Nueva Página con el nuevo componente */}
      <NewPageDialog
        open={openDlg}
        onOpenChange={setOpenDlg}
        activeProjectId={activeProject?.id ?? ''}
        allButtons={allButtons}
        onPageCreated={(newPage) => {
          setPages(prev => [...prev, newPage])
        }}
        onUpdatePages={setPages}
        pages={pages}
      />

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
        onDeletePage={handleDeletePage}
      />
    </div>
  )
}
