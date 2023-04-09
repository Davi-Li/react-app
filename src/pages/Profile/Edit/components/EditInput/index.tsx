import { RootState } from '@/types/store'
import { Input, NavBar, TextArea } from 'antd-mobile'
import { InputRef } from 'antd-mobile/es/components/input'
import { TextAreaRef } from 'antd-mobile/es/components/text-area'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import styles from './index.module.scss'

type Props = {
  hideInupt: () => void
  type: '' | 'name' | 'intro'
  onUpdate: (type: string, value: string) => void
}
const EditInput = ({ hideInupt, type, onUpdate }: Props) => {
  const { userProfile } = useSelector((state: RootState) => state.profile)
  const inputRef = useRef<InputRef>(null)
  const textRef = useRef<TextAreaRef>(null)
  const [value, setValue] = useState(() => {
    if (type === 'name') {
      return userProfile.name
    } else {
      return userProfile.intro
    }
  })
  useEffect(() => {
    if (type === 'name') {
      inputRef.current?.focus()
    } else {
      textRef.current?.focus()
      document.querySelector('textarea')?.setSelectionRange(-1, -1)
    }
  }, [type])
  return (
    <div className={styles.root}>
      <NavBar
        className="navbar"
        right={
          <span
            className="commit-btn"
            onClick={() => {
              if (value) {
                onUpdate(type, value)
              }
            }}
          >
            提交
          </span>
        }
        onBack={hideInupt}
      >
        编辑{type === 'name' ? '昵称' : '简介'}
      </NavBar>

      <div className="edit-input-content">
        <h3>{type === 'name' ? '昵称' : '简介'}</h3>

        {type === 'name' ? (
          <div className="input-wrap">
            <Input
              placeholder="请输入昵称"
              value={value}
              onChange={(e) => setValue(e)}
              ref={inputRef}
            />
          </div>
        ) : (
          <TextArea
            className="textarea"
            placeholder="请输入简介"
            showCount
            maxLength={99}
            value={value}
            onChange={(e) => setValue(e)}
            ref={textRef}
          />
        )}
      </div>
    </div>
  )
}

export default EditInput
