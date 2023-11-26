<script setup lang="ts">
import { couponList, receiveCoupon } from '@/api/coupon'
import type { Coupon, UserCoupon } from '@/types/coupon'
import type { Paginate } from '@/types/global'
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'

const couponListVisible = ref(false)

const checkedRecharge = ref(0)

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
    <view v-if="couponListVisible" class="card">
      <text class="checkbox"></text>
      <view class="recharge" v-for="item in coupons?.data" :key="item.id">
        <view class="overview">
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">1000</text>
          </view>
        </view>
        <view class="action">
          <text>赠送</text>
          <view class="price">100元</view>
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
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.checkbox {
  width: 50rpx;
  margin-right: 10rpx;
  &::before {
    content: '\e6cd';
    font-family: 'erabbit' !important;
    font-size: 40rpx;
    color: #444;
  }

  &.checked::before {
    content: '\e6cc';
    color: #010101;
  }
}
.recharge {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 160rpx;
  padding: 20rpx 25rpx;
  margin-top: 15rpx;
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
    border-radius: 4rpx;
    // margin-right: 30rpx;
    // .price {
    //   color: #010101;
    // }
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
