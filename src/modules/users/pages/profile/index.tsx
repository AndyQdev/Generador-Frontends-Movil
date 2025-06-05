import { useHeader } from '@/hooks'
import { PrivateRoutes } from '@/models/routes.model'
import { useGetResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { type User } from '@/modules/projects/models/user.model'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

const ProfilePage = (): JSX.Element => {
  useHeader([
    { label: 'Perfil' }
  ])

  const navigate = useNavigate()
  const userStorage = JSON.parse(localStorage.getItem('user') ?? '{}')
  console.log('ID del usuario del localStorage:', userStorage.id)

  const { resource: user } = useGetResource<User>({
    endpoint: ENDPOINTS.USER_DETAIL, // si no es valido, no busca nada
    id: userStorage.id
  })
  // onsole.log('Datos del usuario!!!!!!!!!!!!!!!!!!:', user);
  return (
    <section className="grid gap-4 lg:gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Mi Perfil</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { navigate(PrivateRoutes.PROFILE_UPDATE) }}
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar Perfil
        </Button>
      </div>

      <div className="grid gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Detalles de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {getInitials(user?.name ?? '')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-semibold">{user?.name}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <Badge variant={user?.rol === 'admin' ? 'default' : 'secondary'} className="mt-1">
                  {user?.rol === 'admin' ? 'Administrador' : 'Colaborador'}
                </Badge>
              </div>

            </div>

            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                  <p>{user?.telefono}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Colaboradores</p>
                  <p>{user?.total_colaboradores} colaboradores</p>
                </div>
              </div>
              {user?.admin && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Administrador</p>
                  <p>{user.admin.name}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proyectos</CardTitle>
            <CardDescription>Proyectos en los que participas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {user?.proyectos?.map((proyecto) => (
                <div key={proyecto.id} className="flex items-center justify-between p-2 rounded-lg border">
                  <div>
                    <p className="font-medium">{proyecto.name}</p>
                    <p className="text-sm text-muted-foreground">{proyecto.descripcion}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { navigate(`/area-trabajo/${proyecto.id}`) }}
                  >
                    Ver Proyecto
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default ProfilePage
