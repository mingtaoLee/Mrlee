<template>
  <i-table
    :table="table"
    ref="table" 
    @save="saveData" 
    @clone="getTableClone" 
    @loaded="handleLoaded"
  >
    <template slot="table" slot-scope="tableScope">
      <el-table 
        :data="tableScope.clone"
        style="width: 100%"
        @selection-change="selectionChangeHandler(tableScope, $event)"
        @row-click="rowClickHandler(tableScope, $event)"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="60"
        ></el-table-column>
        <el-table-column prop="fullName" label="姓名" width="100px" align="left">
          <template slot-scope="scope">
            <i-table-cell
              :table="tableScope"
              :row="scope.row"
              col="fullName"
              :formatter="tableScope.formatter"
              @change="changeData"
              ref="employeemCell"
            >
              <el-input 
                v-model="scope.row.fullName"
                @click.native="handleIconClick(scope)"
                :disabled="editable"
                readonly
              >
                <i slot="suffix" class="el-input__icon iconfont icon-hr" @click.native="handleIconClick(scope)" ></i>
              </el-input>
              <i-personnel-select 
                :isShow.sync="isShow" 
                @confirm="handleConfirm($event, scope)"
                :disabled="editable" 
                :multiple="false"
              >
              </i-personnel-select>
            </i-table-cell>
          </template> 
        </el-table-column>

        <el-table-column
          v-for="(col, idx) of table.columns || []"
          :key="idx"
          :prop="col.prop"
          :label="col.label"
          :formatter="tableScope.formatter"
          :width="col.width"
          :align="col.align"
          v-if="col.label"
        >
          <template slot-scope="scope">
            <i-table-cell
              :row="scope.row"
              :col="col.prop"
              :table="tableScope"
              ref="cell"
              @change="changeData"
            >
            </i-table-cell>
          </template>
        </el-table-column>

        <el-table-column 
          prop="shareWay" 
          label="选择分摊方式" 
          width="150" 
          v-else-if="col.isshareWay"
        >
          <template slot-scope="scope">
            <i-table-cell
              :table="tableScope"
              :row="scope.row"
              col="shareWay"
              :formatter="tableScope.formatter"
              @change="changeData"
              ref="cell"
            >
              <!-- <el-select v-model="scope.row.shareWay" @change='radioSelect(scope)' placeholder="请选择">
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
            </i-table-cell>
          </template> 
        </el-table-column>

        <el-table-column 
          prop="allocationProportion" 
          label="分摊比例" 
          width="150" 
          v-else-if="col.isAllocationProportion"
        >
          <template slot-scope="scope">
            <i-table-cell
              :table="tableScope"
              :row="scope.row"
              col="allocationProportion"
              :formatter="tableScope.formatter"
              ref="cell"
              @change='changeData'
            >
              <el-input 
                type="number" 
                v-model="scope.row.allocationProportion" 
                min='0'
                placeholder="请输入"
                @input='changeProportion'
                @change="changeProportion"
              >
                <template slot="append">
                  <span>%</span>
                </template>
              </el-input>
            </i-table-cell>
          </template> 
        </el-table-column>

        <el-table-column 
          prop="internalOrder" 
          label="内部订单号" 
          width="140"  
          v-else-if="col.isInternalOrder"
          >
          <template slot-scope="scope">
            <i-table-cell
              :table="tableScope"
              :row="scope.row"
              col="internalOrder"
              :formatter="tableScope.formatter"
              @change="changeData"
              >
              <el-input 
                v-model="scope.row.internalOrder"
                suffix-icon="el-icon-menu"
                :disabled="editable"
                readonly 
                @click.native="openOrderTable(scope)"
                >
                </el-input>
                <i-dialog
                  title="选取订单号"
                  v-model="isShowOrderTable"
                  :toolbar="orderEditToolbar"
                  destroyedWhenClose
                  size="large"
                  >
                  <order-table ref="orderTable"></order-table>
                </i-dialog>
            </i-table-cell>
          </template> 
        </el-table-column>
      </el-table>
    </template>
  </i-table>
</template>

<script>
import ISelect from 'components/common/i-select/i-select'
import OrderTable from './orderTable'
import req from '../../../../../../api/compensation/check-give/flow'
import IProcessFlow from 'components/common/i-process-flow'
import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import IDialog from 'components/common/i-dialog/i-dialog'
import ITable from 'components/common/i-table'
import ITableCell from 'components/common/i-table-cell'
import { showMessage, getRule } from 'utils/index'
import { formatDate } from 'utils/organization'
export default {
  name: 'InsideCost',
  components: {
    ISelect,
    IProcessFlow,
    IPersonnelSelect,
    IDialog,
    ITable,
    ITableCell,
    OrderTable
  },
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    tableDisable: Object
  },
  data () {
    return {
      isdata: '',
      selectOptions: [{
        value: '分摊比例'
      }, {
        value: '分摊金额'
      }],
      isMonthOK: true,
      isShow: false,
      isShowOrderTable: false,
      // 用于校验分摊天数
      // verifyDay: '',
      table: {
        columns: [
          { prop: 'fullName' },
          { prop: 'employeeCode', label: '工号', width: '120', align: 'center' },
          { prop: 'transferMonth', label: '划拨月份', width: '130', align: 'center', display: { date: 'short' } },
          { prop: 'beginDate', label: '开始时间', width: '150', display: { date: 'default' }, align: 'center' },
          { prop: 'endDate', label: '结束时间', width: '150', display: { date: 'default' }, align: 'center' },
          { prop: 'allocationDay', label: '费用分摊天数', width: '120', align: 'center' },
          { prop: 'aufnType', label: '订单类型', width: '120', align: 'center', display: {dict: 'AUFN_TRANSFER_TYPE'} },
          { prop: 'internalOrder', isInternalOrder: true },
          { prop: 'cropCode', label: '订单公司代码', width: '120', align: 'center' },
          { prop: 'shareWay', isshareWay: true, display: {dict: 'SHARE_WAY'}, width: '150' },
          { prop: 'allocationProportion', isAllocationProportion: true },
          { prop: 'allocationAmount', label: '分摊金额', width: '120', align: 'center', display: {mixin: (row, col) => this.currencyFormat(row[col])} },
          { prop: 'remark', label: '备注', width: '150', align: 'center' },
          { prop: 'transferOutPersonnelName', label: '划出人事范围', width: '160', align: 'left' },
          { prop: 'transferOutPersonnelCode', label: '划出人事范围代码', width: '160', align: 'left' },
          { prop: 'costCenterOutCode', label: '划出成本中心', width: '160', align: 'left' },
          { prop: 'costCenterOutName', label: '划出成本中心代码', width: '160', align: 'left' },
           // 是否处理分摊比例, 该值会传到审批页面
          { prop: 'isProcessAllocationProportion' }
        ], // 表头
        setting: {
          import: {
            business: ''
          },
          toolbar: [{
            text: '添加',
            func: vm => vm.createData(),
            show: () => {
              return { disable: this.disabledMap.innerAddButton, empty: !this.showMap.innerAddButton }
            }
          }, {
            text: '删除',
            type: 'danger',
            func: vm => vm.deleteData(),
            show: () => {
              return { disable: this.disabledMap.innerDelButton, empty: !this.showMap.innerDelButton }
            }
          }],
          // 表格编辑
          editor: {
            fullName: {
              rules: getRule('请选择员工姓名', 'change')
            },
            employeeCode: {
              disable: true
            },
            transferMonth: {
              type: 'date',
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请选择划拨月份'))
                  cb()
                }
              }],
              options: {
                type: 'month',
                disabledDate: (time) => {
                  let days = new Date()
                  if (days.getDate() > 3) {
                    return time.getTime() < days - days.getDate() * 24 * 3600 * 1000
                  } else {
                    return time.getTime() < days.setMonth(days.getMonth() - 1)
                  }
                }
              }
            },
            beginDate: {
              type: 'date',
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请选择开始时间'))
                  cb()
                }
              }]
            },
            endDate: {
              type: 'date',
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请选择结束时间'))
                  new Date(value).getTime() < new Date(this.curRow.beginDate || 0).getTime() && cb(new Error('时间不得早于开始时间'))
                  cb()
                }
              }]
            },
            allocationDay: {
              type: 'number',
              disable: false,
              rules: [{ required: false,
                validator: (rule, value, cb) => {
                  value < 0 && cb(new Error('天数不能为负数')) || cb()
                }
              }]
            },
            aufnType: {
              type: 'select',
              disable: false,
              rules: getRule('请选择订单类型', 'change')
            },
            internalOrder: {
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请选择内部订单号'))
                  cb()
                }
              }]
            },
            shareWay: {
              type: 'select',
              rules: getRule('请选择分摊方式', 'change')
            },
            cropCode: {
              disable: true
            },
            allocationProportion: {
              disable: false,
              rules: [{
                validator: (rule, value, cb) => {
                  if (value > 100) {
                    cb(new Error('分摊比例不能超过100'))
                  }
                  cb()
                }
              }]
            },
            allocationAmount: {
              type: 'number',
              disable: false,
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  if (value === '0.00') {
                    cb()
                  }
                  !value && cb(new Error('请输入金额'))
                  cb()
                }
              }]
            },
            remark: {
              type: 'textarea',
              disable: false
            },
            transferOutPersonnelName: {
              disable: true
            },
            transferOutPersonnelCode: {
              disable: true
            },
            costCenterOutName: {
              disable: true
            },
            costCenterOutCode: {
              disable: true
            }
          }
        },
        editable: true,
        data: null // 占位符，用于挂载数据
      },
      // 内部订单选择编辑按钮
      orderEditToolbar: [
        {
          text: '返回',
          type: 'plain',
          func: done => {
            this.handleCancel(done)
          }
        },
        {
          text: '确认',
          func: done => {
            this.handleSave(done)
          }
        }
      ],
      curRow: {},
      itable: null,
      insideCostData: null
    }
  },
  created () {
    // this.showMap.transferCode = 0
    this.setTableDisabled()
  },
  mounted () {
    this.table.data = this.data
  },
  methods: {
    rowClickHandler ({ rowClickHandler }, row) {
      this.curRow = row
      this.isdata = this.curRow._id
      rowClickHandler(row)
    },
    selectionChangeHandler ({ selectionChangeHandler }, selection) {
      selectionChangeHandler(selection)
    },
    // 配置权限
    setTableDisabled () {
      this.table.setting.toolbar = this.tableDisable.innerOrderTable ? [] : this.table.setting.toolbar
      this.table.disable = this.tableDisable.innerOrderTable
    },
    // 触发表单校验
    triggerValidate () {
      this.$refs.cell.map(el => el.validate())
    },
    // 点击出现选择框
    handleIconClick () {
      this.isShow = !this.isShow
    },
    openOrderTable () {
      this.isShowOrderTable = true
    },
    //  人员选择方法
    handleConfirm (selected) {
        //  选中的人员数组
      if (selected.length === 1) {
        this.fetch({ employeeId: selected[0].employeeId })
        if (this.curRow.transferMonth !== '') {
          req('getCount', { month: formatDate(this.curRow.transferMonth).slice(0, 7), employeeId: selected[0].employeeId }).then(res => {
            this.curRow.salaryAmount = res.salaryAmount
            this.curRow.attendanceDay = res.attendanceDay
            this.curRow.verifyDay = res.verifyDay == null ? 0 : res.verifyDay // 获取检验分摊天数
            this.isMonthOK = true
          }).catch(() => {
            this.isMonthOK = false
          })
        }
      }
    },
    // 组织选择
    clickSelect (data, row) {
      row.transferInUnitCode = data.orgUnitCode
      this.fetchTransferInCostCenterCode({unitId: data.orgUnitId})
    },
     /** 订单号窗口按钮 */
    handleSave (done) {
      let order = this.$refs.orderTable.selectOrder
      if (!order) {
        return showMessage('warning', '请选择一个订单号')
      } else {
        console.log(1, order)
        this.curRow.internalOrder = order.aufnCode
        this.curRow.cropCode = order.cropCode
      }
      done()
    },
    handleCancel (done) {
      done()
    },
    // 申请数据
    fetch (options = {}) {
      req('getInsideCostAllocation', options)
      .then(res => {
        this.curRow = Object.assign(this.curRow, res)
        this.$refs.employeemCell.validate()
        this.triggerValidate()
      })
    },
    // 选择分摊比例或金额提醒
    radioWarn () {
      if (!this.curRow.employeeId) {
        return showMessage('warning', '请选择员工')
      }
      if (!this.curRow.transferMonth) {
        return showMessage('warning', '请选择划拨月份')
      }
    },
    // 选择分摊比例或金额
    radioSelect (val) {
      this.radioWarn()
      if (this.curRow.shareWay === '01') {
        this.curRow.allocationProportion = 100
        this.countAllocationAmount()
      } else {
        this.curRow.allocationProportion = ''
        this.curRow.allocationAmount = ''
      }
    },
    // 分摊金额计算
    countAllocationAmount () {
      if (this.judgeMonEmp()) { // 判断选择的分摊比例，并且划拨月份和员工已经选择
        if (this.curRow.allocationDay === '') {
          this.curRow.allocationAmount = (this.curRow.salaryAmount * this.curRow.allocationProportion / 100).toFixed(2)
        } else {
          this.curRow.allocationAmount = (this.curRow.salaryAmount * this.curRow.allocationProportion / 100 * this.curRow.allocationDay / this.curRow.attendanceDay).toFixed(2)
        }
      }
    },
      // 获取月份的最后一天
    getMonthLastDay (data) {
      let monthDate = new Date(data)
      let currentMonth = monthDate.getMonth()
      let nextMonth = ++currentMonth
      let nextMonthFirstDay = new Date(monthDate.getFullYear(), nextMonth, 1)
      return new Date(nextMonthFirstDay - 1000 * 60 * 60 * 24).getTime()
    },
    // 监听表格数据变化
    changeData (val) {
      // 只有在选分摊比例/分摊金额的时候才触发
      if (val.col === 'shareWay') {
        this.radioSelect()
      }
      // 选择分摊比例，分摊金额不可编辑 ,不可编辑,校验信息无法显示
      // if (this.curRow.allocationProportion === 100 || this.curRow.shareWay === '01') {
      //   val.updateDisabled(true, this.$refs.cell, 'allocationAmount', 'row')
      // } else {
      //   val.updateDisabled(false, this.$refs.cell, 'allocationAmount', 'row')
      // }

      // 触发金额校验
      // if (this.curRow.fullName && this.curRow.transferMonth) {
      //   val.updateRules([{ required: true,
      //     validator: (rule, value, cb) => {
      //       if (value === '0.00') {
      //         return cb()
      //       } else if (!value) {
      //         return cb(new Error('请输入金额'))
      //       } else if (value > this.curRow.salaryAmount) {
      //         return cb(new Error('分摊金额过大'))
      //       }
      //       cb()
      //     }
      //   }], this.$refs.cell, 'allocationAmount')
      // }

      // 监听
      if (val.col === 'transferMonth') {
        // 改变月份时，判断如果存在姓名和工号，即可请求当月工资和考勤天数
        if (this.checkDataSataus(['fullName', 'employeeId'])) {
          this.getSalaryAmount(val)
        }
        this.curRow.beginDate = this.curRow.transferMonth
        this.curRow.endDate = this.getMonthLastDay(this.curRow.transferMonth)
      }
      // 改变选择员工时，判断如果存在划拨月份，即可请求当月工资和考勤天数
      if (val.col === 'fullName') {
        if (this.checkDataSataus(['transferMonth'])) {
          this.getSalaryAmount(val)
        }
      }
      // 分摊天数变化时候，自动计算分摊金额
      if (val.col === 'allocationDay') {
          // 分摊天数的校验
        val.updateRules([{ required: false,
          validator: (rule, value, cb) => {
            if (value < 0) {
              return cb(new Error('天数不能为负数'))
            } else if (!this.isMonthOK && value) {
              return cb(new Error('该月份没有考勤信息'))
            } else if (value > this.curRow.verifyDay) {
              return cb(new Error('分摊天数过大'))
            }
            cb()
          }
        }])
        this.countAllocationAmount()
      }
      // 监听分摊比例变化，字段计算金额
      // if (val.col === 'allocationProportion') {
      //   this.countAllocationAmount()
      // }
    },
    // 判断输入值的组合状态
    checkDataSataus (arr) {
      return arr.every(item => {
        return this.curRow[item]
      })
    },
    // 判断划拨月份划和人员已经选择
    judgeMonEmp () {
      return this.curRow.shareWay === '01' && this.checkDataSataus(['transferMonth', 'fullName'])
    },
    // 根据月份和员工工号查询当月工资和当月的出勤天数
    getSalaryAmount (val) {
      req('getCount', { employeeId: val.row.employeeId, month: formatDate(this.curRow.transferMonth).slice(0, 7) }).then(res => {
        this.curRow.salaryAmount = res.salaryAmount // 当月工资
        this.curRow.attendanceDay = res.attendanceDay // 出勤天数
        this.curRow.verifyDay = res.verifyDay == null ? 0 : res.verifyDay // 获取检验分摊天数
        this.isMonthOK = true
      }).catch(() => {
        this.isMonthOK = false
      })
    },
    // 分摊比例变化时候，自动计算分摊金额
    changeProportion () {
      this.countAllocationAmount()
    },
    getTableClone (data) {
      // console.log(data, 'data')
      // data[0].allocationProportion = data[0].allocationProportion ? data[0].allocationProportion / 100 : ''
      console.log('clone')
      this.insideCostData = data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
