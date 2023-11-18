import type { Product, Detail, ProductParams } from '@/types/product'
import type { Paginate, PaginateParams } from '@/types/global'

import { request } from '@/utils/request'

/**
 * @param data
 */
export const productList = (data: { params?: ProductParams; pagination?: PaginateParams }) => {
  return request<Paginate<Product>>({
    method: 'POST',
    url: '/products',
    data: { ...data.params, ...data.pagination },
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
