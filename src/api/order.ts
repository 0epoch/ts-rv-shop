import type { Product, Detail } from '@/types/product'
import type { Paginate } from '@/types/global'

import { request } from '@/utils/request'

/**
 * @param data
 */
export const createOrder = (data: {
  address_id: string
  cart_id: string
  buy_type: string
  coupon_id: string
}) => {
  return request<Paginate<Product>>({
    method: 'POST',
    url: '/order/store',
    data,
  })
}

/**
 * @param data
 */
export const orderCount = () => {
  return request<Paginate<Product>>({
    method: 'POST',
    url: '/order/count',
    data: {},
  })
}

/**
 * @param data
 */
export const orderReceipt = (order_id: string) => {
  return request<Detail>({
    method: 'POST',
    url: '/order/receipt',
    data: { order_id },
  })
}

/**
 * @param data
 */
export const cancelOrder = (data: { order_id: string }) => {
  return request<Detail>({
    method: 'POST',
    url: '/order/cancel',
    data,
  })
}

/**
 * @param data
 */
export const orderDetail = (data: { order_id: string }) => {
  return request<Detail>({
    method: 'POST',
    url: '/order/detail',
    data,
  })
}

/**
 * @param data
 */
export const orderList = (data: { order_status: string }) => {
  return request<Paginate<Product>>({
    method: 'GET',
    url: '/order/list',
    data,
  })
}
