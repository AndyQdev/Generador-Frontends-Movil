import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  Boxes,
  ChevronRightIcon,
  FileInputIcon,
  SquareMousePointerIcon
} from 'lucide-react'
import { useState } from 'react'

export default function ComponentsSection() {
  const [isComponentsOpen, setIsComponentsOpen] = useState(true)

  return (
    <Collapsible className="w-full" open={isComponentsOpen} onOpenChange={setIsComponentsOpen}>
      <CollapsibleTrigger className="w-full group">
        <div className="flex items-center justify-between w-full px-2 py-2 rounded-md bg-muted hover:bg-muted/80">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Boxes size={18} /> Componentes
          </div>
          <ChevronRightIcon className="group-aria-expanded:rotate-90 transition-transform" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-2 gap-3 py-4">
          {/* Botón */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-blue-500 bg-blue-50 text-blue-800 cursor-move"
            draggable
            onDragStart={(e) => { e.dataTransfer.setData('component/type', 'button') }}
          >
            <SquareMousePointerIcon size={16} />
            <span className="text-sm">Botón</span>
          </div>
          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-green-500 bg-green-50 text-green-800 cursor-move"
            draggable
            onDragStart={(e) => { e.dataTransfer.setData('component/type', 'input') }}
          >
            <FileInputIcon size={16} />
            <span className="text-sm">Input</span>
          </div>

          {/* Select */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-cyan-500 bg-cyan-50 text-cyan-800 cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('component/type', 'select')
            }}
          >
            <SquareMousePointerIcon size={16} />
            <span className="text-sm">Select</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-lime-500 bg-lime-50 text-lime-800 cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('component/type', 'checklist')
            }}
          >
            <SquareMousePointerIcon size={16} />
            <span className="text-sm">Checklist</span>
          </div>
          <div
            className="flex items-center py-2 rounded border border-orange-500 bg-orange-50 text-orange-800 cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('component/type', 'radiobutton')
            }}
          >
            <SquareMousePointerIcon size={16} />
            <span className="text-sm">RadioButton</span>
          </div>
          {/* Sidebar */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-purple-500 bg-purple-50 text-purple-800 cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('component/type', 'sidebar')
            }}
          >
            <SquareMousePointerIcon size={16} />
            <span className="text-sm">Sidebar</span>
          </div>
          {/* Bottom Navigation */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-amber-500 bg-amber-50 text-amber-800 cursor-move"
            draggable
            onDragStart={(e) => { e.dataTransfer.setData('component/type', 'bottomNavigationBar') }}
          >
            <SquareMousePointerIcon size={16} />
            <span className="text-sm">Bottom Nav</span>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-indigo-500 bg-indigo-50 text-indigo-800 cursor-move"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('component/type', 'datatable')
            }}
          >
            <FileInputIcon size={16} />
            <span className="text-sm">Table</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-blue-500 bg-blue-50 text-blue-800 cursor-move"
            draggable
            onDragStart={(e) => { e.dataTransfer.setData('component/type', 'card') }}
          >
            <SquareMousePointerIcon size={16} />
            <span className="text-sm">Card</span>
          </div>
          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-green-500 bg-green-50 text-green-800 cursor-move"
            draggable
            onDragStart={(e) => { e.dataTransfer.setData('component/type', 'label') }}
          >
            <FileInputIcon size={16} />
            <span className="text-sm">Label</span>
          </div>
          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-green-500 bg-green-50 text-green-800 cursor-move"
            draggable
            onDragStart={(e) => { e.dataTransfer.setData('component/type', 'imagen') }}
          >
            <FileInputIcon size={16} />
            <span className="text-sm">Timagen</span>
          </div>
          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-green-500 bg-green-50 text-green-800 cursor-move"
            draggable
            onDragStart={(e) => { e.dataTransfer.setData('component/type', 'textArea') }}
          >
            <FileInputIcon size={16} />
            <span className="text-sm">TexArea</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-green-500 bg-green-50 text-green-800 cursor-move"
            draggable
            onDragStart={(e) => { e.dataTransfer.setData('component/type', 'calendar') }}
          >
            <FileInputIcon size={16} />
            <span className="text-sm">Calendario</span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded border border-green-500 bg-green-50 text-green-800 cursor-move"
            draggable
            onDragStart={(e) => { e.dataTransfer.setData('component/type', 'search') }}
          >
            <FileInputIcon size={16} />
            <span className="text-sm">Buscador</span>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
