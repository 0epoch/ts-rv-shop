import type { Product } from '@/types/product'
import type { Paginate, PaginateParams } from '@/types/global'
import type { AddressItem, AddressParams } from '@/types/address'

import { request } from '@/utils/request'
import type { Profile } from '@/types/member'
import type { UserCoupon } from '@/types/coupon'

export const wxLogin = (code: string) => {
  return request<Profile>({
    method: 'POST',
    url: '/login',
    data: { code },
  })
}

/**
 * @param code
 */
export const wxUserPhone = (code: string) => {
  return request<Profile>({
    method: 'POST',
    url: '/user/phone',
    data: { code },
  })
}

/**
 * @param data
 */
export const saveProfile = (data: {
  name: string
  mobile: string
  city: string
  birthday: string
  gender: string
  province: string
  avatar: string
}) => {
  return request<Paginate<Product>>({
    method: 'POST',
    url: '/user/profile',
    data,
  })
}

/**
 * @param data
 */
export const getProfile = () => {
  return request<Paginate<Product>>({
    method: 'GET',
    url: '/user/profile',
    data: {},
  })
}

/**
 * @param data
 */
export const saveAddr = (data: AddressParams) => {
  return request<AddressItem>({
    method: 'POST',
    url: '/user/addr',
    data,
  })
}

/**
 * @param data
 */
export const addrList = () => {
  return request<AddressItem[]>({
    method: 'GET',
    url: '/user/addrs',
    data: {},
  })
}

/**
 * @param data
 */
export const addrRemove = (address_id: string) => {
  return request({
    method: 'DELETE',
    url: '/user/addr',
    data: { address_id },
  })
}

/**
 * @param data
 */
export const getAddr = (address_id: string) => {
  return request<AddressItem>({
    method: 'GET',
    url: '/user/addr',
    data: { address_id },
  })
}

/**
 * @param data
 */
export const balanceBillList = () => {
  return request<Paginate<Product>>({
    method: 'POST',
    url: '/user/balance',
    data: {},
  })
}

export const userCouponList = (data?: { params: {}; pagination?: PaginateParams }) => {
  return request<Paginate<UserCoupon>>({
    method: 'GET',
    url: '/user/coupons',
    data: { ...data?.params, ...data?.pagination },
  })
}
