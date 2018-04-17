
const OccupationSetting = () => import('../pages/position/occupation-setting')
const PositionJobSetting = () => import('../pages/position/position-job-setting')
const PositionCategorySetting = () => import('../pages/position/position-category-setting')
const StandardOcSetting = () => import('../pages/position/standard-oc-setting')
const PositionPostSetting = () => import('../pages/position/position-post-setting')
const NewBatchOccupationSetting = () => import('../pages/position/new-batch-occupation-setting')
// const PositionPostBatchSetting = () => import('../pages/position/position-post-batch-setting')

export default [
  {
    path: 'jobFamilyCreateProcess',
    name: '新建职群职种',
    hide: true,
    component: OccupationSetting
  },
  {
    path: 'jobFamilyUpdateProcess',
    name: '修改职群职种',
    hide: true,
    component: OccupationSetting
  },
  {
    path: 'jobFamilyRepealProcess',
    name: '撤销职群职种',
    hide: true,
    component: OccupationSetting
  },
  {
    path: 'jobFamilyBatchCreateProcess',
    name: '批量新建职群职种',
    hide: true,
    component: NewBatchOccupationSetting
  },
  {
    path: 'posTitleCreateProcess',
    name: '新增职务',
    hide: true,
    component: PositionJobSetting
  },
  {
    path: 'posTitleUpdateProcess',
    name: '修改职务',
    hide: true,
    component: PositionJobSetting
  },
  {
    path: 'posTitleRepealProcess',
    name: '撤销职务',
    hide: true,
    component: PositionJobSetting
  },
  {
    path: 'posCategoryCreateProcess',
    name: '新增品类',
    hide: true,
    component: PositionCategorySetting
  },
  {
    path: 'posCategoryUpdateProcess',
    name: '修改品类',
    hide: true,
    component: PositionCategorySetting
  },
  {
    path: 'posCategoryRepealProcess',
    name: '撤销品类',
    hide: true,
    component: PositionCategorySetting
  },
  {
    path: 'check_standard_oc',
    name: '查看标准职位',
    hide: true,
    component: StandardOcSetting
  },
  {
    path: 'standardJobCreateProcess',
    name: '新建标准职位',
    hide: true,
    component: StandardOcSetting
  },
  {
    path: 'standardJobUpdateProcess',
    name: '修改标准职位',
    hide: true,
    component: StandardOcSetting
  },
  {
    path: 'standardJobRepealProcess',
    name: '撤销标准职位',
    hide: true,
    component: StandardOcSetting
  },
  {
    path: 'positionCreateProcess',
    name: '新建职位',
    hide: true,
    component: PositionPostSetting
  },
  // {
  //   path: 'positionBatchCreateProcess',
  //   name: '批量新建职位',
  //   hide: true,
  //   component: PositionPostBatchSetting
  // },
  {
    path: 'positionUpdateProcess',
    name: '修改职位',
    hide: true,
    component: PositionPostSetting
  },
  {
    path: 'positionRepealProcess',
    name: '撤销职位',
    hide: true,
    component: PositionPostSetting
  }
]
