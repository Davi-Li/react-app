import { useHistory } from 'react-router-dom'
import { NavBar } from 'antd-mobile'

import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { clearSearchResult, getSearchResult } from '@/store/actions/search'
import ArticleItem from '@/pages/Home/components/ArticleItem'
import { RootState } from '@/types/store'
import { InfiniteScroll } from 'antd-mobile'
import { useEffect, useRef } from 'react'
// import qs from 'qs'
const Result = () => {
  const history = useHistory()
  const params = new URLSearchParams(history.location.search)
  const keyword = params.get('keyword')
  const dispatch = useDispatch()

  // 获取redux中searchResult数据
  const {
    result: { results, total_count },
  } = useSelector((state: RootState) => state.search)

  const hasMore = results.length < total_count
  // console.log(results.length, total_count)
  // console.log(hasMore)
  const pageRef = useRef(1)

  const loadMore = async () => {
    await dispatch(getSearchResult(keyword!, pageRef.current))
    pageRef.current += 1
  }

  // 销毁组件的时候清除result数据
  useEffect(() => {
    return () => {
      dispatch(clearSearchResult())
    }
  }, [dispatch])
  return (
    <div className={styles.root}>
      <NavBar onBack={() => history.go(-1)}>搜索结果</NavBar>
      <div className="article-list">
        {results.map((item) => (
          <div className="article-item" key={item.art_id}>
            <ArticleItem article={item}></ArticleItem>
          </div>
        ))}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}></InfiniteScroll>
      </div>
    </div>
  )
}

export default Result
