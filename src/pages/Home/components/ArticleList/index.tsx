import { getArticleList, getNewsArticleList } from '@/store/actions/home'
import { RootState } from '@/types/store'
// import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ArticleItem from '../ArticleItem'
import { InfiniteScroll, PullToRefresh } from 'antd-mobile'

import styles from './index.module.scss'
type Props = {
  channelId: number
}
const ArticleList = ({ channelId }: Props) => {
  const dispatch = useDispatch()
  const {
    home: { articles },
  } = useSelector((state: RootState) => state)
  const { results = [], timestamp } = articles[channelId] || {}

  // 是否还有更多
  const hasMore = timestamp !== null && results.length <= 100
  const loadMore = async () => {
    await dispatch(getArticleList(channelId, timestamp || Date.now()))
  }

  const onRefresh = async () => {
    await dispatch(getNewsArticleList(channelId, Date.now()))
  }
  return (
    <div className={styles.root}>
      {/* 文章列表中的每一项 */}
      <PullToRefresh onRefresh={onRefresh}>
        {results.map((item) => (
          <div className="article-item" key={item.art_id}>
            <ArticleItem article={item} />
          </div>
        ))}
      </PullToRefresh>
      {/* 无限加载组件 */}
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore}></InfiniteScroll>
    </div>
  )
}

export default ArticleList
