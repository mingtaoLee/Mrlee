<template>
 <main>
  <i-layout headerKey="grpSchemesGet" v-if="isAddTarget === 0">
    <i-form slot="header" @reset="reset" @search="setQuery">
      <el-form-item label="名称">
        <el-input v-model="params.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <i-select
          v-model="params.status"
          parameter="GRAPE_EVALUATE_TYPE"
        ></i-select>
      </el-form-item>
    </i-form>

    <i-table
      :table="schemeTableConfig"
      slot="section"
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange"
    >
      <template slot="table" slot-scope="tableScope">
        <!-- 方案表格 -->
        <el-table
          :data="tableScope.clone"
          v-loading="tableLoading"
          :element-loading-text="$loadingText"
        >
          <el-table-column type="selection"/>

          <el-table-column
            v-for="(col, index) in schemeTableConfig.columns"
            :key="index"
            :label="col.label"
            :prop="col.prop"
            :sortable="col.sortable"
            :formatter="tableScope.formatter"
          >
          </el-table-column>

          <i-table-operator :table="tableScope"></i-table-operator>

        </el-table>
        <!-- 员工表格 -->
      </template>
    </i-table>
  </i-layout>
  
  <i-layout v-else headerKey="grpSchemeStaffsGet">
    <i-form slot="header" @reset="reset" @search="setQuery">
      <el-form-item label="工号">
        <el-input v-model="staffParams.staffCode" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="适用范围">
        <i-select-tree v-model="params.orgId" dataKey="org"  nodeKey="orgUnitId"></i-select-tree>
      </el-form-item> -->
    </i-form>

    <i-table
      :table="peopleTableConfig"
      slot="section"
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange"
    >
      <template slot="table" slot-scope="tableScope">
        <!-- 方案表格 -->
        <el-table :data="tableScope.clone">

          <el-table-column type="selection"/>

          <el-table-column
            v-for="(col, index) in peopleTableConfig.columns"
            :key="index"
            :label="col.label"
            :prop="col.prop"
            :sortable="col.sortable"
            :formatter="tableScope.formatter"
          >
          </el-table-column>

          <i-table-operator :table="tableScope"></i-table-operator>

        </el-table>
        <!-- 员工表格 -->
      </template>
    </i-table>
  </i-layout>

  <scheme-operator
    :status="schemeOperatorStatus"
    :showOperator.sync="showSchemeOperator"
    v-if="showSchemeOperator"
    @loadSchemes="setQuery"
    :schemeData="schemeData"
  ></scheme-operator>

  <i-dialog 
    v-model="showTableLeaderSet" 
    destroyedWhenClose 
    :toolbar="tableLeaderDialog" 
    title="设置上级" 
  >
    <table-leader-set
      :row="currentRow"
      @selectPerson="showPersonSelect = true"
      :leader="selectedLeader"
    ></table-leader-set>
  </i-dialog>

  <i-dialog 
    v-model="showLeaderSet" 
    destroyedWhenClose 
    :toolbar="leaderDialog" 
    title="批量设置上级"
  >
    <leader-set
      :tableData="selectedRows"
      @selectPerson="showPersonSelect = true"
      :leader="selectedLeader"
    ></leader-set>
  </i-dialog>

  <i-personnel-select
    :isShow.sync="showPersonSelect"
    v-if="showPersonSelect"
    :multiple="canMultiple"
    @confirm="handlePersonSelected"
  ></i-personnel-select>

 </main>

</template>
<script>
import access from 'mixins/access'
import req from 'api/grape/scheme.js'
// import { filterId } from 'utils/performance'
import iLayout from 'components/common/i-layout'
import iForm from 'components/common/i-form/i-form'
import iSelectTree from 'components/common/i-select-tree/i-select-tree.vue'
import ITable from 'components/common/i-table'
import ITableOperator from 'components/common/i-table-operator'
import ITableCell from 'components/common/i-table-cell'
import iDialog from 'components/common/i-dialog/i-dialog'
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'

export default {
  name: 'grape-scheme-main',

  mixins: [access],

  data () {
    return {
      isAddTarget: 0, // 是否点击了添加对象,点击后变为管理考核对象 0:未点击，1:已点击
      schemeOperatorStatus: 0, // 控制当前是查看还是新增、修改方案. 0:查看，1:新增，2:修改

      schemeData: {
        name: '',
        standardId: '',
        orgId: null,
        beginDate: null,
        endDate: null,
        adjustDay: null,
        appealTime: null,
        description: '',
        managerId: null,
        managerName: null
      },

      params: {
        name: '',
        status: ''
      },

      staffParams: {
        staffCode: null
      },

      schemeTableConfig: {
        columns: [
          {prop: 'name', label: '名称'},
          {prop: 'orgName', label: '适用范围', sortable: true},
          {prop: 'status', label: '状态', sortable: true, display: {dict: 'IS_VALID'}},
          {prop: 'beginDate', label: '开始时间', display: { date: 'default' }},
          {prop: 'endDate', label: '结束时间', display: { date: 'default' }}
        ],
        setting: {
          toolbar: [
            {
              text: '新增',
              key: 'grpSchemePost',
              func: () => this.openOperator(1, {})
            },
            // {
            //   text: '禁用',
            //   type: 'default',
            //   key: 'grpSchemesDisablePost',
            //   func: vm => this.toobarCommon(vm, this.disableSchemes)
            // },
            // {
            //   text: '启用',
            //   type: 'default',
            //   key: 'grpSchemesEnablePost',
            //   func: vm => this.toobarCommon(vm, this.activeSchemes)
            // },
            {
              text: '删除',
              type: 'default',
              key: 'grpSchemesDelete',
              func: vm => this.toobarCommon(vm, this.deleteData)
            }
          ],
          operator: [
            {
              text: '查看',
              key: 'grpSchemeGet',
              func: row => this.openOperator(0, row)
            },
            {
              text: '禁用',
              type: 'default',
              key: 'grpSchemesDisablePost',
              func: row => this.operatorCommon(row, this.disableSchemes)
            },
            {
              text: '启用',
              type: 'default',
              key: 'grpSchemesEnablePost',
              func: row => this.operatorCommon(row, this.activeSchemes)
            },
            {
              text: '修改',
              key: 'grpSchemePut',
              func: row => this.openOperator(2, row)

            },
            {
              text: '管理考核对象',
              key: 'grpSchemeStaffsGet',
              func: (row) => {
                this.peopleTableConfig.info = {}
                this.isAddTarget = 1
                this.currentScheme = row.schemeId
                this.setQuery()
              }
            }
          ]
        },
        data: null,
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },

      peopleTableConfig: {
        columns: [
          {prop: 'staffName', label: '姓名'},
          {prop: 'staffCode', label: '工号'},
          {prop: 'staffPosition', label: '职位'},
          {prop: 'staffOrgName', label: '部门'},
          {prop: 'leaderName', label: '直接上级'},
          {prop: 'leaderCode', label: '上级工号'},
          {prop: 'leaderPosition', label: '上级职位'},
          {prop: 'leaderOrgName', label: '上级部门'}
        ],
        setting: {
          toolbar: [
            {
              text: '新增',
              key: 'grpSchemeStaffsPost',
              type: 'default',
              func: () => {
                this.canMultiple = true
                this.selectStatus = 0
                this.showPersonSelect = true
              }
            },
            {
              text: '设置上级',
              key: 'grpSchemesLeaderPost',
              type: 'default',
              func: (vm) => {
                let arr = vm.getMultipleSelection()
                if (this.checkSelected(arr)) {
                  this.selectStatus = 1
                  this.selectedRows = arr
                  this.showLeaderSet = true
                }
              }
            },
            {
              text: '删除',
              key: 'grpSchemeStaffsDelete',
              func: vm => this.toobarCommon(vm, this.deleteData)
            },
            {
              text: '返回',
              func: () => {
                this.isAddTarget = 0
                this.currentScheme = ''
                this.setQuery()
              }
            }
          ],
          operator: [
            {
              text: '设置上级',
              key: 'grpSchemesLeaderPost',
              func: (row) => {
                this.selectStatus = 1
                this.currentRow = row
                this.showTableLeaderSet = true
              }
            },
            {
              text: '删除',
              key: 'grpSchemeStaffsDelete',
              func: row => this.deleteData([row.staffId])
            }
          ]
        },
        data: null,
        showPagebar: true,
        info: null,
        search: null,
        total: 0
      },

      dialogToolbar: [
        {
          text: '确定',
          type: 'primary',
          func: done => {
            done()
          }
        },
        {
          text: '取消',
          type: 'text',
          func: done => {
            done()
          }
        }
      ],

      leaderDialog: [
        {
          text: '确定',
          type: 'primary',
          func: done => {
            this.selectedLeader && this.doSetLeader(done)
          }
        },
        {
          text: '取消',
          type: 'text',
          func: done => {
            done()
          }
        }
      ],

      tableLeaderDialog: [
        {
          text: '确定',
          type: 'primary',
          func: done => {
            let data
            let staffId = this.currentRow.staffId
            let leaderId
            this.selectedLeader ? leaderId = this.selectedLeader.employeeId : leaderId = null
            data = {staffId, leaderId}
            leaderId ? req('setLeaderOne', data).then(() => {
              this.setQuery()
              this.selectedLeader = null
              done()
            }) : done()
          }
        },
        {
          text: '取消',
          type: 'text',
          func: done => {
            done()
          }
        }
      ],

      currentScheme: '',
      selectedRows: [],
      currentRow: {},
      selectedLeader: null,
      selectStatus: null, // 选人组件的状态判断 0:增加考核对象，1：设置上级
      showSchemeOperator: false, // 方案查看，修改，新增的对话框
      showPersonSelect: false, // 公用选人组件控制
      showLeaderSet: false,
      showTableLeaderSet: false,
      tableLoading: false,
      canMultiple: false
    }
  },

  methods: {
    // 列表数据加载，查询，分页操作
    reset () {
      if (this.isAddTarget === 0) {
        this.params.name = ''
        this.params.status = ''
      } else {
        this.staffParams.employeeCode = null
      }
    },

    loadTableData (opt) {
      this.tableLoading = true
      this.isAddTarget === 0
      ? req('getSchemeList', opt).then(res => {
        Object.assign(this.schemeTableConfig, res)
        this.tableLoading = false
      }) : req('getSchemeStaffs', {...opt, schemeId: this.currentScheme}).then(res => {
        Object.assign(this.peopleTableConfig, res)
        this.tableLoading = false
      })
    },

    getInfoOpt () {
      let opt
      this.isAddTarget === 0 ? opt = this.schemeTableConfig.info : opt = this.peopleTableConfig.info
      return opt
    },

    handleSizeChange (opt) {
      this.loadTableData(opt)
    },

    handleCurrentChange (opt) {
      this.loadTableData(opt)
    },

    setQuery () {
      this.isAddTarget === 0 ? this.schemeTableConfig.search = {...this.params} : this.peopleTableConfig.search = {...this.staffParams}
    },

    // toolbar区域操作函数
    checkSelected (arr) {
      if (arr.length <= 0) {
        this.$message({
          message: '请选择',
          type: 'warning'
        })
        return false
      }
      return true
    },

    toobarCommon ({ getMultipleSelection }, func) {
      let select = getMultipleSelection()
      let arr = select.map(sel => this.isAddTarget === 0 ? sel.schemeId : sel.staffId)
      func(arr)
    },

    operatorCommon (row, func) {
      let arr = [row]
      arr = arr.map(sel => this.isAddTarget === 0 ? sel.schemeId : sel.staffId)
      func(arr)
    },

    activeSchemes (arr) {
      this.checkSelected(arr) &&
      req('activeSchemes', arr).then(() => {
        this.$message.success('启动成功')
        this.setQuery()
      })
    },

    disableSchemes (arr) {
      this.checkSelected && req('diableSchemes', arr).then(() => {
        this.$message.success('禁用成功')
        this.setQuery()
      })
    },

    deleteData (target) {
      if (target instanceof Array && this.checkSelected(target)) {
        this.$confirm('确认要删除这些数据吗?', '提示').then(() => {
          if (this.isAddTarget === 0) {
            req('deleteSchemes', target).then(() => this.setQuery())
          } else {
            target.schemeId = this.currentScheme
            req('deleteStaffs', target)
            .then(() => this.setQuery())
          }
        })
      }
    },

    addTarget (arr) {
      let params = arr.map(item => {
        return {
          empId: item.employeeId,
          updateType: '1'
        }
      })
      params.schemeId = this.currentScheme
      req('addGrapeSchemeTarget', params).then(() => this.setQuery())
    },

    setLeader (arr) {
      this.selectedLeader = arr[0]
    },

    doSetLeader (done) {
      let leaderId
      this.selectedLeader ? leaderId = this.selectedLeader.employeeId : leaderId = null
      let staffIds = this.selectedRows.map(person => person.staffId)
      let data = {leaderId, staffIds}
      leaderId ? req('setLeaderMany', data)
        .then(() => {
          this.setQuery()
          this.selectedLeader = null
          done()
        }) : done()
    },

    // 选人组件的确定回调，0为增加考核对象，1为选择上级人员
    handlePersonSelected (selectList) {
      let funcs = {
        0: this.addTarget,
        1: this.setLeader
      }
      funcs[this.selectStatus](selectList)
    },

    // 新增、查看、修改方案信息的相关操作
    openOperator (status, { schemeId }) {
      this.schemeOperatorStatus = status
      if ((status === 0 || status === 2) && schemeId) {
        req('getSchemeDetail', {schemeId: schemeId}).then(res => {
          this.schemeData = res
        })
      }
      this.showSchemeOperator = true
    }
  },

  mounted () {
    this.setQuery()
  },

  components: {
    iLayout,
    iForm,
    iSelectTree,
    ITable,
    ITableOperator,
    iDialog,
    iPersonnelSelect,
    ITableCell,
    schemeOperator: () => import('./schemeOperator.vue'),
    tableLeaderSet: () => import('./table-leader-adjust.vue'),
    leaderSet: () => import('./leader-set.vue')
  }
}
</script>
<style lang="scss" scoped>

</style>
