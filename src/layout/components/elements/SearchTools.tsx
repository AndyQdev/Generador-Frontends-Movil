import { type SearchComponent } from '@/modules/area_job/models/Components'

interface Props {
  component: SearchComponent
  setComponent: (comp: SearchComponent) => void
}

export default function SearchTools({ component, setComponent }: Props) {
  return (
    <div className="space-y-3">
      {/* Placeholder */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Placeholder:</label>
        <input
          value={component.placeholder}
          onChange={(e) => {
            setComponent({ ...component, placeholder: e.target.value })
          }}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  )
}
