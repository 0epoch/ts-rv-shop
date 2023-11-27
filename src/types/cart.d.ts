import type { UserCoupon } from './coupon'
export type CartItem = {
  cart_id: number
  sku_id: number
  product_id: number
  pic_url: string
  title: string
  qty: number
  use_aff: number
  original_price: nulber
  price: number
  aff_price: number
  stock: number
  attrs: string
  selected: number
  coupon_amount: number
  discount_amount: number
}

export type CartResult = {
  skus: CartItem[]
  amount: number
  checkout_amount: number
  coupon_amount: number
  discount_amount: number
  promotion_amount: number
  coupon?: UserCoupon
  usable_coupons?: UserCoupon[]
}
