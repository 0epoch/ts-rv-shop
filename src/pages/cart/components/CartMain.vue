<script setup lang="ts">
import type { InputNumberBoxEvent } from '@/components/vk-data-input-number-box/vk-data-input-number-box'
import { cartProductList, calcCart, cartProductDel } from '@/api/cart'
import { useMemberStore, useAuthStore } from '@/stores'
import type { CartItem, CartResult } from '@/types/cart'
import { onShow } from '@dcloudio/uni-app'
import { computed, ref, watch } from 'vue'

defineProps<{
  safeAreaInsetBottom?: boolean
}>()

const { safeAreaInsets } = uni.getSystemInfoSync()

const memberStore = useMemberStore()
const authStore = useAuthStore()

watch(memberStore, (newValue, oldValue) => {
  if (newValue.profile) {
    gerUserCart()
  }
})

const cartResult = ref<CartResult>()
const cartList = ref<CartResult>()
const editActive = ref(false)
const editText = ref('编辑')

const checkoutText = ref('去结算')
const showCartList = ref(true)

const gerUserCart = async () => {
  const rs = await cartProductList()
  cartList.value = rs.data
  cartResult.value = rs.data
  showCartList.value = rs.data.skus.length > 0
}

const deleteUserCartProducts = async () => {
  const skusId = selectedCartList.value?.map((item) => {
    return item.sku_id
  })
  if (skusId) {
    await cartProductDel(skusId)
    editActive.value = false
  }
}

onShow(() => {
  if (memberStore.profile) {
    gerUserCart()
  }
})

const onEdit = () => {
  editActive.value = !editActive.value
  editText.value = editActive.value ? '完成' : '编辑'
  checkoutText.value = editActive.value ? '删除' : '去结算'
}

const onDeleteCart = (skuId: number) => {
  if (!authStore.certified()) {
    authStore.visible = true
    return
  }
  uni.showModal({
    content: '是否删除',
    confirmColor: '#010101',
    success: async (res) => {
      if (res.confirm) {
        await cartProductDel([skuId])
        gerUserCart()
      }
    },
  })
}

// 修改商品数量
const onChangeQty = async (e: InputNumberBoxEvent) => {
  const changeSkus = cartList.value?.skus.map((item) => {
    return { sku_id: item.sku_id, qty: item.qty, selected: item.selected }
  })
  const rs = await calcCart({ selected: changeSkus, coupon_id: 0 })
  cartResult.value = rs.data
}

const onChangeSelected = async (item: CartItem) => {
  item.selected = item.selected === 1 ? 0 : 1
  if (!selectedCartList.value || selectedCartList.value.length <= 0) {
    cartResult.value = {
      checkout_amount: 0,
      promotion_amount: 0,
      amount: 0,
      discount_amount: 0,
      coupon_amount: 0,
      skus: [],
    }
    calcCart({ coupon_id: 0 })
    return
  }
  const changeSkus = selectedCartList.value?.map((item) => {
    return { sku_id: item.sku_id, qty: item.qty }
  })
  const rs = await calcCart({ selected: changeSkus, coupon_id: 0 })
  cartResult.value = rs.data
}

// 计算全选状态
const isSelectedAll = computed(() => {
  return cartList.value?.skus.length && cartList.value.skus.every((v) => v.selected)
})

const onChangeSelectedAll = async () => {
  const _isSelectedAll = !isSelectedAll.value
  cartList.value?.skus.forEach((item) => {
    item.selected = _isSelectedAll ? 1 : 0
  })
  const changeSkus = selectedCartList.value?.map((item) => {
    return { sku_id: item.sku_id, qty: item.qty }
  })
  const rs = await calcCart({ selected: changeSkus, coupon_id: 0 })
  cartResult.value = rs.data
}

const selectedCartList = computed(() => {
  return cartList.value?.skus.filter((v) => v.selected)
})

const selectedCartListCount = computed(() => {
  return selectedCartList.value?.reduce((sum, item) => sum + item.qty, 0)
})

const selectedCartListMoney = computed(() => {
  return cartResult.value?.checkout_amount
})

// 结算按钮
const onCheckout = () => {
  if (selectedCartListCount.value === 0) {
    return uni.showToast({
      icon: 'none',
      title: '请选择商品',
    })
  }
  if (editActive.value) {
    uni.showModal({
      content: '是否删除所选商品',
      confirmColor: '#010101',
      success: async (res) => {
        if (res.confirm) {
          await deleteUserCartProducts()
          gerUserCart()
        }
      },
    })
    return
  }
  const checkoutSkus = selectedCartList.value?.map((item) => {
    return { sku_id: item.sku_id, qty: item.qty, cart_id: item.cart_id }
  })

  // 跳转到结算页
  uni.navigateTo({ url: '/pagesOrder/create/create?checkout_skus=' + encodeURIComponent(JSON.stringify(checkoutSkus)) })
}

const onGo = () => {
  uni.switchTab({
    url: '/pages/category/category',
  })
}
</script>

<template>
  <scroll-view enable-back-to-top scroll-y class="scroll-view">
    <template v-if="memberStore.profile">
      <view class="cart-list" v-if="showCartList">
        <view class="edit">
          <text @tap="onChangeSelectedAll" class="all" :class="{ checked: isSelectedAll }">全选</text>
          <text class="label" @tap="onEdit">{{ editText }}</text>
        </view>
        <uni-swipe-action>
          <uni-swipe-action-item v-for="item in cartList?.skus" :key="item.sku_id" class="cart-swipe">
            <view class="goods">
              <text @tap="onChangeSelected(item)" class="checkbox" :class="{ checked: item.selected === 1 }"></text>
              <navigator :url="`/pages/product/detail?id=${item.product_id}`" hover-class="none" class="navigator">
                <image mode="aspectFill" class="picture" :src="item.pic_url"></image>
                <view class="meta">
                  <view class="name ellipsis">{{ item.title }}</view>
                  <view class="attrsText ellipsis">{{ item.attrs }}</view>
                  <view class="price">{{ item.price }}</view>
                </view>
              </navigator>
              <view class="count">
                <vk-data-input-number-box v-model="item.qty" :min="1" :max="item.stock" :index="item.sku_id" @change="onChangeQty" />
              </view>
            </view>

            <!-- 删除 -->
            <template #right>
              <view class="cart-swipe-right">
                <button @tap="onDeleteCart(item.sku_id)" class="button delete-button">删除</button>
              </view>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>

      <view class="cart-blank" v-else>
        <text class="text">购物车空空如也~</text>
        <view @tap="onGo">
          <button class="button">去逛逛</button>
        </view>
      </view>

      <view v-if="showCartList" class="toolbar" :style="{ paddingBottom: safeAreaInsetBottom ? safeAreaInsets?.bottom + 'px' : 0 }">
        <text @tap="onChangeSelectedAll" class="all" :class="{ checked: isSelectedAll }">全选</text>
        <text class="text">合计:</text>
        <text class="amount">{{ selectedCartListMoney }}</text>
        <view class="button-grounp">
          <view @tap="onCheckout" class="button payment-button" :class="{ disabled: selectedCartListCount === 0 }">
            {{ checkoutText }}({{ selectedCartListCount }})
          </view>
        </view>
      </view>
    </template>
    <view class="login-blank" v-else>
      <text class="text">登录后可查看购物车中的商品</text>
    </view>

    <view class="toolbar-height"></view>
  </scroll-view>
  <RvAuth />
</template>

<style lang="scss">
:host {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f7f7f8;
}

.scroll-view {
  flex: 1;
  background-color: #f7f7f8;
}

.cart-list {
  padding: 0 20rpx;
  .edit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
    margin: 20rpx 0;
    font-size: 26rpx;
    color: #666;
    .label {
      color: #010101;
      padding: 10rpx 15rpx;
      border-radius: 4rpx;
      font-size: 24rpx;
      border: 1rpx solid #010101;
    }
  }

  .goods {
    display: flex;
    padding: 20rpx 20rpx 20rpx 80rpx;
    border-radius: 10rpx;
    background-color: #fff;
    position: relative;

    .navigator {
      display: flex;
    }

    .checkbox {
      position: absolute;
      top: 0;
      left: 0;

      display: flex;
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 100%;

      &::before {
        content: '\e72f';
        font-family: 'iconfont' !important;
        font-size: 40rpx;
        color: #444;
      }

      &.checked::before {
        content: '\e730';
        color: #010101;
      }
    }

    .picture {
      width: 170rpx;
      height: 170rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;
    }

    .name {
      height: 72rpx;
      font-size: 26rpx;
      color: #444;
    }

    .attrsText {
      line-height: 1.8;
      padding: 0 15rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .price {
      line-height: 1;
      font-size: 26rpx;
      color: #444;
      margin-bottom: 2rpx;
      color: #e51c23;

      &::before {
        content: '￥';
        font-size: 80%;
      }
    }

    // 商品数量
    .count {
      position: absolute;
      bottom: 20rpx;
      right: 5rpx;

      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 220rpx;
      height: 48rpx;

      .text {
        height: 100%;
        padding: 0 20rpx;
        font-size: 32rpx;
        color: #444;
      }

      .input {
        height: 100%;
        text-align: center;
        border-radius: 4rpx;
        font-size: 24rpx;
        color: #444;
        background-color: #f6f6f6;
      }
    }
  }

  .cart-swipe {
    display: block;
    margin: 20rpx 0;
  }

  .cart-swipe-right {
    display: flex;
    height: 100%;

    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      padding: 6px;
      line-height: 1.5;
      color: #fff;
      font-size: 26rpx;
      border-radius: 0;
    }

    .delete-button {
      background-color: #e51c23;
    }
  }
}

.cart-blank,
.login-blank {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 60vh;
  .image {
    width: 400rpx;
    height: 281rpx;
  }
  .text {
    color: #444;
    font-size: 26rpx;
    margin: 20rpx 0;
  }
  .button {
    width: 240rpx !important;
    height: 60rpx;
    line-height: 60rpx;
    margin-top: 20rpx;
    font-size: 26rpx;
    border-radius: 60rpx;
    color: #fff;
    background-color: #010101;
  }
}

.all {
  margin-left: 25rpx;
  font-size: 14px;
  color: #444;
  display: flex;
  align-items: center;
}

.all::before {
  content: '\e72f';
  font-family: 'iconfont' !important;
  font-size: 40rpx;
  margin-right: 8rpx;
}
.checked::before {
  content: '\e730';
  color: #010101;
}
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--window-bottom));
  z-index: 1;

  height: 100rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;
  background-color: #fff;
  box-sizing: content-box;
  .text {
    margin-right: 8rpx;
    margin-left: 32rpx;
    color: #444;
    font-size: 14px;
  }

  .amount {
    font-size: 20px;
    color: #e51c23;

    .decimal {
      font-size: 12px;
    }

    &::before {
      content: '￥';
      font-size: 12px;
    }
  }

  .button-grounp {
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    text-align: center;
    line-height: 72rpx;
    font-size: 13px;
    color: #fff;

    .button {
      width: 240rpx;
      margin: 0 10rpx;
      border-radius: 72rpx;
    }

    .payment-button {
      background-color: #010101;

      &.disabled {
        opacity: 0.6;
      }
    }
  }
}
.toolbar-height {
  height: 100rpx;
}
</style>
