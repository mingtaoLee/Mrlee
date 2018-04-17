// const AddOrg = () => import('../pages/org/org-add')
const AddOrg = () => import('../pages/org/org-create/index.vue')
// const MoveOrg = () => import('../pages/org/org-move')
const MoveOrg = () => import('../pages/org/org-move/index.vue')
// const SplitOrg = () => import('../pages/org/org-split')
const SplitOrg = () => import('../pages/org/orgs-split')
// const DepealOrg = () => import('../pages/org/org-depeal')
const DepealOrg = () => import('../pages/org/org-depeal/index.vue')
// const MergeOrg = () => import('../pages/org/org-merge')
const MergeOrg = () => import('../pages/org/org-merge/index.vue')
// const UpdateOrg = () => import('../pages/org/org-update')
const UpdateOrg = () => import('../pages/org/org-update/index.vue')
const AddListOrg = () => import('../pages/org/orgs-create/index.vue')
const SetLeaderOrg = () => import('../pages/org/org-set-leader')
export default [
  {
    path: 'organizationCreateFlowNew',
    name: '新增组织',
    hide: true,
    component: AddOrg
  },
  {
    path: 'organizationUpdateFlowNew',
    name: '更新组织',
    hide: true,
    component: UpdateOrg
  },
  {
    path: 'organizationRelevelFlowNew',
    name: '调级组织',
    hide: true,
    component: MoveOrg
  },
  {
    path: 'organizationSplitFlow',
    name: '拆分组织',
    component: SplitOrg
  },
  {
    path: 'organizationRepealFlow',
    name: '撤销组织',
    component: DepealOrg
  },
  {
    path: 'organizationMergeFlowNew',
    name: '合并组织',
    component: MergeOrg
  },
  {
    path: 'organizationPrincipleFlow',
    name: '设置更改负责人',
    component: SetLeaderOrg
  },
  {
    path: 'organizationsCreateFlowNew',
    name: '批量新增组织',
    component: AddListOrg
  }
]
