<template>
<section>
  <div class="form-card card">
    <i-form @reset="reset" @search="search" >
        <el-form-item v-for="(item, idx) in formList" :key="idx" :label="item.label">
          <el-input v-if="!item.select" v-model="listParams[item.model]" maxlength="100"></el-input>
          <i-select v-else v-model="listParams"></i-select>
        </el-form-item>
      </i-form>
    </div>

  <i-layout>
    <section  slot="section">
  <i-table  :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column v-for="(col, idx) in table.columns" :key="idx" :prop="col.prop" :label="col.label" :min-width="col.minWidth"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <i-table-operator
              :table="tableScope"
              :row="scope.row"
            />
          </template>
        </el-table-column>
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
          <el-input type="textarea" v-model="postParams.description" maxlength="100">

          </el-input>
        </el-form-item>
      </el-form>
    </i-dialog>
    <el-dialog :visible.sync="show.hasConfigure" width="80%">
        <section class="all">
          <flow-draw class="draw" :processId="processId" @task-key="getConfigure"></flow-draw>
          <div class="tree">
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
                <el-tree></el-tree>
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
export default {
  components: {
    ILayout,
    IDialog,
    ITableOperator,
    FlowDraw
  },
  data () {
    return {
      activeName: 'first',
      show: {
        hasDeploy: false,
        hasConfigure: false
      },
      processId: 'empRenewContractProcess:4:302618',
      listParams: {},
      baseParams: {
        is: ''
      },
      formList: [
        {label: '模板名称', model: 'item'},
        {label: '模板Key', model: 'item'},
        {label: '模板状态', model: 'item', select: true}
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
          {label: '模板ID', prop: 'item', minWidth: 200},
          {label: '模板名称', prop: 'item', minWidth: 200},
          {label: '模板Key', prop: 'item', minWidth: 200},
          {label: '发布人', prop: 'item', minWidth: 200},
          {label: '创建时间', prop: 'item', minWidth: 200},
          {label: '状态', prop: 'item', minWidth: 200}
        ],
        data: null,
        showPagebar: true,
        search: null,
        info: null,
        total: 0,
        setting: {
          toolbar: [{
            text: '发布',
            type: 'primary',
            func: () => this.showPublish()
          }, {
            text: '配置',
            type: 'primary',
            func: () => this.showDraw()
          }],
          operator: [{
            text: '配置',
            func: this.setTemplate
          }, {
            text: '启用',
            func: this.startTemplate,
            show (row) {
              return {
                hidden: true
              }
            }
          }, {
            text: '停用',
            func: this.stopTemplate
          }, {
            text: '删除',
            func: this.deleteTemplate
          }]
        }
      }
    }
  },
  methods: {
    handleSizeChange () {},
    handleCurrentChange () {},
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
    setTemplate (row) {},
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
    flex-basis: 80%;
    overflow-x: scroll;
  };
  .tree {
    flex-basis: 20%;
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
