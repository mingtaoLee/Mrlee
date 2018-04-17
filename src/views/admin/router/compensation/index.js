/**
 * 薪酬模块路由
 */
import iafRoutes from './iaf'
import baseSettingRoutes from './base-setting'
import employeeInfoRoutes from './employee-info'
import DataCollection from './data-collection'
import CheckGive from './check-give'
const Layout = () => import('components/common/layout/layout')

export default [{
  path: '/compensation',
  name: '薪酬管理',
  redirect: '/compensation/iaf',
  component: Layout,
  children: [...baseSettingRoutes, ...iafRoutes, ...employeeInfoRoutes, ...DataCollection, ...CheckGive]
}]
