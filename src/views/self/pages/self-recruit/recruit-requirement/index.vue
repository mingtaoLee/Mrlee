<template>
  <i-layout headerKey="rctRequirementsSelfGet">
    <div slot="header">
      <i-form @reset="reset" @search="search">
        <el-form-item label="招聘岗位" prop="applyPosition">
          <el-input
            v-model.trim="param.applyPosition"
            @focus="departmentNodeClick"
            :disabled="editable"
            placeholder="请选择"
            ></el-input>
        </el-form-item>
        <el-form-item label="用人部门">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            :rootId="rootId"
            v-model="param.applyOrgId"
            :lazy="true"
            @input="handleNodeClick"
            :readonly="true"
            size="small"
            treeMaxHeight="180"
            :accordion="true"
            sizeAuto
            clearable
            placeholder="请选择"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="发布状态">
          <i-select v-model="param.releaseStatus" clearable parameter="RELEASE_STATUS" placeholder="请选择"></i-select>
        </el-form-item>
        <el-form-item label="用工类型">
           <i-select v-model="param.employeeType" clearable parameter="EMPLOYEE_TYPE" placeholder="请选择"></i-select>
        </el-form-item>
      </i-form>
      <position-selection
        type="mini"
        v-model="positionSelectDialogFlag"
        @change="selectPositionConfirm">
      </position-selection>
    </div>
    <i-table
      :table="table"
      slot="section"
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange">
      <template slot="table" slot-scope="tableScope">
        <el-table :data="tableScope.clone" v-loading="loading" :element-loading-text="$loadingText">

          <el-table-column
          v-for="(col, index) in table.columns"
          :key="index"
          :prop="col.prop"
          :formatter="tableScope.formatter"
          :label="col.label"></el-table-column>
          <!-- <i-table-operator :table="tableScope"/> -->
          <el-table-column label="操作" fixed="right" align="center" width="200" >
            <template slot-scope="scope">
              <!-- <i-table-operator :table="tableScope" :row="scope.row"></i-table-operator> -->
              <el-button
                type="text"
                @click="goResumeList(scope.row.requirementId)">查看详情</el-button>
            </template>
          </el-table-column>

        </el-table>
      </template>
    </i-table>
  </i-layout>
</template>

<script>
// import access from 'mixins/access'
// import {windowOpen} from 'utils'
import req from 'api/recruit'
import { ResumePageSource } from 'views/admin/pages/recruit/config'
import PositionSelection from 'components/position/position-selection'
import tableMixin from '../../../../admin/pages/performance/table-mixin'
export default {
  name: 'SelfRecruitRequirement',
  components: {
    PositionSelection
  },
  mixins: [tableMixin],
  data () {
    return {
      param: {
        applyPositionId: '',
        applyOrgId: '',
        releaseStatus: '',
        employeeType: '',
        applyPosition: ''
      },
      loading: true,
      positionSelectDialogFlag: false,
      table: {
        data: [],
        showPagebar: true,
        total: null,
        search: null,
        info: {
          pageIndex: 1,
          pageSize: 10
        },
        columns: [
          {prop: 'applyPositionName', label: '岗位名称'},
          {prop: 'applyOrgName', label: '用人部门'},
          {prop: 'releaseStatus', label: '发布状态', display: { dict: 'RELEASE_STATUS' }},
          {prop: 'requireNum', label: '拟招人数'},
          {prop: 'employeeType', label: '用工类型', display: { dict: 'EMPLOYEE_TYPE' }},
          {prop: 'responsiblePerson', label: '招聘负责人'},
          {prop: 'receivedNum', label: '收到简历数', align: 'center'},
          {prop: 'interviewNum', label: '面试数', align: 'center'},
          {prop: 'postNum', label: '到岗数', align: 'center'}
        ],
        setting: {
          operator: [
            {
              text: '查看详情',
              // key: 'rctRequirementSelfListGet',
              func: (row) => {
                this.goResumeList(row.requirementId)
              }
            }
          ]
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    reset () {
      this.param = {
        applyPositionId: '',
        applyOrgId: '',
        releaseStatus: '',
        employeeType: '',
        applyPosition: ''
      }
    },
    search () {
      this.getRequirementsList()
      // this.table.search = {...this.param}
    },
    // 显示职位弹窗
    departmentNodeClick (selected) {
      this.positionSelectDialogFlag = true
    },
    // 选择职位
    selectPositionConfirm (selected) {
      this.param.applyPositionId = selected.posPositionId
      this.param.applyPosition = selected.name
      this.positionSelectDialogFlag = false
    },
    // 当分页器页码变动时调用
    handleCurrentChange (opts) {
      this.loading = true
      this.table.info = opts
      this.getRequirementsList()
    },
    // 分页器每页显示几个
    handleSizeChange (opts) {
      this.loading = true
      this.table.info = opts
      this.getRequirementsList()
    },
    getRequirementsList () {
      req('autoRequirementList', {
        ...this.param,
        ...this.table.info,
        applyPositionId: this.param.applyPositionId.toString(),
        applyOrgId: this.param.applyOrgId.toString(),
        releaseStatus: this.param.releaseStatus.toString(),
        employeeType: this.param.employeeType.toString()
      }).then((res) => {
        this.table = Object.assign({}, this.table, res)
        this.loading = false
        // console.log(this.table.data)
      }).catch((err) => {
        this.loading = false
        console.log(err)
      })
    },
    init () {
      // req('autoRequirementList').then(res => Object.assign(this.table, res))
      this.getRequirementsList()
    },
    // 跳转简历列表
    goResumeList (requirementId) {
      this.$router.push({
        path: '/resumeList',
        query: {
          requirementId: requirementId,
          source: ResumePageSource.SELFDEMAND
        }
      })
      // 跳转简历列表
      // windowOpen('self.html/#/resumeList', {
      //   requirementId: requirementId,
      //   source: ResumePageSource.SELFDEMAND
      // })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
