import RvAuth from '@/components/RvAuth.vue'
import OrderList from '@/pagesOrder/list/components/OrderList.vue'
import RefundList from '@/pagesOrder/list/components/RefundList.vue'

declare module 'vue' {
  export interface GlobalComponents {
    RvAuth: typeof RvAuth
  }
}

// 组件实例类型
export type RvAuthInstance = InstanceType<typeof RvAuth>
export type OrderListInstance = InstanceType<typeof OrderList>
export type RefundsListInstance = InstanceType<typeof RefundList>
