<script setup lang="ts">
import { RefundState, refundStateList } from '@/services/constants'
import { refundList } from '@/api/refund'

import type { Refund } from '@/types/refund'
import type { PaginateParams } from '@/types/global'
import { onMounted, ref } from 'vue'

const { safeAreaInsets } = uni.getSystemInfoSync()

const queryParams: Required<PaginateParams> = {
  page: 1,
  per_page: 10,
}

const refunds = ref<Refund[]>([])

const isLoading = ref(false)

const getRefundList = async () => {
  if (isLoading.value) return
  if (isFinish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }

  isLoading.value = true
  const rs = await refundList(queryParams)
  isLoading.value = false
  refunds.value.push(...rs.data.data)
  if (queryParams.page < rs.data.last_page) {
    queryParams.page++
  } else {
    isFinish.value = true
  }
}

onMounted(() => {
  getRefundList()
})

const isFinish = ref(false)
const isTriggered = ref(false)
const onRefresherrefresh = async () => {
  isTriggered.value = true
  // 重置分页
  queryParams.page = 1
  refunds.value = []
  isFinish.value = false
  await getRefundList()
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
    @scrolltolower="getRefundList"
  >
    <view class="card" v-for="refund in refunds" :key="refund.id">
      <view class="header">
        <text class="date">{{ refund.refund_no }}</text>
        <!-- 订单状态 -->
        <text>{{ refundStateList[refund.refund_status].text }}</text>
      </view>

      <!-- 订单商品信息 -->
      <navigator class="goods" :url="`/pagesOrder/detail/detail?id=${refund.order_id}`" hover-class="none">
        <view class="cover">
          <image class="image" mode="aspectFit" :src="refund.product_pic_url"></image>
        </view>
        <view class="meta">
          <view class="name ellipsis">{{ refund.product_name }}</view>
          <view class="type">{{ refund.product_attr }}</view>
        </view>
      </navigator>

      <view class="footer">
        <text>{{ refund.create_time }}</text>
        <view class="payment">
          <text class="quantity">共{{ refund.product_num }}件商品</text>
          <text>退款金额</text>
          <text class="amount"> <text class="symbol">¥</text>{{ refund.refund_amount }}</text>
        </view>
      </view>
    </view>

    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      {{ isFinish ? '没有更多数据~' : '正在加载...' }}
    </view>
  </scroll-view>
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

  .header {
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

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #999;
    font-size: 28rpx;
    border-bottom: 1rpx solid #eee;
  }
  .payment {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 1;
    padding: 20rpx 0;
    text-align: right;
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
