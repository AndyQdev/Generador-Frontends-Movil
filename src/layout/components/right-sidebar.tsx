// src/components/right-sidebar.tsx
import { useComponentContext } from '@/context/ComponentContext'
import { useState, useRef, useEffect } from 'react'
import ComponentsSection from './sections/ComponentsSection'
import ToolsSection from './sections/ToolsSection'
import BlocksSection from './sections/BlocksSection'

export default function RightSidebar() {
  const { selectedComponent } = useComponentContext()
  const [width, setWidth] = useState(270)
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
  }, [])

  // const { resource: project } = useGetResource<Project>({ endpoint: ENDPOINTS.ULTIMO_PROJECT })
  // console.log('Pagina seleccionada: ', selectedPage)
  // console.log('Componente seleccionado:', selectedComponent)
  return (
    <aside
      ref={sidebarRef}
      style={{ width: `${width}px` }}
      className="hidden lg:flex flex-col dark:bg-[#111827] min-w-[270px] h-[100dvh] border-l bg-background p-4 overflow-hidden relative"
    >
      {/* Resizer */}
      <div
        ref={resizerRef}
        className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors"
      >
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-8 bg-primary/30 rounded-full" />
      </div>

      <ComponentsSection />
      <BlocksSection />
      {selectedComponent && <ToolsSection />}
    </aside>
  )
}
