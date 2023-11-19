<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useMemberStore } from '@/stores'
import { wxLogin } from '@/api/user'
import type { Profile } from '@/types/member'

const memberStore = useMemberStore()
const visible = ref(false)
const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const onConfirm = () => {
  uni.login({
    success: async (rs) => {
      const code = rs.code
      const data = await wxLogin(code)
      loginSuccess(data.data)
    },
    fail: (rs) => {
      console.log(rs, '取消授权')
    },
  })
}

const loginSuccess = (profile: Profile) => {
  const memberStore = useMemberStore()
  memberStore.setProfile(profile)
  setTimeout(() => {
    popup.value?.close()
  }, 500)
}

onShow(async () => {
  if (memberStore.profile?.token) return
  wx.getSetting({
    success: (rs) => {
      if (rs.authSetting['scope.userInfo']) {
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
  height: 65rpx;
  line-height: 65rpx;
  margin-top: 100rpx;
  font-size: 28rpx;
  border-radius: 8rpx;
  color: #fff;
  background-color: #010101;
}
</style>
