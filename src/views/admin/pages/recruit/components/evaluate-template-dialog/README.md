<div align="center">
  <h1>Evalulate-Template-Dialog</h1>
</div>

## `What???`
* * *
评估表模板对话框

## `Why???`
* * *
@英俊帅气的绩效兼招聘组组长——``罗国立``

## `How???`
* * *
<div align="center">
  <h3>参数列表</h3>
</div>

<div align="center">

|Name|Required|Type|Default|Description|
|:--:|:--:|:--:|:-----:|:----------|
|**`showMe`**|**`true`**|**`{Boolean}`**|**`false`**|**`对话框显示标志`**|
|**`templateItem`**|**`false`**|**`{Object}`**|**`[]`**|**`点击查看或修改行的数据`**|
|**`myType`**|**`true`**|**`{String}`**|**`'add'`**|**`对话框控制类型:`<br>`'add':新建`<br>`'modify':修改`<br>`其他为查看`**|

</div>

<div align="center">
  <h3>事件列表</h3>
</div>

<div align="center">

|Name|Parameters|Description|
|:--:|:-----:|:----------|
|**`getMyData`**|**`[]`**|**`点击对话框「确定」按钮将触发此事件，回调参数为对话框中表格的数据`**|

**注意:** myType为'add'时，需带上 v-if，详情请看代码示例👇👇👇

</div>

<div align="center">
  <h3>代码示例</h3>
</div>

```html
<template>
  <evaluate-list-template
    myType="add"
    :showMe.sync="EvaluateListTemplateDialogFlag"
    :templateItems="[]"
    @getMyData="getTemplateDialogData">
  </evaluate-list-template>

  <el-button @click="toggle">
    toggle
  </el-button>
</template>

<script>
import EvaluateListTemplate from '../../components/evaluate-template-dialog'

export default {
  components: {
    EvaluateListTemplate
  },

  data () {
    return {
      EvaluateListTemplateDialogFlag: false,
      EvaluateListTemplateType: 'add'
    }
  },

  methods: {
    toggle () {
      this.EvaluateListTemplateDialogFlag = true
    },

    getTemplateDialogData (data) {
      console.log(data)
    }
  }
}
</script>
```
