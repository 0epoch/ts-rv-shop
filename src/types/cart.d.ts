export type CartItem = {
  cart_id: string
  sku_id: string
  product_id: string
  pic_url: string
  title: string
  num: number
  use_aff: number
  settle_price: number
  aff_price: number
  stock: number
  selected: boolean
  attrs: string
  isEffective: boolean
  coupon_amount: number
  vip_discount_amount: number
}
