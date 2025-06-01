import { type SelectComponent } from '@/modules/area_job/models/Components'

interface SelectToolsProps {
  component: SelectComponent
  setComponent: (comp: SelectComponent) => void
}

export default function SelectTools({ component, setComponent }: SelectToolsProps) {
  return (
    <div className="space-y-3">
      {/* Etiqueta */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Etiqueta:</label>
        <input
          value={component.label}
          onChange={(e) => { setComponent({ ...component, label: e.target.value }) }
          }
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Opciones */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-600 dark:text-gray-300">Opciones:</label>
        {component.options.map((opt, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={opt}
              onChange={(e) => {
                const newOptions = [...component.options]
                newOptions[i] = e.target.value
                setComponent({ ...component, options: newOptions })
              }}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
            />
            <button
              className="text-red-500"
              onClick={() => {
                const newOptions = component.options.filter((_, idx) => idx !== i)
                setComponent({ ...component, options: newOptions })
              }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => { setComponent({ ...component, options: [...component.options, 'Nueva opción'] }) }}
          className="text-blue-600 text-sm mt-2"
        >
          + Añadir opción
        </button>
      </div>
    </div>
  )
}
