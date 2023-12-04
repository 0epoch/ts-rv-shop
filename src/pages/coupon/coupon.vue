<script setup lang="ts">
import { couponList, receiveCoupon } from '@/api/coupon'
import type { Coupon, UserCoupon } from '@/types/coupon'
import type { Paginate } from '@/types/global'
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'

const couponListVisible = ref(false)

const coupons = ref<Paginate<Coupon>>()
const getCouponList = async () => {
  const rs = await couponList({})
  coupons.value = rs.data
  couponListVisible.value = rs.data.data.length > 0
}

const onReceive = async (id: number) => {
  const rs = await receiveCoupon(id)
  uni.showToast({ icon: 'success', title: '领取成功' })
  getCouponList()
}

onLoad(() => {
  getCouponList()
})
</script>

<template>
  <view class="viewport">
    <view v-if="couponListVisible">
      <view class="coupon" v-for="item in coupons?.data" :key="item.id">
        <view class="overview">
          <!-- <view class="meta"> -->
          <text class="title">{{ item.title }}</text>
          <text class="desc ellipsis">{{ item.desc }}</text>
          <!-- </view> -->
        </view>
        <view class="action">
          <view class="price">
            <text>{{ item.type === 'discount' ? item.value * 10 : Math.floor(item.value) }}</text>
            <text>{{ item.type === 'discount' ? '折' : '元' }}</text>
          </view>
          <text class="button" @tap="onReceive(item.id)">领 取</text>
        </view>
      </view>
    </view>

    <view class="blank" v-else>暂无优惠券领取~</view>
  </view>
</template>

<style lang="scss" scoped>
page {
  background-color: #f4f4f4;
}
.viewport {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20rpx;
  background-color: #f4f4f4;
}
.coupon {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 180rpx;
  padding: 20rpx 25rpx;
  margin-top: 20rpx;
  background-color: #fff;
  border-radius: 8rpx;
  font-size: 40rpx;
  mask-image: radial-gradient(circle at right 240rpx bottom 16rpx, transparent 16rpx, red 16.5rpx),
    radial-gradient(closest-side circle at 50%, red 99%, transparent 100%);
  mask-size: 100%, 6rpx 16rpx;
  mask-repeat: repeat, repeat-y;
  mask-position: 0 16rpx, calc(100% - 238.5rpx);
  mask-composite: source-out;
  mask-composite: subtract;
  .overview {
    flex: 70%;
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .meta {
      display: flex;
      flex-direction: column;
    }
    .desc {
      padding: 5rpx 0;
    }
    .desc,
    .time {
      color: #939393;
      font-size: 24rpx;
    }
  }
  .action {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 50rpx;
    .price {
      font-size: 45rpx;
      color: #e51c23;
    }
    .button {
      color: #010101;
      padding: 5rpx 15rpx;
      border-radius: 4rpx;
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
