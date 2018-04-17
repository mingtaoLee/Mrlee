<template>
  <el-form ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <el-form-item label="组织名称" prop="orgUnitId">
      <i-select-tree
        :multiple="false"
        dataKey="org"
        nodeKey="orgUnitId"
        v-model="form.orgUnitId"
        :disabled="isDisabledFormItem"
        lazy
        size="small"
      ></i-select-tree>
    </el-form-item>
    <el-form-item label="所属月份" prop="checkMonth">
      <el-date-picker
        v-model="form.checkMonth"
        type="month"
        :disabled="isDisabledFormItem"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="问题类型" prop="questionType">
      <i-select v-model="form.questionType" parameter="dict" clearable :disabled="isDisabledFormItem"></i-select>
    </el-form-item>
    <el-form-item label="问题描述" prop="description">
      <el-input v-model="form.description" type="textarea" :disabled="isDisabledFormItem"></el-input>
    </el-form-item>
    <template v-if="problemsMode===2">
      <el-form-item label="处理类别" prop="processType">
        <i-select v-model="form.processType" parameter="QUESTION_HANDLE_TYPE" clearable></i-select>
      </el-form-item>
      <el-form-item label="处理描述" prop="processDesc">
        <el-input v-model="form.processDesc" type="textarea"></el-input>
      </el-form-item>
    </template>
  </el-form>
</template>
<script>
  import EditorMixin from 'mixins/compensation/editor-mixin'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule, getDict } from 'utils/index'
  const RULES = {
    orgUnitId: getRule('请选择组织名称', 'change'),
    checkMonth: getRule('请填写所属月份', 'change', 'date'),
    questionType: getRule('请选择问题类型', 'change'),
    processDesc: { min: 0, max: 200, message: '只能输入200个字', trigger: 'change' },
    description: { min: 0, max: 200, message: '只能输入200个字', trigger: 'change' }
    // processType: getRule('请选择处理类别', 'change')
  }
  export default {
    name: '',
    mixins: [EditorMixin],
    props: {
      id: {
        type: [String, Number]
      },
      // 问题处理类型，1是问题提交，2是问题处理
      problemsMode: {
        type: Number,
        default: 1
      }
    },
    computed: {
      isDisabledFormItem () {
        return this.problemsMode === 2
      }
    },
    data: function () {
      return {
        instance: null,
        form: {
          description: '',
          questionType: '',
          checkMonth: '',
          orgUnitId: '',
          empEmployeeId: '',
          processType: '',
          processDesc: ''
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
        if (this.problemsMode === 1) {
          this.instance = new BaseEditor(opts)
        } else if (this.problemsMode === 2) {
          this.instance = new Modifier(opts)
        }
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.id)
        // 获取考勤项数据
        getDict('ATTENDANCE_ITEM').then(res => {
          if (res) {
            // this.attendanceOptions = this.transformAttendanceOptions(res)
            // 加载考勤详情数据
            this.instance.initData(this.id)
          }
        })
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
