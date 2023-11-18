import { request } from '@/utils/request'
import type { HomeConfs } from '@/types/home'

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
