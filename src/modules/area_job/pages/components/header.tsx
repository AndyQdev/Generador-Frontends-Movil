// components/preview/Header.tsx
import { useState } from 'react'
import ReactDOM from 'react-dom'
import Sidebar from './Sidebar'
import { type HeaderComponent } from '../../models/Components'

interface Props {
  comp: HeaderComponent
  /**  div .relative que viene desde PageFrame */
  portalRoot: React.RefObject<HTMLElement>
}

export default function Header({ comp, portalRoot }: Props) {
  const [open, setOpen] = useState(false)
  const color = comp.color ?? '#2563eb'

  /* Si el ref existe usa ese nodo; si no, cae al body para no romper */
  const target = portalRoot.current ?? document.body

  const portal = open
    ? ReactDOM.createPortal(
        <>
          {/* overlay y sidebar se pintan **relativos** al contenedor */}
          <div
            className="absolute inset-0 bg-black/30 z-40"
            onClick={() => { setOpen(false) }}
          />

          {comp.sidebar && (
            <Sidebar
                comp={comp.sidebar}
                isOpen={open}
                onClose={() => { setOpen(false) }} // ← esta línea
            />
          )}
        </>,
        target
    )
    : null

  return (
    <>
      {/* barra superior (se sigue moviendo con Rnd) */}
      <div
        style={{ left: comp.x, top: comp.y, width: comp.width, height: comp.height }}
        className="absolute flex items-center bg-white shadow px-4"
      >
        {/* botón hamburguesa */}
        <button
          className="mr-2 w-6 h-6 grid place-items-center rounded hover:bg-gray-200 transition"
          style={{ color }}
          onClick={() => { setOpen(!open) }}
        >
          <i className={`fa ${open ? 'fa-times' : 'fa-bars'} text-lg`} />
        </button>

        {/* título centrado */}
        <h1 className="flex-1 text-center font-semibold text-lg truncate">
          {comp.title}
        </h1>

        {/* placeholder a la derecha para mantener centrado el título */}
        <div className="w-6" />
      </div>

      {portal}
    </>
  )
}
