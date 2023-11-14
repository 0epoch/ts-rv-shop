import type { Paginate } from '@/types/global'

import { request } from '@/utils/request'
import type { Profile } from '@/types/member'

export const superNewDetaiil = (super_new_id: string) => {
  return request<Profile>({
    method: 'GET',
    url: '/super-new/details',
    data: { super_new_id },
  })
}

/**
 * @param code
 */
export const superNewList = () => {
  return request<Profile>({
    method: 'GET',
    url: '/super-new/list',
    data: {},
  })
}
