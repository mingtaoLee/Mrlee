/**
 * 一级菜单人事管理
 * 包括二级菜单人事管理、联保人管理、合同管理
 */

const Layout = () => import('components/common/layout/layout')
const Blank = () => import('components/common/layout/blank')

const Course = () => import('../pages/staff-development/qualification/course') // 学习课程库
const AbilityManagement = () => import('../pages/staff-development/qualification/ability') // 能力库
const DevelopmentTube = () => import('../pages/staff-development/qualification/development-tube') // 发展通道
const DevelopmentMapping = () => import('../pages/staff-development/qualification/development-mapping') // 发展图谱
const StudyMap = () => import('../pages/staff-development/qualification/study-map') // 学习地图

const CoachManagement = () => import('../pages/staff-development/development/coach-management') // 教练库管理
const CoachStaffManagement = () => import('../pages/staff-development/development/coach-staff-management') // 教练库人员管理
const StaffDevelopmentTemplate = () => import('../pages/staff-development/development/staff-development-template') // 员工发展计划模板
const StaffDevelopmentManagement = () => import('../pages/staff-development/development/staff-development-management') // 员工发展计划管理

export default [{
  path: '/staff_development',
  name: '员工发展',
  component: Layout,
  redirect: '/staff_development/qualification',
  children: [{
    path: '/staff_development/qualification',
    name: '任职资格',
    component: Blank,
    redirect: '/staff_development/qualification/course',
    children: [{
      path: 'course',
      name: '学习课程库',
      component: Course
    }, {
      path: 'ability_management',
      name: '能力库管理',
      component: AbilityManagement
    }, {
      path: 'development_tube',
      name: '职业发展通道管理',
      component: DevelopmentTube
    }, {
      path: 'development_mapping',
      name: '职业发展图谱查看',
      component: DevelopmentMapping
    }, {
      path: 'study_map',
      name: '学习地图',
      component: StudyMap
    }
    ]
  }, {
    path: '/staff_development/development',
    name: '员工发展',
    component: Blank,
    redirect: '/staff_development/development/coach_management',
    children: [{
      path: 'coach_management',
      name: '教练库管理',
      component: CoachManagement
    }, {
      path: 'coach_staff_management',
      name: '教练库人员管理',
      component: CoachStaffManagement
    }, {
      path: 'staff_management_template',
      name: '员工发展计划模板',
      component: StaffDevelopmentTemplate
    }, {
      path: 'staff_development_management',
      name: '员工发展计划管理',
      component: StaffDevelopmentManagement
    }
    ]
  }]
}]
