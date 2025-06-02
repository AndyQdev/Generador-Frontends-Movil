import { type IconComponent } from '@/modules/area_job/models/Components'
import { type Project } from '@/modules/projects/models/project.model'
import { icons } from 'lucide-react'

interface IconToolsProps {
  component: IconComponent
  setComponent: (comp: IconComponent) => void
  project: Project
}

export default function IconTools({ component, setComponent }: IconToolsProps) {
  return (
    <div className="space-y-3">
      {/* Selección de ícono */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Ícono:</label>
        <select
        value={component.icon}
        onChange={(e) => {
          setComponent({ ...component, icon: e.target.value })
        }}
        className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        >
        {Object.keys(icons).sort().map((name) => (
            <option key={name} value={name}>
            {name}
            </option>
        ))}
        </select>
      </div>

      {/* Tamaño */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Tamaño:</label>
        <input
          type="number"
          min={8}
          max={128}
          value={component.size ?? 24}
          onChange={(e) => { setComponent({ ...component, size: parseInt(e.target.value) }) }
          }
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Color */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Color:</label>
        <input
          type="color"
          value={component.color ?? '#2563eb'}
          onChange={(e) => { setComponent({ ...component, color: e.target.value }) }
          }
          className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Bordes redondeados */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Bordes:</label>
        <input
          type="number"
          min={0}
          value={component.style?.borderRadius ?? 0}
          onChange={(e) => {
            setComponent({
              ...component,
              style: {
                ...component.style,
                borderRadius: parseInt(e.target.value)
              }
            })
          }
          }
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  )
}
