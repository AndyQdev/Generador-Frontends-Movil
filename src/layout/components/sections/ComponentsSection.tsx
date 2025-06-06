import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/ui/collapsible'
import { Boxes, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { useState } from 'react'
import { COMPONENTS } from '@/layout/utils/components-palette'

export default function ComponentsSection() {
  const [open, setOpen] = useState(true)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      {/* ─── Cabezera desplegable ─────────────────────────── */}
      <CollapsibleTrigger className="w-full group">
        <div className="flex items-center justify-between w-full px-2 py-2 rounded-md
                        bg-muted hover:bg-muted/80 transition-colors">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Boxes size={18} /> Componentes
          </span>
          <ChevronRight className="transition-transform group-aria-expanded:rotate-90" />
        </div>
      </CollapsibleTrigger>

      {/* ─── Contenido ────────────────────────────────────── */}
      <CollapsibleContent className="pb-2">
        <div className="grid grid-cols-3 gap-3 pt-4">
          {COMPONENTS.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              draggable
              onDragStart={e => { e.dataTransfer.setData('component/type', id) }}
              className={clsx(
                'flex flex-col items-center justify-center gap-1 p-2 rounded-lg border text-xs cursor-move font-medium',
                `border-${color}-500 dark:bg-[#1e293b] bg-[#f1f5f9] text-${color}-800`,
                'hover:scale-105 hover:shadow transition-transform'
              )}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
