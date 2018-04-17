## iSelectArea组件使用说明
### 注意事项
- id用于回写时候绑定的值，一般不再改变，如需改变则需和之前赋值的不一样的值

### Attributes

参数 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | ---
v-model | 对应id或者ids的值(看是否多选) | String/Array | - | -
type | 区域选择类型| String | yonghui | administrativeRegion
disabled | 是否禁用| Boolean | — | false
tooltip | 是否启用tooltip| Boolean | — | true
placeholder | 占位字符 | Number | — | 请选择区域
searchholder| 搜索框占位字符 | Number | — | 搜索片区
panelWidth | 面板宽度 | Number | — | 476
panelAmount | 面板总数 | Number | — | 3
optionWidth | 区域占位的宽度 | Number | — | 60
option | 对应查询参数 | Object | - | {id: 'areaId', parentId: 'parentAreaId',name:'areaName'}
multiple | 是否多选 | Boolean | - | false
search | 是否显示搜索框 | Boolean | - | false
returnNode | 是否返回整个节点数据 | Boolean | - | false

### Events

事件名称 | 说明 | 回调参数
---|--- | --- |
change | 选择内容改变时触发 | 目前选中的areaId值

### 使用示例
```vue
<template>
  <div>
    <i-select-area
     v-model="ids"
     @change="change"
     type="yonghui"
     search
     multiple
    ></i-select-area>
  </div>
</template>
<script>
  import ISelectArea from 'components/common/i-select-area'

  export default {
    name: 'Demo',
    components: {
      ISelectArea
    }
    data () {
      return {
        id: '123321123'
      }
    },
    methods:{
      change(val){
        console.log(val)
      }
    }
  }
</script>

```
