import type { Product, Detail } from '@/types/product'
import type { Paginate } from '@/types/global'

import { request } from '@/utils/request'
import type { CartItem } from '@/types/cart'

/**
 * @param data
 */
export const addProduct = (data: { product_id: string; sku_id: string; num: number }) => {
  return request<Paginate<Product>>({
    method: 'POST',
    url: '/shop-cart/add',
    data,
  })
}

/**
 * @param data
 */
export const cartProductDel = (cart_id: string) => {
  return request<Detail>({
    method: 'POST',
    url: '/shop-cart/del',
    data: { cart_id },
  })
}

/**
 * @param data
 */
export const cartProductCount = (data: {
  cart_type: string
  cart_id: string
  coupon_id: number
}) => {
  return request<Detail>({
    method: 'GET',
    url: '/shop-cart/count',
    data,
  })
}

/**
 * @param data
 */
export const updateCartProduct = (data: { product_id: string; sku_id: string; num: number }) => {
  return request<Detail>({
    method: 'POST',
    url: '/shop-cart/update',
    data,
  })
}

/**
 * @param data
 */
export const cartProductList = () => {
  return request<CartItem[]>({
    method: 'GET',
    url: '/shop-cart/list',
    data: {},
  })
}
