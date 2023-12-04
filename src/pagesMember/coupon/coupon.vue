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
const finish = ref(false)
const triggered = ref(false)

const activeStatus = ref('unused')

const onTapTab = async (id: number, status: string) => {
  activeTab.value = id
  activeStatus.value = status
  const rs = await userCouponList({ params: { status } })
  userCoupons.value = rs.data
}

const getUserCouponList = async () => {
  const rs = await userCouponList({ params: { status: activeStatus.value } })
  userCoupons.value = rs.data
  userCoupons.value.page = rs.data.current_page
}

onLoad(() => {
  getUserCouponList()
})

const onRefresherrefresh = async () => {
  triggered.value = true
  await getUserCouponList()
  triggered.value = false
}

// 滚动触底
const onScrolltolower = async () => {
  if (!userCoupons.value) return
  if (userCoupons.value?.current_page! < userCoupons.value?.last_page!) {
    userCoupons.value.page++
  } else {
    finish.value = true
    return uni.showToast({ icon: 'none', title: '没有更多数据了~' })
  }

  const rs = await userCouponList({
    params: { status: activeStatus.value },
    pagination: { page: userCoupons.value.page },
  })
  userCoupons.value.data.push(...rs.data.data)
  userCoupons.value.current_page = rs.data.current_page
}
</script>

<template>
  <view class="viewport">
    <scroll-view
      class="scroll-view"
      enable-back-to-top
      refresher-enabled
      scroll-y
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="triggered"
      @scrolltolower="onScrolltolower"
    >
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

      <view class="wrapper">
        <view class="coupon" v-for="item in userCoupons?.data" :key="item.id">
          <view class="overview">
            <view class="meta">
              <text class="title">{{ item.coupon.title }}</text>
              <text class="desc ellipsis">{{ item.coupon.desc }}</text>
            </view>

            <text class="time"
              >有效期：{{ item.start_time.replace(/-/g, '.').substring(0, 10) }}-{{
                item.end_time.replace(/-/g, '.').substring(0, 10)
              }}</text
            >
          </view>
          <view :class="activeTab !== 0 ? 'invalid' : 'price'">
            <text>{{ item.type === 'discount' ? item.value * 10 : Math.floor(item.value) }}</text>
            <text>{{ item.type === 'discount' ? '折' : '元' }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
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
  background-color: #f4f4f4;
  .scroll-view {
    flex: 1;
  }
  .wrapper {
    padding: 20rpx;
  }
}

.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 120rpx;
  // margin-bottom: 20rpx;
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
  height: 180rpx;
  padding: 20rpx 25rpx;
  margin-bottom: 20rpx;
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
    margin-right: 50rpx;
    font-size: 45rpx;
    color: #e51c23;
  }
  .invalid {
    color: #939393;
  }
}
</style>
