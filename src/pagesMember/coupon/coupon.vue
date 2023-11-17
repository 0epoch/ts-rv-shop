<template>
  <view class="coupon"></view>
</template>

<style lang="scss">
view {
  background-color: bisque;
}
.coupon {
  width: 100%;
  height: 160rpx;
  margin-top: 15rpx;
  background-color: #010101;
  mask-image: radial-gradient(circle at right 200rpx bottom 8rpx, transparent 8rpx, red 8.5rpx),
    radial-gradient(closest-side circle at 50%, red 99%, transparent 100%);
  mask-size: 100%, 2rpx 12rpx;
  mask-repeat: repeat, repeat-y;
  mask-position: 0 8rpx, calc(100% - 199.5rpx);
  mask-composite: source-out;
  mask-composite: subtract;
}
</style>
