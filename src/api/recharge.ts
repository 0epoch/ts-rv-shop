import type { Product, Detail } from '@/types/product'
import type { Paginate } from '@/types/global'

import { request } from '@/utils/request'
import type { Profile } from '@/types/member'
import type { Recharge } from '@/types/recharge'

export const createRecharge = (id: number) => {
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
  return request<Paginate<Recharge>>({
    method: 'GET',
    url: '/recharge/list',
    data: {},
  })
}

/**
 * @param data
 */
export const rechargePayment = (data: { id: number }) => {
  return request<{ sign: string }>({
    method: 'POST',
    url: '/payment/recharge',
    data,
  })
}
