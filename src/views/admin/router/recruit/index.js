/**
 * 一级菜单绩效管理
 */
const Layout = () => import('components/common/layout/layout')
const Blank = () => import('components/common/layout/blank')

const ResumeManager = () => import('../../pages/recruit/resume-manager/index')
const LabelManage = () => import('../../pages/recruit/basic-setting/label-manage')
const InformTemplate = () => import('../../pages/recruit/basic-setting/inform-template')
const EvaluateManage = () => import('../../pages/recruit/basic-setting/evaluate-manage')
const ChannelRecruit = () => import('../../pages/recruit/channel-recruit/index')
const RecruitRequirment = () => import('../../pages/recruit/recruit-requirment/index')
const Interview = () => import('../../pages/recruit/interview')
const EvaluateList = () => import('../../pages/recruit/basic-setting/evaluate-list')
const Matriculated = () => import('../../pages/recruit/matriculated')

export default [{
  path: '/recruit',
  name: '员工招聘',
  component: Layout,
  redirect: '/recruit/basic-setting',
  children: [{
    path: '/recruit/basic-setting',
    name: '基础设置',
    component: Blank,
    redirect: '/recruit/basic-setting/label',
    children: [{
      path: 'label',
      name: '标签库',
      hide: false,
      component: LabelManage
    }, {
      path: 'inform-template',
      name: '通知模板管理',
      component: InformTemplate
    }, {
      path: 'evaluate',
      name: '评估项管理',
      component: EvaluateManage
    }, {
      path: 'evaluate-list',
      name: '评估表模板管理',
      component: EvaluateList
    }]
  }, {
    path: '/recruit/channel-recruit',
    name: '渠道招聘',
    component: Blank,
    redirect: '/recruit/channel-recruit/index',
    children: [{
      path: 'index',
      name: '渠道招聘跟进',
      hide: false,
      component: ChannelRecruit
    }]
  }, {
    path: '/recruit/recruit-requirment',
    name: '招聘需求',
    component: Blank,
    redirect: '/recruit/recruit-requirment/index',
    children: [{
      path: 'index',
      name: '招聘需求发布',
      hide: false,
      component: RecruitRequirment
    }]
  }, {
    path: '/recruit/resumeManager',
    name: '简历库',
    component: Blank,
    redirect: '/recruit/resumeManager/resumeManager',
    children: [{
      path: 'resumeManager',
      name: '简历库',
      hide: false,
      component: ResumeManager
    }]
  }, {
    path: '/recruit/interview',
    name: '面试管理',
    component: Blank,
    redirect: '/recruit/interview',
    children: [{
      path: 'interview',
      name: '面试管理',
      hide: false,
      component: Interview
    }]
  }, {
    path: '/recruit/Matriculated',
    name: '录用管理',
    component: Blank,
    redirect: '/recruit/matriculated/matriculated',
    children: [{
      path: 'matriculated',
      name: '录用管理',
      hide: false,
      component: Matriculated
    }]
  }]
}]
