// components/preview/Sidebar.tsx
import { cn } from '@/lib/utils'
import { type SidebarComponent } from '../../models/Components'

export default function Sidebar({
  comp,
  isOpen,
  onClose
}: {
  comp: SidebarComponent
  isOpen: boolean
  onClose?: () => void
}) {
  const mainColor = comp.mainColor ?? '#a855f7'
  const asideBg = comp.asideBg ?? '#ffffff'
  const titleIcon = comp.titleIcon ?? 'star'

  return (
    <aside
      className={cn(
        'absolute top-0 left-0 bottom-0 z-50 flex flex-col border-r overflow-hidden',
        'w-64', // ancho fijo
        'transform transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
      style={{ backgroundColor: asideBg }}
    >
      {/* ╭─ Header ────────────────────────────────╮ */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <i className={`fa fa-${titleIcon} text-xl`} style={{ color: mainColor }} />
          <h1
            className="text-lg font-bold truncate transition-opacity duration-200"
            style={{ opacity: isOpen ? 1 : 0 }}
          >
            {comp.title || 'UI SKETCH'}
          </h1>
        </div>

        {onClose && (
          <button
            className="w-6 h-6 grid place-items-center rounded hover:bg-gray-200 transition"
            onClick={onClose}
            title="Cerrar"
            style={{ color: mainColor }}
          >
            <i className="fa fa-times text-sm" />
          </button>
        )}
      </div>

      {/* ╭─ Secciones ─────────────────────────────╮ */}
      <nav
        className={cn(
          'flex-1 overflow-y-auto p-4 space-y-2 text-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 delay-150' : 'opacity-0'
        )}
      >
        {comp.sections.map((s, i) => (
          <a
            key={i}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition',
              comp.select === i && 'font-semibold'
            )}
            style={{
              backgroundColor: comp.select === i ? `${mainColor}20` : undefined,
              color: comp.select === i ? mainColor : undefined
            }}
          >
            <i className={`fa fa-${s.icon} text-base`} />
            {isOpen && s.label}
          </a>
        ))}
      </nav>

      {/* ╰─ Footer / Config ───────────────────────╯ */}
      <div className="p-4 border-t">
        <button
          className="w-full flex items-center justify-center gap-2 py-2 rounded hover:opacity-90 transition"
          style={{ backgroundColor: mainColor, color: 'white' }}
        >
          <i className="fa fa-gear" />
          {isOpen && 'Configuración'}
        </button>
      </div>
    </aside>
  )
}
