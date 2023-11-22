<script setup lang="ts">
import { getProfile, applyMember } from '@/api/user'

import { useMemberStore } from '@/stores'
import type { InviteParams, Profile } from '@/types/member'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const { safeAreaInsets } = uni.getSystemInfoSync()

const profile = ref<Profile>()
const form = ref({ mobile: '', invite_code: '', name: '' } as InviteParams)

const getMemberProfile = async () => {
  const rs = await getProfile()
  profile.value = rs.data
  memberStore.profile!.avatar = rs.data.avatar
  memberStore.profile!.nickname = rs.data.nickname
}

onLoad(() => {
  getMemberProfile()
})

const rules: UniHelper.UniFormsRules = {
  invite_code: {
    rules: [{ required: true, errorMessage: '请输邀请码' }],
  },
  mobile: {
    rules: [
      { required: true, errorMessage: '请输入手机号' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式不正确' },
    ],
  },
  name: {
    rules: [{ required: true, errorMessage: '请输入姓名' }],
  },
}

const memberStore = useMemberStore()

const formRef = ref<UniHelper.UniFormsInstance>()
const onSubmit = async () => {
  await formRef.value?.validate?.()

  try {
    await formRef.value?.validate?.()
    const rs = await applyMember(form.value)
    memberStore.setProfile(rs.data)
    uni.showToast({ icon: 'success', title: '加入成功' })
    setTimeout(() => {
      uni.navigateBack()
    }, 400)
  } catch (error) {
    uni.showToast({ icon: 'error', title: '请填写完整信息' })
  }
}
</script>

<template>
  <view class="viewport">
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <navigator open-type="navigateBack" class="back icon-left" hover-class="none"></navigator>
      <view class="title">经销商中心</view>
    </view>

    <view class="aff-wrapper">
      <view class="affiliate">
        <view class="aff-overview">
          <text class="name">XXX经销商</text>
          <text class="tip">经销商介绍说明.........</text>
        </view>
      </view>
      <view class="footer">
        <view class="desc">
          <text>专属折扣</text>
          <text>优先发货</text>
          <text>极速客服</text>
        </view>
      </view>
    </view>

    <view class="content">
      <uni-forms :rules="rules" :model="form" ref="formRef" class="form">
        <uni-forms-item name="invite_code" class="form-item">
          <text class="label">邀请码</text>
          <input class="input" placeholder="请填写邀请码" v-model="form.invite_code" />
        </uni-forms-item>
        <uni-forms-item name="mobile" class="form-item">
          <text class="label">手机号码</text>
          <input class="input" placeholder="请填写手机号码" :maxlength="11" v-model="form.mobile" />
        </uni-forms-item>
        <uni-forms-item name="name" class="form-item">
          <text class="label">姓名</text>
          <input class="input" placeholder="请填写姓名" v-model="form.name" />
        </uni-forms-item>
      </uni-forms>
    </view>
  </view>
  <button @tap="onSubmit" class="button">立即领取</button>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  // background-image: url('/static/images/order_bg.png');
  background-size: auto 420rpx;
  background-color: #fff;
  // background-repeat: no-repeat;
}

// 导航栏
.navbar {
  position: relative;

  .title {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .back {
    position: absolute;
    height: 40px;
    width: 40px;
    left: 0;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
.form {
  background-color: #f4f4f4;
  padding: 20rpx;
}

.content {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .form-item,
  .uni-forms-item {
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    margin-bottom: 0;

    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #010101;
}
</style>
