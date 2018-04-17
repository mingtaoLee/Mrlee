<template>
  <el-form :model="form" :rules="rules" label-width="120px">
    <el-row :gutter="5">
      <template v-if="!!form.id">
        <el-col :span="12">
          <el-form-item prop="personnelGroupName" label="人事范围">
            <el-input v-model="form.personnelGroupName" :disabled="!!form.id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="orgName" label="部门">
            <el-input v-model="form.orgName" :disabled="!!form.id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="effectiveDate" label="所属机构">
            <el-input v-model="form.orgPathName" :disabled="!!form.id"></el-input>
          </el-form-item>
        </el-col>
      </template>
      <el-col :span="12">
        <el-form-item prop="employeeCode" label="姓名">
          <el-input v-model="form.employeeName" :disabled="!!form.id" readonly @click.native="handlePersonnelClick">
            <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
          </el-input>
          <i-personnel-select :isShow.sync="isShowPersonnel" :defaultSelectedPersonnel="selectedPersonnel" @confirm="handlePersonnelDialogConfirm"></i-personnel-select>
        </el-form-item>
      </el-col>
      <!--<el-col :span="24">-->
        <!--<el-form-item prop="employeeName" label="姓名">-->
          <!--<el-input v-model="form.employeeName"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-col>-->
      <el-col :span="12">
        <el-form-item prop="businessType" label="业务类型">
          <i-select v-model="form.businessType" parameter="dict"></i-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="dispatchNum" label="配送量">
          <el-input v-model="form.dispatchNum" type="number"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="dispatchNumTarget" label="配送目标值">
          <el-input v-model="form.dispatchNumTarget" type="number"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="errorNum" label="出错次数">
          <el-input v-model="form.errorNum" type="number"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="reward" label="准确率奖励金">
          <el-input v-model.number="form.reward" type="number" :min="0" @change="handleRewardChange"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  export default {
    data () {
      return {
        isShowPersonnel: false,
        selectedPersonnel: [],
        rules: {
          areaCode: [
            { required: true, message: '省市区', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          reward: {
            min: 0, message: '不能为负数', type: 'number', trigger: 'change'
          }
        }
      }
    },
    created () {
    },
    props: {
      form: {
        type: Object,
        default: () => {
          return {
            personnelGroupName: '',
            orgName: '',
            orgPathName: '',
            employeeCode: '',
            employeeName: '',
            empEmployeeId: '',
            businessType: '',
            dispatchNum: '',
            dispatchNumTarget: '',
            errorNum: '',
            reward: ''
          }
        }
      }
    },
    methods: {
      handlePersonnelClick () {
        if (this.form.id) return
        this.isShowPersonnel = true
      },
      handlePersonnelDialogConfirm (selected) {
        this.form.employeeName = selected[0].employeeName
        this.form.empEmployeeId = selected[0].employeeId
      },
      handleRewardChange () {
        if (this.form.reward < 0) {
          this.form.reward = ''
          return
        }
        let minDecimal = this.form.reward.toFixed(2)
        console.log(minDecimal)
        if (this.form.reward !== minDecimal) {
          this.form.reward = parseFloat(minDecimal)
        }
      }
    },
    components: {
    }
  }
</script>
