<script setup lang="ts">
import type { SkuPopupEvent, SkuPopupInstance, SkuPopupLocaldata } from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup'

import { saveCardProduct } from '@/api/cart'

import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import PromotionPanel from './components/PromotionPanel.vue'
import ServicePanel from './components/ServicePanel.vue'
import { fetchProductDetail } from '@/api/product'
import type { Detail } from '@/types/product'
import { useAuthStore } from '@/stores'

const { safeAreaInsets } = uni.getSystemInfoSync()

const query = defineProps<{
  id: number
}>()

const buyNowText = ref('')
const minBuy = ref(1)
const tipHidden = ref(true)

const authStore = useAuthStore()
// 获取商品详情信息
const productDetail = ref<Detail>()
const getProductDetail = async () => {
  const rs = await fetchProductDetail(query.id)
  productDetail.value = rs.data
  if (rs.data.meet_qty > 0 && rs.data.meet_discount > 0) {
    buyNowText.value = rs.data.meet_qty + '件单价¥' + rs.data.meet_price + ' '
    minBuy.value = rs.data.meet_qty
  }
  localdata.value = {
    _id: rs.data.id,
    name: rs.data.title,
    goods_thumb: rs.data.pic_url,
    spec_list: rs.data.attrs.map((v) => {
      return {
        name: v.name,
        list: v.values.map((vv) => {
          return { name: vv.attr_value }
        }),
      }
    }),
    sku_list: rs.data.skus.map((v) => {
      return {
        _id: rs.data.id,
        goods_id: v.id,
        goods_name: rs.data.title,
        image: v.pic_url,
        price: v.price * 100,
        stock: v.stock,
        sku_name_arr: v.attrs.split(','),
      }
    }),
  }
}

// 页面加载
onLoad(() => {
  getProductDetail()
})

// 轮播图变化时
const currentIndex = ref(0)
const onChange: UniHelper.SwiperOnChange = (ev) => {
  currentIndex.value = ev.detail.current
}

const onTapImage = (url: string) => {
  uni.previewImage({
    current: url,
    urls: productDetail.value!.main_pictures,
  })
}

const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()

const promotion = ref()
const popupName = ref<'promotion' | 'service'>()
const openPopup = (name: typeof popupName.value, content: string) => {
  popupName.value = name
  promotion.value = content
  popup.value?.open()
}

const skuVisible = ref(false)
// 商品信息
const localdata = ref({} as SkuPopupLocaldata)
// 按钮模式
enum SkuMode {
  Both = 1,
  Cart = 2,
  Buy = 3,
}
const mode = ref<SkuMode>(SkuMode.Cart)
const openSkuPopup = (val: SkuMode) => {
  skuVisible.value = true
  mode.value = val
}

const skuPopupRef = ref<SkuPopupInstance>()
const selectArrText = computed(() => {
  return skuPopupRef.value?.selectArr?.join(' ').trim() || '请选择商品规格'
})

const onAddCart = async (ev: SkuPopupEvent) => {
  if (!authStore.certified()) {
    authStore.visible = true
    return
  }
  await saveCardProduct({ product_id: ev._id, sku_id: ev.goods_id, qty: ev.buy_num })
  uni.showToast({ title: '添加成功' })
  skuVisible.value = false
}

const onBuyNow = async (ev: SkuPopupEvent) => {
  if (!authStore.certified()) {
    authStore.visible = true
    return
  }
  const checkout = [{ sku_id: ev.goods_id, qty: ev.buy_num }]
  uni.navigateTo({ url: `/pagesOrder/create/create?checkout_skus=${encodeURIComponent(JSON.stringify(checkout))}` })
}

const onIcon = (url: string) => {
  uni.switchTab({ url })
}

const onMoreTip = () => {
  tipHidden.value = false
}
</script>

<template>
  <vk-data-goods-sku-popup
    v-model="skuVisible"
    :localdata="localdata"
    :mode="mode"
    :min-buy-num="minBuy"
    price-color="#e51c23"
    add-cart-background-color="#010101"
    buy-now-background-color="#010101"
    add-cart-text="加入购物车"
    :buy-now-text="buyNowText + '立即购买'"
    ref="skuPopupRef"
    :actived-style="{
      color: '#fff',
      borderColor: '#010101',
      backgroundColor: '#010101',
      borderRadius: '10rpx',
    }"
    :btn-style="{ color: '#010101' }"
    @add-cart="onAddCart"
    @buy-now="onBuyNow"
  />
  <scroll-view enable-back-to-top scroll-y class="viewport">
    <view class="goods">
      <view class="preview">
        <swiper @change="onChange" circular>
          <swiper-item v-for="item in productDetail?.main_pictures" :key="item">
            <image class="image" @tap="onTapImage(item)" mode="aspectFill" :src="item" />
          </swiper-item>
        </swiper>
        <view class="indicator">
          <text class="current">{{ currentIndex + 1 }}</text>
          <text class="split">/</text>
          <text class="total">{{ productDetail?.main_pictures.length }}</text>
        </view>
      </view>

      <!-- 商品简介 -->
      <view class="meta">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ productDetail?.price }}</text>
        </view>
        <view class="name ellipsis">{{ productDetail?.title }}</view>
        <view class="promotion-action" v-if="productDetail && productDetail.meet_qty > 0">
          <view
            @tap="openPopup('promotion', '满' + productDetail?.meet_qty + '件打' + productDetail?.meet_discount + '折')"
            class="item arrow"
          >
            <text class="label">促销</text>
            <view class="text">
              <text class="tag">满减满折</text>
              <text>{{ '满' + productDetail?.meet_qty + '件打' + productDetail?.meet_discount + '折' }}</text>
            </view>
          </view>
        </view>
        <view class="tip">
          <text class="tip-title">温馨提示</text>
          <text class="tip-content" :class="{ 'tip-hidden': tipHidden === true }">
            <text class="icon-down more" v-if="tipHidden === true" @tap="onMoreTip"></text>
            亲爱的姐妹，下单后10天内顺丰快递发出，请在签收后请仔细检查产品是否有质量或做工问题，我们每一套都有独立的透明包装。在未拆封状态下，收到货48小时内支持无理由退货，每一套都是百分百纯手工定制，非机器印刷。如果对品质有担忧可以先拍一两套回去看看，觉得好再回购也不迟！只做高品质，欢迎拿去跟其他家做对比！
          </text>
        </view>
      </view>

      <!-- 操作面板 -->
      <view class="action">
        <view @tap="openSkuPopup(SkuMode.Cart)" class="item arrow">
          <text class="label">规格</text>
          <text class="text ellipsis"> {{ selectArrText }} </text>
        </view>
        <view @tap="openPopup('service', '')" class="item arrow">
          <text class="label">配送</text>
          <text class="text ellipsis"> 顺丰快递 </text>
        </view>
      </view>
    </view>

    <view class="desc-title"> - 详情介绍 - </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="content">
        <image class="image" v-for="item in productDetail?.detail_pictures" :key="item" mode="widthFix" :src="item"></image>
      </view>
    </view>
  </scroll-view>

  <view v-if="productDetail" class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="icons">
      <view class="icons-button" @tap="onIcon('/pages/index/index')">
        <image class="image" mode="aspectFit" src="/static/images/home_default.png"></image>
        <text>首页</text>
      </view>
      <navigator class="icons-button" url="/pages/cart/cart2" open-type="navigate">
        <image class="image" mode="aspectFit" src="/static/images/cart_default.png"></image>
        <text>购物车</text>
      </navigator>
      <view class="icons-button navigator-wrap" @tap="onIcon('/pages/my/my')">
        <image class="image" mode="aspectFit" src="/static/images/user_default.png"></image>
        <text>我的</text>
      </view>
    </view>
    <view class="buttons">
      <view @tap="openSkuPopup(SkuMode.Cart)" class="addcart">
        <text>加入购物车</text>
      </view>
      <view @tap="openSkuPopup(SkuMode.Buy)" class="payment" :class="{ 'meet-buy': productDetail.meet_qty > 0 }">
        <text class="buy-tip" v-if="buyNowText !== ''">{{ buyNowText }}</text>
        <text>立即购买</text>
      </view>
    </view>
  </view>

  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <PromotionPanel v-if="popupName === 'promotion'" @close="popup?.close()" :promotion="promotion" />
    <ServicePanel v-if="popupName === 'service'" @close="popup?.close()" />
  </uni-popup>

  <RvAuth />
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viewport {
  background-color: #f4f4f4;
}

.panel {
  background-color: #fff;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    line-height: 1;
    padding: 30rpx 60rpx 30rpx 6rpx;
    position: relative;
    text {
      padding-left: 10rpx;
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
      border-left: 4rpx solid #010101;
    }
    navigator {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    content: '\e6c2';
    color: #ccc;
    font-family: 'erabbit' !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }
}

.goods {
  .preview {
    height: 700rpx;
    position: relative;
    border-bottom: 1rpx solid rgba(200, 200, 200, 0.1);
    .image {
      width: 750rpx;
      height: 700rpx;
    }
    .indicator {
      height: 40rpx;
      padding: 0 24rpx;
      line-height: 40rpx;
      border-radius: 30rpx;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 30rpx;
      right: 30rpx;
      .current {
        font-size: 26rpx;
      }
      .split {
        font-size: 24rpx;
        margin: 0 1rpx 0 2rpx;
      }
      .total {
        font-size: 24rpx;
      }
    }
  }
  .meta {
    margin-bottom: 20rpx;
    padding: 20rpx;
    background-color: #fff;

    .price {
      padding: 0rpx 20rpx 0;
      color: #010101;
      font-size: 36rpx;
      font-weight: bold;
      box-sizing: border-box;
    }
    .number {
      font-size: 56rpx;
    }
    .brand {
      width: 160rpx;
      height: 80rpx;
      overflow: hidden;
      position: absolute;
      top: 26rpx;
      right: 30rpx;
    }
    .name {
      max-height: 88rpx;
      line-height: 1.4;
      margin: 0 20rpx 30rpx 20rpx;
      font-size: 34rpx;
      font-weight: bold;
      color: #010101;
    }
    .promotion-action {
      .item {
        height: 90rpx;
        padding-right: 60rpx;
        font-size: 26rpx;
        color: #333;
        position: relative;
        display: flex;
        align-items: center;
        &:last-child {
          border-bottom: 0 none;
        }
      }
      .label {
        width: 60rpx;
        color: #898b94;
        margin: 0 16rpx 0 10rpx;
      }
      .text {
        flex: 1;
        -webkit-line-clamp: 1;
      }
      .tag {
        margin-right: 10rpx;
        padding: 5rpx 10rpx;
        border: 1rpx solid #010101;
        border-radius: 4rpx;
        font-size: 20rpx;
      }
    }
    .desc {
      line-height: 1;
      padding: 0 20rpx 30rpx;
      font-size: 24rpx;
      color: #e51c23;
    }
    .tip {
      padding: 25rpx 30rpx;
      background-color: #fafafa;
      border-radius: 4rpx;
      .tip-title {
        display: block;
        font-size: 28rpx;
      }
    }
    .tip-content {
      color: #898b94;
      font-size: 28rpx;
      .more {
        float: right;
        font-size: 40rpx;
      }
    }
    .tip-hidden {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .action {
    padding-left: 20rpx;
    background-color: #fff;
    .item {
      height: 90rpx;
      padding-right: 60rpx;
      border-bottom: 1rpx solid #eaeaea;
      font-size: 26rpx;
      color: #333;
      position: relative;
      display: flex;
      align-items: center;
      &:last-child {
        border-bottom: 0 none;
      }
    }
    .label {
      width: 60rpx;
      color: #898b94;
      margin: 0 16rpx 0 10rpx;
    }
    .text {
      flex: 1;
      -webkit-line-clamp: 1;
    }
  }
}

.desc-title {
  padding: 30rpx;
  color: #898b94;
  text-align: center;
}

.detail {
  padding-left: 20rpx;
  .content {
    margin-left: -20rpx;
    .image {
      width: 100%;
    }
  }
  .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;
    .item {
      display: flex;
      line-height: 2;
      padding: 10rpx;
      font-size: 26rpx;
      color: #333;
      border-bottom: 1rpx dashed #ccc;
    }
    .label {
      width: 200rpx;
    }
    .value {
      flex: 1;
    }
  }
}

/* 底部工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc((var(--window-bottom)));
  z-index: 1;
  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
  .buttons {
    flex: 60%;
    display: flex;
    height: 78rpx;
    & > view {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 100%;
      text-align: center;
      // line-height: 78rpx;
      font-size: 28rpx;
      color: #fff;
      border-radius: 72rpx;
    }
    .addcart {
      background-color: #fff;
      color: #010101;
      border: 1rpx solid #010101;
    }
    .meet-buy {
      font-size: 24rpx;
    }
    .payment {
      background-color: #010101;
      margin-left: 20rpx;
      .buy-tip {
        font-size: 20rpx;
      }
    }
  }
  .icons {
    height: 78rpx;
    padding-right: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 40%;
    .navigator-wrap,
    .icons-button {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      text-align: center;
      // line-height: 1.4;
      padding: 0;
      margin: 0;
      border-radius: 0;
      font-size: 20rpx;
      color: #010101;
      // background-color: #010101;
      // border-radius: 50%;
      &::after {
        border: none;
      }
    }
    text {
      display: block;
      // font-size: 34rpx;
    }
  }
}
</style>
