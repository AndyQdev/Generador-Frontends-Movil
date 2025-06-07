// components-palette.ts
import {
  SquareMousePointer,
  FileInput,
  MousePointerClick,
  CalendarClock,
  Search,
  Image,
  Type,
  Table,
  PanelTopInactive,
  LayoutTemplate,
  Radio,
  CheckCircle,
  Ellipsis
} from 'lucide-react'

export const COMPONENTS = [
  { id: 'button', label: 'Botón', icon: MousePointerClick, color: 'white' },
  { id: 'input', label: 'Input', icon: FileInput, color: 'white' },
  { id: 'select', label: 'Select', icon: LayoutTemplate, color: 'white' },
  { id: 'checklist', label: 'Checklist', icon: CheckCircle, color: 'white' },
  { id: 'radiobutton', label: 'Radio', icon: Radio, color: 'white' },
  { id: 'card', label: 'Card', icon: PanelTopInactive, color: 'white' },
  { id: 'datatable', label: 'Tabla', icon: Table, color: 'white' },
  { id: 'label', label: 'Label', icon: Type, color: 'white' },
  { id: 'imagen', label: 'Imagen', icon: Image, color: 'white' },
  { id: 'textArea', label: 'TextArea', icon: FileInput, color: 'white' },
  { id: 'calendar', label: 'Calendario', icon: CalendarClock, color: 'white' },
  { id: 'search', label: 'Buscador', icon: Search, color: 'white' },
  { id: 'icon', label: 'Ícono', icon: SquareMousePointer, color: 'white' },
  { id: 'bottomNavigationBar', label: 'Bottom Nav', icon: Ellipsis, color: 'white' }
] as const
