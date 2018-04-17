## iControlLayout组件使用说明
### 注意事项
- toolbar的格式必须为数组如
```
toolbar: [
          {
            text: '查询', // 按钮显示名
            type: 'primary',// 按钮显示类型 
            disabled: true, // 是否禁用按钮
            func: () => { 
              console.log(this.myComponent)
            }
          },
          {
            text: '搜索',
            type: 'primary',
            func: () => {
              console.log(this.myComponent)
            }
          }
        ],
```
### Attributes

参数 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | --- |
toolbar | 控制按钮组数据 | Array | - | -
trigger | 触发下拉的事件行为 | String | hover，click | click
btnCol | 按钮组显示列数 | Number | - | 3
layoutWidth | 布局宽度 | String | - | 100%
justifyContent | 按钮组布局方式, 同flex布局方式 | String | - | center
moreText | 更多的显示方式 | String | - | 更多
hideOnClick | 是否在点击菜单项后隐藏菜单 | Boolean | - | true
### Events

事件名称 | 说明 | 回调参数
---|--- | --- |
input | 选择内容改变时触发 | 目前选中的值
### 使用示例
```
<template>
  <i-control-layout :btnCol="4" :toolbar="buttonControl"></i-control-layout>
</template>
<script>
  import IControlLayout from 'components/common/i-control-layout/i-control-layout.vue'
  export default {
    name: '',
    data: function () {
      return {
        myComponent: 'i-control-layout',
        buttonControl: [
          {
            text: '查询',
            disabled: true,
            func: () => {
              console.log(this.myComponent)
            }
          },
          {
            text: '搜索',
            func: () => {
            }
          },
          {
            text: '查看',
            func: () => {
            }
          },
          {
            text: '删除',
            disabled: true,
            func: () => {
            }
          },
          {
            text: '删除',
            func: () => {
              console.log('1')
            }
          }
        ]
      }
    },
    created () {
    },
    components: {
      IControlLayout
    },
    methods: {}
  }
</script>


```
