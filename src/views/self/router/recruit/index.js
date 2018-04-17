const SelfRecruit = () => import(/* webpackChunkName: "self_service" */'../../pages/self-recruit')
const resumeList = () => import(/* webpackChunkName: "self_service" */'../../../admin/pages/recruit/resume-view/index.vue')
export default [
  {
    path: '/self_recruit',
    name: '我的招聘',
    component: SelfRecruit
  },
  {
    path: '/resumeList',
    name: '简历详情',
    hide: true,
    component: resumeList
  }

]

