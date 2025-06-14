import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useGetResource, useUpdateResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'
import { type User } from '@/modules/projects/models/user.model'

interface EditProfileFormProps {
  userId: string
}

interface ProfileFormData {
  name: string
  email: string
  telefono: string
}

const EditProfileForm = ({ userId }: EditProfileFormProps): JSX.Element => {
  const navigate = useNavigate()
  const userStorage = JSON.parse(localStorage.getItem('user') ?? '{}')
  const { resource: user } = useGetResource<User>({
    endpoint: ENDPOINTS.USER_DETAIL, // si no es valido, no busca nada
    id: userStorage.id
  })
  const { updateResource, isMutating } = useUpdateResource<User>(ENDPOINTS.USER_DETAIL, userId)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    telefono: user?.telefono ?? ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    try {
      const updatedUser: User = {
        ...user!,
        ...formData
      }
      await updateResource(updatedUser)
      toast.success('Perfil actualizado correctamente')
      navigate('/usuarios/perfil')
    } catch (error) {
      toast.error('Error al actualizar el perfil')
      console.error(error)
    }
  }

  // if (isLoading) {
  //   return <div>Cargando...</div>
  // }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Perfil</CardTitle>
          <CardDescription>Actualiza tu información personal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Tu número de teléfono"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => { navigate('/usuarios/perfil') }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isMutating}>
              {isMutating ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

export default EditProfileForm
