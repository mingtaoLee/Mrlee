## i-dialog组件使用说明
- toolbar 使用说明
```
toolbar =
  throttle: false, // 如果为true，func必须为promise，dialog内部会在你点击按钮时将loading置为true且在关闭弹窗时重置loading；如果弹窗没关闭，需要在func执行返回的promise的then与catch中还原loading为false
  text: '取消',
  type: 'text',
  loading: false, // 是否显示loading
  disabled: true, // 控制是否不可操作
  hide: true,     // 控制是否隐藏
  func: (done) => { // 关闭弹窗，必须执行done()
  }
]
```
### Attributes

参数 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | --- |
v-model | 弹窗显示控制 | Boolean | - | false
title | 弹窗标题 | String | - | -
destroyedWhenClose | 是否关闭弹窗时销毁组件 | - | Boolean | false
toolbar | 控制按钮组 | Array{Object} | -  | -
modal | 是否显示遮罩层 | Boolean | - | true
component | 弹窗内部显示组件 | [Function, Object] | - | -
size | 弹窗显示宽度 | String | mini/small/standard/large/huge | standard
customClass | 自定义样式 | Class | - | -
beforeClose | 关闭前的回调，会暂停 Dialog 的关闭 | function(done)，done 用于关闭 Dialog | - | -
close-on-click-modal | 是否可以通过点击 modal 关闭 Dialog | Boolean | - | true
close-on-press-escape | 是否可以通过按下 ESC 关闭 Dialog | Boolean | - | true
### Events

事件名称 | 说明 | 回调参数
---|--- | --- |
close | 关闭时触发 | —

### 使用试例
```html
<template>
  <div>
    <el-button type="primary" @click="openDialog">打开弹窗</el-button>
    <i-dialog
      v-model="isShow"
      title="温馨弹窗"
      size="standard"
      :toolbar="toolbar"
    >
      <div>
        这是个standard弹窗
      </div>
    </i-dialog>
  </div>
</template>
<script>
  import IDialog from 'components/common/i-dialog/i-dialog.vue'

  export default {
    name: 'i-form-instance',
    components: {
      IDialog
    },
    data () {
      return {
        isShow: false,
        toolbar: [{
          text: '确定',
          type: 'primary',
          func: (done) => {
            console.log('confirm')
            done()
          }
        }, {
          text: '取消',
          type: 'text',
          func: (done) => {
            console.log('cancel')
            done()
          }
        }]
      }
    },
    methods: {
      openDialog () {
        this.isShow = true
      }
    }
  }
</script>


```
