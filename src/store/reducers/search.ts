import { Article } from '@/types/data'
import { SearchAction } from '@/types/store'
import { getHistoryStorage } from '@/utils/storage'
import produce from 'immer'

// 定义search模块的reducer
type SearchStateType = {
  suggestion: string[]
  // 历史记录
  history: string[]
  // 搜索结果
  result: {
    results: Article[]
    total_count: number
  }
}

const SearchState: SearchStateType = {
  suggestion: [],
  history: getHistoryStorage(),
  result: {
    results: [],
    total_count: 100,
  },
}

const search = produce((draft: SearchStateType, action: SearchAction) => {
  switch (action.type) {
    case 'search/suggestion':
      draft.suggestion = action.payload
      break
    case 'search/history':
      draft.history = action.payload
      break
    case 'search/result':
      // 在原来的基础上追加新的搜索结果
      draft.result.results = [
        ...draft.result.results,
        ...action.payload.results,
      ]
      draft.result.total_count = action.payload.total_count
      break
    case 'search/clear':
      draft.result = {
        results: [],
        total_count: 100,
      }
      break
    default:
      break
  }
}, SearchState)
export default search
