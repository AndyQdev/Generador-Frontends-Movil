import { type ImagenComponent } from '@/modules/area_job/models/Components'

interface Props {
  component: ImagenComponent
  setComponent: (comp: ImagenComponent) => void
}

export default function ImagenTools({ component, setComponent }: Props) {
  return (
    <div className="space-y-3">
      {/* URL de imagen */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">URL Imagen:</label>
        <input
          value={component.src}
          onChange={(e) => { setComponent({ ...component, src: e.target.value }) }}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
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
    </div>
  )
}
