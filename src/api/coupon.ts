import type { Product, Detail } from '@/types/product'
import type { Paginate } from '@/types/global'

import { request } from '@/utils/request'

/**
 * @param data
 */
export const userCouponList = (data: { send_method: string; status: string }) => {
  return request<Paginate<Product>>({
    method: 'GET',
    url: '/user/coupons',
    data,
  })
}

/**
 * @param data
 */
export const popupCouponList = () => {
  return request<Detail>({
    method: 'GET',
    url: '/coupon/popup',
    data: {},
  })
}

/**
 * @param data
 */
export const allCouponReceive = () => {
  return request<Detail>({
    method: 'POST',
    url: '/coupon/receive_all',
    data: {},
  })
}

/**
 * @param data
 */
export const couponReceive = (data: { coupon_id: string }) => {
  return request<Detail>({
    method: 'POST',
    url: '/coupon/receive',
    data,
  })
}

/**
 * @param data
 */
export const couponsList = (data: { send_method: string }) => {
  return request<Paginate<Product>>({
    method: 'GET',
    url: '/coupons',
    data,
  })
}
