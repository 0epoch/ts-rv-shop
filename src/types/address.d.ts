export type AddressParams = {
  address_id: number
  name: string
  mobile: string
  province: string
  city: string
  region: string
  addr: string
  full_location: string
  is_default: number
}

export type AddressItem = AddressParams & {
  id: number
}
