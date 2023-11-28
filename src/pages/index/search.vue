<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

import { useMemberStore } from '@/stores'

import { productList } from '@/api/product'
import type { Paginate } from '@/types/global'
import type { Product, ProductParams } from '@/types/product'

const memberStore = useMemberStore()

const keyword = ref()
const products = ref<Paginate<Product>>()
const productParams = ref<ProductParams>()
const finish = ref(false)
const triggered = ref(false)
const isLoading = ref(false)
const hasAff = ref(false)

const getProductList = async () => {
  const rs = await productList({ params: { keyword: keyword.value } })
  products.value = rs.data
  if (rs.data.total <= 0) {
    finish.value = true
  }
}
const onSearch = () => {
  getProductList()
}

onLoad(async () => {
  hasAff.value = memberStore.profile?.has_aff ? true : false
})

const onRefresherrefresh = async () => {
  triggered.value = true
  await getProductList()
  triggered.value = false
}

const onScrolltolower = async () => {
  if (!products.value) return
  if (products.value?.current_page! < products.value?.last_page!) {
    products.value.page++
  } else {
    finish.value = true
    return uni.showToast({ icon: 'none', title: '没有更多数据了~' })
  }

  const rs = await productList({
    params: productParams.value,
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
      <view class="search">
        <text class="icon-search"> </text>
        <input class="input" name="keyword" type="text" v-model="keyword" @confirm="onSearch" placeholder="商品搜索" />
        <text class="search-text" @tap="onSearch">搜索</text>
      </view>
      <RvProduct :products="products" />

      <view class="loading-text">
        {{ finish && products?.total ? '没有更多数据了~' : '正在加载...' }}
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
.viewport {
  // height: 100%;
  position: relative;
  height: 100vh;
  background-color: #f4f4f4;
}
.search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx 0 26rpx;
  height: 78rpx;
  margin: 20rpx 20rpx;
  color: #666;
  font-size: 28rpx;
  border-radius: 32rpx;
  background-color: #fff;
  .icon-search {
    &::before {
      margin-right: 10rpx;
    }
  }
  .input {
    flex: 1;
    display: block;
    height: 46rpx;
  }
  .search-text {
    padding: 0 10rpx;
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
