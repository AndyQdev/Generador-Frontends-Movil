import { type CheckListComponent } from '@/modules/area_job/models/Components'

interface Props {
  component: CheckListComponent
  setComponent: (comp: CheckListComponent) => void
}

export default function CheckListTools({ component, setComponent }: Props) {
  return (
    <div className="space-y-3">
      {/* Estilo */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Estilo</h4>
        
        {/* Color de fondo */}
        <div className="flex items-center justify-between gap-2">
          <label className="text-gray-600 w-28">Color fondo:</label>
          <input
            type="color"
            value={component.style?.backgroundColor ?? '#ffffff'}
            onChange={(e) => {
              setComponent({
                ...component,
                style: {
                  ...component.style,
                  backgroundColor: e.target.value
                }
              })
            }}
            className="w-10 h-6 rounded border border-gray-300"
          />
        </div>

        {/* Border Radius */}
        <div className="flex items-center justify-between gap-2">
          <label className="text-gray-600 w-28">Borde redondeado:</label>
          <input
            type="number"
            min={0}
            max={50}
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
            className="flex-1 border rounded px-2 py-1 text-sm"
          />
        </div>

        {/* Color del texto */}
        <div className="flex items-center justify-between gap-2">
          <label className="text-gray-600 w-28">Color texto:</label>
          <input
            type="color"
            value={component.style?.textStyle?.color ?? '#000000'}
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
            className="w-10 h-6 rounded border border-gray-300"
          />
        </div>

        {/* Tamaño del texto */}
        <div className="flex items-center justify-between gap-2">
          <label className="text-gray-600 w-28">Tamaño texto:</label>
          <input
            type="number"
            min={8}
            max={32}
            value={component.style?.textStyle?.fontSize ?? 14}
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
            className="flex-1 border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Contenido</h4>
        
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
    </div>
  )
}
