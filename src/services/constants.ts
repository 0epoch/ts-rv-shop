// case UNPAID = 'unpaid';
// case IN_PAY = 'in_pay';
// case WAIT_SHIP = 'wait_ship';  // 待发货可以仅退款
// case SHIPPED = 'shipped';
// case CANCELED = 'canceled';
// case RECEIVED = 'received';   // 确认收货后，订单完成前可以退货退款
// case COMPLETED = 'completed';  // 确认收货无售后7天后
// case CLOSED = 'closed';     // 未付款、取消
// case FAIL = 'fail';     // 失败
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
  FAIL = 'fail',
}
/** 订单状态列表 */
export const orderStateList = {
  unpaid: { id: 1, text: '待付款' },
  wait_ship: { id: 2, text: '待发货' },
  shipped: { id: 3, text: '待收货' },
  completed: { id: 4, text: '已完成' },
  canceled: { id: 5, text: '已取消' },
}
