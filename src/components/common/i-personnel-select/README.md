## iPersonnelSelect(人员选择)组件使用说明

### Attributes

参数 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | --- |
title | 人员选择框标题 | String | - | 人员选择
isShow.sync | 是否显示选择弹框 | Boolean | - | false
showStatus | 是否显示员工状态 | Boolean | - | false
modal | 是否有遮罩层 | Boolean | - | true
multiple | 是否多选 | Boolean | - | true
treeDataKey | 左边树形型栏类型 | String | - | org
defaultExpandedKeys | 默认展开节点id,按第一个数据进行加载人员数据 | Array | - |
defaultSelectedPersonnel | 默认选择人员 | Array | - | -
maxNum | 点击搜索人员显示最大值 | Number | - | 50
limit | 限制选中人数 | Number | - | -
filterType | 人员查询过滤类型, 与后端查询参数配合| String | all(全部人员)/outWork（离职人员）/surety（合伙人） | -
hasGrant | 是否有权限控制 | Boolean | - | true
### Events

事件名称 | 说明 | 回调参数
---|--- | --- |
confirm | 确认选择时触发 | 目前选中的人员数组
cancel | 取消选择时触发 | -

### Methods
方法名 | 说明 | 参数
--- | --- | ---
resetData | 重置人员选择控件已选值 | -
### 使用示例
```vue
<template>
  <div>
    <el-input v-model="personnels" icon="menu" :on-icon-click="handleIconClick"></el-input>
    <i-personnel-select :isShow.sync="isShow" :multiple="false" @confirm="handleConfirm"></i-personnel-select>
  </div>
</template>
<script>
  import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'

  export default {
    name: 'iPersonnelSelect',
    data () {
      return {
        isShow: false,
        personnels: ''
      }
    },
    components: {
      iPersonnelSelect
    },
    methods: {
      handleConfirm (selected) {
        this.personnels = selected.map(item => { item.employeeName }).toString()
      },
      handleIconClick () {
        this.isShow = !this.isShow
      }
    }
  }
</script>

```
