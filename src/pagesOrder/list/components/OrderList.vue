<script setup lang="ts">
import { OrderState } from '@/services/constants'
import { orderStateList } from '@/services/constants'
import { putMemberOrderReceiptByIdAPI } from '@/services/order'
import { orderList } from '@/api/order'

import { deleteMemberOrderAPI } from '@/services/order'
import { getMemberOrderAPI } from '@/services/order'
import { getPayMockAPI, getPayWxPayMiniPayAPI } from '@/services/pay'
import type { Order, OrderResult } from '@/types/order'
import type { OrderListParams } from '@/types/order'
import { onMounted, ref } from 'vue'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 定义 porps
const props = defineProps<{
  orderStatus: string
}>()

// 请求参数
const queryParams: Required<OrderListParams> = {
  page: 1,
  per_page: 5,
  order_status: props.orderStatus,
}

// 获取订单列表
const orders = ref<OrderResult[]>([])
// 是否加载中标记，用于防止滚动触底触发多次请求
const isLoading = ref(false)
const getOrderList = async () => {
  // 如果数据出于加载中，退出函数
  if (isLoading.value) return
  // 退出分页判断
  if (isFinish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  // 发送请求前，标记为加载中
  isLoading.value = true
  // 发送请求
  const rs = await orderList(queryParams)

  // 发送请求后，重置标记
  isLoading.value = false
  // 数组追加
  orders.value.push(...rs.data.data)
  // 分页条件
  if (queryParams.page < rs.data.last_page) {
    // 页码累加
    queryParams.page++
  } else {
    // 分页已结束
    isFinish.value = true
  }
}
// const getMemberOrderData = async () => {
//   // 如果数据出于加载中，退出函数
//   if (isLoading.value) return
//   // 退出分页判断
//   if (isFinish.value === true) {
//     return uni.showToast({ icon: 'none', title: '没有更多数据~' })
//   }
//   // 发送请求前，标记为加载中
//   isLoading.value = true
//   // 发送请求
//   const res = await getMemberOrderAPI(queryParams)
//   // 发送请求后，重置标记
//   isLoading.value = false
//   // 数组追加
//   orderList.value.push(...res.result.items)
//   // 分页条件
//   if (queryParams.page < res.result.pages) {
//     // 页码累加
//     queryParams.page++
//   } else {
//     // 分页已结束
//     isFinish.value = true
//   }
// }

onMounted(() => {
  getOrderList()
})

// 订单支付
const onOrderPay = async (id: string) => {
  if (import.meta.env.DEV) {
    // 开发环境模拟支付
    await getPayMockAPI({ orderId: id })
  } else {
    // #ifdef MP-WEIXIN

    // 正式环境支付：1.获取支付订单信息，2.调用微信支付API
    // const res = await getPayWxPayMiniPayAPI({ orderId: id })
    // await wx.requestPayment(res.result)

    // 注意：因小程序上线后被恶意投诉：理由为支付 0.01 元后不发货，现调整为模拟支付
    await getPayMockAPI({ orderId: id })
    // #endif
  }
  // 成功提示
  uni.showToast({ title: '模拟支付成功' })
  // 模拟支付提示
  setTimeout(() => {
    wx.showModal({
      title: '温馨提示',
      content: '此交易是模拟支付，您并未付款，不会导致实际购买商品或服务',
      confirmText: '知道了',
      showCancel: false,
    })
  }, 2000)
  // 更新订单状态
  const order = orders.value.find((v) => v.id === id)
  order!.order_status = OrderState.WAIT_SHIP
}

// 确认收货
const onOrderConfirm = (id: string) => {
  uni.showModal({
    content: '为保障您的权益，请收到货并确认无误后，再确认收货',
    confirmColor: '#010101',
    success: async (res) => {
      if (res.confirm) {
        await putMemberOrderReceiptByIdAPI(id)
        uni.showToast({ icon: 'success', title: '确认收货成功' })
        // 确认成功，更新为待评价
        const order = orders.value.find((v) => v.id === id)
        order!.order_status = OrderState.COMPLETED
      }
    },
  })
}

// 删除订单
const onOrderDelete = (id: string) => {
  uni.showModal({
    content: '你确定要删除该订单？',
    confirmColor: '#010101',
    success: async (res) => {
      if (res.confirm) {
        await deleteMemberOrderAPI({ ids: [id] })
        // 删除成功，界面中删除订单
        const index = orders.value.findIndex((v) => v.id === id)
        orders.value.splice(index, 1)
      }
    },
  })
}

// 是否分页结束
const isFinish = ref(false)
// 是否触发下拉刷新
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 重置数据
  queryParams.page = 1
  orders.value = []
  isFinish.value = false
  // 加载数据
  await getOrderList()
  // 关闭动画
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
      <!-- 订单信息 -->
      <view class="status">
        <text class="date">{{ order.created_at }}</text>
        <!-- 订单状态文字 -->
        <text>{{ orderStateList[order.order_status as keyof typeof orderStateList].text }}</text>
        <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
        <text
          v-if="order.order_status >= OrderState.UNPAID"
          class="icon-delete"
          @tap="onOrderDelete(order.id)"
        ></text>
      </view>
      <!-- 商品信息，点击商品跳转到订单详情，不是商品详情 -->
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
      <!-- 订单操作按钮 -->
      <view class="action">
        <!-- 待付款状态：显示去支付按钮 -->
        <template v-if="order.order_status === OrderState.UNPAID">
          <view class="button primary" @tap="onOrderPay(order.id)">去支付</view>
        </template>
        <template v-else>
          <navigator
            class="button secondary"
            :url="`/pagesOrder/create/create?orderId=${order.id}`"
            hover-class="none"
          >
            再次购买
          </navigator>
          <!-- 待收货状态: 展示确认收货 -->
          <view
            v-if="order.order_status === OrderState.SHIPPED"
            class="button primary"
            @tap="onOrderConfirm(order.id)"
          >
            确认收货
          </view>
        </template>
      </view>
    </view>
    <!-- 底部提示文字 -->
    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      {{ isFinish ? '没有更多数据~' : '正在加载...' }}
    </view>
  </scroll-view>
</template>

<style lang="scss">
// 订单列表
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
</style>
