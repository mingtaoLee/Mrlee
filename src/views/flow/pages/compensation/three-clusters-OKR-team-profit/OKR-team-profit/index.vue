<template>
  <div>
    <h2 class="info-title">OKR团队分红</h2>
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
            :width="col.width"
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
            { prop: '', label: '序号', width: '200' },
            { prop: '', label: '类别', align: 'center', width: '120' },
            { prop: '', label: '物流中心名称', align: 'center', width: '120' },
            { prop: '', label: '核算时间段', align: 'center', width: '140' },
            { prop: '', label: '合伙人编制', align: 'center', width: '120' },
            { prop: '', label: '合伙人保底分红求和', align: 'center', width: '120' },
            { prop: '', label: '同比降控成效(%)', align: 'center', width: '120' },
            { prop: '', label: '同比降控成效分红系数', align: 'center', width: '120' },
            { prop: '', label: '质效考评得分', align: 'center', width: '130' },
            { prop: '', label: '质效考评等级', align: 'center', width: '120' },
            { prop: '', label: '质效考评分红系数', align: 'center', width: '120' },
            { prop: '', label: '应发团队分红', align: 'center', width: '120' },
            { prop: '', label: '人均分红奖励', align: 'center', width: '130' }
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
