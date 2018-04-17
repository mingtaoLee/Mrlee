<template>
  <section>
    <i-layout headerKey="workSystemFormMenuGet">
    <div slot="header">
      <i-form @reset="reset" @search="search" >
          <el-form-item v-for="(item, idx) in formList" :key="idx" :label="item.label">
            <el-input v-if="!item.select" v-model="listParams[item.model]" maxlength="100"></el-input>
          </el-form-item>
        </i-form>
      </div>

      <section  slot="section">
        <i-table  
        :table="table"
         @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table :data="tableScope.clone">
              <el-table-column type="index" align="center" label="序号"></el-table-column>
              <el-table-column 
              v-for="(col, idx) in table.columns" 
              :key="idx" 
              :prop="col.prop" 
              :label="col.label" 
              :min-width="col.minWidth"
              :align="col.align"
              :formatter="tableScope.formatter"
              ></el-table-column>

             <i-table-operator :table="tableScope"></i-table-operator>
            </el-table>
          </template>
        </i-table>
      </section>
    </i-layout>
    <section>

      <i-dialog title="部署流程" v-model="show.hasDeploy" width="30%" :toolbar="postToolbar" class="tmm">
        <el-form>
          <el-form-item label="上传部署文件">
            <el-upload 
            ref="updated"
            class="upload-demo"
            :action="`${$$.BASE_URL}/workflow/system/deploy`"
            name="name"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            multiple
            :on-exceed="handleExceed"
            :data="postParams"
            :show-file-list="false"
            :on-success="postSuccess"
            :on-error="postError"
            :before-upload="getFile"
            :auto-upload="false">
              <el-button type="primary" size="small">上传</el-button>
            </el-upload>
          </el-form-item>
          <el-checkbox v-model="postParams.inheritLastPower" true-label="Y" false-label="N" > 是否继承上一个版本的权限 </el-checkbox>
          <el-form-item label="描述信息">
            <el-input type="textarea" v-model="postParams.description" maxlength="100"></el-input>
          </el-form-item>
        </el-form>
      </i-dialog>

      <el-dialog :visible.sync="show.hasConfigure" width="80%" @close="resetNowFlowForm">
        <section class="all">
          <flow-draw class="draw" :processId="processId" @task-key="getConfigure"></flow-draw>
          <div class="tree">
            <div>当前配置项：</div>
            <p class="nowFlowPropertiesName" v-text="nowFlowPropertiesName"></p>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="基本配置" name="first">
                <el-form>
                  <el-form-item label="审批规则">
                    <el-input maxlength="100"></el-input>
                  </el-form-item>
                  <el-form-item label="是否可跳过">
                    <i-select v-model="baseParams.is" parameter="WHETHER_TYPE"></i-select>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="表单配置" name="second">
                <template v-if="nowFlowFormShow">
                  <el-select v-model="nowFlowFormType" placeholder="请选择">
                    <el-option
                      v-for="item in flowFormTypeData"
                      :key="item.pfFormMenuId"
                      :label="item.formMenuName"
                      :value="item.pfFormMenuId">
                    </el-option>
                  </el-select>
                  <el-button type="primary" @click="saveNowFlowFormType">确定选择</el-button>
                </template>
                <el-tree
                  v-if="!nowFlowFormShow"
                  :data="nowFlowFormTypeData"
                  :props="defaultProps"
                  accordion
                  node-key='id'
                  ref="tree"
                  :expand-on-click-node="false"
                  @node-click="treeClick"
                  :render-content="renderContent">
                </el-tree>
              </el-tab-pane>
            </el-tabs>
          </div>
        </section>
      </el-dialog>

    </section>
  </section>
</template>
<script>
import ILayout from 'components/common/i-layout'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import req from 'api/system/flow-managent'
import ITableOperator from 'components/common/i-table-operator'
import FlowDraw from 'components/common/i-process-flow/flow-draw'
// 引入自elemntt-ui中下拉树自定义组件树组件
import TreeRender from './tree-render'
export default {
  components: {
    ILayout,
    IDialog,
    ITableOperator,
    FlowDraw,
    TreeRender
  },
  data () {
    return {
      // 记录当前所要配置的流程activityId
      nowFlowActivityId: '',
      // 记录当前所要配置的流程名称
      nowFlowPropertiesName: '',
      // 记录配置->表单配置中下拉菜单中表单类型
      flowFormTypeData: '',
      // 记录配置->表单配置中选择的表单类型
      nowFlowFormType: '',
      // 记录配置->表单配置中选择的某类型表单的所有数据字段
      nowFlowFormData: '',
      // 控制配置->表单配置中下拉菜单和当前选择的类型的表单的显示和隐藏,
      // 默下拉菜单是显示，表单是隐藏的
      nowFlowFormShow: true,
      // 记录配置->表单配置中配置权限时下拉菜单选择的值
      nowJurisdiction: '',
      // 记录配置->表单配置选择的表单类型请求到的数据
      nowFlowFormTypeData: [
        {
          label: '一级 1',
          id: 1,
          JurisdictionValue: '1',
          children: [{
            id: 12,
            label: '二级 1-1',
            JurisdictionValue: '1',
            children: [{
              id: 13,
              JurisdictionValue: '1',
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          id: 2,
          JurisdictionValue: '',
          children: [{
            id: 22,
            JurisdictionValue: '',
            label: '二级 2-1',
            children: [{
              id: 23,
              JurisdictionValue: '',
              label: '三级 2-1-1'
            }]
          }, {
            id: 222,
            JurisdictionValue: '',
            label: '二级 2-2',
            children: [{
              id: 232,
              JurisdictionValue: '',
              label: '三级 2-2-1'
            }]
          }]
        }, {
          id: 3,
          JurisdictionValue: '',
          label: '一级 3',
          children: [{
            id: 32,
            JurisdictionValue: '',
            label: '二级 3-1',
            children: [{
              id: 33,
              JurisdictionValue: '',
              label: '三级 3-1-1'
            }]
          }, {
            id: 322,
            JurisdictionValue: '',
            label: '二级 3-2',
            children: [{
              id: 332,
              JurisdictionValue: '',
              label: '三级 3-2-1'
            }]
          }]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      activeName: 'first',
      show: {
        hasDeploy: false,
        hasConfigure: false
      },
      processId: 'empRenewContractProcess:4:302618',
      listParams: {
        formMenuName: '',
        formMenuUrl: ''
      },
      baseParams: {
        is: ''
      },
      formList: [
        {label: '表单名称', model: 'formMenuName'},
        {label: '表单URL', model: 'formMenuUrl'}
        // {label: '创建时间', model: 'item', time: true}
      ],
      postParams: {
        inheritLastPower: '',
        description: '',
        file: null
      },
      postToolbar: [{
        text: '取消',
        type: 'default',
        func: (done) => done()
      }, {
        text: '确定',
        type: 'primary',
        func: () => this.$refs.updated.submit()
      }],
      table: {
        columns: [
          {label: '表单名称', prop: 'formMenuName', minWidth: 200},
          {label: '表单URL', prop: 'formMenuUrl', minWidth: 200},
          {label: '创建人', prop: 'createBy', minWidth: 200},
          {label: '创建时间', prop: 'createDate', minWidth: 200, align: 'center', display: {date: 'default'}}
        ],
        data: null,
        showPagebar: true,
        search: null,
        info: null,
        total: 0,
        setting: {
          toolbar: [
            // {
            //   text: '发布',
            //   type: 'primary',
            //   func: () => this.showPublish()
            // },
            // {
            //   text: '配置',
            //   type: 'primary',
            //   func: () => this.showDraw()
            // },
            {
              text: '新增',
              type: 'primary',
              key: 'workSystemFormMenuPost',
              func: () => this.addForm()
            }
          ],
          operator: [{
            text: '修改',
            key: 'workSystemFormMenuPut',
            func: row => this.setTemplate(row)
          },
          // {
          //   text: '启用',
          //   func: this.startTemplate,
          //   show (row) {
          //     return {
          //       hidden: true
          //     }
          //   }
          // },
          // {
          //   text: '停用',
          //   func: this.stopTemplate
          // },
          {
            text: '删除',
            type: 'danger',
            key: 'workSystemFormMenuDelete',
            func: row => this.deleteRow(row)
          }
          ]
        }
      }
    }
  },
  mounted () {
    this.search()
    // this.getMenuList({pageIndex: 1, pageSize: 10})
    // 请求配置->表单配置数据
    // this.getFormTypeData()
  },
  methods: {

    // 新增表单块，打开新增对话框
    addForm () {
      this.$router.push('/system/flow_management/add_form')
    },

    getMenuList (listParams) {
      req('getMenuList', listParams)
      .then(data => {
        Object.assign(this.table, data)
        // this.table.data = data
      })
    },

    handleSizeChange (opts) {
      this.getMenuList(opts)
    },

    handleCurrentChange (opts) {
      this.getMenuList(opts)
    },

    getExampleList () {
    },

    reset () {
      Object.keys(this.listParams).map(key => { this.listParams[key] = '' })
    },

    search () {
      this.table.search = { ...this.listParams }
    },

    showPublish () {
      this.show.hasDeploy = true
    },

    showDraw () {
      this.show.hasConfigure = true
    },

    // 设置当前选择需要配置的流程的activityId和名称
    getConfigure (taskKey) {
      this.nowFlowActivityId = taskKey.nowFlowActivityId
      this.nowFlowPropertiesName = taskKey.nowFlowPropertiesName
      // 让右侧表单配置恢复默认显示
      this.nowFlowFormShow = true
    },

    // 获取配置-> 表单配置表单模板选择的数据
    getFormTypeData () {
      req('getMenuList')
      .then(res => {
        this.flowFormTypeData = this.handleFormTypeData(res)
      })
    },

    // 处理配置-> 表单配置表单模板选择的数据
    handleFormTypeData (data) {
      let formTypeData = []
      data.map(val => {
        formTypeData.push({pfFormMenuId: val.pfFormMenuId, formMenuName: val.formMenuName})
      })
      return formTypeData
    },

    // 保存表单类型选择，隐藏选择菜单，请求表单数据并且显示表单
    saveNowFlowFormType () {
      req('getWorkflowMenu', {pfFormMenuId: this.nowFlowFormType})
      .then(res => {
        this.nowFlowFormShow = false
      })
    },

    // 关闭配置dialog之后让dialog上的右侧表单配置恢复默认配置
    resetNowFlowForm () {
      this.nowFlowFormShow = true
    },

    // 自定义下拉树进行权限配置和展示
    renderContent (h, { node, data, store }) {
      let that = this
      return h(TreeRender, {
        props: {
          DATA: data, // 节点数据
          NODE: node, // 节点内容
          STORE: store // 完整树形内容
        },
        on: { // 绑定方法 接受自定义下拉树组件的$emit
          nowChooseValue: (value) => that.nowChooseValueChange(value), // 获取下拉菜单选择的值
          selectShowOrHidden: (value) => that.selectShowOrHiddenChange(value) // 下拉菜单显示或者隐藏的时候触发
        }
      })
    },

    // 行内删除
    deleteRow (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        req('deleteRow', {pfFormMenuId: row.pfFormMenuId})
        .then(() => {
          this.$message.success('删除成功')
          this.search()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 当权限树配置下拉菜单值发生变化时需要记录
    nowChooseValueChange (value) {
      this.$refs.tree.getCurrentNode().JurisdictionValue = value
    },

    // 下拉菜单显示或者隐藏的时候触发 返回true或者false
    selectShowOrHiddenChange (value) {
      return value
    },

    // 树节点被点击时
    treeClick (data, node, vueComponent) {
      // console.log(this.$refs.tree.getCurrentNode())
      // data.JurisdictionValue = this.nowJurisdiction
      // console.log(data)
      // console.log(node)
      // console.log(vueComponent)
    },

    // ...................
    http (data) {
      this.postParams.file = data.file
      this.postWorkflowDeploy(this.postParams)
    },

    postSuccess () {
      this.$message('上传成功')
    },

    getFile (file) {
      this.postParams.file = file
    },

    postError () {
      this.$message('上传失败')
    },

    setTemplate (row) {
      this.$router.push({
        path: '/system/flow_management/add_form',
        query: {
          id: row.pfFormMenuId
        }
      })
    },

    startTemplate (row) {},

    stopTemplate (row) {},

    deleteTemplate (row) {},

    deploy (row) {
      this.show.hasDeploy = true
    },

    postWorkflowDeploy (postParams) {
      req('postWorkflowDeploy', postParams)
      .then(res => {
        this.$messages('发布流程成功')
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.all {
  display: flex;
  width: 100%;
  .draw {
    flex-basis: 70%;
    overflow-x: scroll;
  };
  .tree {
    flex-basis: 30%;
    .nowFlowPropertiesName{
      text-indent: 2em;
      color: red;
      text-decoration: underline;
    }
  }
}
</style>
<style lang="scss">
.tmm {
  .el-dialog {
    width: 30% !important;
    top: 50% !important;
  }
}
</style>
    
