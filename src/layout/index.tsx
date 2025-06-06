import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/header'
import MainPage from './components/main-page'
import ChatSidebar from './components/chat'
import Aside from './components/aside'
import { Toaster } from '@/components/ui/sonner'
import RightSidebar from './components/right-sidebar'
import { useState } from 'react'
import IAFloatChat from './IAFloatChat'

const Layout = () => {
  const location = useLocation()
  const isCanvasRoute = location.pathname.includes('/area-trabajo')
  const [isChatOpen, setIsChatOpen] = useState(true)

  return (
    <div className="flex h-screen w-full bg-light-bg-primary dark:bg-dark-background-primary relative">
      {/* --- Aside con su propio contenedor --- */}
      <div className="relative z-40">
        <Aside isChatOpen={isChatOpen} onToggleChat={() => { setIsChatOpen(!isChatOpen) }} />
      </div>

      {/* --- ChatSidebar solo visible en área de trabajo --- */}
      {isCanvasRoute && isChatOpen && (
        <div className="relative z-30">
          <ChatSidebar onClose={() => { setIsChatOpen(false) }} />
        </div>
      )}

      {/* --- Contenido principal (Header + Página) --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div
          className={`flex flex-row w-full ${isCanvasRoute
              ? 'h-full'
              : 'h-[calc(100dvh-56px)] lg:h-[calc(100dvh-60px)]'
            }  bg-light-bg-main dark:bg-dark-background-primary`}
        >
          <MainPage>
            <Outlet />
          </MainPage>

          {isCanvasRoute && <RightSidebar />}
          <Toaster richColors />
        </div>
      </div>
      <IAFloatChat />
    </div>
  )
}

export default Layout
