## iSelectTree组件使用说明
### 注意事项
- 配置新的下拉树类型，需要在组件全局变量中参照org配置
### Attributes

参数 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | --- |
v-model | 所选节点id值,多选为以“,”分隔的字符串 | String | - | -
dataKey | 对应下拉树数据类型，如果需要使用其他类型值，需要在全局组件变量中添加对应key值 | String | org | org
nodeKey | 节点唯一性标识属性值，一般为id | String | - | -
props | 配置选项，具体看下表 | Object | - | {children：'children', label: 'name', disabled: 'disabled'}
rootId | 查询某个根节点的id选项 | String | - | -
lazy | 是否为懒加载 | Boolean | - | true
multiple | 是否为多选 | Boolean | - | false
check-strictly | 在显示复选框的情况下，是否严格的遵循父子不互相关联 | Boolean | - | false
check-same-level | 多选时，全加载模式下，是否限制只能选择同一层级节点 | Boolean | - | false
sizeAuto | 多选时，是否随选项多少而同步设置输入框大小 | Boolean | - | false
accordion | 是否每次只打开一个同级树节点展开 | Boolean | - | true
readonly | 是否只读 | Boolean | - | true
size | 输入框大小规格 | String |
/small/mini | small
treeWidth | 下拉树显示宽度 | Number | - | 同input宽度
treeMaxHeight | 下拉树最大显示高度 | Number | - | 180
treeMinHeight | 下拉树最小显示高度 | Number | - | 108
disabled | 下拉树禁用属性 | Boolean | - | false
render-content | 树节点的内容区的渲染 Function | Function(h, { node, data, store } | - | -
search | 是否显示搜索框 | Boolean | - | true
searchLabelKey | 懒加载时搜索显示字段 | String | - | -
hasGrant | 是否有权限控制 | Boolean | - | true
tooltipProps | 树节点各位置tooltip的字段名 | Object | - | { inputLabel: 'orgPathName', nodeLabel: 'orgUnitName', listLabel: 'orgPathName'}
### Events

事件名称 | 说明 | 回调参数
---|--- | --- |
change | 选择改变时触发 | 当前选中的节点
delete | 删除节点时触发 | 目前删除的节点数据
node-click | 节点点击时触发 | 共三个参数，依次为：该节点所对应的对象、节点对应的 Node、节点组件本身
### props
参数 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | --- |
label | 指定节点标签为节点对象的某个属性值 | string, function(data, node) | - | -
children | 指定子树为节点对象的某个属性值 | string, function(data, node) | - | -
disabled | 指定节点选择框是否禁用为节点对象的某个属性值 | boolean, function(data, node) | - | -
### tooltipProps
参数 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | --- |
inputLabel | 输入框tooltip显示属性值 | string | - | orgPathName
nodeLabel | 树节点tooltip显示属性值 | string | - | orgUnitName
listLabel | 搜索时tooltip显示属性值 | string | - | orgPathName
### 使用示例
```html
<template>
  <div>
    <el-form labelWidth="100px">
      <el-form-item label="树型选择器：">
        <i-select-tree
          :multiple="true"
          dataKey="org"
          nodeKey="orgUnitId"
          :defaultNode="defaultNode"
          :rootId="rootId"
          v-model="nodeValue"
          :lazy="true"
          @input="handleChange"
          :readonly="true"
          size="large"
          treeMaxHeight="180"
          :accordion="true"
        ></i-select-tree>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  /* eslint-disable */
  import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
  export default {
    name: 'demo',
    data: function () {
      return {
        defaultNode: [
          {
            "orgUnitId": "66178",
            "orgShortName": "组织简称",
            "orgTier": "组织层级",
            "hiberarchy": "维度",
            "parentOrgId": "父级组织id",
            "isParent": "是否为父节点"
          },
          {
            "orgUnitId": "55089",
            "orgShortName": "组织简称",
            "orgTier": "组织层级",
            "hiberarchy": "维度",
            "parentOrgId": "父级组织id",
            "isParent": "是否为父节点"
          }
        ],
        rootId: '',
        value: '',
        nodeValue: '',
        props: {
          children: 'children',
          label: 'orgShortName'
        }
      }
    },
    created () {
    },
    components: {
      ISelectTree,
    },
    methods: {
      handleChange (value) {
        console.log(value)
      }
    }
  }
</script>
<style lang="sass"></style>


```
