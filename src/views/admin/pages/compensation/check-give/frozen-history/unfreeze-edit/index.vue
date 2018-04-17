<template>
  <div>
    <p><i class="el-icon-warning warning"></i>解冻后，系统将为以下人员发起再次支付申请流程，请确认是否解冻？</p>
    <i-table :table="table" ref="table" @save="getTableData" @clone="getTableClone">
      <template slot="table" slot-scope="tableScope">
        <el-table
          :data="tableScope.clone"
          @row-click="rowClickHandler(tableScope, $event)">
          <el-table-column
            v-for="(col, idx) of table.columns"
            :key="idx"
            :prop="col.prop"
            :label="col.label"
            :align="col.align"
            v-if="col.label"
            >
            <template slot-scope="scope">
              <i-table-cell
                :row="scope.row"
                :col="col.prop"
                :table="tableScope"
                :formatter="tableScope.formatter"
              />
            </template>
          </el-table-column>
          <el-table-column prop="unblockedReason" label="解冻原因">
            <template slot-scope="scope">
              <i-table-cell
                :row="scope.row"
                col="unblockedReason"
                :table="tableScope"
                :formatter="tableScope.formatter"
                v-if="scope.row.show"
                @change="cellChange"
              />
              <el-input 
              v-if="!scope.row.show"
              v-model="scope.row.unblockedReason">
                <i slot="suffix" class="el-input__icon el-icon-error" @click="changeStyle(scope.row)"></i>
              </el-input>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </div>
</template>

<script>
import { showMessage } from 'utils/index'

export default {
  name: 'UnfreezeEdit',
  props: {
    accountList: Array
  },
  data () {
    return {
      table: {
        columns: [
          { prop: 'employeeCode', label: '工号' },
          { prop: 'fullName', label: '姓名' },
          { prop: 'blockedValue', label: '金额', display: {mixin: (row, col) => this.currencyFormat(row[col])}, align: 'right' },
          { prop: 'unblockedReason', display: { dict: 'UNBLOCKED_REASON' } }
        ],
        setting: {
          // operator: [{
          //   text: 'change',
          //   func: this.switch
          // }],
          editor: {
            employeeCode: {
              disable: true
            },
            fullName: {
              disable: true
            },
            blockedValue: {
              disable: true
            },
            unblockedReason: {
              type: 'select'
            }
          }
        },
        search: null,
        editable: true,
        data: null
      },
      loop: false,
      sendList: [],
      bool: false
    }
  },
  created () {
    this.table.data = this.accountList
    this.table.data.forEach(item => {
      item.show = true
    })
  },
  methods: {
    /** 监听行点击事件，并返回被点击的行对象 */
    rowClickHandler ({ rowClickHandler }, row) {
      rowClickHandler(row)
    },
    conforim () {
      return new Promise(resolve => {
        this.$refs.table.saveData()
        if (this.loop) {
          resolve(true)
        }
      })
    },
    /** 获取内部所有数据 */
    getTableClone (data) {
      this.loop = data.every(item => {
        return item.unblockedReason
      })
      // 解冻原因必须都填写
      if (!this.loop) {
        return showMessage('info', '请填写所有解冻原因')
      } else {
        // 拆分出解冻原因和冻结id
        this.sendList = []
        data.forEach(item => {
          let obj = {}
          obj.unblockedReason = item.unblockedReason
          obj.blockedRecordId = item.blockedRecordId
          obj.show = item.show
          this.sendList.push(obj)
        })
      }
    },
    /** 根据下拉选择改变输入框 */
    cellChange (row) {
      if (row.col === 'unblockedReason' && row.val === '03') {
        row.row.show = false
        row.row.unblockedReason = ''
      }
    },
    changeStyle (val) {
      val.show = true
      val.unblockedReason = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.el-icon-warning {
  color: red;
  font-size: 18px;
  margin-right: 20px;
}
</style>






