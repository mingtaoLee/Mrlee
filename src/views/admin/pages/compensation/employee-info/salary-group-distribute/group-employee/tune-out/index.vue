<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <el-form-item label="已选员工">
      <el-tag
        v-for="(employee, index) in form.list"
        class="el-tag"
        :key="index"
        type="primary"
      >{{employee.fullName}}</el-tag>
    </el-form-item>
    <el-form-item label="调出后薪资组" prop="transferGroupId">
      <remote-select
        v-model="form.transferGroupId"
        :props="groupProps"
        dataKey="allSalaryGroup"
        filterable
      ></remote-select>
    </el-form-item>
    <el-form-item label="生效日期" prop="transferoutDate">
      <el-date-picker
        v-model="form.transferoutDate"
        type="month"
        :picker-options="pickerOptions0"
      ></el-date-picker>
    </el-form-item>
  </el-form>
</template>
<script>
  import req from 'api/compensation/employee-info/salary-distribute'
  import { getRule } from 'utils/index'
  import RemoteSelect from 'components/compensation/remote-select/index'
  const RULES = {
    transferGroupId: getRule('请选择薪资组', 'change'),
    transferoutDate: getRule('请选择生效日期', 'change', 'date')
  }
  export default {
    components: {RemoteSelect},
    props: {
      selected: Array
    },
    data: function () {
      return {
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        instance: null,
        form: {
          transferGroupId: '',
          transferoutDate: null,
          list: []
        },
        rules: RULES,
        pickerOptions0: {
          disabledDate (time) {
            // 定义当前日期
            let date = new Date()
            // 获取当前这个月的第一天
            let date2
            if (time.getMonth === 11) {
              date2 = new Date(time.getFullYear() + 1, 1, 0) // 得到的是明年
            } else {
              date2 = new Date(time.getFullYear(), time.getMonth() + 1, 1)
            }
            // 如果为第一天而且大于当前日期
            if (date2.getDate() === time.getDate() && date <= time) {
              return time.getDate() - date2.getDate() // 拿到当前并且之后的每月第一天
            } else {
              // 否则返回true，此方法返回true则不可点击
              return true
            }
          }
        }
      }
    },
    created () {
      this.init()
    },
    methods: {
      /** 初始化数据 */
      init () {
        this.form.list = this.clone()
      },

      /** 克隆已选人员数据 */
      clone () {
        const clone = []
        const keys = ['empgroupId', 'employeeId', 'groupId', 'fullName']
        this.selected.map(item => {
          const obj = {}
          keys.map(key => {
            obj[key] = item[key]
          })
          clone.push(obj)
        })
        return clone
      },

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
          req('postBringUpEmps', submitData).then(res => {
            resolve(res)
          })
        })
      },

      /** 提交数据转换 */
      transformSubmitData (data) {
        const submitData = JSON.parse(JSON.stringify(data))
        submitData.transferoutDate = Date.parse(submitData.transferoutDate)
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
