import classnames from 'classnames'
import { useEffect, useRef, useState } from 'react'

import Icon from '../icon'
import styles from './index.module.scss'

type Props = {
  src: string
  className?: string
  alt?: string
}
const Img = ({ src, className, alt }: Props) => {
  // 图片懒加载
  const imgRef = useRef<HTMLImageElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const onLoad = () => {
    // 图片加载成功，修改loading状态
    setLoading(false)
  }
  const onError = () => {
    // 图片加载失败，修改error状态
    setError(true)
  }
  useEffect(() => {
    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      const imgDom = imgRef.current!
      if (isIntersecting) {
        imgDom.src = imgDom.dataset.src!
        // 停止监听
        observer.unobserve(imgDom)
      }
    })
    observer.observe(imgRef.current!)
  }, [])
  return (
    <div className={classnames(styles.root, className)}>
      {/* 正在加载时显示的内容 */}
      {loading && (
        <div className="image-icon">
          <Icon type="iconphoto" />
        </div>
      )}

      {/* 加载出错时显示的内容 */}
      {error && (
        <div className="image-icon">
          <Icon type="iconphoto-fail" />
        </div>
      )}

      {/* 加载成功时显示的内容 */}
      {!error && (
        <img
          alt={alt}
          data-src={src}
          ref={imgRef}
          onLoad={onLoad}
          onError={onError}
        />
      )}
    </div>
  )
}

export default Img
