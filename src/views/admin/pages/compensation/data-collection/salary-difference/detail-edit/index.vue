<template>
  <el-form ref="form" v-loading="loading" :element-loading-text="$loadingText" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="人事范围：">{{form.personnelGroupName}}</el-form-item>
        <el-form-item label="组织代码：">{{form.orgUnitCode}}</el-form-item>
        <el-form-item label="组织名称：">{{form.orgUnitName}}</el-form-item>
      </li>
      <li class="item">
        <el-form-item label="工号：">{{form.employeeCode}}</el-form-item>
        <el-form-item label="姓名：">{{form.employeeName}}</el-form-item>
        <el-form-item label="核算月份：">{{form.checkMonth}}</el-form-item>
      </li>
    </ul>
    <el-form-item label="差异项：">
      <el-table
        :row-key="getRowKey"
        :data="form.payInfoList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="项目"
          prop="diffProject"
        >
        </el-table-column>
        <el-table-column
          label="差异说明"
          prop="diffDesc"
        >
          <template slot-scope="scope">
            <p v-if="type === 'detail'">{{scope.row.diffDesc}}</p>
            <el-form-item v-else labelWidth="0">
              <el-input type="textarea" v-model="scope.row.diffDesc"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="金额"
          prop="diffValue"
        >
          <template slot-scope="scope">
            <p v-if="type === 'detail'">{{scope.row.diffValue}}</p>
            <el-form-item v-else labelWidth="0" :prop="`payInfoList[${scope.$index}].diffValue`" :rules="diffValueRule">
              <el-input type="number" v-model.number="scope.row.diffValue" @input="handleValueChange"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="总金额：">{{form.amount}}</el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  import req from 'api/compensation/data-collection/salary-difference'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { getRule } from 'utils/index'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  const RULES = {
    empEmployeeId: getRule('请选择员工', 'change'),
    attendanceMonth: getRule('请选择考勤月份', 'change', 'date')
  }
  export default {
    name: '',
    mixins: [EditorMixin],
    props: {
      type: String,
      id: String
    },
    computed: {
    },
    data: function () {
      return {
        instance: null,
        form: {
          personnelGroupName: '',
          orgCode: '',
          orgName: '',
          empEmployeeId: '',
          employeeCode: '',
          employeeName: '',
          checkMonth: '',
          amount: '',
          payInfoList: [
            {
              diffProject: '',
              diffDesc: '',
              diffValue: ''
            }
          ]
        },
        diffProjectRule: getRule('请选择考勤项', 'change'),
        diffValueRule: getRule('请输入金额', 'blur', 'number'),
        rules: RULES
      }
    },
    methods: {
      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this,
          datesKey: [],
          dataConfirmConfig: { req: req, name: 'confirmData', params: {} }
        }
        this.instance = this.id ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.id)
      },

      /* 获取表格行key值 */
      getRowKey (row) {
        return row.id
      },

      /** 处理考勤项金额改变 */
      handleValueChange (value) {
        this.calculateAmount()
      },

      /** 计算总金额 */
      calculateAmount () {
        let amount = 0
        this.form.payInfoList.forEach(item => {
          if (item.diffValue) {
            amount += parseFloat(item.diffValue)
          }
        })
        this.form.amount = amount
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../../../../../styles/vars.scss";
  .operate-icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    transition: opacity 0.3s;
    &:hover {
      cursor: pointer;
      opacity: 0.6;
    }
  }
  .el-icon-plus {
    display: inline-block;
    margin-right: 10px;
    color: $color-theme;
  }
  .el-icon-minus {
    color: $color-red;
  }
</style>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
</style>
