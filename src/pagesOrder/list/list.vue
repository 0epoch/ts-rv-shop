<script setup lang="ts">
import { ref } from 'vue'
import OrderList from './components/OrderList.vue'
import RefundList from './components/RefundList.vue'

import { OrderState } from '@/services/constants'

const query = defineProps<{
  type: string
}>()

const orderTabs = ref([
  { index: 0, title: '全部', isRender: false, status: '' },
  { index: 1, title: '待付款', isRender: false, status: OrderState.UNPAID },
  { index: 2, title: '待发货', isRender: false, status: OrderState.WAIT_SHIP },
  { index: 3, title: '待收货', isRender: false, status: OrderState.SHIPPED },
  { index: 4, title: '退款/售后', isRender: false, status: OrderState.REFUND },
])

const activeIndex = ref(orderTabs.value.findIndex((v) => v.index === Number(query.type)))
orderTabs.value[activeIndex.value].isRender = true
</script>

<template>
  <view class="viewport">
    <!-- tabs -->
    <view class="tabs">
      <text
        class="item"
        v-for="(item, index) in orderTabs"
        :key="item.title"
        @tap="
          () => {
            activeIndex = index
            item.isRender = true
          }
        "
      >
        {{ item.title }}
      </text>
      <view class="cursor" :style="{ left: activeIndex * 20 + '%' }"></view>
    </view>
    <swiper class="swiper" :current="activeIndex" @change="activeIndex = $event.detail.current">
      <swiper-item v-for="item in orderTabs" :key="item.title">
        <RefundList v-if="item.index === 4 && item.isRender" />
        <view v-else>
          <OrderList v-if="item.isRender" :order-status="item.status" />
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

// tabs
.tabs {
  display: flex;
  justify-content: space-around;
  line-height: 60rpx;
  margin: 0 10rpx;
  background-color: #fff;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);
  position: relative;
  z-index: 9;

  .item {
    flex: 20%;
    text-align: center;
    padding: 20rpx 0;
    font-size: 28rpx;
    color: #262626;
  }

  .cursor {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 20%;
    height: 6rpx;
    padding: 0 50rpx;
    background-color: #010101;
    /* 过渡效果 */
    transition: all 0.4s;
  }
}

// swiper
.swiper {
  background-color: #f7f7f8;
}
</style>
