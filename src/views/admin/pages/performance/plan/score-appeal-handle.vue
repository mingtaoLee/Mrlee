<template>
  <i-layout headerKey="pfmGradeComplaintListGet">

    <i-form
      slot="header"
      @reset="reset"
      @search="search">
      <el-form-item label="员工姓名">
        <el-input v-model.trim="keyword"></el-input>
      </el-form-item>
       <el-form-item label="员工工号">
        <el-input v-model.trim="employeeCode"></el-input>
      </el-form-item>
    </i-form>

    <i-table
      slot="section"
      :table="table"
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange">
      <template
        slot-scope="tableScope"
        slot="table">
        <el-table
          :data="tableScope.clone">
          <el-table-column
            prop="employeeCode"
            label="工号"
            sortable
            header-align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="employeeName"
            label="姓名"
            header-align="center"
            width="120">
          </el-table-column>
          <el-table-column
            prop="schemeName"
            label="方案名称"
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="year"
            label="年份"
            header-align="center"
            width="100"
            class-name="ac">
          </el-table-column>
          <el-table-column
            prop="period"
            label="评估阶段"
            header-align="center"
            :formatter="tableScope.formatter"
            width="100">
          </el-table-column>
         <i-table-operator :table="tableScope"></i-table-operator>
        </el-table>
      </template>
    </i-table>
  </i-layout>
</template>

<script>
import mixin from '../todo-list/todo-mixin'
import req from 'api/performance/plan-manage'
import {windowOpen} from 'utils'

export default {
  mixins: [mixin],

  data () {
    return {
      selfApi: 'getGradeComplaint',
      employeeCode: '',
      table: {
        data: null,
        total: 0,
        info: null,
        showPagebar: true,
        columns: [
          { prop: 'period', display: { dict: 'PERIOD' } }
        ],
        setting: {
          export: {
          },
          operator: [
            {
              text: '处理评分申诉',
              key: 'pfmGradeComplaintPost',
              func: row => this.forward(row.planId)
            }
          ]
        }
      }
    }
  },

  methods: {
    forward (planId) {
      // this.$router.push(`/performance/${planId}/plan_detail`)
      windowOpen(`/#/performance/${planId}/plan_detail`)
    },

    search () {
      this.table.search = {keyword: this.keyword, employeeCode: this.employeeCode}
    },

    reset () {
      this.employeeCode = ''
      this.keyword = ''
    },

    getData (opts) {
      // const opts = {
      //   keyword: this.keyword,
      //   ...this.table.info
      // }
      req(this.selfApi, {
        ...opts
      }).then((res) => {
        Object.assign(this.table, res)
      })
    }
  }
}
</script>
