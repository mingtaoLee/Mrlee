<template>
  <section class="emp-partner content-follow">
    <h2 class="info-title">合伙人团队填写信息</h2>
    <el-form
      :model="partnerInfo"
      label-width="180px"
      :rules="rules"
      class="form-main clearfix">
      <div class="main-form">
        <el-form-item v-for="(item,idx ) in formList" :key="idx"  :label="item.label" v-if="item.show && false">
          <el-input v-model="partnerInfo[item.model]" :disabled="item.disabled"></el-input>
        </el-form-item>

      <el-form-item label="出勤时数"  v-if="showMap.attendHours && false">
        <div style="display:flex" >
          <el-input v-model.number="partnerInfo.attendHours" style="flex:1" :disabled="disabledMap.attendHours"/>
          <div style="flex:1;display:flex;margin-top: 10px;margin-left: 10px">
            <el-radio v-model="hourOrDate" label="year" :disabled="disabledMap.attendHours">时</el-radio>
            <el-radio v-model="hourOrDate" label="month" style="margin-left: 14px" :disabled="disabledMap.attendHours">日</el-radio>
          </div>
        </div>
      </el-form-item>

        <el-form-item label="实际离职日期" prop="effectiveDate" v-if="showMap.effectiveDate">
          <el-date-picker
            type="date"
            v-model="partnerInfo.effectiveDate"
            :disabled="disabledMap.effectiveDate"
            :picker-options="pickerOptions"
            @change="getSTime"
            :editable='false'
            >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="工作移交是否已完成" v-if="showMap.isJobTransition">
          <i-select
          v-model="partnerInfo.isJobTransition"
          parameter="WHETHER_TYPE"
          :disabled="disabledMap.isJobTransition"
          :placeholder="disabledMap.isJobTransition && ''"
          ></i-select>
        </el-form-item>

        <el-form-item label="文件、设备等财产移交是否完成" v-if="showMap.isAssetsTransition">
          <i-select
            v-model="partnerInfo.isAssetsTransition"
            parameter="WHETHER_TYPE"
            :disabled="disabledMap.isAssetsTransition"
            :placeholder="disabledMap.isAssetsTransition && ''"            
            />
        </el-form-item>
        <!-- <el-form-item label="离职补偿金"><el-input v-model="partnerInfo.dimissionCompensation"  :disabled="editable"/></el-form-item> -->
      </div>

      <el-form-item label="离职原因"  class="text" v-if="showMap.pterminationReason">
        <el-input v-model="partnerInfo.pterminationReason" type="textarea" :disabled="disabledMap.pterminationReason" :placeholder="disabledMap.pterminationReason && ''"></el-input>
      </el-form-item>

      <el-form-item label="离职面谈结果"  class="text" v-if="showMap.dimissionInterviewResult">
        <el-input
          v-model="partnerInfo.dimissionInterviewResult"
          type="textarea"
          :disabled="disabledMap.dimissionInterviewResult"
          resize="both"
          :placeholder="disabledMap.dimissionInterviewResult && ''"
          >
        </el-input>
      </el-form-item>

      <!-- <div class="main-form2">
      <el-form-item v-for="(item,idx) in showFormList" :label="item.label" :key="idx" label-width="150px">
        <span>{{ partnerInfo.effectiveDate }}</span>
      </el-form-item>
      </div> -->
    </el-form>
  </section>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select'
  import moment from 'moment'

  export default {
    props: {
      partnerInfo: Object,
      editable: {
        type: Boolean,
        default: false
      }
    },
    components: {
      ISelect
    },
    data () {
      return {
        rules: {
          effectiveDate: [
            { required: true, message: '请选择离职日期', trigger: 'change,blur' }
          ]
        },
        formList: [
          /* eslint-disable */
          {label: '迟到（分钟）', model: 'lateMinutes', show:'', disabled: ''},
          {label: '早退（分钟）', model: 'earlyMinutes', show:'', disabled: ''},
          {label: '请假（时）', model: 'leavehours', show:'', disabled: ''},
          {label: '旷工分钟数', model: 'absentMinutes', show:'', disabled: ''},
          {label: '欠休时数', model: 'oweHolidayHours', show:'', disabled: ''}
       ],
        // showFormList: [
        //   {label: '养老保险终止日期'},
        //   {label: '医疗保险终止日期'},
        //   {label: '工伤保险终止日期'},
        //   {label: '生育保险终止日期'},
        //   {label: '失业保险终止日期'},
        //   {label: '公积金终止日期'}
        // ],
        hourOrDate: 'year',
        pickerOptions: {
          disabledDate: (time) => {
             let day = new Date()
            day = day.setFullYear(day.getFullYear(), day.getMonth(), 0)
            if (this.partnerInfo.hireDate) {
              // 实际离职时间不能小于入职日期并且不能早于当月
              return time.getTime() < new Date(this.partnerInfo.hireDate) || time.getTime() < new Date(day).getTime()
            }
          }
        }
      }
    },
    watch: {
      hourOrDate (newVal, oldVal) {
        this.partnerInfo.attendHours = newVal === '日' ? this.partnerInfo.attendHours * 24 : this.partnerInfo.attendHours
      }
    },
    methods: {
       // 实际离职日期选择器的赋值
      getSTime (val) {
        // this.partnerInfo.effectiveDate = moment(val).format('YYYY-MM-DD')
        // console.log(val)
        val ? this.partnerInfo.effectiveDate = moment(val).format('YYYY-MM-DD') : this.partnerInfo.effectiveDate = ''
      }
    },
    created () {
      this.formList.map(val => {
        val.show = this.showMap[val.model]
        val.disabled = this.disabledMap[val.model]
      })
    }
  }
</script>
<style lang="scss" scoped>
  .emp-partner {
    .main-form {
      display: flex;
      flex-flow: wrap;
      .el-form-item {
        flex-basis: 33%;
      }
    }
    .main-form2 {
      display: flex;
      flex-flow: row wrap;
     .el-form-item {
       flex-basis: 33%
     }
    }
    .text {
      width: 500px
    }
  }
</style>


