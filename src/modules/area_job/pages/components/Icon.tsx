import { type IconComponent } from '@/modules/area_job/models/Components'
import {
  AlertCircle,
  type LucideIcon,
  icons
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = icons

interface Props {
  comp: IconComponent
}

export default function Icon({ comp }: Props) {
  const {
    icon,
    color = '#2563eb',
    size = 60,
    style
  } = comp

  const IconElement = iconMap[icon] ?? AlertCircle

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        backgroundColor: style?.backgroundColor ?? 'transparent',
        borderRadius: style?.borderRadius ?? 0,
        padding: 4
      }}
    >
      <IconElement size={size} color={color} />
    </div>
  )
}
