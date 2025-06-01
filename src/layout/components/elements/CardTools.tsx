import { type CardComponent } from '@/modules/area_job/models/Components'

interface Props {
  component: CardComponent
  setComponent: (comp: CardComponent) => void
}

export default function CardTools({ component, setComponent }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="w-28">Título:</label>
        <input
          value={component.title}
          onChange={(e) => { setComponent({ ...component, title: e.target.value }) }}
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <label className="w-28">Contenido:</label>
        <textarea
          value={component.content}
          onChange={(e) => { setComponent({ ...component, content: e.target.value }) }}
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  )
}
