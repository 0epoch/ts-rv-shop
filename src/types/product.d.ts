import type exp from 'constants'
import type { AddressItem } from './address'
import type { GoodsItem } from './global'

export type ProductParams = {
  keyword?: string
  nav_id?: number
  cid_path?: number
}

/** 商品信息 */
export type Product = {
  id: string
  title: string
  original_price: number
  price: number
  aff_price: number
  stock: number
  is_aff: number
  sold_qty: number
  pic_url: string
  type: string
}

/** 商品详情 */
export type Detail = {
  id: string
  title: string
  original_price: number
  price: number
  aff_price: number
  stock: number
  is_aff: number
  sold_qty: number
  pic_url: string
  main_pictures: string[]
  detail_pictures: string[]
  attrs: Attr[]
  skus: Sku[]
}

export type Attr = {
  attr_id: number
  name: string
  is_cover: number
  values: AttrValue[]
}

export type AttrValue = {
  attr_value: string
  cover: string
}

export type Sku = {
  id: string
  stock: number
  aff_price: number
  pic_url: string
  status: number
  price: number
  sold_qty: number
  attrs: string
  attrs_map: string
}

/** 规格信息 */
export type SkuSpecItem = {
  /** 规格名称 */
  name: string
  /** 可选值名称 */
  valueName: string
}

/** 可选规格信息 */
export type SpecItem = {
  /** 规格名称 */
  name: string
  /** 可选值集合[ 可选值信息 ] */
  values: SpecValueItem[]
}

/** 可选值信息 */
export type SpecValueItem = {
  /** 是否可售 */
  available: boolean
  /** 可选值备注 */
  desc: string
  /** 可选值名称 */
  name: string
  /** 可选值图片链接 */
  picture: string
}
