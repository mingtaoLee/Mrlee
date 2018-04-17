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
      <el-form-item label="人事范围名称" prop="personnelGroupName">
        <remote-select
            v-model="dialogForm.personnelGroupName"
            :apiConfig="personnelApiConfig"
            @option-click="handlePersonnelOptionClick"
            :props="personnelProps"
            searchKey="personnelGroupName"
          ></remote-select>
      </el-form-item>
      <el-form-item label="人事范围代码" prop="personnelGroupCode">
        <el-input v-model="dialogForm.personnelGroupCode" disabled></el-input>
      </el-form-item>
      <el-form-item label="保险公司" prop="insuranceCompanyName">
        <el-input v-model="dialogForm.insuranceCompanyName"></el-input>
      </el-form-item>
      <el-form-item label="保单号" prop="policyCode">
        <el-input v-model="dialogForm.policyCode"></el-input>
      </el-form-item>
      <el-form-item label="最大参保人数" prop="insuredNumberPeople">
        <el-input v-model.number="dialogForm.insuredNumberPeople"></el-input>
      </el-form-item>
      <el-form-item label="保单金额" prop="policyMoney">
        <el-input v-model.number="dialogForm.policyMoney"></el-input>
      </el-form-item>
      <el-form-item label="生效日期" prop="effectiveDate">
        <el-date-picker 
          type="date" 
          v-model="dialogForm.effectiveDate"
          :editable="false"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="失效日期" prop="uneffectiveDate">
        <el-date-picker 
          type="date" 
          v-model="dialogForm.uneffectiveDate" 
          :editable="false"
        >
        </el-date-picker>
      </el-form-item>
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
      }
    },
    data () {
      return {
        toArray: '',
        isShow: false,
        // 人事范围远程搜索api配置项
        personnelApiConfig: {
          req: reqIndex,
          name: 'findPersonnelGroupCode'
        },
        personnelProps: {
          label: 'personnelGroupName',
          value: 'personnelGroupName'
        },
        toolbar: [
          {text: '取消', type: 'text', func: this.dialogCancel},
          {
            text: '确定',
            loading: false,
            type: 'primary',
            func: () => {
              this.toolbar[1].loading = true
              this.confirm()
            }}
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
            }
          ],
          uneffectiveDate: [
            {
              type: 'date', required: true, message: '请输入失效日期', trigger: 'change'
            }
          ],
          personnelGroupCode: [
            {
              required: true, message: '请输入人事范围代码', triger: 'change'
            }
          ],
          policyCode: [
            {
              required: true, message: '请输入保单号', triger: 'change'
            }
          ],
          insuredNumberPeople: [
            {
              type: 'number', required: true, message: '请输入最大参保人数', triger: 'change'
            }
          ],
          policyMoney: [
            {
              type: 'number', required: true, message: '请输入保单金额', triger: 'change'
            }
          ],
          insuranceCompanyName: [
            {
              required: true, message: '请输入保险公司'
            }
          ]
        }
      }
    },
    methods: {
      dialogCancel () {
        this.$emit('cancel')
      },
      confirm () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$emit('confirm')
          } else {
            return false
          }
        })
      },
      /** 人事范围选项点击事件监听 */
      handlePersonnelOptionClick (item) {
        console.log(item)
        this.dialogForm.personnelGroupCode = item.personnelGroupCode
      },
      handleIconClick () {
        this.isShow = !this.isShow
      },
      handleConfirm (selected) {
        this.dialogForm.employeeCode = selected[0].employeeCode
        this.getBasicMsg()
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
