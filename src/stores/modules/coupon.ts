import type { UserCoupon } from '@/types/coupon'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCouponStore = defineStore('coupon', () => {
  const checkedCoupon = ref<UserCoupon>()

  const changeCheckedCoupon = (val: UserCoupon) => {
    checkedCoupon.value = val
  }

  return {
    checkedCoupon,
    changeCheckedCoupon,
  }
})
