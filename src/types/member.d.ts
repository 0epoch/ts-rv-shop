// aff_status_zh: "申请中"
// avatar: ""
// brand_id: 1
// created_at: "2023-11-13 21:57:01"
// gender: 0
// has_aff: false
// id: 1
// identity_zh: null
// ip: "172.20.0.1"
// location: ""
// login_at: "2023-11-13 21:57:01"
// nickname: "微信用户"
// pv: 1
// status: 1
// token: "4|tgZkKQ82g4mLuu5VZ1U8PfbayTZ5YJOvvdBlYLTv"
// updated_at: "2023-11-13 21:57:01"
// vip_code: "4638153678423108"

type BaseProfile = {
  id: number
  avatar: string
  account: string
  nickname?: string
  name?: string
  has_aff: boolean
  token: string
}

/** 小程序登录 登录用户信息 */
export type LoginResult = BaseProfile & {
  /** 手机号 */
  mobile: string
  /** 登录凭证 */
  token: string
}

export type Profile = {
  id: number
  avatar: string
  account: string
  nickname?: string
  name?: string
  token: string
  gender?: Gender
  has_aff: boolean
}
/** 性别 */
export type Gender = 0 | 1 | 2

/** 个人信息 修改请求体参数 */
export type ProfileParams = Pick<
  ProfileDetail,
  'nickname' | 'gender' | 'birthday' | 'profession'
> & {
  /** 省份编码 */
  provinceCode?: string
  /** 城市编码 */
  cityCode?: string
  /** 区/县编码 */
  countyCode?: string
}
