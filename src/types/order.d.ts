import type { OrderState } from '@/services/constants'
import type { AddressItem } from './address'
import type { PageParams, Paginate } from '@/types/global'

export type OrderCreateParams = {
  address_id: number
  buy_type: string
  buyer_words: string
  pay_amount: number
  coupon_id: number
  pay_type: 1 | 2
  checkout_skus: CheckoutItem[]
}

export type Order = {
  id: number
  order_no: string
  pay_platform: string
  order_amount: number
  pay_amount: number
  product_amount: number
  coupon_amount: number
  vip_discount_amount: number
  product_num: number
  order_status: OrderState
  refund_status: string
  receiver_name: string
  receiver_mobile: string
  receiver_province: string
  receiver_city: string
  receiver_region: string
  receiver_addr: string
  logistics: string
  create_time: string
  pay_time: string
  update_time: string
  created_at: string
  updated_at: string
  expire_time: string
  ship_time: string
  complete_time: string
  cancel_time: string
  confirm_receipt_time: string
}

export type OrderResult = Order & {
  countdown: number
  skus: OrderSku[]
}

/** 商品信息 */
export type OrderSku = {
  id: number
  order_id: number
  order_sku_id: number
  pay_amount: number
  product_id: string
  product_sku_id: string
  product_name: string
  product_attr: string
  product_num: number
  product_unit_price: number
  product_pic_url: string
  refund_status: string
}

export type OrderLogisticResult = {
  company: {
    name: string
    number: string
    tel: string
  }
  count: number
  list: LogisticItem[]
}

export type LogisticItem = {
  id: string
  text: string
  time: string
}

export type OrderListParams = { order_status: string; pagination: Paginate }

export type OrderListResult = {
  total: number
  data: Order[]
  page: number
  last_page: number
  pre_page: number
}

export type OrderItem = OrderResult & {
  totalNum: number
}

export type CheckoutItem = {
  sku_id?: number
  qty?: number
  cart_id?: number
}
export type CheckoutParams = {
  coupon_id?: number
  checkout_skus?: CheckoutItem[]
}
