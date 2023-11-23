<script setup lang="ts">
import { wxLogin } from '@/api/user'
import { useMemberStore } from '@/stores'
import type { Profile } from '@/types/member'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// #ifdef MP-WEIXIN
// 获取 code 登录凭证
let code = ''
onLoad(async () => {
  const rs = await wx.login()
  code = rs.code
})

// 获取用户手机号码
const onGetphonenumber: UniHelper.ButtonOnGetphonenumber = async (ev) => {
  await checkedAgreePrivacy()
  const { encryptedData, iv } = ev.detail
}
// #endif

const loginSuccess = (profile: Profile) => {
  const memberStore = useMemberStore()
  memberStore.setProfile(profile)

  uni.showToast({ icon: 'success', title: '登录成功' })
  setTimeout(() => {
    uni.navigateBack()
  }, 500)
}

//协议
const isAgreePrivacy = ref(false)
const isAgreePrivacyShakeY = ref(false)
const checkedAgreePrivacy = async () => {
  if (!isAgreePrivacy.value) {
    uni.showToast({
      icon: 'none',
      title: '请先阅读并勾选协议',
    })
    isAgreePrivacyShakeY.value = true
    setTimeout(() => {
      isAgreePrivacyShakeY.value = false
    }, 500)
    return Promise.reject(new Error('请先阅读并勾选协议'))
  }
}

const onOpenPrivacyContract = () => {
  // #ifdef MP-WEIXIN
  // 隐私协议页面
  wx.openPrivacyContract({})
  // #endif
}

const onLogin = async () => {
  const rs = await wxLogin(code)
  loginSuccess(rs.data)
}
</script>

<template>
  <view class="viewport">
    <view class="login">
      <!-- 小程序端授权登录 -->
      <!-- #ifdef MP-WEIXIN -->
      <view class="button-privacy-wrap">
        <button :hidden="isAgreePrivacy" class="button-opacity button phone" @tap="checkedAgreePrivacy">请先阅读并勾选协议</button>
        <button @click="onLogin" class="button">授权登录</button>
      </view>
      <!-- #endif -->
      <view class="tips" :class="{ animate__shakeY: isAgreePrivacyShakeY }">
        <label class="label" @tap="isAgreePrivacy = !isAgreePrivacy">
          <radio class="radio" color="#010101" :checked="isAgreePrivacy" />
          <text>登录/注册即视为你同意RiverValley</text>
        </label>
        <navigator class="link" hover-class="none" url="./protocal">《服务条款》</navigator>
        和
        <text class="link" @tap="onOpenPrivacyContract">《隐私协议》</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
}

.viewport {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 20rpx 40rpx;
}

.button {
  color: #fff;
  background-color: #010101;
  border-radius: 72rpx;
}

@keyframes animate__shakeY {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, -5rpx);
  }
  100% {
    transform: translate(0, 0);
  }
}

.animate__shakeY {
  animation: animate__shakeY 0.2s ease-in-out 3;
}

.button-privacy-wrap {
  position: relative;
  .button-opacity {
    opacity: 0;
    position: absolute;
    z-index: 1;
  }
}

.tips {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #666;
  text-align: center;

  .radio {
    transform: scale(0.6);
    margin-right: -4rpx;
    margin-top: -4rpx;
    vertical-align: middle;
  }

  .link {
    display: inline;
    color: #010101;
  }
}
</style>
