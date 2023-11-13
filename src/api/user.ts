import type { Product, Detail } from '@/types/product'
import type { Paginate } from '@/types/global'

import { request } from '@/utils/request'
import type { Profile } from '@/types/member'

export const wxLogin = (code: string) => {
  return request<Profile>({
    method: 'POST',
    url: '/login',
    data: { code },
  })
}
