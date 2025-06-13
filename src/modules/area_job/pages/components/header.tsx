// components/preview/Header.tsx
import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Sidebar from './Sidebar'
import { type HeaderComponent } from '../../models/Components'
import { useProjectUsers } from '@/context/ProjectUsersContext'
import { getSocket } from '@/lib/socket'
import { toast } from 'sonner'

interface Props {
  comp: HeaderComponent
  /**  div .relative que viene desde PageFrame */
  portalRoot: React.RefObject<HTMLElement>
}

export default function Header({ comp, portalRoot }: Props) {
  const [open, setOpen] = useState(false)
  const color = comp.color ?? '#2563eb'
  const { users } = useProjectUsers()
  const socket = getSocket()

  useEffect(() => {
    if (!socket) return

    socket.on('user_joined', (user) => {
      toast.success(`${user.name} se ha unido al proyecto`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#4CAF50',
          color: 'white',
          border: 'none'
        }
      })
    })

    socket.on('user_left', (userId) => {
      const user = users.find(u => u.id === userId)
      if (user) {
        toast.info(`${user.name} ha salido del proyecto`, {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#2196F3',
            color: 'white',
            border: 'none'
          }
        })
      }
    })

    return () => {
      socket.off('user_joined')
      socket.off('user_left')
    }
  }, [socket, users])

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
                onClose={() => { setOpen(false) }}
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
        // style={{ left: comp.x, top: comp.y, width: comp.width, height: comp.height }}
        className="w-full h-full flex items-center bg-white shadow px-4"
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
          {comp.title}hola
        </h1>

        {/* placeholder a la derecha para mantener centrado el título */}
        <div className="w-6" />
      </div>

      {portal}
    </>
  )
}
