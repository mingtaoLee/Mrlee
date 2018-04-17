<template>
  <div>
    <h2 class="info-title">新店奖金包分配明细（半年核算类）</h2>
    <template v-if="showMap['newStoreProfitBonusDetailTable']">
      <el-row :gutter="20" class="detail-title">
        <el-col :span="5" class="clear">
          <span>门店名称：</span>
          <span>{{baseInfo.orgUnitName}}</span>
        </el-col>
        <el-col :span="5" class="clear">
          <span class="label">门店奖金包：</span>
          <div class="text">{{baseInfo.storeBonus}}</div>
        </el-col>
      </el-row>
      <i-table
        ref="table"
        class="info-content"
        :table="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            border
            @row-click="rowClickHandler(tableScope, $event)"
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
              <template slot-scope="scope">
                <i-table-cell
                  ref="cell"
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope">
                </i-table-cell>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </template>
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
      },
      baseInfo: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    watch: {
      data (value) {
        this.table.data = value
      }
    },
    data () {
      return {
        table: {
          columns: [
            { prop: 'groupName', label: '薪资组', width: '120' },
            { prop: 'employeeCode', label: '工号', align: 'center', width: '120' },
            { prop: 'fullName', label: '姓名', width: '120' },
            { prop: 'titleName', label: '职务', width: '120' },
            { prop: 'bonusProp', label: '奖金包占比(%)', width: '120' },
            { prop: 'profitBonus', label: '标准新店利润分红', align: 'right', width: '140' },
            { prop: 'lossNum', label: '亏损小店个数', align: 'right', width: '120' },
            { prop: 'discountNum', label: '亏损小店打折比例(%)', align: 'right', width: '160' },
            { prop: 'ratio', label: '享受比例(%)', align: 'right', width: '120' },
            { prop: 'profitSharing', label: '应发新店利润分红', align: 'right', width: '140' }
          ],
          data: this.data || [],
          editable: true
        }
      }
    },
    created () {
      this.table.disable = this.disabledMap.newStoreProfitBonusDetailTable
    },
    methods: {
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .detail-title {
    margin-bottom: 10px;
    font-size: 14px;
  }

  .label {
    float: left;
    width: 100px;
    text-align: right;
  }

  .text {
    margin-left: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .btn {
    margin-top: 10px;
  }
</style>
