import type { Product, Detail } from '@/types/product'
import type { Paginate } from '@/types/global'

import { request } from '@/utils/request'
import type { CartItem, CartResult } from '@/types/cart'

/**
 * @param data
 */
export const saveCardProduct = (data: { product_id: string; sku_id: string; qty: number }) => {
  return request<Paginate<Product>>({
    method: 'POST',
    url: '/cart',
    data,
  })
}

/**
 * @param data
 */
export const cartProductDel = (id: string) => {
  return request<Detail>({
    method: 'DELETE',
    url: '/cart',
    data: { id },
  })
}

/**
 * @param data
 */
export const calcCart = (data: {
  selected?: { sku_id: string; qty: number }[]
  coupon_id: number
}) => {
  return request<CartResult>({
    method: 'POST',
    url: '/cart/calc',
    data,
  })
}

/**
 * @param data
 */
export const cartProductList = () => {
  return request<CartItem[]>({
    method: 'GET',
    url: '/carts',
    data: {},
  })
}
