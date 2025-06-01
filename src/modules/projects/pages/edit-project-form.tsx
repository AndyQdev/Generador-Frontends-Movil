import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertDialogCancel, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { type Dispatch, type SetStateAction, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'
import { useGetResource, useUpdateResource } from '@/hooks/useApiResource'
import { type User } from '../models/user.model'
import { ENDPOINTS } from '@/utils'
import { CheckCheckIcon, ChevronsUpDownIcon, X } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { type KeyedMutator } from 'swr'
import { type Project } from '../models/project.model'
import { type ApiResponse } from '@/models'

const formSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre debe tener menos de 100 caracteres'),
  descripcion: z.string({ required_error: 'La descripción es requerida' })
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(500, 'La descripción debe tener menos de 500 caracteres'),
  status: z.string(),
  colaboradores: z
    .array(z.number())
    .optional()
    .default([])
})

interface EditProjectFormProps {
  project: Project
  setOpenModal?: Dispatch<SetStateAction<boolean>>
  mutate: KeyedMutator<ApiResponse<Project[]>>
}

const EditProjectForm = ({ project, setOpenModal, mutate }: EditProjectFormProps) => {
  const userStorage = JSON.parse(localStorage.getItem('user') ?? '{}')
  const { resource: user } = useGetResource<User>({ endpoint: ENDPOINTS.USER, id: userStorage.id })
  const { resource: projectColaboradores } = useGetResource<User[]>({ 
    endpoint: `${ENDPOINTS.PROJECTS}/${project.id}/colaboradores` 
  })
  const { updateResource: updateProject } = useUpdateResource<Project>(ENDPOINTS.PROJECTS)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
      descripcion: project.descripcion,
      status: project.status,
      colaboradores: []
    }
  })

  useEffect(() => {
    if (projectColaboradores) {
      form.setValue('colaboradores', projectColaboradores.map(c => Number(c.id)))
    }
  }, [projectColaboradores, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const updatedProject = {
        ...project,
        name: data.name,
        descripcion: data.descripcion,
        status: data.status,
        colaboradores: data.colaboradores,
        last_modified: new Date()
      }

      toast.promise(updateProject(updatedProject), {
        loading: 'Actualizando proyecto...',
        success: () => {
          if (mutate) {
            void mutate()
          }
          setOpenModal?.(false)
          return 'Proyecto actualizado exitosamente'
        },
        error: 'Error al actualizar el proyecto'
      })
    } catch (error) {
      console.error(error)
      toast.error('Error al actualizar el proyecto')
    }
  }

  return (
    <section className="gap-4 lg:gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full flex flex-col gap-4 lg:gap-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Proyecto</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid gap-4 lg:gap-6">
            <div className="flex flex-col gap-4 lg:gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingresa el nombre del proyecto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ingresa una descripción" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full border rounded px-2 py-1 text-sm bg-white dark:bg-dark-bg-primary"
                      >
                        <option value="En proceso">En proceso</option>
                        <option value="Completado">Completado</option>
                        <option value="Pendiente">Pendiente</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colaboradores"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colaboradores</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {field.value.length > 0
                              ? `${field.value.length} colaboradores seleccionados`
                              : 'Seleccionar colaboradores'}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar colaboradores..." />
                            <CommandList>
                              <CommandEmpty>No se encontraron colaboradores.</CommandEmpty>
                              <CommandGroup>
                                {user?.colaboradores?.map((colaborador) => (
                                  <CommandItem
                                    key={colaborador.id}
                                    onSelect={() => {
                                      const currentValue = field.value
                                      const newValue = currentValue.includes(Number(colaborador.id))
                                        ? currentValue.filter(id => id !== Number(colaborador.id))
                                        : [...currentValue, Number(colaborador.id)]
                                      field.onChange(newValue)
                                    }}
                                  >
                                    <CheckCheckIcon
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        field.value.includes(Number(colaborador.id)) ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {colaborador.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((userId) => {
                        const colaborador = projectColaboradores?.find(c => Number(c.id) === userId) ?? 
                                         user?.colaboradores?.find(c => Number(c.id) === userId)
                        return colaborador ? (
                          <Badge
                            key={userId}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {colaborador.name}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => {
                                field.onChange(field.value.filter(id => id !== userId))
                              }}
                            />
                          </Badge>
                        ) : null
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <AlertDialogFooter className="flex items-center justify-center gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" size="sm" onClick={() => setOpenModal?.(false)}>
                Cancelar
              </Button>
            </AlertDialogCancel>
            <Button type="submit" size="sm">
              Guardar Cambios
            </Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </section>
  )
}

export default EditProjectForm 