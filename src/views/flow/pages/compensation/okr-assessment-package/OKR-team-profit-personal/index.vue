<template>
  <div>
    <h2 class="info-title">OKR团队分红明细</h2>
    <template v-if="showMap['okrDetailTable']">
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
              type="index"
              label="序号"
              width="80">
            </el-table-column>
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
                  <el-input
                    v-if="col.prop === 'rewardBonus'"
                    v-model="scope.row.rewardBonus"
                    @change="handleRewadBonusChange($event, scope)"
                  ></el-input>
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
            { prop: 'orgUnitName', label: '团队', align: 'left', width: '140' },
            { prop: 'teamName', label: '组别', align: 'left', width: '120' },
            { prop: 'checkMonth', label: '核算时间段', align: 'center', width: '140' },
            { prop: 'grantMonth', label: '发放时间段', align: 'center', width: '140' },
            { prop: 'groupName', label: '薪资组', align: 'left', width: '140' },
            { prop: 'employeeCode', label: '工号', align: 'center', width: '120' },
            { prop: 'employeeName', label: '姓名', align: 'left', width: '120' },
            { prop: 'posTitleName', label: '职务', align: 'left', width: '140' },
            { prop: 'rewardBonus', label: 'OKR奖励分红额', align: 'right', width: '120' }
          ],
          setting: {
            editor: {
              orgUnitName: {
                disable: true
              },
              checkMonth: {
                disable: true
              },
              grantMonth: {
                disable: true
              },
              employeeCode: {
                disable: true
              },
              employeeName: {
                disable: true
              },
              posTitleName: {
                disable: true
              },
              teamName: {
                disable: true
              },
              groupName: {
                disable: true
              }
            }
          },
          data: this.data || [],
          editable: true
        }
      }
    },
    created () {
      this.table.disable = this.disabledMap.okrDetailTable
    },
    methods: {
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      handleRewadBonusChange (value, scope) {
        this.data.map(item => {
          item.rewardBonus = scope.row.rewardBonus
        })
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
