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
        <el-table
          :data="tableScope.clone">
          <el-table-column
            prop="schemeName"
            label="方案名称"
            sortable
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
            label="阶段"
            width="100"
            :formatter="tableScope.formatter"
            header-align="center">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            tooltip-effect="dark"
            class="ellipsis-text"
            prop="description"
            label="描述"
            header-align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            header-align="center"
            class-name="ac">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="goPlanDetail(scope.row.planId)">
                编辑计划
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
      selfApi: 'getMakePendingPlan'
    }
  }
}
</script>

<style lang="scss" scoped>
  .ellipsis-text {
    text-overflow: ellipsis;
  }
</style>

