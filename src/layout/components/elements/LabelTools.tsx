import { type LabelComponent } from '@/modules/area_job/models/Components'

interface Props {
  component: LabelComponent
  setComponent: (comp: LabelComponent) => void
}

export default function LabelTools({ component, setComponent }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="w-28">Texto:</label>
        <input
          value={component.text}
          onChange={(e) => { setComponent({ ...component, text: e.target.value }) }}
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  )
}
