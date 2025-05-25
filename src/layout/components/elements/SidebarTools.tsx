import { type HeaderComponent } from '@/modules/area_job/models/Components'
import { Button } from '@/components/ui/button'

interface HeaderToolsProps {
  component: HeaderComponent
  setComponent: (comp: HeaderComponent) => void
  project: any // Para mapear páginas disponibles
  openTitleIconPicker: () => void
  openSectionIconPicker: (index: number) => void
}

export default function HeaderTools({
  component,
  setComponent,
  project,
  openTitleIconPicker,
  openSectionIconPicker
}: HeaderToolsProps) {
  const sidebar = component.sidebar

  const updateSidebar = (updates: Partial<typeof sidebar>) => {
    setComponent({
      ...component,
      sidebar: { ...component.sidebar, ...updates }
    })
  }

  return (
    <div className="space-y-4">
      {/* Título del Header */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Título:</label>
        <input
          value={component.title}
          onChange={(e) => { setComponent({ ...component, title: e.target.value }) }}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Color principal */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Color principal:</label>
        <input
          type="color"
          value={component.color ?? '#2563eb'}
          onChange={(e) => { setComponent({ ...component, color: e.target.value }) }}
          className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
        />
      </div>

      <hr className="my-3 border-t border-gray-300" />

      {/* Icono y título del Sidebar */}
      <div className="grid grid-cols-2 gap-2 items-center text-xs font-semibold text-gray-600 dark:text-gray-300">
        <span>Icono</span>
        <span>Título</span>
      </div>
      <div className="grid grid-cols-2 gap-2 items-center mt-2">
        <button
          onClick={openTitleIconPicker}
          className="border rounded flex items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <i className={`fa fa-${sidebar.titleIcon ?? 'star'} text-lg`}></i>
        </button>
        <input
          value={sidebar.title}
          onChange={(e) => { updateSidebar({ title: e.target.value }) }}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Colores */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Color total:</label>
        <input
          type="color"
          value={sidebar.mainColor ?? '#a855f7'}
          onChange={(e) => { updateSidebar({ mainColor: e.target.value }) }}
          className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Fondo aside:</label>
        <input
          type="color"
          value={sidebar.asideBg ?? '#ffffff'}
          onChange={(e) => { updateSidebar({ asideBg: e.target.value }) }}
          className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Sección activa */}
      <div className="mt-4 space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sección activa:</label>
        <select
          value={sidebar.select ?? 0}
          onChange={(e) => { updateSidebar({ select: parseInt(e.target.value) }) }}
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        >
          {sidebar.sections.map((sec, idx) => (
            <option key={idx} value={idx}>
              {sec.label || `Sección ${idx + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* Edición de secciones */}
      <div className="grid grid-cols-3 gap-2 items-center text-xs font-semibold text-gray-600 dark:text-gray-300">
        <span>Icono</span>
        <span>Label</span>
        <span>Ruta</span>
      </div>

      {sidebar.sections.map((sec, idx) => (
        <div key={idx} className="grid grid-cols-3 gap-2 items-center mt-2">
          <button
            onClick={() => { openSectionIconPicker(idx) }}
            className="border rounded flex items-center justify-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <i className={`fa fa-${sec.icon} text-lg`}></i>
          </button>
          <input
            value={sec.label}
            onChange={(e) => {
              const updated = [...sidebar.sections]
              updated[idx].label = e.target.value
              updateSidebar({ sections: updated })
            }}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
          />
          <select
            value={sec.route}
            onChange={(e) => {
              const updated = [...sidebar.sections]
              updated[idx].route = e.target.value
              updateSidebar({ sections: updated })
            }}
            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
          >
            <option value="">—</option>
            {Array.isArray(project?.pages) && project.pages.map((page: any) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Botón agregar sección */}
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => {
            updateSidebar({
              sections: [
                ...sidebar.sections,
                { icon: 'star', label: 'Nueva', route: '' }
              ]
            })
          }}
          className="text-sm px-4 py-2 rounded w-full transition"
        >
          + Agregar sección
        </Button>
      </div>
    </div>
  )
}
