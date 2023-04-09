// 封装axios
import { Toast } from 'antd-mobile'
import axios, { AxiosError } from 'axios'
import store from '@/store'
import { getToken, setToken } from './storage'
import { logout } from '@/store/actions/login'
import history from './history'
export const baseURL = '/api'
// export const baseURL = 'http://geek.itheima.net'
const instance = axios.create({
  baseURL: baseURL + /v1_0/,
  timeout: 5000,
})

// 这个实例专门用于刷新token
const instance2 = axios.create({
  baseURL: baseURL + /v1_0/,
  timeout: 5000,
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    const token = getToken()
    if (token.token && config.headers) {
      config.headers.Authorization = `Bearer ${token.token}`
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response
  },
  async function (error: AxiosError<{ message: string }>) {
    if (!error.response) {
      // 由于网络繁忙导致的
      Toast.show('网络繁忙，稍后再试')
      return Promise.reject(error)
    }
    console.dir(error)
    // 1. 判断是否401错误
    if (error.response.status === 401) {
      // 2. 是401错误  没有token  token过期了
      const token = getToken()
      if (token.token && token.refresh_token) {
        try {
          // 3. 有token， token过期, 尝试去刷新token,注意需要使用原始的axios来刷新
          const res = await instance2({
            url: '/authorizations',
            method: 'put',
            headers: {
              Authorization: `Bearer ${token.refresh_token}`,
            },
          })
          console.log(res)
          // 4. 刷新token成功，将新的token保存到redux中
          store.dispatch({
            type: 'login/login',
            payload: {
              token: res.data.data.token,
              refresh_token: token.refresh_token,
            },
          })
          setToken({
            token: res.data.data.token,
            refresh_token: token.refresh_token,
          })

          // Token已经没问题了,重新发送请求
          return instance(error.config)
        } catch {
          // 刷新失败
          // 1. 移除token
          store.dispatch(logout())
          // 2. 跳转到登录页

          // window.location.href = '/login'
          history.replace('/login', { from: history.location.pathname })
        }
      } else {
        // 401错误是没有token导致的
        // console.log('跳转到登录页')
        // window.location.href = '/login'
        history.replace('/login', { from: history.location.pathname })
      }
    }

    Toast.show(error.response.data.message)
    return Promise.reject(error)
  }
)

export default instance
