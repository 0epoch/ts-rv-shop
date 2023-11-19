import RvAuth from '@/components/RvAuth.vue'

declare module 'vue' {
  export interface GlobalComponents {
    RvAuth: typeof RvAuth
  }
}

// 组件实例类型
export type RvAuthInstance = InstanceType<typeof RvAuth>
