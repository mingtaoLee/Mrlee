// import default from './employee';

/**
 * 一级菜单组织管理
 * 包括二级菜单组织管理、职位管理、编制管理
 */
const Layout = () => import('components/common/layout/layout')
const Blank = () => import('components/common/layout/blank')

// 二级菜单组织管理
const Setting = () => import(/* webpackChunkName: 'org-setting' */ '../pages/org/setting')
const Lib = () => import(/* webpackChunkName: 'org-standard-lib' */ '../pages/org/lib')
const Combinestore = () => import(/* webpackChunkName: 'combine-store' */ '../pages/org/combinestore')
const orgMap = () => import(/* webpackChunkName: 'org-map' */ '../pages/org/org-map')
const History = () => import(/* webpackChunkName: 'org-history' */ '../pages/org/history')
const DepealList = () => import('../pages/org/org-depeal-list.vue')

// 二级菜单职位管理
const Occupation = () => import('../pages/position/occupation')
const StandardOc = () => import('../pages/position/standard-oc')
const PositionPost = () => import('../pages/position/position-post')
const PositionJob = () => import('../pages/position/position-job')
const PositionCategory = () => import('../pages/position/position-category')
const PositionMap = () => import('../pages/position/position-map')
const StandardPositionMap = () => import('../pages/position/standard-position-map')
// 二级菜单编制管理
const MaintainHome = () => import('../pages/compile/maintain')
const Demo = () => import('../pages/demo')

// 三级菜单编制规则
const PositonRules = () => import('../pages/compile/rules/position-rules')
const ShopRules = () => import('../pages/compile/rules/shop-rules')

var basic = [{
  path: '/org',
  name: '组织管理',
  component: Layout,
  redirect: '/org/org',
  children: [{
    path: '/org/org',
    name: '组织管理',
    component: Blank,
    redirect: '/org/org/setting',
    children: [{
      path: 'setting',
      name: '组织维护',
      component: Setting
    }, {
      path: 'lib',
      name: '标准组织库',
      component: Lib
    }, {
      path: 'combinestore',
      name: '合并小店管理',
      component: Combinestore
    }, {
      path: 'org_map',
      name: '组织架构图',
      component: orgMap
    }, {
      path: 'history',
      name: '历史组织架构',
      component: History
    }, {
      path: 'depeal_list',
      name: '批量撤销',
      hide: true,
      meta: {
        subPage: true
      },
      component: DepealList
    }]
  }, {
    path: '/org/position',
    name: '职位管理',
    component: Blank,
    redirect: '/org/position/occupation',
    children: [ {
      path: 'occupation',
      name: '职群职种设置',
      component: Occupation
    }, {
      path: 'position_job',
      name: '职务设置',
      component: PositionJob
    }, {
      path: 'standard_oc',
      name: '标准职位设置',
      component: StandardOc
    }, {
      path: 'position_post',
      name: '职位设置',
      component: PositionPost
    }, {
      path: 'position_category',
      name: '品类设置',
      component: PositionCategory
    }, {
      path: 'position_map',
      name: '职位图谱',
      component: PositionMap
    }, {
      path: 'standard_position_map',
      name: '标准职位图谱',
      component: StandardPositionMap
    }]
  }, {
    path: '/org/compile',
    name: '编制管理',
    component: Blank,
    children: [ {
      path: '/org/compile/rules',
      name: '编制规则',
      component: Blank,
      hideIcon: true,
      children: [
        {
          path: 'position_rules',
          name: '职务编制规则',
          component: PositonRules
        }, {
          path: 'shop_rules',
          name: '小店编制规则',
          component: ShopRules
        }
      ]
    },
    {
      path: 'maintain',
      name: '编制维护',
      component: MaintainHome
    },
    {
      path: 'demo',
      name: 'demo',
      component: Demo
    }
    ]
  }]
}]

export default basic
