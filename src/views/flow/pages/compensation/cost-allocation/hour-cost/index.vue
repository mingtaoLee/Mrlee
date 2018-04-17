<template>
  <i-table
    :table="table"
    ref="table" 
    @save="saveData" 
    @clone="getTableClone" 
    @loaded="handleLoaded"
    :rules="rules"
  >
    <template slot="table" slot-scope="tableScope">
      <el-table 
        :data="tableScope.clone"
        style="width: 100%"
        @row-click="rowClickHandler(tableScope, $event)"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="序号"
          align="center"
          type="index"
          width="60"
        ></el-table-column>

        <el-table-column 
          prop="transferWay" 
          label="选择划拨种类" 
          width="140" 
        >
          <template slot-scope="scope">
            <i-table-cell
              :table="tableScope"
              :row="scope.row"
              col="transferWay"
              :formatter="tableScope.formatter"
              @change="changeData"
            >
              <!-- <el-select v-model="scope.row.transferWay" placeholder="请选择">
                <el-option
                  v-for="item in transfertOptions"
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
          prop="fullName" 
          label="姓名" 
          align='left'
          min-width="120"
        >
          <template slot-scope="scope">
            <i-table-cell
              :table="tableScope"
              :row="scope.row"
              col="fullName"
              ref="employeemCell"
              :formatter="tableScope.formatter"
              @change="changeData"
            >
              <el-input 
                v-model="scope.row.fullName" 
                @click.native="handleIconClick" 
                :disabled="editable" 
                readonly
              >
                <i slot="suffix" class="el-input__icon iconfont icon-hr" @click.native="handleIconClick" ></i>
              </el-input>
              <i-personnel-select 
                :isShow.sync="isShow" 
                @confirm="handleConfirm" 
                :disabled="editable" 
                :multiple="false" 
              ></i-personnel-select>
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
          <el-table-column
            v-for="son of col.children"
            :key="son.prop"
            :prop="son.prop"
            :label="son.label"
            :width="son.width"
            v-if="son.label"
           >
            <template slot-scope="scope">
              <i-table-cell 
               :row="scope.row" 
               :col="son.prop" 
               :table="tableScope"
               ref='childCell'
               @change="changeData"
              ></i-table-cell>
            </template>
          </el-table-column>
          
          <el-table-column 
            prop="shareWay" 
            label="选择分摊方式" 
            width="100" 
            v-else-if="son.isshareWay"
          >
          <template slot-scope="scope">
            <i-table-cell
              :table="tableScope"
              :row="scope.row"
              col="shareWay"
              son="shareWay"
              ref='childCell'
              :formatter="tableScope.formatter"
              @change="changeData"
            >
              <el-select v-model="scope.row.shareWay" @change='radioSelect' placeholder="请选择">
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </i-table-cell>
          </template> 
         </el-table-column>

         <el-table-column 
          prop="allocationProportion" 
          label="分摊比例" 
          width="150" 
          ref='childCell'
          v-else-if="son.isAllocationProportion"
        >
          <template slot-scope="scope">
            <i-table-cell
              :table="tableScope"
              :row="scope.row"
              col="allocationProportion"
              ref='childCell'
              son="allocationProportion"
              :formatter="tableScope.formatter"
            >
              <el-input 
                type="number" 
                v-model="scope.row.allocationProportion" 
                min='0'
                placeholder="请输入"
                @input='changeAllocationCount'
                @change="changeAllocationCount"
              >
                <template slot="append">
                  <span>%</span>
                </template>
              </el-input>
            </i-table-cell>
           </template> 
         </el-table-column>
        </el-table-column>

        <el-table-column 
          prop="orgUnitName" 
          label="划入组织" 
          width="140" 
          v-else-if="col.isUnitId"
        >
          <template slot-scope="scope">
            <i-table-cell
              :table="tableScope"
              :row="scope.row"
              col="orgUnitName"
              :formatter="tableScope.formatter"
              @change="changeData"
            >
              <i-select-tree
                :multiple="false"
                v-model="scope.row.unitId"
                dataKey="org"
                nodeKey="orgUnitId"
                treeWidth='140'
                @input="handleChange"
                @node-click="clickSelect($event, scope.row)"
                lazy
              >
              </i-select-tree>
            </i-table-cell>
          </template>
        </el-table-column>

        <el-table-column 
          prop="transferInPersonnelName" 
          label="划入人事范围" 
          width="140" 
          v-else-if="col.isTransferInPersonnelName"
        >
          <template slot-scope="scope">
            <i-table-cell
              :table="tableScope"
              :row="scope.row"
              col="transferInPersonnelName"
              :formatter="tableScope.formatter"
              @change="changeData"
            >
              <remote-select
                v-model="scope.row.transferInPersonnelName"
                :props="personalAreaProps"
                @option-click="transferIn"
                dataKey="personnelGroup"
                filterable
              ></remote-select>
            </i-table-cell>
          </template>
        </el-table-column>

        <el-table-column 
          prop="costCenterInName" 
          label="划入成本中心" 
          width="160" 
          v-else-if="col.isCostCenterInName"
        >
          <template slot-scope="scope">
            <i-table-cell
              :table="tableScope"
              :row="scope.row"
              col="costCenterInName"
              :formatter="tableScope.formatter"
              @change="changeData"
            >
              <remote-select
                v-model="scope.row.costCenterInName"
                :props="costCenterProps"
                dataKey="costCenter"
                @option-click="getCostCenterCode"
                filterable
              ></remote-select>
            </i-table-cell>
          </template>
        </el-table-column>

      </el-table>
    </template>
  </i-table>
</template>

<script>
import ISelect from 'components/common/i-select/i-select'
import req from '../../../../../../api/compensation/check-give/flow'
import IProcessFlow from 'components/common/i-process-flow'
import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import IDialog from 'components/common/i-dialog/i-dialog'
import ITable from 'components/common/i-table'
import ITableCell from 'components/common/i-table-cell'
import { showMessage, getRule } from 'utils/index'
import { formatDate } from 'utils/organization'
import RemoteSelect from 'components/compensation/remote-select/index'

  // required 是否必填 ，str错误提示信息，max最大值，isPositive对负数进行校验 ,str2大于最大值的提示
// const checkAmountRule = (required = true, str, max, isPositive = true, str2) => {
//   return (rule, value, callback) => {
//     if (required && str && !value && value !== 0) {
//       // 必填，有提示信息，空值的提示
//       return callback(new Error(str))
//     } else if (!required && !value) {
//       // 非必填，空值的提示，无提示
//       return callback()
//     } else if (value > max && value !== '0.00') {
//       return callback(new Error(str2))
//     } else if (isPositive && value < 0) {
//       return callback(new Error('输入不能为负数'))
//     } else {
//       callback()
//     }
//   }
// }

export default {
  name: 'HourCost',
  components: {
    ISelect,
    IProcessFlow,
    IPersonnelSelect,
    IDialog,
    ITable,
    ITableCell,
    RemoteSelect
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
      isShow: false,
      // 用来判断切换费用划拨类型时是否有数据
      isdata: '',
      // 成本中心数据
      // costCenterData: [],
      // 成本中心下拉配置
      costCenterProps: {
        value: 'costCenterCode',
        label: 'costCenterName'
      },
      // // 配置工时列表
      // hourList: ['transferHours', 'transferReason', 'workRemark'],
      // // 配置费用列表
      // costList: ['allocationDays', 'holidayDays', 'costType'],
       // 人事范围下拉配置
      personalAreaProps: {
        value: 'personnelGroupName',
        label: 'personnelGroupName'
      },
      // 选择分摊方式
      selectOptions: [{
        value: '分摊比例'
      }, {
        value: '分摊金额'
      }],
      // 人员ID
      employeeId: '',
      isrequired: false,
      // 分摊金额数据
      countData: {
        employeeId: '',
        transferMonth: '',
        allocationDays: '',
        holidayDays: '',
        costType: '',
        allocationProportion: '',
        shareWay: ''
      },
      show: {
        isAllocationDays: false, // 费用分摊天数
        isHolidayDays: false, // 法定节假日
        isShareWay: false, // 分摊方式
        isAllocationProportion: false, // 分摊比例
        isAllocationAmount: false, // 分摊金额
        isSupportAmount: false, // 支援补贴金额
        isOvertimePay: false // 节假日加班费
      },
      table: {
        columns: [
          { prop: 'transferWay', display: {dict: 'TRANSFER_SELECT'} },
          { prop: 'fullName' },
          { prop: 'employeeCode', label: '工号', width: '120', align: 'center' },
          { prop: 'transferMonth', label: '划拨月份', width: '130', align: 'center', display: { date: 'short' } },
          { prop: 'beginDate', label: '开始时间', width: '150', display: { date: 'default' }, align: 'center' },
          { prop: 'endDate', label: '结束时间', width: '150', display: { date: 'default' }, align: 'center' },
          { prop: 'orgUnitName', isUnitId: true },
          { prop: 'transferInPersonnelName', isTransferInPersonnelName: true },
          { prop: 'transferInPersonnelCode', label: '划入人事范围代码', width: '120', align: 'left' },
          { prop: 'costCenterInName', isCostCenterInName: true },
          { prop: 'costCenterInCode', label: '划入成本中心代码', width: '120', align: 'left' },
          {
            prop: 'cost',
            label: '费用划拨',
            children: [
              { prop: 'costType', label: '费用类型', width: '160', display: {dict: 'EXPENSE_TRANSFER_TYPE'} },
              { prop: 'allocationDays', label: '费用分摊天数', width: '120' },
              { prop: 'holidayDays', label: '含法定假期天数', width: '120' },
              { prop: 'supportAmount', label: '支援补贴金额', width: '120' },
              { prop: 'overtimePay', label: '含法定加班费', width: '120' },
              { prop: 'shareWay', isshareWay: true },
              { prop: 'allocationProportion', isAllocationProportion: true },
              { prop: 'allocationAmount', label: '分摊金额', width: '120' },
              { prop: 'remark', label: '备注', width: '160' },
              { prop: 'isAllocationAmountTrue' }// 用于校验金额
            ]
          },
          {
            prop: 'hour',
            label: '工时划拨',
            children: [
              { prop: 'transferHours', label: '划拨工时', width: '100', align: 'right' },
              { prop: 'transferReason', label: '划拨原因', align: 'left', width: '100', display: {dict: 'LABORHOUR_TRANSFER_REASON'} },
              { prop: 'workRemark', label: '备注', width: '150' }
            ]
          },
          { prop: 'transferOutPersonnelName', label: '划出人事范围', width: '120', align: 'left' },
          { prop: 'transferOutPersonnelCode', label: '划出人事范围代码', width: '120', align: 'left' },
          { prop: 'costCenterOutName', label: '划出成本中心', width: '120', align: 'left' },
          { prop: 'costCenterOutCode', label: '划出成本中心代码', width: '120', align: 'left' }
        ], // 表头
        setting: {
          import: {
            business: '',
            show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
          },
          toolbar: [{
            text: '添加',
            func: vm => vm.createData({
            }),
            show: () => {
              return { disable: this.disabledMap.addButton, empty: !this.showMap.addButton }
            }
          }, {
            text: '删除',
            type: 'danger',
            func: vm => vm.deleteData(),
            show: () => {
              return { disable: this.disabledMap.delButton, empty: !this.showMap.delButton }
            }
          }],
          // 表格编辑
            // --------------公共部分配置-------------------------------
          editor: {
            transferWay: {
              type: 'select',
              rules: getRule('请选择划拨流程类型', 'change')
            },
            fullName: {
              rules: getRule('请选择姓名', 'change')
            },
            employeeCode: {
              disable: true
            },
            transferMonth: {
              type: 'date',
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请选择划拨月份')) || cb()
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
                  !value && cb(new Error('请选择开始日期')) || cb()
                }
              }]
            },
            endDate: {
              type: 'date',
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请选择结束日期'))
                  new Date(value).getTime() < new Date(this.curRow.beginDate || 0).getTime() && cb(new Error('时间不得早于开始日期')) || cb()
                }
              }]
            },
            orgUnitName: {
              rules: getRule('请选择划入组织', 'change'),
              disable: false
            },
            transferInPersonnelName: {
              rules: getRule('请选择划入人事范围', 'change'),
              disable: false
            },
            transferInPersonnelCode: {
              disable: true
            },
            costCenterInName: {
              rules: getRule('请选择划入成本中心', 'change'),
              disable: false
            },
            costCenterInCode: {
              disable: true
            },
            // --------------------- 费用划拨配置----------------------------
            allocationDays: {
              disable: false,
              type: 'number',
              rules: [{ required: false,
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请输入天数'))
                  value < 0 && cb(new Error('天数不能为负数')) || cb()
                }
              }]
            },
            holidayDays: {
              type: 'number',
              rules: [{ required: false,
                validator: (rule, value, cb) => {
                  // !value && cb(new Error('请输入天数'))
                  value < 0 && cb(new Error('天数不能为负数')) || cb()
                }
              }]
            },
            costType: {
              type: 'select',
              rules: getRule('请选择费用类型', 'change')
            },
            supportAmount: {
              type: 'number',
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  // !value && cb(new Error('分摊金额不能为空'))
                  value < 0 && cb(new Error('金额不能为负数')) || cb()
                }
              }]
            },
            overtimePay: {
              type: 'number',
              rules: [{ required: false,
                validator: (rule, value, cb) => {
                  // !value && cb(new Error('请输入金额'))
                  value < 0 && cb(new Error('金额不能为负数')) || cb()
                }
              }]
            },
            shareWay: {
              type: 'select'
              // rules: getRule('请选择分摊方式', 'change')
            },
            allocationProportion: {
              disable: false,
              rules: [{ required: this.isrequired,
                validator: (rule, value, cb) => {
                  // if (!value) {
                  //   return cb(new Error('请输入比例'))
                  // }
                  if (value < 0) {
                    cb(new Error('比例不能为负数'))
                  } else
                  if (value > 100) {
                    cb(new Error('输入比例过大'))
                  } else {
                    cb()
                  }
                }
              }]
            },
            allocationAmount: {
              disable: false,
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请输入分摊金额'))
                  this.curRow.isAllocationAmountTrue === '2' && cb(new Error('分摊金额不能大于当月工资总额'))
                  this.curRow.isAllocationAmountTrue === '3' && cb(new Error('无考勤信息'))
                  cb()
                }
              }]
            },
            remark: {
              type: 'textarea',
              dislabe: false
            },
            // --------------------工时划拨配置-------------------------
            transferHours: {
              type: 'number',
              disable: false,
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请输入划拨工时'))
                  value < 0 && cb(new Error('划拨工时不能为负数')) || cb()
                }
              }]
            },
            transferReason: {
              disable: false,
              type: 'select',
              rules: getRule('请选择分摊方式', 'change')
            },
            workRemark: {
              type: 'textarea',
              dislabe: false
            },
            // --------------------- 公共 -------------------------------
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
      curRow: {},
      itable: null,
      hourCostData: null,
      costDisable: [ 'allocationDays', 'holidayDays', 'costType', 'supportAmount', 'overtimePay', 'shareWay', 'allocationProportion', 'allocationAmount', 'remark' ],
      laborDisable: [ 'transferHours', 'transferReason', 'workRemark' ],
      allDisable: [ 'allocationDays', 'holidayDays', 'costType', 'supportAmount', 'overtimePay', 'shareWay', 'allocationProportion', 'allocationAmount', 'remark', 'transferHours', 'transferReason', 'workRemark' ]
    }
  },
  created () {
    // this.showMap.transferCode = 1
    this.getPostcenter()
    this.setTableDisabled()
    // 判断如果在审批界面就清空所有的校验
    if (this.$route.query.taskKey) {
      const arr = Object.keys(this.table.setting.editor)
      arr.map(key => {
        this.table.setting.editor[key].rules = []
      })
    }
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
      this.table.setting.toolbar = this.tableDisable.costHourTable ? [] : this.table.setting.toolbar
      this.table.disable = this.tableDisable.costHourTable
    },
    // 触发表单校验
    triggerValidate () {
      this.$refs.cell.map(el => el.validate())
    },
    // 触发childCell校验
    triggerChild () {
      this.$refs.childCell.map(el => el.validate())
    },
    // 点击出现选择框
    handleIconClick () {
      this.isShow = !this.isShow
    },
    //  人员选择方法
    handleConfirm (selected) {
        //  选中的人员数组
      if (selected.length === 1) {
        this.employeeId = selected[0].employeeId
        this.fetchOutStore({ employeeId: selected[0].employeeId })
        this.fetch({ employeeId: selected[0].employeeId })
      }
    },
    // 组织选择
    clickSelect (data, row) {
      row.orgUnitName = data.orgUnitName
      row.orgUnitId = data.orgUnitId
      req('getStore', { transferInUnitId: row.orgUnitId }).then(res => {
        this.curRow.transferInStore = res.transferInStore
        this.curRow.transferInStoreCode = res.transferInStoreCode
        this.curRow.transferInStoreName = res.transferInStoreName
        this.curRow.transferInUnit = res.transferInUnit
        this.curRow.transferInUnitName = res.transferInUnitName
        this.curRow.transferInUnitCode = res.transferInUnitCode
        this.curRow.transferInPunit = res.transferInPunit
        this.curRow.transferInPunitCode = res.transferInPunitCode
        this.curRow.transferInPunitName = res.transferInPunitName
      })
    },
    // 划入人事范围
    transferIn (data) {
      this.curRow.transferInPersonnelName = data.personnelGroupName
      this.curRow.transferInPersonnelCode = data.personnelGroupCode
    },
    // 划入成本中心
    getPostcenter () {
      req('postCostCenter')
      .then(res => {
        this.costCenterData = res
      })
    },
    // 得到成本中心代码
    getCostCenterCode (data) {
      // let curcowCostCenter = this.costCenterData.filter(function (key) {
      //   return key.costCenterName === data
      // })
      this.curRow.costCenterInName = data.costCenterName
      this.curRow.costCenterInCode = data.costCenterCode
    },
    // 把划拨月份转为字符串
    getStringMonth () {
      this.curRow.transferMonth = formatDate(this.curRow.transferMonth).slice(0, 7)
    },
    radioWarn () {
      if (!this.curRow.employeeId) {
        return showMessage('warning', '请选择员工')
      }
      if (!this.curRow.transferMonth) {
        return showMessage('warning', '请选择划拨月份')
      }
    },
    // 选择分摊比例或金额
    radioSelect () {
      this.radioWarn()
      if (this.curRow.shareWay === '分摊比例') {
        this.curRow.allocationProportion = 100
        this.changeAllocationCount()
      } else {
        this.curRow.allocationProportion = ''
      }
    },
    // 选择分摊种类
    // transferSelect () {
    //   console.log(this.curRow.transferWay)
    //   console.log(this.table.setting.editor)
    //   // const arr = {'allocationDays': {disable: true},
    //   //   'holidayDays': {disable: true},
    //   //   'costType': {disable: true},
    //   //   'supportAmount': {disable: true},
    //   //   'overtimePay': {disable: true},
    //   //   'shareWay': {disable: true},
    //   //   'allocationProportion': {disable: true},
    //   //   'allocationAmount': {disable: true}
    //   // }
    // },
    // 选择员工请求数据
    fetch (options = {}) {
      req('getCostAllocation', options)
      .then(res => {
        this.curRow = Object.assign(this.curRow, res)
        this.curRow.employeeId = this.employeeId
        this.$refs.employeemCell.validate()
        this.triggerValidate()
      })
    },
    fetchOutStore (data) {
      req('getOutStore', data)
      .then(res => {
        this.curRow.transferOutStore = res.transferOutStore
        this.curRow.transferOutStoreCode = res.transferOutStoreCode
        this.curRow.transferOutStoreName = res.transferOutUnit
        this.curRow.transferOutUnit = res.transferOutUnit
        this.curRow.transferOutUnitCode = res.transferOutUnitCode
        this.curRow.transferOutPunit = res.transferOutPunit
        this.curRow.transferOutPunitName = res.transferOutPunitName
        this.curRow.transferOutPunitCode = res.transferOutPunitCode
        this.curRow.transferOutUnitName = res.transferOutUnitName
      })
    },
    // 获取月份的最后一天
    getMonthLastDay (data) {
      let monthDate = new Date(data)
      let currentMonth = monthDate.getMonth()
      let nextMonth = ++currentMonth
      let nextMonthFirstDay = new Date(monthDate.getFullYear(), nextMonth, 1)
      return new Date(nextMonthFirstDay - 1000 * 60 * 60 * 24).getTime()
    },
    // 分摊金额计算
    fetchCount (option) {
      // 满足下面条件才触发计算
      let length = 0
      if (option.allocationDays === '' || option.employeeId === '' || option.transferMonth === '- -' || option.costType === '' || option.allocationProportion === 0 || option.shareWay === '') {
        length = length + 1
      }
      if (length === 0) {
        req('postCostAllocationCount', option)
        .then(res => {
          this.curRow.allocationAmount = res.allocationAmount
          this.isAmountTrue()
          if (this.curRow.costType === '02') {
            this.curRow.supportAmount = res.supportAmount
          }
        })
      }
    },
    // 获得分摊金额计算所需数据
    getCountData () {
      this.countData.employeeId = this.curRow.employeeId
      this.countData.transferMonth = formatDate(this.curRow.transferMonth).slice(0, 7)// 转化成七位字符串
      this.countData.allocationDays = this.curRow.allocationDays
      this.countData.holidayDays = this.curRow.holidayDays
      this.countData.costType = this.curRow.costType
      this.countData.allocationProportion = this.curRow.allocationProportion / 100
      this.countData.shareWay = this.curRow.shareWay
    },
    // 触发请求分摊金额
    changeAllocationCount () {
      this.getCountData()
      let data = this.countData
      this.fetchCount(data)
    },
    // 验证分摊金额是否大于总额
    isAmountTrue () {
      this.getStringMonth()
      req('postTrueCostAllocationCount', {employeeId: this.curRow.employeeId, transferMonth: this.curRow.transferMonth, allocationAmount: this.curRow.allocationAmount})
        .then(res => {
          console.log(res)
          if (res === true) {
            this.curRow.isAllocationAmountTrue = '1'
          } else {
            this.curRow.isAllocationAmountTrue = '2'
          }
        }).catch(() => {
          this.curRow.isAllocationAmountTrue = '3'
        })
    },
    // // 动态校验规则
    // triggerRules () {
    //   if (!this.judgeIsHour()) {
    //     const hourTriggerList = ['请输入工时']
    //     return hourTriggerList
    //   } else if (!this.judgeIsCost()) {
    //     const costTriggerList = ['请输入费用']
    //     return costTriggerList
    //   } else {
    //     const trigger = ['all']
    //     return trigger
    //   }
    // },
    // // 判断工时划拨的所有内容是否为空
    // judgeIsHour () {
    //   if (this.curRow.transferHours || this.curRow.transferReason || this.curRow.workRemark) {
    //     return true
    //   } else {
    //     return false
    //   }
    // },
    // // 判断费用划拨的所有内容是否为空
    // judgeIsCost () {
    //   if (this.curRow.allocationDays || this.curRow.holidayDays || this.curRow.costType || this.curRow.supportAmount || this.curRow.overtimePay || this.curRow.shareWay || this.curRow.allocationProportion || this.curRow.allocationAmount || this.curRow.remark) {
    //     return true
    //   } else {
    //     return false
    //   }
    // },
    // 监听表格数据变化
    changeData (val) {
      // 监听
      // console.log(val)
      // val.updateRules(this.triggerRules(), this.$refs.childCell, null, 'row')
      if (val.col === 'transferMonth') {
        // 设置默认的开始日期和结束日期
        this.curRow.beginDate = this.curRow.transferMonth
        this.curRow.endDate = this.getMonthLastDay(this.curRow.transferMonth)
        this.curRow.transferMonth = formatDate(this.curRow.transferMonth).slice(0, 7)
      }
      // 费用类型变化触发请求分摊金额
      if (val.col === 'costType') {
        // 改变费用类型时，清空费用划拨的输入内容
        for (let i = 0; i < this.costDisable.length; i++) {
          if (this.costDisable[i] !== 'costType') {
            this.curRow[this.costDisable[i]] = ''
          }
        }
        // 先全部重置为可以输入，然后在根据选择的值对应设置禁止输入
        this.setDisabled(val, this.costDisable, 'childCell', false)
        if (val.val === '01' || val.val === '02' || val.val === '07' || val.val === '08') {
          // this.setRule(val, ['holidayDays'], 'childCell')
          this.setDisabled(val, ['holidayDays', 'supportAmount', 'overtimePay'], 'childCell')
          // this.changeAllocationCount()
        } else if (val.val === '03' || val.val === '05' || val.val === '06' || val.val === '09') {
          this.setDisabled(val, ['holidayDays', 'supportAmount', 'shareWay', 'allocationProportion', 'overtimePay'], 'childCell')
        } else if (val.val === '04') {
          this.setDisabled(val, ['shareWay', 'allocationProportion'], 'childCell')
        }
      }
      // 法定节假日触发请求分摊金额
      if (val.col === 'holidayDays') {
        this.changeAllocationCount()
      }
      // 分摊金额变化触发校验
      if (val.col === 'allocationAmount') {
        if (this.curRow.allocationAmount > 0) {
          this.isAmountTrue()
        }
      }
      // 根据选择的划拨流程，控制对应的输入框
      if (val.col === 'transferWay') {
        this.setRule(val, this.allDisable, 'childCell', true)
        this.setDisabled(val, this.allDisable, 'childCell', false)
        if (val.val === '01') {
          // change to costTransfer, clear all data of laboehour
          for (let i = 0; i < this.laborDisable.length; i++) {
            this.curRow[this.laborDisable[i]] = ''
          }
          this.setRule(val, this.laborDisable, 'childCell')
          this.setDisabled(val, this.laborDisable, 'childCell')
        } else if (val.val === '02') {
          for (let i = 0; i < this.costDisable.length; i++) {
            this.curRow[this.costDisable[i]] = ''
          }
          this.setRule(val, this.costDisable, 'childCell')
          this.setDisabled(val, this.costDisable, 'childCell')
        }
      }
    },
    getTableClone (data) {
      this.hourCostData = data
    },
    // 动态去除校验
    setRule (val, arr, ref, positive = false) {
      if (ref === 'cell') {
        for (let i = 0; i < arr.length; i++) {
          val.updateRules(positive ? '' : [{ required: positive }], this.$refs.cell, arr[i])
        }
      } else {
        for (let i = 0; i < arr.length; i++) {
          val.updateRules(positive ? '' : [{ required: positive }], this.$refs.childCell, arr[i])
        }
      }
    },
    // 动态disabled
    setDisabled (val, arr, ref, positive = true) {
      if (ref === 'cell') {
        for (let i = 0; i < arr.length; i++) {
          val.updateDisabled(positive, this.$refs.cell, arr[i])
        }
      } else {
        for (let i = 0; i < arr.length; i++) {
          val.updateDisabled(positive, this.$refs.childCell, arr[i])
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>