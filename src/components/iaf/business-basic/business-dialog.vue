<template>
  <div>
    <i-dialog
      v-model="isDialogShow"
      :title="title"
      size="standard"
      :toolbar="toolbar"
      @close="dialogCancel"
      destroyedWhenClose
    >
    <el-form :model="dialogForm" label-width="120px" :rules="rules" ref="ruleForm">
      <div class="out-box">
        <div class="letf-box">
          <el-form-item label="人事范围名称" prop="personnelGroupName">
            <remote-select
                v-model="dialogForm.personnelGroupName"
                :apiConfig="personnelApiConfig"
                @option-click="handlePersonnelOptionClick"
                :props="personnelProps"
                :extraParams="extraParams"
              ></remote-select>
          </el-form-item>
          <el-form-item label="人事范围代码" prop="personnelGroupCode">
            <el-input v-model="dialogForm.personnelGroupCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="保险公司" prop="insuranceCompanyName">
            <el-input v-model="dialogForm.insuranceCompanyName"></el-input>
          </el-form-item>
          <el-form-item label="最大参保人数" prop="insuredNumberPeople">
            <el-input-number 
              v-model="dialogForm.insuredNumberPeople" 
              :min="1">
            </el-input-number>
            <!-- <el-input v-model="dialogForm.insuredNumberPeople"></el-input> -->
          </el-form-item>
        </div>
        <div class="right-box">
          <el-form-item label="保单号" prop="policyCode">
            <el-input v-model="dialogForm.policyCode" @blur="takeInfo"></el-input>
          </el-form-item>
          <el-form-item label="保单金额" prop="policyMoney">
            <el-input v-model="dialogForm.policyMoney"></el-input>
          </el-form-item>
          <el-form-item label="生效日期" prop="effectiveDate">
            <el-date-picker 
              type="date" 
              v-model="dialogForm.effectiveDate"
              :editable="false"
              @change="effectiveDateEvt"
              :picker-options="pickerOptions.effectiveOption"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="失效日期" prop="uneffectiveDate">
            <el-date-picker 
              type="date" 
              v-model="dialogForm.uneffectiveDate" 
              :editable="false"
              :disabled="uneffectiveStatus"
              :picker-options="pickerOptions.uneffectiveOption"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </div>
    </el-form>
    </i-dialog>
  </div>
</template>

<script>
  import IDialog from 'components/common/i-dialog/i-dialog'
  import RemoteSelect from 'components/iaf/remote-select'
  import reqIndex from 'api/iaf/iaf-basic.js'
  // import req from 'api/iaf/insurance-manage'

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
      title: {
        type: String
      },
      changeRow: {
        type: Boolean
      },
      uneffectiveStatus: {
        type: Boolean
      }
    },
    watch: {
      changeRow (newVal) {
        this.uneffectiveStatus = newVal
      }
    },
    computed: {
      extraParams () {
        return {
          num: 50,
          userId: this.$store.getters.userId
        }
      }
    },
    data () {
      // 非负校验
      let checkNegative = (rule, value, callback) => {
        if (value !== '') {
          +value < 0
          ? callback(new Error('不能输入负数'))
          : callback()
        } else {
          callback()
        }
      }
      // 整数校验
      let checkInteger = (rule, value, callback) => {
        value = Number(value);
        (typeof value === 'number') && (value % 1 === 0)
        ? callback()
        : callback(new Error('只能输入整数'))
      }
    // 是否是数字校验
      let checkNumber = (rule, value, callback) => {
        if (value !== '') {
          if (isNaN(value)) {
            callback(new Error('请输入数字'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      // 最大值校验
      let checkMax = (rule, value, callback) => {
        if (rule.fullField === 'insuredNumberPeople') {
          +value > 99999999999
        ? callback(new Error('最大参保人数不能大于99,999,999,999人'))
        : callback()
        } else if (rule.fullField === 'policyMoney') {
          +value > 999999999999.99
        ? callback(new Error('保单金额不能大于999,999,999,999.99元'))
        : callback()
        }
      }
      // 生效日期校验
      let checkEffectiveDate = (rule, value, callback) => {
        if (value !== '' && this.dialogForm.uneffectiveDate !== '') {
          this.$refs.ruleForm.validateField('uneffectiveDate')
          callback()
        }
      }
      // // 失效日期校验
      let checkUneffectiveDate = (ruel, value, callback) => {
        if (value !== '' && this.dialogForm.effectiveDate !== '') {
          this.dialogForm.effectiveDate >= value
          ? callback(new Error('失效日期不能早于生效日期'))
          : callback()
        }
      }
      return {
        toArray: '',
        isShow: false,
        // uneffectiveStatus: false,
        // 人事范围远程搜索api配置项
        personnelApiConfig: {
          req: reqIndex,
          name: 'findPersonnelGroupCode'
        },
        personnelProps: {
          label: 'personnelGroupNameA',
          value: 'personnelGroupNameA'
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
          personnelGroupName: [
            {
              required: true, message: '请输入人事范围名称', trigger: 'change'
            }
          ],
          effectiveDate: [
            {
              type: 'date', required: true, message: '请输入生效日期', trigger: 'change'
            },
            {
              validator: checkEffectiveDate, trigger: 'change'
            }
          ],
          uneffectiveDate: [
            {
              type: 'date', required: true, message: '请输入失效日期', trigger: 'change'
            },
            {
              validator: checkUneffectiveDate, trigger: 'change'
            }
          ],
          personnelGroupCode: [
            {
              required: true, message: '请输入人事范围代码', trigger: 'change'
            }
          ],
          policyCode: [
            {
              required: true, message: '请输入保单号', trigger: 'change'
            }
          ],
          insuredNumberPeople: [
            {
              required: true, message: '请输入最大参保人数', pattern: /.+/
            },
            {
              validator: checkNumber, trigger: 'change'
            },
            {
              validator: checkNegative, trigger: 'change'
            },
            {
              validator: checkInteger, trigger: 'change'
            },
            {
              validator: checkMax, trigger: 'change'
            }
          ],
          policyMoney: [
            {
              required: true, message: '请输入保单金额', pattern: /.+/, trigger: 'change'
            },
            {
              validator: checkNumber, trigger: 'change'
            },
            {
              validator: checkNegative, trigger: 'change'
            },
            {
              validator: checkMax, trigger: 'change'
            }
          ],
          insuranceCompanyName: [
            {
              required: true, message: '请输入保险公司', trigger: 'change'
            }
          ]
        },
        // 日期选择器的时间限制
        pickerOptions: {
          effectiveOption: {
            disabledDate: (time) => {
              let uneffectiveDate = this.dialogForm.uneffectiveDate
              if (uneffectiveDate) {
                return time.getTime() >= uneffectiveDate
              }
            }
          },
          uneffectiveOption: {
            disabledDate: (time) => {
              let effectiveDate = this.dialogForm.effectiveDate
              if (effectiveDate) {
                return time.getTime() <= effectiveDate
              }
            }
          }
        }
      }
    },
    methods: {
      dialogCancel () {
        this.resetInputStatus()
        this.$emit('cancel')
      },
      resetInputStatus () {
        this.companyStatus = false
        this.money = false
        this.numberPeople = false
      },
      confirm () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.resetInputStatus()
            this.$emit('confirm')
          } else {
            this.$message({
              type: 'error',
              message: '请按提示正确填写表单！'
            })
            this.toolbar[1].loading = false
            return false
          }
        })
      },
      /** 人事范围选项点击事件监听 */
      handlePersonnelOptionClick (item) {
        this.dialogForm.personnelGroupCode = item.personnelGroupCode
      },
      handleIconClick () {
        this.isShow = !this.isShow
      },
      handleConfirm (selected) {
        this.dialogForm.employeeCode = selected[0].employeeCode
        this.getBasicMsg()
      },
      effectiveDateEvt () {
        if (!this.uneffectiveStatus) {
          let times = this.dialogForm.effectiveDate.setTime(this.dialogForm.effectiveDate.getTime())
          let copyTime = times - 3600 * 1000 * 24
          let date = new Date(copyTime)
          let Y = date.getFullYear() + 1
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
          let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
          let time = Y + '-' + M + '-' + D
          this.dialogForm.uneffectiveDate = new Date(time)
        }
      },
      takeInfo () {
        let option = this.dialogForm.policyCode
        reqIndex('takeInfo', option).then(data => {
          data ? this.uneffectiveStatus = true : this.uneffectiveStatus = false
          try {
            data.uneffectiveDate = new Date(data.uneffectiveDate)
            data.effectiveDate = new Date(data.effectiveDate)
            this.$set(this.dialogForm, 'personnelGroupCodes', data.personnelGroupCodes)
            Object.assign(this.dialogForm, {insuranceCompanyName: data.insuranceCompanyName, insuredNumberPeople: data.insuredNumberPeople, policyMoney: data.policyMoney, effectiveDate: data.effectiveDate, uneffectiveDate: data.uneffectiveDate})
          } catch (e) {
            let obj = {
              policyMoney: '',
              insuranceCompanyName: '',
              insuredNumberPeople: '',
              effectiveDate: '',
              uneffectiveDate: ''
            }
            Object.assign(this.dialogForm, obj)
          }
        })
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
.out-box {
  display: flex
}
.el-input-number {
  width: 193px;
}
</style>
