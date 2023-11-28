<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types/product'
import type { Paginate } from '@/types/global'

import { onLoad } from '@dcloudio/uni-app'
import { productList } from '@/api/product'
const finish = ref(false)
const triggered = ref(false)

const query = defineProps<{
  id?: number
  nav_id?: number
  navTitle?: string
}>()

const products = ref<Paginate<Product>>()
const getProductList = async () => {
  const rs = await productList({ params: { nav_id: query.nav_id } })
  products.value = rs.data
  products.value.page = rs.data.current_page
  if (rs.data.last_page <= 1) {
    finish.value = true
  }
}
onLoad(() => {
  uni.setNavigationBarTitle({
    title: query.navTitle ? query.navTitle : '商品列表',
  })
  getProductList()
})

const onRefresherrefresh = async () => {
  triggered.value = true
  await getProductList()
  triggered.value = false
}

// 滚动触底
const onScrolltolower = async () => {
  if (!products.value) return
  if (products.value?.current_page! < products.value?.last_page!) {
    products.value.page++
  } else {
    finish.value = true
    return uni.showToast({ icon: 'none', title: '没有更多数据了~' })
  }

  const rs = await productList({
    params: {},
    pagination: { page: products.value.page },
  })
  products.value.data.push(...rs.data.data)
  products.value.current_page = rs.data.current_page
}
</script>

<template>
  <view class="viewport">
    <scroll-view
      enable-back-to-top
      refresher-enabled
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="triggered"
      @scrolltolower="onScrolltolower"
      class="scroll-view"
      scroll-y
    >
      <RvProduct :products="products" />
      <view class="loading-text">
        {{ finish ? '没有更多数据了~' : '正在加载...' }}
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f4f4;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}
.scroll-view {
  margin-top: 20rpx;
  flex: 1;
}
.caption {
  display: flex;
  justify-content: center;
  line-height: 1;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  color: #333;
  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 28rpx 0 30rpx;
  }
}

// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
