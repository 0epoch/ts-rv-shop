import { request } from '@/utils/request'
import type { HomeConfs } from '@/types/home'
import type { Category } from '@/types/category'

/**
 * @param data
 */
export const homeConfs = () => {
  return request<HomeConfs>({
    method: 'GET',
    url: '/home',
    data: {},
  })
}

/**
 * @param data
 */
export const firstCategories = () => {
  return request<Category[]>({
    method: 'GET',
    url: '/categories/first',
    data: {},
  })
}
