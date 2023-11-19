<script setup lang="ts">
const emit = defineEmits<{
  (event: 'close'): void
}>()

const onConfirm = () => {
  uni.login({
    success: (rs) => {
      const code = rs.code
    },
    fail: (rs) => {
      console.log(rs, '取消授权')
    },
  })
}
</script>

<template>
  <view class="panel">
    <text class="close icon-close" @tap="emit('close')"></text>
    <view class="title">欢迎来到RiverValley商城</view>
    <view class="content">
      <view>
        <text>为提供优质服务，RiverValley商城需要获取以下信息：</text>
        <text>您的公开信息（昵称，头像等）</text>
      </view>
      <button class="button" @tap="onConfirm">确认</button>
    </view>
  </view>
</template>

