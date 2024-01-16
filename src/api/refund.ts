import type { Product, Detail } from '@/types/product'
import type { Paginate, PaginateParams } from '@/types/global'

import { request } from '@/utils/request'
import type { RefundListResult } from '@/types/refund'

/**
 * @param data
 */
export const createRefund = (data: { product_id: string; sku_id: string; num: number }) => {
  return request<Paginate<Product>>({
    method: 'POST',
    url: '/refund/store',
    data,
  })
}

/**
 * @param data
 */
export const refundLogistics = (data: { refund_id: string; logistics_no: string }) => {
  return request<Detail>({
    method: 'POST',
    url: '/refund/fill_logistics',
    data,
  })
}

/**
 * @param data
 */
export const cancelRefund = (data: { refund_id: string }) => {
  return request<Detail>({
    method: 'POST',
    url: '/refund/cancel',
    data,
  })
}

/**
 * @param data
 */
export const refundDetail = (data: { refund_id: string }) => {
  return request<Detail>({
    method: 'POST',
    url: '/refund/detail',
    data,
  })
}

/**
 * @param data
 */
export const refundList = (data: PaginateParams) => {
  return request<RefundListResult>({
    method: 'GET',
    url: '/refund/list',
    data,
  })
}
