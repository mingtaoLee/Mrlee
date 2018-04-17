## ISelectField组件使用说明

### props
参数 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | --- |
activeSift | 默认的被选表头 | Oebect  | - | {}
columns | 传入的表头 | Array | - | []

### Events
事件名称 | 说明 | 回调参数
---|--- | --- |
change | 选择内容改变时触发 | 目前选中的表头

### 使用示例
```html
<template>
    <i-select-field ref="createSiftPane" :columns="table.columns" @change="handleChange"></i-select-field>
</template>

<script>
export default{
  name:'Example',
  data() {
      table:{
        columns: [
          { prop: 'employeeCode', label: '员工编号', width: 200, align: 'center' },
          { prop: 'orgUnitName', label: '归属组织', width: 200 },
          { prop: 'costCenter', label: '成本中心', width: 140 }
        ]
      }
  },
  methods:{
    handleChange(val){
      console.log(val)
    }
  }
}

</script>
```
