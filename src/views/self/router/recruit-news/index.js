/**
 * Created by admin on 2018/1/30.
 */
const recruitLayout = () => import(/* webpackChunkName: "recruit-layout" */'views/self/pages/recruit-news/recruit-layout')
const recruitList = () => import(/* webpackChunkName: "recruit-layout" */'views/self/pages/recruit-news/recruit-list')
const recruitDetail = () => import(/* webpackChunkName: "recruit-layout" */'views/self/pages/recruit-news/recruit-details')
export default [
  {
    path: '/recruit',
    name: '招聘信息',
    hide: true,
    component: recruitLayout,
    redirect: '/recruit/recruitList',
    children: [{
      path: 'recruitList',
      name: '招聘列表',
      component: recruitList
    }, {
      path: 'recruitDetail/:id',
      hide: true,
      name: '招聘详情',
      component: recruitDetail
    }]
  }
]
