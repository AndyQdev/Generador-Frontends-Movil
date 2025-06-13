import { type BottomNavigationBarComponent } from '../../models/Components'
import { cn } from '@/lib/utils'
import { Home, Search, User, Star, Heart, Settings, Plus, Camera, Calendar, File, Folder, LineChart, Music, Lock, Download, type LucideIcon } from 'lucide-react'

export default function BottomNavigationBar({ comp }: { comp: BottomNavigationBarComponent }) {
  const {
    backgroundColor = '#ffffff',
    activeColor = '#1976d2',
    inactiveColor = '#757575',
    borderRadius = 0,
    items
  } = comp

  const getIcon = (iconName: string): LucideIcon => {
    const icons: Record<string, LucideIcon> = {
      Home,
      Search,
      User,
      Star,
      Heart,
      Settings,
      Plus,
      Camera,
      Calendar,
      File,
      Folder,
      LineChart,
      Music,
      Lock,
      Download
    }
    return icons[iconName] || Home
  }

  return (
    <nav
      className={cn(
        'w-full h-full flex items-center justify-around border-t',
        'shadow-[0_-1px_4px_rgba(0,0,0,0.1)] backdrop-blur-sm' // estilo similar al sidebar
      )}
      style={{ backgroundColor, borderRadius }} // ◀️
    >
      {items.map((item, idx) => {
        const Icon = getIcon(item.icon)
        return (
        <button
          key={idx}
          disabled
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium"
          style={{ color: item.isActive ? activeColor : inactiveColor }}
        >
            <Icon size={20} />
          {item.label}
        </button>
        )
      })}
    </nav>
  )
}
