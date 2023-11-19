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
          <view class="meta">
            <text class="title">{{ item.title }}</text>
            <text class="desc ellipsis">{{ item.desc }}</text>
          </view>
        </view>
        <view class="action">
          <view class="price">{{
            item.type === 'discount' ? item.value * 10 + '折' : Math.floor(item.value) + '元'
          }}</view>
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
  height: 160rpx;
  padding: 20rpx 25rpx;
  margin-top: 15rpx;
  background-color: #fff;
  border-radius: 8rpx;
  mask-image: radial-gradient(circle at right 200rpx bottom 8rpx, transparent 8rpx, red 8.5rpx),
    radial-gradient(closest-side circle at 50%, red 99%, transparent 100%);
  mask-size: 100%, 2rpx 12rpx;
  mask-repeat: repeat, repeat-y;
  mask-position: 0 8rpx, calc(100% - 199.5rpx);
  mask-composite: source-out;
  mask-composite: subtract;
  .overview {
    flex: 70%;
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
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
      font-size: 20rpx;
    }
  }
  .action {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 30rpx;
    .price {
      color: #e51c23;
    }
    .button {
      margin-top: 10rpx;
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
