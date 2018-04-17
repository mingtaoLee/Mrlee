<template>
  <el-form ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="时间段" prop="orgId">
          <i-select v-model="form.checkYear" parameter="COMPONENT_ATTRIBUTE"></i-select>
        </el-form-item>
        <el-form-item label="1月" prop="checkMonthOne">
          <el-input v-model="form.checkMonthOne"></el-input>
        </el-form-item>
        <el-form-item label="3月" prop="checkMonthThree">
          <el-input v-model="form.checkMonthThree"></el-input>
        </el-form-item>
        <el-form-item label="5月" prop="checkMonthFive">
          <el-input v-model="form.checkMonthFive"></el-input>
        </el-form-item>
        <el-form-item label="7月" prop="checkMonthSeven">
          <el-input v-model="form.checkMonthSeven"></el-input>
        </el-form-item>
        <el-form-item label="9月" prop="checkMonthNine">
          <el-input v-model="form.checkMonthNine"></el-input>
        </el-form-item>
        <el-form-item label="11月" prop="checkMonthEleven">
          <el-input v-model="form.checkMonthEleven"></el-input>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="商行名称" prop="firmName">
          <i-select v-model="form.firmName" parameter="FIRM_ID" disalbed></i-select>
        </el-form-item>
        <el-form-item label="2月" prop="checkMonthTwo">
          <el-input v-model="form.checkMonthTwo"></el-input>
        </el-form-item>
        <el-form-item label="4月" prop="checkMonthFour">
          <el-input v-model="form.checkMonthFour"></el-input>
        </el-form-item>
        <el-form-item label="6月" prop="checkMonthSix">
          <el-input v-model="form.checkMonthSix"></el-input>
        </el-form-item>
        <el-form-item label="8月" prop="checkMonthEight">
          <el-input v-model="form.checkMonthEight"></el-input>
        </el-form-item>
        <el-form-item label="10月" prop="checkMonthTen">
          <el-input v-model="form.checkMonthTen"></el-input>
        </el-form-item>
        <el-form-item label="12月" prop="checkMonthTwelve">
          <el-input v-model="form.checkMonthTwelve"></el-input>
        </el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'

  export default {
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      id: String
    },
    computed: {
    },
    data: function () {
      return {
        instance: null,
        form: {
          firmId: '',
          firmName: '',
          checkYear: '',
          checkMonthOne: '',
          checkMonthTwo: '',
          checkMonthThree: '',
          checkMonthFour: '',
          checkMonthFive: '',
          checkMonthSix: '',
          checkMonthSeven: '',
          checkMonthEight: '',
          checkMonthNine: '',
          checkMonthTen: '',
          checkMonthEleven: '',
          checkMonthTwelve: ''
        },
        effectOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.parse(this.form.uneffectiveDate) - 3600 * 1000 * 24
          }
        },
        uneffectOptions: {
          disabledDate: (time) => {
            return time.getTime() < Date.parse(this.form.effectiveDate) + 3600 * 1000 * 24
          }
        }
        // rules: RULES
      }
    },
    methods: {
      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.id ? new Modifier(opts) : new BaseEditor(opts)
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.id)
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
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
</style>
