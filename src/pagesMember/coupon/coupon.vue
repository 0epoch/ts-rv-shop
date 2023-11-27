<script setup lang="ts">
import { userCouponList } from '@/api/user'
import type { UserCoupon } from '@/types/coupon'
import type { Paginate } from '@/types/global'
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'

const tabs = [
  { id: 0, title: '可使用', status: 'unused' },
  { id: 1, title: '已使用', status: 'used' },
  { id: 2, title: '已过期', status: 'expired' },
]
const userCoupons = ref<Paginate<UserCoupon>>()
const activeTab = ref(0)

const onTapTab = async (id: number, status: string) => {
  activeTab.value = id
  const rs = await userCouponList({ params: { status } })
  userCoupons.value = rs.data
}

const getUserCouponList = async () => {
  const rs = await userCouponList()
  userCoupons.value = rs.data
}

onLoad(() => {
  getUserCouponList()
})
</script>

<template>
  <view class="tabs">
    <text
      v-for="(item, index) in tabs"
      :key="item.id"
      class="text"
      :class="{ active: index === activeTab }"
      @tap="onTapTab(item.id, item.status)"
      >{{ item.title }}</text
    >
  </view>
  <view class="viewport">
    <view class="coupon" v-for="item in userCoupons?.data" :key="item.id">
      <view class="overview">
        <view class="meta">
          <text class="title">{{ item.coupon.title }}</text>
          <text class="desc ellipsis">{{ item.coupon.desc }}</text>
        </view>

        <text class="time"
          >有效期：{{ item.start_time.replace(/-/g, '.').substring(0, 10) }}-{{ item.end_time.replace(/-/g, '.').substring(0, 10) }}</text
        >
      </view>
      <view :class="activeTab !== 0 ? 'invalid' : 'price'">{{
        item.coupon.type === 'discount' ? item.coupon.value * 10 + '折' : Math.floor(item.coupon.value) + '元'
      }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
page {
  background-color: #fff;
}
.viewport {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20rpx;
  background-color: #f4f4f4;
}

.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 120rpx;
  line-height: 90rpx;
  font-size: 28rpx;
  box-shadow: 0 2rpx 3rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  .text {
    margin: 0 20rpx;
    line-height: 120rpx;
    color: #939393;
  }
  .active {
    color: #010101;
  }
}
.coupon {
  display: flex;
  justify-content: space-between;
  // align-items: center;
  width: 100%;
  height: 160rpx;
  padding: 20rpx 25rpx;
  margin-top: 20rpx;
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
      font-size: 24rpx;
    }
  }
  .price {
    display: flex;
    align-items: center;
    margin-right: 30rpx;
    color: #e51c23;
  }
  .invalid {
    color: #939393;
  }
}
</style>
