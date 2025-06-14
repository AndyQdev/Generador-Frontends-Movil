import { STORAGE_TOKEN, getStorage } from '.'
import { type ApiResponse, type FilterOptions } from '../models'
import { ResponseError } from './response-error.utils'

export const generateQueryParams = ({ offset, limit, order, ...rest }: FilterOptions): string => {
  const queryParams = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
    order: order.toString()
  })

  Object.entries(rest).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value.toString())
    }
  })

  return queryParams.toString()
}

export const handleResponseErrors = async (response: Response) => {
  if (!response.ok) {
    const errorResponse: ApiResponse = await response.json()
    const error = new ResponseError('Ocurrio un error al realizar la solicitud', errorResponse)
    throw error
  }
}

export const fetchData = async (url: string, options?: RequestInit, typeBlob?: boolean) => {
  const token = getStorage(STORAGE_TOKEN)
  const authorizationHeader = { Authorization: `Bearer ${token}` }
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...options?.headers,
      ...authorizationHeader
    }
  }

  if (!options || (options && !(options.body instanceof FormData))) {
    requestOptions.headers = {
      ...requestOptions.headers,
      'Content-Type': 'application/json'
    }
  }
  console.log('URL de la petición:', url)
  console.log('Opciones de la petición:', requestOptions)
  const response = await fetch(url, requestOptions)
  console.log('Respuesta de la API:', response)
  await handleResponseErrors(response)
  const data = !typeBlob ? await response.json() : response
  console.log('Datos de la respuesta:', data)
  return data
}

type QueryOptions = Record<string, string | number | undefined>

export const generateQueryParamsGeneric = (queryOption: QueryOptions): string => {
  const queryParams = new URLSearchParams()

  for (const key in queryOption) {
    if (queryOption[key] !== undefined) {
      queryParams.append(key, queryOption[key].toString())
    }
  }

  return queryParams.toString()
}
// Esto: 'extends Record<string, any>' indica que debe ser un objeto
export const convertObjectToFormData = (obj: Record<string, File | unknown>): FormData => {
  const formData = new FormData()

  for (const key in obj) {
    if (key in obj) {
      const value = obj[key]
      if (value !== undefined && value !== null) {
        if (value instanceof Array) {
          value.forEach((element) => {
            formData.append(`${key}[]`, element instanceof File ? element : String(element))
          })
        } else {
          formData.append(key, value instanceof File ? value : String(value))
        }
      }
    }
  }

  return formData
}
