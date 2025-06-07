import { CircleUser, LogOut, Menu, User, Users, Plus } from 'lucide-react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Navigation from './navigation'
import { useHeader } from '@/hooks/useHeader'
import { PrivateRoutes } from '@/models/routes.model'
import { ModeToggle } from '@/components/mode-toggle'
import { useProjectUsers } from '@/context/ProjectUsersContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useGetResource, useGetAllResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { type Project } from '@/modules/projects/models/project.model'
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog'
import { useState } from 'react'
import UserFormDialog from '@/modules/projects/colaborador/subUser-form'
import { type User as UserType } from '@/modules/projects/models/user.model'
import AssignColaboradorForm from '@/modules/projects/colaborador/assign-colaborador-form'

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2) // Tomar máximo 2 iniciales
}

const Header = () => {
  const { breadcrumb } = useHeader()
  const navigate = useNavigate()
  const { users } = useProjectUsers()
  const { areaId } = useParams()
  const location = useLocation()
  const [openModal, setOpenModal] = useState(false)
  const [openAssignModal, setOpenAssignModal] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)
  const userStorage = JSON.parse(localStorage.getItem('user') ?? '{}')
  const { allResource: projects } = useGetAllResource<Project>({ endpoint: ENDPOINTS.PROJECTS })
  const { mutate } = useGetResource<UserType>({ endpoint: ENDPOINTS.USER, id: userStorage.id })

  const { resource: activeProject } = useGetResource<Project>({
    endpoint: areaId && areaId !== ':areaId' ? ENDPOINTS.PROJECTS : ENDPOINTS.ULTIMO_PROJECT,
    id: areaId && areaId !== ':areaId' ? areaId : ''
  })

  const isProfilePage = location.pathname === PrivateRoutes.PROFILE
  const isProjectsPage = location.pathname === PrivateRoutes.PROJECTS
  const isAreaPage = location.pathname.includes('/area-trabajo/')
  const isColaboradoresPage = location.pathname === PrivateRoutes.COLABOLADOR

  const getTitle = () => {
    if (isProfilePage) return 'Perfil'
    if (isProjectsPage) return 'Proyectos'
    if (isColaboradoresPage) return 'Colaboradores'
    if (isAreaPage && activeProject) return activeProject.name
    return ''
  }

  const handleOpenCreateModal = () => {
    setOpenDropdown(false)
    setOpenModal(true)
  }

  const handleOpenAssignModal = () => {
    setOpenDropdown(false)
    setOpenAssignModal(true)
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6 bg-background border-secondary dark:bg-dark-background-primary">

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5 " />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col px-0 py-0 gap-0">
          <SheetHeader>
            <div className="flex items-center gap-3 px-4 border-b py-3 h-14">
              <h1>UI SKETCH</h1>
            </div>
          </SheetHeader>
          <Navigation />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <div className="w-full flex-1 flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumb.map((item, index) => (
                item.path
                  ? (
                    <div className="flex items-center sm:gap-2" key={index}>
                      <BreadcrumbItem>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Link
                                  to={item.path}
                                  className={`${
                                    (!projects || projects.length === 0) && item.path === PrivateRoutes.AREA
                                      ? 'opacity-50 cursor-not-allowed pointer-events-none'
                                      : ''
                                  }`}
                                >
                                  {item.label}
                                </Link>
                              </div>
                            </TooltipTrigger>
                            {(!projects || projects.length === 0) && item.path === PrivateRoutes.AREA && (
                              <TooltipContent>
                                <p>Necesitas crear al menos un proyecto para acceder al Espacio de Trabajo</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </div>
                    )
                  : (
                    <BreadcrumbItem key={index}>
                      <BreadcrumbPage className="text-light-primary font-semibold">{item.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                    )
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          {getTitle() && (
            <div className="flex-1 flex justify-center">
              <div className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                {getTitle()}
              </div>
            </div>
          )}
        </div>

      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          {users && users.length > 0
            ? (
                users.map((user) => (
              <Tooltip key={user.id}>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 border-2 border-primary dark:border-white transition-all duration-300 hover:scale-110 hover:rotate-12 hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-white/20">
                    <AvatarFallback className="bg-primary/10 text-primary dark:bg-white/10 dark:text-white font-medium transition-colors duration-300 hover:bg-primary/20 dark:hover:bg-white/20">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent className="transition-all duration-300">
                  <p className="font-medium">{user.name}</p>
                </TooltipContent>
              </Tooltip>
                ))
              )
            : (
            <div className="text-sm text-muted-foreground">No hay usuarios conectados</div>
              )}
        </TooltipProvider>
      </div>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Users className="h-5 w-5" />
            <span className="sr-only">Acciones de colaboradores</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Colaboradores</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleOpenCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Crear nuevo colaborador
          </DropdownMenuItem>
          {isAreaPage && activeProject && (
            <DropdownMenuItem className="cursor-pointer" onClick={handleOpenAssignModal}>
              <Users className="mr-2 h-4 w-4" />
              Asignar colaboradores al proyecto
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ModeToggle />

      <AlertDialog open={openModal} onOpenChange={setOpenModal}>
        <AlertDialogContent>
          <UserFormDialog setOpenModal={setOpenModal} mutate={mutate} />
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openAssignModal} onOpenChange={setOpenAssignModal}>
        <AlertDialogContent>
          <AssignColaboradorForm
            setOpenModal={setOpenAssignModal}
            mutate={mutate}
            projectId={activeProject?.id.toString() ?? ''}
          />
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { navigate(PrivateRoutes.PROFILE) }} className='cursor-pointer'>
            <User className="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              window.location.reload()
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default Header
