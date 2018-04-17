// import default from './employee';

/**
 * 一级信息中心
 */
const Layout = () => import('components/common/layout/layout')
// const Blank = () => import('components/common/layout/blank')

// 二级菜单
const CustomizeInquiry = () => import('../pages/info-center/customize-inquiry')
const CollectInquiry = () => import('../pages/info-center/collect-inquiry')
const RecentInquiry = () => import('../pages/info-center/recent-inquiry')
const CommonInquiry = () => import('../pages/info-center/common-inquiry')

var basic = [{
  path: '/info_center',
  name: '信息中心',
  component: Layout,
  redirect: '/info_center/customize_inquiry',
  children: [{
    path: '/info_center/customize_inquiry',
    name: '我定义的查询',
    component: CustomizeInquiry
  }, {
    path: '/info_center/collect_inquiry',
    name: '我收藏的查询',
    component: CollectInquiry
  }, {
    path: '/info_center/recent_inquiry',
    name: '最近使用的查询',
    component: RecentInquiry
  }, {
    path: '/info_center/common_inquiry',
    name: '公共查询',
    component: CommonInquiry
  }]
}]

export default basic
