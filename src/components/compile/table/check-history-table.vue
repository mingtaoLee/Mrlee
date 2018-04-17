<template>
  <i-table
    :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table
        @row-click="rowClickHandler(tableScope, $event)"
        :data="tableScope.clone">
        <el-table-column label="日期" align="center" show-overflow-tooltip/>
        <el-table-column prop="preDailySales" label="预测日均销售额" align="center" width="150" show-overflow-tooltip />
        <el-table-column prop="preDailyPassFlow" label="预测日均客流量" align="center" width="150" show-overflow-tooltip />
        <el-table-column
          align="center"
          v-for="(col, idx) of table.columns"
          :key="idx"
          :prop="col.prop"
          :label="col.label">
          <el-table-column
            prop="colproposal"
            label="建议数"
            v-if="Number(col.havingProposal)"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            label="编制数"
            prop="scaleNum"
            width="170"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <i-table-cell
                :row="scope.row"
                col="scaleNum"
                :table="tableScope"
              />
            </template>
          </el-table-column>
          <el-table-column prop="actualNum" label="实际数" show-overflow-tooltip />
        </el-table-column>
      </el-table>
    </template>
  </i-table>
</template>

<script>
/**
 * @prop {Object} table 传进来表格的数据
 */
import ITable from 'components/common/i-table'
import ITableCell from 'components/common/i-table-cell'

export default {
  name: 'CheckHistoryTable',
  components: {
    ITable,
    ITableCell
  },
  props: {
    table: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      //
    }
  },
  methods: {
    // 编辑
    rowClickHandler ({ rowClickHandler }, row) {
      rowClickHandler(row)
    }
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
</style>
