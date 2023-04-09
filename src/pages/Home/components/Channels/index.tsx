import classnames from 'classnames'

import Icon from '@/components/icon'
import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/types/store'
import { differenceBy } from 'lodash'
import { addChannel, changeActive, delChannel } from '@/store/actions/channel'
import { Channel } from '@/types/data'
import { useState } from 'react'
import { Toast } from 'antd-mobile'
type Props = {
  hide: () => void
}
const Channels = ({ hide }: Props) => {
  const {
    channel: { userChannels, allChannels, active },
  } = useSelector((state: RootState) => state)
  const dispatch = useDispatch()
  // 获取推荐的频道 = 所有的频道 - 用户的频道 [1,2,3,4,5]   [2,3]
  // 从数组中排除掉另一个数组中的值
  // const optionsChannels = allChannels.filter((item) => {
  //   // 如果item在用户频道中存在，就不需要，如果不存在，就保留
  //   return !userChannels.some((v) => v.id === item.id)
  // })
  const optionsChannels = differenceBy(allChannels, userChannels, 'id')
  const add = (channel: Channel) => {
    dispatch(addChannel(channel))
  }

  const [isEdit, setIsEdit] = useState(false)
  const toggle = () => {
    setIsEdit(!isEdit)
  }

  const del = (channel: Channel) => {
    // 1. 至少保留4个
    if (userChannels.length <= 4) return Toast.show('至少保留4个频道')
    dispatch(delChannel(channel))
  }
  return (
    <div className={styles.root}>
      <div className="channel-header">
        <Icon type="iconbtn_channel_close" onClick={hide} />
      </div>
      <div className="channel-content">
        {/* 编辑时，添加类名 edit */}
        <div className={classnames('channel-item', { edit: isEdit })}>
          <div className="channel-item-header">
            <span className="channel-item-title">我的频道</span>
            <span className="channel-item-title-extra">
              点击{isEdit ? '编辑' : '进入'}频道
            </span>
            <span className="channel-item-edit" onClick={toggle}>
              {isEdit ? '完成' : '编辑'}
            </span>
          </div>

          {/* 渲染我的频道 */}
          <div className="channel-list">
            {/* 选中时，添加类名 selected */}
            {userChannels.map((item) => (
              <span
                className={classnames('channel-list-item', {
                  selected: item.id === active,
                })}
                key={item.id}
                onClick={() => {
                  if (isEdit) return
                  dispatch(changeActive(item.id))
                  // 关闭弹层
                  hide()
                }}
              >
                {item.name}
                {item.id !== 0 && (
                  <Icon type="iconbtn_tag_close" onClick={() => del(item)} />
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="channel-item">
          <div className="channel-item-header">
            <span className="channel-item-title">频道推荐</span>
            <span className="channel-item-title-extra">点击添加频道</span>
          </div>
          <div className="channel-list">
            {optionsChannels.map((item) => (
              <span
                className="channel-list-item"
                key={item.id}
                onClick={() => add(item)}
              >
                + {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Channels
