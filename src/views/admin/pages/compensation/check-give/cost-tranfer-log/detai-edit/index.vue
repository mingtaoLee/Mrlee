<template>
  <el-form ref="form" class="laborhour-tranfer-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label-width="140px" label="工号" prop="employeeCode">
          <el-input v-model="form.employeeCode" disabled></el-input>
        </el-form-item>
        <el-form-item label-width="140px" label="划出人事范围" prop="transferOutPersonnelName">
          <el-input v-model="form.transferOutPersonnelName" disabled></el-input>
        </el-form-item>
        <el-form-item label-width="140px" label="划出人事范围代码" prop="transferOutPersonnelCode">
          <el-input v-model="form.transferOutPersonnelCode" disabled></el-input>
        </el-form-item>
        <el-form-item label-width="140px" label="划入人事范围" prop="transferInPersonnelCode">
          <!-- <i-select 
            v-model="form.transferInPersonnelCode"
            :props="personalAreaProps"
            dataKey="personalArea"
            @option-click="optionClick"
            filterable
          ></i-select> -->
          <remote-select
            v-model="form.transferInPersonnelCode"
            :props="personalAreaProps"
            dataKey="personnelGroup"
            @option-click="optionClick"
            filterable
          ></remote-select>
        </el-form-item>
        <el-form-item label-width="140px" label="划入人事代码">
          <el-input v-model="form.transferInPersonnelCode" disabled></el-input>
        </el-form-item>
        <el-form-item label-width="140px" label="费用类型" prop="costType">
          <i-select 
            v-model="form.costType" 
            parameter="EXPENSE_TRANSFER_TYPE" 
            placeholder="请选择"
            @change="changeType"
          ></i-select>
        </el-form-item>
        <el-form-item 
          v-if="monthShow || costType" 
          label-width="140px" 
          label="开始日期" 
          prop="beginDate"
        >
          <el-date-picker
            v-model="form.beginDate"
            type="date"
            placeholder="请选择"
            :picker-options="pickerOptions1"
          ></el-date-picker>
        </el-form-item>
        <el-form-item v-if="show.isAllocationDays" label-width="140px" label="费用分摊天数" prop="allocationDays">
          <el-input 
            type="number" 
            v-model.number="form.allocationDays" 
            placeholder="请输入" 
            min='0'
            @input="changeDays"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="show.isSupportAmount" label-width="140px" label="支援补贴金额" prop="supportAmount">
          <el-input type="number" v-model.number="form.supportAmount" @input="changeSupport"></el-input>
        </el-form-item>
        <el-form-item v-if="show.isShareWay" label-width="140px" label="选择分摊方式" prop="shareWay">
          <el-radio label="分摊比例" v-model="form.shareWay"></el-radio>
        </el-form-item>
        <el-form-item v-if="show.isShareWay" label-width="140px">
          <el-radio label="分摊金额" v-model="form.shareWay"></el-radio>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label-width="140px" label="姓名" prop="employeeName">
          <el-input 
            :disabled="accountId ? true : false" 
            v-model="form.employeeName" 
            readonly
            placeholder="请选择" 
            @click.native="handlePersonnelClick"
          >
            <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
          </el-input>
          <i-personnel-select
            v-if="accountId ? false : true"
            :isShow.sync="isShowPersonnel" 
            :multiple="false"
            :defaultSelectedPersonnel="selectedPersonnel" 
            @confirm="dialogConfirm"
          ></i-personnel-select>
        </el-form-item>
        <el-form-item label-width="140px" label="划出成本中心" prop="costCenterOutName">
          <el-input v-model="form.costCenterOutName" disabled></el-input>
        </el-form-item>
        <el-form-item label-width="140px" label="划出成本中心代码" prop="costCenterOutCode">
          <el-input v-model="form.costCenterOutCode" disabled></el-input>
        </el-form-item>
        <el-form-item label-width="140px" label="费用划入成本中心" prop="costCenterInCode">
          <remote-select
            v-model="form.costCenterInCode"
            :props="costCenterProps"
            dataKey="costCenter"
            @option-click="costClick"
            filterable
          ></remote-select>
        </el-form-item>
        <el-form-item label-width="140px" label="费用划入成本中心代码">
          <el-input v-model="form.costCenterInCode" disabled></el-input>
        </el-form-item>
        <el-form-item label-width="140px" label="划拨月份" prop="transferMonth">
          <el-date-picker
            v-model="form.transferMonth"
            type="month"
            placeholder="请选择"
            value-format="yyyy-MM"
            @change="changeMonth"
            :picker-options="pickerOption"
          ></el-date-picker>
        </el-form-item>
        <el-form-item 
          v-if="monthShow || costType"
          label-width="140px" 
          label="结束日期" 
          prop="endDate"
        >
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="请选择"
            :picker-options="pickerOptions2"
          ></el-date-picker>                    
        </el-form-item>
        <el-form-item v-if="show.isPlacehold" label-width="140px">
          <div class="palcehold"></div>
        </el-form-item>
        <el-form-item 
          v-if="show.isHolidayDays"
          label-width="140px" 
          label="含法定节假日天数" 
          prop="holidayDays"
        >
          <el-input 
            type="number" 
            v-model.number="form.holidayDays" 
            min='0'
            @input="changeHoliday"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="show.isOvertimePay" label-width="140px" label="节假日加班费">
          <el-input v-model="form.overtimePay" disabled="show.isOvertimePay"></el-input>
        </el-form-item>
        <el-form-item
          v-if="show.isAllocationProportion"
          label-width="140px" 
          label="分摊比例" 
          prop="allocationProportion"
        >
          <el-input 
            type="number" 
            v-model.number="form.allocationProportion" 
            min='0'
            max='100'
            :disabled="isPercentType"
            placeholder="请输入"
            @input="changeProportion"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="show.isAllocationAmount" 
          label-width="140px" 
          label="分摊金额" 
          prop="allocationAmount"
        >
          <el-input 
            type="number"
            v-model.number="form.allocationAmount" 
            min='0'
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </li>
    </ul>
    <el-form-item label-width="140px" label="备注" prop="remark">
      <el-input type="textarea" v-model="form.remark" placeholder="请输入"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
  import req from 'api/compensation/check-give/cost-tranfer-log'
  // import reqOrg from 'api/org/setting'
  import OrgCostCenter from 'components/org/public/org-cost-center'
  import RemoteSelect from 'components/compensation/remote-select/index.vue'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule, showMessage, checkNum } from 'utils/index'

  // require是否需要检验 isMonthOK用于判断月份是否正常, str空值提示, max最大值， maxstr大于最大值提示
  const checkTransMouth = (str, required = true, isMouthOk = true, max, maxstr) => {
    return (rule, value, callback) => {
      if (required && !value && isMouthOk) {
        // 空值的提示
        return callback(new Error(str))
      } else if (value && !isMouthOk) {
        return callback(new Error('该月份没有考勤信息'))
      } else if (value > max) {
        return callback(new Error(maxstr))
      } else if (value && isMouthOk) {
        return callback()
      } else {
        callback()
      }
    }
  }

  export default {
    name: 'CostTranferDetail',
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      accountId: String,
      costType: String,
      shareWay: String,
      row: Object
    },
    components: {
      OrgCostCenter,
      RemoteSelect
    },
    data: function () {
      return {
        instance: null,
        form: {
          employeeCode: '',
          transferOutPersonnelName: '',
          transferOutPersonnelCode: '',
          costType: '',
          beginDate: '',
          allocationDays: '', // 费用分摊天数
          transferInPersonnelCode: '',
          transferInPersonnelName: '',
          employeeName: '',
          employeeId: '',
          costCenterOutName: '',
          costCenterOutCode: '',
          transferMonth: '',
          endDate: '',
          holidayDays: '', // 法定节假日
          costCenterInName: '',
          costCenterInCode: '',
          allocationProportion: '', // 分摊比例
          allocationAmount: '', // 分摊金额
          remark: '',
          shareWay: '', // 分摊方式
          supportAmount: '', // 支援补贴金额
          overtimePay: '' // 节假日加班费
        },
        // 按照分摊比例查询金额的查询条件
        search: {
          employeeId: '',
          transferMonth: '',
          allocationDays: '',
          holidayDays: '',
          costType: '',
          allocationProportion: '',
          supportAmount: '',
          shareWay: ''
        },
        // 控制输入框显示隐藏数据
        show: {
          isAllocationDays: false, // 费用分摊天数
          isHolidayDays: false, // 法定节假日
          isShareWay: false, // 分摊方式
          isAllocationProportion: false, // 分摊比例
          isAllocationAmount: false, // 分摊金额
          isSupportAmount: false, // 支援补贴金额
          isOvertimePay: false, // 节假日加班费
          isPlacehold: false // 占位div
        },
        // 详情编辑
        orderEditToolbar: [
          {
            text: '确认',
            func: done => {
              this.handleSave(done)
            }
          }, {
            text: '返回',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          }
        ],
        rules: {
          // employeeCode: getRule('请选择员工编号', 'change'),
          employeeName: getRule('请选择员工姓名', 'change'),
          beginDate: getRule('请选择开始日期', 'change', 'date'),
          endDate: getRule('请选择结束日期', 'change', 'date'),
          shareWay: getRule('请选择分摊方式', 'change'),
          allocationProportion: { validator: checkNum(), trigger: 'change', required: false },
          supportAmount: getRule('请输入支援补贴金额', 'change', 'number'),
          holidayDays: { validator: checkNum('', 2), trigger: 'change' },
          allocationDays: { validator: checkTransMouth('请输入正确的分摊天数', true, true), trigger: 'change', required: true },
          costType: getRule('请输入费用类型', 'change'),
          allocationAmount: { validator: checkNum('请输入分摊金额', 15), trigger: 'change', required: false },
          costCenterInCode: getRule('请输入正确的划入成本中心', 'change'),
          transferMonth: [{validator: checkTransMouth('请选择月份', true, true),
            trigger: 'change',
            required: true}],
          transferInPersonnelCode: getRule('请选择划入人事范围', 'change'),
          costCenterOutName: getRule('该员工无成本中心数据', 'change'),
          costCenterOutCode: getRule('该员工无成本中心代码数据', 'change'),
          transferOutPersonnelName: getRule('该员工无人事范围数据', 'change'),
          transferOutPersonnelCode: getRule('该员工无人事范围代码数据', 'change'),
          remark: {
            validator: (rule, value, cb) => {
              value && value.length > 99 && cb(new Error('备注不能超过100个字')) || cb()
            },
            required: false
          }
        },
        isShowPersonnel: false,
        isShowOrderTable: false,
        isPercentType: true,
        isAmountType: true,
        monthShow: false,
        symbolType: '',
        limitBegin: '',
        limitEnd: '',
        checkdays: '',
        checkAttendance: false, // 用于检验分摊天数
        pickerOption: {
          disabledDate: (time) => {
            let days = new Date()
            if (days.getDate() > 3) {
              return time.getTime() < days - days.getDate() * 24 * 3600 * 1000
            } else {
              return time.getTime() < days.setMonth(days.getMonth() - 1)
            }
          }
        },
        /** 日期限制 */
        pickerOptions1: {
          disabledDate: (time) => {
            if (this.form.endDate) {
              let endDate = new Date(this.form.endDate)
              return time.getTime() > endDate || time.getTime() < this.limitBegin - 24 * 3600 * 1000
            }
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            if (this.form.beginDate) {
              let beginDate = new Date(this.form.beginDate)
              return time.getTime() < beginDate || time.getTime() > this.limitEnd
            }
          }
        },
        defaultNode: {},
        // 人事范围下拉配置
        personalAreaProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        },
        // 成本中心下拉配置
        costCenterProps: {
          value: 'costCenterCode',
          label: 'costCenterName'
        }
      }
    },
    created () {
      this.init()
      this.costType && this.powerControl(this.costType) // 修改时根据费用类型控制输入框的显示
      if (this.shareWay === '分摊金额') { // 修改时如果分摊方式为分摊金额，则禁止分摊比例输入
        this.isPercentType = true
      }
      // 修改的时候先算出考勤天数
      if (this.accountId) {
        this.form.employeeId = this.row.employeeId
        this.form.transferMonth = this.row.transferMonth
        this.checkWorkdays()
      }
    },
    methods: {
      /** 初始化 */
      init () {
        this.initInstance()
        this.initData(this.accountId)
      },

      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.accountId ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.accountId)
      },

      /** 数据保存 */
      save () {
        return new Promise(resolve => {
          this.validate().then(res => {
            if (res) {
              this.instance.save().then(res => {
                resolve(res)
              })
            } else {
              resolve(false)
            }
          })
        })
      },

      /** 数据校验 */
      validate () {
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.form)
            }
          })
        })
      },

      /** 校验员工的考勤天数 */
      checkWorkdays () {
        const employeeId = this.form.employeeId
        const transferMonth = this.form.transferMonth
        if (employeeId && transferMonth) {
          req('getTransferDays', { employeeId: employeeId, transferMonth: transferMonth }).then(res => {
            this.checkdays = (res / 8).toFixed(2)
            this.checkAttendance = true
            if (this.form.allocationDays && this.form.allocationDays > this.checkdays) {
              return showMessage('warning', `输入天数不能大于考勤天数 ${this.checkdays} 天`)
            }
          }).catch(() => {
            this.checkAttendance = false
          })
        }
      },

      /** 人员下拉函数 */
      handlePersonnelClick () {
        this.isShowPersonnel = !this.isShowPersonnel
      },
      dialogConfirm (selected) {
        this.form.employeeName = selected.map(item => { return item.employeeName }).toString()
        const employeeId = selected.map(item => { return item.employeeId }).toString()
        this.form.employeeId = employeeId
        this.checkWorkdays()
        req('getByemployeeId', { employeeId: employeeId }).then(res => {
          this.form.employeeCode = res.employeeCode
          this.form.costCenterOutName = res.costCenterOutName
          this.form.costCenterOutCode = res.costCenterOutCode
          this.form.transferOutPersonnelName = res.transferOutPersonnelName
          this.form.transferOutPersonnelCode = res.transferOutPersonnelCode
        })
      },
      /** 订单号窗口按钮 */
      handleSave (done) {
        let order = this.$refs.orderTable.selectOrder
        if (!order) {
          return showMessage('warning', '请选择一个订单号')
        } else if (order.length >= 2) {
          return showMessage('warning', '只能选择一个订单号')
        } else {
          this.form.internalOrder = order[0].aufnCode
        }
        done()
      },
      handleCancel (done) {
        done()
      },
      /** 打开订单查询弹窗函数 */
      openOrderTable () {
        this.isShowOrderTable = true
      },
      /** 人事范围下拉点击 */
      optionClick (a) {
        this.form.transferInPersonnelName = a.personnelGroupName
      },
      /** 成本中心下拉点击 */
      costClick (a) {
        this.form.costCenterInName = a.costCenterName
      },
      /** 根据费用类型显示对应的输入框 */
      changeType (val) {
        this.form.allocationProportion = '' // 切换费用类型，重置分摊比例和分摊金额
        this.form.allocationAmount = ''
        this.powerControl(val)
      },
      powerControl (val) {
        if (val === '01' || val === '02' || val === '07' || val === '08') {
          this.symbolType = '1'
          this.showInput(['isHolidayDays', 'isSupportAmount', 'isOvertimePay'], true)
          this.isAmountType = true // 控制分摊金额是否可输入
          this.rules.allocationAmount.required = false // 控制分摊金额是否可校验
        } else if (val === '04') {
          this.symbolType = '2'
          this.showInput(['isShareWay', 'isAllocationProportion', 'isPlacehold'], true)
          this.isAmountType = true
          this.rules.allocationAmount.required = false
        } else {
          this.symbolType = '3'
          this.showInput(['isAllocationDays', 'isAllocationAmount'])
          this.isAmountType = false
          this.rules.allocationAmount.required = true
          this.rules.allocationAmount.validator = checkNum('请输入分摊金额', 7)
        }
      },
      /** 输入框显示公共函数 */
      showInput (arr, positive = false) {
        const show = this.show
        for (let key in show) {
          this.show[key] = positive
        }
        for (let i = 0; i < arr.length; i++) {
          this.show[arr[i]] = !positive
        }
      },
      /** 当数据输入达到计算条件, 自动计算分摊金额 */
      calculateAmount (val) {
        const search = this.search
        for (let key in search) {
          if (key === 'allocationProportion') {
            this.search[key] = val[key] / 100
          } else {
            this.search[key] = val[key]
          }
        }
        req('postCalculate', this.search).then(res => {
          this.form.allocationAmount = res.allocationAmount.toFixed(2)
          this.form.overtimePay = res.overtimePay.toFixed(2)
        })
        // this.validate().then(res => {
        //   if (res) {
        //     req('postCalculate', this.search).then(res => {
        //       this.form.allocationAmount = res
        //     })
        //   } else {
        //     return showMessage('warning', '自动计算分摊金额前，请将上方信息填写完整')
        //   }
        // })
      },
      /** 划拨月份改变触发计算 */
      changeMonth (val) {
        this.judgeSend()
        this.checkWorkdays() // 月份改变，重新计算考勤天数
        // this.rules.transferMonth.validator = checkTransMouth(true, this.checkAttendance)
        // this.rules.transferMonth.validator()
        this.monthShow = true
        this.limitBegin = this.getMonthFirstDay(val)
        this.limitEnd = this.getMonthLastDay(val)
        this.form.beginDate = this.getMonthFirstDay(val)
        this.form.endDate = this.getMonthLastDay(val)
      },
      /** 分摊天数改变触发计算 */
      changeDays (val) {
        this.judgeSend()
        let maxstr = `输入天数不能大于考勤天数 ${this.checkdays} 天`
          // 检验分摊天数
        this.rules.allocationDays.validator = checkTransMouth('请输入分摊天数', true, this.checkAttendance, this.checkdays, maxstr)
      },
      /** 分摊比例改变触发计算 */
      changeProportion () {
        this.judgeSend()
      },
      /** 支援补贴金额触发计算 */
      changeSupport () {
        this.judgeSend()
      },
      /** 法定节假日额触发计算 */
      changeHoliday () {
        this.judgeSend()
      },
      judgeSend () {
        const val = this.form
        if (this.symbolType === '1' && val.employeeId && val.transferMonth && val.allocationDays && val.costType && val.allocationProportion && val.shareWay) {
          this.calculateAmount(val)
        } else if (this.symbolType === '2' && val.employeeId && val.transferMonth && val.allocationDays && val.costType && val.supportAmount) {
          this.calculateAmount(val)
        } else {
          return null
        }
      },
      // 获取月份的第一天
      getMonthFirstDay (data) {
        return new Date(new Date(data).setDate(1))
      },
      // 获取月份的第最后一天
      getMonthLastDay (data) {
        let monthDate = new Date(data)
        let currentMonth = monthDate.getMonth()
        let nextMonth = ++currentMonth
        let nextMonthFirstDay = new Date(monthDate.getFullYear(), nextMonth, 1)
        return new Date(nextMonthFirstDay - 1000 * 60 * 60 * 24)
      }
    },
    watch: {
      'form.shareWay' (val, old) {
        if (val === '分摊比例') {
          this.rules.allocationProportion.required = true
          this.rules.allocationProportion.validator = checkNum('请输入分摊比例', 3, 100)
          this.rules.allocationAmount.required = false
          this.isPercentType = false
          this.isAmountType = true
        } else if (val === '分摊金额') {
          this.form.allocationProportion = ''
          this.rules.allocationProportion.required = false
          this.rules.allocationAmount.required = true
          this.rules.allocationProportion.validator = checkNum('', 2, 100)
          this.isPercentType = true
          this.isAmountType = false
        } else {
          this.isPercentType = true
          this.isAmountType = true
        }
      }
      // form: {
      //   handler (val, old) {
      //     if (this.symbolType === '1' && val.employeeId && val.transferMonth && val.allocationDays && val.costType && val.allocationProportion && val.shareWay) {
      //       this.calculateAmount(val)
      //     } else if (this.symbolType === '2' && val.employeeId && val.transferMonth && val.allocationDays && val.costType && val.supportAmount) {
      //       this.calculateAmount(val)
      //     }
      //   },
      //   deep: true
      // }
    }
  }
</script>
<style lang="scss" scoped>
  .palcehold {
    height: 40px;
  }
</style>