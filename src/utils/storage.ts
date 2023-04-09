import { Channel, Token } from '@/types/data'

// 封装存储localStorage的操作
const TOKEN_KEY = 'geek-h5-sh92-token'
const CHANNEL_KEY = 'geek-app-channel-88'
// 存储历史记录的KEY
const HISTORY_KEY = 'geek-h5-sh92-history'
export function setToken(token: Token): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

export function getToken(): Token {
  return JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}')
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function hasToken(): boolean {
  return !!getToken().token
}

/**
 * 保存频道数据
 * @param channels
 */
export function setChannels(channels: Channel[]): void {
  localStorage.setItem(CHANNEL_KEY, JSON.stringify(channels))
}

/**
 * 获取频道列表数据
 * @returns
 */
export function getChannels(): Channel[] {
  return JSON.parse(localStorage.getItem(CHANNEL_KEY) || '[]')
}

// 存储历史记录
export function setHistoryStorage(history: string[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

// 获取历史记录
export function getHistoryStorage(): string[] {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
}
