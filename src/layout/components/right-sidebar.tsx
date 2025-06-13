// src/components/right-sidebar.tsx
import { useComponentContext } from '@/context/ComponentContext'
import { useState, useRef, useEffect } from 'react'
import ComponentsSection from './sections/ComponentsSection'
import ToolsSection from './sections/ToolsSection'
import BlocksSection from './sections/BlocksSection'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

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
      {isCollapsed && (
        <div className="absolute top-4 left-[-40px] z-50 lg:left-[-40px] sm:left-[-36px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setIsCollapsed(false) }}
            className="bg-background dark:bg-dark-background-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-md shadow-md"
          >
            <ChevronLeft className="w-5 h-5 text-light-text-primary dark:text-dark-text-primary" />
          </Button>
        </div>
      )}

      <aside
        ref={sidebarRef}
        style={{
          width: isCollapsed ? '0px' : `${width}px`,
          transform: isCollapsed ? 'translateX(100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease-in-out'
        }}
        className={`fixed lg:static right-0 top-0 h-full z-40 bg-background dark:bg-[#111827] border-l overflow-y-auto flex flex-col ${
          isCollapsed ? 'pointer-events-none' : ''
        }`}
      >
        {!isCollapsed && (
          <div className="absolute -top-2 -right-3 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { setIsCollapsed(true) }}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              <span className="sr-only">Cerrar sidebar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-light-text-primary dark:text-dark-text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        )}
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
