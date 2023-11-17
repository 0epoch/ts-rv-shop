import type { OrderState } from '@/services/constants'
import type { AddressItem } from './address'
import type { PageParams } from '@/types/global'

export type OrderPreResult = {
  goods: OrderPreGoods[]
  summary: {
    totalPrice: number
    postFee: number
    totalPayPrice: number
  }
  userAddresses: AddressItem[]
}

export type OrderPreGoods = {
  attrsText: string
  count: number
  id: string
  name: string
  payPrice: string
  picture: string
  price: string
  skuId: string
  totalPayPrice: string
  totalPrice: string
}

export type OrderCreateParams = {
  address_id: string
  buy_type: string
  buyer_words: string
  skus: {
    qty: number
    sku_id: string
  }[]
  pay_amount: number
  coupon_id: number
  pay_type: 1 | 2
}

export type Order = {
  id: string
  order_no: string
  pay_platform: string
  order_amount: number
  pay_amount: number
  product_amount: number
  coupon_amount: number
  vip_discount_amount: number
  product_num: number
  order_status: string
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

/** 订单详情 返回信息 */
export type OrderResult = Order & {
  /** 倒计时--剩余的秒数 -1 表示已经超时，正数表示倒计时未结束 */
  countdown: number
  skus: OrderSku[]
}

/** 商品信息 */
export type OrderSku = {
  id: string
  product_sku_id: string
  product_name: string
  product_attr: string
  product_num: number
  product_unit_price: number
  product_pic_url: string
}

/** 物流信息 返回值类型 */
export type OrderLogisticResult = {
  /** 快递公司 */
  company: {
    /** 公司名称 */
    name: string
    /** 快递编号 */
    number: string
    /** 联系电话 */
    tel: string
  }
  /** 商品件数 */
  count: number
  /** 物流日志 */
  list: LogisticItem[]
}

/** 物流日志 */
export type LogisticItem = {
  /** 信息ID */
  id: string
  /** 信息文字 */
  text: string
  /** 时间 */
  time: string
}

/** 订单列表参数 */
export type OrderListParams = PageParams & { orderState: number }

/** 订单列表 */
export type OrderListResult = {
  /** 总记录数 */
  total: number
  data: Order[]
  page: number
  last_page: number
  pre_page: number
}

/** 订单列表项 */
export type OrderItem = OrderResult & {
  /** 总件数 */
  totalNum: number
}
