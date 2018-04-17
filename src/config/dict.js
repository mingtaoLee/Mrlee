export const sex = {
  0: '男',
  1: '女'
}
// 绩效模块相关字典
// 绩效方案状态
export const peformanceSchemeStatus = [
  {
    label: '无效',
    value: '0'
  },
  {
    label: '有效',
    value: '1'
  }
]
export const planManageStatusDict = [
  {
    label: '未启动',
    value: '00'
  },
  {
    label: '未生效',
    value: '02'
  },
  {
    label: '已生效',
    value: '03'
  },
  {
    label: '评估中',
    value: '08'
  },
  {
    label: '已结束',
    value: '09'
  }
]
export const periodDict = [
  {
    label: '一月份',
    value: '1'
  },
  {
    label: '二月份',
    value: '2'
  },
  {
    label: '三月份',
    value: '3'
  },
  {
    label: '第一季度',
    value: '4'
  },
  {
    label: '四月份',
    value: '5'
  },
  {
    label: '五月份',
    value: '6'
  },
  {
    label: '六月份',
    value: '7'
  },
  {
    label: '第二季度',
    value: '8'
  },
  {
    label: '上半年',
    value: '9'
  },
  {
    label: '七月份',
    value: '10'
  },
  {
    label: '八月份',
    value: '11'
  },
  {
    label: '九月份',
    value: '12'
  },
  {
    label: '第三季度',
    value: '13'
  },
  {
    label: '十月份',
    value: '14'
  },
  {
    label: '十一月份',
    value: '15'
  },
  {
    label: '十二月份',
    value: '16'
  },
  {
    label: '第四季度',
    value: '17'
  },
  {
    label: '下半年',
    value: '18'
  },
  {
    label: '一年',
    value: '19'
  }
]

export const periodStatusDict = [
  {
    label: '未启动',
    value: null
  },
  {
    label: '未启动',
    value: '0'
  },
  {
    label: '已启动',
    value: '1'
  },
  {
    label: '评估中',
    value: '2'
  },
  {
    label: '已结束',
    value: '3'
  },
  {
    label: '已结束',
    value: '4'
  },
  {
    label: '已结束',
    value: '5'
  },
  {
    label: '已结束',
    value: '6'
  }
]

export const indicatorCollectionStatusDict = [
  {
    label: '已驳回',
    value: '2'
  },
  {
    label: '未收集',
    value: '0'
  }
]

// 操作相关
export const operationName = {
  '0': '新建',
  '1': '修改',
  '2': '撤销',
  '3': '删除'
}

export const rankDict = [
  {
    label: 'S',
    value: 'S'
  },
  {
    label: 'A',
    value: 'A'
  },
  {
    label: 'B',
    value: 'B'
  },
  {
    label: 'C',
    value: 'C'
  }
]

export const planEmployeeStatusDict = [
  {
    label: '未启动',
    value: '00'
  },
  {
    label: '待制定',
    value: '01'
  },
  {
    label: '待制定',
    value: '011'
  },
  {
    label: '待审核',
    value: '02'
  },
  {
    label: '已生效',
    value: '03'
  },
  {
    label: '已生效',
    value: '04'
  },
  {
    label: '已生效',
    value: '041'
  },
  {
    label: '已生效',
    value: '05'
  },
  {
    label: '待自评',
    value: '06'
  },
  {
    label: '待复评',
    value: '07'
  },
  {
    label: '待处理',
    value: '071'
  },
  {
    label: '待确认',
    value: '08'
  },
  {
    label: '待确认',
    value: '081'
  },
  {
    label: '已结束',
    value: '09'
  }
]

export const planEmployeeStatusToDoDict = [
  {
    label: '启动',
    value: '00'
  },
  {
    label: '制定计划',
    value: '01'
  },
  {
    label: '审核计划',
    value: '02'
  },
  {
    label: '正在生效',
    value: '03'
  },
  {
    label: '绩效自评',
    value: '06'
  },
  {
    label: '点击复评',
    value: '07'
  },
  {
    label: '评分确认',
    value: '08'
  },
  {
    label: '查看计划',
    value: '09'
  }
]

export const planEmployeeStatusHistoryDict = [
  {
    label: '未启动',
    value: '00'
  },
  {
    label: '待制定',
    value: '01'
  },
  {
    label: '待审核',
    value: '02'
  },
  {
    label: '已生效',
    value: '03'
  },
  {
    label: '待自评',
    value: '06'
  },
  {
    label: '待复评',
    value: '07'
  },
  {
    label: '待确认',
    value: '08'
  },
  {
    label: '已结束',
    value: '09'
  }
]
export const planCheckStatus = [
  {
    label: '已驳回',
    value: '011'
  },
  {
    label: '未审核',
    value: '02'
  },
  {
    label: '已审核',
    value: '03'
  }
]
export const planEvaluationStatus = [
  {
    label: '未评估',
    value: '07'
  },
  {
    label: '已评估',
    value: '08'
  }
]

export const evaluationDirectionDict = [
  {
    label: '业绩',
    value: '1'
  },
  {
    label: '管理',
    value: '2'
  }
]
export const evaluationTypeDict = [
  {
    label: '评估打分',
    value: '1'
  },
  {
    label: '收集数据',
    value: '2'
  }
]
export const evaluationPersonTypeDict = [
  {
    label: '自评',
    value: '1'
  },
  {
    label: '复评',
    value: '2'
  }
]
export const evaluationMethodDict = [
  {
    label: '选择评估方法',
    value: '1'
  },
  {
    label: '输入评估方法',
    value: '2'
  }
]

export const indicatorTypedDict = [
  {
    label: '财务',
    value: '1'
  },
  {
    label: '客户',
    value: '2'
  },
  {
    label: '内部流程',
    value: '3'
  },
  {
    label: '学习能力',
    value: '4'
  },
  {
    label: '工作能力',
    value: '5'
  },
  {
    label: '工作态度',
    value: '6'
  },
  {
    label: '工作品质',
    value: '7'
  },
  {
    label: '经营指标',
    value: '8'
  },
  {
    label: '管理指标',
    value: '9'
  }
]
export const btnTextDict = {
  '-1': '生成计划',
  '0': '启动计划',
  '1': '开始评估',
  '2': '结束评估',
  '3': '计算结果',
  '4': '公布结果',
  '5': '生成档案'
}
export const frequencyTypeDict = [
  {value: '1', label: '月度考核'},
  {value: '2', label: '季度考核'},
  {value: '3', label: '半年考核'},
  {value: '4', label: '年度考核'}
]
export const monthdDict = [
  {
    label: '一月份',
    value: '1'
  },
  {
    label: '二月份',
    value: '2'
  },
  {
    label: '三月份',
    value: '3'
  },
  {
    label: '四月份',
    value: '5'
  },
  {
    label: '五月份',
    value: '6'
  },
  {
    label: '六月份',
    value: '7'
  },
  {
    label: '七月份',
    value: '10'
  },
  {
    label: '八月份',
    value: '11'
  },
  {
    label: '九月份',
    value: '12'
  },
  {
    label: '十月份',
    value: '14'
  },
  {
    label: '十一月份',
    value: '15'
  },
  {
    label: '十二月份',
    value: '16'
  }
]
export const quarterDict = [
  {
    label: '第一季度',
    value: '4'
  },
  {
    label: '第二季度',
    value: '8'
  },
  {
    label: '第三季度',
    value: '13'
  },
  {
    label: '第四季度',
    value: '17'
  }
]
export const halfYearDict = [
  {
    label: '上半年',
    value: '9'
  },
  {
    label: '下半年',
    value: '18'
  }
]
export const processStatusDict = [
  {
    label: '已启动',
    value: '01'
  },
  {
    label: '驳回计划',
    value: '011'
  },
  {
    label: '已提交计划',
    value: '02'
  },
  {
    label: '审核通过',
    value: '03'
  },
  {
    label: '开始评估',
    value: '04'
  },
  {
    label: '已驳回指标数据',
    value: '041'
  },
  {
    label: '已收集指标数据',
    value: '05'
  },
  {
    label: '已审批指标数据',
    value: '06'
  },
  {
    label: '已自评',
    value: '07'
  },
  {
    label: '评分申述',
    value: '071'
  },
  {
    label: '已复评',
    value: '08'
  }, {
    label: '已结束',
    value: '09'
  }
]

export const unitDict = [
  {
    label: '元',
    value: '1'
  },
  {
    label: '万元',
    value: '2'
  },
  {
    label: '亿元',
    value: '3'
  },
  {
    label: '天',
    value: '4'
  },
  {
    label: '小时',
    value: '5'
  },
  {
    label: '次',
    value: '6'
  }
]

// 搜索
export const statusDict = [
  {
    label: '有效',
    value: '1'
  },
  {
    label: '无效',
    value: '0'
  }
]
export const LevelTypeDict = [
  {
    label: '区间',
    value: '1'
  },
  {
    label: '比例',
    value: '2'
  },
  {
    label: '区间加比例',
    value: '3'
  }
]
export const TempStatusDict = {
  'NOT_START': '01',
  'STARTED': '02',
  'USING': '03',
  'STOP': '04'
}

export const planEvaluationStatusDict = [
  {
    label: '未处理申述',
    value: '071'
  },
  {
    label: '未评估',
    value: '07'
  },
  {
    label: '已评估',
    value: '08'
  },
  {
    label: '已驳回申诉',
    value: '081'
  }
]

export const PlanStatusDict = {
  'NOT_PUBLISH': '01',
  'USING': '02',
  'ENDED': '03'
}

export const jobProcessType = {
  '0': 'jobFamilyCreateProcess',
  '1': 'jobFamilyUpdateProcess',
  '2': 'jobFamilyRepealProcess',
  '4': 'jobFamilyBatchCreateProcess'
}

export const getOperationTypeByProcess = {
  jobClassCreateProcess: '0',
  jobClassUpdateProcess: '1',
  jobClassRepealProcess: '2',
  jobFamilyCreateProcess: '0',
  jobFamilyUpdateProcess: '1',
  jobFamilyRepealProcess: '2',
  standardJobCreateProcess: '0',
  standardJobUpdateProcess: '1',
  standardJobRepealProcess: '2',
  positionCreateProcess: '0',
  positionUpdateProcess: '1',
  positionRepealProcess: '2'
}

export const OrgType = {
  '1': '生态支撑平台',
  '2': '生态支撑单元',
  '3': '共享服务平台',
  '4': '共享服务单元',
  '5': '专业服务平台',
  '6': '专业服务单元',
  '7': '客户经营主体',
  '8': '客户经营单元'
}

export const scaReportType = {
  'normal': '01',
  'smallShop': '02',
  'newShop': '03'
}
// 招聘状态
export const evaluateStatus = [
  {
    label: '已发布',
    value: '0'
  },
  {
    label: '待发布',
    value: '1'
  },
  {
    label: '已取消',
    value: '2'
  }
]
// 员工招聘
export const evaluateTypes = [
  {
    label: '综合素质',
    value: '0'
  },
  {
    label: '岗位胜任能力',
    value: '1'
  }
]

