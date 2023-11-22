import { useMemberStore } from '@/stores'

const baseURL = 'http://8.134.219.163:8100'

const httpInterceptor = {
  invoke(options: UniApp.RequestOptions) {
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    options.timeout = 10000
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }

    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = 'Bearer ' + token
    }
  },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * @param  UniApp.RequestOptions
 * @returns Promise
 */
type Data<T> = {
  code: number
  message: string
  data: T
}
export const request = <T>(options: UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success(rs) {
        if (rs.statusCode >= 200 && rs.statusCode < 300) {
          const data = rs.data as Data<T>
          if (data.code > 0) {
            uni.showToast({
              icon: 'none',
              title: data.message || '请求错误',
            })
            return
            reject(rs)
          }
          resolve(data)
        } else if (rs.statusCode === 401) {
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(rs)
        } else {
          uni.showToast({
            icon: 'none',
            title: (rs.data as Data<T>).message || '请求错误',
          })
          reject(rs)
        }
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}
