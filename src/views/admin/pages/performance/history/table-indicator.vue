<template>
  <i-layout>
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
            prop="employeeCode"
            label="工号"
            width="120"
            sortable
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="employeeName"
            label="姓名"
            width="100"
            sortable
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="schemeName"
            label="方案名称"
            width="200"
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="year"
            label="年份"
            width="70"
            header-align="center"
            class-name="ac">
          </el-table-column>
          <el-table-column
            prop="period"
            label="阶段"
            width="100"
            :formatter="tableScope.formatter"
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="indicatorName"
            label="指标名称"
            width="150"
            header-align="center">
          </el-table-column>
          <el-table-column
            v-if="tableScope.clone.collectorName"
            prop="collectorName"
            label="收集人"
            width="70"
            header-align="center">
          </el-table-column>
          <el-table-column
            label="目标值"
            width="100"
            header-align="center">
            <template slot-scope="scope">
              {{ scope.row.target }} {{ scope.row.unit | unitFormat }}
            </template>
          </el-table-column>
          <el-table-column
            prop="collecterValue"
            label="达成值"
            width="100"
            header-align="center">
            <template slot-scope="scope">
              {{ scope.row.collecterValue }} {{ scope.row.unit | unitFormat }}
            </template>
          </el-table-column>
          <el-table-column
            prop="collecterDescription"
            label="达成值说明"
            width="150"
            header-align="center"
            :show-overflow-tooltip="true"
            tooltip-effect="dark">
          </el-table-column>
          <!-- </el-table-column> -->
          <el-table-column
            label="审核值"
            width="120"
            header-align="center">
            <template slot-scope="scope">
              {{ scope.row.managerValue }} {{ scope.row.unit | unitFormat }}
            </template>
          </el-table-column>
          <el-table-column
            prop="collecterDescription"
            label="审核值说明"
            width="150"
            header-align="center"
            :show-overflow-tooltip="true"
            tooltip-effect="dark">
          </el-table-column>
          <el-table-column
            class-name="ellipses-text"
            prop="managerOpinion"
            label="驳回意见"
            header-align="center"
            :show-overflow-tooltip="true"
            tooltip-effect="dark">
          </el-table-column>
          <el-table-column
            prop="totalScore"
            label="分数"
            width="100"
            header-align="center"
            class-name="ac">
          </el-table-column>
          <el-table-column
            v-if="tableScope.clone.managerName"
            prop="managerName"
            label="审核人"
            width="100"
            header-align="center">
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </i-layout>
</template>

<script>
import funcMixin from './mixin-methods'

export default {
  mixins: [funcMixin]
}
</script>

<style lang="scss" scoped>
.ellipses-text {
  text-overflow: ellipsis;
}
</style>

