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
        label-width="100px" 
        :model="dialogForm" 
        :rules="rules" 
        class="form-style"
      >
        <div>
          <el-form-item label="员工工号" prop="employeeCode">
            <el-input v-model="dialogForm.employeeCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="户头名称" prop="accountName">
            <remote-select
              v-model="dialogForm.accountName"
              dataKey="accountTwo"
              @option-click="handleOptionClick"
              :props="remoteProps"
              :extraParams="userParams"
            ></remote-select>
          </el-form-item>
          <el-form-item label="户头户口性质" prop="householdCode">
            <i-select clearable v-model="dialogForm.householdCode" parameter="IAF_ACCOUNT_TYPE" disabled></i-select>
          </el-form-item>
          <el-form-item label="公司缴纳基数" prop="compPayBase">
            <el-input v-model.number="dialogForm.compPayBase"></el-input>
          </el-form-item>
          <el-form-item label="参保申请时间" prop="increaseDate">
            <el-date-picker 
              type="date" 
              v-model="dialogForm.increaseDate"
              :editable="false"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="员工姓名" prop="fullName">
            <el-input v-model="dialogForm.fullName" disabled></el-input>
          </el-form-item>
          <el-form-item label="户头代码" prop="accountCode">
            <el-input v-model="dialogForm.accountCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="保险个人号码" prop="empInsuredAccount">
            <el-input v-model="dialogForm.empInsuredAccount"></el-input>
          </el-form-item>
          <el-form-item label="个人缴纳基数" prop="empPayBase">
            <el-input v-model.number="dialogForm.empPayBase"></el-input>
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentMethods">
            <i-select v-model="dialogForm.paymentMethods" parameter="IAF_PAYMENT_TYPE"></i-select>
          </el-form-item>
        </div>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
  import IDialog from 'components/common/i-dialog/i-dialog'
  import RemoteSelect from 'components/compensation/remote-select/index.vue'
  import req from 'api/iaf/insurance-manage'

  export default {
    components: {
      IDialog,
      RemoteSelect
    },
    props: {
      isDialogShow: {
        type: Boolean
      },
      dialogForm: {
        type: Object
      },
      minMaxVal: {
        type: Object
      }
    },
    data () {
      return {
        remoteProps: {
          label: 'accountNameA',
          value: 'accountNameA'
        },
        userParams: {userId: this.$store.getters.userId},
        title: '修改增员管理信息',
        toolbar: [
          {text: '取消', type: 'plane', func: this.dialogCancel},
          {
            text: '确定',
            type: 'primary',
            loading: false,
            func: () => {
              this.confirm()
            }
          }
        ]
      }
    },
    watch: {
      '$store.getters.userId' (newVal) {
        this.userParams.userId = newVal
      }
    },
    computed: {
      rules () {
        return {
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
          accountCode: [
            {
              required: true, message: '请输入户头代码'
            }
          ],
          accountName: [
            {
              required: true, message: '请输入户头名称'
            }
          ],
          domicileType: [
            {
              required: true, message: '请输入户口性质'
            }
          ],
          increaseDate: [
            {
              required: true, message: '请输入申请时间'
            }
          ],
          compPayBase: [
            {required: true, message: '请输入公司缴纳基数'},
            {type: 'number', min: this.minMaxVal.comMin, max: this.minMaxVal.comMax, message: '基数范围' + this.minMaxVal.comMin + '~' + this.minMaxVal.comMax}
          ],
          empPayBase: [
            {required: true, message: '请输入个人缴纳基数'},
            {type: 'number', min: this.minMaxVal.empMin, max: this.minMaxVal.empMax, message: '基数范围' + this.minMaxVal.empMin + '~' + this.minMaxVal.empMax}
          ],
          paymentMethods: [
            {
              required: true, message: '请输入支付方式'
            }
          ]
        }
      }
    },
    methods: {
      handleOptionClick (item) {
        this.dialogForm.accountCode = item.accountCode
        req('limitPayBase', {householdCode: this.dialogForm.householdCode, accountCode: this.dialogForm.accountCode, insuranceType: this.dialogForm.insuranceType, employeeCode: this.dialogForm.employeeCode}).then(datas => {
          let obj = {}
          obj.empMax = datas.empPayBaseLimit
          obj.empMin = datas.empPayBaseLower
          obj.comMax = datas.compPayBaseLimit
          obj.comMin = datas.compPayBaseLower
          this.minMaxVal = Object.assign({}, this.minMaxVal, obj)
        })
      },
      dialogCancel () {
        this.$emit('cancel')
      },
      confirm () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$emit('confirm', this.dialogForm)
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .form-style {
    display: flex;
  }
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
  .el-input-number {
    width: 100%;
  }
</style>
