<template>
  <i-layout>

    <i-form
      slot="header"
      @reset="reset"
      @search="search" ref="long">
      <el-form-item label="员工姓名" v-if="reqUrl!=='getSelfSubmits'">
        <el-input v-model.trim="params.employeeName"></el-input>
      </el-form-item>
      <el-form-item label="状态" v-if="reqUrl==='getSelfSubmits'">
        <el-select v-model="params.planEmployeeStatus" clearable placeholder="">
          <el-option
            v-for="item in planEmployeeStatusHistoryDict"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" v-if="reqUrl==='getSelfChecksPlan'">
        <el-select v-model="params.planCheckStatus" clearable placeholder="">
          <el-option
            v-for="item in planCheckStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" v-if="reqUrl==='getSelfEvaluationPlan'">
        <el-select v-model="params.planEvaluationStatus" clearable placeholder="">
          <el-option
            v-for="item in planEvaluationStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年份">
        <el-date-picker
          v-model="params.year"
          align="right"
          type="year"
          placeholder=""
          clearable
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="跨度">
        <el-select v-model="params.period" placeholder="" clearable>
          <el-option
            v-for="item in periodDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
        <el-table :data="tableScope.clone">
          <el-table-column
            v-if="!noEmployee"
            prop="employeeCode"
            label="工号"
            sortable
            width="120"
            header-align="center">
          </el-table-column>
          <el-table-column
            v-if="!noEmployee"
            prop="employeeName"
            label="员工姓名"
            sortable
            width="120"
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="schemeName"
            label="方案名称"
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="year"
            label="年份"
            width="100"
            header-align="center"
            class-name="ac">
          </el-table-column>
          <el-table-column
            prop="period"
            label="评估阶段"
            width="120"
            :formatter="tableScope.formatter"
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="planEmployeeStatus"
            label="状态"
            width="150"
            :formatter="tableScope.formatter"
            header-align="center"
            class-name="ac"
            v-if="reqUrl==='getSelfSubmits'">
          </el-table-column>
          <el-table-column
            prop="planCheckStatus"
            label="状态"
            width="150"
            :formatter="tableScope.formatter"
            header-align="center"
            class-name="ac"
            v-if="reqUrl==='getSelfChecksPlan'">
          </el-table-column>
          <el-table-column
            prop="planEvaluationStatus"
            label="状态"
            width="150"
            :formatter="tableScope.formatter"
            header-align="center"
            class-name="ac"
            v-if="reqUrl==='getSelfEvaluationPlan'">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            header-align="center"
            class-name="ac">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="scope.row.planEmployeeStatus != '00'"
                @click="goPlanDetail(scope.row.planId)">
                查看计划
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </i-layout>
</template>

<script>
  import funcMixin from './mixin-methods'

  export default {
    mixins: [funcMixin],

    props: {
      // 无工号和姓名flag
      noEmployee: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      goPlanDetail (planId) {
        this.$router.push(`/performance/${planId}/plan_detail`)
      }
    }
  }
</script>
