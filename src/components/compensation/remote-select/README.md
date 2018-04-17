## RemoteSelect组件使用说明
### 注意事项
- 后台返回数据格式默认为[{label: "", value: ""}]，如果不是需要配置props选项
### Attributes

参数 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | ---
v-model | value值 | String | — | -
dataKey | 对应数据类型，需要在全局配置中配置 | String | - | -
parameter | 对应查询参数 | String | — | -
multiple | 多选 | Boolean | - | false
disabled | 是否禁用 | Boolean | - | false
collapse-tags | 多选时候文字显示 | Boolean | - | true
props | 配置选项，可以配置label与value字段名 | Object | - | {value: 'value', label: 'label', hide: 'hide'}
displayKeys | 对属性props中的label显示字段的自定义，存在时props中的label将会被覆盖 | Array | - | -
extraParams | 额外接口请求参数 | Object | - | {}
defaultOptions | 默认选项,回显使用 | Array | - | -
placeholder | 提示语 | String | - | 请输入关键词
### Events

事件名称 | 说明 | 回调参数
---|--- | --- |
change | 选择内容改变时触发 | 目前选中的值
option-click | 选项点击事件触发 | option
### 使用示例
```vue
<template>
  <div>
    <remote-select v-model="value" dataKey="personnelGroup" :props="personnelProps"></remote-select>
  </div>
</template>
<script>
  import RemoteSelect from 'components/compensation/remote-select'

  export default {
    name: 'remoteSelect',
    data () {
      return {
        value: '',
        personnelProps: { value: 'personnelGroupCode', label: 'personnelGroupName'}
      }
    },
    components: {
      RemoteSelect
    }
  }
</script>

```
