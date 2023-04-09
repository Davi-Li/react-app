// 导入request模块
import { ApiResponse, Article } from '@/types/data'
import { RootThunkAction } from '@/types/store'
import request from '@/utils/request'
import { setHistoryStorage } from '@/utils/storage'

// 获取推荐数据
export const getSuggestion = (keyword: string): RootThunkAction => {
  return async (dispatch) => {
    const res = await request.get<
      ApiResponse<{
        options: string[]
      }>
    >('/suggestion', {
      params: {
        q: keyword,
      },
    })
    dispatch({
      type: 'search/suggestion',
      payload: res.data.data.options,
    })
  }
}

export const setHistory = (history: string[]) => {
  // 保存到localStorage
  setHistoryStorage(history)

  return {
    type: 'search/history',
    payload: history,
  }
}

// 发送请求，获取搜索结果
export const getSearchResult = (
  keyword: string,
  page = 1,
  per_page = 10
): RootThunkAction => {
  return async (dispatch) => {
    const res = await request.get<
      ApiResponse<{ results: Article[]; total_count: number }>
    >('/search', {
      params: {
        q: keyword,
        page,
        per_page,
      },
    })
    dispatch({
      type: 'search/result',
      payload: {
        results: res.data.data.results,
        total_count: res.data.data.total_count,
      },
    })
  }
}

export const clearSearchResult = () => {
  return {
    type: 'search/clear',
  }
}
