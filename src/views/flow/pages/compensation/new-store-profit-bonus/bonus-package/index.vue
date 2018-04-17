<template>
  <div>
    <h2 class="info-title">新店奖金包数额</h2>
    <i-table
      v-if="showMap['storeInfoListTable']"
      class="info-content"
      :table="table"
      ref="table"
    >
      <template slot="table" slot-scope="tableScope">
        <el-table
          :data="tableScope.clone"
          border
        >
          <el-table-column
            v-for="(col, idx) of table.columns"
            :key="idx"
            :prop="col.prop"
            :label="col.label"
            :minWidth="col.width"
            :align="col.align"
            :fixed="col.fixed"
            :sortable="col.sortable"
            :formatter="tableScope.formatter"
          >
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      }
    },
    watch: {
      data (value) {
        console.log(value)
        value.length && (this.table.data = value)
      }
    },
    data () {
      return {
        table: {
          columns: [
            { prop: 'areaName', label: '区域', width: '200' },
            { prop: 'orgUnitCode', label: '门店编码', align: 'center', width: '120' },
            { prop: 'orgUnitName', label: '门店名称', align: 'center', width: '120' },
            { prop: 'createDate', label: '开业日期', align: 'center', width: '140', display: { date: 'default' } },
            { prop: 'checkMonth', label: '核算月份', align: 'center', width: '120', display: { date: 'short' } },
            { prop: 'timeSlot', label: '核算时间段', align: 'center', width: '120' },
            { prop: 'targetSellAmount', label: '目标销售额', align: 'center', width: '120' },
            { prop: 'sellAmount', label: '实际销售额', align: 'center', width: '120' },
            { prop: 'finishRate', label: '销售完成率(%)', align: 'center', width: '130' },
            { prop: 'profitAmount', label: '实际利润总和', align: 'center', width: '120' },
            { prop: 'bonusProp', label: '分红比例(%)', align: 'center', width: '130' },
            { prop: 'storeBonus', label: '门店奖金包', align: 'center', width: '120' }
          ],
          data: this.data || []
        }
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
