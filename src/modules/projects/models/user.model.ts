import { type ApiBase } from '@/models/api-base'
import { type Project } from './project.model'

export interface User {
  id: number
  email: string
  name: string
  telefono: string
  rol: 'admin' | 'colaborador'
  total_colaboradores: number
  proyectos: Project[]
  colaboradores?: User[]
  admin?: {
    id: number
    email: string
    name: string
  } | null
}

export interface UpdateUser {
  id: string
  name: string
  telefono: string
  email: string
}

export interface Colaborador extends ApiBase {
  name: string
  telefono: string
  email: string
  proyectos: Project[]
}

export interface CreateColaborador {
  name: string
  telefono: string
  email: string
  password: string
  proyectos_ids: number[]
}

export interface UpdateColaborador {
  id: string
  name: string
  telefono: string
  email: string
  proyectos_ids: number[]
}
