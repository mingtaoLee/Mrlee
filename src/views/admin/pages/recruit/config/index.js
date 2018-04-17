// 招聘模块相关字典
// 招聘状态
export const ResumeStatus = [
  {
    label: '未面试',
    value: '00'
  },
  {
    label: '已邀约',
    value: '01'
  },
  {
    label: '不合规',
    value: '02'
  },
  {
    label: '面试中',
    value: '05'
  },
  {
    label: '面试失败',
    value: '08'
  },
  {
    label: '录用中',
    value: '10'
  },
  {
    label: '录用失败',
    value: '12'
  },
  {
    label: '已发送offer',
    value: '20'
  },
  {
    label: '背调不通过',
    value: '21'
  },
  {
    label: '已放弃',
    value: '22'
  },
  {
    label: '未报道',
    value: '23'
  },
  {
    label: '已报道',
    value: '24'
  },
  {
    label: '公司不合适',
    value: '30'
  },
  {
    label: '目前不求职',
    value: '31'
  }
]

// 简历来源
export const ResumeSource = [
  {
    label: '北深',
    value: '1'
  },
  {
    label: '线下',
    value: '2'
  }
]

// 查看简历／简历列表的页面来源
export const ResumePageSource = {
  TOTAL: 1,              // 简历库-全部简历
  COLLECTION: 2,         // 简历库-我的收藏
  RECOMMEND: 3,          // 简历库-推荐给我的简历
  CHANNEL: 4,            // 渠道招聘跟进
  DEMANDRELEASE: 5,      // 需求发布
  SELFDEMAND: 6,          // 自助端-招聘需求
  INTERINTERVIEW: 7,          // 面试管理
  DEMANDMANAGEER: 8          // 需求管理
}

// 标签类型
export const TagType = {
  PUBLIC: '1',     // 公共标签不可修改
  MYPUBLIC: '2',   // 公共标签，可以修改
  MY: '3'          // 私有标签，可以修改
}

// 面试管理的面试类型
export const InterviewType = [
  {
    label: '已筛选（已发面试通知）',
    value: '0'
  },
  {
    label: '初面',
    value: '1'
  },
  {
    label: '一轮复试',
    value: '2'
  },
  {
    label: '二轮复试',
    value: '3'
  },
  {
    label: '三轮复试',
    value: '4'
  },
  {
    label: '四轮复试',
    value: '5'
  },
  {
    label: '已结束',
    value: '9'
  }
]
// 面试管理的面试状态
export const InterviewState = [
  {
    label: '未面试',
    value: '00'
  },
  {
    label: '不合规',
    value: '02'
  },
  {
    label: '放弃面试',
    value: '03'
  },
  {
    label: '面试失约',
    value: '04'
  },
  {
    label: '面试中',
    value: '05'
  },
  {
    label: '面试不通过',
    value: '06'
  },
  {
    label: '面试通过',
    value: '07'
  }
]
// 合规检查
export const ComplianceState = [
  {
    label: '未检查',
    value: '0'
  }, {
    label: '通过',
    value: '1'
  }, {
    label: '不通过',
    value: '2'
  }
]
// 录用管理的入职结果
export const entryResultDict = [
  {
    label: '失约',
    value: '1'
  }, {
    label: '放弃',
    value: '2'
  }, {
    label: '已报到',
    value: '3'
  }
]
// 通知模板设置的模板类型
export const TemplateTypeDict = [
  {
    label: '录用通知书',
    value: '1'
  }, {
    label: '背调模板',
    value: '2'
  }, {
    label: '面试通知',
    value: '3'
  }
]
// 背调结果
export const BackGroundDict = [
  {
    label: '通过',
    value: '0'
  }, {
    label: '不通过',
    value: '1'
  }
]
