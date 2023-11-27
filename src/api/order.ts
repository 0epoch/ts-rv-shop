import type { Product, Detail } from '@/types/product'
import type { Paginate, PaginateParams } from '@/types/global'
import type { CheckoutParams } from '@/types/order'

import { request } from '@/utils/request'
import type { CartResult } from '@/types/cart'
import type { Order, OrderCreateParams, OrderListParams, OrderResult } from '@/types/order'

/**
 * @param data
 */
export const checkoutOrder = (data: CheckoutParams) => {
  return request<CartResult>({
    method: 'POST',
    url: '/order/checkout',
    data,
  })
}

/**
 * @param data
 */
export const createOrder = (data: OrderCreateParams) => {
  return request<Order>({
    method: 'POST',
    url: '/order',
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
export const orderReceipt = (order_id: number) => {
  return request<Detail>({
    method: 'POST',
    url: '/order/receipt',
    data: { order_id },
  })
}

/**
 * @param data
 */
export const cancelOrder = (data: { order_id: number; reason: string }) => {
  return request<Detail>({
    method: 'POST',
    url: '/order/cancel',
    data,
  })
}

/**
 * @param data
 */
export const orderDetail = (data: { order_id: number }) => {
  return request<OrderResult>({
    method: 'POST',
    url: '/order/detail',
    data,
  })
}

/**
 * @param data
 */
export const orderList = (data: OrderListParams) => {
  return request<Paginate<OrderResult>>({
    method: 'POST',
    url: '/order/list',
    data,
  })
}
