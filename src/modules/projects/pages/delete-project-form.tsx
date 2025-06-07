import { useState } from 'react'
import { Button } from '@components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { Input } from '@components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertDialogCancel, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@components/ui/alert-dialog'
import { type Dispatch, type SetStateAction } from 'react'
import { type ApiResponse } from '@models/index'
import { toast } from 'sonner'
import { type KeyedMutator } from 'swr'
import { PrivateRoutes } from '@/models/routes.model'
import { useNavigate } from 'react-router-dom'
import { ENDPOINTS } from '@/utils'
import { type Project } from '../../projects/models/project.model'

const formSchema = z.object({
  confirmName: z.string({ required_error: 'El nombre es requerido' })
})

interface IDeleteProjectFormProps {
  setOpenModal?: Dispatch<SetStateAction<boolean>>
  mutate: KeyedMutator<ApiResponse<Project[]>>
  projectName: string
  projectId: string
}

const DeleteProjectForm = ({ setOpenModal, mutate, projectName, projectId }: IDeleteProjectFormProps) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmName: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.confirmName !== projectName) {
      toast.error('El nombre del proyecto no coincide')
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}${ENDPOINTS.PROJECTS}/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el proyecto')
      }

      toast.success('Proyecto eliminado exitosamente')
      await mutate()
      setOpenModal?.(false)
      navigate(PrivateRoutes.PROJECTS, { replace: true })
    } catch (error) {
      console.error(error)
      toast.error('Error al eliminar el proyecto')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section className="gap-4 lg:gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full flex flex-col gap-4 lg:gap-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Proyecto</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Para confirmar, escribe el nombre del proyecto: <strong>{projectName}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 lg:gap-6">
            <FormField
              control={form.control}
              name="confirmName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Proyecto</FormLabel>
                  <FormControl>
                    <Input placeholder="Escribe el nombre del proyecto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <AlertDialogFooter className="flex items-center justify-center gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" size="sm" onClick={() => setOpenModal?.(false)}>
                Cancelar
              </Button>
            </AlertDialogCancel>
            <Button type="submit" size="sm" variant="destructive" disabled={isDeleting}>
              {isDeleting ? 'Eliminando...' : 'Eliminar Proyecto'}
            </Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </section>
  )
}

export default DeleteProjectForm 