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
    <el-form-item label="已选员工">
      <el-tag
        v-for="(employee, index) in form.list"
        :key="index"
        class="el-tag"
        type="primary"
      >
        {{employee.fullName}}
      </el-tag>
    </el-form-item>
    <el-form-item label="薪资组" prop="groupId">
      <remote-select
        v-model="form.groupId"
        :props="groupProps"
        :displayKeys="['groupCode', 'groupName']"
        dataKey="salaryGroup"
        placeholder="请输入代码或名称搜索"
      ></remote-select>
    </el-form-item>
    <el-form-item label="生效日期" prop="effectiveDate">
      <el-date-picker
        v-model="form.effectiveDate"
        type="month"
        :picker-options="effectiveDatePickerOptions"
        :disabled="isDateDisabled"
      ></el-date-picker>
    </el-form-item>
  </el-form>
</template>
<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req from 'api/compensation/employee-info/salary-distribute'
  import { getRule } from 'utils/index'
  const RULES = {
    groupId: getRule('请选择薪资组', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date')
  }
  export default {
    components: { RemoteSelect },
    props: {
      effectiveDatePickerOptions: {
        type: Object,
        default: () => {
          return {
            disabledDate (time) {
              if ((time.getTime() < Date.parse(new Date()) - 3600 * 1000 * 24)) {
                return true
              }
            }
          }
        }
      },
      dataKey: {
        type: String,
        default: 'empgroupId'
      },
      selected: Array
    },
    data: function () {
      return {
        reqName: 'putEmpsSalaryGroup',
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        instance: null,
        form: {
          groupId: '',
          effectiveDate: null,
          list: this.selected
        },
        rules: RULES
      }
    },
    created () {
      this.reqName = this.dataKey === 'empEmployeeId' ? 'postUndistributedEmpsGroup' : this.reqName
      this.beginDate = this.selected
    },
    methods: {
      /** 数据保存 */
      save () {
        return new Promise((resolve, reject) => {
          this.validate().then(res => {
            if (res) {
              this.submitData().then(res => {
                resolve(res)
              })
            } else {
              resolve(false)
            }
          })
        })
      },

      /** 提交数据 */
      submitData () {
        const submitData = this.transformSubmitData(this.form)
        return new Promise(resolve => {
          req(this.reqName, submitData).then(res => {
            resolve(res)
          })
        })
      },

      /** 提交数据转换 */
      transformSubmitData (data) {
        const submitData = JSON.parse(JSON.stringify(data))
        submitData.list = submitData.list.map(item => {
          //  未分配其他薪资组
          if (this.dataKey === 'empEmployeeId') {
            // item.employeeId = item.empEmployeeId
            return {
              fullName: item.fullName,
              empEmployeeId: item.empEmployeeId,
              transferDate: item.transferDate
            }
          }
          // 分配其他薪资组
          return {
            empgroupId: item.empgroupId,
            employeeId: item.employeeId
          }
        })
        submitData.effectiveDate = Date.parse(submitData.effectiveDate)
        return submitData
      },

      /** 数据校验 */
      validate () {
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.form)
            } else {
              resolve(false)
            }
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-tag {
    display: inline-block;
    margin-right: 5px;
  }
</style>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
</style>
