<script setup lang="ts">
import CryptoJS from 'crypto-js'
import { useMemberStore } from '@/stores'
import { OrderState } from '@/services/constants'
import { orderStateList } from '@/services/constants'
import { orderList, orderReceipt, orderPayment } from '@/api/order'
import { getProfile } from '@/api/user'

import type { Order, OrderResult } from '@/types/order'
import type { OrderListParams } from '@/types/order'
import { onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const { safeAreaInsets } = uni.getSystemInfoSync()

const memberStore = useMemberStore()

const props = defineProps<{
  orderStatus: string
}>()

const popup = ref<UniHelper.UniPopupInstance>()
const paymehtMethod = ref('')
const payOrder = ref<number>(0)

const queryParams: Required<OrderListParams> = {
  pagination: {
    page: 1,
    per_page: 10,
  },
  order_status: props.orderStatus,
}

const orders = ref<OrderResult[]>([])

const isLoading = ref(false)
const getOrderList = async () => {
  if (isLoading.value) return
  if (isFinish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }

  isLoading.value = true
  const rs = await orderList(queryParams)
  isLoading.value = false
  orders.value.push(...rs.data.data)
  if (queryParams.pagination.page < rs.data.last_page) {
    queryParams.pagination.page++
  } else {
    isFinish.value = true
  }
}

onLoad(() => {
  getOrderList()
})

const onGoToPay = async (orderId: number) => {
  payOrder.value = orderId
  const rs = await getProfile()
  rs.data.token = memberStore.profile?.token
  memberStore.setProfile(rs.data)
  popup.value?.open?.()
}

// 订单支付
const onOrderPay = async (method: string) => {
  paymehtMethod.value = method
  if (payOrder.value <= 0) return
  const rs = await orderPayment({ order_id: payOrder.value, pay_type: method })
  if (method === 'wechat') {
    wechatPay(rs.data.sign)
    return
  } else {
    uni.showToast({ icon: 'success', title: '支付成功' })
  }
}

const onOrderConfirm = (id: number) => {
  uni.showModal({
    content: '为保障您的权益，请收到货并确认无误后，再确认收货',
    confirmColor: '#010101',
    success: async (res) => {
      if (res.confirm) {
        await orderReceipt(id)
        uni.showToast({ icon: 'success', title: '确认收货成功' })

        // 确认成功，状态更新
        const order = orders.value.find((v) => v.id === id)
        order!.order_status = OrderState.COMPLETED
      }
    },
  })
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
      setTimeout(function () {
        uni.redirectTo({ url: `/pagesOrder/detail/detail?id=${payOrder.value}` })
      }, 1000)
    },
    fail: function (rs) {
      return
      // uni.redirectTo({ url: `/pagesOrder/detail/detail?id=${query.id}` })
    },
  })
}

const isFinish = ref(false)
const isTriggered = ref(false)
const onRefresherrefresh = async () => {
  isTriggered.value = true
  // 重置分页
  queryParams.pagination.page = 1
  orders.value = []
  isFinish.value = false
  await getOrderList()
  isTriggered.value = false
}
</script>

<template>
  <scroll-view
    enable-back-to-top
    scroll-y
    class="orders"
    refresher-enabled
    :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh"
    @scrolltolower="getOrderList"
  >
    <view class="card" v-for="order in orders" :key="order.id">
      <view class="status">
        <text class="date">{{ order.created_at }}</text>
        <!-- 订单状态 -->
        <text>{{ orderStateList[order.order_status].text }}</text>
      </view>

      <!-- 订单商品信息 -->
      <navigator
        v-for="item in order.skus"
        :key="item.id"
        class="goods"
        :url="`/pagesOrder/detail/detail?id=${order.id}`"
        hover-class="none"
      >
        <view class="cover">
          <image class="image" mode="aspectFit" :src="item.product_pic_url"></image>
        </view>
        <view class="meta">
          <view class="name ellipsis">{{ item.product_name }}</view>
          <view class="type">{{ item.product_attr }}</view>
        </view>
      </navigator>

      <!-- 支付信息 -->
      <view class="payment">
        <text class="quantity">共{{ order.product_num }}件商品</text>
        <text>实付</text>
        <text class="amount"> <text class="symbol">¥</text>{{ order.pay_amount }}</text>
      </view>

      <view class="action">
        <!-- 待付款状态 -->
        <template v-if="order.order_status === OrderState.UNPAID">
          <view class="button primary" @tap="onGoToPay(order.id)">去支付</view>
        </template>
        <template v-else>
          <!-- 待收货状态 -->
          <view v-if="order.order_status === OrderState.SHIPPED" class="button primary" @tap="onOrderConfirm(order.id)"> 确认收货 </view>
        </template>
      </view>
    </view>

    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      {{ isFinish ? '没有更多数据~' : '正在加载...' }}
    </view>
  </scroll-view>
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <view class="pay-panel">
      <view class="pay-option" @tap="onOrderPay('balance')">
        <text class="checkbox" :class="{ checked: paymehtMethod === 'balance' }"></text>
        <text class="pay-icon icon-money-wallet"></text>
        <text>余额( <text class="symbol">¥</text>{{ memberStore.profile?.account_balance }})</text>
      </view>
      <view class="pay-option" @tap="onOrderPay('wechat')">
        <text class="checkbox" :class="{ checked: paymehtMethod === 'wechat' }"></text>
        <text class="pay-icon icon-wechat"></text>
        <text>微信</text>
      </view>
    </view>
  </uni-popup>
</template>

<style lang="scss">
.orders {
  .card {
    min-height: 100rpx;
    padding: 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;

    &:last-child {
      padding-bottom: 40rpx;
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #999;
    margin-bottom: 15rpx;

    .date {
      color: #666;
      flex: 1;
    }

    .primary {
      color: #ff9240;
    }

    .icon-delete {
      line-height: 1;
      margin-left: 10rpx;
      padding-left: 10rpx;
      border-left: 1rpx solid #e3e3e3;
    }
  }

  .goods {
    display: flex;
    margin-bottom: 20rpx;

    .cover {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
      position: relative;
      .image {
        width: 170rpx;
        height: 170rpx;
      }
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      line-height: 1;
      padding: 6rpx 4rpx 6rpx 8rpx;
      font-size: 24rpx;
      color: #fff;
      border-radius: 10rpx 0 0 0;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 10rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .more {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #333;
    }
  }

  .payment {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 1;
    padding: 20rpx 0;
    text-align: right;
    color: #999;
    font-size: 28rpx;
    border-bottom: 1rpx solid #eee;

    .quantity {
      font-size: 24rpx;
      margin-right: 16rpx;
    }

    .amount {
      color: #444;
      margin-left: 6rpx;
    }

    .symbol {
      font-size: 20rpx;
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 20rpx;

    .button {
      width: 180rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }

    .secondary {
      color: #010101;
      border-color: #010101;
    }

    .primary {
      color: #fff;
      background-color: #010101;
      border-color: #010101;
    }
  }

  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
.pay-panel {
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
  .checkbox {
    margin-right: 10rpx;
    // width: 80rpx;
    &::before {
      content: '\e72f';
      font-family: 'iconfont' !important;
      font-size: 40rpx;
      color: #444;
    }

    &.checked::before {
      content: '\e730';
      color: #010101;
    }
  }
  .pay-icon {
    margin-right: 10rpx;
  }
  .symbol {
    font-size: 30rpx;
  }
  .pay-option {
    width: 100%;
    // flex: 1 0 100%;
    padding: 20rpx;
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    .icon-money-rmb-symbol {
      font-size: 45rpx;
    }
    .icon-wechat {
      color: #1aad19;
    }
  }
}
</style>
