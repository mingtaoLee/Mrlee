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
                <el-form-item label-width="140px" label="划拨月份" prop="transferMonth">
                    <el-date-picker
                      v-model="form.transferMonth"
                      type="month"
                      placeholder="请选择"
                      value-format="yyyy-MM"
                      @change='monthChange'
                      :picker-options="pickerOption"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label-width="140px" label="开始日期" prop="beginDate" v-if='dateIsShow || accountId' >
                    <el-date-picker
                      v-model="form.beginDate"
                      type="date"
                      placeholder="请选择"
                      :picker-options="pickerOptions1"
                      @change="dateChange"
                    ></el-date-picker>                    
                </el-form-item> 
                <el-form-item label-width="140px" label="订单类型" prop="aufnType">
                    <i-select v-model="form.aufnType" parameter="AUFN_TRANSFER_TYPE" placeholder="请选择"></i-select>
                </el-form-item>
                <el-form-item label-width="140px" label="选择分摊方式" prop="allocationPayroll">
                    <el-radio label="分摊比例" v-model="form.shareWay" @change='radioSelect'></el-radio>
                </el-form-item>
                <el-form-item label-width="140px" prop="allocationPayroll">
                    <el-radio label="分摊金额" v-model="form.shareWay" @change='radioSelect'></el-radio>
                </el-form-item>
            </li>

            <li class="item">
                <el-form-item label-width="140px" label="姓名" prop="employeeName">
                    <el-input 
                      :disabled="accountId ? true : false" 
                      v-model="form.employeeName" 
                      readonly
                      placeholder="请选择" 
                      @click.native="handlePersonnelClick">
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
                    <el-input v-model="form.costCenterOutName" disabled=""></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="划出成本中心代码" prop="costCenterOutCode">
                    <el-input v-model="form.costCenterOutCode" disabled=""></el-input>
                </el-form-item>
                <!-- <el-form-item label-width="140px" label="费用划出成本中心代码" prop="transferOutCostCenterName">
                    <el-input v-model="form.transferOutCostCenterCode"></el-input>
                </el-form-item> -->
                <el-form-item label-width="140px" label="内部订单号" prop="internalOrder">
                    <el-input 
                      v-model="form.internalOrder" 
                      suffix-icon="el-icon-menu"
                      readonly 
                      placeholder="请选择"
                      @click.native="openOrderTable"
                    ></el-input>
                    <i-dialog
                      title="选取订单号"
                      v-model="isShowOrderTable"
                      :toolbar="orderEditToolbar"
                      destroyedWhenClose
                      size="large"
                    >
                      <order-table ref="orderTable"></order-table>
                    </i-dialog>
                </el-form-item>
                 <el-form-item label-width="140px" label="结束日期" prop="endDate" v-if='dateIsShow || accountId'>
                    <el-date-picker
                      v-model="form.endDate"
                      type="date"
                      placeholder="请选择"
                      :picker-options="pickerOptions2"
                      @change="dateChange"
                    ></el-date-picker>                    
                </el-form-item>
                <el-form-item label-width="140px" label="费用分摊天数" prop="allocationDay">
                    <el-input 
                      v-model.number="form.allocationDay" 
                      type="number"
                      placeholder="请输入" 
                      min='0'
                      @input='allocationDayChange'
                    ></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="分摊比例" prop="allocationProportion">
                    <el-input 
                      type="number" 
                      v-model.number="form.allocationProportion" 
                      min='0'
                      :disabled="isPercentType"
                      placeholder="请输入"
                      @input='allocationProportionChange'>
                      <template slot="append">%</template></el-input>
                </el-form-item>
                <el-form-item label-width="140px" label="分摊金额" prop="allocationAmount">
                    <el-input 
                      type="number"
                      :disabled="isAmountType" 
                      v-model.number="form.allocationAmount" 
                      min='0'
                      @change='changeAllocationAmount'
                      @input='changeAllocationAmount'
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
  import req from 'api/compensation/check-give/inner-order'
  import reqOrg from 'api/org/setting'
  import OrderTable from './orderTable'
  import OrgCostCenter from 'components/org/public/org-cost-center'
  import RemoteSelect from 'components/compensation/remote-select/index.vue'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule, showMessage } from 'utils/index'

  const check = (rule, value, callback) => {
    if (value < 0 || value > 100) {
      return callback(new Error('请输入1-100的比例'))
    } else {
      callback()
    }
  }
  // required 是否必填 ，str错误提示信息，max最大值，isPositive对负数进行校验 ,str2大于最大值的提示,用于判断月份是否有考勤信息
  const checkAmountRule = (required = true, str, max, isPositive = true, str2, isMonthOK = true) => {
    return (rule, value, callback) => {
      if (required && str && !value && value !== 0) {
        // 必填，有提示信息，空值的提示
        return callback(new Error(str))
      } else if (!required && !value) {
        // 非必填，空值的提示，无提示
        return callback()
      } else if (value && !isMonthOK) {
        return callback(new Error('该月份没有考勤信息'))
      } else if (value > max && value !== '0.00') {
        return callback(new Error(str2))
      } else if (isPositive && value < 0) {
        return callback(new Error('输入不能为负数'))
      } else {
        callback()
      }
    }
  }
  const checkRemark = (rule, value, callback) => {
    if (value && value.length > 120) {
      return callback(new Error('备注长度大于120个字符'))
    } else {
      callback()
    }
  }

  const RULES = {
    // employeeCode: getRule('请选择员工编号', 'change'),
    employeeName: getRule('请选择员工姓名', 'change'),
    beginDate: getRule('请选择开始日期', 'change', 'date'),
    endDate: getRule('请选择结束日期', 'change', 'date'),
    allocationDay: { validator: checkAmountRule(false, ''), trigger: 'change' },
    transferMonth: getRule('请选择划拨月份', 'change'),
    aufnType: getRule('请选择订单类型', 'change'),
    transferOutPersonnelName: getRule('请选择员工带出划出人事范围名称', 'change'),
    transferOutPersonnelCode: getRule('请选择员工带出划出人事范围代码', 'change'),
    costCenterOutName: getRule('请选择员工带出划出成本中心', 'change'),
    costCenterOutCode: getRule('请选择员工带出划出成本中心代码', 'change'),
    internalOrder: getRule('请选择内部订单号', 'change'),
    allocationAmount: { validator: checkAmountRule(true, '请输入分摊金额或者选择分摊比例'), trigger: 'change', required: true },
    allocationProportion: { validator: check, trigger: 'change' },
    remark: {validator: checkRemark, trigger: 'change'}
  }
  export default {
    name: 'CostTranferDetail',
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      accountId: String
    },
    components: {
      OrderTable,
      OrgCostCenter,
      RemoteSelect
    },
    data: function () {
      return {
        instance: null,
        form: {
          shareWay: '',
          employeeCode: '',
          employeeId: '',
          employeeName: '',
          transferMonth: '',
          // transferOutUnitName: '',
          // transferOutUnit: '',
          beginDate: '',
          endDate: '',
          transferOutPersonnelCode: '',
          transferOutPersonnelName: '',
          costCenterOutName: '',
          costCenterOutCode: '',
          aufnType: '',
          internalOrder: '',
          allocationProportion: '',
          allocationAmount: '',
          allocationDay: '',
          // costAufnId: '',
          // lastUpdateBy: '',
          cropCode: '',
          // dataSource: '',
          // allocationDays: '',
          remark: ''
        },
        // 详情编辑
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
        rules: RULES,
        isShowPersonnel: false,
        isShowOrderTable: false,
        isPercentType: true,
        isAmountType: true,
        setBeginDate: '',
        setEndDate: '',
        dateIsShow: false,
        // 费用合计
        salaryAmount: '',
        // 应出勤天数
        attendanceDay: '',
        // 校验分摊天数
        verifyDay: '',
        // 用于检验月份是否有考勤信息
        // isMonthOK: false,
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
            // 未选择划拨月份，选择结束时间后，再去选择开始时间的限制
            // let endDate = new Date(this.form.endDate)
            // if (this.form.endDate && !this.form.transferMonth) {
            //   // let endDate = new Date(this.form.endDate)
            //   return time.getTime() < this.getMonthFirstDay(this.form.endDate) || time.getTime() > endDate
            // }
            // 正常情况，选择月份后，进行选择的限制
            if (this.form.endDate && this.form.transferMonth) {
              let endDate = new Date(this.form.endDate)
              return time.getTime() < this.getMonthFirstDay(this.form.transferMonth) - 1000 * 60 * 60 * 24 || time.getTime() > endDate
            } else if (this.form.transferMonth) {
              // 选择划拨时间 ，清除结束时间后，对开始时间的限制
              return time.getTime() < this.getMonthFirstDay(this.form.transferMonth) - 1000 * 60 * 60 * 24 || time.getTime() > this.getMonthLastDay(this.form.transferMonth)
            }
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            if (this.form.beginDate) {
              let beginDate = new Date(this.form.beginDate)
              return time.getTime() < beginDate || time.getTime() > this.getMonthLastDay(this.form.beginDate)
            }
            if (this.form.transferMonth) {
              return time.getTime() < this.setBeginDate && time.getTime() > this.setEndDate
            }
          }
        },
        defaultNode: {},
        // 费用中心搜索api配置项
        apiConfig: {
          req: reqOrg,
          name: 'costCentral'
        },
        remoteProps: {
          label: 'generalName',
          value: 'generalName'
        }
      }
    },
    created () {
      this.init()
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
      /** 人员下拉函数 */
      handlePersonnelClick () {
        this.isShowPersonnel = !this.isShowPersonnel
      },
      dialogConfirm (selected) {
        this.form.employeeName = selected.map(item => { return item.employeeName }).toString()
        const employeeId = selected.map(item => { return item.employeeId }).toString()
        this.form.employeeId = employeeId
        this.fetchSalaryCount()
        req('getByemployeeId', { employeeId: employeeId }).then(res => {
          this.form.employeeCode = res.employeeCode
          this.form.transferOutPersonnelCode = res.transferOutPersonnelCode
          this.form.transferOutPersonnelName = res.transferOutPersonnelName
          this.form.costCenterOutName = res.costCenterOutName
          this.form.costCenterOutCode = res.costCenterOutCode
        })
      },
      // 修改划拨月份带出开始以及结束时间
      monthChange () {
        this.dateIsShow = true
        if (this.form.transferMonth) {
          this.form.beginDate = this.getMonthFirstDay(this.form.transferMonth)
          this.form.endDate = this.getMonthLastDay(this.form.transferMonth)
        } else {
          this.form.beginDate = null
          this.form.endDate = null
        }
        this.fetchSalaryCount()
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
      },
      // 获取工资相关的计算信息
      fetchSalaryCount () {
        if (this.form.employeeId && this.form.transferMonth) {
          req('getSalaryCount', {employeeId: this.form.employeeId, month: this.form.transferMonth}).then(res => {
            this.salaryAmount = res.salaryAmount == null ? 0 : res.salaryAmount
            this.attendanceDay = res.attendanceDay == null ? 0 : res.attendanceDay
            // 用于判断月份是否有考勤信息
            // this.isMonthOK = this.verifyDay
            this.verifyDay = res.verifyDay == null ? 0 : res.verifyDay
            // this.countAllocationAmount()
          }).catch(() => {
            this.verifyDay = false
          })
        }
      },
      // 分摊金额计算
      countAllocationAmount () {
        if (this.form.allocationDay && this.attendanceDay) {
          // 应出勤天数，暂时为24
          this.form.allocationAmount = (this.salaryAmount * this.form.allocationProportion / 100 * this.form.allocationDay / this.attendanceDay).toFixed(2)
        } else {
          this.form.allocationAmount = (this.salaryAmount * this.form.allocationProportion / 100).toFixed(2)
        }
        // this.form.allocationAmount = this.form.allocationAmount === 0 ? '' : this.form.allocationAmount
      },
      // 选择分摊比例或者分摊金额
      radioSelect () {
        this.fetchSalaryCount()
        // 选择分摊比例
        if (!this.isPercentType) {
          this.form.allocationProportion = 100
          this.radioWarn()
          this.countAllocationAmount()
          this.changeAllocationAmount()
        }
        // 选择分摊金额
        if (!this.isAmountType) {
          this.form.allocationProportion = ''
          this.form.allocationAmount = ''
          this.radioWarn()
        }
      },
      // 选择分摊比例或者分摊金额的提示
      radioWarn () {
        if (!this.form.employeeId) {
          return showMessage('warning', '请选择员工')
        }
        if (!this.form.transferMonth) {
          return showMessage('warning', '请选择划拨月份')
        }
      },
      // 分摊比例变化时候，自动计算分摊金额
      allocationProportionChange () {
        // this.radioWarn()
        this.countAllocationAmount()
      },
      // 分摊天数变化时候，自动计算分摊金额
      allocationDayChange () {
        // this.radioWarn()
        // this.fetchSalaryCount()
        this.countAllocationAmount()
        this.rules.allocationDay.validator = checkAmountRule(false, '', this.verifyDay, true, `费用分摊天数大于考勤天数${this.verifyDay}天`, this.verifyDay)
      },
      // 监听分摊的金额变化，进行校验
      changeAllocationAmount () {
        // this.rules.allocationAmount.validator = checkAmountRule(true, '请输入分摊金额或者选择分摊比例', this.salaryAmount, true, '分摊金额分摊大于当月工资')
      },
      /** 订单号窗口按钮 */
      handleSave (done) {
        let order = this.$refs.orderTable.selectOrder
        if (!order) {
          return showMessage('warning', '请选择一个订单号')
        } else {
          this.form.cropCode = order.cropCode
          this.form.internalOrder = order.aufnCode
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
      /** 获取费用单位Id,根据Id查询对应的划入成本中心 */
      nodeClick (a) {
        this.form.transferInUnit = a.orgUnitId
        req('getByIdOrgId', { unitId: a.orgUnitId }).then(res => {
          this.form.transferInCostCenterName = res.transferInCostCenterName
          this.form.transferInCostCenterCode = res.transferInCostCenterCode
        })
      }
    },
    watch: {
      'form.shareWay' (val, old) {
        if (val === '分摊比例') {
          this.isPercentType = false
          this.isAmountType = true
        } else if (val === '分摊金额') {
          this.isPercentType = true
          this.isAmountType = false
        }
      }
      // 监听分摊天数
      // 'form.allocationDay' () {
      //   this.countAllocationAmount()
      //   this.rules.allocationDay.validator = checkAmountRule(false, '', this.attendanceDay, true, '费用分摊天数大于应出勤天数')
      // },
      // 监听分摊金额值
      // 'form.allocationAmount' (val, old) {
      //   // this.form.allocationProportion = val
      //   // this.countAllocationAmount()
      //   this.rules.allocationAmount.validator = checkAmountRule(true, '请输入分摊金额或者选择分摊比例', this.salaryAmount, true, '分摊金额分摊大于当月工资')
      // }
    }
  }
</script>
<style lang="scss">

</style>