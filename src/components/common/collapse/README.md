## YhCl及YhClItem组件使用说明
- yh-cl为yh-cl-item父组件，配合使用

### Attributes
##### yh-cl
参数 | 说明 | 类型 | 默认值
--- | --- | --- | --- |
click-free | 自由点击，各自面板自由关闭，默认点击面板其余均关闭 | Boolean | false
mounted-type | 组件安装后状态，normal为展开第一个，其余关闭，target为新进来的打开，all则全打开 | String | normal

##### yh-cl-item
参数 | 说明 | 类型 | 默认值
--- | --- | --- | --- |
title | 折叠版标题 | String |-
index | 序列，必填项 | String |-
line-padding | padding | Number | 10
line-margin | margin | Number | 10
line-color | color | String | #f2f2f2
line-border | border | Number | 1

### Methods
##### yh-cl
方法名 | 说明 | 参数
--- | --- | --- |
reset | 重置面板状态，重置为第一个打开，其余关闭 | -
openAll | 重置面板状态，重置为全部打开 | -


### 使用试例
```html
<template>
  <div class="wrap">
    <el-button @click="reset">reset</el-button>
    <el-button @click="openAll">openAll</el-button>
    <yh-cl ref="collapse" click-free mounted-type="open">
      <yh-cl-item title="基本信息1" index="0">
        <div>展示内容1</div>
      </yh-cl-item>
      <yh-cl-item title="基本信息2" index="1">
        <div>展示内容2</div>
      </yh-cl-item>
    </yh-cl>
  </div>
</template>

<script>
export default{
  name:'example',
  methods:{
    reset(){
      this.$refs.collapse.reset()
    }
    openAll(){
      this.$refs.collapse.openAll()
    }
  }
}
</script>
```
