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
  id: number
  title: string
  original_price: number
  price: number
  aff_price: number
  stock: number
  is_aff: number
  sold_qty: number
  pic_url: string
  type: string
  aff_visible: number
  meet_qty: number
  meet_discount: number
  meet_price: number
}

/** 商品详情 */
export type Detail = Product & {
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
  id: number
  stock: number
  aff_price: number
  pic_url: string
  status: number
  price: number
  sold_qty: number
  attrs: string
  attrs_map: string
}
