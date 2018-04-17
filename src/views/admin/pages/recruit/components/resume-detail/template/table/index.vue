<template>
  <div>
    <section class="content-follow">
      <h2 class="info-title">{{title}}</h2>

      <i-table :table="table">
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="data"
            border>
            <el-table-column
            align="center"
            :formatter="tableScope.formatter"
            v-for="column in table.columns || []"
            :key="column.prop"
            :width="column.width"
            :prop="column.prop"
            :label="column.label">
              </el-table-column>
            <slot></slot>
          </el-table>
        </template>
      </i-table>
    </section>
  </div>
</template>

<script>
/**
 * @prop title 表格标题
 * @prop data 表格数据
 * @prop columns 表头
 */
export default {
  name: 'TableTemplate',
  props: {
    data: Array,
    columns: Array,
    title: {
      type: String,
      default: ''
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
  watch: {
    data (val) {
      this.table.data = val
      // console.log(this.table)
    }
  }
}
</script>
