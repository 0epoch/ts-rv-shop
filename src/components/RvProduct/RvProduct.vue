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
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number" v-if="hasAff && product.is_aff == 1">{{ product.aff_price }}</text>
          <text class="number" v-else>{{ product.price }}</text>
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
</style>
