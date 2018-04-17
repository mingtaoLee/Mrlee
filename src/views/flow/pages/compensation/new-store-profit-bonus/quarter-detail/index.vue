<template>
  <div>
    <h2 class="info-title">新店奖金包分配明细（季度核算类）</h2>
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
        <el-col :span="5" class="clear">
          <span class="label">小店奖金包占和总比：</span>
          <el-tooltip :content="baseInfo.storeRatio" placement="bottom" effect="light">
            <div class="text">{{baseInfo.storeRatio}}</div>
          </el-tooltip>
        </el-col>
        <el-col :span="5" class="clear">
          <span class="label">小店奖金包总和：</span>
          <div class="text">{{baseInfo.storeBonusAmount}}</div>
        </el-col>
      </el-row>
      <i-table
        ref="iTable"
        class="info-content"
        :table="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :span-method="rowCombineMethod"
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
                  <el-input
                    v-if="col.prop === 'storeBonus'"
                    v-model="scope.row.storeBonus"
                    @change="handleStoreBonusChange($event, scope)"
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
            {prop: 'orgUnitName', label: '小店名称', width: '120'},
            {prop: 'storeBonus', label: '小店奖金包', width: '120'},
            {prop: 'storeRatio', label: '小店奖金包占比(%)', width: '150'},
            {prop: 'partnerNumber', label: '合伙人编制', width: '120'},
            {prop: 'employeeName', label: '合伙人姓名', width: '120'},
            {prop: 'employeeCode', label: '合伙人工号', width: '120'},
            {prop: 'posTitle', label: '职务', width: '120'},
            {prop: '', label: '个人分红-取值', width: '120'},
            {prop: 'enjoyMonth', label: '享受月数', width: '100'},
            {prop: '', label: '发放比例', width: '100'},
            {prop: '', label: '个人分红金额', width: '120'},
            {prop: 'shouldBonus', label: '应发保底分红合计', align: 'right', width: '120'},
            {prop: 'employeeSalary', label: '月薪标准合计', align: 'right', width: '120'},
            {prop: 'preWageStandard', label: '原工资标准', align: 'right', width: '100'},
            {prop: 'isCompare', label: '是否与原工资标准对比', align: 'right', width: '150'},
            {prop: '', label: '应发分红', width: '100'},
            {prop: 'actualBonus', label: '实发分红', align: 'right', width: '100'}
            // {prop: 'ratio', label: '享受比例(%)', align: 'right', width: '120'},
            // {prop: 'profitSharing', label: '应发新店利润分红', align: 'right', width: '140'}
          ],
          setting: {
            // import: {
            //   business: '',
            //   show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            // },
            editor: {
              orgUnitName: {
                disable: true
              },
              groupName: {
                disable: true
              },
              employeeName: {
                disable: true
              },
              partnerNumber: {
                disable: true
              },
              employeeCode: {
                disable: true
              },
              posTitle: {
                disable: true
              },
              ratio: {
                disable: true
              },
              storeRatio: {
                disable: true
              },
              profitSharing: {
                disable: true
              },
              bonusProp: {
                disable: true
              }
            }
          },
          editable: true,
          data: this.data
        }
      }
    },
    created () {
      this.table.disable = this.disabledMap.newStoreProfitBonusDetailTable
    },
    methods: {
      rowClickHandler ({rowClickHandler}, row) {
        rowClickHandler(row)
      },

      /** 奖金包数据改变监听 */
      handleStoreBonusChange (value, scope) {
        console.log(value, scope)
        let index = scope.$index
        const personNum = scope.row.employeeList.length

        for (let i = 0; i < personNum; i++) {
          this.setValue(value, personNum, scope.store.states.data[index])
          index++
        }
      },

      /** 获取iTable的clone数据 */
      getClone () {
        return this.$refs.iTable.clone
      },

      /** 根据奖金包设置对应奖金包占比和利润分红 */
      setValue (value, num, row) {
        row.storeRatio = ((parseFloat(value) / parseFloat(this.baseInfo.storeBonusAmount) * 100)).toFixed(2)
        row.bonusProp = (parseFloat(value) / num).toFixed(2)
        row.profitSharing = (row.bonusProp * row.ratio / 100).toFixed(2)
      },

      /** 行合并方法 */
      rowCombineMethod ({row, column, rowIndex, columnIndex}) {
        if (columnIndex < 4) {
          if (row.isCombine) {
            return {
              rowspan: row.combineNum,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  $labelWidth: 140px;

  .detail-title {
    margin-bottom: 10px;
    font-size: 14px;
  }

  .label {
    float: left;
    width: $labelWidth;
    text-align: right;
  }

  .text {
    margin-left: $labelWidth;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .btn {
    margin-top: 10px;
  }
</style>
