<script setup lang="ts">
import { checkoutOrder, createOrder } from '@/api/order'
import { useAddressStore } from '@/stores/modules/address'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import type { CartResult } from '@/types/cart'
import type { UserCoupon } from '@/types/coupon'

const { safeAreaInsets } = uni.getSystemInfoSync()
// 订单备注
const desc = ref('')
const checkedCoupon = ref(0)

const assignCouponId = ref(0)
const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()

const query = defineProps<{
  skuId?: string
  count?: string
  orderId?: string
}>()

const checkout = ref<CartResult>()
const getCheckoutResult = async () => {
  const rs = await checkoutOrder()
  checkout.value = rs.data
  console.log(checkout.value.skus)
}

onLoad(() => {
  getCheckoutResult()
})

const onChangeChecked = async (item: UserCoupon) => {
  checkedCoupon.value = item.id
  popup?.value?.close()
}

const addressStore = useAddressStore()
// 收货地址
const selecteAddress = computed(() => {
  return addressStore.selectedAddress
})

// 提交订单
const onOrderSubmit = async () => {
  if (!selecteAddress.value?.id) {
    return uni.showToast({ icon: 'none', title: '请选择收货地址' })
  }
  const rs = await createOrder({
    address_id: selecteAddress.value?.id,
    coupon_id: 0,
    buyer_words: desc.value,
    buy_type: '',
    pay_type: 1,
    pay_amount: checkout.value?.checkout_amount!,
    skus: [],
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
      <navigator v-for="item in checkout?.skus" :key="item.sku_id" :url="`/pages/goods/goods?id=${item.sku_id}`" class="item" hover-class="none">
        <image class="picture" :src="item.pic_url" />
        <view class="meta">
          <view class="name ellipsis"> {{ item.title }} </view>
          <view class="attrs">{{ item.attrs }}</view>
          <view class="prices">
            <view class="pay-price symbol">{{ item.price }}</view>
            <view class="price symbol">{{ item.original_price }}</view>
          </view>
          <view class="count">x{{ item.qty }}</view>
        </view>
      </navigator>
    </view>

    <!-- 配送及支付方式 -->
    <view class="related">
      <view class="item">
        <text class="text">订单备注</text>
        <input class="input" :cursor-spacing="30" placeholder="选题，建议留言前先与商家沟通确认" v-model="desc" />
      </view>
    </view>

    <!-- 支付金额 -->
    <view class="settlement">
      <view class="item">
        <text class="text">商品总价: </text>
        <text class="number symbol">{{ checkout?.amount }}</text>
      </view>
      <view class="item" v-if="checkout?.coupon_amount && checkout?.coupon_amount > 0">
        <text class="text" @tap="popup?.open()">优惠券: </text>
        <text class="number symbol">{{ checkout?.coupon_amount }}</text>
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

      <view class="coupon" v-for="item in checkout?.usable_coupons" :key="item.id">
        <text @tap="onChangeChecked(item)" class="checkbox" :class="{ checked: item.id === checkedCoupon }"></text>
        <view class="overview">
          <view class="meta">
            <text class="title">{{ item.coupon.title }}</text>
            <text class="desc ellipsis">{{ item.coupon.desc }}</text>
          </view>

          <text class="time">有效期：{{ item.start_time.replace(/-/g, '.').substring(0, 10) }}-{{ item.end_time.replace(/-/g, '.').substring(0, 10) }}</text>
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
  height: 70vh;
  padding: 0 30rpx;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #f4f4f4;
  .close {
    position: absolute;
    right: 24rpx;
    top: 24rpx;
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
      content: '\e6cd';
      font-family: 'erabbit' !important;
      font-size: 40rpx;
      color: #444;
    }

    &.checked::before {
      content: '\e6cc';
      color: #010101;
    }
  }
}
.coupon {
  display: flex;
  justify-content: space-between;
  // align-items: center;
  width: 100%;
  height: 160rpx;
  padding: 20rpx 25rpx;
  margin-top: 5rpx;
  background-color: #fff;
  border-radius: 8rpx;
  mask-image: radial-gradient(circle at right 200rpx bottom 8rpx, transparent 8rpx, red 8.5rpx),
    radial-gradient(closest-side circle at 50%, red 99%, transparent 100%);
  mask-size: 100%, 2rpx 12rpx;
  mask-repeat: repeat, repeat-y;
  mask-position: 0 8rpx, calc(100% - 199.5rpx);
  mask-composite: source-out;
  mask-composite: subtract;
  .overview {
    flex: 70%;
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
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
    margin-right: 30rpx;
    color: #e51c23;
  }
  .invalid {
    color: #939393;
  }
}
</style>
