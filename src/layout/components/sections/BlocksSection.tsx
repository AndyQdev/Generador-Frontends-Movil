import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  ChevronRightIcon,
  Blocks
} from 'lucide-react'
import { useState } from 'react'
import { SquareMousePointerIcon } from 'lucide-react'

export default function BlocksSection() {
  const [isBlocksOpen, setIsBlocksOpen] = useState(true)

  return (
    <Collapsible className="w-full mt-6" open={isBlocksOpen} onOpenChange={setIsBlocksOpen}>
      <CollapsibleTrigger className="w-full group">
        <div className="flex items-center justify-between w-full px-2 py-2 rounded-md bg-muted hover:bg-muted/80">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Blocks size={18} /> Bloques
          </div>
          <ChevronRightIcon className="group-aria-expanded:rotate-90 transition-transform" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-3 py-4">
          {/* Listar */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-pink-500 bg-pink-50 text-pink-800 cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('component/type', 'listar')
            }}
          >
            <SquareMousePointerIcon size={16} />
            <span className="text-sm">CRUD</span>
          </div>
          {/* Header */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-yellow-500 bg-yellow-50 text-yellow-800 cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('component/type', 'header')
            }}
          >
            <SquareMousePointerIcon size={16} />
            <span className="text-sm">Header</span>
          </div>
          {/* Login */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-yellow-500 bg-yellow-50 text-yellow-800 cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('component/type', 'login')
            }}
          >
            <SquareMousePointerIcon size={16} />
            <span className="text-sm">Login</span>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
} 