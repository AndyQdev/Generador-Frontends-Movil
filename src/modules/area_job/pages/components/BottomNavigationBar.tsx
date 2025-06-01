import { type BottomNavigationBarComponent } from '../../models/Components'
import { cn } from '@/lib/utils'

export default function BottomNavigationBar({ comp }: { comp: BottomNavigationBarComponent }) {
  const {
    backgroundColor = '#ffffff',
    activeColor = '#1976d2',
    inactiveColor = '#757575',
    borderRadius = 0,
    items
  } = comp

  return (
    <nav
      className={cn(
        'w-full h-full flex items-center justify-around border-t',
        'shadow-[0_-1px_4px_rgba(0,0,0,0.1)] backdrop-blur-sm' // estilo similar al sidebar
      )}
      style={{ backgroundColor, borderRadius }} // ◀️
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          disabled
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium"
          style={{ color: item.isActive ? activeColor : inactiveColor }}
        >
          <i className={`fa fa-${item.icon} text-lg`} />
          {item.label}
        </button>
      ))}
    </nav>
  )
}
