## iProcessFlow(业务流程)组件使用说明


### 注意点

330后，旧流程增加自动计算节点处理人功能。

前端通过给`model`绑定的数据添加一个侦听器实现。具体实现逻辑参考：（可跳过）
 - 根据`api/workflow/base/informaton`接口返回的`jurisdictionData`(包含`wfRelevance`是需要侦听的值)，调用`this.storageNeedWatchKeys`生成需侦听数据map`this.needWatchKeys`。
 - 侦听数据`model`变化时根据`this.needWatchKeys`包含的属性是否变化控制触发`api/workflow/base/process-definitions/keys/employeeRegularProcess/nodes`接口。
- 流程操作，如提交时触发`submit`事件，组合`this.listParams`属性；根据`request`配置接口key和`this.listParams`发出对应请求。如`/workflow/base/submit`和`/workflow/base/save`

若需要增加自动计算节点处理人功能，具体使用方法：(参考`src/views/flow/pages/employee/employee-dimission.vue`)
- 配置`i-process-flow`组件绑定的`model`与表单组件绑定的来源于同一个数据。如`src/views/flow/pages/employee/employee-dimission.vue`中的`postParams`属性(`postParams`代指绑定的属性)
- `postParams`必须显式声明并初始化所有表单属性值

### 最近更新
 - 增加Events: beforeApprove


### Attributes

参数 | 说明 | 类型 | 必填
--- | --- | --- | --- |
processType | 流程Key | String | 路由里没有时必填
model | 参数表单 | Object | 双向绑定时必填
createName | 头部信息自定义 | String | 需要修改头部信息时填（内容为定义的字符串）
### Function

函数名称 | 说明 | 参数 | 内容 | 必填
---|--- | --- | --- | --- |
postFlow | 需要对表单内容作二次修改时定义 | 无 | return 参数表单 | 否

### Events
事件名 | 说明 | 参数
--- | --- | --- |
fillin | 需要对填充的表单内容做二次修改时调用 | (formData：表单数据, isFlowCenter：是否从流程中心发起)
submit | 提交时需要修改数据调用 | 无
jurConfig | 权限配置数据 | (showMap, disabledMap)
sponsor | 申请人id | (createId)
baseInfo | 流程头部信息 | (object)
beforeApprove | 表单验证通过后，审批弹窗前触发事件(适用于审批前添加交互控制) | (done: 显示审批弹窗方法)
### 注意事项

- 流程组件校验默认只校验流程权限返回的显示可编辑的表单项
  - 表单权限配置的key值需要与表单项的prop值相同，若存在不能相同的情况，需要在rules里对应项配置别名
  - 若需要校验显示但不可编辑的表单项，如要在rules里配置prop数组

### 使用示例
```vue
<template>
  <i-process-flow @fillin="fillIn" >
    <div slot="allFlow">
      <el-form :model="flowForm" :rules="rules">
        <el-form-item label="这里是一个流程的表单内容，并且绑定了一个对象" prop="input" v-if="showMap.obj">
          <el-input v-model="flowForm.input" :disabled="disabledMap.obj"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </i-process-flow>
</template>
<script>
  import IProcessFlow from 'components/common/i-process/flow'

  export default {

    data () {
      return {
        flowForm: {
          input: ''
        },
        rules: {
          VALIDATE_REQUIRED: ['input'], // 强制校验表单项prop值数组
          input: ['obj', { required: true,message: '该表单项不能为空', trigger: 'change' }],  // 'obj'为input项的别名
        }
      }
    },
    components: {
      IProcessFlow
    },
    methods: {
      postFlow () {
        this.flowForm.input -= 1
        return this.flowForm
      },
      fillIn () {
        this.flowForm.input += 1
      }
    }
  }
</script>

```


