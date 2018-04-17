/**
 * Created by zhanzf on 2017-12-1.
 */
/**
 * @param value 传入的值
 * @param rule  进位规则
 * @param index 精度位数 可选参数
 */
class CarryRule {
  constructor (value, rule, index) {
    this.decimalValue = value.toString().split('.')[1]
    this.integerValue = value.toString().split('.')[0]
  }
   // 四舍五入
  '06' (index = 2) {
    if (!this.decimalValue) return Number(this.integerValue)
    index = index < 0 ? this.decimalValue.length - 1 : index
    if (!index) return this.decimalValue[index] >= 5 ? Number(this.integerValue) + 1 : Number(this.integerValue)
    this.decimalValue.length >= (index + 1) && (this.decimalValue = this.decimalValue[index] >= 5 ? Number(this.decimalValue.substr(0, index)) + 1 : Number(this.decimalValue.substr(0, index)))
    return Number(`${this.integerValue}.${this.decimalValue}`)
  }
    // 舍入到元
  '01' (index = 0) {
    return this['06'](index)
  }
    // 舍入到角
  '07' (index = 1) {
    return this['06'](index)
  }
    // 向下舍入
  '03' (index = 2) {
    if (!this.decimalValue) return Number(this.integerValue)
    index = index < 0 ? this.decimalValue.length - 1 : index
    this.decimalValue.length >= (index + 1) && (this.decimalValue = Number(this.decimalValue.substr(0, index)))
    return Number(`${this.integerValue}.${this.decimalValue}`)
  }
    // 向上舍入 问题：11.00011 这种情况？ 结果11.01
  '02' (index = 2) {
    if (!this.decimalValue) return Number(this.integerValue)
    index = index < 0 ? this.decimalValue.length - 1 : index
    if (!index) return Number(this.decimalValue.substring(index)) ? Number(this.integerValue) + 1 : Number(this.integerValue)
    this.decimalValue.length >= (index + 1) && (this.decimalValue = Number(this.decimalValue.substring(index)) ? Number(this.decimalValue.substr(0, index)) + 1 : Number(this.decimalValue.substr(0, index)))
    // 当出现9进10时
    if (String(this.decimalValue).length > index) return Number(this.integerValue) + 1
    return Number(`${this.integerValue}.${this.decimalValue}`)
  }
    // 见角进元 问题：11.011 这种情况？结果12
  '04' (index = 0) {
    return this['02'](index)
  }
    // 见分进角 问题：11.0011 这种情况？结果11.1
  '05' (index = 1) {
    return this['02'](index)
  }
}
export function carryRule (value, rule, index) {
  return new CarryRule(value)[rule](index)
}
