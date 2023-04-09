import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
// import 'highlight.js/styles/vs2015.css'
import hljs from 'highlight.js'
const Question = () => {
  useEffect(() => {
    hljs.highlightAll()
  }, [])
  const [value] = useState(`
    <div>
      <pre>
        <code lang="html" class="bash copyable">
          <div>123</div>
          <span>哈哈哈</span>
          <div>456</div>
          <script>
            console.log('哈哈哈)
          </script>
        </code>
      </pre>
    </div>
`)
  return (
    <div className={styles.root}>
      <div>{value}</div>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(value),
        }}
      ></div>
    </div>
  )
}

export default Question
