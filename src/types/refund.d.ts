import type { RefundState } from '@/services/constants'
import type { AddressItem } from './address'
import type { PageParams, Paginate } from '@/types/global'

export type RefundCreateParams = {
  order_id: number
  order_sku_id: number
  refund_type: string
  refund_reason: string
}

export type Refund = {
  id: number
  refund_no: string
  refund_platform: string
  refund_type: string

  refund_amount: number
  refund_num: number

  order_no: string
  sku_order_no: string
  order_id: number
  order_sku_id: number

  product_num: number
  order_amount: number
  pay_amount: number
  sku_pay_amount: number

  product_amount: number
  coupon_amount: number
  vip_discount_amount: number
  product_num: number
  refund_status: RefundState
  refund_status: string
  receiver_name: string
  receiver_mobile: string
  refund_time: string
  pay_time: string
  update_time: string
  created_at: string
  updated_at: string
  expire_time: string
  ship_time: string
  complete_time: string
  cancel_time: string
  confirm_receipt_time: string
  product_sku_id: string
  product_name: string
  product_attr: string
  product_num: number
  product_unit_price: number
  product_pic_url: string
}

export type RefundResult = Refund & {
  countdown: number
  skus: RefundSku[]
}

/** 商品信息 */
export type RefundSku = {
  id: number
  product_sku_id: string
  product_name: string
  product_attr: string
  product_num: number
  product_unit_price: number
  product_pic_url: string
}

export type OrderListParams = { order_status: string; pagination: Paginate }

export type RefundListResult = {
  total: number
  data: Refund[]
  page: number
  last_page: number
  pre_page: number
}
