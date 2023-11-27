import { Component } from '@uni-helper/uni-app-types'

export type SkuPopup = Component<SkuPopupProps>

export type SkuPopupInstance = InstanceType<SkuPopup>

export type SkuPopupProps = {
  modelValue: boolean
  localdata: SkuPopupLocaldata
  mode?: 1 | 2 | 3
  noStockText?: string
  stockText?: string
  maskCloseAble?: boolean
  borderRadius?: string | number
  minBuyNum?: number
  maxBuyNum?: number
  stepBuyNum?: number
  stepStrictly?: boolean
  hideStock?: false
  theme?: 'default' | 'red-black' | 'black-white' | 'coffee' | 'green'
  amountType?: 1 | 0
  customAction?: () => void
  showClose?: boolean
  closeImage?: string
  priceColor?: string
  buyNowText?: string
  buyNowColor?: string
  buyNowBackgroundColor?: string
  addCartText?: string
  addCartColor?: string
  addCartBackgroundColor?: string
  goodsThumbBackgroundColor?: string
  disableStyle?: object
  activedStyle?: object
  btnStyle?: object
  goodsIdName?: string
  skuIdName?: string
  skuListName?: string
  specListName?: string
  stockName?: string
  skuArrName?: string
  goodsThumbName?: string
  selectArr?: string[]

  onOpen: () => void
  onClose: () => void
  onAddCart: (event: SkuPopupEvent) => void
  onBuyNow: (event: SkuPopupEvent) => void
}

export type SkuPopupLocaldata = {
  _id: number
  name: string
  goods_thumb: string
  spec_list: SkuPopupSpecItem[]
  sku_list: SkuPopupSkuItem[]
}

export type SkuPopupSpecItem = {
  name: string
  list: { name: string }[]
}

export type SkuPopupSkuItem = {
  _id: number
  goods_id: number
  goods_name: string
  image: string
  price: number
  sku_name_arr: string[]
  stock: number
}

export type SkuPopupEvent = SkuPopupSkuItem & {
  buy_num: number
}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    'vk-data-goods-sku-popup': SkuPopup
  }
}
