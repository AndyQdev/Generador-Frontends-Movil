import { Button } from '@components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertDialogCancel, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@components/ui/alert-dialog'
import { type Dispatch, type SetStateAction, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'
import { useGetResource, useUpdateResource } from '@/hooks/useApiResource'
import { type User } from '../models/user.model'
import { ENDPOINTS } from '@/utils'
import { CheckCheckIcon, ChevronsUpDownIcon, X } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { type KeyedMutator } from 'swr'
import { type Project } from '../models/project.model'

const formSchema = z.object({
  colaboradores_ids: z
    .array(z.number())
    .optional()
    .default([])
})

interface IAssignColaboradorFormProps {
  setOpenModal?: Dispatch<SetStateAction<boolean>>
  mutate: KeyedMutator<User>
  projectId: string
}

const AssignColaboradorForm = ({ setOpenModal, mutate, projectId }: IAssignColaboradorFormProps) => {
  const userStorage = JSON.parse(localStorage.getItem('user') ?? '{}')
  const { resource: user } = useGetResource<User>({ endpoint: ENDPOINTS.USER, id: userStorage.id })
  const { resource: project } = useGetResource<Project>({ 
    endpoint: ENDPOINTS.PROJECTS, 
    id: projectId 
  })
  const { resource: projectColaboradores } = useGetResource<User[]>({ 
    endpoint: `${ENDPOINTS.PROJECTS}/${projectId}/colaboradores` 
  })
  const { updateResource: updateProject } = useUpdateResource<Project>(ENDPOINTS.PROJECTS)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      colaboradores_ids: []
    }
  })

  // Inicializar con los colaboradores actuales del proyecto
  useEffect(() => {
    if (projectColaboradores) {
      form.setValue('colaboradores_ids', projectColaboradores.map(c => Number(c.id)))
    }
  }, [projectColaboradores, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!project) return

      const updatedProject = {
        ...project,
        colaboradores: data.colaboradores_ids,
        last_modified: new Date()
      }

      toast.promise(updateProject(updatedProject), {
        loading: 'Actualizando colaboradores...',
        success: () => {
          if (mutate) {
            void mutate()
          }
          setOpenModal?.(false)
          return 'Colaboradores actualizados exitosamente'
        },
        error: 'Error al actualizar los colaboradores'
      })
    } catch (error) {
      console.error(error)
      toast.error('Error al actualizar los colaboradores')
    }
  }

  const currentCollaboratorIds = projectColaboradores?.map(c => Number(c.id)) ?? []
  const availableUsers = user?.colaboradores?.filter(user => 
    !currentCollaboratorIds.includes(user.id)
  ) ?? []

  return (
    <section className="gap-4 lg:gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full flex flex-col gap-4 lg:gap-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Asignar Colaboradores al Proyecto</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid gap-4 lg:gap-6">
            {/* Colaboradores actuales */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Colaboradores actuales</h3>
              <div className="flex flex-wrap gap-2">
                {form.watch('colaboradores_ids').length > 0 ? (
                  form.watch('colaboradores_ids').map((id) => {
                    const colaborador = projectColaboradores?.find(c => Number(c.id) === id)
                    if (!colaborador) return null
                    return (
                      <Badge
                        key={id}
                        variant="default"
                        className="flex items-center gap-1"
                      >
                        {colaborador.name}
                        <button
                          type="button"
                          onClick={() => {
                            const currentIds = form.getValues('colaboradores_ids')
                            const newIds = currentIds.filter(currentId => currentId !== id)
                            form.setValue('colaboradores_ids', newIds)
                          }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No hay colaboradores asignados</p>
                )}
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Agregar nuevos colaboradores */}
            <FormField
              control={form.control}
              name="colaboradores_ids"
              render={({ field, fieldState }) => {
                const selectedIds = field.value ?? []
                const toggleId = (id: string) => {
                  const numId = Number(id)
                  if (selectedIds.includes(numId)) {
                    field.onChange(selectedIds.filter((item) => item !== numId))
                  } else {
                    field.onChange([...selectedIds, numId])
                  }
                }

                return (
                  <FormItem>
                    <FormLabel>Agregar colaboradores</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            type="button"
                            className={cn(
                              'justify-between font-normal w-full',
                              selectedIds.length === 0 && 'text-muted-foreground'
                            )}
                          >
                            {selectedIds.length > 0
                              ? `Has seleccionado ${selectedIds.length} colaboradores`
                              : 'Seleccionar colaboradores'
                            }
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        sideOffset={4}
                        className="w-[--radix-popover-trigger-width] z-50 border border-border bg-card p-2 rounded-md shadow-md"
                      >
                        <Command>
                          <CommandInput placeholder="Buscar colaborador..." />
                          <CommandList>
                            <CommandEmpty>No encontrado</CommandEmpty>
                            <CommandGroup>
                              {availableUsers.map((user) => {
                                const isSelected = selectedIds.includes(user.id)
                                return (
                                  <CommandItem
                                    key={user.id}
                                    value={user.name}
                                    onMouseDown={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      toggleId(user.id.toString())
                                    }}
                                    className='cursor-pointer hover:bg-accent bg-white dark:bg-dark-bg-primary dark:hover:bg-accent'
                                  >
                                    <CheckCheckIcon
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        isSelected ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {user.name}
                                  </CommandItem>
                                )
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {selectedIds.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedIds.map((id) => {
                          const user = availableUsers.find((u) => u.id === id)
                          if (!user) return null
                          return (
                            <Badge
                              key={id}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {user.name}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  toggleId(id.toString())
                                }}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                    {fieldState.error?.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                )
              }}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button type="submit">Asignar</Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </section>
  )
}

export default AssignColaboradorForm 