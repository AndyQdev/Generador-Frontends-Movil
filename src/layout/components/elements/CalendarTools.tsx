import { type CalendarComponent } from '@/modules/area_job/models/Components'

interface Props {
  component: CalendarComponent
  setComponent: (comp: CalendarComponent) => void
}

export default function CalendarTools({ component, setComponent }: Props) {
  return (
    <div className="space-y-3">
      {/* Fecha seleccionada */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-gray-600 dark:text-gray-300 w-28">Fecha:</label>
        <input
          type="date"
          value={component.selectedDate}
          onChange={(e) => {
            setComponent({ ...component, selectedDate: e.target.value })
          }}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
        />
      </div>
    </div>
  )
}
