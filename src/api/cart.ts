import type { Product, Detail } from '@/types/product'
import type { Paginate } from '@/types/global'

import { request } from '@/utils/request'
import type { CartItem, CartResult } from '@/types/cart'

/**
 * @param data
 */
export const saveCardProduct = (data: { product_id: number; sku_id: number; qty: number }) => {
  return request<Paginate<Product>>({
    method: 'POST',
    url: '/cart',
    data,
  })
}

/**
 * @param data
 */
export const cartProductDel = (skus_id: number[]) => {
  return request<Detail>({
    method: 'DELETE',
    url: '/cart',
    data: { skus_id },
  })
}

/**
 * @param data
 */
export const calcCart = (data: { selected?: { sku_id: number; qty: number }[]; coupon_id: number }) => {
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
  return request<CartResult>({
    method: 'GET',
    url: '/carts',
    data: {},
  })
}
