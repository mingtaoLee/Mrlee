import { proxy } from 'utils/index'

export class DynamicRules {
  constructor (opt) {
    proxy.call(this, opt)
  }

  initData () {
  }

  handlePercentChange (value, scope, formData, callback) {
    // 比例验证函数
    console.log('进来了')
    let validateDefault = (rule, value, callback) => {
      let totalIndex = 0
      formData.detail.forEach((val, index) => {
        if (val.isDefault === true) {
          totalIndex += 1
          console.log(totalIndex)
          if (totalIndex > 1) {
            callback(new Error('只能选择一个'))
          }
        }
      })

      callback()
    }
    this.pushRules(this.vm.defaultRule, {
      validator: validateDefault, trigger: 'change'
    })
    // 进行校验
    console.log(this.vm.$refs)
    for (let index in this.vm.$refs) {
      if (index.includes('isDefault')) {
        console.log(index)
        if (this.vm.$refs[index]) {
          this.vm.$refs[`${index}`].validate('change', (valid) => {
            if (valid) {
              callback(false)
            } else {
              callback(true)
            }
          })
        }
      }
    }
    this.vm.defaultRule.pop()
    // })
  }

  pushRules (rules, rule) {
    rules.push(rule)
  }
}
