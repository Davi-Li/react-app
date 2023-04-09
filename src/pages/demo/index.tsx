import { useState } from 'react'
import { useCountDown } from 'ahooks'
export default function Demo() {
  // 自己使用代码实现倒计时器
  const [time, setTime] = useState<number>(0)

  // 得到的countDown精确到毫秒 精确到秒
  const [countDown] = useCountDown({
    targetDate: time,
  })
  return (
    <div>
      <h3>demo组件</h3>
      <button onClick={() => setTime(Date.now() + 60 * 1000)}>
        {countDown === 0
          ? '获取验证码'
          : `${Math.round(countDown / 1000)}s后发送`}
      </button>
      {/* <div>{countDown}</div> */}
      <button>停止</button>
    </div>
  )
}
