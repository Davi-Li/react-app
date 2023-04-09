import { ApiResponse, Channel } from '@/types/data'
import { ChannelAction, RootThunkAction } from '@/types/store'
import request from '@/utils/request'
import { getChannels, hasToken, setChannels } from '@/utils/storage'
export const getUserChannel = (): RootThunkAction => {
  return async (dispatch) => {
    // 1. 判断是否登录
    // 2. 如果登录，直接发送请求获取用户的频道
    // 3. 如果没有登陆，优先从localStorage中获取
    // 4. 如果本地没有，需要发送请求获取默认的频道
    if (hasToken()) {
      const res = await request.get<ApiResponse<{ channels: Channel[] }>>(
        '/user/channels'
      )
      dispatch({
        type: 'channel/saveUserChannels',
        payload: res.data.data.channels,
      })
      return
    }
    // 如果没有token,优先从本地获取
    const channels = getChannels()
    if (channels.length > 0) {
      // 本地有数据，直接保存到redux
      dispatch({
        type: 'channel/saveUserChannels',
        payload: channels,
      })
    } else {
      // 本地没有数据
      const res = await request.get<ApiResponse<{ channels: Channel[] }>>(
        '/user/channels'
      )
      // 保存到redux
      dispatch({
        type: 'channel/saveUserChannels',
        payload: res.data.data.channels,
      })
      // 保存到本地
      setChannels(res.data.data.channels)
    }
  }
}

export const getAllChannel = (): RootThunkAction => {
  return async (dispatch) => {
    const res = await request.get<ApiResponse<{ channels: Channel[] }>>(
      '/channels'
    )
    dispatch({
      type: 'channel/saveAllChannels',
      payload: res.data.data.channels,
    })
  }
}

export const changeActive = (id: number): ChannelAction => {
  return {
    type: 'channel/changeActive',
    payload: id,
  }
}

export const addChannel = (channel: Channel): RootThunkAction => {
  return async (dispatch, getState) => {
    // 获取原来的频道
    const {
      channel: { userChannels },
    } = getState()

    const newChannels = [...userChannels, channel]
    // 1. 判断是否登录，如果登录了，就需要发送请求添加，否则添加到本地
    if (hasToken()) {
      // 2. 发送请求添加频道
      await request.put('/user/channels', {
        channels: newChannels,
      })
    } else {
      // 3. 存储到本地
      setChannels(newChannels)
    }
    // 4. 保存到redux中
    dispatch({
      type: 'channel/saveUserChannels',
      payload: newChannels,
    })
  }
}
export const delChannel = (channel: Channel): RootThunkAction => {
  return async (dispatch, getState) => {
    // 获取原来的频道
    const {
      channel: { userChannels },
    } = getState()

    const newChannels = userChannels.filter((item) => item.id !== channel.id)
    // 1. 判断是否登录，如果登录了，就需要发送请求添加，否则添加到本地
    if (hasToken()) {
      // 2. 发送请求添加频道
      await request.put('/user/channels', {
        channels: newChannels,
      })
    } else {
      // 3. 存储到本地
      setChannels(newChannels)
    }
    // 4. 保存到redux中
    dispatch({
      type: 'channel/saveUserChannels',
      payload: newChannels,
    })
  }
}
