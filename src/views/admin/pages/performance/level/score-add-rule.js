import { proxy } from 'utils/index'

let maxScore
let validateMinNumber = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入分值'))
  }
  if (Number(value) === 0) {
    callback()
  }
  if (!Number(value)) {
    callback(new Error('请输入数字值'))
  } else if (Number(value) && Number(value) > 1000) {
    callback(new Error('输入请小于1000'))
  } else if (Number(value) && Number(value) < 0) {
    callback(new Error('请输入正数'))
  } else if (Number(value) && Number(value) >= maxScore) {
    callback(new Error('已超最大上限！！'))
  } else {
    callback()
  }
}

export class ScoreAddRule {
  constructor (opt) {
    proxy.call(this, opt)
  }

  initData () {
  }

  handleChange (value, scope) {
  }

  handleMinChange (value, scope, formData, callback) {
    // 推入校验信息
    // console.log(formData[scope.$inde])
    if (formData.detail[scope.$index + 1]) {
      // formData.detail[scope.$index + 1].maxScore = formData.detail[scope.$index].minScore - 1
      maxScore = scope.row.maxScore
      this.pushRules(this.vm.minScoreRule, {
        validator: validateMinNumber, trigger: 'min'
      })
      // 进行校验
      // this.vm.$nextTick(() => {
      this.vm.$refs[`minScore${scope.$index}`].validate('min', (valid) => {
        if (valid) {
          callback(false)
        } else {
          callback(true)
        }
      })
      this.vm.minScoreRule.pop()
      // })
    }
  }

  handleMaxChange (value, scope, formData, callback) {
    if (scope.$index) {
      this.pushRules(this.vm.maxScoreRule, {
        max: formData.detail[scope.$index - 1].minScore - 1,
        type: 'number',
        message: '已超最大上限',
        trigger: 'max'
      })
      // this.vm.$nextTick(() => {
      this.vm.$refs[`maxScore${scope.$index}`].validate('max', (valid) => {
        if (valid) {
          callback(false)
        } else {
          callback(true)
        }
      })
      this.vm.maxScoreRule.pop()
      // })
    }
  }

  handlePercentChange (value, scope, formData, callback) {
    // 比例验证函数
    let validatePercent = (rule, value, callback) => {
      let totalPercent = 0
      if (value === '') {
        callback(new Error('请输入比例值'))
      }
      if (Number(value) <= 0) {
        callback(new Error('请输入大于0的数'))
      }
      formData.detail.forEach((val, index) => {
        if (val.updateType !== 3) {
          if (!Number.isNaN(parseInt(val.percent))) {
            totalPercent += val.percent
          }
        }
      })
      if (totalPercent !== 100) {
        callback(new Error('比例总和必须等于100'))
      } else {
        callback()
      }
    }
    this.pushRules(this.vm.percentRule, {
      validator: validatePercent, trigger: 'percent'
    })
    // 进行校验
    // this.vm.$nextTick(() => {
    console.log(this.vm.$refs)
    for (let index in this.vm.$refs) {
      if (index.includes('percent')) {
        console.log(index)
        if (this.vm.$refs[index]) {
          this.vm.$refs[`${index}`].validate('percent', (valid) => {
            if (valid) {
              callback(false)
            } else {
              callback(true)
            }
          })
        }
      }
    }
    this.vm.percentRule.pop()
    // })
  }

  pushRules (rules, rule) {
    // if (rules.length === 1) {
    // rules.pop()
    rules.push(rule)
    // }
  }
}
