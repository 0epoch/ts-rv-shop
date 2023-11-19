<script setup lang="ts">
import { homeConfs } from '@/api/home'

import type { ConfItem, HomeConfs } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const activeIndex = ref(0)
const onChange: UniHelper.SwiperOnChange = (ev) => {
  activeIndex.value = ev.detail.current
}

const homeBanner = ref<HomeConfs>()
const getHomeConfs = async () => {
  const rs = await homeConfs()
  homeBanner.value = rs.data
}

const isLoading = ref(false)

onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeConfs()])
  isLoading.value = false
})

const onTap = (item: ConfItem) => {
  uni.navigateTo({ url: `/pages/product/list?nav_id=${item.id}&navTitle=${item.name}` })
}
</script>

<template>
  <view class="carousel">
    <swiper :circular="true" :autoplay="true" :interval="3000" @change="onChange">
      <swiper-item v-for="item in homeBanner?.banner" :key="item.id">
        <image @tap="onTap(item)" mode="aspectFill" class="image" :src="item.cover"></image>
      </swiper-item>
    </swiper>
    <!-- 指示点 -->
    <view class="indicator">
      <text
        v-for="(item, index) in homeBanner?.banner"
        :key="item.id"
        class="dot"
        :class="{ active: index === activeIndex }"
      ></text>
    </view>
  </view>
</template>

<style lang="scss">
.carousel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  transform: translateY(0);
  background-color: #efefef;
  .indicator {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 16rpx;
    display: flex;
    justify-content: center;
    .dot {
      width: 30rpx;
      height: 6rpx;
      margin: 0 8rpx;
      border-radius: 6rpx;
      background-color: rgba(255, 255, 255, 0.4);
    }
    .active {
      background-color: #fff;
    }
  }
  .navigator,
  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
