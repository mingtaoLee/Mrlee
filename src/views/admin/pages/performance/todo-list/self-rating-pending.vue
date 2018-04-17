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
            prop="schemeName"
            label="方案名称"
            sortable
            header-align="center">
          </el-table-column>
          <el-table-column
            prop="year"
            label="年份"
            width="120"
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
            label="操作"
            width="100"
            header-align="center"
            class-name="ac">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="goPlanDetail(scope.row.planId)">
                绩效自评
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
      selfApi: 'getSelfRatingPendingIndicator'
    }
  }
}
</script>
