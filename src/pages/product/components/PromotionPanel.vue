<script setup lang="ts">
// 子调父
const emit = defineEmits<{
  (event: 'close'): void
}>()

defineProps<{
  promotion: string
}>()
</script>

<template>
  <view class="service-panel">
    <!-- 关闭按钮 -->
    <text class="close icon-close" @tap="emit('close')"></text>
    <!-- 标题 -->
    <view class="title">优惠详情</view>
    <!-- 内容 -->
    <view class="content">
      <view class="item">
        <view class="dt tag">满减满折</view>
        <view class="dd"> {{ promotion }} </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.service-panel {
  height: 50vh;
  padding: 0 30rpx;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #fff;
}

.title {
  line-height: 1;
  padding: 40rpx 0;
  text-align: center;
  font-size: 32rpx;
  font-weight: normal;
  color: #444;
}

.close {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
}

.content {
  padding: 20rpx 20rpx 100rpx 20rpx;

  .item {
    margin-top: 20rpx;
  }

  .dt {
    margin-bottom: 10rpx;
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    position: relative;

    &::before {
      content: '';
      width: 10rpx;
      height: 10rpx;
      border-radius: 50%;
      background-color: #eaeaea;
      transform: translateY(-50%);
      position: absolute;
      top: 50%;
      left: -20rpx;
    }
  }

  .dd {
    line-height: 1.6;
    font-size: 26rpx;
    // color: #999;
  }
  .tag {
    width: 110rpx;
    margin-right: 10rpx;
    padding: 5rpx 10rpx;
    text-align: center;
    border: 1rpx solid #010101;
    border-radius: 4rpx;
    font-size: 20rpx;
  }
}
</style>
