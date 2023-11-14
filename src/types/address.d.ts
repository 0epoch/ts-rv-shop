/** 添加收货地址: 请求参数 */
export type AddressParams = {
  address_id: string
  name: string
  mobile: string
  province: string
  city: string
  region: string
  addr: string
  full_location: string
  is_default: number
}

/** 收货地址项 */
export type AddressItem = AddressParams & {
  id: string
}
