<template>
  <div>
    <!-- 社保批量补缴 -->
    <i-process-flow
      processType="iafComplementarityPersonalFlow" 
      @fillin="fillIn">
      <div slot="socialSecurityApplication">
        <div class="module">
          <h2>社保补缴申请</h2>
          <el-form :inline="true" :rules="checkout" label-width="100px" :model="iafInfo">
            <el-row>
              <el-col :span="8">
                <el-form-item label="工号" prop="employeeCode"  v-if="showMap.employeeCode">
                  <template v-if="showInput">
                    <el-input 
                      v-model="iafInfo.employeeCode" 
                      @click.native="handleIconClick"
                      :disabled="disabledMap.employeeCode"
                      readonly>
                      <i slot="suffix" class="el-input__icon el-icon-menu" v-if="!disabledMap.employeeCode"></i>
                    </el-input>
                    <i-personnel-select :isShow.sync="isShow" :multiple="false" @confirm="handleConfirm" v-if="!disabledMap.employeeCode"></i-personnel-select>
                  </template>
                  <span v-else>{{iafInfo.employeeCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="姓名" v-if="showMap.fullName">
                    <span>{{iafInfo.fullName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="人事范围" v-if="showMap.personnelGroupName">
                  <span>{{iafInfo.personnelGroupName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div slot="insuranceInformation">
          <div class="module">
            <h2>参保信息</h2>
            <i-table
              :table="table"
              @pageSizeChange="handleSizeChange"
              @pageIndexChange="handleCurrentChange"
              @clone="getTableClone">
              <template slot="table" slot-scope="tableScope">
                <el-table
                  @selection-change="selectionChangeHandler"
                  :data="tableScope.clone"
                >
                  <el-table-column type="selection"></el-table-column>
                  <el-table-column
                    v-for="col of tableScope.columns"
                    :key="col.prop"
                    :prop="col.prop"
                    :label="col.label"
                    align="center"
                    :formatter="tableScope.formatter"
                    :width="col.width"
                  >
                    <template slot-scope="scope">
                      <i-table-cell 
                        :row="scope.row" 
                        :col="col.prop" 
                        :table="tableScope"
                      ></i-table-cell>
                    </template>
                    <el-table-column
                      v-for="son of col.children"
                      :key="son.prop"
                      :prop="son.prop"
                      :label="son.label"
                      :width="son.width"
                      :formatter="tableScope.formatter"
                    >
                      <template slot-scope="scope">
                        <i-table-cell
                          @change="changeData(scope.row)"
                          :row="scope.row"
                          :col="son.prop"
                          :table="tableScope"
                        ></i-table-cell>
                      </template>
                    </el-table-column>
                  </el-table-column>
                </el-table>
              </template>
            </i-table>
          </div>
           <i-dialog
            v-model="dialogVisible"
            title="增加补缴信息"
            size="large"
            :toolbar="toolbar"
          >
            <div>
              <el-form 
              ref="ruleForm"
              :inline="true" 
              label-width="120px" 
              :model="addFormData" 
              :rules="rules"
            >
              <el-form-item label="申请人">
                <span>{{iafInfo.fullName}}</span>
              </el-form-item>
              <el-form-item label="申请年月" >
                <span>{{time}}</span>
              </el-form-item>
              <el-form-item label="补缴险种" prop="checkedCities1">
                <el-checkbox-group v-model="addFormData.checkedCities1">
                  <el-checkbox v-for="city in cities" :label="city.value" :key="city.value" name="type">{{city.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="缴纳起始月份" prop="startMonth">
                <el-date-picker
                  v-model="addFormData.startMonth"
                  type="month"
                  placeholder="选择月份"
                  :editable="false"
                  :picker-options="startMonthTwoOptions"
                  @change="handleDateChange(addFormData.startMonth, 'addFormData', 'startMonth', 'date')"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="缴纳结束月份" prop="endMonth">
                <el-date-picker
                  v-model="addFormData.endMonth"
                  type="month"
                  placeholder="选择月份"
                  :editable="false"
                  :picker-options="endMonthTwoOptions"
                  @change="handleDateChange(addFormData.endMonth, 'addFormData', 'endMonth', 'date')"
                ></el-date-picker>
              </el-form-item>
              <el-col :span="24">
                <el-form-item label="补缴原因" prop="reason">
                  <i-select  placeholder="请选择补缴原因" parameter="IAF_SUPPLEMENT_REASON" v-model="addFormData.reason"></i-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="缴费状态" prop="paymentStatus">
                  <i-select placeholder="请选缴费状态" parameter="PAYMENT_STATUS" v-model="addFormData.paymentStatus"></i-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="缴费类型" prop="paymentType">
                  <i-select placeholder="请选缴费类型" parameter="PAYMENT_TYPE" v-model="addFormData.paymentType"></i-select>
                </el-form-item>
              </el-col>
            </el-form>
            </div>
          </i-dialog>
      </div>
    </i-process-flow>
  </div>
</template>
<script>
  import IProcessFlow from 'components/common/i-process-flow'
  import iafBaseInfoMixin from 'mixins/compensation/iaf-base-info'
  import processMixin from 'mixins/process'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import iafSearchMixin from 'mixins/compensation/iaf-search-mixin'
  import req from 'api/iaf/iaf-flow'
  import moment from 'moment'
  const cityOptions = [
    {name: '养老', value: '01'},
    {name: '医疗', value: '03'},
    {name: '工伤', value: '04'},
    {name: '生育', value: '05'},
    {name: '失业', value: '02'},
    {name: '公积金', value: '0A'},
    {name: '补充工伤', value: '06'},
    {name: '大病补医疗', value: '07'}
  ]
  export default {
    name: 'iafComplementarityPersonalFlow',
    components: {
      IProcessFlow,
      IDialog
    },
    data () {
      return {
        checkout: {
          employeeCode: [{ required: true, message: '请输入工号', trigger: 'change' }]
        },
        rules: {
          checkedCities1: [
            { type: 'array', required: true, message: '请至少选择一个补缴险种', trigger: 'change' }
          ],
          startMonth: [
            { type: 'date', required: true, message: '请选择缴纳起始时间', trigger: 'change' }
          ],
          endMonth: [
            { type: 'date', required: true, message: '请选择缴纳结束时间', trigger: 'change' }
          ],
          reason: [
          { required: true, message: '请选择补缴原因', trigger: 'change' }
          ],
          paymentStatus: [
          { required: true, message: '请选择缴费状态', trigger: 'change' }
          ],
          paymentType: [
          { required: true, message: '请选择缴费类型', trigger: 'change' }
          ]
        },
        idArr: [],
        employeeId: '',
        // 险种类型
        insuranceType: [],
        // 时间单位
        time: Date.now(),
        dialogVisible: false,
        table: {
          title: '',
          columns: [
            { prop: 'startMonth', label: '缴纳起始月份', width: '100', display: { date: 'yyyy-MM' } },
            { prop: 'endMonth', label: '缴纳结束月份', width: '100', display: { date: 'yyyy-MM' } },
            { prop: 'insuranceType', label: '险种', width: '150', display: { dict: 'INSURANCE_TYPE' } },
            { prop: 'accountCode', label: '户头', width: '150' },
            { prop: 'reason', label: '补缴原因', width: '150', display: { dict: 'IAF_SUPPLEMENT_REASON' } },
            { prop: 'paymentStatus', label: '原因说明', width: '150', display: { dict: 'PAYMENT_STATUS' } },
            { prop: 'paymentType', label: '缴费类型', width: '150', display: { dict: 'PAYMENT_TYPE' } },
            {
              label: '单位部分',
              children: [
                { prop: 'compPayBase', label: '单位基数', width: '200' },
                { prop: 'compPayRatio', label: '单位比例(%)', width: '100' },
                { prop: 'compPayValue', label: '单位纳金额', width: '100' },
                { prop: 'compPayValueUnit', label: '单位承担（个人补缴金额*）', width: '100' }]
            },
            {
              label: '个人部分',
              children: [
                { prop: 'empPayBase', label: '个人基数', width: '150' },
                { prop: 'empPayRatio', label: '个人比例(%)', width: '150' },
                { prop: 'empPayValue', label: '个人激纳金额', width: '150' },
                { prop: 'empPayValueUnit', label: '个人承担（单位补缴*）', width: '150' }
              ]
            },
            {
              label: '滞纳金',
              children: [
                { prop: 'compPenalty', label: '单位', width: '150' },
                { prop: 'selfPenalty', label: '个人', width: '150' }
              ]
            },
            {
              label: '合计（分摊情况）',
              children: [
                { prop: 'compPayValueSummary', label: '单位部分', width: '150' },
                { prop: 'empPayValueSummary', label: '个人部分', width: '150' }
              ]
            }
          ],
          setting: {
            toolbar: [
              {text: '增加', func: this.addRecord},
              {text: '删除', func: this.deleteRow}
            ],
            editor: {
              paymentType: {
                type: 'select'
              },
              startMonth: {
                disable: true
              },
              endMonth: {
                disable: true
              },
              insuranceType: {
                disable: true
              },
              accountCode: {
                disable: true
              },
              compPayValue: {
                disable: true
              },
              compPayRatio: {
                disable: true
              },
              compPayValueUnit: {
                disable: true
              },
              empPayRatio: {
                disable: true
              },
              empPayValue: {
                disable: true
              },
              empPayValueUnit: {
                disable: true
              },
              compPayValueSummary: {
                disable: true
              },
              empPayValueSummary: {
                disable: true
              },
              reason: {
                type: 'select',
                options: {
                  change: (row) => this.changeData(row)
                }
              },
              paymentStatus: {
                type: 'select'
              },
              compPayBase: {
                type: 'number'
              },
              empPayBase: {
                type: 'number'
              },
              compPenalty: {
                type: 'number'
              },
              selfPenalty: {
                type: 'number'
              }
            }
          },
          editable: true,
          data: []
        },
        // 时间
        isShow: false,
        showInput: true,
        // 多选
        addFormData: {
          checkedCities1: [],
          startMonth: '',
          endMonth: '',
          personage: '',
          unit: '',
          reason: '',
          paymentStatus: ''
        },
        cities: cityOptions,
  
      // 弹出框的确认
        toolbar: [{
          text: '确定',
          type: 'primary',
          func: (done) => {
            console.log('confirm')
            this.confirm()
            // done()
          }
        }, {
          text: '取消',
          type: 'text',
          func: (done) => {
            console.log('cancel')
            done()
          }
        }]
      }
    },
    computed: {
      flowData () {
        return {
          employeeId: this.employeeId,
          paymentType: '02',
          // 社保类型
          insuranceType: '01',
          // 户头id
          accountId: 'null',
          // // 缴费状态
          paymentStatus: '03',
          empPayValue: '',
          compPayValue: '',
          longtopNo: null,
          createBy: this.employeeId,
          createDate: this.time,
          lastUpdateBy: this.employeeId,
          lastUpdateDate: this.time
        }
      }
    },
    mixins: [processMixin, iafBaseInfoMixin, iafSearchMixin],
    methods: {
      deleteRow ({clone}) {
        if (!this.idArr.length) return this.$message({type: 'danger', text: '请先选择数据'})
        for (let i = 0; i < this.idArr.length; i++) {
          for (let j = 0; j < clone.length; j++) {
            clone[j]._id === this.idArr[i] && clone.splice(j, 1)
          }
        }
        this.table.data = clone
      },
      handleSizeChange () {},
      handleCurrentChange () {},
      selectionChangeHandler (tableScope) {
        this.idArr = tableScope.map(item => {
          return item._id
        })
      },
      // 添加
      addRecord () {
        if (!this.iafInfo.employeeCode) {
          this.$message({
            type: 'info',
            message: '请先选择申请人'
          })
        } else {
          this.dialogVisible = true
          this.time = moment(this.time).format('YYYY-MM-DD')
        }
      },
      // cancel () {
      //   this.dialogVisible = false
      // },
      postFlow () {
        this.table.data.selfPenalty || (this.table.data.selfPenalty = 0)
        this.table.data.compPenalty || (this.table.data.compPenalty = 0)
        return {
          IafPreOrSupplyInsertDtos: this.table.data,
          employeeId: this.employeeId,
          iafInfo: this.iafInfo,
          idNumber: this.iafInfo.idNumber,
          operateType: 'insuranceCreateFlow'
        }
      },
      fillIn (data) {
        this.table.editable = true
        this.table.data = data.IafPreOrSupplyInsertDtos
        this.employeeId = data.employeeId
        this.iafInfo = data.iafInfo
        this.iafInfo.idNumber = data.idNumber
      },
      // 显示弹出框
      handleIconClick () {
        this.isShow = !this.isShow
      },
      handleConfirm (selected) {
        // 获取基本信息
        req('iafEmpIdGetBasicMsg', {employeeId: selected[0].employeeId}).then(data => {
          this.iafInfo = Object.assign({}, this.iafInfo, data)
        })
        this.employeeId = selected[0].employeeId
      },
      // 弹出框的确认
      confirm () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let count = -1
            for (let i = 0; i < this.addFormData.checkedCities1.length; i++) {
              let submitData = {
                employeeId: this.employeeId,
                insuranceType: this.addFormData.checkedCities1[i],
                startMonth: moment(this.addFormData.startMonth).format('YYYY-MM-DD'),
                endMonth: moment(this.addFormData.endMonth).format('YYYY-MM-DD'),
                pageSize: 1,
                pageIndex: 1
              }
              req('iafDeclareGetData', submitData).then(data => {
                count++
                data.paymentStatus = this.addFormData.paymentStatus
                data.reason = this.addFormData.reason
                this.flowData.insuranceType = this.addFormData.checkedCities1[count]
                data.paymentType = this.addFormData.paymentType
                data.startMonth = moment(this.addFormData.startMonth).format('YYYY-MM-DD')
                data.endMonth = moment(this.addFormData.endMonth).format('YYYY-MM-DD')
                this.countPayment(data, this.addFormData.reason)
                this.table.data.push(Object.assign({}, this.flowData, data))
              })
              this.dialogVisible = false
            }
          } else {
            return false
          }
        })
      },
      // 获取到点击到的险种类型
      handleCheckedCitiesChange (vla) {
        this.insuranceType = vla.map(item => {
          if (item === 0) return '0'
          return '0' + item
        }).join(',')
      },
      countPayment (data, reason) {
        if (reason === '01') {
          data.compPayValue = 0
          data.compPayValueUnit = 0
          data.empPayValueUnit = Number((data.compPayBase * data.compPayRatio).toFixed(2))
          data.empPayValue = Number((data.empPayBase * data.empPayRatio).toFixed(2))
        } else if (reason === '02') {
          data.compPayValueUnit = 0
          data.empPayValueUnit = 0
          data.compPayValue = Number((data.compPayBase * data.compPayRatio).toFixed(2))
          data.empPayValue = Number((data.empPayBase * data.empPayRatio).toFixed(2))
        } else if (reason === '03') {
          data.empPayValue = 0
          data.empPayValueUnit = 0
          data.compPayValue = Number((data.compPayBase * data.compPayRatio).toFixed(2))
          data.compPayValueUnit = Number((data.empPayBase * data.empPayRatio).toFixed(2))
        }
        data.compPayValueSummary = this.keepTwoDecimalFull(this.countIsNull(data.compPayValue) + this.countIsNull(data.compPayValueUnit) + Number(this.countIsNull(data.compPenalty).toFixed(2)))
        data.empPayValueSummary = this.keepTwoDecimalFull(this.countIsNull(data.empPayValue) + this.countIsNull(data.empPayValueUnit) + Number(this.countIsNull(data.selfPenalty).toFixed(2)))
      },
      countIsNull (data) {
        return Number(data) || 0
      },
      keepTwoDecimalFull (num) {
        var result = parseFloat(num)
        result = Math.round(num * 100) / 100
        var newResult = result.toString()
        var posDecimal = newResult.indexOf('.')
        if (posDecimal < 0) {
          posDecimal = newResult.length
          newResult += '.'
        }
        while (newResult.length <= posDecimal + 2) {
          newResult += '0'
        }
        return newResult
      },
      changeData (row) {
        this.countPayment(row, row.reason)
        this.table.data[row._id] = row
      }
    }
  }
</script>
<style lang="scss" scoped>
  .module {
    min-width: 850px;
    border-bottom: 1px solid #e5e5e5;
    margin: 20px;
    h2 {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: bold;
      color: #000000;
      letter-spacing: 0;
      margin-bottom: 20px;
    }
  }
  .el-dropdown-link{
    cursor: pointer;
  }
  .textarea {
    width: 500px;
  }
</style>
