import { Comment, CommentRes } from '@/types/data'
import { NavBar, InfiniteScroll, Popup } from 'antd-mobile'
import CommentFooter from '../CommentFooter'
import NoComment from '../NoComment'
import styles from './index.module.scss'
import CommentItem from '../CommentItem'
import { useState } from 'react'
import { addReply, getReplyList } from '@/store/actions/article'
import CommentInput from '../CommentInput'
import { useParams } from 'react-router'
type Props = {
  hideReply?: () => void
  comment?: Comment
  addReplyCount?: (comment_id: string) => void
}
export default function CommentReply({
  hideReply,
  comment = {} as Comment,
  addReplyCount,
}: Props) {
  // 1. 显示原始的评论
  // 2. 显示评论的回复
  // 获取到评论的所有回复
  const [replyList, setReplyList] = useState<CommentRes>({
    results: [],
    total_count: 100,
    last_id: '',
    end_id: '',
  })
  const { id } = useParams<{ id: string }>()
  const hasMore = replyList.total_count > replyList.results.length

  const loadMore = async () => {
    const res = await getReplyList(comment.com_id, replyList.last_id)
    // console.log(res)
    setReplyList({
      ...res.data.data,
      results: [...replyList.results, ...res.data.data.results],
      total_count: res.data.data.total_count,
    })
  }

  const [visible, setVisible] = useState(false)
  const show = () => {
    setVisible(true)
  }
  const hide = () => {
    setVisible(false)
  }

  const addReplyFn = async (value: string) => {
    console.log('value', value)
    const res = await addReply(comment.com_id, value, id)
    // 保存到回复列表
    setReplyList({
      ...replyList,
      results: [res.data.data.new_obj, ...replyList.results],
      total_count: replyList.total_count + 1,
    })
    // 关闭弹层
    hide()

    // 让评论的数量+1
    addReplyCount?.(comment.com_id)
  }
  return (
    <div className={styles.root}>
      <div className="reply-wrapper">
        {/* 顶部导航栏 */}
        <NavBar onBack={hideReply} className="transparent-navbar">
          <div>{comment.reply_count}条回复</div>
        </NavBar>

        {/* 原评论信息 */}
        <div className="origin-comment">
          <CommentItem type="origin" comment={comment}></CommentItem>
        </div>

        {/* 回复评论的列表 */}
        <div className="reply-list">
          <div className="reply-header">全部回复</div>
          {replyList.results.map((item) => (
            <CommentItem
              type="reply"
              comment={item}
              key={item.com_id}
            ></CommentItem>
          ))}
          {replyList.results.length === 0 && <NoComment />}

          <InfiniteScroll
            hasMore={hasMore}
            loadMore={loadMore}
          ></InfiniteScroll>
        </div>

        {/* 评论工具栏，设置 type="reply" 不显示评论和点赞按钮 */}
        <CommentFooter type="reply" showComment={show} />

        {/* 添加回复功能 */}
        <Popup position="right" visible={visible} destroyOnClose>
          <CommentInput
            name={comment.aut_name}
            hideComment={hide}
            addComment={addReplyFn}
          ></CommentInput>
        </Popup>
      </div>
    </div>
  )
}
