import { type Page } from '@/modules/projects/models/page.model'
import { Rnd } from 'react-rnd'
import { cn } from '@/lib/utils'
import { type ComponentItem } from './page'
import { useRef, useState } from 'react'
import { useComponentContext } from '@/context/ComponentContext'
import { getSocket } from '@/lib/socket'
import throttle from 'lodash.throttle'
import { type Device } from '../utils/devices'
import Button from './components/ButtonComponent'
import Input from './components/Input'
import Sidebar from './components/Sidebar'
import Header from './components/header'

interface PageFrameProps {
  page: Page // Página que se está renderizando
  selected: boolean // Si la página está seleccionada
  onClick: () => void // Función para manejar el clic en la página
  setSelectedComponent: (component: ComponentItem | null) => void // Función para seleccionar un componente
  updateComponent: (
    pageIndex: number,
    compIndex: number,
    updated: ComponentItem
  ) => void
  handleDeleteComponent: (id: string) => void // Función para eliminar un componente
  onDrop: (e: React.DragEvent<HTMLDivElement>, id: string, scale: number) => void // Función para manejar el evento de soltar un componente
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void // Función para manejar el evento de arrastrar un componente
  scale: number
  currentPageId: string
  pageIndex: number
  currentProjectId: string
  device: Device
}
export default function PageFrame({
  page,
  selected,
  onClick,
  setSelectedComponent,
  updateComponent,
  handleDeleteComponent,
  onDrop,
  onDragOver,
  scale,
  currentPageId,
  pageIndex,
  currentProjectId,
  device
}: PageFrameProps) {
  let isDragging = false
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({})
  const toggleSidebar = () => { setIsSidebarOpen(prev => !prev) }
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [, setEditRowIndex] = useState<number | null>(null)
  const [confirmDeleteRowIndex, setConfirmDeleteRowIndex] = useState<number | null>(null)
  const { setSelectedPage } = useComponentContext()
  const socket = getSocket()
  const pageRef = useRef<HTMLDivElement>(null)
  // 🔸 throttled → 1 frame cada 50 ms ( ≈ 20 fps )
  const emitMove = throttle((comp, x, y) => {
    socket?.emit('component_moving', {
      project_id: currentProjectId,
      page_id: page.id,
      component: { id: comp.id, x, y, width: comp.width, height: comp.height },
      origin: socket?.id
    })
  }, 50) // ⇠ ajusta a 30-60 ms si ves lag

  const emitResize = throttle((comp, w, h, x, y) => {
    socket?.emit('component_resizing', {
      project_id: currentProjectId,
      page_id: page.id,
      component: { id: comp.id, width: w, height: h, x, y },
      origin: socket?.id
    })
  }, 50)
  return (
    <div ref={pageRef}
      style={{ width: device.width, height: device.height }}
      className={cn(
        'relative shadow-lg border overflow-hidden bg-[#D9D9D9] rounded-3xl',
        selected ? 'ring-2 ring-blue-500' : 'border-gray-400'
      )}
      onClick={(e) => {
        e.stopPropagation() // ⚡ Evitamos que el click se propague innecesariamente
        if (page.id !== currentPageId) {
          onClick() // 👉 sigue llamando tu función original (activar esta página)
        } else {
          setSelectedComponent(null) // 👉 deselecciona cualquier componente
          setSelectedPage(page) // 👉 selecciona esta página
        }
      }}
      onDrop={(e) => {
        e.preventDefault() // Evita el comportamiento predeterminado
        onDrop(e, page.id, scale) // Llama a la función pasada como prop con el id de la página
      }}
      onDragOver={(e) => {
        e.preventDefault() // Permite que el elemento sea soltado
        onDragOver(e) // Llama a la función pasada como prop
      }}
      onPointerDownCapture={() => {
        if (page.id !== currentPageId) { // aún no es la página activa
          onClick() // 1️⃣ selecciona la página
          /* Al detener la propagación evitamos que el hijo (<Rnd>) procese el
             evento y arranque un drag indebido                            */
        }
      }}
    >
      <div
        className="
          absolute top-0 left-0 z-50
          w-full h-6
          flex items-center justify-between
          px-2
          text-[10px] font-semibold tracking-wider
          text-gray-800
          bg-white/80 backdrop-blur
          pointer-events-none
        "
      >
        {/* Hora */}
        <span>9:41</span>

        {/* Indicadores a la derecha */}
        <div className="flex items-center gap-1">
          <i className="fa fa-signal" />
          <i className="fa fa-wifi" />
          <i className="fa fa-battery-three-quarters" />
        </div>
      </div>

      {/* ───────────────── Home-indicator (opcional) ───────────────── */}
      <div
        className="
          absolute left-1/2 -translate-x-1/2 bottom-1
          w-20 h-1.5 rounded-full
          bg-gray-500/60
          pointer-events-none
        "
      />
      {/* Renderizar los componentes de la página */}
      {page.components.map((comp, index) => (
        <Rnd
          key={comp.id}
          size={{ width: comp.width, height: comp.height }}
          position={{ x: comp.x, y: comp.y }}
          scale={scale}
          disableDragging={page.id !== currentPageId}
          enableResizing={page.id === currentPageId}
          onClick={() => {
            if (page.id !== currentPageId) return
            if (!isDragging && page.id === currentPageId) { // Validar que la página sea la actual
              setSelectedPage(null)
              setSelectedComponent(comp)
            }
          }}
          onDrag={(_e, d) => {
            if (page.id !== currentPageId) return
            emitMove(comp, d.x, d.y) // 👈 envía frame
          }}
          onResize={(_e, _direction, ref, _delta, position) => {
            emitResize(
              comp,
              parseInt(ref.style.width),
              parseInt(ref.style.height),
              position.x,
              position.y
            )
          }}
          onDragStart={(e) => {
            if (page.id !== currentPageId) {
              e.preventDefault()
              return false
            }
            isDragging = true
          }}
          onDragStop={(_e, d) => {
            isDragging = false
            updateComponent(pageIndex, index, { ...comp, x: d.x, y: d.y })
            const socket = getSocket()
            socket?.emit('component_updated', {
              project_id: currentProjectId, // El id del proyecto activo
              page_id: page.id,
              component: {
                ...comp,
                x: d.x,
                y: d.y,
                width: comp.width,
                height: comp.height
              }
            })
          }}
          onResizeStop={(_e, _direction, ref, _delta, position) => {
            updateComponent(
              pageIndex,
              index, {
                ...comp,
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                x: position.x,
                y: position.y
              })
            const socket = getSocket()
            socket?.emit('component_updated', {
              project_id: currentProjectId, // El id del proyecto activo
              page_id: page.id,
              component: {
                ...comp,
                x: position.x,
                y: position.y,
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height)
              }
            })
          }}
          bounds="parent"
        >
          <div className="h-full w-full relative">
            {/* Botón de eliminar */}
            {selected && (
              <button
                onClick={() => { handleDeleteComponent(comp.id) }}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-bl hover:bg-red-600 z-10"
                title="Eliminar componente"
              >
                ×
              </button>
            )}

            {/* Contenido del componente */}
            {
            (() => {
              switch (comp.type) {
                case 'button':
                  return <Button comp={comp} />
                case 'input':
                  return <Input comp={comp}></Input>
                case 'header':
                  return <Header comp={comp} portalRoot={pageRef}/>
                default:
                  return <div>Componente no soportado</div>
              }
            })()
          }

          </div>
        </Rnd>
      ))}
      {confirmDeleteRowIndex !== null && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] space-y-4">
            <h2 className="text-xl font-semibold text-black mb-4">¿Estás seguro de eliminar esta fila?</h2>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => { setConfirmDeleteRowIndex(null) }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  const comp = page.components.find(c => c.type === 'listar')
                  if (!comp || comp.type !== 'listar') return
                  const rows = [...comp.dataTable.rows]
                  rows.splice(confirmDeleteRowIndex, 1)
                  updateComponent(pageIndex, page.components.findIndex(c => c.id === comp.id), {
                    ...comp,
                    dataTable: {
                      ...comp.dataTable,
                      rows
                    }
                  })
                  setConfirmDeleteRowIndex(null)
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {Object.entries(openDialogs).map(([compId, isOpen]) => {
        const comp = page.components.find(c => c.id === compId && c.type === 'listar')
        if (!isOpen || !comp || comp.type !== 'listar' || page.id !== currentPageId) return null
        // ⬆️ Aquí la diferencia principal: page.id === currentPageId
        // solo renderiza el Dialog si pertenece a la página activa

        return (
         <div
           key={compId}
           className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/40"
         >
          <div className="bg-white  rounded-lg shadow-lg w-[500px] max-w-full p-6 space-y-4">
            <h2 className="text-xl text-black font-semibold mb-2">{comp.dialog.title}</h2>

            {comp.dialog.fields.map((field, idx) => (
              <div key={idx} className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">{field.label}</label>

                {field.type.type === 'input' && (
                  <input
                    className="border border-gray-300 rounded px-3 py-1 text-sm bg-white text-black"
                    placeholder={field.type.placeholder}
                    value={formValues[field.label] ?? ''}
                    onChange={(e) => {
                      const updatedFields = [...comp.dialog.fields]
                      setFormValues(prev => ({ // <- actualizamos el estado local
                        ...prev,
                        [field.label]: e.target.value
                      }))
                      updatedFields[idx].type.value = e.target.value
                      updateComponent(pageIndex, page.components.findIndex(c => c.id === comp.id), {
                        ...comp,
                        dialog: {
                          ...comp.dialog,
                          fields: updatedFields
                        }
                      })
                    }}
                  />
                )}

                {field.type.type === 'select' && (
                  <select
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                    value={formValues[field.label] ?? ''}
                    onChange={(e) => {
                      setFormValues(prev => ({
                        ...prev,
                        [field.label]: e.target.value
                      }))
                      const updatedFields = [...comp.dialog.fields]
                      updatedFields[idx].type.value = e.target.value
                      updateComponent(pageIndex, page.components.findIndex(c => c.id === comp.id), {
                        ...comp,
                        dialog: {
                          ...comp.dialog,
                          fields: updatedFields
                        }
                      })
                    }}
                  >
                    {field.type.options.map((option, optionIdx) => (
                      <option key={optionIdx} value={option}>{option}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => {
                  setOpenDialogs(prev => ({ ...prev, [compId]: false }))
                }}
                className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const newRow = comp.dialog.fields.map((field) => formValues[field.label] ?? '')

                  const updatedRows = [...comp.dataTable.rows, newRow]

                  updateComponent(
                    pageIndex,
                    page.components.findIndex(c => c.id === compId),
                    {
                      ...comp,
                      dataTable: {
                        ...comp.dataTable,
                        rows: updatedRows
                      },
                      dialog: {
                        ...comp.dialog,
                        fields: comp.dialog.fields.map(field => ({ ...field, value: '' }))
                      }
                    }
                  )

                  setOpenDialogs(prev => ({ ...prev, [compId]: false }))
                  setFormValues({}) // ✅ Limpiamos los valores temporales
                }}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
        )
      })}

    </div>
  )
}
