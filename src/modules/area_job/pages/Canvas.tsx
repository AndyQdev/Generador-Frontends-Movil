// Canvas.tsx
import { useRef, useState, useCallback, useEffect } from 'react'
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import PageFrame from './PageFrame' // tu frame con Rnd dentro
import Toolbar from './Toolbar' // barra inferior
import { type Page } from '@/modules/projects/models/page.model'
import { type ComponentItem } from './page'
import { type Device, DEVICES } from '../utils/devices'
import { type UserSelection } from './page'

interface CanvasProps {
  pages: Page[] // Lista de páginas
  current: Page | null
  onSelectPage: (id: string | null) => void // acepta null
  setSelectedComponent: (component: ComponentItem | null) => void // Función para seleccionar un componente
  updateComponent: (
    pageIndex: number,
    compIndex: number,
    updated: ComponentItem
  ) => void
  handleDeleteComponent: (id: string) => void // Función para eliminar un componente
  onDrop: (e: React.DragEvent<HTMLDivElement>, id: string, scale: number) => void // Función para manejar el evento de soltar un componente
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void // Función para manejar el evento de arrastrar un componente
  onSubmit: () => void // Función para guardar
  handleExport: () => void // Función para exportar
  setOpenDlg: (open: boolean) => void
  currentProjectId: string
  onDeletePage?: (pageId: string) => void // Nueva prop para eliminar página
  userSelections: UserSelection[]
}

export default function Canvas({
  pages,
  current,
  onSelectPage,
  setSelectedComponent,
  updateComponent,
  handleDeleteComponent,
  onDragOver,
  onDrop,
  onSubmit,
  handleExport,
  setOpenDlg,
  currentProjectId,
  onDeletePage,
  userSelections
}: CanvasProps) {
  const [mode, setMode] = useState<'select' | 'hand'>('select')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [device, setDevice] = useState<Device>(DEVICES[0])
  const api = useRef<ReactZoomPanPinchRef | null>(null)
  const isCtrlPressed = useRef(false)

  // Efecto para manejar el estado de la tecla Ctrl
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        isCtrlPressed.current = true
        if (wrapperRef.current) {
          wrapperRef.current.style.cursor = 'grab'
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        isCtrlPressed.current = false
        if (wrapperRef.current) {
          wrapperRef.current.style.cursor = 'default'
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  /* ——— Zoom con Ctrl + wheel ——— */
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const { deltaY, ctrlKey } = e

      // ---------------  ZOOM  Ctrl + Wheel ---------------
      if (ctrlKey) {
        e.preventDefault()
        e.stopPropagation()
        // deltaY negativo -> zoom‑in, positivo -> zoom‑out
        if (deltaY < 0) api.current?.zoomIn()
        else api.current?.zoomOut()
        return
      }

      // ---------------  SCROLL VERTICAL normal -----------
      if (wrapperRef.current) {
        wrapperRef.current.scrollBy({
          top: deltaY,
          behavior: 'auto'
        })
      }
    },
    []
  )

  // Manejador para el evento de mouse
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isCtrlPressed.current) {
      e.preventDefault()
      setMode('hand')
      if (wrapperRef.current) {
        wrapperRef.current.style.cursor = 'grabbing'
      }
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    if (isCtrlPressed.current) {
      setMode('select')
      if (wrapperRef.current) {
        wrapperRef.current.style.cursor = 'grab'
      }
    }
  }, [])

  useEffect(() => {
    if (mode === 'hand' && wrapperRef.current) {
      wrapperRef.current.style.overflow = 'hidden'
    } else if (wrapperRef.current) {
      wrapperRef.current.style.overflow = 'auto'
    }
  }, [mode])

  return (
    <div className="w-full h-full bg-neutral-900 relative">
      <TransformWrapper
        onInit={(ref) => { api.current = ref }}
        minScale={0.25}
        maxScale={2}
        initialScale={1}
        centerOnInit={true}
        centerZoomedOut={true}
        onZoomStart={() => {
          setSelectedComponent(null)
          onSelectPage(null)
        }}
        wheel={{
          step: 30,
          activationKeys: ['Control']
        }}
        panning={{ disabled: mode !== 'hand', velocityDisabled: true }}
        doubleClick={{ disabled: true }}
        onPanningStart={() => {
          document.body.style.cursor = 'grabbing'
        }}
        onPanningStop={() => {
          document.body.style.cursor = isCtrlPressed.current ? 'grab' : 'default'
        }}
      >
        {({ zoomIn, zoomOut, resetTransform, instance }) => {
          const scale = instance.transformState.scale
          const deselect = () => {
            setSelectedComponent(null)
            onSelectPage(null)
          }

          const zoomInWrapped = () => { deselect(); zoomIn() }
          const zoomOutWrapped = () => { deselect(); zoomOut() }
          const resetWrapped = () => { deselect(); resetTransform() }
          return (
            <div className="w-full h-full bg-[#f4f4f5] dark:bg-[#2c2c2c] relative overflow-hidden">
              <div
                ref={wrapperRef}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                className={
                  'w-full h-full overflow-auto scrollbar-hide ' +
                  (mode === 'hand' ? 'cursor-grab' : 'cursor-default')
                }
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <TransformComponent 
                  wrapperStyle={{ 
                    width: '100%',
                    height: '100%',
                    position: 'fixed',
                    left: 0
                  }}
                  contentStyle={{ 
                    margin: '20px', 
                    border: '1px solid #ccc',
                    minWidth: '200%',
                    minHeight: '100%',
                    position: 'relative'
                  }}
                >
                  {/* ------------- FRAMES ------------- */}
                  <div
                    className="
                      grid
                      grid-cols-1
                      md:grid-cols-2
                      xl:grid-cols-3
                      gap-y-16
                      gap-x-10
                      justify-items-center
                      items-center
                      py-16
                      w-max
                      mx-auto
                    "
                  >
                  {pages
                    ?.filter(Boolean) // 🔥 Filtra páginas nulas o inválidas
                    .map((p, pageIdx) => (
                        <PageFrame
                          key={p.id}
                          device={device}
                          currentProjectId={currentProjectId}
                          page={p}
                          pageIndex={pageIdx}
                          selected={!!(current && p.id === current.id)}
                          onClick={() => { onSelectPage(p.id) }}
                          setSelectedComponent={(component) => {
                            // Validar si el componente pertenece a la página actual
                            if (current !== null && current.components.some((c) => c.id === component?.id)) {
                              setSelectedComponent(component)
                            } else {
                              console.warn('El componente no pertenece a la página actual.')
                            }
                          }}
                          updateComponent={updateComponent}
                          handleDeleteComponent={handleDeleteComponent}
                          onDragOver={onDragOver}
                          onDrop={(e) => { onDrop(e, p.id, scale) }}
                          scale={scale} // Pasa la escala actual al frame
                          currentPageId={current?.id ?? ''} // Pasa el id de la página actual o una cadena vacía si es null
                          onDeletePage={onDeletePage}
                          userSelections={userSelections}
                        />
                    ))}
                  </div>
                </TransformComponent>
              </div>

              {/* ------------- TOOLBAR ------------- */}
              <Toolbar
                zoom={Math.round(instance.transformState.scale * 100)}
                mode={mode}
                setMode={setMode}
                zoomIn={zoomInWrapped}
                zoomOut={zoomOutWrapped}
                reset={resetWrapped}
                onSubmit={onSubmit} // Pasa la función para guardar
                handleExport={handleExport} // Pasa la función para exportar
                setOpenDlg={setOpenDlg}
                device={device}
                setDevice={setDevice}
              />
            </div>
          )
        }}
      </TransformWrapper>
    </div>
  )
}
