import Icon from '@/components/icon'

import styles from './index.module.scss'
import { Tabs, Popup } from 'antd-mobile'
import { useInitialState } from '@/utils/hooks'
import {
  getAllChannel,
  getUserChannel,
  changeActive,
} from '@/store/actions/channel'
import Channels from './components/Channels'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import ArticleList from './components/ArticleList'
import { useHistory } from 'react-router'
const Home = () => {
  const { userChannels, active } = useInitialState(getUserChannel, 'channel')
  useInitialState(getAllChannel, 'channel')
  const dispatch = useDispatch()
  const history = useHistory()
  const [visible, setVisible] = useState(false)
  const show = () => {
    setVisible(true)
  }
  const hide = () => {
    setVisible(false)
  }
  return (
    <div className={styles.root}>
      {/* 频道 Tabs 列表 */}
      {userChannels.length > 0 && (
        <Tabs
          className="tabs"
          activeKey={active + ''}
          onChange={(key) => dispatch(changeActive(+key))}
        >
          {userChannels.map((item) => (
            <Tabs.Tab title={item.name} key={item.id}>
              <ArticleList channelId={item.id}></ArticleList>
            </Tabs.Tab>
          ))}
        </Tabs>
      )}

      <div className="tabs-opration">
        {/* 注册点击事件，跳转到/search */}
        <Icon type="iconbtn_search" onClick={() => history.push('/search')} />
        <Icon type="iconbtn_channel" onClick={show} />
      </div>

      {/* 频道管理组件 */}
      <Popup position="left" visible={visible}>
        <Channels hide={hide}></Channels>
      </Popup>
    </div>
  )
}

export default Home
