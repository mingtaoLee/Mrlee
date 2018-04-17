<template>
  <el-form ref="form" v-loading="loading" :element-loading-text="$loadingText" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <template v-if="isDisabled">
          <el-form-item label="人事范围代码">
            {{form.personnelGroupCode}}
          </el-form-item>
          <el-form-item label="组织代码">
            {{form.orgUnitCode}}
          </el-form-item>
        </template>
        <el-form-item label="员工姓名" prop="employeeName">
          <el-input v-model="form.employeeName" :disabled="isDisabled" readonly @click.native="handlePersonnelClick">
            <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
          </el-input>
          <i-personnel-select
            ref="personnelSelect"
            :isShow.sync="isShowPersonnel"
            :multiple="false"
            filterType="all"
            :defaultSelectedPersonnel="selectedPersonnel"
            @confirm="handlePersonnelDialogConfirm"
            @cancel="handlePersonnelDialogCancel"
          ></i-personnel-select>
        </el-form-item>
      </li>
      <li class="item">
        <template v-if="isDisabled">
          <el-form-item prop="personnelGroupName" label="人事范围名称">
            {{form.personnelGroupName}}
          </el-form-item>
          <el-form-item prop="orgName" label="组织名称">
            {{form.orgUnitName}}
          </el-form-item>
        </template>
        <el-form-item label="核算月份" prop="checkMonth">
          <el-date-picker
            v-model="form.checkMonth"
            :picker-options="checkMonthOptions"
            type="month"
          ></el-date-picker>
        </el-form-item>
      </li>
    </ul>
    <el-form-item label="其他数据">
      <el-table
        border
        :row-key="getRowKey"
        :data="form.extraPayInfoDtosList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="数据项" prop="itemKey">
          <template slot-scope="scope">
            <el-form-item labelWidth="0" :prop="`extraPayInfoDtosList[${scope.$index}].itemKey`" :rules="itemKeyRule">
               <i-select
                v-model="scope.row.itemKey"
                :async="false"
                :props="itemProps"
                :options="salaryItemList"
                filterable
                @change="handleKeyChange($event, scope.$index)"
               ></i-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="金额" prop="itemValue">
          <template slot-scope="scope">
            <el-form-item labelWidth="0" :ref="`itemValue${scope.$index}`" :prop="`extraPayInfoDtosList[${scope.$index}].itemValue`" :rules="itemValueRule">
              <el-input
                v-model.number="scope.row.itemValue"
                :min="0"
                type="number"
                @change="handleValueChange($event, scope)"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <i class="el-icon-plus operate-icon" @click="addRow(scope)"></i>
            <i class="el-icon-minus operate-icon" @click="deleteRow(scope)"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>
<script>
  import CheckMonthMixin from 'mixins/compensation/check-month-mixin'
  import req from 'api/compensation/index'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { NewEditor } from './new-editor'
  import { getRule } from 'utils/index'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  const RULES = {
    employeeName: getRule('请选择员工', 'change'),
    checkMonth: getRule('请选择核算月份', 'change', 'date')
    // itemValue: { min: 0, message: '不能小于0', trigger: 'change', type: 'number' }
  }
  export default {
    mixins: [EditorMixin, CheckMonthMixin],
    props: {
      id: String
    },
    data: function () {
      return {
        itemProps: {
          value: 'componentId',
          label: 'componentName'
        },
        selectedPersonnel: [],
        isShowPersonnel: false,
        loading: false,
        // 下拉框改变前的value值
        preValue: '',
        instance: null,
        form: {
          employeeName: '',
          checkMonth: '',
          extraPayInfoDtosList: [
            {
              itemKey: '',
              itemValue: null,
              id: Math.random()
            }
          ]
        },
        salaryItemList: [],
        cloneList: [],
        itemKeyRule: getRule('请选择数据项', 'change'),
        itemValueRule: {
          validator: (rule, value, cb) => {
            if (!value && value !== 0) return cb(new Error('请输入金额'))
            if (value < 0 || value >= 100000000) {
              cb(new Error('请输入8位以内的非负数'))
            } else {
              cb()
            }
          },
          trigger: 'blur'
        },
        rules: RULES
      }
    },
    watch: {
      'form.extraPayInfoDtosList': {
        handler (value) {
          setTimeout(() => {
            this.cloneList = JSON.parse(JSON.stringify(value))
          }, 0)
        },
        deep: true
      }
    },
    methods: {
      handleValueChange (value, scope) {
        scope.row.itemValue = parseFloat((scope.row.itemValue).toFixed(2))
      },
      handleItemClick (data, scope) {
        // console.log(data, scope)
      },

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

      /** 初始化数据 */
      initData () {
        req('getComponentNameList', { componentType: '06' }).then(res => {
          if (res) {
            this.salaryItemList = this.transformAttendanceOptions(res)
            // 加载考勤详情数据
            this.instance.initData(this.id)
          }
        })
      },

      /** 人员选择事件监听 */
      handlePersonnelClick () {
        if (this.isDisabled) return
        this.isShowPersonnel = true
      },
      /** 人员选择取消事件 */
      handlePersonnelDialogCancel () {
        // 如果表单未选中人则重置人员选择
        this.form.employeeId || this.$refs.personnelSelect.resetData()
      },
      /** 人员选择确认事件 */
      handlePersonnelDialogConfirm (selected) {
        this.form.employeeName = selected[0].employeeName
        this.form.empEmployeeId = selected[0].employeeId
      },

      /** 处理考勤选项数据，新增disabled属性 */
      transformAttendanceOptions (data) {
        return data.map(item => {
          this.$set(item, 'disabled', false)
          return item
        })
      },

      /* 获取表格行key值 */
      getRowKey (row) {
        return row.rowId
      },

      /* 删除行操作 */
      deleteRow (scope) {
        this.instance.deleteRow(scope)
      },

      /* 增加行操作 */
      addRow (scope) {
        this.instance.addRow(scope)
      },

      /** 选项改变时事件监听 */
      handleKeyChange (value, index) {
        this.filterOptions(value, index)
      },

      /** 过滤已选考勤项 */
      filterOptions (value, index) {
        // 选中考勤项则禁用当前考勤项
        if (value) {
          this.setDisabledOption(value, true)
        }
        if (this.cloneList[index] && this.cloneList[index].itemKey !== value) {
          this.setDisabledOption(this.cloneList[index].itemKey, false)
        }
      },

      /** 设置选项是否禁用 */
      setDisabledOption (value, isDisabled) {
        for (let item of this.salaryItemList) {
          if (item.componentId === value) {
            item.disabled = isDisabled
            break
          }
        }
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
