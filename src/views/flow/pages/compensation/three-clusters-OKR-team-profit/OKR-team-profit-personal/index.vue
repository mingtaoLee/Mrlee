<template>
  <div>
    <h2 class="info-title">OKR团队分红明细</h2>
    <template v-if="showMap['']">
      <!-- <el-row :gutter="20" class="detail-title">
        <el-col :span="5" class="clear">
          <span>门店名称：</span>
          <span>{{baseInfo.orgUnitName}}</span>
        </el-col>
        <el-col :span="5" class="clear">
          <span class="label">门店奖金包：</span>
          <div class="text">{{baseInfo.storeBonus}}</div>
        </el-col>
      </el-row> -->
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
              :width="col.width"
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
            { prop: '', label: '序号', width: '120', align: 'center' },
            { prop: '', label: '团队', align: 'left', width: '140' },
            { prop: '', label: '组别', align: 'left', width: '120' },
            { prop: '', label: '核算时间段', align: 'center', width: '140' },
            { prop: '', label: '发放时间段', align: 'center', width: '140' },
            { prop: '', label: '薪资组', align: 'left', width: '140' },
            { prop: '', label: '工号', align: 'center', width: '120' },
            { prop: '', label: '姓名', align: 'left', width: '120' },
            { prop: '', label: '职务', align: 'left', width: '140' },
            { prop: '', label: 'OKR奖励分红额', align: 'right', width: '120' }
          ],
          setting: {
            editor: {
              // orgUnitName: {
              //   disable: true
              // }
            }
          },
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
