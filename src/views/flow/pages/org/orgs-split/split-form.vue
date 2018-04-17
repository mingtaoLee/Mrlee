<template>
  <div class="split-table">
    <h3 class="table-header">{{title}}</h3>
    <i-table :table="table">
      <template slot="table" slot-scope="tableScope">
        <el-table
          :max-height="tableHeight"
          :data="data"
          border>
          <el-table-column
          align="center"
          v-for="column in table.columns"
          :key="column.prop"
          :prop="column.prop"
          :formatter="tableScope.formatter"
          :label="column.label">
          </el-table-column>
          <slot></slot>
          <el-table-column align="center" label="成本中心" v-if="costUnitVisible">
            <template slot-scope="scope">
              <!-- <el-input v-model="scope.row.costCentralId"></el-input> -->
              <cost-central v-model="scope.row.costCentralId"></cost-central>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </div>
</template>

<script>
import ITable from 'components/common/i-table'
import CostCentral from 'components/org/public/org-cost-center'
/**
 * @prop title 表格标题
 * @prop data 表格数据
 * @prop columns 表头
 * @prop costUnitVisible 成本中心可见性
 * @event removeRow 移除行
 */
export default {
  name: 'SplitForm',
  components: {
    ITable,
    CostCentral
  },
  props: {
    tableHeight: String,
    data: Array,
    columns: Array,
    costUnitVisible: Boolean,
    actionVisible: Boolean,
    title: {
      type: String,
      default: '预览'
    }
  },
  data () {
    return {
      table: {
        columns: this.columns,
        data: null
      }
    }
  },
  methods: {},
  updated () {
    this.table.data = this.data
  }
}
</script>

<style lang="scss" scoped>
.split-table{
  &+.split-table{
    margin-top: 15px;
  }
}
.table-header{
  font-size:14px;
  font-weight:bold;
}
</style>
