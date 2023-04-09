import { ApiResponse, User } from '@/types/data'
import { RootThunkAction } from '@/types/store'
import request from '@/utils/request'
// 获取用户的基本信息
export const getUser = (): RootThunkAction => {
  return async (dispatch) => {
    const res = await request.get<ApiResponse<User>>('/user')
    dispatch({
      type: 'profile/getUser',
      payload: res.data.data,
    })
  }
}

export const getUserProfile = (): RootThunkAction => {
  return async (dispatch) => {
    const res = await request.get('/user/profile')
    dispatch({
      type: 'profile/getUserProfile',
      payload: res.data.data,
    })
  }
}

// 修改用户信息
export const updateProfile = (key: string, value: string): RootThunkAction => {
  return async (dispatch) => {
    await request.patch('/user/profile', {
      // 属性名表达式
      [key]: value,
    })
    // 重新发送请求，获取新的用户信息
    await dispatch(getUserProfile())
  }
}

/**
 * 修改用户头像
 * @param fd
 * @returns
 */
export const updateUserPhoto = (fd: FormData): RootThunkAction => {
  return async (dispatch) => {
    await request.patch('/user/photo', fd)
    // 重新发送请求，获取新的用户信息
    await dispatch(getUserProfile())
  }
}
