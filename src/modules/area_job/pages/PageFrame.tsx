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
import Header from './components/header'
import BottomNavigationBar from './components/BottomNavigationBar'
import DataTable from './components/Datatable'
import Select from './components/Select'
import CheckList from './components/CheckList'
import RadioButton from './components/RadioButton'
import Card from './components/Card'
import Label from './components/Label'
import TextArea from './components/TextArea'
import Imagen from './components/Imagen'
import Calendar from './components/Calendar'
import Search from './components/Search'
import Icon from './components/Icon'
import Login from './components/Login'
import Formulario from './components/Formulario'

interface PageFrameProps {
  userSelections: Array<{
    userId: string
    userName: string
    componentId: string
    pageId: string
  }>

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
  onDeletePage?: (pageId: string) => void // Nueva prop para eliminar página
  activeLoadingImage: null | {
    pageId: string
    imageUrl: string
  }
  setActiveLoadingImage: (image: { pageId: string, imageUrl: string } | null) => void
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
  device,
  onDeletePage,
  activeLoadingImage,
  setActiveLoadingImage,
  userSelections
}: PageFrameProps) {
  const { selectedComponent } = useComponentContext()
  let isDragging = false
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
  const toPx = (pct: number, base: number) => (pct / 100) * base
  const toPct = (px: number, base: number) => (px / base) * 100

  // Función para obtener los tamaños mínimos según el tipo de componente (en porcentaje)
  const getMinSizeByType = (type: string, device: Device) => {
    // Valores mínimos en porcentaje del ancho y alto del dispositivo
    const minWidth = {
      button: 20, // 15% del ancho del dispositivo
      input: 20,
      header: 100, // header siempre ocupa todo el ancho
      bottomNavigationBar: 100, // bottomNavigationBar siempre ocupa todo el ancho
      datatable: 30,
      select: 20,
      checklist: 30,
      radiobutton: 25,
      card: 30,
      label: 15,
      textArea: 25,
      imagen: 20,
      calendar: 35,
      search: 20,
      icon: 5
    }[type] ?? 10

    const minHeight = {
      button: 5, // 5% del alto del dispositivo
      input: 5,
      header: 8,
      bottomNavigationBar: 5,
      datatable: 15,
      select: 5,
      checklist: 15,
      radiobutton: 15,
      card: 20,
      label: 4,
      textArea: 12,
      imagen: 20,
      calendar: 40,
      search: 5,
      icon: 5
    }[type] ?? 5

    return {
      width: minWidth,
      height: minHeight
    }
  }

  return (
    <div className="relative">
      {/* Nombre de la página */}
      <div
        className="
          absolute -top-8 left-0
          w-full
         flex items-center justify-center
         py-1
         text-sm font-medium
         text-gray-700 dark:text-white
         pointer-events-none
        "
      >
        {page.name}
        {onDeletePage && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDeletePage(page.id)
            }}
            className="ml-2 text-red-500 hover:text-red-600 pointer-events-auto"
            title="Eliminar página"
          >
            ×
          </button>
        )}
      </div>

      <div ref={pageRef}
        style={{
          width: device.width,
          height: device.height,
          backgroundColor: page.background_color ?? '#ffffff'
        }}
        className={cn(
          'relative shadow-lg border overflow-hidden bg-white rounded-3xl',
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
        {activeLoadingImage?.pageId === page.id && (
          <div
            className="absolute inset-0 z-40 overflow-hidden pointer-events-none"
            /* cuando acaba la animación, quitamos la capa */
            onAnimationEnd={() => { setActiveLoadingImage(null) }}
          >
            <img
              src={activeLoadingImage.imageUrl}
              alt="loading overlay"
              className="w-full h-full object-cover"
              style={{
                animation: 'wipeOut 8s linear forwards'
              }}
            />

            {/* etiqueta sutil de estado */}
            <span className="absolute top-2 right-2 text-xs font-semibold text-gray-600 bg-white/80 px-2 py-0.5 rounded shadow">
              Generando…
            </span>
          </div>
        )}
        {page.components.map((comp, index) => {
          /* ── ¿Algún OTRO usuario tiene seleccionado este componente? ───────── */
          const other = userSelections.find(
            (s) => s.componentId === comp.id && s.pageId === page.id
          )
          // console.log('Componente:', comp.id, 'Seleccionado por:', other)
          /* ──────────────────────────────────────────────────────────────────── */

          return (
            <Rnd
              key={comp.id}
              // key={`${comp.id}-${scale}`}
              size={{
                width: toPx(comp.width, device.width),
                height: toPx(comp.height, device.height)
              }}
              position={{
                x: toPx(comp.x, device.width),
                y: toPx(comp.y, device.height)
              }}
              scale={scale}
              disableDragging={comp.locked ?? false}
              enableResizing={!comp.locked}
              minWidth={toPx(getMinSizeByType(comp.type, device).width, device.width)}
              minHeight={toPx(getMinSizeByType(comp.type, device).height, device.height)}
              onClick={() => {
                if (page.id !== currentPageId) return
                if (!isDragging && page.id === currentPageId) {
                  setSelectedPage(null)
                  setSelectedComponent(comp)

                  // Emitir selección
                  const socket = getSocket()
                  const user = JSON.parse(localStorage.getItem('user') ?? '{}')
                  console.log('Emitting selection:', {
                    project_id: currentProjectId,
                    page_id: page.id,
                    component_id: comp.id,
                    user_id: user.id,
                    user_name: user.name
                  })
                  // console.log('esto es usariooooooooooooooooooooooooo' +JSON.stringify(user))
                  socket?.emit('component_selected', {
                    project_id: currentProjectId,
                    page_id: page.id,
                    component_id: comp.id,
                    user_id: user.id,
                    user_name: user.name,
                    origin: socket?.id
                  })
                }
              }}
              onDrag={(_e, d) => {
                if (page.id !== currentPageId) return
                emitMove(
                  comp,
                  toPct(d.x, device.width),
                  toPct(d.y, device.height)
                )
              }}
              onResize={(_e, _dir, ref, _delta, pos) => {
                emitResize(
                  comp,
                  toPct(parseInt(ref.style.width), device.width),
                  toPct(parseInt(ref.style.height), device.height),
                  toPct(pos.x, device.width),
                  toPct(pos.y, device.height)
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
                const xPct = toPct(d.x, device.width)
                const yPct = toPct(d.y, device.height)
                updateComponent(pageIndex, index, {
                  ...comp,
                  x: toPct(d.x, device.width),
                  y: toPct(d.y, device.height)
                })
                const socket = getSocket()
                socket?.emit('component_updated', {
                  project_id: currentProjectId,
                  page_id: page.id,
                  component: {
                    ...comp,
                    x: xPct,
                    y: yPct,
                    width: comp.width,
                    height: comp.height
                  }
                })
              }}
              onResizeStop={(_e, _dir, ref, _delta, pos) => {
                const wPct = toPct(parseInt(ref.style.width), device.width)
                const hPct = toPct(parseInt(ref.style.height), device.height)
                const xPct = toPct(pos.x, device.width)
                const yPct = toPct(pos.y, device.height)

                updateComponent(pageIndex, index, {
                  ...comp,
                  width: wPct,
                  height: hPct,
                  x: xPct,
                  y: yPct
                })

                socket?.emit('component_updated', {
                  project_id: currentProjectId,
                  page_id: page.id,
                  component: {
                    ...comp,
                    width: wPct,
                    height: hPct
                  }
                })
              }}
              bounds="parent"
              className={cn(
                'relative',
                selectedComponent?.id === comp.id && 'ring-2 ring-blue-500 ring-offset-2',
                other && 'ring-2 ring-pink-500'
              )}
            >
              <div className="h-full w-full relative">
                {/* ─────────── Overlay cuando OTRO usuario lo selecciona ─────────── */}
                {other && (
                  <div className="absolute inset-0 ring-2 ring-pink-500 rounded pointer-events-none z-40">
                    <div className="absolute -top-6 left-0 bg-pink-500 text-white text-xs px-2 py-0.5 rounded shadow-md">
                      {other.userName}
                    </div>
                  </div>
                )}
                {/* ───────────────────────────────────────────────────────────────── */}

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
                        return <Header comp={comp} portalRoot={pageRef} />
                      case 'bottomNavigationBar':
                        return <BottomNavigationBar comp={comp} />
                      case 'datatable':
                        return <DataTable comp={comp} />
                      case 'select':
                        return <Select comp={comp} />
                      case 'checklist':
                        return <CheckList comp={comp} />
                      case 'radiobutton':
                        return <RadioButton comp={comp} />
                      case 'card':
                        return <Card comp={comp} />
                      case 'label':
                        return <Label comp={comp} />
                      case 'textArea':
                        return <TextArea comp={comp} />
                      case 'imagen':
                        return <Imagen comp={comp} />
                      case 'calendar':
                        return <Calendar comp={comp} />
                      case 'search':
                        return <Search comp={comp} />
                      case 'icon':
                        return <Icon comp={comp} />
                      case 'login':
                        return <Login comp={comp} />
                      case 'formulario':
                        return <Formulario comp={comp} />
                      default:
                        return <div>Componente no soportado</div>
                    }
                  })()
                }
              </div>
            </Rnd>
          )
        })}
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

      </div>
    </div>
  )
}
