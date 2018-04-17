/**
 * 一级菜单系统管理
 * 包括二级菜单用户管理、权限管理、字典管理
 */

const Layout = () => import('components/common/layout/layout')
const Blank = () => import('components/common/layout/blank')

// const PchangeManagement = () => import('../pages/employee/pchange-management')
const UserManagement = () => import('../pages/system/permission-management/user-management')
const PowerManagement = () => import('../pages/system/permission-management/power-management')
const DictManagement = () => import('../pages/system/dict-management/dict-management')
const MenuManagement = () => import('../pages/system/permission-management/menu-management')
// const EmployeePermission = () => import('../pages/system/permission-management/employee-permission')
const RoleManagement = () => import('../pages/system/permission-management/role-management')
const CustomersRoleManagement = () => import('../pages/system/permission-management/customers-role-management')
const BatchSetUser = () => import('../pages/system/permission-management/role-management/batch-set-user')
const UserAcount = () => import('../pages/system/user-acount')
// const FlowManagement = () => import('../pages/system/flow-management')
// const Person = () => import('../pages/system/permission-management/person')
const NewPermission = () => import('../pages/system/permission-management/new-permission')

// 二级菜单调度管理
const TaskManagement = () => import('../pages/system/dispatch-management/task-management')
const TriggerManagement = () => import('../pages/system/dispatch-management/trigger-management')
const CheckTaskHistory = () => import('../pages/system/dispatch-management/check-task-history')
// const TemplateManagement = () => import('../pages/system/flow-management/template-management')

// 流程管理
const TemplateManagement = () => import('../pages/system/flow-management/template-management')
const TemplateConfig = () => import('../pages/system/flow-management/template-config')
const FormManagement = () => import('../pages/system/flow-management/form-management')
const AddForm = () => import('../pages/system/flow-management/add-form')
const dimensionManagement = () => import('../pages/system/flow-management/dimension-management')
const principalManagement = () => import('../pages/system/flow-management/principal-management')

const principalDebugger = () => import('../pages/system/flow-management/principal-debugger')

// 人事范围管理
const EmployeeScopeManagement = () => import('../pages/system/employee-scope-management')
// 用户管理
// const CreateUser = () => import('../pages/system/user-management/create-user')
// 修改用户，新增用户公用组件
const EditUser = () => import('../pages/system/permission-management/user-management/edit-user')
// 参数管理
const ParamsManagement = () => import('../pages/system/params-management')
// 信息集管理
const InfoManagement = () => import('../pages/system/info-management')
// 字段管理
const FieldManagement = () => import('../pages/system/info-management/field-management')
export default [{
  path: '/system',
  name: '系统管理',
  component: Layout,
  redirect: '/system/dict_management',
  children: [{
    path: '/system/permission',
    name: '权限管理',
    component: Blank,
    redirect: '/system/permission/menu_management',
    children: [{
      path: 'menu_management',
      name: '菜单管理',
      component: MenuManagement
    },
    // {
    //   path: 'employee_permission',
    //   name: '员工管理',
    //   component: EmployeePermission
    // },
    {
      path: 'user_management',
      name: '用户管理',
      component: UserManagement
    }, {
      path: 'role_management',
      name: '角色管理',
      component: RoleManagement
    }, {
      path: 'power_management',
      name: '用户配置',
      component: PowerManagement,
      hide: true,
      meta: { subPage: true }
    }, {
      path: 'customers_role_management',
      name: '角色赋权',
      component: CustomersRoleManagement,
      hide: true,
      meta: { subPage: true }
    }, {
      path: 'batch_set_user/:roleId',
      name: '批量设置用户',
      component: BatchSetUser,
      hide: true,
      meta: { subPage: true }
    }, {
      path: 'user_acount',
      name: '绑定员工账号',
      component: UserAcount
    }, {
      path: 'create_user',
      name: '新增用户',
      // component: CreateUser,
      component: EditUser,
      hide: true,
      meta: { subPage: true }
    }, {
      path: 'edit_user',
      name: '修改用户',
      component: EditUser,
      hide: true,
      meta: { subPage: true }
    },
    // {
    //   path: 'person/:userId/:edit',
    //   name: '权限修改',
    //   component: Person,
    //   meta: { subPage: true },
    //   hide: true,
    // },
    {
      path: 'new_permission/:userId',
      name: '新增用户权限',
      component: NewPermission,
      hide: true,
      meta: { subPage: true }
    }]
  }, {
    path: '/system/flow_management',
    name: '流程管理',
    component: Blank,
    redirect: '/system/flow_management/template_management',
    children: [{
      path: 'template_management',
      name: '模板管理',
      component: TemplateManagement
    }, {
      path: 'template_config',
      name: '模板配置',
      hide: true,
      meta: { subPage: true },
      component: TemplateConfig
    }, {
      path: 'form_management',
      name: '表单管理',
      component: FormManagement
    }, {
      path: 'add_form',
      name: '新增表单',
      component: AddForm,
      hide: true,
      meta: { subPage: true }
    }, {
      path: 'dimension_management',
      name: '维度管理',
      component: dimensionManagement
    }, {
      path: 'principal-management',
      name: '主体管理',
      component: principalManagement
    }, {
      path: 'principal-debugger',
      name: '主体调试',
      component: principalDebugger
    }]
  }, {
    path: '/system/dispatch_management',
    name: '调度管理',
    redirect: '/system/dispatch_management/task_management',
    component: Blank,
    children: [{
      path: 'task_management',
      name: '任务管理',
      component: TaskManagement
    }, {
      path: 'trigger_management',
      name: '触发器管理',
      component: TriggerManagement
    }, {
      path: 'check_task_history',
      name: '查看任务历史',
      component: CheckTaskHistory,
      hide: true,
      meta: { subPage: true }
    }]
  }, {
    path: '/system/dict_management',
    name: '字典管理',
    component: DictManagement
  }, {
    path: '/system/params_management',
    name: '参数管理',
    component: ParamsManagement
  }, {
    path: '/system/info_management',
    name: '信息集管理',
    component: InfoManagement
  }, {
    path: '/system/field_management',
    name: '字段管理',
    component: FieldManagement,
    hide: true,
    meta: { subPage: true }
  }, {
    path: '/system/employee_scope_management',
    name: '人事范围管理',
    component: EmployeeScopeManagement
  }]
}]
