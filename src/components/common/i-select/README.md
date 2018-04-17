## iSelect组件使用说明
### 注意事项
- 后台返回数据格式默认为[{label: "", value: ""}]，如果不是需要配置props选项
### Attributes

参数 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | ---
v-model | value值 | String | — | -
dataKey | 对应下拉数据类型，如果需要使用其他类型值，需要在组件内添加对应地址map | String | - | dict
parameter | 对应查询参数 | String | — | -
placeholder | 输入提示 | String | - | 请选择
clearable | 是否可以清除 | Boolean | true
size | 输入框尺寸 | String | medium / small / mini | small
multiple | 多选 | Boolean | -| false
collapse-tags | 多选时候文字显示 | Boolean | - | true
async | 是否是异步, 如果指定异步类型为false，则会读取options选项 | Boolean | - | true
options | 下拉选项，在async为true时生效 | Array | - | -
props | 配置选项，可以配置label与value字段名 | Object | - | {value: 'value', label: 'label', hide: 'hide'}
hideKeys | 隐藏选项value值的集合 | Array | - | []
allowCreate | 是否允许用户创建新条目，需配合 filterable 使用 | Boolean | — | false
autoShow | 是否自动显示第一项 | Boolean | - | false
### Events

事件名称 | 说明 | 回调参数
---|--- | --- |
change | 选择内容改变时触发 | 目前选中的值
option-click | 选项点击事件触发 | option
### Methods
方法名 | 说明 | 参数
--- | --- | ---
setDisabled | 设置对应value值的选项是否禁用 | (value, isDisabled)
### 使用示例
```vue
<template>
  <div>
    <i-select v-model="value" parameter="dict" placeholder="请选择字典"></i-select>
  </div>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select.vue'

  export default {
    name: 'i-select-instance',
    data () {
      return {
        value: ''
      }
    },
    components: {
      ISelect
    }
  }
</script>

```
