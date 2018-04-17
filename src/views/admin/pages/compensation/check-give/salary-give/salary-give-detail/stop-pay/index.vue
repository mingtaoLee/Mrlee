<template>
  <div>
    <p><i class="el-icon-warning"></i>以下人员将会被停止付款，请选择止付原因。</p>
    <i-table :table="table" ref="table" @save="getTableData" @clone="getTableClone">
      <template slot="table" slot-scope="tableScope">
        <el-table
          :data="tableScope.clone"
          @row-click="rowClickHandler(tableScope, $event)">
          <!-- 与常规表格相比，在编辑表格中 :formatter="tableScope.formatter" 需要在 i-table-cell 中引用 -->
          <el-table-column
            v-for="(col, idx) of table.columns"
            :key="idx"
            :align="col.align"
            :prop="col.prop"
            :label="col.label">
            <template slot-scope="scope">
              <i-table-cell
                :row="scope.row"
                :col="col.prop"
                :table="tableScope"
                :formatter="tableScope.formatter"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </div>
</template>

<script>
import ITable from 'components/common/i-table'
import ITableCell from 'components/common/i-table-cell'
import { showMessage } from 'utils/index'
import req from 'api/compensation/check-give/salary-give'

export default {
  name: 'SlaryGiveStopPay',
  props: {
    accountList: Array,
    processId: String
  },
  components: {
    ITable,
    ITableCell
  },
  data () {
    return {
      table: {
        columns: [
          { prop: 'employeeCode', label: '工号', align: 'center' },
          { prop: 'fullName', label: '姓名', align: 'center' },
          { prop: 'idNumber', label: '身份证', align: 'center' },
          { prop: 'realwagesAccount', label: '金额', align: 'center' },
          { prop: 'blockedReason', label: '止付原因', align: 'center', display: { dict: 'BLOCKED_REASON' } }
        ],
        setting: {
          editor: {
            employeeCode: {
              disable: true
            },
            fullName: {
              disable: true
            },
            idNumber: {
              disable: true
            },
            realwagesAccount: {
              disable: true
            },
            blockedReason: {
              type: 'select'
            }
          }
        },
        editable: true,
        data: null
      },
      loop: false,
      sendList: [],
      sendFlowList: []
    }
  },
  created () {
    this.table.data = this.accountList
  },
  updated () {
  },
  methods: {
    /** 监听行点击事件，并返回被点击的行对象 */
    rowClickHandler ({ rowClickHandler }, row) {
      rowClickHandler(row)
    },
    /** 确认止付函数,后端做止付前确认 */
    confirm () {
      return new Promise(resolve => {
        this.$refs.table.saveData()
        if (this.loop) {
          this.sendFlowList.processId = this.processId
          req('putStopPay', this.sendFlowList).then(res => {
            if (res) {
              resolve(res)
            } else {
              resolve(false)
            }
          })
        }
      })
    },
    /** 获取内部所有数据 */
    getTableClone (data) {
      this.loop = data.every(item => {
        return item.blockedReason
      })
      // 止付原因必须都填写
      if (!this.loop) {
        return showMessage('info', '请填写所有止付原因')
      } else {
        // 切割出id和止付原因
        this.sendFlowList = []
        data.forEach((item, idx) => {
          let obj = {}
          obj.employeeId = item.employeeId
          obj.blockedReason = item.blockedReason
          this.sendFlowList.push(obj)
        })
      }
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

