/**
 * v-focus
 * @desc 针对元素的自动聚焦指令（包括element-ui的input元素)
 * @example
 * ```vue
 * <el-input v-focus></el-input>
 * ```
 */
export default {
  inserted (el) {
    if (el.classList.contains('el-input-number') || el.classList.contains('el-input')) {
      el.getElementsByTagName('input')[0].focus()
    } else if (el.classList.contains('el-textarea')) {
      el.getElementsByTagName('textarea')[0].focus()
    } else {
      el.focus()
    }
  }
}
