<template>
  <i-table
    :table="table">
    <template slot="table" slot-scope="tableScope">
      <el-table :data="tableScope.clone">
        <el-table-column label="类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>平均值</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          v-for="(col, idx) of table.columns"
          :key="idx"
          :label="col.label">
        </el-table-column>
        <!-- [todo] -->
        <el-table-column label="月度人力费用" align="center" show-overflow-tooltip />
        <el-table-column label="月度人效" align="center" show-overflow-tooltip />
      </el-table>
    </template>
  </i-table>
</template>

<script>
/**
 * @prop {Object} table 传进来表格的数据
 */
import ITable from 'components/common/i-table'

export default {
  name: 'BusinessModeTable',
  components: {
    ITable
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
  },
  created () {
  }
}
</script>

<style lang="scss" scoped>
</style>
