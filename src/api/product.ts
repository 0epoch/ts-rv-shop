import type { Product, Detail } from '@/types/product'
import type { Paginate } from '@/types/global'

import { request } from '@/utils/request'

/**
 * @param data
 */
export const getProductList = (data: { keyword: string; nav_id: string }) => {
  return request<Paginate<Product>>({
    method: 'POST',
    url: '/products',
    data,
  })
}

/**
 * @param data
 */
export const fetchProductDetail = (id: string) => {
  return request<Detail>({
    method: 'GET',
    url: '/product',
    data: { id },
  })
}
