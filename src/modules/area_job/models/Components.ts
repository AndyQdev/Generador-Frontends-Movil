export interface BaseComponent {
  id: string
  x: number
  y: number
  width: number
  height: number
  locked?: boolean
}
export interface ComponentStyle {
  backgroundColor?: string
  borderRadius?: number
  border?: string
  padding?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  textStyle?: {
    fontSize?: number
    fontWeight?: 'normal' | 'bold' | 'medium' | 'light'
    color?: string
  }
}

export interface Section {
  icon: string
  label: string
  route: string
}
export interface SidebarComponent extends BaseComponent {
  type: 'sidebar'
  title: string
  titleIcon?: string
  mainColor?: string
  asideBg?: string
  select?: number
  sections: Section[]
}
export interface HeaderComponent extends BaseComponent {
  type: 'header'
  title: string
  color?: string
  sidebar?: SidebarComponent
}
export interface DataTableComponent extends BaseComponent {
  type: 'datatable'
  headers: string[] // Ej: ['Id', 'Nombre', 'Descripción']
  rows: string[][] // Ej: [['1', 'Proyecto X', 'Descripción...'], ...]
  backgroundColor?: string
}
export interface IconComponent extends BaseComponent {
  type: 'icon'
  icon: string
  color?: string
  size?: number
  style?: ComponentStyle
}

export interface CalendarComponent extends BaseComponent {
  type: 'calendar'
  selectedDate?: string // formato YYYY-MM-DD
  style?: ComponentStyle
}
export interface SearchComponent extends BaseComponent {
  type: 'search'
  placeholder: string
  value?: string
  style?: ComponentStyle
}
export interface TextAreaComponent extends BaseComponent {
  type: 'textArea'
  placeholder?: string
  value?: string
  style?: ComponentStyle
}

export interface ImagenComponent extends BaseComponent {
  type: 'imagen'
  src: string // URL o base64 de la imagen
  style?: ComponentStyle
}
export interface FormularioComponent extends BaseComponent {
  type: 'formulario'
  title: LabelComponent
  fields: Array<InputComponent | SelectComponent | LabelComponent | CheckListComponent | RadioButtonComponent | TextAreaComponent | CalendarComponent>
  button: ButtonComponent
  style?: ComponentStyle
}
export interface LoginComponent extends BaseComponent {
  type: 'login'
  card: CardComponent
  label: LabelComponent
  inputs: [InputComponent, InputComponent] // email y password
  button: ButtonComponent
}

export interface CardComponent extends BaseComponent {
  type: 'card'
  title: string
  content: string
  style?: ComponentStyle
}

export interface LabelComponent extends BaseComponent {
  type: 'label'
  text: string
  style?: ComponentStyle
}
export interface InputComponent extends BaseComponent {
  type: 'input'
  placeholder?: string
  value?: string
  style?: ComponentStyle
}
export interface ButtonComponent extends BaseComponent {
  type: 'button'
  label: string
  style?: ComponentStyle
  route?: string // para navegación opcional
}
export interface SelectComponent extends BaseComponent {
  type: 'select'
  label?: string
  options: string[]
  selectedOption?: string
  style?: ComponentStyle
}

export interface CheckListComponent extends BaseComponent {
  type: 'checklist'
  label?: string
  options: string[]
  selectedOptions?: string[]
  style?: ComponentStyle
}

export interface RadioButtonComponent extends BaseComponent {
  type: 'radiobutton'
  label?: string
  options: string[]
  selectedOption?: string
  style?: ComponentStyle
}

export interface PaginationComponent extends BaseComponent {
  type: 'pagination'
  totalPages: number
  currentPage: number
}

export interface DialogComponent extends BaseComponent {
  type: 'dialog'
  title: string
  fields: Array<{
    label: string
    type: SelectComponent | InputComponent
  }>
}

export interface ListarComponent extends Omit<BaseComponent, 'label'> {
  type: 'listar'
  button: ButtonComponent
  dataTable: DataTableComponent
  label: LabelComponent
  search: SearchComponent
  pagination: PaginationComponent
  dialog: DialogComponent
}

export interface BottomNavItem {
  icon: string
  label: string
  route: string
  isActive?: boolean
}

export interface BottomNavigationBarComponent extends BaseComponent {
  type: 'bottomNavigationBar'
  backgroundColor?: string
  activeColor?: string
  inactiveColor?: string
  borderRadius?: number
  items: BottomNavItem[]
}
