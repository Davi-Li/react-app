// 自定义的hooks

import { RootState } from '@/types/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
/**
 * 1. 自动useEffect发送请求
 * 2. 通过useSelector获取到数据并返回
 */
export function useInitialState<K extends keyof RootState>(
  action: () => void,
  stateName: K
) {
  const dispatch = useDispatch()
  // 进入组件，就需要发送请求
  useEffect(() => {
    dispatch(action())
  }, [dispatch, action])

  // 进入组件，需要获取redux的数据
  const state = useSelector((state: RootState) => state[stateName])
  return state
}
