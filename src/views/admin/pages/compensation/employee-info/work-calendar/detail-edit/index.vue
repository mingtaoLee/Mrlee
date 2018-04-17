<template>
  <el-form
    v-cloak
    v-loading="loading"
    :element-loading-text="$loadingText"
    ref="form"
    class="zzf-security-policy-detail-edit"
    labelWidth="120px"
    :model="form"
    :rules="rules"
  >
    <el-form-item label="选择员工" prop="fullName">
      <el-input
        v-model="form.fullName"
        :disabled="isDisabled"
        readonly
        @click.native="handlePersonnelClick">
        <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
      </el-input>
      <i-personnel-select
        ref="personnelSelect"
        :isShow.sync="isShowPersonnel"
        :multiple="false"
        :defaultSelectedPersonnel="selectedPersonnel"
        @confirm="handlePersonnelDialogConfirm"
        @cancel="handlePersonnelDialogCancel"
      ></i-personnel-select>
    </el-form-item>
    <el-form-item label="上班方式" prop="workType">
      <i-select v-model="form.workType" parameter="WORK_SYSTEM"></i-select>
    </el-form-item>
    <el-form-item label="生效日期" prop="effectiveDate">
      <el-date-picker
        v-model="form.effectiveDate"
        type="month"
        :picker-options="effectOptions"
        :disabled="isDateDisabled && isDisabled"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="失效日期" prop="uneffectiveDate">
      <el-date-picker
        v-model="form.uneffectiveDate"
        type="month"
        :picker-options="uneffectOptions"
        :disabled="isDateDisabled && isDisabled"
      ></el-date-picker>
    </el-form-item>
  </el-form>
</template>
<script>
  import EditorMixin from 'mixins/compensation/editor-mixin'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { NewEditor } from './new-editor'
  import { getRule } from 'utils/index'
  const RULES = {
    fullName: getRule('请选择员工', 'change'),
    workType: getRule('请选择上班方式', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    uneffectiveDate: getRule('请选择失效日期', 'change', 'date')
  }
  export default {
    mixins: [EditorMixin],
    props: {
      attendanceBasisId: String
    },
    data: function () {
      return {
        // 人员默认选中
        selectedPersonnel: [],
        // 人员选择器弹出框显示属性
        isShowPersonnel: false,
        instance: null,
        form: {
          empEmployeeId: '',
          workType: '',
          effectiveDate: '',
          uneffectiveDate: new Date('9999-12-31 00:00:00')
        },
        rules: RULES
      }
    },
    methods: {

      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.getInstance(this.editorStatus, opts)
      },

      /** 获取对应实例 */
      getInstance (editorStatus, opts) {
        switch (editorStatus) {
          case '1':
            return new BaseEditor(opts)
          case '2':
            return new NewEditor(opts)
          default:
            return new Modifier(opts)
        }
      },

      /** 人员选择事件监听 */
      handlePersonnelClick () {
        if (this.isDisabled) return
        this.isShowPersonnel = true
      },

      /** 人员选择确认事件 */
      handlePersonnelDialogConfirm (selected) {
        this.form.fullName = selected[0] ? selected[0].employeeName : ''
        this.form.empEmployeeId = selected[0] ? selected[0].employeeId : ''
      },

      /** 人员选择取消事件 */
      handlePersonnelDialogCancel () {
        // 如果表单未选中人则重置人员选择
        this.form.empEmployeeId || this.$refs.personnelSelect.resetData()
      }
    }
  }
</script>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
</style>
