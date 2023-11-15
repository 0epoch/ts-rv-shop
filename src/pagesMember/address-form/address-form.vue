<script setup lang="ts">
import { saveAddr, getAddr } from '@/api/user'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 表单数据
const form = ref({
  address_id: '',
  name: '',
  mobile: '',
  full_location: '',
  province: '',
  city: '',
  region: '',
  addr: '',
  is_default: 0,
})

const query = defineProps<{
  id?: string
}>()

const getMemberAddr = async () => {
  if (query.id) {
    const rs = await getAddr(query.id)
    Object.assign(form.value, rs.data)
    form.value.address_id = rs.data.id
  }
}

onLoad(() => {
  getMemberAddr()
})

uni.setNavigationBarTitle({ title: query.id ? '修改地址' : '新建地址' })

const onRegionChange: UniHelper.RegionPickerOnChange = (ev) => {
  form.value.full_location = ev.detail.value.join(' ')
  console.log(ev.detail.value)
  const [province, city, region] = ev.detail.code!

  Object.assign(form.value, { province, city, region })
}

const onSwitchChange: UniHelper.SwitchOnChange = (ev) => {
  form.value.is_default = ev.detail.value ? 1 : 0
}

const rules: UniHelper.UniFormsRules = {
  name: {
    rules: [{ required: true, errorMessage: '请输入收货人姓名' }],
  },
  mobile: {
    rules: [
      { required: true, errorMessage: '请输入联系方式' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号格式不正确' },
    ],
  },
  region: {
    rules: [{ required: true, errorMessage: '请选择所在地区' }],
  },
  addr: {
    rules: [{ required: true, errorMessage: '请选择详细地址' }],
  },
}

const formRef = ref<UniHelper.UniFormsInstance>()

const onSubmit = async () => {
  try {
    await formRef.value?.validate?.()
    if (query.id) {
      await saveAddr(form.value)
    } else {
      await saveAddr(form.value)
    }
    uni.showToast({ icon: 'success', title: query.id ? '修改成功' : '添加成功' })
    setTimeout(() => {
      uni.navigateBack()
    }, 400)
  } catch (error) {
    uni.showToast({ icon: 'error', title: '请填写完整信息' })
  }
}

// #ifdef H5 || APP-PLUS
const onCityChange: UniHelper.UniDataPickerOnChange = (ev) => {
  const [province, city, county] = ev.detail.value
  Object.assign(form.value, {
    provinceCode: province.value,
    cityCode: city.value,
    countyCode: county.value,
  })
}
// #endif
</script>

<template>
  <view class="content">
    <uni-forms :rules="rules" :model="form" ref="formRef">
      <!-- 表单内容 -->
      <uni-forms-item name="receiver" class="form-item">
        <text class="label">收货人</text>
        <input class="input" placeholder="请填写收货人姓名" v-model="form.name" />
      </uni-forms-item>
      <uni-forms-item name="contact" class="form-item">
        <text class="label">手机号码</text>
        <input
          class="input"
          placeholder="请填写收货人手机号码"
          :maxlength="11"
          v-model="form.mobile"
        />
      </uni-forms-item>
      <uni-forms-item name="countyCode" class="form-item">
        <text class="label">所在地区</text>
        <!-- #ifdef MP-WEIXIN -->
        <picker
          @change="onRegionChange"
          class="picker"
          mode="region"
          :value="form.full_location.split(' ')"
        >
          <view v-if="form.full_location">{{ form.full_location }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
        <!-- #endif -->

        <!-- #ifdef H5 || APP-PLUS -->
        <uni-data-picker
          placeholder="请选择地址"
          popup-title="请选择城市"
          collection="opendb-city-china"
          field="code as value, name as text"
          orderby="value asc"
          :step-searh="true"
          self-field="code"
          parent-field="parent_code"
          @change="onCityChange"
          :clear-icon="false"
          v-model="form.region"
        />
        <!-- #endif -->
      </uni-forms-item>
      <uni-forms-item name="address" class="form-item">
        <text class="label">详细地址</text>
        <input class="input" placeholder="街道、楼牌号等信息" v-model="form.addr" />
      </uni-forms-item>
      <view class="form-item">
        <label class="label">设为默认地址</label>
        <switch
          @change="onSwitchChange"
          class="switch"
          color="#010101"
          :checked="form.is_default === 1"
        />
      </view>
    </uni-forms>
  </view>
  <button @tap="onSubmit" class="button">保存并使用</button>
</template>

<style lang="scss">
// 深度选择器修改 uni-data-picker 组件样式
:deep(.selected-area) {
  flex: 0 1 auto;
  height: auto;
}

page {
  background-color: #f4f4f4;
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

    // 调整 uni-forms 样式
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
