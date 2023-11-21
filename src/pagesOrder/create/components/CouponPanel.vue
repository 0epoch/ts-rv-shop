<script setup lang="ts">
import { ref } from 'vue'
import type { UserCoupon } from '@/types/coupon'
import { onLoad } from '@dcloudio/uni-app'

const props = defineProps<{
  userCoupons?: UserCoupon[]
  assignId: number
}>()
const emit = defineEmits<{
  (event: 'changeCoupon', id: number): void
}>()
const checkedCoupon = ref(0)

onLoad(() => {
  console.log(props.userCoupons, '..........')
})

const onChangeChecked = async (item: UserCoupon) => {
  checkedCoupon.value = item.id
  emit('changeCoupon', item.id)
}
</script>

<template>
  <view enable-back-to-top scroll-y class="viewport" id="scroller">
    xxxxxxxxxxxxx
    <view class="coupon" v-for="item in props.userCoupons" :key="item.id">
      <text
        @tap="onChangeChecked(item)"
        class="checkbox"
        :class="{ checked: item.id === checkedCoupon }"
      ></text>
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
    </view>
  </view>
</template>

<style lang="scss" scoped>
.viewport {
  height: 200rpx;
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
  margin-top: 5rpx;
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
