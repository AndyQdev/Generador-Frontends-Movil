import { type CheckListComponent } from '@/modules/area_job/models/Components'

interface Props {
  component: CheckListComponent
  setComponent: (comp: CheckListComponent) => void
}

export default function CheckListTools({ component, setComponent }: Props) {
  return (
    <div className="space-y-3">
      {/* Etiqueta */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 w-28">Etiqueta:</label>
        <input
          value={component.label}
          onChange={(e) => { setComponent({ ...component, label: e.target.value }) }}
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Opciones */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-600">Opciones:</label>
        {component.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={opt}
              onChange={(e) => {
                const opts = [...component.options]
                opts[i] = e.target.value
                setComponent({ ...component, options: opts })
              }}
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              onClick={() => {
                const newOpts = component.options.filter((_, idx) => idx !== i)
                setComponent({ ...component, options: newOpts })
              }}
              className="text-red-500"
            >✕</button>
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
