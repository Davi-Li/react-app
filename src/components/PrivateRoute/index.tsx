// 封装一个通用的路由组件，用于拦截未登录的用户
import { hasToken } from '@/utils/storage'
import { Route, Redirect, RouteProps, useLocation } from 'react-router-dom'
export default function PrivateRoute({ children, ...rest }: RouteProps) {
  const location = useLocation()
  return (
    <Route
      {...rest}
      render={() => {
        // 登录了
        if (hasToken()) {
          return children
        } else {
          // 没有登录
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: location.pathname,
                },
              }}
            ></Redirect>
          )
        }
      }}
    ></Route>
  )
}
