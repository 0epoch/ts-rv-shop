import type { GoodsItem } from './global'

export type ConfItem = {
  id: number
  name: string
  cover: string
  related: string
  score: string
  position: string
  is_open: string
}

export type HomeConfs = {
  banner: ConfItem[]
  feature: ConfItem[]
}
