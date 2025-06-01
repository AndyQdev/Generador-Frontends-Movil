import { type CalendarComponent } from '@/modules/area_job/models/Components'

interface Props {
  comp: CalendarComponent
}

export default function Calendar({ comp }: Props) {
  return (
    <input
      type="date"
      defaultValue={comp.selectedDate}
      className="w-full h-full border rounded px-2 py-1"
      style={{
        backgroundColor: comp.style?.backgroundColor ?? '#ffffff',
        borderRadius: comp.style?.borderRadius ?? 6,
        fontSize: comp.style?.textStyle?.fontSize ?? 14,
        color: comp.style?.textStyle?.color ?? '#111827'
      }}
    />
  )
}
