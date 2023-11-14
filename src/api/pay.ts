import type { Product, Detail } from '@/types/product'
import type { Paginate } from '@/types/global'

import { request } from '@/utils/request'

/**
 * @param data
 */
export const order = (data: { order_id: string; pay_type: string }) => {
  return request<Paginate<Product>>({
    method: 'POST',
    url: '/payment/pay',
    data,
  })
}

/**
 * @param data
 */
export const recharge = () => {
  return request<Detail>({
    method: 'POST',
    url: '/payment/recharge',
    data: {},
  })
}
