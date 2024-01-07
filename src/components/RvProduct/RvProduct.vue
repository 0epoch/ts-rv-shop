<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import type { Paginate } from '@/types/global'
import type { Product } from '@/types/product'

defineProps<{
  products: Paginate<Product>
}>()

onLoad(async () => {})
</script>

<template>
  <view class="products">
    <view class="product" v-for="product in products?.data" :key="product.id">
      <navigator hover-class="none" class="navigator" :url="`/pages/product/detail?id=${product.id}`">
        <image mode="aspectFill" class="thumb" :src="product.pic_url"></image>
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
  </view>
</template>

<style lang="scss">
.products {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-left: 20rpx;
  .product {
    flex: 50%;
    flex-grow: 0;
    padding-right: 20rpx;
    padding-bottom: 20rpx;
  }
  .navigator {
    width: 100%;
    height: 100%;
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
    font-size: 28rpx;
  }
  .price-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 5rpx 0;
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
    color: #e51c23;
    font-size: 34rpx;
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
