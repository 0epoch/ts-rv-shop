<script setup lang="ts">
import CryptoJS from 'crypto-js'
import { useMemberStore } from '@/stores'
import { OrderState, orderStateList, PaymehtMethod } from '@/services/constants'
import { orderDetail, cancelOrder, orderPayment } from '@/api/order'
import { getProfile } from '@/api/user'

import type { LogisticItem, OrderResult } from '@/types/order'
import { onLoad, onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import PageSkeleton from './components/PageSkeleton.vue'

const { safeAreaInsets } = uni.getSystemInfoSync()

const memberStore = useMemberStore()
const popup = ref<UniHelper.UniPopupInstance>()
const popup2 = ref<UniHelper.UniPopupInstance>()

const reasonList = ref(['商品无货', '不想要了', '商品信息填错了', '地址信息填写错误', '商品降价', '其它'])
const paymehtMethod = ref('')
const reason = ref('')
const onCopy = (id: string) => {
  uni.setClipboardData({ data: id })
}

const query = defineProps<{
  id: number
}>()

const pages = getCurrentPages()

type PageInstance = Page.PageInstance & WechatMiniprogram.Page.InstanceMethods<any>

// #ifdef MP-WEIXIN
const pageInstance = pages.at(-1) as PageInstance

onReady(() => {
  pageInstance.animate('.navbar', [{ backgroundColor: 'transparent' }, { backgroundColor: '#f8f8f8' }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 0,
    endScrollOffset: 50,
  })
  pageInstance.animate('.navbar .title', [{ color: 'transparent' }, { color: '#000' }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 0,
    endScrollOffset: 50,
  })
  pageInstance.animate('.navbar .back', [{ color: '#fff' }, { color: '#000' }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 0,
    endScrollOffset: 50,
  })
})
// #endif

const order = ref<OrderResult>()
const getOrderDetail = async () => {
  const rs = await orderDetail({ order_id: query.id })
  console.log(rs, 'order..............')

  order.value = rs.data
}

const logisticList = ref<LogisticItem[]>([])

onLoad(() => {
  getOrderDetail()
})

const onTimeup = () => {
  order.value!.order_status = OrderState.CANCELED
}

const onGoToPay = async () => {
  const rs = await getProfile()
  rs.data.token = memberStore.profile?.token
  memberStore.setProfile(rs.data)
  popup2.value?.open?.()
}

// 订单支付
const onOrderPay = async () => {
  if (!paymehtMethod.value) {
    uni.showToast({ icon: 'none', title: '请选择支付方式' })
    return
  }
  const rs = await orderPayment({ order_id: query.id, pay_type: paymehtMethod.value })
  if (paymehtMethod.value === 'wechat') {
    wechatPay(rs.data.sign)
    return
  } else {
    uni.showToast({ icon: 'success', title: '支付成功' })
    setTimeout(function () {
      uni.redirectTo({ url: `/pagesOrder/detail/detail?id=${query.id}` })
    }, 1000)
  }
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
        uni.redirectTo({ url: `/pagesOrder/detail/detail?id=${query.id}` })
      }, 1000)
    },
    fail: function (rs) {
      return
      // uni.redirectTo({ url: `/pagesOrder/detail/detail?id=${query.id}` })
    },
  })
}

const onOrderConfirm = () => {
  uni.showModal({
    content: '为保障您的权益，请收到货并确认无误后，再确认收货',
    confirmColor: '#010101',
    success: async (success) => {
      if (success.confirm) {
        // const res = await putMemberOrderReceiptByIdAPI(query.id)
        // 更新订单状态
        // order.value = res.result
      }
    },
  })
}

// 取消订单
const onOrderCancel = async () => {
  if (!order.value) {
    uni.showToast({ icon: 'error', title: '请返回上一步获取订单数据' })
    return
  }

  await cancelOrder({ order_id: order.value?.id, reason: reason.value })
  popup.value?.close!()
  uni.showToast({ icon: 'none', title: '订单取消成功' })
}

const onChangePayment = (method: string) => {
  paymehtMethod.value = method
}

const refundable = [OrderState.WAIT_SHIP, OrderState.SHIPPED, OrderState.RECEIVED, OrderState.COMPLETED]
const onRefund = (id: number) => {}
</script>

<template>
  <!-- 自定义导航栏: 默认透明不可见, scroll-view 滚动到 50 时展示 -->
  <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <view class="wrap">
      <navigator v-if="pages.length > 1" open-type="navigateBack" class="back icon-left"></navigator>
      <navigator v-else url="/pages/index/index" open-type="switchTab" class="back icon-home"> </navigator>
      <view class="title">订单详情</view>
    </view>
  </view>
  <scroll-view enable-back-to-top scroll-y class="viewport" id="scroller">
    <template v-if="order">
      <!-- 订单状态 -->
      <view class="overview" :style="{ paddingTop: safeAreaInsets!.top + 20 + 'px' }">
        <!-- 待付款倒计时 -->
        <template v-if="order.order_status === OrderState.UNPAID">
          <view class="status icon-clock">等待付款</view>
          <view class="tips">
            <text class="money">应付金额: ¥ {{ order.pay_amount }}</text>
            <text class="time">支付剩余</text>
            <uni-countdown
              :second="order.countdown"
              color="#fff"
              splitor-color="#fff"
              :show-day="false"
              :show-colon="false"
              @timeup="onTimeup"
            />
          </view>
          <view class="btn" @tap="onGoToPay()">去支付</view>
        </template>

        <template v-else>
          <!-- 订单状态 -->
          <view class="status"> {{ orderStateList[order.order_status].text }} </view>
          <view class="btn-group">
            <!-- 确认收货 -->
            <view v-if="order.order_status === OrderState.SHIPPED" @tap="onOrderConfirm" class="btn"> 确认收货 </view>
          </view>
        </template>
      </view>

      <!-- 配送状态 -->
      <view class="shipment">
        <!-- 订单物流信息 -->
        <!-- 用户收货地址 -->
        <view class="locate">
          <view class="user"> {{ order.receiver_mobile }} </view>
          <view class="address">
            {{ order.receiver_addr }}
          </view>
        </view>
      </view>

      <!-- 商品信息 -->
      <view class="goods">
        <view class="item">
          <navigator
            class="navigator"
            v-for="item in order.skus"
            :key="item.id"
            :url="`/pages/goods/goods?id=${item.product_sku_id}`"
            hover-class="none"
          >
            <image class="cover" :src="item.product_pic_url"></image>
            <view class="meta">
              <view class="name ellipsis">{{ item.product_name }}</view>
              <view class="type">{{ item.product_attr }}</view>
              <view class="price">
                <view class="actual">
                  <text class="symbol">¥</text>
                  <text>{{ item.product_unit_price }}</text>
                </view>
              </view>
              <view class="quantity">x{{ item.product_num }}</view>
            </view>
            <!-- 退款 -->
          </navigator>
        </view>
        <!-- 合计 -->
        <view class="total">
          <view class="row">
            <view class="text">商品总价: </view>
            <view class="symbol">{{ order.order_amount }}</view>
          </view>
          <view class="row">
            <view class="text">实付金额: </view>
            <view class="symbol primary">{{ order.pay_amount }}</view>
          </view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="detail">
        <view class="title">订单信息</view>
        <view class="row">
          <view class="item">
            订单编号: {{ order.order_no }}
            <text class="copy" @tap="onCopy(order.order_no)">复制</text>
          </view>
          <view class="item">下单时间: {{ order.created_at }}</view>
        </view>
      </view>

      <view class="toolbar-height" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"></view>
      <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
        <!-- 待付款状态 -->
        <template v-if="order.order_status === OrderState.UNPAID">
          <view class="btn primary" @tap="onGoToPay()"> 去支付 </view>
          <view class="btn" @tap="popup?.open?.()"> 取消订单 </view>
        </template>

        <template v-else>
          <!-- 待收货状态 -->
          <view class="btn primary" v-if="order.order_status === OrderState.SHIPPED" @tap="onOrderConfirm"> 确认收货 </view>
        </template>
      </view>
    </template>
    <template v-else>
      <PageSkeleton />
    </template>
  </scroll-view>

  <!-- 取消订单 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <view class="popup-root">
      <view class="title">订单取消</view>
      <view class="description">
        <view class="tips">请选择取消订单的原因：</view>
        <view class="cell" v-for="item in reasonList" :key="item" @tap="reason = item">
          <text class="text">{{ item }}</text>
          <text class="icon" :class="{ checked: item === reason }"></text>
        </view>
      </view>
      <view class="footer">
        <view class="btn" @tap="popup?.close?.()">取消</view>
        <view class="btn primary" @tap="onOrderCancel">确认</view>
      </view>
    </view>
  </uni-popup>

  <uni-popup ref="popup2" type="bottom" background-color="#fff">
    <view class="pay-panel">
      <view class="pay-option" @tap="onChangePayment('balance')">
        <text class="checkbox" :class="{ checked: paymehtMethod === 'balance' }"></text>
        <text class="pay-icon icon-money-wallet"></text>
        <text>余额( <text class="symbol">¥</text>{{ memberStore.profile?.account_balance }})</text>
      </view>
      <view class="pay-option" @tap="onChangePayment('wechat')">
        <text class="checkbox" :class="{ checked: paymehtMethod === 'wechat' }"></text>
        <text class="pay-icon icon-wechat"></text>
        <text>微信</text>
      </view>
    </view>
    <view class="footer">
      <view class="btn" @tap="popup?.close?.()">取消</view>
      <view class="btn primary" @tap="onOrderPay">确认</view>
    </view>
  </uni-popup>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.navbar {
  width: 750rpx;
  color: #000;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  background-color: transparent;

  .wrap {
    position: relative;

    .title {
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
      /* color: #000; */
      color: transparent;
    }

    .back {
      position: absolute;
      left: 0;
      height: 44px;
      width: 44px;
      font-size: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      /* color: #000; */
      color: #fff;
    }
  }
}

.viewport {
  background-color: #f7f7f8;
}

.overview {
  display: flex;
  flex-direction: column;
  align-items: center;

  line-height: 1;
  padding-bottom: 30rpx;
  color: #fff;
  // background-image: url('/static/images/order_bg.png');
  background-color: #010101;

  background-size: cover;

  .status {
    font-size: 36rpx;
  }

  .status::before {
    margin-right: 6rpx;
    font-weight: 500;
  }

  .tips {
    margin: 30rpx 0;
    display: flex;
    font-size: 14px;
    align-items: center;

    .money {
      margin-right: 30rpx;
    }
  }

  .btn-group {
    margin-top: 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn {
    width: 260rpx;
    height: 64rpx;
    margin: 0 10rpx;
    text-align: center;
    line-height: 64rpx;
    font-size: 28rpx;
    color: #010101;
    border-radius: 72rpx;
    background-color: #fff;
  }
}

.shipment {
  line-height: 1.4;
  padding: 0 20rpx;
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
  background-color: #fff;

  .locate,
  .item {
    min-height: 120rpx;
    padding: 30rpx 30rpx 25rpx 75rpx;
    background-size: 50rpx;
    background-repeat: no-repeat;
    background-position: 6rpx center;
  }

  .locate {
    background-image: url('/static/images/locate.png');

    .user {
      font-size: 26rpx;
      color: #444;
    }

    .address {
      font-size: 24rpx;
      color: #666;
    }
  }

  .item {
    // background-image: url('/static/images/car_default.png');
    border-bottom: 1rpx solid #eee;
    position: relative;

    .message {
      font-size: 26rpx;
      color: #444;
    }

    .date {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.goods {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #eee;

    .navigator {
      display: flex;
      margin: 20rpx 0;
    }

    .cover {
      width: 170rpx;
      height: 170rpx;
      border-radius: 10rpx;
      margin-right: 20rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 6rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .price {
      display: flex;
      margin-top: 6rpx;
      font-size: 24rpx;
    }

    .symbol {
      font-size: 20rpx;
    }

    .original {
      color: #999;
      text-decoration: line-through;
    }

    .actual {
      margin-left: 10rpx;
      color: #444;
    }

    .text {
      font-size: 22rpx;
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 24rpx;
      color: #444;
    }

    .action {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-start;
      padding: 30rpx 0 0;

      .btn {
        width: 200rpx;
        text-align: center;
        justify-content: center;
        line-height: 64rpx;
        margin-left: 20rpx;
        border-radius: 72rpx;
        border: 1rpx solid #ccc;
        font-size: 26rpx;
        color: #444;
      }

      .primary {
        color: #010101;
        border-color: #010101;
      }
    }
  }

  .total {
    line-height: 1;
    font-size: 26rpx;
    padding: 20rpx 0;
    color: #666;

    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10rpx 0;
    }

    .symbol::before {
      content: '¥';
      font-size: 80%;
      margin-right: 3rpx;
    }

    .primary {
      color: #e51c23;
      font-size: 36rpx;
    }
  }
}

.detail {
  line-height: 1;
  padding: 30rpx 20rpx 0;
  margin: 20rpx 20rpx 0;
  font-size: 26rpx;
  color: #666;
  border-radius: 10rpx;
  background-color: #fff;

  .title {
    font-size: 30rpx;
    color: #444;
  }

  .row {
    padding: 20rpx 0;

    .item {
      padding: 10rpx 0;
      display: flex;
      align-items: center;
    }

    .copy {
      border-radius: 20rpx;
      font-size: 20rpx;
      border: 1px solid #ccc;
      padding: 5rpx 10rpx;
      margin-left: 10rpx;
    }
  }
}

.toolbar-height {
  height: 100rpx;
  box-sizing: content-box;
}

.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--window-bottom));
  z-index: 1;

  height: 100rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;
  background-color: #fff;
  box-sizing: content-box;

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 200rpx;
    height: 72rpx;
    margin-left: 15rpx;
    font-size: 26rpx;
    line-height: 72rpx;
    border-radius: 72rpx;
    border: 1rpx solid #010101;
    color: #444;
  }

  .delete {
    order: 4;
    color: #e51c23;
  }

  .btn {
    order: 3;
  }

  .secondary {
    order: 2;
    color: #010101;
    border-color: #010101;
  }

  .primary {
    order: 1;
    color: #fff;
    background-color: #010101;
  }
}

.popup-root {
  padding: 30rpx 30rpx 0;
  border-radius: 10rpx 10rpx 0 0;
  overflow: hidden;

  .title {
    font-size: 30rpx;
    text-align: center;
    margin-bottom: 30rpx;
  }

  .description {
    font-size: 28rpx;
    padding: 0 20rpx;

    .tips {
      color: #444;
      margin-bottom: 12rpx;
    }

    .cell {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15rpx 0;
      color: #666;
    }

    .icon::before {
      content: '\e72f';
      font-family: 'iconfont' !important;
      font-size: 40rpx;
      color: #999;
    }

    .icon.checked::before {
      content: '\e730';
      font-size: 40rpx;
      color: #010101;
    }
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  padding: 30rpx 0 40rpx;
  font-size: 28rpx;
  color: #444;

  .btn {
    flex: 1;
    text-align: center;
    line-height: 72rpx;
    margin: 0 20rpx;
    color: #444;
    border-radius: 50rpx;
    border: 1rpx solid #010101;
  }

  .primary {
    color: #fff;
    background-color: #010101;
    border: none;
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
