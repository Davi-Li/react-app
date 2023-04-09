import store from '@/store'
import { ThunkAction } from 'redux-thunk'
import { Channel, Token, User, UserProfile } from './data'
export type RootState = ReturnType<typeof store.getState>

// 项目中ThunkAction
export type RootThunkAction = ThunkAction<void, RootState, unknown, RootAction>

// 项目中所有的Action类型
export type RootAction =
  | LoginAction
  | ProfileAction
  | ChannelAction
  | HomeAction
  | SearchAction
// 登录模块的Action类型
export type LoginAction =
  | {
      type: 'login/login'
      payload: Token
    }
  | {
      type: 'login/logout'
    }

// 其他模块的action...
export type ProfileAction =
  | {
      type: 'profile/getUser'
      payload: User
    }
  | {
      type: 'profile/getUserProfile'
      payload: UserProfile
    }

export type ChannelAction =
  | {
      type: 'channel/saveUserChannels'
      payload: Channel[]
    }
  | {
      type: 'channel/saveAllChannels'
      payload: Channel[]
    }
  | {
      type: 'channel/changeActive'
      payload: number
    }
export type HomeAction =
  | {
      type: 'home/getArticleList'
      payload: {
        timestamp: number
        channel_id: number
        results: Article[]
      }
    }
  | {
      type: 'home/getNewArticleList'
      payload: {
        timestamp: number
        channel_id: number
        results: Article[]
      }
    }

type SearchAction =
  | {
      type: 'search/suggestion'
      payload: string[]
    }
  | {
      type: 'search/history'
      payload: string[]
    }
  | {
      type: 'search/result'
      payload: {
        results: Article[]
        total_count: number
      }
    }
  | {
      type: 'search/clear'
    }
