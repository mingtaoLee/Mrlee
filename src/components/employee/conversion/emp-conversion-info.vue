<template>
  <section class="emp-conversion-info content-follow"> 
    <!-- 转正信息 -->
    <h2 class="info-title">转正信息</h2>

    <el-form
      :model="conversionInfo"
      label-width="120px"
      class="form-main clearfix"
      :rules="rules">
      <el-row>   
        <el-col :span="6">
          <el-form-item label="转正类型" prop="regularizationType"  v-if="showMap.regularizationType">
            <i-select 
              v-model="conversionInfo.regularizationType"
              parameter="REGULARIZATION_TYPE"
              @change='changeStatus(conversionInfo.regularizationType)'
              :disabled="disabledMap.regularizationType">
            </i-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
            <el-form-item label="预计转正日期" prop="expectedProbationEndDate" v-if="showMap.expectedProbationEndDate">
              <el-date-picker 
              type="date" 
              v-model="conversionInfo.expectedProbationEndDate" 
              style="width: 100%;" 
              :disabled="disabledMap.expectedProbationEndDate && true"
              :placeholder="disabledMap.expectedProbationEndDate && ''"
              />
            </el-form-item>
          </el-col>
        <el-col :span="6">
          <el-form-item label="实际转正日期" prop="probationEndDate" v-if='showMap.probationEndDate&&!isShowTime'>
            <el-date-picker
              type="date"
              v-model="conversionInfo.probationEndDate"
              style="width: 100%;"
              @change="getSTime"
              :disabled='conversionInfo.regularizationType === "1" || disabledMap.probationEndDate'
              :placeholder="disabledMap.probationEndDate && ''"
              >
              </el-date-picker>
          </el-form-item>
        </el-col>

      <el-col :span="6">
       <el-form-item label="提前转正日期" prop="probationEndDate" v-if='showMap.probationEndDate&&isShowTime'>
          <el-date-picker 
          type="date" 
          :picker-options="probationEndDate" 
          v-model="conversionInfo.probationEndDate" 
          style="width: 100%;" 
          @change="getSTime"
          :disabled="disabledMap.probationEndDate"
          :placeholder="disabledMap.probationEndDate && ''"
          />
       </el-form-item>
      </el-col>
      <el-col :span="6">
          <el-form-item label="试用期月数" prop="probationType" v-if="showMap.probationType">
            <el-input
              v-model="conversionInfo.probationType"
              :disabled="disabledMap.probationType && true"
              :placeholder="disabledMap.probationType && ''"
              ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="转正前薪资" prop="probationSalary" v-if="showMap.probationSalary">
             <el-input v-model="conversionInfo.probationSalary" class="input-with-select" :disabled="disabledMap.probationSalary" placeholder="">
              <el-select v-model="conversionInfo.probationSalaryType" slot="append" :disabled="disabledMap.probationSalary" >
                 <el-option label="元/时" value="2"></el-option>
                 <el-option label="元/月" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="预计转正后薪资" prop="expectedRegularSalary" v-if="showMap.expectedRegularSalary">
              <el-input v-model="conversionInfo.expectedRegularSalary" class="input-with-select" :disabled="disabledMap.expectedRegularSalary" placeholder="">
                 <el-select v-model="conversionInfo.expectedRegularSalaryType" slot="append" :disabled="disabledMap.expectedRegularSalary" >
                  <el-option label="元/时" value="2"></el-option>
                  <el-option label="元/月" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="实际转正后薪资" prop="regularSalary"  v-if="showMap.regularSalary">
             <el-input v-model="conversionInfo.regularSalary" class="input-with-select select" :disabled="disabledMap.regularSalary">
              <el-select v-model="conversionInfo.regularSalaryType" slot="append" :disabled="!!conversionInfo.expectedRegularSalaryType" >
                 <el-option label="元/时" value="2"></el-option>
                 <el-option label="元/月" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

       <el-row>
        <el-col :span="20">
          <el-form-item label="薪资差异说明" prop="diffSalaryDescription" class="col-wider" v-if="showMap.diffSalaryDescription && conversionInfo.isShowDiff">
            <el-col :span="20">
              <el-input
                type="textarea"
                :rows="3"
                maxlength="100"
                v-model="conversionInfo.diffSalaryDescription"
                :disabled="disabledMap.diffSalaryDescription"
                :placeholder="disabledMap.diffSalaryDescription && ''"
                >
              </el-input>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

       <!-- TODO:字段添加 -->
      <!-- <el-row>
        <el-form-item label="转正自评" prop="test" class="col-wider" v-if="showMap.selfContent">
          <el-col :span="20">
            <el-input
              type="textarea"
              :rows="3"
              maxlength="200"
              v-model="conversionInfo.selfContent"
              :disabled="disabledMap.selfContent">
            </el-input>
          </el-col>
        </el-form-item>
      </el-row> -->

      <el-row>
        <el-col :span="20">
          <el-form-item label="试用期考核情况" prop="checkResult" class="col-wider" v-if="showMap.checkResult">
            <el-col :span="20">
              <el-input
                type="textarea"
                :rows="3"
                maxlength="100"
                v-model="conversionInfo.checkResult"
                :disabled="disabledMap.checkResult"
                :placeholder="disabledMap.checkResult && ''"
                >
              </el-input>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item label="转正评估意见" prop="opition" class="col-wider" v-if="showMap.opition">
            <el-col :span="20">
              <el-input
                type="textarea"
                :rows="3"
                maxlength="100"
                v-model="conversionInfo.opition"
                :disabled="disabledMap.opition"
                :placeholder="disabledMap.opition && ''"
                >
              </el-input>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select'
  import moment from 'moment'
  export default {
    components: {
      ISelect
    },
    props: {
      conversionInfo: Object
    },
    data () {
      // const validateMoney = (rule, value, cb) => {
      //   var num = /^[0-9]+([.]{1}[0-9]+){0,1}$/
      //  !value && cb(new Error('实际转正后薪资不能为空'))
      //   !this.conversionInfo.regularSalaryType && cb(new Error('实际转正后薪资类型不能为空'))
      //   setTimeout(function () {
      //     !num.exec(value) ? cb(new Error('薪资必须为数字')) : cb()
      //   }, 0)
      // }
      let validateMoney = (rule, value, cb) => {
        let isNum = /^(([0]{1}\.[0-9]*[0-9]+)|([1-9]+\.[0-9]*[1-9][0-9]*)|([1-9]+[0-9]*\.[0-9]+)|([1-9]+[0-9]*)|([0]{1}))$/
        let IsOnlyTwo = /^(([0]{1}\.[0-9]{0,2})|([1-9]+\.[0-9]{1,2})|([1-9]+[0-9]*\.[0-9]{1,2})|([1-9]+[0-9]*)|([0]{1}))$/
        !value && cb(new Error('实际转正后薪资不能为空'))

        if (isNum.exec(value)) {
          if (IsOnlyTwo.exec(value)) {
            cb()
          } else {
            cb(new Error('薪资最多保留两位小数'))
          }
        } else {
          cb(new Error('请输入正确的数字!'))
        }
      }
      const checkDiffSalary = (rule, value, cb) => {
        !value && cb(new Error('薪资差异说明不能为空'))
        setTimeout(() => {
          value.length > 250 ? cb(new Error('输入的字数不能大于250')) : cb()
        }, 0)
      }
      const checkDate = (rule, value, cb) => {
        !value && cb(new Error('转正日期不能为空'))
        setTimeout(() => {
          console.log(this.regularizationType)
          let time = Math.floor(Math.abs(Date.parse(value) - Date.parse(this.expectedProbationEndDate)) / (24 * 3600 * 1000))
          console.log(time)
          if (this.regularizationType === '1' && time > 15) {
            cb(new Error('转正日期最多比预计转正日期多15天'))
          } else {
            cb()
          }
        }, 0)
      }
      // const checkWordLs250 = (rule, value, cb) => {
      //   setTimeout(() => {
      //     value.length > 250 ? cb(new Error('输入的字数不能大于250')) : cb()
      //   }, 0)
      // }
      return {
        rules: {
          probationEndDate: [
            { required: true, validator: checkDate, trigger: 'change' }
          ],
          // expectedProbationEndDate: [
          //   { required: true, message: '预计转正日期不能为空', trigger: 'change' }
          // ],
          regularizationType: [
            { required: true, message: '转正类型不能为空', trigger: 'change' }
          ],
          checkResult: [
            { required: true, message: '试用期考核情况不能为空', trigger: 'blur' }
          ],
          opition: [
            { required: true, message: '转正评估意见不能为空', trigger: 'blur' }
          ],

          regularSalary: [
            { required: true, validator: validateMoney, trigger: 'blur,change' }
          ],
          diffSalaryDescription: [
            { required: true, validator: checkDiffSalary, trigger: 'blur' }
          ]
        },
        isShowTime: this.conversionInfo.regularizationType === '2',
        probationEndDate: {
          disabledDate: (time) => {
            let hireDate = new Date(this.conversionInfo.hireDate)
            if (hireDate) {
              return time.getTime() < hireDate
            }
          }
        }
      }
    },
     // 如果实际转正薪资与转正薪资不相等，就必须启用薪资差异说明
    computed: {
      // conversionInfo.isShowDiff: function () {
      //   return Number(this.conversionInfo.regularSalary) !== Number(this.conversionInfo.expectedRegularSalary)
      // },
      regularizationType () {
        return this.conversionInfo.regularizationType
      },
      expectedProbationEndDate () {
        return this.conversionInfo.expectedProbationEndDate ? (moment(new Date(this.conversionInfo.expectedProbationEndDate)).format('YYYY-MM-DD')) : ''
      }
    },
    watch: {
      'conversionInfo.regularizationType': {
        handler: function (newVal, oldVal) {
          if (newVal === '1') {
            this.conversionInfo.probationEndDate = this.conversionInfo.expectedProbationEndDate
          } else {
            if (!this.disabledMap.probationEndDate) {
              this.conversionInfo.probationEndDate = ''
            }
          }
        }
      },
      expectedProbationEndDate (newVal, oldVal) {
        if (this.conversionInfo.regularizationType === '1' && newVal) {
          this.conversionInfo.probationEndDate = this.conversionInfo.expectedProbationEndDate
        }
      },
      // 薪资差异说明，根据转正前后薪资
      'conversionInfo.regularSalary': {
        handler: function (newVal, oldVal) {
          if (parseFloat(newVal) === parseFloat(this.conversionInfo.expectedRegularSalary) && this.conversionInfo.regularSalaryType === this.conversionInfo.expectedRegularSalaryType) {
            this.conversionInfo.diffSalaryDescription = ''
            this.conversionInfo.isShowDiff = false
          } else {
            this.conversionInfo.isShowDiff = true
          }
        },
        deep: true
      },
      // 薪资差异说明，根据转正前后薪资
      'conversionInfo.regularSalaryType': {
        handler: function (newVal, oldVal) {
          if (newVal === this.conversionInfo.expectedRegularSalaryType && parseFloat(this.conversionInfo.regularSalary) === parseFloat(this.conversionInfo.expectedRegularSalary)) {
            this.conversionInfo.diffSalaryDescription = ''
            this.conversionInfo.isShowDiff = false
          } else {
            this.conversionInfo.isShowDiff = true
          }
        },
        deep: true
      }
      // 'conversionInfo.expectedRegularSalary': {
      //   handler: function (newVal, oldVal) {
      //     this.conversionInfo.regularSalary = newVal
      //     console.log(this.conversionInfo.expectedRegularSalaryType)
      //   },
      //   deep: true
      // }
    },
    // mounted
    created () {
      // 只在发起流程的时候才给默认值
      // console.log(this.disabledMap.regularSalary)
      if (!this.disabledMap.regularSalary) {
        !this.conversionInfo.probationEndDate && (this.conversionInfo.probationEndDate = this.conversionInfo.expectedProbationEndDate)
        this.$nextTick(function () {
          !this.conversionInfo.expectedRegularSalaryType && (document.getElementsByClassName('select')[0].getElementsByClassName('el-input-group__append')[0].style.backgroundColor = '#fff')
        })
      }
      this.conversionInfo.expectedProbationEndDate = this.conversionInfo.expectedProbationEndDate && moment(new Date(this.conversionInfo.expectedProbationEndDate)).format('YYYY-MM-DD')
      // console.log(this.conversionInfo.expectedProbationEndDate)
    },
  
    methods: {
       // 提前转正日期日期选择器的赋值
      getSTime (val) {
        val ? this.conversionInfo.probationEndDate = moment(new Date(val)).format('YYYY-MM-DD') : this.conversionInfo.probationEndDate = ''
      },

      // 预计转正日期日期选择器的赋值
      getHTime (val) {
        // console.log(val)
        val ? this.conversionInfo.expectedProbationEndDate = moment(new Date(val)).format('YYYY-MM-DD') : this.conversionInfo.expectedProbationEndDate = ''
      },

       // 根据转正类型是否显示提前转正时间
      changeStatus (val) {
        // console.log(val)
        if (val === '2') {
          this.isShowTime = true
        } else {
          this.isShowTime = false
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .emp-conversion-info {
    .form-main {
      .el-form-item {
        width: 316px;
      }
    }
  }

  .col-wider {
    width: 690px !important;
  }
</style>
<style lang="scss">
  .emp-conversion-info {
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
       .popper__arrow {
     left: 100% !important;
   }
</style>



