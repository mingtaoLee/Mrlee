<template>
  <div>
    <i-form labelWidth="huge" ref="iform" @reset="resetInputs" @search="search" :access-key="accessKey">
      <el-form-item label="查看状态" v-if="isShowItem">
        <el-select v-model="checkStatuVal" placeholder="请选择" @change="checkStatusList">
          <el-option
              v-for="item in checkType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号:">
        <el-input v-model="params.employeeCode"></el-input>
      </el-form-item>
      <el-form-item label="姓名:">
        <el-input v-model="params.fullName"></el-input>
      </el-form-item>
      <el-form-item label="组织:">
        <el-input v-model="params.orgUnitName"></el-input>
      </el-form-item>
      <el-form-item label="员工状态:">
        <i-select clearable v-model="params.employeeStatus" parameter="EMPLOYEE_STATUS"></i-select>
      </el-form-item>
      <el-form-item label="人事范围名称:">
        <el-input v-model="params.personnelGroupName"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码:">
        <el-input v-model="params.idNumber"></el-input>
      </el-form-item>
      <el-form-item label="入职开始日期:">
        <el-date-picker
          v-model="params.hireStartDate"
          :editable="false"
          type="date"
          placeholder="选择日期"
          :picker-options="hireStartDateOptions"
          @change="handleDateChange(params.hireStartDate, 'params', 'hireStartDate', 'string')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="入职结束日期:">
        <el-date-picker
          v-model="params.hireEndDate"
          :editable="false"
          type="date"
          placeholder="选择日期"
          :picker-options="hireEndDateOptions"
          @change="handleDateChange(params.hireEndDate, 'params', 'hireEndDate', 'string')"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="性别:">
        <i-select clearable v-model="params.gender" parameter="GENDER"></i-select>
      </el-form-item> -->
      <!-- <el-form-item label="户口性质:">
        <i-select clearable v-model="params.domicileType" parameter="IAF_ACCOUNT_TYPE"></i-select>
      </el-form-item> -->
      <!-- <el-form-item label="户头代码:">
        <el-input v-model="params.accountCode"></el-input>
      </el-form-item> -->
      <el-form-item label="户头名称:">
        <el-input v-model="params.accountName"></el-input>
      </el-form-item>
      <slot></slot>
    </i-form>
  </div>
</template>

<script>
  import IForm from 'components/common/i-form/i-form.vue'
  import ISelect from 'components/common/i-select/i-select.vue'
  import ISearchMixin from 'mixins/compensation/iaf-search-mixin'
  export default {
    name: 'IafSearch',
    components: {
      IForm,
      ISelect
    },
    mixins: [ISearchMixin],
    computed: {
      _params () {
        return Object.assign({}, this.params, this.additions)
      }
    },
    data () {
      return {
        checkStatusType: '',
        params: {
          employeeCode: '',
          fullName: '',
          orgUnitName: '',
          employeeStatus: '',
          personnelGroupName: '',
          hireStartDate: '',
          hireEndDate: '',
          idNumber: '',
          // gender: '',
          // domicileType: '',
          accountCode: '',
          accountName: ''
        },
        checkStatuVal: '',
        checkType: [
          {
            label: '查看最新状态信息',
            value: 'checkNewStatus'
          },
          {
            label: '查看所有状态信息',
            value: 'checkAallStatus'
          }
        ]
      }
    },
    props: {
      additions: Object,
      isShowItem: {
        type: Boolean,
        default: true
      },
      accessKey: String
    },
    methods: {
      search () {
        this.$emit('search', this._params)
      },
      resetInputs () {
        this.$emit('resetInputs')
      },
      initLayout () {
        this.$refs.iform.initLayout()
      },
      resetForm () {
        for (var key in this.params) {
          this.params[key] = ''
        }
        this.checkStatuVal = ''
        this.hireDate = ''
      },
      checkStatusList (val) {
        if (val) {
          this.$emit('checckStatus', val)
        }
      }
    },
    watch: {

    }
  }
</script>

<style scoped>

</style>
