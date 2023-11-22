<script setup lang="ts">
import { useMemberStore } from '@/stores'

import { homeConfs, firstCategories } from '@/api/home'
import { productList } from '@/api/product'
import type { Paginate } from '@/types/global'
import type { Product, ProductParams } from '@/types/product'
import type { HomeConfs } from '@/types/home'

import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { Category } from '@/types/category'

const memberStore = useMemberStore()

const confs = ref<HomeConfs>()
const activeCategory = ref(0)
const triggered = ref(false)
const isLoading = ref(false)
const products = ref<Paginate<Product>>()
const productParams = ref<ProductParams>()

const categories = ref<Category[]>([])
const finish = ref(false)
const hasAff = ref(false)

const getHomeConfs = async () => {
  const rs = await homeConfs()
  confs.value = rs.data
}

const getProductList = async () => {
  const rs = await productList({ params: productParams.value })
  products.value = rs.data
  if (rs.data.total <= 0) {
    finish.value = true
  }
}

const getFirstCategoryList = async () => {
  const rs = await firstCategories()
  categories.value = rs.data
}

onLoad(async () => {
  isLoading.value = true
  await Promise.all([getProductList(), getHomeConfs(), getFirstCategoryList()])
  isLoading.value = false
  hasAff.value = memberStore.profile?.has_aff ? true : false
})

const onTapCategory = (id: number) => {
  activeCategory.value = id
  productParams.value = { ...productParams.value, cid_path: id }
  getProductList()
}

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
    params: productParams.value,
    pagination: { page: products.value.page },
  })
  products.value.data.push(...rs.data.data)
  products.value.current_page = rs.data.current_page
}
</script>

<template>
  <view class="viewport">
    <view class="action">
      <navigator class="search" hover-class="none" url="/pages/index/search">
        <text class="icon-search">搜索商品</text>
      </navigator>
      <view class="tab-wrapper" v-if="confs?.feature">
        <view class="tabs" v-if="confs.feature.length > 0">
          <view class="tab-box" v-for="(item, index) in confs.feature" :key="index">
            <view class="=tab">
              <navigator hover-class="none" class="navigator" :url="`/pages/product/list?nav_id=${item.id}&navTitle=${item.name}`">
                <image class="cover" :src="item.cover" mode="widthFix" />
                <view>{{ item.name }}</view>
              </navigator>
            </view>
          </view>
        </view>
      </view>
    </view>

    <scroll-view scroll-x class="category sticky">
      <view class="cate-item" @tap="onTapCategory(0)">
        <text :class="{ active: activeCategory === 0 }" class="cate-text">全部</text>
      </view>
      <view class="cate-item" @tap="onTapCategory(item.id)" v-for="item in categories" :key="item.id">
        <text :class="{ active: activeCategory === item.id }" class="cate-text">{{ item.name }}</text>
      </view>
    </scroll-view>

    <scroll-view
      enable-back-to-top
      refresher-enabled
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="triggered"
      @scrolltolower="onScrolltolower"
      class="scroll-view"
      scroll-y
    >
      <view class="goods">
        <navigator
          hover-class="none"
          class="navigator"
          v-for="product in products?.data"
          :key="product.id"
          :url="`/pages/product/detail?id=${product.id}`"
        >
          <image class="thumb" :src="product.pic_url"></image>
          <view class="desc">
            <view class="name ellipsis">{{ product.title }}</view>
            <view class="price">
              <text class="symbol">¥</text>
              <text class="number" v-if="hasAff && product.is_aff == 1">{{ product.aff_price }}</text>
              <text class="number" v-else>{{ product.price }}</text>
            </view>
          </view>
        </navigator>
      </view>
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
  // display: flex;
  // flex-direction: column;
  height: 100%;
  position: relative;
}

.search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx 0 26rpx;
  height: 64rpx;
  margin: 16rpx 20rpx;
  color: #666;
  font-size: 28rpx;
  border-radius: 32rpx;
  background-color: #fff;
}
.icon-search {
  &::before {
    margin-right: 10rpx;
  }
}

.cover {
  border-radius: 50%;
}
.scroll-view {
  flex: 1;
}
.tab-wrapper {
  padding: 0 20rpx 20rpx;
}
.tabs {
  display: flex;
  flex-wrap: wrap;
  border-radius: 10rpx;
  // background-color: #fff;
  color: #333;
  .tab-box {
    flex: 25%;
    flex-grow: 0;
    padding: 20rpx;
  }
}
.category {
  width: 100%;
  height: 120rpx;
  // padding: 0 20rpx;
  white-space: nowrap;
  color: #333;
  font-size: 34rpx;
  box-sizing: border-box;
  background-color: #fff;
  .cate-item {
    display: inline-block;
    width: 20%;
    text-align: center;
    line-height: 120rpx;
  }
  .cate-text {
    color: #939393;
  }
  .active {
    color: #010101;
  }
}
.sticky {
  position: sticky;
  top: 0;
  z-index: 9;
}
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;
  .navigator {
    width: 342rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }
  .thumb {
    // width: 305rpx;
    height: 420rpx;
    width: 100%;
    vertical-align: middle;
    // border-radius: 10rpx;
  }
  .desc {
    padding: 20rpx;
  }
  .name {
    height: 58rpx;
    font-size: 26rpx;
  }
  .price {
    line-height: 1;
    color: #e51c23;
    font-size: 30rpx;
  }
  .symbol {
    font-size: 70%;
  }
  .decimal {
    font-size: 70%;
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
