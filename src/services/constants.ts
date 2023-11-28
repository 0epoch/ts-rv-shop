export enum OrderState {
  /** 待付款 */
  UNPAID = 'unpaid',
  /** 待发货 */
  WAIT_SHIP = 'wait_ship',
  /** 待收货 */
  SHIPPED = 'shipped',
  /** 已完成 */
  COMPLETED = 'completed',
  /** 已取消 */
  CANCELED = 'canceled',
  CLOSED = 'closed',
  RECEIVED = 'received',
  FAIL = 'fail',
}

type OrderStateList = {
  [key in OrderState]: { id: number; text: string }
}

export const orderStateList: OrderStateList = {
  [OrderState.UNPAID]: { id: 1, text: '待付款' },
  [OrderState.WAIT_SHIP]: { id: 2, text: '待发货' },
  [OrderState.SHIPPED]: { id: 3, text: '待收货' },
  [OrderState.COMPLETED]: { id: 4, text: '已完成' },
  [OrderState.CANCELED]: { id: 5, text: '已取消' },
  [OrderState.CLOSED]: { id: 5, text: '已关闭' },
  [OrderState.RECEIVED]: { id: 5, text: '确认收货' },
  [OrderState.FAIL]: { id: 5, text: '失败' },
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
