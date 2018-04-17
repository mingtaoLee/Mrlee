<template>
  <i-table
    :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table
				@row-click="rowClickHandler(tableScope, $event)"
        :data="tableScope.clone">
        <el-table-column
					width="150"
					prop="scaDate"
					label="生效月份"
					align="center"
          show-overflow-tooltip>
					<template slot-scope="scope">
						<i-table-cell
							:row="scope.row"
							col="scaDate"
							:table="tableScope"
						/>
					</template>
				</el-table-column>
				<el-table-column
          align="center"
          v-for="(col, idx) of table.columns"
          :key="idx"
          :label="col.label">
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
				<el-table-column label="合计">
					<el-table-column label="编制数" prop="scaleNum" align="center" show-overflow-tooltip />
					<el-table-column label="实际数" prop="actualNum" show-overflow-tooltip />
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
  name: 'NormalCompileTable',
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
