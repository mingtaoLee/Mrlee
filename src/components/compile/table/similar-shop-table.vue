<template>
  <i-table
    :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table
        @row-click="rowClickHandler(tableScope, $event)"
        :data="tableScope.clone">
        <el-table-column
          label="小店/编制数量"
          align="center"
          width="150"
          show-overflow-tooltip
        />
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
          <el-table-column
            prop="actualNum"
            label="实际数"
            show-overflow-tooltip
          />
        </el-table-column>
        <el-table-column
          label="平均月度人力费用"
          align="center"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          label="平均月度人数"
          align="center"
          show-overflow-tooltip
        />
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
  name: 'SimilarShopTable',
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
