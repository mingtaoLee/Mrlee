<template>
  <el-form :model="data" :rules="rules" ref="bank-tpl-modify" labelWidth="130px" v-cloak>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item prop="calculateRuleName" label="规则名称">
          <el-input v-model="data.calculateRuleName"  :disabled="previewMode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="componentName" label="薪资项目名称">
          <el-input v-model="data.componentName" readonly @click.native="handleIconClick">
            <i class="iconfont icon-salary" slot="suffix"></i>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <!--<el-form-item prop="componentType" label="适用类型">-->
          <!--<ISelect v-model="data.componentType" parameter="dict"></ISelect>-->
        <!--</el-form-item>-->
      </el-col>
      <el-col :span="12">
        <el-form-item prop="effectiveDate" label="生效日期" required>
          <el-date-picker
            v-model="data.effectiveDate"
            type="month"
            :disabled="isDateDisabled"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="uneffectiveDate" label="失效日期">
          <el-date-picker
            v-model="data.uneffectiveDate"
            type="month"
            :disabled="isDateDisabled"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="employeeRangeListInfo" label="适用范围">
          <el-input
            resize="false"
            style="display: none"
            v-model="data.employeeRangeListInfo"
            disabled></el-input>
          <el-button type="text" @click="handleRange"><i class="el-icon-edit el-icon--left"></i>设置</el-button>
        </el-form-item>
      </el-col>
      <transition name="el-zoom-in-top">
        <el-col :span="24" v-show="isShowRangeSetting">
          <el-form :model="data" labelWidth="200px" class="rangeForm">
            <el-form-item label="适用组织">
              <i-select-tree
                lazy
                multiple
                dataKey="org"
                nodeKey="orgUnitId"
                v-model="data.employeeRangeListInfo.orgUnitIdList"
                @node-click="handleOrgSelectClick"
              ></i-select-tree>
            </el-form-item>
            <el-form-item label="适用职务">
              <i-select
                v-model="data.employeeRangeListInfo.posTitleIdList"
                :props="posTitlesProps"
                dataKey="posTitles"
                filterable
                multiple
                :collapse-tags="false"
                @option-click="handlePosChange"
              >
              </i-select>
            </el-form-item>
            <el-form-item label="适用人员">
              <el-input v-model="convertFullName" readonly @click.native="handlePersonnelClick">
                <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
              </el-input>
              <i-personnel-select
                :isShow.sync="isShowPersonnel"
                multiple
                :defaultSelectedPersonnel="selectedPersonnel"
                @confirm="handlePersonnelDialogConfirm"
              ></i-personnel-select>
            </el-form-item>
          </el-form>
        </el-col>
      </transition>
      <el-col :span="24">
        <el-form-item prop="calculateRuleInfoDto" label="计算规则" required>
          <el-input
            style="display: none"
            v-model="data.calculateRuleInfoDto"
            disabled></el-input>
          <el-button type="text" @click="handleCal"><i class="el-icon-edit el-icon--left"></i>设置</el-button>
        </el-form-item>
      </el-col>
      <transition name="el-zoom-in-top">
        <el-col :span="24" v-show="isShowHandleCal">
          <el-form-item>
            <IFormula v-model="data.calculateRuleInfoDto" ref="IFormula"></IFormula>
          </el-form-item>
        </el-col>
      </transition>
      <!--<el-col :span="20">-->
        <!--<el-form-item prop="employeeRange" label="适用范围" required>-->
          <!--<el-input-->
            <!--type="textarea"-->
            <!--resize="false"-->
            <!--:rows="3"-->
            <!--v-model="data.employeeRange"-->
            <!--disabled></el-input>-->
        <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="3">-->
        <!--<el-button @click="setRange">设置范围</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="20">-->
        <!--<el-form-item prop="calculateRuleInfoDto" label="计算规则" required>-->
          <!--<el-input-->
            <!--type="textarea"-->
            <!--:rows="3"-->
            <!--v-model="data.calculateRuleInfoDto.label" disabled></el-input>-->
        <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="3">-->
        <!--<el-button @click="setRules">设置规则</el-button>-->
      <!--</el-col>-->
      <el-col :span="24">
        <el-form-item prop="ruleRemark" label="规则描述">
          <el-input
            type="textarea"
            :rows="3"
            v-model="data.ruleRemark"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
//  import req from 'api/compensation/base-setting/company-rules'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import ISelect from 'components/common/i-select/i-select'
  import IFormula from 'components/compensation/formula-calculator'
  import mixin from 'components/compensation/range-filter/mixin'
  import { getRule } from 'utils/index'
  import EditorMixin from 'mixins/compensation/editor-mixin'
//  import { showMessage, confirmPopover } from 'utils/index'
  const RULES = {
    calculateRuleName: [
      getRule('请输入规则名称', 'change'),
      { min: 0, max: 20, message: '字符长度不超过20个', trigger: 'change' }
    ],
    componentName: getRule('请选择薪资项目名称', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    employeeRangeListInfo: [
      {
        validator: (rule, value, callback) => {
          if (!value.orgUnitIdList && value.posTitleIdList.length === 0 && value.employeeIdList.length === 0) {
            callback(new Error('请设置适用范围'))
          } else {
            callback()
          }
        },
        trigger: 'change',
        required: true
      }
    ],
    calculateRuleInfoDto: [
      {
        validator: (rule, value, callback) => {
          console.log('validator', value.value)
          if (!value.label) {
            callback(new Error('请设置计算规则'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ],
    ruleRemark: { min: 0, max: 150, message: '字符长度不超过150个', trigger: 'change' }
  }

  export default {
    components: {
      IDialog,
      IFormula,
      ISelect
    },
    mixins: [mixin, EditorMixin],
    data () {
      return {
        selectedPersonnel: [],
        isShowPersonnel: false,
        posTitlesProps: {
          value: 'posTitleId',
          label: 'name'
        },
        isShowHandleCal: false,
        isShowRangeSetting: false,
        rules: RULES
      }
    },
    props: {
      data: {
        type: Object,
        default: () => {}
      },
      previewMode: {
        type: Boolean,
        default: false
      }
    },
    created () {
      this.data.effectiveDate = new Date(this.data.effectiveDate)
      this.data.uneffectiveDate = new Date(this.data.uneffectiveDate)
      this.initData()
    },
    watch: {
      'data.employeeRangeList' () {
      }
    },
    computed: {
      convertFullName () {
        return this.data.employeeRangeListInfo.fullNameList.toString()
      },
      convertText () {
        return this.convertRangeText(this.data.employeeRangeList)
      },
      convertFormula () {
        return this.data.calculateRuleInfoDto ? this.data.calculateRuleInfoDto.label : ''
      }
    },
    methods: {
      handleOrgSelectClick (data) {
//        item.orgUnitName = data.orgUnitName
//        item.posTitleName = null
//        item.posTitleId = null
        // console.log(data)
      },
      handlePosChange (data) {
//        item.posTitleName = data.name
//        item.orgUnitId = null
//        item.orgUnitName = null
        // console.log(data)
      },
      /** 人员选择事件监听 */
      handlePersonnelClick () {
        this.isShowPersonnel = true
      },

      /** 人员选择确认事件 */
      handlePersonnelDialogConfirm (selected) {
        this.data.employeeRangeListInfo.fullNameList = selected.map(v => v.employeeName)
        this.data.employeeRangeListInfo.employeeIdList = selected.map(v => v.employeeId)
      },
      handleRange () {
        this.isShowRangeSetting = !this.isShowRangeSetting
      },
      handleCal () {
        this.isShowHandleCal = !this.isShowHandleCal
      },
      handleIconClick () {
        this.$emit('selectComponentName')
      },
      initData () {
        if (this.data.calculateRuleId) {
        } else {
        }
//        getDict('ATTENDANCE_ITEM').then(res => {
//          if (res) {
            // this.attendanceOptions = this.transformAttendanceOptions(res)
//            this.instance.initData(this.id)
//          }
//        })
      },
      setRange () {
        this.$emit('setRange')
      },
      setRules () {
        this.$emit('setRules')
      },
      handleCancel (done) {
        done()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .iconfont{
    cursor: pointer;
  }
  .rangeForm {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
</style>
