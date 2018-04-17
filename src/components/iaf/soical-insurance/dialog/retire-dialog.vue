<template>
  <div>
    <i-dialog
      @close="dialogCancel"
      v-model="isDialogShow"
      size="standard"
      :title="title"
      :toolbar="toolbar"
      destroyedWhenClose
    >
      <el-form 
        ref="ruleForm"
        label-width="160px" 
        :model="dialogForm" 
        :rules="rules" 
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="工号" prop="employeeCode">
              <el-input 
                @click.native="handleIconClick" 
                v-model="dialogForm.employeeCode" 
                readonly
              >
                <i slot="suffix" class="el-input__icon el-icon-menu"></i>
              </el-input>
              <i-personnel-select :isShow.sync="isShow" :multiple="false" @confirm="handleConfirm" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" required>
              <el-input v-model="dialogForm.fullName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号" required>
              <el-input v-model="dialogForm.idNumber" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="雇佣状态" required>
              <i-select parameter="EMPLOYEE_STATUS" v-model="dialogForm.employeeStatus" disabled></i-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="参保户头" required>
              <el-input v-model="dialogForm.accountName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="户头代码" required>
              <el-input v-model="dialogForm.accountCode" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="个人基本医疗补缴费用" prop="selfBaseMedicalSupplement" required>
              <el-input :maxlength="10" v-model="dialogForm.selfBaseMedicalSupplement"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位基本医疗补缴费用" prop="compBaseMedicalSupplement" required>
              <el-input :maxlength="10" v-model="dialogForm.compBaseMedicalSupplement"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="个人大病补医保补缴费用" prop="selfSeriousMedicalSupplement" required>
              <el-input :maxlength="10" v-model="dialogForm.selfSeriousMedicalSupplement"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位大病补医保补缴费用" prop="compSeriousMedicalSupplement" required>
              <el-input :maxlength="10" v-model="dialogForm.compSeriousMedicalSupplement"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="医疗保险办理情况" prop="medicalInsuranceStatus" required>
              <i-select parameter="ENDOWMENT_INSURANCE_STATUS" v-model="dialogForm.medicalInsuranceStatus" disabled></i-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="医疗退休办理时间" prop="medicalTransactDate">
              <el-date-picker 
                type="month" 
                v-model="dialogForm.medicalTransactDate" 
                :editable="true"
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="缴费年月" prop="payDate">
              <el-date-picker 
                type="month" 
                v-model="dialogForm.payDate" 
                :picker-options="pickerOptions"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="个人大病补医保缴费基数">
              <el-input :maxlength="10" v-model="dialogForm.selfSeriousMedicalBase"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人大病补医保缴纳比例">
              <el-input :maxlength="10" v-model.number="dialogForm.selfSeriousMedicalRate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位大病补医保缴费基数">
              <el-input :maxlength="10" v-model="dialogForm.compSeriousMedicalBase"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位大病补医保缴纳比例">
              <el-input :maxlength="10" v-model.number="dialogForm.compSeriousMedicalRate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
            <el-form-item label="单位月费用">
              <el-input v-model="dialogForm.compPay" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="个人月费用">
              <el-input v-model="dialogForm.selfPay" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="合计">
              <el-input v-model="dialogForm.totalPay" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
  import IDialog from 'components/common/i-dialog/i-dialog'
  import req from 'api/iaf/insurance-manage'

  export default {
    components: {
      IDialog
    },
    props: {
      isDialogShow: {
        type: Boolean
      },
      dialogForm: {
        type: Object
      },
      tableData: {
        type: Object
      },
      title: {
        type: String
      }
    },
    data () {
      let checkNumber = (rule, value, cb) => {
        if (Number.isNaN(Number(value))) {
          cb(new Error('请输入数字'))
        } else if (Number(value) < 0) {
          cb(new Error('请输入正数'))
        } else {
          cb()
        }
      }
      return {
        toArray: '',
        isShow: false,
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        toolbar: [
          {text: '取消', type: 'plane', func: this.dialogCancel},
          {
            text: '确定',
            type: 'primary',
            loading: false,
            func: () => {
              this.toolbar[1].loading = true
              this.confirm()
            }
          }
        ],
        rules: {
          medicalTransactDate: [
            {
              type: 'date', required: true, message: '请输入医疗退休办理时间'
            }
          ],
          payDate: [
            {
              type: 'date', required: true, message: '请输入缴费月份'
            }
          ],
          employeeCode: [
            {
              required: true, message: '请输入员工工号'
            }
          ],
          fullName: [
            {
              required: true, message: '请输入员工姓名'
            }
          ],
          medicalInsuranceStatus: [
            {
              required: true, message: '请输入医疗退休办理情况'
            }
          ],
          selfBaseMedicalSupplement: [
            {
              required: true, message: '请输入个人基本医疗补缴费用'
            },
            {
              validator: checkNumber, trigger: 'change'
            }
          ],
          compBaseMedicalSupplement: [
            {
              required: true, message: '请输入单位基本医疗补缴费用'
            },
            {
              validator: checkNumber, trigger: 'change'
            }
          ],
          selfSeriousMedicalSupplement: [
            {
              required: true, message: '请输入个人大病医疗补缴费用'
            },
            {
              validator: checkNumber, trigger: 'change'
            }
          ],
          compSeriousMedicalSupplement: [
            {
              required: true, message: '请输入单位大病医疗补缴费用'
            },
            {
              validator: checkNumber, trigger: 'change'
            }
          ],
          selfSeriousMedicalBase: [
            {
              required: true, message: '请输入个人大病医保缴费基数'
            },
            {
              validator: checkNumber, trigger: 'change'
            }
          ],
          compSeriousMedicalBase: [
            {
              required: true, message: '请输入单位大病医保缴费基数'
            },
            {
              validator: checkNumber, trigger: 'change'
            }
          ]
        }
      }
    },
    watch: {
      'dialogForm.selfSeriousMedicalBase' (newVal) {
        this.dialogForm.selfPay = Number((newVal * (this.dialogForm.selfSeriousMedicalRate * 0.01)).toFixed(2))
        this.dialogForm.totalPay = Number((this.dialogForm.compPay + this.dialogForm.selfPay).toFixed(2))
      },
      'dialogForm.compSeriousMedicalBase' (newVal) {
        this.dialogForm.compPay = Number((newVal * (this.dialogForm.compSeriousMedicalRate * 0.01)).toFixed(2))
        this.dialogForm.totalPay = Number((this.dialogForm.compPay + this.dialogForm.selfPay).toFixed(2))
      },
      'dialogForm.selfSeriousMedicalRate' (newVal) {
        this.dialogForm.selfPay = Number(((newVal * 0.01) * this.dialogForm.selfSeriousMedicalBase).toFixed(2))
        this.dialogForm.totalPay = Number((this.dialogForm.compPay + this.dialogForm.selfPay).toFixed(2))
      },
      'dialogForm.compSeriousMedicalRate' (newVal) {
        this.dialogForm.compPay = Number(((newVal * 0.01) * this.dialogForm.compSeriousMedicalBase).toFixed(2))
        this.dialogForm.totalPay = Number((this.dialogForm.compPay + this.dialogForm.selfPay).toFixed(2))
      }
    },
    methods: {
      // 通过工号获得员工基本信息
      getBasicMsg () {
        req('retireGetEmpBasicMsg', {employeeCode: this.dialogForm.employeeCode}).then(data => {
          console.log(data)
          data.medicalTransactDate && (data.medicalTransactDate = new Date(data.medicalTransactDate))
          this.dialogForm.compPay = Number((data.compSeriousMedicalBase * data.compSeriousMedicalRate).toFixed(2))
          this.dialogForm.selfPay = Number((data.selfSeriousMedicalBase * data.selfSeriousMedicalRate).toFixed(2))
          this.dialogForm.totalPay = Number((this.dialogForm.compPay + this.dialogForm.selfPay).toFixed(2))
          // data.medicalInsuranceStatus = '0' + data.medicalInsuranceStatus
          if (data.medicalInsuranceStatus === '01') {
            data.medicalInsuranceStatus = '申请中'
          } else if (data.medicalInsuranceStatus === '02') {
            data.medicalInsuranceStatus = '已完结'
          } else {
            data.medicalInsuranceStatus = ''
          }
          this.$emit('update:dialogForm', Object.assign({}, this.dialogForm, data))
        })
      },
      dialogCancel () {
        this.$emit('cancel')
      },
      confirm () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$emit('confirm', this.dialogForm)
          } else {
            this.toolbar[1].loading = false
            return false
          }
        })
      },
      handleIconClick () {
        this.isShow = !this.isShow
      },
      handleConfirm (selected) {
        this.dialogForm.employeeCode = selected[0].employeeCode
        this.getBasicMsg()
      },
      // 获取 request 数据（增删改集合）
      getTableData (data) {
        this.$message({
          message: data
        })
      },
      // 获取内部所有数据
      getTableClone (data) {
        this.table.data = data
      },
      cruentSelectVal (row) {
        if (row.col === 'typeCode') {
          this.toArray = row.val.split(',')
        } else if (row.col === 'accountCode') {
          let codeVal = row.val.substr(0, 2)
          if (this.toArray[0] !== codeVal) {
            this.$message.error('户头代码类型不匹配！')
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.box{
  padding-left:20px;
  padding-bottom:10px;
  border:1px solid #aaa;
  border-radius:5px;
  box-sizing:border-box;
}
.el-icon-circle-plus-outline{
  font-size:20px;
}
.el-icon-circle-close-outline{
  font-size:20px;
}
.table-title{
  text-align:center;
}
.delete-col{
  text-align:center;
}
</style>
