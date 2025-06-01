import { createElement, lazy } from 'react'
import { PrivateRoutes, type Route } from '@/models/routes.model'
import { type PERMISSION } from '@/modules/auth/utils/permissions.constants'

const ProfilePage = lazy(() => import('@/modules/users/pages/profile'))
const ProfileForm = lazy(() => import('@/modules/users/pages/profile/components/profile-form'))
const ProjectPage = lazy(() => import('@/modules/projects/pages/index'))
const ColaboradorPage = lazy(() => import('@/modules/projects/colaborador/index'))
const AreaPage = lazy(() => import('@/modules/area_job/pages/page'))

export const userRoutes: Route[] = [
  {
    path: PrivateRoutes.PROFILE,
    element: createElement(ProfilePage),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PROFILE_UPDATE,
    element: createElement(ProfileForm),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.PROJECTS,
    element: createElement(ProjectPage),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.COLABOLADOR,
    element: createElement(ColaboradorPage),
    permissions: [] as PERMISSION[]
  },
  {
    path: PrivateRoutes.AREA,
    element: createElement(AreaPage),
    permissions: [] as PERMISSION[]
  }
]
