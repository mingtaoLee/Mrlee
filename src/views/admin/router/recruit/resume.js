const TodoLayout = () => import('../../pages/performance/todo-list/todo-layout')
const ResumeView = () => import('../../pages/recruit/resume-view/index')
const ResumeDetail = () => import('../../pages/recruit/resume-detail/index')
const EnrollDetail = () => import('../../pages/recruit/enroll-detail/index')
const RequirementDetail = () => import('../../pages/recruit/requirement-detail/index')

export default [{
  path: '/recruit/resume',
  name: '简历',
  component: TodoLayout,
  redirect: '/recruit/resume/resumeView',
  children: [
    {
      path: 'resumeView',
      name: '简历列表',
      component: ResumeView
    },
    {
      path: 'resumeDetail',
      name: '简历详情',
      component: ResumeDetail
    },
    {
      path: 'enrollDetail',
      name: '录用详情',
      component: EnrollDetail
    },
    {
      path: 'requirementDetail',
      name: '需求详情',
      component: RequirementDetail
    }
  ]
}]
