<script setup lang="ts">
import CryptoJS from 'crypto-js'

import { useMemberStore } from '@/stores'
import { useAuthStore } from '@/stores'

import { createRecharge, rechargeList, rechargePayment } from '@/api/recharge'
import { getProfile } from '@/api/user'

import type { Paginate } from '@/types/global'
import type { Recharge } from '@/types/recharge'
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'

const memberStore = useMemberStore()
const authStore = useAuthStore()

const checked = ref<number>(0)

const recharges = ref<Paginate<Recharge>>()
const getRechargeList = async () => {
  const rs = await rechargeList()
  recharges.value = rs.data
}

const wechatPay = (sign: string) => {
  const aesKey = CryptoJS.enc.Utf8.parse('3016C75DBDA14FAEBAE9F6B5C6696930')
  let decrypt = CryptoJS.AES.decrypt(sign, aesKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    keySize: 256 / 32,
  })
  const { appId, timeStamp, nonceStr, package: packageData, signType, paySign } = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8))
  wx.requestPayment({
    provider: 'wxpay',
    appId,
    timeStamp,
    nonceStr,
    package: packageData,
    signType,
    paySign,
    success: function (rs) {
      uni.showToast({ icon: 'success', title: '支付成功' })
      getProfile().then((rs) => {
        memberStore.setProfile(rs.data)
      })
      setTimeout(function () {
        uni.navigateBack()
      }, 1000)
    },
    fail: function (rs) {
      uni.showToast({ icon: 'error', title: '支付失败' })
      return
      // uni.redirectTo({ url: `/pagesOrder/detail/detail?id=${query.id}` })
    },
  })
}
const onRecharge = async () => {
  if (!authStore.certified()) {
    authStore.visible = true
    return
  }
  if (checked.value <= 0) return
  const rs = await createRecharge(checked.value)
  if (rs.code > 0) {
    return
  }

  const payRes = await rechargePayment({ id: rs.data.id })
  wechatPay(payRes.data.sign)
}

onLoad(() => {
  if (!authStore.certified()) {
    authStore.visible = true
    return
  }
  getRechargeList()
})

const onChecked = (id: number) => {
  if (checked.value === id) {
    checked.value = 0
  } else {
    checked.value = id
  }
}
</script>

<template>
  <view class="viewport">
    <view v-if="recharges?.data" class="full">
      <view>
        <view class="balance">
          <text>我的余额</text>
          <view>
            <text class="symbol">¥</text>
            <text class="number">{{ memberStore.profile?.account_balance }}</text>
          </view>
        </view>
        <view class="card" v-for="item in recharges?.data" :key="item.id" @tap="onChecked(item.id)">
          <text class="checkbox" :class="{ checked: item.id === checked }"></text>
          <view class="recharge">
            <view class="overview">
              <view class="price">
                <text class="symbol">¥</text>
                <text class="number">{{ item.cost }}</text>
              </view>
            </view>

            <view class="action">
              <text>赠送</text>
              <view class="price">{{ item.bonus }}元</view>
            </view>
          </view>
        </view>
      </view>
      <button class="btn" @tap="onRecharge" :class="{ disabled: checked <= 0 }">去支付</button>
    </view>

    <view class="blank" v-else>暂无充值卡~</view>
    <RvAuth />
  </view>
</template>

<style lang="scss" scoped>
page {
  background-color: #f4f4f4;
}
.viewport {
  height: 100vh;
  padding: 20rpx;
  background-color: #f4f4f4;
  .balance {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200rpx;
    margin: 20rpx 30rpx 40rpx 30rpx;
    padding: 20rpx;
    color: #fff;
    background-color: #010101;
    border-radius: 10rpx;
    .price {
      color: #fff;
      font-size: 36rpx;
      font-weight: bold;
      box-sizing: border-box;
    }
    .number {
      font-size: 56rpx;
    }
  }
  .btn {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #010101;
    &.disabled {
      opacity: 0.6;
    }
  }

  .full {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
}
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.checkbox {
  width: 50rpx;
  margin-right: 10rpx;
  &::before {
    content: '\e72f';
    font-family: 'iconfont' !important;
    font-size: 45rpx;
    color: #444;
  }

  &.checked::before {
    content: '\e730';
    color: #010101;
  }
}
.recharge {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 160rpx;
  padding: 20rpx 25rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-left: 12rpx solid #010101;
  border-radius: 8rpx;
  .overview {
    flex: 60%;
    flex-grow: 0;
    display: flex;
    align-items: center;
    .price {
      color: #e51c23;
      font-size: 36rpx;
      font-weight: bold;
      box-sizing: border-box;
    }
    .number {
      font-size: 56rpx;
    }
  }
  .action {
    flex: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #010101;
    color: #fff;
    border-radius: 6rpx;
    // margin-right: 30rpx;
    // .price {
    //   color: #010101;
    // }
    .button {
      margin-top: 10rpx;
      color: #010101;
      padding: 5rpx 15rpx;
      border-radius: 6rpx;
      font-size: 20rpx;
      border: 1rpx solid #010101;
    }
  }
}
.blank {
  display: flex;
  justify-content: center;
  color: #939393;
  font-size: 28rpx;
}
</style>
