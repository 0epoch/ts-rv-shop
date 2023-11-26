<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores'
import { useMemberStore } from '@/stores'

import { wxLogin } from '@/api/user'
import type { Profile } from '@/types/member'

const authStore = useAuthStore()
// const visible = ref(false)

const props = defineProps<{
  visible: boolean
}>()

const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()

const code = ref()
const emit = defineEmits<{
  (event: 'close'): void
}>()

const userLogin = async () => {
  const rs = await wxLogin(code.value)
  const memberStore = useMemberStore()
  memberStore.setProfile(rs.data)
  authStore.visible = false
  setTimeout(() => {
    popup.value?.close()
  }, 500)
}

const onConfirm = () => {
  uni.login({
    success: async (rs) => {
      code.value = rs.code
      userLogin()
    },
    fail: (rs) => {
      console.log(rs, '取消授权')
    },
  })
}

watch(authStore, (newValue, oldValue) => {
  console.log('w atuh.............')
  if (newValue.visible) {
    wx.getSetting({
      success: (rs) => {
        if (rs.authSetting['scope.userInfo']) {
          userLogin()
        } else {
          popup.value?.open()
        }
      },
      fail: (err) => {
        console.log(err, '授权失败.....')
      },
    })
  }
})

onShow(async () => {
  if (authStore.certified()) return
  const rs = await wx.login()
  code.value = rs.code
  wx.getSetting({
    success: (rs) => {
      if (rs.authSetting['scope.userInfo']) {
        userLogin()
      } else {
        popup.value?.open()
      }
    },
    fail: (err) => {
      console.log(err, '授权失败.....')
    },
  })
})
</script>

<template>
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <view class="panel">
      <text class="close icon-close" @tap="popup?.close()"></text>
      <view class="title">欢迎来到RiverValley商城</view>
      <view class="content">
        <view>
          <text>为提供优质服务，RiverValley商城需要获取以下信息：</text>
          <text>您的公开信息（昵称，头像等）</text>
        </view>
        <button class="button" @tap="onConfirm">确认</button>
      </view>
    </view>
  </uni-popup>
</template>

<style lang="scss">
.panel {
  padding: 0 30rpx;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #fff;
  z-index: 9;
}

.title {
  line-height: 1;
  padding: 40rpx 0;
  font-size: 28rpx;
  font-weight: bold;
  color: #010101;
}

.close {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
}

.content {
  padding: 20rpx 20rpx 100rpx 0;
  color: #333;
  font-size: 26rpx;
}

.button {
  height: 85rpx;
  line-height: 85rpx;
  margin-top: 100rpx;
  font-size: 28rpx;
  border-radius: 8rpx;
  color: #fff;
  background-color: #010101;
}
</style>
