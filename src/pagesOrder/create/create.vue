<script setup lang="ts">
import { checkoutOrder, createOrder } from '@/api/order'
import { useAddressStore } from '@/stores/modules/address'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import type { CartResult } from '@/types/cart'
import type { CheckoutParams, CheckoutItem } from '@/types/order'

const { safeAreaInsets } = uni.getSystemInfoSync()
// 订单备注
const desc = ref('')
const checkedCoupon = ref(0)

const assignCouponId = ref<number>(0)
const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()

const query = defineProps<{
  checkout_skus?: string
}>()

const checkoutParams = ref<CheckoutParams>({
  coupon_id: 0,
  checkout_skus: [],
})

const checkout = ref<CartResult>()
const getCheckoutResult = async (checkoutParams: CheckoutParams) => {
  const rs = await checkoutOrder(checkoutParams)
  checkout.value = rs.data
  if (rs.data?.coupon) {
    checkedCoupon.value = rs.data.coupon.id
    assignCouponId.value = rs.data.coupon.id
  }
}

onLoad(() => {
  if (query.checkout_skus) {
    checkoutParams.value.checkout_skus = JSON.parse(decodeURIComponent(query.checkout_skus)) as CheckoutItem[]
    if (!checkoutParams.value.checkout_skus) return
    getCheckoutResult(checkoutParams.value)
  }
})

const addressStore = useAddressStore()
// 收货地址
const selecteAddress = computed(() => {
  return addressStore.selectedAddress
})

const onChangeCoupon = (id: number) => {
  if (assignCouponId.value === id) {
    assignCouponId.value = -1
    checkedCoupon.value = -1
  } else {
    checkedCoupon.value = id
    assignCouponId.value = id
  }
  checkoutParams.value.coupon_id = assignCouponId.value
  getCheckoutResult(checkoutParams.value)
  popup.value?.close()
}

// 提交订单
const onOrderSubmit = async () => {
  if (!selecteAddress.value?.id) {
    return uni.showToast({ icon: 'none', title: '请选择收货地址' })
  }
  if (!checkoutParams.value.checkout_skus) {
    return uni.showToast({ icon: 'none', title: '请选择结算商品' })
  }

  const rs = await createOrder({
    address_id: selecteAddress.value?.id,
    coupon_id: assignCouponId.value,
    buyer_words: desc.value,
    buy_type: '',
    pay_type: 1,
    pay_amount: checkout.value?.checkout_amount!,
    checkout_skus: checkoutParams.value.checkout_skus,
  })
  uni.redirectTo({ url: `/pagesOrder/detail/detail?id=${rs.data.id}` })
}
</script>

<template>
  <scroll-view enable-back-to-top scroll-y class="viewport">
    <!-- 收货地址 -->
    <navigator v-if="selecteAddress" class="shipment" hover-class="none" url="/pagesMember/address/address?from=order">
      <view class="user"> {{ selecteAddress.name }} {{ selecteAddress.mobile }} </view>
      <view class="address"> {{ selecteAddress.full_location }} {{ selecteAddress.addr }} </view>
      <text class="icon icon-right"></text>
    </navigator>
    <navigator v-else class="shipment" hover-class="none" url="/pagesMember/address/address?from=order">
      <view class="address"> 请选择收货地址 </view>
      <text class="icon icon-right"></text>
    </navigator>

    <!-- 商品信息 -->
    <view class="goods">
      <navigator
        v-for="item in checkout?.skus"
        :key="item.sku_id"
        :url="`/pages/goods/goods?id=${item.sku_id}`"
        class="item"
        hover-class="none"
      >
        <image class="picture" :src="item.pic_url" />
        <view class="meta">
          <view class="name ellipsis"> {{ item.title }} </view>
          <view class="attrs">{{ item.attrs }}</view>
          <view class="prices">
            <view class="pay-price symbol">{{ item.checkout_price }}</view>
            <view class="price symbol">{{ item.price }}</view>
          </view>
          <view class="count">x{{ item.qty }}</view>
        </view>
      </navigator>
    </view>

    <!-- 配送及支付方式 -->
    <view class="related">
      <view class="item">
        <text class="text">订单备注</text>
        <input class="input" :cursor-spacing="30" placeholder="建议留言前先与商家沟通确认" v-model="desc" />
      </view>
    </view>

    <!-- 支付金额 -->
    <view class="settlement">
      <view class="item">
        <text class="text">商品总价: </text>
        <text class="number symbol">{{ checkout?.amount }}</text>
      </view>
      <view class="item" v-if="checkout?.usable_coupons && checkout?.usable_coupons.length > 0" @tap="popup?.open()">
        <text class="text">优惠券: </text>
        <!-- <view> -->
        <text class="number symbol">{{ checkout?.coupon_amount }}</text>
        <!-- <text class="icon icon-right"></text> -->
        <!-- </view> -->
      </view>
      <view class="item" v-if="checkout?.discount_amount && checkout.discount_amount > 0">
        <text class="text">经销商折扣: </text>
        <text class="number symbol">{{ checkout?.discount_amount }}</text>
      </view>
    </view>
  </scroll-view>

  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="total-pay symbol">
      <text class="number">{{ checkout?.checkout_amount }}</text>
    </view>
    <view class="button" :class="{ disabled: !selecteAddress?.id }" @tap="onOrderSubmit"> 提交订单 </view>
  </view>

  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <scroll-view enable-back-to-top refresher-enabled class="panel" scroll-y>
      <text class="close icon-close" @tap="popup?.close()"></text>

      <view class="coupon" v-for="item in checkout?.usable_coupons" :key="item.id" @tap="onChangeCoupon(item.id)">
        <view class="overview">
          <text class="checkbox" :class="{ checked: item.id === checkedCoupon }"></text>

          <view class="meta">
            <text class="title">{{ item.coupon.title }}</text>
            <text class="time"
              >有效期：{{ item.start_time.replace(/-/g, '.').substring(0, 10) }}-{{
                item.end_time.replace(/-/g, '.').substring(0, 10)
              }}</text
            >
          </view>
        </view>
        <view class="price">
          <text>{{ item.type === 'discount' ? item.value * 10 : Math.floor(item.value) }}</text>
          <text>{{ item.type === 'discount' ? '折' : '元' }}</text>
        </view>
      </view>
    </scroll-view>
  </uni-popup>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}

.symbol::before {
  content: '¥';
  font-size: 80%;
  margin-right: 5rpx;
}

.shipment {
  margin: 20rpx;
  padding: 30rpx 30rpx 30rpx 84rpx;
  font-size: 26rpx;
  border-radius: 10rpx;
  background: url('/static/images/locate.png') 20rpx center / 50rpx no-repeat #fff;
  position: relative;

  .icon {
    font-size: 36rpx;
    color: #333;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 20rpx;
  }

  .user {
    color: #333;
    margin-bottom: 5rpx;
  }

  .address {
    color: #666;
  }
}

.goods {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    padding: 30rpx 0;
    border-top: 1rpx solid #eee;

    &:first-child {
      border-top: none;
    }

    .picture {
      width: 170rpx;
      height: 170rpx;
      border-radius: 10rpx;
      margin-right: 20rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .attrs {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 6rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .prices {
      display: flex;
      align-items: baseline;
      margin-top: 6rpx;
      font-size: 28rpx;

      .pay-price {
        margin-right: 10rpx;
        color: #e51c23;
      }

      .price {
        font-size: 24rpx;
        color: #999;
        text-decoration: line-through;
      }
    }

    .count {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 26rpx;
      color: #444;
    }
  }
}

.related {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }

  .input {
    flex: 1;
    text-align: right;
    margin: 20rpx 0;
    padding-right: 20rpx;
    font-size: 26rpx;
    color: #999;
  }

  .item .text {
    width: 125rpx;
  }

  .picker {
    color: #666;
  }

  .picker::after {
    content: '\e6c2';
  }
}

.settlement {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }
  .total {
    border-top: 1rpx solid #eaeaea;
  }
  .danger {
    color: #e51c23;
  }
}

.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--window-bottom));
  z-index: 1;

  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;

  .total-pay {
    font-size: 40rpx;
    color: #e51c23;

    .decimal {
      font-size: 75%;
    }
  }

  .button {
    width: 220rpx;
    text-align: center;
    line-height: 72rpx;
    font-size: 26rpx;
    color: #fff;
    border-radius: 72rpx;
    background-color: #010101;
  }

  .disabled {
    opacity: 0.6;
  }
}

// --------------------- coupon panel ---------------
.panel {
  height: 60vh;
  padding: 30rpx 20rpx;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #f4f4f4;
  .close {
    display: inline-block;
    padding: 20rpx;
    position: absolute;
    right: 24rpx;
    top: 24rpx;
    color: #010101;
    // margin-bottom: 24rpx;
  }
  .checkbox {
    width: 80rpx;
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
}
.coupon {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 180rpx;
  padding: 20rpx 25rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 8rpx;
  font-size: 40rpx;
  mask-image: radial-gradient(circle at right 240rpx bottom 16rpx, transparent 16rpx, red 16.5rpx),
    radial-gradient(closest-side circle at 50%, red 99%, transparent 100%);
  mask-size: 100%, 6rpx 16rpx;
  mask-repeat: repeat, repeat-y;
  mask-position: 0 16rpx, calc(100% - 238.5rpx);
  mask-composite: source-out;
  mask-composite: subtract;
  .overview {
    flex: 70%;
    flex-grow: 0;
    display: flex;
    align-items: center;
    .meta {
      display: flex;
      flex-direction: column;
    }
    .desc {
      padding: 5rpx 0;
    }
    .desc,
    .time {
      color: #939393;
      font-size: 20rpx;
    }
  }
  .price {
    display: flex;
    align-items: center;
    margin-right: 50rpx;
    color: #e51c23;
    font-size: 45rpx;
  }
  .invalid {
    color: #939393;
  }
}
</style>
