import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const visible = ref<boolean>(false)

  const toggleAuthVisible = (val?: boolean) => {
    if (certified()) {
      visible.value = false
    } else {
      visible.value = true
    }
    if (val === true || val === false) {
      visible.value = val
    }
  }

  const certified = () => {
    const data = uni.getStorageSync('member')
    if (data) {
      const member = JSON.parse(data)
      if (member.profile && member.profile.token) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  return {
    toggleAuthVisible,
    visible,
    certified,
  }
})
