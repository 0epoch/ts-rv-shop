import type { Product, Detail } from '@/types/product'
import type { Paginate } from '@/types/global'

import { request } from '@/utils/request'
import type { Profile } from '@/types/member'

export const createRecharge = (id: string) => {
  return request<Profile>({
    method: 'POST',
    url: '/recharge/store',
    data: { id },
  })
}

/**
 * @param code
 */
export const rechargeList = () => {
  return request<Profile>({
    method: 'GET',
    url: '/recharge/list',
    data: {},
  })
}
