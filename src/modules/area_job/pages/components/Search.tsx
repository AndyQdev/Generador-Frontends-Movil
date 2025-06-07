import { type SearchComponent } from '@/modules/area_job/models/Components'
import { Search as SearchIcon } from 'lucide-react' // o usa Heroicons si prefieres

interface Props {
  comp: SearchComponent
}

export default function Search({ comp }: Props) {
  return (
    <div className="w-full h-full relative">
      <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
      <input
        type="search"
        placeholder={comp.placeholder}
        defaultValue={comp.value}
        className="w-full h-full pl-8 pr-2 py-1"
        style={{
          backgroundColor: comp.style?.backgroundColor ?? '#ffffff',
          borderRadius: comp.style?.borderRadius ?? 6,
          border: comp.style?.border ?? '1px solid #e5e7eb',
          fontSize: comp.style?.textStyle?.fontSize ?? 14,
          color: comp.style?.textStyle?.color ?? '#111827'
        }}
      />
    </div>
  )
}
