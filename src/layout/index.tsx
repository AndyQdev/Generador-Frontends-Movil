import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/header'
import MainPage from './components/main-page'
import ChatSidebar from './components/chat'
import Aside from './components/aside'
import { Toaster } from '@/components/ui/sonner'
import RightSidebar from './components/right-sidebar'

const Layout = () => {
  const location = useLocation()
  const isCanvasRoute = location.pathname.includes('/area-trabajo')

  return (
    <div className="flex h-screen w-full bg-light-bg-primary dark:bg-dark-background-primary relative">
      {/* --- Aside con su propio contenedor --- */}
      <div className="relative z-40">
        <Aside />
      </div>

      {/* --- ChatSidebar en su propio contenedor --- */}
      <div className="relative z-30">
        <ChatSidebar />
      </div>

      {/* --- Contenido principal (Header + Página) --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div
          className={`flex flex-row w-full ${
            isCanvasRoute
              ? 'h-full'
              : 'h-[calc(100dvh-56px)] lg:h-[calc(100dvh-60px)]'
          } overflow-y-auto bg-light-bg-main dark:bg-dark-background-primary`}
        >
          <MainPage>
            <Outlet />
          </MainPage>

          {isCanvasRoute && <RightSidebar />}
          <Toaster richColors />
        </div>
      </div>
    </div>
  )
}

export default Layout
