<script setup lang="ts">
import { homeConfs } from '@/api/home'
import { productList } from '@/api/product'

import type { Product, ProductParams } from '@/types/product'
import type { HomeConfs } from '@/types/home'

import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const confs = ref<HomeConfs>()
const getHomeConfs = async () => {
  const rs = await homeConfs()
  confs.value = rs.data
}

const isLoading = ref(false)
const products = ref<Product[]>([])
const finish = ref(false)
const hasAff = ref(0)

const getProductList = async (data: { params?: ProductParams }) => {
  const rs = await productList({})
  products.value = rs.data.data
}

onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeConfs()])
  const rs = await productList({ params: { nav_id: confs.value?.feature[0].id! } })
  products.value = rs.data.data
  isLoading.value = false
})
</script>

<template>
  <view class="viewport">
    <view class="tab-wrapper" v-if="confs?.feature">
      <view class="tabs" v-if="confs.feature.length > 0">
        <view class="tab-box" v-for="(item, index) in confs.feature" :key="index">
          <view class="=tab">
            <navigator
              hover-class="none"
              class="navigator"
              :url="`/pages/product/list?nav_id=${item.id}`"
            >
              <image class="cover" :src="item.cover" mode="widthFix" />
              <view>{{ item.name }}</view>
            </navigator>
          </view>
        </view>
      </view>
    </view>
    <view class="category">
      <view class="cate-item">
        <text class="">当季节热</text>
        <text class="">当季节热</text>
        <text class="">当季节热</text>
      </view>
    </view>
    <!-- 推荐封面图 -->

    <!-- 推荐列表 -->
    <scroll-view>
      <view class="goods">
        <navigator
          hover-class="none"
          class="navigator"
          v-for="product in products"
          :key="product.id"
          :url="`/pages/product/detail?id=${product.id}`"
        >
          <image class="thumb" :src="product.pic_url"></image>
          <view class="desc">
            <view class="name ellipsis">{{ product.title }}</view>
            <view class="price">
              <text class="symbol">¥</text>
              <text class="number">{{ product.price }}</text>
            </view>
          </view>
        </navigator>
      </view>
      <view class="loading-text">
        {{ finish ? '没有更多数据了~' : '正在加载...' }}
      </view>
      -->
    </scroll-view>
  </view>

  <!-- ------------------------ -->
</template>

<style lang="scss">
$page-padding: 10px;
$grid-gap: 10px;

// -----------------------------------------------------------------------------
page {
  height: 100%;
  background-color: #f4f4f4;
}

// --------------------------------------- nav
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}
.cover {
  border-radius: 50%;
}
.scroll-view {
  flex: 1;
}
.tab-wrapper {
  padding: 0 20rpx 20rpx;
  // box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
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
  height: 130rpx;
  padding: 25rpx 30rpx 0;
  color: #333;
  font-size: 34rpx;
  box-sizing: border-box;
  background-color: #fff;
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
    height: 385rpx;
    width: 100%;
    vertical-align: middle;
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

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #333;
  padding: 20rpx 0 50rpx;
}
</style>
