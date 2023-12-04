export type Paginate<T> = {
  data: T[]
  total: number
  current_page: number
  last_page: number
  per_page: number
  page: number
}

export type PaginateParams = {
  page?: number
  per_page?: number
}

export type OssPolicy = {
  accessid: T
  host: string
  policy: string
  signature: string
  expire: number
  callback: string
  'callback-var': object
  dir: string
}
