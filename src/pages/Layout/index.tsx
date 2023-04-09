import styles from './index.module.scss'
import { TabBar } from 'antd-mobile'
import Icon from '@/components/icon'
import { useHistory, useLocation } from 'react-router-dom'
import { Route, Switch } from 'react-router-dom'
import KeepAlive from '@/components/KeepAlive'
import PrivateRoute from '@/components/PrivateRoute'
import React, { Suspense } from 'react'
import Home from '../Home'
const Question = React.lazy(() => import('../Question'))
const Profile = React.lazy(() => import('../Profile'))
const Video = React.lazy(() => import('../Video'))

const tabs = [
  { path: '/home', icon: 'iconbtn_home', text: '首页' },
  { path: '/home/question', icon: 'iconbtn_qa', text: '问答' },
  { path: '/home/video', icon: 'iconbtn_video', text: '视频' },
  { path: '/home/profile', icon: 'iconbtn_mine', text: '我的' },
]
export default function Layout() {
  const history = useHistory()
  const location = useLocation()
  const changeRoute = (key: string) => {
    history.push(key)
  }
  return (
    <Suspense fallback={<div>二级路由加载...</div>}>
      <div className={styles.root}>
        {/* 二级路由 */}
        <KeepAlive path="/home" exact>
          <Home></Home>
        </KeepAlive>
        <Switch>
          <Route path="/home/video">
            <Video></Video>
          </Route>
          <Route path="/home/question">
            <Question></Question>
          </Route>
          <PrivateRoute path="/home/profile">
            <Profile></Profile>
          </PrivateRoute>
        </Switch>
        <TabBar
          className="tab-bar"
          onChange={changeRoute}
          activeKey={location.pathname}
        >
          {tabs.map((item) => (
            <TabBar.Item
              key={item.path}
              icon={(active) => {
                if (active) {
                  // 当前tab激活
                  return <Icon type={item.icon + '_sel'}></Icon>
                } else {
                  // 没有激活
                  return <Icon type={item.icon}></Icon>
                }
              }}
              title={item.text}
            />
          ))}
        </TabBar>
      </div>
    </Suspense>
  )
}
