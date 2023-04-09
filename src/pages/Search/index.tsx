import classnames from 'classnames'
import { useHistory } from 'react-router'
import { NavBar, SearchBar } from 'antd-mobile'

import Icon from '@/components/icon'
import styles from './index.module.scss'
// 导入useState
import { useState } from 'react'
import { useDebounceFn } from 'ahooks'
import { useDispatch, useSelector } from 'react-redux'
import { getSuggestion, setHistory } from '@/store/actions/search'
import { RootState } from '@/types/store'
import { highlight } from '@/utils'

const SearchPage = () => {
  const history = useHistory()
  // 使用useState定义搜索框的值
  const [value, setValue] = useState('')
  const dispatch = useDispatch()
  // 获取redux中的suggestion
  const { suggestion, history: historyList } = useSelector(
    (state: RootState) => state.search
  )

  const { run } = useDebounceFn(
    () => {
      // 发送请求，获取搜索建议
      if (!value) {
        return
      }
      dispatch(getSuggestion(value))
    },
    {
      wait: 500,
    }
  )
  const onChange = (e: string) => {
    setValue(e)
    if (e) {
      setIsSearch(true)
    } else {
      setIsSearch(false)
    }
    // 搜索功能，需要防抖
    run()
  }

  const [isSearch, setIsSearch] = useState(false)

  const addHistory = (value: string) => {
    // 添加的历史记录不予许重复，把原先的历史记录删除掉，在添加
    const newHistoryList = historyList.filter((item) => item !== value)
    newHistoryList.unshift(value)
    // 添加的历史记录最多不超过10条
    if (newHistoryList.length > 10) {
      newHistoryList.pop()
    }
    // 把历史记录保存到redux
    dispatch(setHistory(newHistoryList))

    // 跳转到搜索结果页面
    history.push(`/search/result?keyword=${value}`)
  }
  const clear = () => {
    // 清空历史记录
    dispatch(setHistory([]))
  }

  const delHistory = (value: string) => {
    // 删除历史记录
    const newHistoryList = historyList.filter((item) => item !== value)
    dispatch(setHistory(newHistoryList))
  }
  return (
    <div className={styles.root}>
      <NavBar
        className="navbar"
        onBack={() => history.go(-1)}
        right={
          <span className="search-text" onClick={() => addHistory(value)}>
            搜索
          </span>
        }
      >
        <SearchBar
          placeholder="请输入关键字搜索"
          value={value}
          onChange={onChange}
        />
      </NavBar>

      {/* 历史记录 */}

      <div
        className="history"
        style={{
          display: isSearch ? 'none' : 'block',
        }}
      >
        <div className="history-header">
          <span>搜索历史</span>
          <span onClick={clear}>
            <Icon type="iconbtn_del" />
            清除全部
          </span>
        </div>

        <div className="history-list">
          {historyList.map((item, index) => (
            <span className="history-item" key={index}>
              <span className="text-overflow" onClick={() => addHistory(item)}>
                {item}
              </span>
              <Icon
                type="iconbtn_essay_close"
                onClick={() => delHistory(item)}
              />
            </span>
          ))}
        </div>
      </div>

      {/* 推荐的数据渲染 */}
      <div className={classnames('search-result', isSearch ? 'show' : '')}>
        {
          // 推荐的数据渲染
          suggestion.map((item, index) => {
            if (item) {
              return (
                <div
                  className="result-item"
                  key={index}
                  onClick={() => addHistory(item)}
                >
                  <Icon className="icon-search" type="iconbtn_search" />
                  <div
                    className="result-value text-overflow"
                    dangerouslySetInnerHTML={{
                      __html: highlight(item, value),
                    }}
                  ></div>
                </div>
              )
            } else {
              return <div>没有相关的文章</div>
            }
          })
        }
      </div>
    </div>
  )
}

export default SearchPage
