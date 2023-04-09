import { ApiResponse, LoginForm, Token } from '@/types/data'
import { LoginAction, RootThunkAction } from '@/types/store'
import request from '@/utils/request'
import { removeToken, setToken } from '@/utils/storage'
export const login = (values: LoginForm): RootThunkAction => {
  return async (dispatch) => {
    const res = await request.post<ApiResponse<Token>>(
      '/authorizations',
      values
    )
    // 存储到redux中
    dispatch({
      type: 'login/login',
      payload: res.data.data,
    })
    // 存储到localStorage中
    setToken(res.data.data)
  }
}

export const getCode = (mobile: string): RootThunkAction => {
  return async (dispatch) => {
    // 发送请求获取验证
    await request.get(`/sms/codes/${mobile}`)
  }
}

export const logout = (): LoginAction => {
  // 移除本地的
  removeToken()
  return {
    type: 'login/logout',
  }
}
