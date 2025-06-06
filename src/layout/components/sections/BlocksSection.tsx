import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { ChevronRight, Blocks } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'
import { BLOCKS } from '@/layout/utils/blocks-palette'

export default function BlocksSection() {
  const [isBlocksOpen, setIsBlocksOpen] = useState(true)

  return (
    <Collapsible className="w-full mt-6" open={isBlocksOpen} onOpenChange={setIsBlocksOpen}>
      <CollapsibleTrigger className="w-full group">
        <div className="flex items-center justify-between w-full px-2 py-2 rounded-md bg-muted hover:bg-muted/80">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Blocks size={18} /> Bloques
          </div>
          <ChevronRight className="group-aria-expanded:rotate-90 transition-transform" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-3 gap-3 pt-4">
          {BLOCKS.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              draggable
              onDragStart={(e) => { e.dataTransfer.setData('component/type', id) }}
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
