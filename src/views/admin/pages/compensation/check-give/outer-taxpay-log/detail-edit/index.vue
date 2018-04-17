<template>
  <el-form ref="form" class="laborhour-tranfer-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
        <el-form-item label="工号" prop="employeeCode">
            <el-input v-model="form.employeeCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="employeeName">
            <el-input
            placeholder="请选择" 
            :disabled="accountId ? true : false"
            v-model="form.employeeName" 
            readonly 
            @click.native="handlePersonnelClick"
            >
              <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
            </el-input>
            <i-personnel-select
            v-if="accountId ? false : true"
            :isShow.sync="isShowPersonnel"
            :multiple="false" 
            :defaultSelectedPersonnel="selectedPersonnel" 
            @confirm="handlePersonnelDialogConfirm"
            ></i-personnel-select>            
        </el-form-item>
        <el-form-item label="个税主体编码" prop="taxOrgunitCode">
            <el-input v-model="form.taxOrgunitCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="个税主体名称" prop="taxOrgunitName">
            <el-input v-model="form.taxOrgunitName" disabled></el-input>
        </el-form-item>
        <el-form-item label="税款所属月" prop="taxMonth">
            <el-date-picker
                v-model="form.taxMonth"
                :disabled="accountId ? true : false"
                type="month"
                value-format="yyyy-MM"
                placeholder="请选择"
                @change="dataChange"
            >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="应付工资" prop="taxableIncome">
            <el-input 
            type="number" 
            v-model.number="form.taxableIncome"
            placeholder="请输入"
            maxlength='6'
            min='0'></el-input>
        </el-form-item>
        <el-form-item label="个税" prop="personalIncomeTax">
            <el-input 
            type="number" 
            v-model.number="form.personalIncomeTax" 
            placeholder="请输入"
            min='0'></el-input>
        </el-form-item>
  </el-form>
</template>
<script>
  import req from 'api/compensation/check-give/outer-taxpay-log'
  import { Modifier } from './modifier'
  import { BaseEditor } from './base-editor'
  import { getRule, checkNum } from 'utils/index'
  const RULES = {
    employeeName: getRule('请选择员工姓名', 'change'),
    taxMonth: getRule('请选择税款所属月', 'change', 'date'),
    taxableIncome: { validator: checkNum('请输入应付工资', 6), trigger: 'change', required: true },
    personalIncomeTax: { validator: checkNum('请输入个税'), trigger: 'change', required: true }
  }
  export default {
    name: 'OuterTaxPayDetail',
    props: {
      accountId: String
    },
    computed: {
    },
    data: function () {
      return {
        instance: null,
        form: {
          employeeCode: '',
          employeeName: '',
          taxOrgunitCode: '',
          taxOrgunitName: '',
          taxMonth: '',
          taxableIncome: '',
          personalIncomeTax: '',
          employeeId: ''
        },
        formDate: {
          taxMonth: ''
        },
        rules: RULES,
        isShowPersonnel: false
      }
    },
    created () {
      this.init()
    },
    methods: {
      /** 初始化 */
      init () {
        this.initInstance()
        this.initData()
      },

      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.accountId ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 处理区域点击变化 */
      handleAreaChange () {},

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.accountId)
      },

      /** 数据保存 */
      save () {
        return new Promise(resolve => {
          this.validate().then(res => {
            if (res) {
              this.instance.save().then(res => {
                resolve(res)
              })
            } else {
              resolve(false)
            }
          })
        })
      },

      /** 数据校验 */
      validate () {
        return new Promise(resolve => {
          // ele自带validate验证，根据rule
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.form)
            }
          })
        })
      },
      /** 把yyyy-MM格式日期转化为ele能识别的格式 */
      dataChange (data) {
        this.formDate.taxMonth = data
        if (data) {
          this.form.taxMonth = new Date(data)
        } else {
          this.form.taxMonth = ''
        }
      },
      /** 人员下拉函数 */
      handlePersonnelClick () {
        this.isShowPersonnel = !this.isShowPersonnel
      },
      handlePersonnelDialogConfirm (selected) {
        this.form.employeeName = selected[0].employeeName
        const employeeId = selected[0].employeeId
        this.form.employeeId = employeeId
        req('getByempoleeCode', { employeeId: employeeId }).then(res => {
          this.form.employeeCode = res.employeeCode
          this.form.taxOrgunitCode = res.taxOrgunitCode
          this.form.taxOrgunitName = res.taxOrgunitName
        })
      }
    }
  }
</script>
<style lang="scss">
  .laborhour-tranfer-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
  .title{
      line-height:30px;
      font-weight:bold;
  }
</style>