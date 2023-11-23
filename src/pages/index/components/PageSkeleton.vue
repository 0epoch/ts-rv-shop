<template name="skeleton">
  <view is="components/RvSwiper">
    <view class="carousel RvSwiper--carousel">
      <view class="indicator RvSwiper--indicator">
        <text class="dot RvSwiper--dot active RvSwiper--active"></text>
        <text class="dot RvSwiper--dot"></text>
        <text class="dot RvSwiper--dot"></text>
        <text class="dot RvSwiper--dot"></text>
        <text class="dot RvSwiper--dot"></text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
/* #ifdef H5 || APP-PLUS */
/* 修复 H5 端骨架屏样式异常 */
/* 原因：H5 端样式自动开启 scoped 隔离，导致骨架屏的基础样式被隔离 */
@import '../styles/category.scss';
@import '@/components/styles/RvSwiper.scss';
/* #endif */

.sk-transparent {
  color: transparent !important;
}
.sk-text-3-5714-536 {
  background-image: linear-gradient(transparent 3.5714%, #eeeeee 0%, #eeeeee 96.4286%, transparent 0%) !important;
  background-size: 100% 28rpx;
  position: relative !important;
}
.sk-text {
  background-origin: content-box !important;
  background-clip: content-box !important;
  background-color: transparent !important;
  color: transparent !important;
  background-repeat: repeat-y !important;
}
.sk-text-14-2857-28 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 39.2rpx;
  position: relative !important;
}
.sk-text-14-2857-382 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-248 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-184 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-202 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-664 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-805 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-445 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-512 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-61 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-863 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-14-2857-739 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 44.8rpx;
  position: relative !important;
}
.sk-text-14-2857-229 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 33.6rpx;
  position: relative !important;
}
.sk-text-14-2857-73 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 44.8rpx;
  position: relative !important;
}
.sk-text-14-2857-879 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 33.6rpx;
  position: relative !important;
}
.sk-text-14-2857-323 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 44.8rpx;
  position: relative !important;
}
.sk-text-14-2857-50 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 33.6rpx;
  position: relative !important;
}
.sk-text-14-2857-70 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 44.8rpx;
  position: relative !important;
}
.sk-text-14-2857-877 {
  background-image: linear-gradient(transparent 14.2857%, #eeeeee 0%, #eeeeee 85.7143%, transparent 0%) !important;
  background-size: 100% 33.6rpx;
  position: relative !important;
}
.sk-text-0-0000-363 {
  background-image: linear-gradient(transparent 0%, #eeeeee 0%, #eeeeee 100%, transparent 0%) !important;
  background-size: 100% 32rpx;
  position: relative !important;
}
.sk-image {
  background: #efefef !important;
}
.sk-pseudo::before,
.sk-pseudo::after {
  background: #efefef !important;
  background-image: none !important;
  color: transparent !important;
  border-color: transparent !important;
}
.sk-pseudo-rect::before,
.sk-pseudo-rect::after {
  border-radius: 0 !important;
}
.sk-pseudo-circle::before,
.sk-pseudo-circle::after {
  border-radius: 50% !important;
}
.sk-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
}
</style>
