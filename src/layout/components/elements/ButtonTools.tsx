import { type ButtonComponent } from '@/modules/area_job/models/Components'
import { type Project } from '@/modules/projects/models/project.model'

interface ButtonToolsProps {
  component: ButtonComponent
  setComponent: (comp: ButtonComponent) => void
  project: Project
}

export default function ButtonTools({ component, setComponent, project }: ButtonToolsProps) {
  return (
    <div className="space-y-3">
      {/* Texto */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Texto:</label>
        <input
          value={component.label}
          onChange={(e) => {
            setComponent({ ...component, label: e.target.value })
          }}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Color de fondo */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Color fondo:</label>
        <input
          type="color"
          value={component.style?.backgroundColor ?? '#2563eb'}
          onChange={(e) => {
            setComponent({
              ...component,
              style: {
                ...component.style,
                backgroundColor: e.target.value
              }
            })
          }}
          className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Bordes redondeados */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Bordes:</label>
        <input
          type="number"
          min={0}
          value={component.style?.borderRadius ?? 8}
          onChange={(e) => {
            setComponent({
              ...component,
              style: {
                ...component.style,
                borderRadius: parseInt(e.target.value)
              }
            })
          }}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Tamaño del texto */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Tamaño texto:</label>
        <input
          type="number"
          min={10}
          max={40}
          value={component.style?.textStyle?.fontSize ?? 16}
          onChange={(e) => {
            setComponent({
              ...component,
              style: {
                ...component.style,
                textStyle: {
                  ...component.style?.textStyle,
                  fontSize: parseInt(e.target.value)
                }
              }
            })
          }}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Peso de fuente */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Peso fuente:</label>
        <select
          value={component.style?.textStyle?.fontWeight ?? 'normal'}
          onChange={(e) => {
            setComponent({
              ...component,
              style: {
                ...component.style,
                textStyle: {
                  ...component.style?.textStyle,
                  fontWeight: e.target.value as 'normal' | 'bold' | 'medium' | 'light'
                }
              }
            })
          }}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="medium">Medium</option>
          <option value="light">Light</option>
        </select>
      </div>

      {/* Color del texto */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Color texto:</label>
        <input
          type="color"
          value={component.style?.textStyle?.color ?? '#ffffff'}
          onChange={(e) => {
            setComponent({
              ...component,
              style: {
                ...component.style,
                textStyle: {
                  ...component.style?.textStyle,
                  color: e.target.value
                }
              }
            })
          }}
          className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
        />
      </div>
        {/* Selector de Página Destino */}
        <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Página:</label>
        <select
            value={component.route ?? ''}
            onChange={(e) => {
              setComponent({
                ...component,
                route: e.target.value
              })
            }}
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        >
            <option value="">—</option>
            {project?.pages?.map((page) => (
            <option key={page.id} value={page.id}>
                {page.name}
            </option>
            ))}
        </select>
        </div>
    </div>
  )
}
