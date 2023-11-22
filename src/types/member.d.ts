type BaseProfile = {
  id: number
  avatar: string
  account: string
  nickname?: string
  name?: string
  has_aff: boolean
  token: string
}

export type LoginResult = BaseProfile & {
  mobile: string
  token: string
}

export type Profile = {
  id: number
  mobile: string
  avatar: string
  nickname?: string
  name?: string
  birthday?: string
  vip_grade_id?: number
  vip_grade_name?: string
  token: string
  gender?: Gender
  has_aff: boolean
}
/** 性别 */
export type Gender = 0 | 1 | 2

export type InviteParams = {
  user_id?: number
  mobile?: string
  name?: string
  invite_code?: string
}

export type ProfileParams = InviteParams & {
  avatar?: string
  nickname?: string
  name?: string
  gender?: number
  city?: string
  birthday?: string
  province?: string
}
