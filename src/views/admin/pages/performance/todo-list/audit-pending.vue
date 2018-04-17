<template>
  <i-layout>

    <i-form
      slot="header"
      @reset="reset"
      @search="search">
      <el-form-item label="员工姓名">
        <el-input v-model="keyword"></el-input>
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
            width="150"
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="employeeName"
            label="姓名"
            sortable
            width="100"
            header-align="center">
          </el-table-column>
          <el-table-column
            header-align="center"
            prop="schemeName"
            label="方案名称">
          </el-table-column>
          <el-table-column
            prop="year"
            label="年份"
            width="100"
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="period"
            label="阶段"
            width="100"
            :formatter="tableScope.formatter"
            header-align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            width="120"
            header-align="center"
            class-name="ac">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="goPlanDetail(scope.row.planId)">
                审核绩效计划
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </i-layout>
</template>

<script>
import todoMixin from './todo-mixin'

export default {

  mixins: [todoMixin],

  data () {
    return {
      selfApi: 'getAuditPendingPlan'
    }
  }

}
</script>
