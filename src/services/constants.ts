export enum OrderState {
  UNPAID = 'unpaid',
  IN_PAY = 'in_pay',
  WAIT_SHIP = 'wait_ship',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  CLOSED = 'closed',
  RECEIVED = 'received',
  FAIL = 'fail',
  REFUND = 'refund',
}

type OrderStateList = {
  [key in OrderState]: { id: number; text: string }
}

export const orderStateList: OrderStateList = {
  [OrderState.UNPAID]: { id: 1, text: '待付款' },
  [OrderState.IN_PAY]: { id: 1, text: '支付中' },
  [OrderState.WAIT_SHIP]: { id: 2, text: '待发货' },
  [OrderState.SHIPPED]: { id: 3, text: '待收货' },
  [OrderState.COMPLETED]: { id: 4, text: '已完成' },
  [OrderState.CANCELED]: { id: 5, text: '已取消' },
  [OrderState.CLOSED]: { id: 5, text: '已关闭' },
  [OrderState.RECEIVED]: { id: 5, text: '确认收货' },
  [OrderState.FAIL]: { id: 5, text: '失败' },
  [OrderState.REFUND]: { id: 5, text: '退款/售后' },
}

export enum RefundState {
  NOT_REFUND = 'not_refund',
  INIT_REFUND = 'init_refund',
  APPLY_REFUND = 'apply_refund',
  REJECT_REFUND = 'reject_refund',
  CANCELED = 'canceled',
  RETURNED = 'returned',
  REFUND_CONFIRM = 'refund_confirm',
  REFUNDING = 'refunding',
  REFUNDED = 'refunded',
  FAIL_REFUND = 'fail_refund',
  CLOSE_REFUND = 'close_refund',
  PART_REFUNDED = 'part_refunded',
  ALL_REFUNDED = 'all_refunded',
}
type RefundStateList = {
  [key in RefundState]: { id: number; text: string }
}
export const refundStateList: RefundStateList = {
  [RefundState.NOT_REFUND]: { id: 1, text: '未退款' },
  [RefundState.INIT_REFUND]: { id: 2, text: '退款申请中' },
  [RefundState.APPLY_REFUND]: { id: 3, text: '同意退款' },
  [RefundState.REJECT_REFUND]: { id: 4, text: '拒绝退款' },
  [RefundState.CANCELED]: { id: 5, text: '已取消' },
  [RefundState.RETURNED]: { id: 5, text: '已退回商品' },
  [RefundState.REFUND_CONFIRM]: { id: 5, text: '退货确认' },
  [RefundState.REFUNDING]: { id: 5, text: '退款中' },
  [RefundState.REFUNDED]: { id: 5, text: '已退款' },
  [RefundState.FAIL_REFUND]: { id: 5, text: '退款失败' },
  [RefundState.CLOSE_REFUND]: { id: 5, text: '退款关闭' },
  [RefundState.PART_REFUNDED]: { id: 5, text: '部分退款' },
  [RefundState.ALL_REFUNDED]: { id: 5, text: '全部退款' },
}

export enum BillSourceType {
  RECHARGE_BALANCE = 'recharge_balance',
  PAYMENT_BALANCE = 'payment_balance',
  REFUND_BALANCE = 'refund_balance',
  ADMIN_RECHARGE = 'admin_recharge',
  ADMIN_DEDUCTION = 'admin_deduction',
}

type BillSourceTypeList = {
  [key in BillSourceType]: { id: number; text: string }
}

export const billSourceTypeList: BillSourceTypeList = {
  [BillSourceType.RECHARGE_BALANCE]: { id: 1, text: '充值' },
  [BillSourceType.PAYMENT_BALANCE]: { id: 2, text: '消费' },
  [BillSourceType.REFUND_BALANCE]: { id: 3, text: '退款' },
  [BillSourceType.ADMIN_RECHARGE]: { id: 4, text: '管理员充值' },
  [BillSourceType.ADMIN_DEDUCTION]: { id: 5, text: '管理员扣款' },
}

export enum PaymehtMethod {
  WECHAT = 'wechat',
  BALANCE = 'balance',
  FREE = 'free',
}
