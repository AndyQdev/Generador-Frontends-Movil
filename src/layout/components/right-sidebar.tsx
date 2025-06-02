// src/components/right-sidebar.tsx
import { useComponentContext } from '@/context/ComponentContext'
import { useState, useRef, useEffect } from 'react'
import ComponentsSection from './sections/ComponentsSection'
import ToolsSection from './sections/ToolsSection'
import BlocksSection from './sections/BlocksSection'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function RightSidebar() {
  const { selectedComponent } = useComponentContext()
  const [width, setWidth] = useState(270)
  const [isCollapsed, setIsCollapsed] = useState(false)
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
      if (isCollapsed) return
      const newWidth = window.innerWidth - e.clientX
      if (newWidth >= 270 && newWidth <= 600) {
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
  }, [isCollapsed])

  // const { resource: project } = useGetResource<Project>({ endpoint: ENDPOINTS.ULTIMO_PROJECT })
  // console.log('Pagina seleccionada: ', selectedPage)
  // console.log('Componente seleccionado:', selectedComponent)
  return (
    <div className="relative">
      {/* Botón de colapso */}
      <div className="absolute top-4 -left-10 z-50">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-background dark:bg-dark-background-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-md shadow-md"
        >
          {isCollapsed ? (
            <ChevronLeft className="w-5 h-5 text-light-text-primary dark:text-dark-text-primary" />
          ) : (
            <ChevronRight className="w-5 h-5 text-light-text-primary dark:text-dark-text-primary" />
          )}
        </Button>
      </div>

      <aside
        ref={sidebarRef}
        style={{ width: isCollapsed ? '0px' : `${width}px` }}
        className="hidden lg:flex flex-col dark:bg-[#111827] min-w-[0px] h-[100dvh] border-l bg-background overflow-y-auto relative"
      >
        {/* Resizer - siempre presente pero solo funcional cuando no está colapsado */}
        <div
          ref={resizerRef}
          className={`absolute top-0 left-0 w-1 h-full cursor-col-resize transition-colors ${
            !isCollapsed ? 'hover:bg-primary/50' : 'cursor-default'
          }`}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-8 bg-primary/30 rounded-full" />
        </div>

        {/* Contenido - oculto cuando está colapsado */}
        {!isCollapsed && (
          <div className="p-4">
            <ComponentsSection />
            <BlocksSection />
            {selectedComponent && <ToolsSection />}
          </div>
        )}
      </aside>
    </div>
  )
}
