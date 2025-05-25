export interface BaseComponent {
  id: string
  x: number
  y: number
  width: number
  height: number
}
export interface ComponentStyle {
  backgroundColor?: string
  borderRadius?: number
  padding?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  textStyle?: {
    fontSize?: number
    fontWeight?: 'normal' | 'bold' | 'medium' | 'light'
    color?: string // Hex color
  }
  // extensible: podrías agregar más campos como margin, shadow, etc.
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
export interface ButtonComponent extends BaseComponent {
  type: 'button'
  label: string
  style?: ComponentStyle
  route?: string // para navegación opcional
}
export interface InputComponent extends BaseComponent {
  type: 'input'
  placeholder?: string
  value?: string
  style?: ComponentStyle
}

// Componentes que faltan crear ---------------------------------------------------------------

export interface LabelComponent extends BaseComponent {
  backgroundColor: string
  route: string
  type: 'label'
  text: string
  fontSize?: string
}

export interface SearchComponent extends BaseComponent {
  type: 'search'
  placeholder: string
}

export interface PaginationComponent extends BaseComponent {
  type: 'pagination'
  totalPages: number
  currentPage: number
}

// export interface HeaderComponent extends BaseComponent {
//   type: 'header'
//   backgroundColor?: string
//   sections: Array<{
//     label: string
//     route: string
//   }>
//   buttons: Array<{
//     icon: string
//     action?: string // acción futura si quieres asociarlo
//   }>
//   activeColor?: string // color para la sección seleccionada (ej: azul para "Proyectos")
// }

export interface SelectComponent extends BaseComponent {
  type: 'select'
  options: string[]
  value?: string
}

export interface DialogComponent extends BaseComponent {
  type: 'dialog'
  title: string
  fields: Array<{
    label: string
    type: SelectComponent | InputComponent
  }>
}

export interface DataTableComponent extends BaseComponent {
  type: 'datatable'
  headers: string[] // Ej: ['Id', 'Nombre', 'Descripción']
  rows: string[][] // Ej: [['1', 'Proyecto X', 'Descripción...'], ...]
  backgroundColor?: string
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

export interface CardComponent extends BaseComponent {
  type: 'card'
  backgroundColor?: string
  borderRadius?: string
  padding?: string
  shadow?: boolean
}

export interface LoginComponent extends Omit<BaseComponent, 'label'> {
  type: 'login'
  card: CardComponent
  title: LabelComponent
  subtitle: LabelComponent
  emailInput: InputComponent
  passwordInput: InputComponent
  loginButton: ButtonComponent
  googleButton: ButtonComponent
  signupLink: LabelComponent
}
export interface ChecklistComponent extends BaseComponent {
  type: 'checklist'
  items: Array<{
    label: string
    checked: boolean
  }>
  title?: string
}
export interface RadioButtonComponent extends BaseComponent {
  type: 'radiobutton'
  options: string[]
  selected?: string
  name?: string // grupo común
}
