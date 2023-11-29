<script setup lang="ts">
import { useMemberStore } from '@/stores'
import { useAuthStore } from '@/stores'
import { onLoad } from '@dcloudio/uni-app'

import { userCouponList } from '@/api/user'

import type { UserCoupon } from '@/types/coupon'
import type { Paginate } from '@/types/global'

import { ref } from 'vue'

const { safeAreaInsets } = uni.getSystemInfoSync()

const authStore = useAuthStore()
const orderTypes = [
  { type: '1', text: '待付款', icon: 'icon-wait' },
  { type: '2', text: '待发货', icon: 'icon-logistics' },
  { type: '3', text: '待收货', icon: 'icon-goods-receive' },
  { type: '4', text: '退款/售后', icon: 'icon-refund' },
]
const memberStore = useMemberStore()

const userCoupons = ref<Paginate<UserCoupon>>()

onLoad(async () => {
  authStore.toggleAuthVisible()

  const rs = await userCouponList({ params: { status: 'unused' } })
  userCoupons.value = rs.data
})
</script>

<template>
  <scroll-view enable-back-to-top class="viewport" scroll-y>
    <view class="profile">
      <!-- 已登录 -->
      <view class="overview" v-if="memberStore.profile">
        <navigator url="/pagesMember/profile/profile" hover-class="none" class="meta">
          <image class="avatar" :src="memberStore.profile.avatar" mode="aspectFill"></image>
          <view class="nickname">
            {{ memberStore.profile.nickname || memberStore.profile.name }}
          </view>
        </navigator>
        <view class="assets">
          <navigator class="asset-item" url="/pagesMember/coupon/coupon" hover-class="none">
            <text class="number">{{ userCoupons?.total }}</text>
            <text class="badge">优惠券</text>
          </navigator>
          <text class="divider"></text>
          <navigator class="asset-item" url="/pagesMember/recharge/record" hover-class="none">
            <view class="number">
              <text class="symbol">¥</text>
              <text class="">1000000</text>
            </view>
            <text class="badge">余额</text>
          </navigator>
        </view>
      </view>
      <!-- 未登录 -->
      <view class="overview" v-else>
        <image class="avatar gray" mode="aspectFill" src="/static/images/user_default.png"></image>
        <!-- <view class="meta"> 点击授权 </view> -->
      </view>
    </view>

    <view>
      <!-- 经销商 -->
      <view class="aff-wrapper">
        <view class="affiliate">
          <view class="aff-overview">
            <text class="name">{{ memberStore.profile?.vip_grade_name ? memberStore.profile?.vip_grade_name : 'RiverVellay' }}经销商</text>
            <text class="tip">经销商介绍说明.........</text>
          </view>
        </view>
        <view class="footer">
          <view class="desc">
            <text>专属折扣</text>
            <text>优先发货</text>
            <text>极速客服</text>
          </view>
          <navigator
            url="/pagesMember/affiliate/affiliate"
            hover-class="none"
            v-if="memberStore.profile && memberStore.profile.vip_grade_id === 0"
          >
            <button class="button">立即开通</button>
          </navigator>
        </view>
      </view>
      <!-- 我的订单 -->
      <view class="orders">
        <view class="title">
          我的订单
          <navigator class="navigator" url="/pagesOrder/list/list?type=0" hover-class="none">
            查看全部订单<text class="icon-right"></text>
          </navigator>
        </view>
        <view class="section">
          <!-- 订单 -->
          <navigator
            v-for="item in orderTypes"
            :key="item.type"
            :class="item.icon"
            :url="`/pagesOrder/list/list?type=${item.type}`"
            class="navigator"
            hover-class="none"
          >
            {{ item.text }}
          </navigator>
        </view>
      </view>

      <view class="actions">
        <view class="action-item">
          <image class="action-icon" mode="aspectFit" src="/static/images/wallet.png"></image>
          <navigator url="/pagesMember/recharge/recharge" class="navigator" hover-class="none"> 充值中心 </navigator>
        </view>
        <view class="action-item">
          <image class="action-icon" mode="aspectFit" src="/static/images/coupon.png"></image>
          <navigator url="/pages/coupon/coupon" class="navigator" hover-class="none"> 领券中心 </navigator>
        </view>
        <view class="action-item">
          <image class="action-icon" mode="aspectFit" src="/static/images/locate.png"></image>
          <navigator url="/pagesMember/address/address" class="navigator" hover-class="none"> 地址管理 </navigator>
        </view>
        <view class="action-item">
          <image class="action-icon" mode="aspectFit" src="/static/images/user_default.png"></image>
          <navigator url="/pagesMember/profile/profile" class="navigator" hover-class="none"> 账户设置 </navigator>
        </view>
      </view>
    </view>
  </scroll-view>
  <RvAuth />
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background-color: #f7f7f8;
}

.viewport {
  height: 100%;
  background-size: 100% auto;
}

/* 用户信息 */
.profile {
  // height: 25%;
  position: relative;
  background-color: #fff;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);

  .overview {
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: space-around;
    padding: 30rpx;
    color: #010101;

    .divider {
      height: 50rpx;
      margin: 0 30rpx;
      border: 1rpx solid #ccc;
    }
    .assets {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10rpx;
      padding: 20rpx;
    }
    .asset-item {
      min-width: 0;
      flex: 33.3%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .number {
        width: 100%;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .badge {
        color: #333;
        font-size: 28rpx;
      }
    }
  }

  .meta {
    display: flex;
    align-items: center;
  }
  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .gray {
    filter: grayscale(100%);
  }

  .nickname {
    max-width: 180rpx;
    margin-left: 20rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .extra {
    display: flex;
    font-size: 20rpx;
  }

  .tips {
    font-size: 22rpx;
  }

  .update {
    padding: 3rpx 10rpx 1rpx;
    color: rgba(255, 255, 255, 0.8);
    border: 1rpx solid rgba(255, 255, 255, 0.8);
    margin-right: 10rpx;
    border-radius: 30rpx;
  }

  // .settings {
  //   position: absolute;
  //   bottom: 0;
  //   right: 40rpx;
  //   font-size: 30rpx;
  //   color: #fff;
  // }
}

.aff-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 200rpx;
  margin: 30rpx 20rpx 0;
  padding: 20rpx;
  color: #fff;
  background-color: #010101;
  border-radius: 10rpx;
  .affiliate {
    color: #e5e4e2;
    .aff-overview {
      display: flex;
      flex-direction: column;
      .name {
        font-weight: bold;
      }
    }
    .tip {
      color: #ccc;
      font-size: 24rpx;
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .desc {
      flex: 2;
      flex-grow: 1;
      display: flex;
      color: #fff;
      font-size: 22rpx;
      text {
        margin-right: 50rpx;
      }
    }
    .button {
      flex-grow: 0;
      width: 140rpx;
      padding: 3rpx 5rpx;
      line-height: 1.5;
      color: hsl(0, 0%, 0%);
      font-size: 26rpx;
      border-radius: 4rpx;
      background-color: #e5e4e2;
    }
  }
}
/* 我的订单 */
.orders {
  // position: relative;
  // z-index: 99;
  // padding: 30rpx;
  // margin: 30rpx 20rpx 0;
  margin-top: 30rpx;

  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);

  .title {
    padding: 25rpx 30rpx;
    line-height: 40rpx;
    // font-size: 28rpx;
    color: #1e1e1e;
    border-bottom: 1rpx solid #eee;

    .navigator {
      font-size: 28rpx;
      color: #939393;
      float: right;
    }
  }

  .section {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 30rpx;
    .navigator,
    .contact {
      text-align: center;
      font-size: 28rpx;
      color: #333;
      &::before {
        display: block;
        font-size: 60rpx;
        color: #010101;
      }
      &::after {
        border: none;
      }
    }
    .contact {
      padding: 0;
      margin: 0;
      border: 0;
      background-color: transparent;
      line-height: inherit;
    }
  }
}

.actions {
  margin-top: 30rpx;
  padding-bottom: 180rpx;
  background-color: #fff;
  .action-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1rpx solid #eee;
    padding: 30rpx 20rpx;
    .action-icon {
      width: 50rpx;
      height: 50rpx;
    }
    .navigator {
      flex: 1;
      margin-left: 15rpx;
    }
  }
}
</style>
