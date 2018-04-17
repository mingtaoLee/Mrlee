<template>
  <div class="grape-complained">
    <i-layout>
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item label="员工姓名">
            <el-input v-model.trim="param.staffName"></el-input>
          </el-form-item>
          <el-form-item label="员工工号">
            <el-input v-model.trim="param.staffCode"></el-input>
          </el-form-item>
          <el-form-item label="员工部门">
            <i-select-tree
              :multiple="false"
              dataKey="org"
              nodeKey="orgUnitId"
              :rootId="rootId"
              v-model="param.orgId"
              :lazy="true"
              @input="handleNodeClick"
              :readonly="true"
              size="small"
              treeMaxHeight="180"
              :accordion="true"
              sizeAuto
              :selectedNode.sync="node"
              clearable
              placeholder=""
            ></i-select-tree>
          </el-form-item>
        </i-form>
      </div>
      <div slot="section">
        <i-dialog
          v-model="dialogFormVisible"
          :title="`查看评分申诉`"
          width="800px"
          :toolbar="dialogToolbar"
          destroyedWhenClose
        >
          <complained-dialog
          :evaluationId="evaluationId"
          :type="true"
          ref="complainedDialog"
          :extraObj="extraObj"
          ></complained-dialog>
        </i-dialog>
        <div class="table">
          <i-table :table="table" @pageSizeChange="handleSizeChange"
                   @pageIndexChange="handleCurrentChange">
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="table.data"
                @selection-change="handleSelectionChange">
                <el-table-column prop="staffName" label="姓名" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="staffCode" label="工号" width="120" align="center" sortable>
                </el-table-column>
                <el-table-column prop="staffPosition" label="职位" width="120" align="left" sortable>
                </el-table-column>
                <el-table-column prop="staffOrgName" label="部门" width="120" align="left" sortable>
                </el-table-column>
                <el-table-column prop="leaderName" label="评估人" align="left" width="120" sortable>
                </el-table-column>
                <el-table-column prop="leaderCode" label="评估人工号" align="center" width="160" sortable>
                </el-table-column>
                <el-table-column prop="leaderPosition" label="评估人职位" align="left" width="160" sortable>
                </el-table-column>
                <el-table-column prop="leaderOrgName" label="评估人部门" align="left" width="160" sortable>
                </el-table-column>
                <el-table-column 
                prop="processStatus" 
                label="申诉结果" 
                align="center" 
                width="140" 
                sortable
                :formatter="resultFormatter"
                >
                </el-table-column>
                <el-table-column
                  prop="evaluateDate"
                  label="评估日期"
                  align="center"
                  width="160"
                  sortable
                  :formatter="dateFormat"
                >
                </el-table-column>
                <el-table-column
                  prop="complainDate"
                  label="申诉日期"
                  align="center"
                  width="160"
                  sortable
                  :formatter="dateFormat"
                >
                </el-table-column>
                <!-- <el-table-column label="操作" align="center" fixed="right" width="140">
                  <template slot-scope="scope">

                    <el-button type="text" @click="oneStandardDetail(scope.row)">查看评分申诉</el-button>
                  </template>
                </el-table-column> -->
                <i-table-operator :table="tableScope"></i-table-operator>
              </el-table>
            </template>
          </i-table>
        </div>
      </div>
    </i-layout>
  </div>
</template>
<script>
  import req from 'api/performance/grape-complaint'
  import complainedDialog from './grape-complained-dialog.vue'
  import ITable from 'components/common/i-table'
  import ILayout from 'components/common/i-layout'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
  // 查询组件
  import IForm from 'components/common/i-form/i-form.vue'
  import { statusDict } from 'config/dict'

  export default {
    name: 'standard',
    data () {
      return {
        table: {
          data: [],
          info: null,
          search: null,
          total: 0, //  后台获取到的total个数
          showPagebar: true,
          setting: {
            operator: [
              {
                text: '查看评分申诉',
                key: 'grpComplaintPost',
                func: row => this.oneStandardDetail(row)
              }
            ]
          }
        },
        statusDict: statusDict,
        multiSelection: [], // 多选
        dialogFormVisible: false, // 可以填写的弹出框
        dialogFormGetVisible: false, // 不可以填写的弹出框
        // 查询条件
        param: {
          staffName: '',
          orgId: '',
          staffCode: ''
        },
        rowData: {},
        dialogToolbar: [
          {
            text: '确定',
            func: done => {
              this.handleSave(done)
            }
          }
        ],
        title: '',
        evaluationId: '',
        extraObj: {}
      }
    },
    components: {
      complainedDialog,
      IForm,
      ITable,
      ILayout,
      IDialog,
      ISelectTree
    },
    created () {
      this.getcomplaintList()
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          0: '无效',
          1: '有效'
        }
        return statusMap[status]
      }
    },
    methods: {
      // 格式化时间
      dateFormat (row, column, cellValue) {
        return cellValue === null ? '' : new Date(cellValue).toLocaleDateString()
      },
      resultFormatter (row, column, cellValue) {
        if (cellValue === '3') return '驳回'
        if (cellValue === '4') return '通过'
        return ''
      },
      reset () {
        // 在这里写重置逻辑
        this.param = {
          staffName: '',
          orgId: '',
          staffCode: ''
        }
//        this.getstandardList()
      },
      // 搜索按钮
      search (val) {
        this.getcomplaintList()
//        this.table.search = {}
      },
      // 多选赋值操作
      handleSelectionChange (val) {
        this.multiSelection = val
      },
      // 当分页器页码变动时调用
      handleCurrentChange (opts) {
        this.table.info = opts
        this.getcomplaintList()
      },
      // 分页器每页显示几个
      handleSizeChange (opts) {
        this.table.info = opts
        this.getcomplaintList()
      },
      getcomplaintList () {
        req('complainedList', {
          ...this.param,
          ...this.table.info
        }).then((res) => {
          this.table = Object.assign({}, this.table, res)
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取一个等级的信息(用于点击修改之前的操作 )
      oneStandardDetail (row) {
        if (row) {
          this.evaluationId = row.evaluationId
          this.extraObj = {
            complainDesc: row.complainDesc,
            handleDesc: row.handleDesc,
            handleRes: row.handleRes
          }
          this.dialogFormVisible = true
        }
      },
      // 确认按钮
      handleSave (done) {
        this.$refs.complainedDialog.save().then(res => {
          // console.log(res.keyEvent)
          if (res) {
            this.getcomplaintList()
            done()
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .pointer {
    cursor: pointer;
  }
</style>
