import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertDialogCancel, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { type Dispatch, type SetStateAction } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'
import { useGetAllResource, useUpdateResource } from '@/hooks/useApiResource'
import { type Colaborador, type User, type UpdateColaborador } from '../models/user.model'
import { type Project } from '../models/project.model'
import { ENDPOINTS } from '@/utils'
import { CheckCheckIcon, ChevronsUpDownIcon, X } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { type KeyedMutator } from 'swr'

const formSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre debe tener menos de 100 caracteres'),
  email: z.string({ required_error: 'El correo es requerido' })
    .min(3, 'El correo debe tener al menos 3 caracteres')
    .max(100, 'El correo debe tener menos de 100 caracteres'),
  telefono: z.string({ required_error: 'El teléfono es requerido' })
    .min(3, 'El teléfono debe tener al menos 3 caracteres')
    .max(100, 'El teléfono debe tener menos de 100 caracteres'),
  proyectos_ids: z
    .array(z.number())
    .optional()
    .default([])
})

interface EditColaboradorFormProps {
  colaborador: Colaborador
  setOpenModal?: Dispatch<SetStateAction<boolean>>
  mutate: KeyedMutator<User>
}

const EditColaboradorForm = ({ colaborador, setOpenModal, mutate }: EditColaboradorFormProps) => {
  const { updateResource: updateColaborador } = useUpdateResource<UpdateColaborador>(`${ENDPOINTS.PROJECTS}/colaboradores/${colaborador.id}`)
  const { allResource: projects } = useGetAllResource<Project>({ endpoint: ENDPOINTS.PROJECTS })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: colaborador.name,
      email: colaborador.email,
      telefono: colaborador.telefono,
      proyectos_ids: colaborador.proyectos?.map(p => Number(p.id)) ?? []
    }
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const updatedColaborador: UpdateColaborador = {
        id: colaborador.id,
        name: data.name,
        email: data.email,
        telefono: data.telefono,
        proyectos_ids: data.proyectos_ids
      }

      console.log('Datos enviados a la API de actualización:', JSON.stringify(updatedColaborador, null, 2))

      toast.promise(updateColaborador(updatedColaborador), {
        loading: 'Actualizando colaborador...',
        success: () => {
          if (mutate) {
            void mutate()
          }
          setOpenModal?.(false)
          return 'Colaborador actualizado exitosamente'
        },
        error: 'Error al actualizar el colaborador'
      })
    } catch (error) {
      console.error(error)
      toast.error('Error al actualizar el colaborador')
    }
  }

  return (
    <section className="gap-4 lg:gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full flex flex-col gap-4 lg:gap-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Colaborador</AlertDialogTitle>
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
                      <Input placeholder="Ingresa el nombre del colaborador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder="Ingresa un correo electrónico" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder="Ingresa tu teléfono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="proyectos_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proyectos</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {field.value.length > 0
                              ? `${field.value.length} proyectos seleccionados`
                              : 'Seleccionar proyectos'}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar proyectos..." />
                            <CommandList>
                              <CommandEmpty>No se encontraron proyectos.</CommandEmpty>
                              <CommandGroup>
                                {projects?.map((proyecto) => (
                                  <CommandItem
                                    key={proyecto.id}
                                    onSelect={() => {
                                      const currentValue = field.value
                                      const newValue = currentValue.includes(Number(proyecto.id))
                                        ? currentValue.filter(id => id !== Number(proyecto.id))
                                        : [...currentValue, Number(proyecto.id)]
                                      field.onChange(newValue)
                                    }}
                                  >
                                    <CheckCheckIcon
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        field.value.includes(Number(proyecto.id)) ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {proyecto.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((projectId) => {
                        const proyecto = projects?.find(p => Number(p.id) === projectId)
                        return proyecto ? (
                          <Badge
                            key={projectId}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {proyecto.name}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => {
                                field.onChange(field.value.filter(id => id !== projectId))
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

export default EditColaboradorForm 