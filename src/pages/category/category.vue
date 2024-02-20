<script setup lang="ts">
import { useMemberStore } from '@/stores'

import { homeConfs, firstCategories } from '@/api/home'
import { productList } from '@/api/product'
import type { Paginate } from '@/types/global'
import type { Product, ProductParams } from '@/types/product'
import type { HomeConfs } from '@/types/home'

import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { Category } from '@/types/category'

const { safeAreaInsets } = uni.getSystemInfoSync()

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
  products.value.page = rs.data.current_page
  if (rs.data.total <= 0) {
    finish.value = true
  }
}

const getFirstCategoryList = async () => {
  const rs = await firstCategories()
  categories.value = rs.data
}

onShareAppMessage(() => {
  return {
    title: '选款',
    path: `/pages/category/category`,
  }
})

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

const isFixed = ref(false)
const onPageScroll = (event: any) => {
  const { scrollTop } = event.detail
  if (scrollTop > safeAreaInsets?.top! + 150) {
    isFixed.value = true
  } else {
    isFixed.value = false
  }
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
  <scroll-view enable-back-to-top @scrolltolower="onScrolltolower" @scroll="onPageScroll" class="viewport scroll-view" scroll-y>
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
                <view class="label">{{ item.name }}</view>
              </navigator>
            </view>
          </view>
        </view>
      </view>
    </view>

    <scroll-view scroll-x class="category" :class="{ sticky: isFixed === true }">
      <view class="cate-item" @tap="onTapCategory(0)">
        <text :class="{ active: activeCategory === 0 }" class="cate-text">全部</text>
      </view>
      <view class="cate-item" @tap="onTapCategory(item.id)" v-for="item in categories" :key="item.id">
        <text :class="{ active: activeCategory === item.id }" class="cate-text">{{ item.name }}</text>
      </view>
    </scroll-view>

    <view>
      <RvProduct :products="products" />
      <view class="loading-text">
        {{ finish ? '没有更多数据了~' : '正在加载...' }}
      </view>
    </view>
  </scroll-view>
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
  height: 78rpx;
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
  margin-bottom: 20rpx;
  padding: 0 10rpx;
}
.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-radius: 10rpx;
  color: #333;
  .tab-box {
    max-width: 150rpx;
    flex: 25%;
    flex-grow: 0;
    padding: 10rpx;
  }
  .label {
    margin-top: 20rpx;
    text-align: center;
    color: #939393;
    font-size: 28rpx;
  }
}
.category {
  width: 100%;
  height: 120rpx;
  margin-bottom: 20rpx;
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
  position: fixed;
  top: var(--window-top);
  left: 0;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 999;
  transition: top 0.3s ease-out;
}
// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
