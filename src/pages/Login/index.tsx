import styles from './index.module.scss'
import { NavBar, Form, Input, List, Button, Toast } from 'antd-mobile'
import { useHistory, useLocation } from 'react-router-dom'
import { LoginForm } from '@/types/data'
import { useDispatch } from 'react-redux'
import { getCode, login } from '@/store/actions/login'
import { useRef, useState } from 'react'
import { FormInstance } from 'antd-mobile/es/components/form'
import { InputRef } from 'antd-mobile/es/components/input'
import { useCountDown } from 'ahooks'
export default function Login() {
  const history = useHistory()
  const dispatch = useDispatch()
  const location = useLocation<{ from: string }>()
  console.log(location.state)
  const onFinish = async (values: LoginForm) => {
    await dispatch(login(values))
    Toast.show({
      content: '登录成功',
      icon: 'success',
    })
    const { from } = location.state || { from: '/home' }
    // 跳转到首页
    history.replace(from)
  }

  // 1. 获取到手机号
  // 2. 校验手机号是否合法
  // 3. 发送请求获取验证码
  const formRef = useRef<FormInstance>(null)
  const mobileRef = useRef<InputRef>(null)

  // 倒计时
  const [count, setCount] = useState(0)
  const [countDown] = useCountDown({
    targetDate: count,
  })
  const onGetCode = async () => {
    if (countDown > 0) {
      // 说明倒计时正在运行
      return
    }
    const mobile = formRef.current!.getFieldValue('mobile')
    const error = formRef.current!.getFieldError('mobile')
    if (!mobile || error?.length > 0) {
      // 不应该发送请求
      // 让手机号自动获取焦点
      mobileRef.current?.focus()
      return
    }
    await dispatch(getCode(mobile))
    // console.log('开启倒计时')

    setCount(Date.now() + 60 * 1000)
  }
  return (
    <div className={styles.root}>
      <NavBar onBack={() => history.go(-1)}>登录</NavBar>

      {/* 表单 */}
      <div className="login-form">
        <h2 className="title">账号登录</h2>

        {/* 失去焦点的时候以及改变的时候触发校验 */}
        <Form
          validateTrigger={['onChange', 'onBlur']}
          onFinish={onFinish}
          ref={formRef}
          initialValues={{
            mobile: '13911111111',
            code: '246810',
          }}
        >
          <Form.Item
            className="login-item"
            name="mobile"
            rules={[
              {
                required: true,
                message: '手机号不能为空',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号格式错误',
              },
            ]}
          >
            {/* 关闭历史记录 */}
            <Input
              placeholder="请输入手机号"
              autoComplete="off"
              ref={mobileRef}
            ></Input>
          </Form.Item>
          <List.Item
            className="login-code-extra"
            extra={
              <span className="code-extra" onClick={onGetCode}>
                {countDown === 0
                  ? '发送验证码'
                  : `${Math.round(countDown / 1000)}s后发送`}
              </span>
            }
          >
            <Form.Item
              className="login-item"
              name="code"
              rules={[
                {
                  required: true,
                  message: '验证码不能为空',
                },
                {
                  pattern: /^\d{6}$/,
                  message: '验证码格式错误',
                },
              ]}
            >
              <Input autoComplete="off" placeholder="请输入验证码"></Input>
            </Form.Item>
          </List.Item>
          <Form.Item>
            {/* 这是提交按钮 */}
            <Button
              color="primary"
              type="submit"
              block
              className="login-submit"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
