export type UserCoupon = {
  id: number
  coupon_id: number
  type: string
  threshold: number
  value: number
  limit: number
  start_time: string
  end_time: string
  status: number
  score: number
  status_zh: string
  coupon: Coupon
}

export type Coupon = {
  id: number
  title: string
  desc: string
  type: string
  threshold: number
  pic: string
  value: number
  start_time: string
  end_time: string
  effective_days: number
  limit_num: number
  conditions: object
  expires_mode: object
  status_zh: string
  type_zh: string
}
