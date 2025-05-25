import { type InputComponent } from '@/modules/area_job/models/Components'

interface InputToolsProps {
  component: InputComponent
  setComponent: (comp: InputComponent) => void
}

export default function InputTools({ component, setComponent }: InputToolsProps) {
  return (
    <div className="space-y-3">
      {/* Placeholder */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Placeholder:</label>
        <input
          value={component.placeholder ?? ''}
          onChange={(e) => {
            setComponent({ ...component, placeholder: e.target.value })
          }}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Color de fondo */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Color fondo:</label>
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
          className="w-10 h-6 rounded border border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Bordes redondeados */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Bordes:</label>
        <input
          type="number"
          min={0}
          value={component.style?.borderRadius ?? 6}
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

      {/* Tamaño de texto */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Tamaño texto:</label>
        <input
          type="number"
          min={10}
          max={40}
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
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        />
      </div>

      {/* Color del texto */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Color texto:</label>
        <input
          type="color"
          value={component.style?.textStyle?.color ?? '#111827'}
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
    </div>
  )
}
