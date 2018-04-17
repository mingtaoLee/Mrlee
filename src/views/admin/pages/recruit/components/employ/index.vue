<template>
  <section class="emp-job content-follow">
    <h2 class="info-title">员工录用信息</h2>

    <el-form
      :model="employInfo"
      label-width="120px"
      class="form-main clearfix"
      :rules="rules">
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="姓名"
            prop="name">
           <el-input
            v-model.trim="employInfo.name"
            :disabled="editable || isEditWithName"
            @focus="employInfoNameFocusHandler"
            :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="录用公司"
            prop="company">
           <el-input v-model.trim="employInfo.company" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="录用部门"
            prop="department">
           <el-input v-model.trim="employInfo.departmentName" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="录用岗位"
            prop="position">
            <el-input v-model.trim="employInfo.positionName" :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="拟入职日期"
            prop="entryDate">
           <el-date-picker
              v-model="employInfo.entryDate"
              value-format="yyyy-MM-dd"
              :disabled="editable">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="合同年限"
            prop="contractTime">
           <el-input v-model.trim="employInfo.contractTime" :disabled="editable">
             <template slot="append">年</template>
           </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="试用期"
            prop="probationTime">
           <el-input v-model.trim="employInfo.probationTime" :disabled="editable">
             <template slot="append">个月</template>
           </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="聘用方式"
            prop="hireType">
            <i-select
              :filterable="true"
              v-model="employInfo.hireType"
              parameter="HIRE_TYPE"
              :disabled="editable"
              placeholder="请选择"></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="用工类型"
            prop="empType">
            <i-select
              :filterable="true"
              v-model="employInfo.empType"
              parameter="EMPLOYEE_TYPE"
              :disabled="editable"
              placeholder="请选择"></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="试用期薪资"
            prop="probationPay">
           <!-- <el-input v-model.trim="employInfo.probationPay" :disabled="editable">
             <template slot="append">元/月</template>
           </el-input> -->
           <el-input v-model.trim="employInfo.probationPay"
            class="input-with-select select"
            :disabled="editable"
            >
             <el-select
              v-model="employInfo.probationPayType"
              slot="append"
              disabled="editable"
             >
              <el-option label="元/时" value="2"></el-option>
              <el-option label="元/月" value="1"></el-option>
            </el-select>
           </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="转正后薪资"
            prop="salary">
            <el-input
            v-model.trim="employInfo.salary"
            class="input-with-select select"
            :disabled="editable"
           >
            <el-select
              v-model="employInfo.salaryType"
              slot="append"
              :disabled="editable"
             >
               <el-option label="元/时" value="2"></el-option>
               <el-option label="元/月" value="1"></el-option>
            </el-select>
           </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="其他说明"
            prop="otherExplain">
           <el-input
            type="textarea"
            v-model.trim="employInfo.otherExplain"
            :disabled="editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 职位选择器 -->
    <position-selection
      type="mini"
      v-model="positionSelectDialogFlag"
      @change="selectPositionConfirm">
    </position-selection>
    <!-- 选择录用者姓名弹窗 -->
    <employ-people-dialog
      :show="peopleDialogFlag"
      @cancel="cancelPeopleDialogHandler"
      @confirm="confirmPeopleDialogHandler"
      ></employ-people-dialog>
  </section>
</template>
<script>
import PositionSelection from 'components/position/position-selection'
import EmployPeopleDialog from './employ-people-dialog/index'
export default {
  name: 'EmployInfo',
  components: {
    PositionSelection,
    EmployPeopleDialog
  },
  props: {
    // 录用信息
    employInfo: Object,
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    },
    // 名字是否可编辑
    isEditWithName: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 职位选择器显示
      positionSelectDialogFlag: false,
      // 需求者姓名弹窗
      peopleDialogFlag: false,
      // 规则
      rules: {}
    }
  },
  methods: {
    // 显示职位弹窗
    showJobHandler () {
      this.positionSelectDialogFlag = true
    },
    // 获取录用部门所选node
    departmentNodeClick (selected) {
      this.employInfo.departmentNode = selected
    },
    // 获取职位
    selectPositionConfirm (selected) {
      this.employInfo.position = selected.posPositionId
      this.employInfo.positionName = selected.name
      this.positionSelectDialogFlag = false
    },
    // 显示录用人弹窗
    employInfoNameFocusHandler () {
      this.peopleDialogFlag = true
    },
    // 取消录用人弹窗
    cancelPeopleDialogHandler () {
      this.peopleDialogFlag = false
    },
    // 选择录用人
    confirmPeopleDialogHandler (selected) {
      this.peopleDialogFlag = false
      this.employInfo.name = selected.name
      this.employInfo.rctInterviewId = selected.interviewId
      this.employInfo.department = selected.applyOrgId
      this.employInfo.departmentNode = {
        orgUnitId: selected.applyOrgId,
        orgUnitName: selected.applyOrgName
      }
      this.employInfo.position = selected.applyPositionId
      this.employInfo.positionName = selected.applyPosition
      this.employInfo.empType = selected.empType
    }
  }
}
</script>
<style lang="scss">
.emp-job {
    .el-radio__label {
      padding-left: 6px;
    }
    .input-with-select .el-input-group__append {
    padding: 0px;
    }
    .el-input-group__append {
      .el-input {
        width:80px;
        height: 26px;
      }
    }
    .el-input-group__append .el-select, .el-input-group__append .el-button, .el-input-group__prepend .el-select, .el-input-group__prepend .el-button{
      margin:0px;
    }
  }
</style>

