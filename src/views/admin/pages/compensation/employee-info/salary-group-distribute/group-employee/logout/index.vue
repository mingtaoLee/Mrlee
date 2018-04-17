<template>
  <el-form
    v-cloak
    v-loading="loading"
    :element-loading-text="$loadingText"
    ref="form"
    class="zzf-security-policy-detail-edit"
    labelWidth="120px"
    :model="form" :rules="rules"
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
    <el-form-item label="注销时间" prop="uneffectiveDate">
      <el-date-picker
        v-model="form.uneffectiveDate"
        type="month"
        :picker-options="pickerOptions0"
      >
      </el-date-picker>
    </el-form-item>
  </el-form>
</template>
<script>
  // import moment from 'moment'
  import req from 'api/compensation/employee-info/salary-distribute'
  import { getRule } from 'utils/index'
  const RULES = {
    uneffectiveDate: getRule('请选择注销时间', 'change', 'date')
  }
  export default {
    props: {
      selected: Array
    },
    computed: {
    },
    data: function () {
      return {
        instance: null,
        form: {
          uneffectiveDate: '',
          list: this.selected
        },
        rules: RULES,
        pickerOptions0: {
          disabledDate (time) {
            // 定义当前日期
            // let date = new Date()
            // 可以选当月及之后所有的月份
            if ((time.getTime() < Date.parse(new Date()) - 3600 * 1000 * 24)) {
            // 如果当天刚好是一号则就只能选当月1号，否则就只能选次月1号
            // if ((time.getDate() !== 1) || (time.getTime() < Date.parse(new Date()) - 3600 * 1000 * 24 || time.getTime() > new Date(date.getFullYear(), date.getMonth() + 1, 1))) {
            // 如果当天刚好是一号则就只能选当月及之后的月份，否则就只能选之后的所有月份
            // if ((time.getDate() !== 1) || (time.getTime() < Date.parse(new Date()) - 3600 * 1000 * 24)) {
              return true
            }
          }
        }
      }
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
          req('logoutEmpsSalaryGroup', submitData).then(res => {
            resolve(res)
          })
        })
      },

      /** 提交数据转换 */
      transformSubmitData (data) {
        // console.log(data)
        const submitData = JSON.parse(JSON.stringify(data))
        // debugger
        submitData.list = submitData.list.map(item => {
          return {
            empgroupId: item.empgroupId,
            employeeStatus: item.employeeStatus
          }
        })
        submitData.uneffectiveDate = Date.parse(submitData.uneffectiveDate)
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
