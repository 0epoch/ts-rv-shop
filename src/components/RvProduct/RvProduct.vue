<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import type { Paginate } from '@/types/global'
import type { Product } from '@/types/product'
import { useMemberStore } from '@/stores'

const memberStore = useMemberStore()

const hasAff = ref(false)

defineProps<{
  products: Paginate<Product>
}>()

onLoad(async () => {
  console.log('products...........')
})
</script>

<template>
  <view class="products">
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
        <view class="promotion">
          <text class="aff-man" v-if="product.aff_visible === 1">VIP</text>
          <text class="meet-discount" v-if="product.meet_qty > 0">满{{ product.meet_qty }}件打{{ product.meet_discount }}折</text>
        </view>
        <view class="price-wrapper">
          <view v-if="product.aff_visible === 1" class="price aff-price">
            <view>
              <text class="symbol">¥</text>
              <text class="number">{{ product.aff_price }}</text>
            </view>

            <view class="broken-price">
              <text class="symbol">¥</text>
              <text class="number">{{ product.price }}</text>
            </view>
          </view>
          <view v-else class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ product.price }}</text>
          </view>
          <text class="icon-add-btn-fill"></text>
        </view>
      </view>
    </navigator>
  </view>
</template>

<style lang="scss">
.products {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;
  .navigator {
    width: 342rpx;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
    overflow: hidden;
    background-color: #fff;
  }
  .thumb {
    height: 350rpx;
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
  .price-wrapper {
    display: flex;
    justify-content: space-between;
  }
  .promotion {
    display: flex;
    align-items: center;
    padding-bottom: 10rpx;
    font-size: 22rpx;
    line-height: 22rpx;
    .aff-man {
      margin-right: 10rpx;
      padding: 5rpx 10rpx;
      border-radius: 20rpx;
      font-weight: 900;
      font-style: italic;
      color: #ffdf00;
      background-color: #010101;
      border: 1rpx solid #010101;
    }
    .meet-discount {
      display: flex;
      align-items: center;
      padding: 5rpx 10rpx;
      border: 1rpx solid #010101;
      border-radius: 20rpx;
    }
  }
  .aff-price {
    display: flex;
    align-items: center;
  }
  .price {
    line-height: 1;
    color: #010101;
    font-size: 32rpx;
    font-weight: bold;
  }
  .broken-price {
    margin-left: 10rpx;
    font-size: 26rpx;
    font-weight: 500;
    color: #999;
    text-decoration: line-through;
  }
  .symbol {
    font-size: 70%;
  }
  .decimal {
    font-size: 70%;
  }
}
</style>
