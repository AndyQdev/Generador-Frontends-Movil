import { type ApiBase } from '@/models/api-base'
import { type Page } from './page.model'

export interface Project extends ApiBase {
  name: string
  descripcion: string
  status: string
  create_date: Date
  pages: Page[]
  last_modified: Date
  colaboradores?: number[]
}

export interface CreateProject extends Partial<Omit<Project, 'status' | 'create_date' | 'pages'>> {
  colaboradorId: number[]
}

export interface UpdateProject extends ApiBase {
  name: string
  descripcion: string
  status: string
  create_date: Date
  pages: Page[]
  last_modified: Date
  colaboradores?: number[]
}
