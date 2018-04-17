<template>
  <div class="org-table">
    <h3 class="table-header">{{title}}</h3>
    <!-- <el-table :data="data" max-height="350">
      <el-table-column
      align="center"
      v-for="column in columns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label">
        </el-table-column>
      <slot></slot>
      <el-table-column
      align="center"
      label="生效日期"
      prop="effectiveDate"
      :formatter="dateFormat">
      </el-table-column>
      <el-table-column align="center" label="成本中心" v-if="costUnitVisible">
        <template slot-scope="scope">
          <el-input v-model="scope.row.costUnit"></el-input>
        </template>
      </el-table-column>
      <el-table-column
      v-if="actionVisible"
      fixed="right"
      label="操作"
      width="100">
        <template slot-scope="scope">
          <el-button @click="removeRow(scope,scope.$index,data)" type="text" size="small">移除</el-button>
        </template>
      </el-table-column>
    </el-table> -->


    <i-table 
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange"
      :table="table">
      <template slot="table" slot-scope="tableScope">
        <el-table
          :max-height="tableHeight"
          :data="tableScope.clone"
          border>
          <el-table-column
          align="center"
          :formatter="tableScope.formatter"
          v-for="column in table.columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label">
            </el-table-column>
          <slot></slot>
          <el-table-column
          align="center"
          label="生效日期"
          prop="effectiveDate"
          :formatter="dateFormat">
          </el-table-column>
          <el-table-column align="center" label="成本中心" v-if="costUnitVisible">
            <template slot-scope="scope">
              <el-input v-model="scope.row.costUnit"></el-input>
            </template>
          </el-table-column>
          <el-table-column
          v-if="actionVisible"
          fixed="right"
          label="操作"
          width="100">
            <template slot-scope="scope">
              <el-button @click="removeRow(scope,scope.$index,data)" type="text" size="small">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </div>
</template>

<script>
import moment from 'moment'
import ITable from 'components/common/i-table'
/**
 * @prop title 表格标题
 * @prop data 表格数据
 * @prop columns 表头
 * @prop costUnitVisible 成本中心可见性
 * @event removeRow 移除行
 */
export default {
  components: {
    ITable
  },
  props: {
    tableHeight: String,
    data: {
      type: Array,
      default: []
    },
    total: Number,
    info: Object,
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
        data: [],
        total: this.total,
        info: this.info,
        showPagebar: true
      }
    }
  },
  methods: {
    handleSizeChange (options) {
      this.$emit('handleSizeChange', options)
    },
    handleCurrentChange (options) {
      this.$emit('handleCurrentChange', options)
    },
    removeRow (scope, index, dataTable) {
      this.$emit('removeRow', scope)
      dataTable.splice(index, 1)
    },
    dateFormat (row, col, value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD')
      }
    }
  },

  created () {
    // this.table.data = this.data
    // console.log(this.table.data)
  },
  watch: {
    data: {
      handler (value) {
        this.table.data = value
      },
      immediate: true
    },
    total (value) {
      this.table.total = value
    },
    info (value) {
      this.table.info = value
    }
  }
}
</script>

<style lang="scss" scoped>
.org-table{
  &+.org-table{
    margin-top: 15px;
  }
}
.table-header{
  font-size:14px;
  font-weight:bold;
}
</style>
