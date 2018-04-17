/**
 * 一级菜单人事管理
 * 包括二级菜单人事管理、联保人管理、合同管理
 */

const Layout = () => import('components/common/layout/layout')
const Blank = () => import('components/common/layout/blank')

// const PchangeManagement = () => import('../pages/employee/pchange-management')
const PersCertification = () => import('../pages/employee/personal/pers-certification')
const PersChange = () => import('../pages/employee/personal/pers-change')
const PersChangerecord = () => import('../pages/employee/personal/pers-changerecord')
const PersDimission = () => import('../pages/employee/personal/pers-dimission')
const PersInforemind = () => import('../pages/employee/personal/pers-inforemind')
const PersInforemindEdit = () => import('../pages/employee/personal/pers-inforemind-edit')
const PersList = () => import('../pages/employee/personal/pers-list')
const PersRecord = () => import('../pages/employee/personal/pers-record')
const GuarantorInfo = () => import('../pages/employee/guarantor/guarantor-info')
const GuarantorPeerGrade = () => import('../pages/employee/guarantor/guarantor-peer-grade')
const GuarantorPeer = () => import('../pages/employee/guarantor/guarantor-peer')
const GuarantorPeerDetail = () => import('../pages/employee/guarantor/guarantor-peer/detail')
const ContractLedger = () => import('../pages/employee/contract/contract-ledger')
const ContractTemplate = () => import('../pages/employee/contract/contract-template')
const ContractTemplateEditor = () => import('../pages/employee/contract/contract-template-editor')
const ContractNew = () => import('../pages/employee/contract/contract-new')
const PersSecond = () => import('../pages/employee/personal/pers-second')
const persPartTime = () => import('../pages/employee/personal/pers_partTime')
const PersTemplateMaintain = () => import('../pages/employee/personal/pers-templateMaintain')
const PersCheckin = () => import('../pages/employee/personal/pers-checkin/index.vue')
const PersMulit = () => import('../pages/employee/personal/pers-multi-movement')
const PositionCategory = () => import('../pages/position/position-category')
const CategoryManagement = () => import('../pages/employee/personal/emp-category/category-management')

// const PersCheckin = () => import('../pages/employee/personal/pers-checkin')

export default [{
  path: '/employee',
  name: '人事管理',
  component: Layout,
  redirect: '/employee/employee',
  children: [{
    path: '/employee/employee',
    name: '人事管理',
    component: Blank,
    redirect: '/employee/employee/pers_change',
    children: [{
      path: 'pers_change',
      name: '员工异动管理',
      component: PersChange
    }, {
      path: 'pers_list',
      name: '花名册',
      component: PersList
    }, {
      path: 'pers_record/:userId',
      name: '履历表',
      component: PersRecord,
      hide: true,
      meta: { subPage: true }
    }, {
      path: 'pers_certification',
      name: '证明打印',
      component: PersCertification
    }, {
      path: 'pers_templateMaintain',
      name: '证明打印模板维护',
      component: PersTemplateMaintain
    }, {
      path: 'pers_changerecord',
      name: '异动记录查询',
      component: PersChangerecord
    }, {
      path: 'pers_dimission',
      name: '离职管理',
      component: PersDimission
    }, {
      path: 'pers_inforemind',
      name: '到期信息提醒',
      component: PersInforemind
    }, {
      path: 'pers_inforemind_edit',
      name: '到期信息提醒编辑',
      component: PersInforemindEdit,
      hide: true,
      meta: { subPage: true }
    }, {
      path: 'pers_second',
      name: '人员借调管理',
      component: PersSecond
    }, {
      path: 'pers_partTime',
      name: '兼职管理',
      component: persPartTime
    }, {
      path: '/employee/employee/emp_category',
      name: '品类管理',
      component: Blank,
      children: [{
        path: 'position_category',
        name: '品类设置',
        component: PositionCategory
      }, {
        path: 'category_management',
        name: '品类管理',
        component: CategoryManagement
      }]
    }
    ]
  }, {
    path: '/employee/guarantor',
    name: '联保人管理',
    component: Blank,
    redirect: '/employee/guarantor/guarantor_info',
    children: [{
      path: 'guarantor_info',
      name: '联保人信息管理',
      component: GuarantorInfo
    }, {
      path: 'guarantor_peer_grade',
      name: '联保人问卷管理', // 联保人互评管理
      component: GuarantorPeerGrade
    }, {
      path: 'guarantor_peer',
      name: '联保人互评管理', // 联保人互评管理
      component: GuarantorPeer
    }, {
      path: 'guarantor_peer_detail/:id',
      name: '联保人互评管理详情', // 联保人互评管理详情
      component: GuarantorPeerDetail,
      hide: true
    }]
  }, {
    path: '/employee/contract',
    name: '合同管理',
    component: Blank,
    redirect: '/employee/contract/contract_template',
    children: [{
      path: 'contract_template',
      name: '合同模板',
      component: ContractTemplate
    }, {
      path: 'contract_template-editor',
      name: '合同模板',
      component: ContractTemplateEditor,
      hide: true,
      meta: { subPage: true }
    }, {
      path: 'contract_new',
      name: '合同新签',
      component: ContractNew
    }, {
      path: 'contract_ledger',
      name: '合同台账',
      component: ContractLedger
    }]
  }]
}, {
  path: '/employee/employee/pers_checkin',
  name: '人员登记',
  component: PersCheckin,
  hidden: true
}, {
  path: '/employee/employee/pers_multi_movement',
  name: '批量调动',
  component: PersMulit,
  hidden: true
}]
