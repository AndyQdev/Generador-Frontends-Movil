import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  ChevronRightIcon,
  HousePlug
} from 'lucide-react'
import { useState } from 'react'
import { useComponentContext } from '@/context/ComponentContext'
import { useGetResource } from '@/hooks/useApiResource'
import { type Project } from '@/modules/projects/models/project.model'
import { ENDPOINTS } from '@/utils'
import ButtonTools from '../elements/ButtonTools'
import InputTools from '../elements/InputTools'
import HeaderTools from '../elements/SidebarTools'
import BottomNavigationTools from '../elements/BottomNavigationTools'
import DataTableTools from '../elements/DataTableTools'
import SelectTools from '../elements/SelectTools'
import CheckListTools from '../elements/CheckListTools'
import RadioButtonTools from '../elements/RadioButtonTools'
import CardTools from '../elements/CardTools'
import LabelTools from '../elements/LabelTools'
import TextAreaTools from '../elements/TextAreaTools'
import ImagenTools from '../elements/ImagenTools'
import SearchTools from '../elements/SearchTools'
import CalendarTools from '../elements/CalendarTools'
import IconTools from '../elements/Icons'

export default function ToolsSection() {
  const [isHerramientaOpen, setIsHerramientaOpen] = useState(true)
  const { selectedComponent, setSelectedComponent, selectedPage, setSelectedPage, updatePage } = useComponentContext()
  const { resource: project } = useGetResource<Project>({ endpoint: ENDPOINTS.ULTIMO_PROJECT })

  if (!selectedComponent) return null

  return (
    <Collapsible className="w-full mt-6 mb-6" open={isHerramientaOpen} onOpenChange={setIsHerramientaOpen}>
      <CollapsibleTrigger className="w-full group">
        <div className="flex items-center justify-between w-full px-2 py-2 rounded-md bg-muted hover:bg-muted/80">
          <div className="flex items-center gap-2 text-sm font-medium">
            <HousePlug size={18} /> Herramientas
          </div>
          <ChevronRightIcon className="group-aria-expanded:rotate-90 transition-transform" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent
        className="
          data-[state=open]:overflow-y-auto
          data-[state=open]:max-h-[calc(100dvh-220px)]
          pr-1
        "
      >
        <div className="flex flex-col w-full">
          {selectedPage && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary">Configuración de Página</h3>

              {/* Nombre */}
              <div className="flex items-center justify-between gap-2">
                <label className="text-gray-600 dark:text-gray-300 w-28">Nombre:</label>
                <input
                  value={selectedPage.name}
                  onChange={(e) => {
                    const updatedPage = { ...selectedPage, name: e.target.value }
                    setSelectedPage(updatedPage)
                    updatePage(updatedPage)
                  }}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>

              {/* Color de fondo */}
              <div className="flex items-center justify-between gap-2">
                <label className="text-gray-600 dark:text-gray-300 w-28">Color fondo:</label>
                <input
                  type="color"
                  value={selectedPage.background_color ?? '#ffffff'}
                  onChange={(e) => {
                    const updatedPage = { ...selectedPage, background_color: e.target.value }
                    setSelectedPage(updatedPage)
                    updatePage(updatedPage)
                  }}
                  className="w-10 h-6 rounded border border-gray-300"
                />
              </div>

              {/* Orden */}
              <div className="flex items-center justify-between gap-2">
                <label className="text-gray-600 dark:text-gray-300 w-28">Orden:</label>
                <input
                  type="number"
                  min={0}
                  value={selectedPage.order ?? 0}
                  onChange={(e) => {
                    const updatedPage = { ...selectedPage, order: parseInt(e.target.value) }
                    setSelectedPage(updatedPage)
                    updatePage(updatedPage)
                  }}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          )}
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 mt-3">
            Editando: <span className="capitalize text-primary">{selectedComponent.type}</span>
          </div>

          {/* Para Button */}
          {selectedComponent.type === 'button' && project && (
            <div className="space-y-3">
              <ButtonTools
                component={selectedComponent}
                setComponent={(updated) => { setSelectedComponent(updated) }}
                project={project}
              />
              <div className='h-96'>
              </div>
            </div>
          )}

          {/* Para Input */}
          {selectedComponent.type === 'input' && (
            <div className="space-y-3">
              <InputTools
                component={selectedComponent}
                setComponent={(updated) => { setSelectedComponent(updated) }}
              />
              <div className='h-96'>
              </div>
            </div>
          )}

          {selectedComponent.type === 'header' && (
            <div className="space-y-3">
              <HeaderTools
                component={selectedComponent}
                setComponent={setSelectedComponent}
                project={project}
                openTitleIconPicker={() => {}}
                openSectionIconPicker={() => {}}
              />
              <div className='h-96'>
              </div>
            </div>
          )}

          {selectedComponent.type === 'bottomNavigationBar' && (
            <div className="space-y-3">
              <BottomNavigationTools
                component={selectedComponent}
                setComponent={setSelectedComponent}
                project={project}
              />
              <div className='h-96'>
              </div>
            </div>
          )}

          {selectedComponent.type === 'datatable' && (
            <div className="space-y-3">
              <DataTableTools
                component={selectedComponent}
                setComponent={setSelectedComponent}
              />
              <div className='h-96'>
              </div>
            </div>
          )}

          {selectedComponent.type === 'select' && (
            <div className="space-y-3">
              <SelectTools
                component={selectedComponent}
                setComponent={setSelectedComponent}
              />
              <div className='h-96'></div>
            </div>
          )}
          {selectedComponent.type === 'checklist' && (
            <div className="space-y-3">
              <CheckListTools
                component={selectedComponent}
                setComponent={setSelectedComponent}
              />
              <div className='h-96'></div>
            </div>
          )}

          {selectedComponent.type === 'radiobutton' && (
            <div className="space-y-3">
              <RadioButtonTools
                component={selectedComponent}
                setComponent={setSelectedComponent}
              />
              <div className='h-96'></div>
            </div>
          )}
          {selectedComponent.type === 'card' && (
            <div className="space-y-3">
              <CardTools component={selectedComponent} setComponent={setSelectedComponent} />
              <div className="h-96"></div>
            </div>
          )}

          {selectedComponent.type === 'label' && (
            <div className="space-y-3">
              <LabelTools component={selectedComponent} setComponent={setSelectedComponent} />
              <div className="h-96"></div>
            </div>
          )}
          {selectedComponent.type === 'textArea' && (
            <div className="space-y-3">
              <TextAreaTools
                component={selectedComponent}
                setComponent={(updated) => { setSelectedComponent(updated) }}
              />
              <div className="h-96"></div>
            </div>
          )}

          {selectedComponent.type === 'imagen' && (
            <div className="space-y-3">
              <ImagenTools
                component={selectedComponent}
                setComponent={(updated) => { setSelectedComponent(updated) }}
              />
              <div className="h-96"></div>
            </div>
          )}
          {selectedComponent.type === 'search' && (
            <div className="space-y-3">
              <SearchTools
                component={selectedComponent}
                setComponent={(updated) => { setSelectedComponent(updated) }}
              />
              <div className="h-96"></div>
            </div>
          )}

          {selectedComponent.type === 'calendar' && (
            <div className="space-y-3">
              <CalendarTools
                component={selectedComponent}
                setComponent={(updated) => { setSelectedComponent(updated) }}
              />
              <div className="h-96"></div>
            </div>
          )}
          {selectedComponent.type === 'icon' && project && (
            <IconTools
              component={selectedComponent}
              setComponent={(updated) => { setSelectedComponent(updated) }}
              project={project}
            />
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
