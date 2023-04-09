import {
  getUserProfile,
  updateProfile,
  updateUserPhoto,
} from '@/store/actions/profile'
import { useInitialState } from '@/utils/hooks'
import {
  Button,
  List,
  DatePicker,
  NavBar,
  Popup,
  Toast,
  Dialog,
} from 'antd-mobile'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import EditInput from './components/EditInput'
import styles from './index.module.scss'
import EditList from './components/EditList'
import dayjs from 'dayjs'
import { logout } from '@/store/actions/login'
const Item = List.Item

const ProfileEdit = () => {
  const history = useHistory()
  const { userProfile } = useInitialState(getUserProfile, 'profile')
  const dispatch = useDispatch()
  const [showInupt, setShowInput] = useState<{
    visible: boolean
    type: '' | 'name' | 'intro'
  }>({
    // 控制显示或者隐藏
    visible: false,
    type: '',
  })

  const [showList, setShowList] = useState<{
    visible: boolean
    type: '' | 'gender' | 'photo'
  }>({
    visible: false,
    type: '',
  })

  // 关闭弹层的方法
  const hideInupt = () => {
    setShowInput({
      visible: false,
      type: '',
    })
  }

  const fileRef = useRef<HTMLInputElement>(null)
  const onUpdate = async (type: string, value: string) => {
    if (type === 'photo') {
      // 修改头像
      console.log('需要修改头像')
      fileRef.current?.click()
      return
    }
    // 1. 发送请求进行修改
    await dispatch(updateProfile(type, value))
    // 2. 提示消息
    Toast.show('修改成功')
    // 3. 关闭弹层
    hideInupt()
    hideList()
  }

  const hideList = () => {
    setShowList({
      visible: false,
      type: '',
    })
  }

  const changePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 通过e获取到上传那个文件
    const file = e.target.files![0]
    // 图片校验 size type
    const fd = new FormData()
    fd.append('photo', file)
    // 发送请求进行修改头像
    await dispatch(updateUserPhoto(fd))
    // 1. 提示消息
    Toast.show('修改头像成功')
    // 2. 隐藏
    hideList()
  }

  const [showBirthday, setShowBirthday] = useState(false)

  const onBirthdayShow = () => {
    setShowBirthday(true)
  }
  const onBirthdayHide = () => {
    setShowBirthday(false)
  }

  const logoutFn = () => {
    Dialog.confirm({
      title: '温馨提示',
      content: '你确定要退出吗',
      onConfirm() {
        // 点击了确定按钮
        // 1. 清除token
        dispatch(logout())
        // 2. 跳转到登录页
        history.push('/login')
      },
    })
  }
  return (
    <div className={styles.root}>
      <div className="content">
        {/* 标题 */}
        <NavBar
          style={{
            '--border-bottom': '1px solid #F0F0F0',
          }}
          onBack={() => history.go(-1)}
        >
          个人信息
        </NavBar>

        <div className="wrapper">
          {/* 列表 */}
          <List className="profile-list">
            {/* 列表项 */}
            <Item
              extra={
                <span className="avatar-wrapper">
                  <img width={24} height={24} src={userProfile.photo} alt="" />
                </span>
              }
              arrow
              onClick={() =>
                setShowList({
                  type: 'photo',
                  visible: true,
                })
              }
            >
              头像
            </Item>
            <Item
              arrow
              extra={userProfile.name}
              onClick={() =>
                setShowInput({
                  visible: true,
                  type: 'name',
                })
              }
            >
              昵称
            </Item>
            <Item
              arrow
              onClick={() =>
                setShowInput({
                  visible: true,
                  type: 'intro',
                })
              }
              extra={
                <span className={classNames('intro', 'normal')}>
                  {userProfile.intro || '未填写'}
                </span>
              }
            >
              简介
            </Item>
          </List>

          <List className="profile-list">
            <Item
              arrow
              extra={userProfile.gender === 0 ? '男' : '女'}
              onClick={() =>
                setShowList({
                  type: 'gender',
                  visible: true,
                })
              }
            >
              性别
            </Item>
            <Item arrow extra={userProfile.birthday} onClick={onBirthdayShow}>
              生日
            </Item>
          </List>
        </div>

        <div className="logout">
          <Button className="btn" onClick={logoutFn}>
            退出登录
          </Button>
        </div>
      </div>
      <Popup
        visible={showInupt.visible}
        position="right"
        bodyStyle={{ width: '100vw' }}
        destroyOnClose
      >
        <EditInput
          hideInupt={hideInupt}
          type={showInupt.type}
          onUpdate={onUpdate}
        ></EditInput>
      </Popup>
      <Popup
        visible={showList.visible}
        position="bottom"
        destroyOnClose
        onMaskClick={hideList}
      >
        <EditList
          hideList={hideList}
          type={showList.type}
          onUpdate={onUpdate}
        ></EditList>
      </Popup>

      {/* 准备一个选择图片的DOM */}
      {/* 在react中，所有的事件对象都是被react处理过的 */}
      <input type="file" hidden ref={fileRef} onChange={changePhoto} />

      {/* 修改生日 */}
      <DatePicker
        visible={showBirthday}
        onClose={onBirthdayHide}
        onConfirm={(value) => {
          // console.log('修改生日', value)
          onUpdate('birthday', dayjs(value).format('YYYY-MM-DD'))
          Toast.show('修改生日成功')
        }}
        max={new Date()}
        min={new Date('1900-01-01')}
        value={new Date(userProfile.birthday)}
      ></DatePicker>
    </div>
  )
}

export default ProfileEdit
