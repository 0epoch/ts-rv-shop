<script setup lang="ts">
import { useMemberStore } from '@/stores'
import { useAuthStore } from '@/stores'

import { balanceBillList } from '@/api/user'
import type { Paginate } from '@/types/global'
import type { Bill } from '@/types/member'

import { billSourceTypeList } from '@/services/constants'

import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const memberStore = useMemberStore()
const authStore = useAuthStore()

const finish = ref(false)
const triggered = ref(false)
const bills = ref<Paginate<Bill>>()

const getBalanceBillList = async () => {
  const rs = await balanceBillList()
  bills.value = rs.data
  bills.value.page = rs.data.current_page
}

onLoad(() => {
  if (!authStore.certified()) {
    authStore.visible = true
    return
  }
  getBalanceBillList()
})

const onRefresherrefresh = async () => {
  triggered.value = true
  await getBalanceBillList()
  triggered.value = false
}

// 滚动触底
const onScrolltolower = async () => {
  if (!bills.value) return
  if (bills.value?.current_page! < bills.value?.last_page!) {
    bills.value.page++
  } else {
    finish.value = true
    return uni.showToast({ icon: 'none', title: '没有更多数据了~' })
  }

  const rs = await balanceBillList({ page: bills.value.page })
  bills.value.data.push(...rs.data.data)
  bills.value.current_page = rs.data.current_page
}
</script>

<template>
  <view class="viewport">
    <view v-if="bills?.data" class="full">
      <view class="balance">
        <text>我的余额</text>
        <view>
          <text class="symbol">¥</text>
          <text class="number">{{ memberStore.profile?.account_balance }}</text>
        </view>
      </view>
      <scroll-view
        class="scroll-view"
        enable-back-to-top
        refresher-enabled
        scroll-y
        @refresherrefresh="onRefresherrefresh"
        :refresher-triggered="triggered"
        @scrolltolower="onScrolltolower"
      >
        <view class="record" v-for="item in bills?.data" :key="item.id">
          <view class="overview">
            <text>{{ billSourceTypeList[item.source_type].text }}</text>
            <text :class="item.value_type === '0' ? 'dec' : 'inc'">{{ item.value }}</text>
          </view>
          <text class="time">{{ item.created_at }}</text>
        </view>
      </scroll-view>
    </view>

    <view class="blank" v-else>暂无记录~</view>
    <RvAuth />
  </view>
</template>

<style lang="scss" scoped>
page {
  background-color: #f4f4f4;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20rpx;
  background-color: #f4f4f4;
  .scroll-view {
    flex: 1;
  }
  .balance {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200rpx;
    margin: 20rpx 30rpx 40rpx 30rpx;
    padding: 20rpx;
    color: #fff;
    background-color: #010101;
    border-radius: 10rpx;
    .price {
      color: #fff;
      font-size: 36rpx;
      font-weight: bold;
    }
    .number {
      font-size: 56rpx;
    }
  }
  .btn {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #010101;
    &.disabled {
      opacity: 0.6;
    }
  }

  .full {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
}
.record {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin-bottom: 20rpx;
  padding: 20rpx 25rpx;

  .overview {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10rpx;
    .inc {
      color: #228b22;
    }
    .dec {
      color: #e51c23;
    }
  }
  .time {
    color: #939393;
    font-size: 24rpx;
  }
}

.blank {
  display: flex;
  justify-content: center;
  color: #939393;
  font-size: 28rpx;
}
</style>
