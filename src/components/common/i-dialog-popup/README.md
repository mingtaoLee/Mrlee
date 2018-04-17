## i-dialog-popup组件使用说明
- toolbar 使用说明
```
toolbar = [
  text: '取消',
  type: 'text',
  disabled: true, // 控制是否不可操作
  hide: true,     // 控制是否隐藏
  func: (done) => { // 关闭弹窗，必须执行done()
  },
  text: '确认',
  type: 'primary',
  func: (done) => {
  }
]
```
### Attributes

参数 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | --- |
v-model | 弹窗显示控制 | Boolean | - | false
title | 弹窗标题 | String | - | -
toolbar | 控制按钮组 | Array{Object} | -  | -
append-to | 弹窗appendChild插入位置(具体dom,如#app或者.layout,该元素必须为relative定位) | String | - | -
size | 弹窗显示宽度(append-to下不可用) | String | small/standard/large | standard
### Events

事件名称 | 说明 | 回调参数
---|--- | --- |
close | 关闭时触发 | —

### 使用试例
```html
<template>
  <div>
    <el-button type="primary" @click="openDialog">打开弹窗</el-button>
    <i-dialog-popup
      v-model="isShow"
      title="popup弹窗"
      :toolbar="toolbar"
      :append-to=".app"
    >
      <div>
        这是个popup弹窗
      </div>
    </i-dialog-popup>
  </div>
</template>
<script>
  import IDialogPopup from 'components/common/i-dialog-popup'

  export default {
    components: {
      IDialogPopup
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
