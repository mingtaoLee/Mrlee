export const rules = {
  name: [{
    message: '不能超过128个字符',
    trigger: 'change',
    max: 128
  }, {
    required: true,
    message: '请输入方案名称',
    trigger: 'blur'
  }],

  standard: {
    required: true,
    message: '请输入方案标准',
    trigger: 'change'
  },

  schemeManager: {
    required: true,
    message: '请选择方案管理员',
    trigger: 'change'
  },

  org: {
    required: true,
    message: '请输入适用范围',
    trigger: 'change'
  },

  beginDate: {
    required: true,
    message: '请输入开始时间',
    trigger: 'change',
    type: 'date'
  },

  endDate: {
    required: true,
    message: '请输入结束时间',
    trigger: 'change',
    type: 'date'
  },

  isToday: {
    required: true,
    message: '请确认哪天',
    trigger: 'change'
  },

  evaluateTime: {
    required: true,
    message: '请输入评估时间',
    trigger: 'change',
    type: 'number'
  },

  adjustDay: [
    {
      required: true,
      message: '请输入调整日期数字',
      trigger: 'change',
      type: 'number'

    }, {
      message: '应大于0小于30',
      trigger: 'change',
      min: 0,
      type: 'number',
      max: 30
    }
  ],

  adjustTime: [
    {
      required: true,
      message: '请输入调整范围',
      trigger: 'change',
      type: 'number'
    }, {
      message: '应大于0小于10',
      trigger: 'change',
      min: 0,
      type: 'number',
      max: 10
    }
  ],

  description: [
    {
      required: true,
      message: '请输入描述',
      trigger: 'change'
    },
    {
      message: '不能超过128个字符',
      trigger: 'change'
    }
  ]
}
