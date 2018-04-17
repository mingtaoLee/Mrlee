<template>
  <i-layout header-key="insDifferenceGet">
    <div slot="header">
      <i-form @reset="resetInputs" @search="search">
        <el-form-item label="工号">
          <el-input v-model="searchData.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchData.fullName"></el-input>
        </el-form-item>
        <el-form-item label="户头代码">
          <el-input v-model="searchData.accountCode"></el-input>
        </el-form-item>
        <el-form-item label="户头名称">
          <el-input v-model="searchData.accountName"></el-input>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="searchData.idNumber"></el-input>
        </el-form-item>
        <!-- <el-form-item label="缴纳月份">
          <el-date-picker type="month" v-model="searchData.payMonth"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="员工状态">
          <i-select clearable v-model="searchData.employeeStatus" parameter="dict"></i-select>
        </el-form-item>
        <el-form-item label="是否退休">
          <i-select clearable v-model="searchData.isRetire" parameter="dict"></i-select>
        </el-form-item>
        <el-form-item label="是否残疾工">
          <i-select clearable v-model="searchData.isHandicapped" parameter="dict"></i-select>
        </el-form-item>
      </i-form>
    </div>

    <div slot="section-title">
      <el-form :inline="true">
        <el-form-item>
          <el-form-item>
            <el-radio-group @change="radioChange" v-model="comparisonData.radio">
              <el-radio label="1" v-if="accessMap.insDifferenceWageGet">和工资对比</el-radio>
              <el-radio label="2" v-if="accessMap.insDifferenceCalculateGet">和计算结果对比</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="isFormShow && accessMap.insDifferenceWagesInGet" label="工资月份">
            <el-date-picker type="month" v-model="comparisonData.compareMonth" ></el-date-picker>
          </el-form-item>
          <el-form-item v-if="isFormShow && accessMap.insDifferencePayInGet" label="缴纳月份">
            <el-date-picker type="month" v-model="comparisonData.payMonth" @change="DetailTableDate"></el-date-picker>
          </el-form-item>
          <el-form-item v-if="!isFormShow && accessMap.insDifferenceComputingGet" label="计算月份">
            <el-date-picker type="month" v-model="comparisonData.compareMonth"></el-date-picker>
          </el-form-item>
          <el-form-item v-if="!isFormShow && accessMap.insDifferencePayInGet" label="缴纳月份">
            <el-date-picker type="month" v-model="comparisonData.payMonth" @change="DetailTableDate"></el-date-picker>
          </el-form-item>
        </el-form-item>
      </el-form>
      <div class="flex">
        <span class="comparison-title">对比项目</span>
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="a">养老</el-checkbox>
          <el-checkbox label="b">医疗</el-checkbox>
          <el-checkbox label="c">失业</el-checkbox>
          <el-checkbox label="d">工伤</el-checkbox>
          <el-checkbox label="e">生育</el-checkbox>
          <el-checkbox label="f">公积金</el-checkbox>
          <el-checkbox label="g">补充工伤</el-checkbox>
          <el-checkbox label="h">大病补医保</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div slot="section">
      <!-- 明细表 -->
      <i-table
         @pageSizeChange="handleSizeChangeDetailTable"
         @pageIndexChange="handleCurrentChangeDetailTable"
        :table="detailTable"
        v-show="isTableShow"
        v-loading="loading"
        ref="tableDetail"
        >
        <template slot="table" slot-scope="tableScope">
          <el-table
            ref="detailElTable"
            :data="tableScope.clone"
            v-loading="loading"
            :element-loading-text="$loadingText"
          >
            <el-table-column
              v-for="(item, key) in detailTable.columns"
              :min-width="item.width"
              align="center"
              :prop="item.prop"
              :label="item.label"
              :key="key"
            >
              <el-table-column
                v-for="(col,idx) in item.children"
                :prop="col.prop"
                :label="col.label"
                :key="idx"
              >
                <el-table-column
                  v-for="(childrenCol, index) in col.children"
                  :prop="childrenCol.prop"
                  :label="childrenCol.label"
                  :key="index"
                >
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table>
        </template>
      </i-table>
        <!-- 汇总表 -->
        <i-table
          @pageSizeChange="handleSizeChangeCollectTable"
          @pageIndexChange="handleCurrentChangeCollectTable"
          :table="collectTable"
          v-show="!isTableShow"
          :value="2"
          ref="tableCollect"
          >
          <template slot="table" slot-scope="tableScope">
            <el-table
              ref="collectElTable"
              :data="tableScope.clone"
              v-loading="loading"
              :element-loading-text="$loadingText"
            >
              <el-table-column
                v-for="(item, key) in collectTable.columns"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                align="center"
                :key="key">
                  <el-table-column
                  v-for="(col,idx) in item.children"
                  :prop="col.prop"
                  :label="col.label"
                  :key="idx">
                  </el-table-column>
              </el-table-column>
            </el-table>
          </template>
        </i-table>
    </div>
  </i-layout>
</template>

<script>
import IForm from 'components/common/i-form/i-form.vue'
import ISelect from 'components/common/i-select/i-select.vue'
import ITable from 'components/common/i-table'
import ILayout from 'components/common/i-layout'
import req, {config} from 'api/iaf/external-data'
import moment from 'moment'
import access from 'mixins/access'
export default {
  components: {
    IForm,
    ISelect,
    ITable,
    ILayout
  },
  data () {
    return {
      value: '',
      isTableShow: true,
      isFormShow: true,
      loading: false,
      checkList: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      // 搜索表单数据
      searchData: {
        test: '',
        employeeCode: '', // 员工id
        fullName: '', // 员工姓名
        accountCode: '', // 户头代码
        accountName: '', // 户头名称
        idNumber: '', // 身份证号
        // payMonth: '', // 缴纳月份
        employeeStatus: '', // 员工状态
        isHandicapped: '', // 是否残疾
        isRetire: '' // 是否退休
      },
      // 对比表单数据
      comparisonData: {
        payMonth: '', // 缴纳月份
        compareTarget: 'payroll', // 对比目标值
        compareMonth: '', // 对比月份
        radio: '1'
      },
      // 明细表
      detailTable: {
        columns: [
          {prop: 'employeeCode', label: '工号', width: '100'},
          {prop: 'fullName', label: '姓名', width: '100'},
          {prop: 'idNumber', label: '身份证号码', width: '200'},
          {prop: 'orgUnitCode', label: '组织代码', width: '100'},
          {prop: 'orgUnitName', label: '组织名称', width: '100'},
          {prop: 'employeeStatus', label: '员工状态', width: '100'},
          {prop: 'isRetire', label: '是否退休', width: '100'},
          {prop: 'isHandicapped', label: '是否残疾工', width: '150'},
          {prop: 'test', label: '工伤状态', width: '100'},
          {prop: 'test', label: '生育标识', width: '100'},
          {prop: 'payMonth', label: '缴费月份', width: '100'},
          {prop: 'comparePayMonth', label: '工资核算月份', width: '150'},
          {prop: 'test', label: '人员状况', width: '100'},
          // 医疗保险
          {
            label: '医疗保险',
            children: [
              {prop: 'medicareAccountCode', label: '户头代码'},
              {prop: 'medicareAccountName', label: '户头名称'},
              {
                label: '医疗保险单位扣款',
                children: [
                  {prop: 'medicareCompareCompPayValue', label: '工资'},
                  {prop: 'medicareActualCompPayValue', label: '实际'},
                  {prop: 'medicareDifferenceCompPayValue', label: '差异'}
                ]
              },
              {
                label: '医疗保险个人扣款',
                children: [
                  {prop: 'medicareCompareEmpPayValue', label: '工资'},
                  {prop: 'medicareActualEmpPayValue', label: '实际'},
                  {prop: 'medicareDifferenceEmpPayValue', label: '差异'}
                ]
              },
              {
                label: '大病补医保单位扣款',
                children: [
                  {prop: 'seriousIllnessMedicareCompareCompPayValue', label: '工资'},
                  {prop: 'seriousIllnessMedicareActualCompPayValue', label: '实际'},
                  {prop: 'seriousIllnessMedicareDifferenceCompPayValue', label: '差异'}
                ]
              },
              {
                label: '大病补医保个人扣款',
                children: [
                  {prop: 'seriousIllnessMedicareCompareEmpPayValue', label: '工资'},
                  {prop: 'seriousIllnessMedicareActualEmpPayValue', label: '实际'},
                  {prop: 'seriousIllnessMedicareDifferenceEmpPayValue', label: '差异'}
                ]
              }
            ]
          },
          // 工伤保险
          {
            label: '工伤保险',
            children: [
              {prop: 'employmentInjuryAccountCode', label: '户头代码'},
              {prop: 'employmentInjuryAccountName', label: '户头名称'},
              {
                label: '工伤保险单位扣款',
                children: [
                  {prop: 'employmentInjuryCompareCompPayValue', label: '工资'},
                  {prop: 'employmentInjuryActualCompPayValue', label: '实际'},
                  {prop: 'employmentInjuryDifferenceCompPayValue', label: '差异'}
                ]
              },
              {
                label: '补充工伤单位扣款',
                children: [
                  {prop: 'supplementaryEmploymentInjuryCompareValue', label: '工资'},
                  {prop: 'supplementaryEmploymentInjuryActualValue', label: '实际'},
                  {prop: 'supplementaryEmploymentInjuryDifferenceValue', label: '差异'}
                ]
              }
            ]
          },
          // 失业保险
          {
            label: '失业保险',
            children: [
              {prop: 'unemploymentAccountCode', label: '户头代码'},
              {prop: 'unemploymentAccountName', label: '户头名称'},
              {
                label: '失业保险单位扣款',
                children: [
                  {prop: 'unemploymentCompareCompPayValue', label: '工资'},
                  {prop: 'unemploymentActualCompPayValue', label: '实际'},
                  {prop: 'unemploymentDifferenceCompPayValue', label: '差异'}
                ]
              },
              {
                label: '失业保险个人扣款',
                children: [
                  {prop: 'unemploymentCompareEmpPayValue', label: '工资'},
                  {prop: 'unemploymentActualEmpPayValue', label: '实际'},
                  {prop: 'unemploymentDifferenceEmpPayValue', label: '差异'}
                ]
              }
            ]
          },
          // 生育保险
          {
            label: '生育保险',
            children: [
              {prop: 'maternityAccountCode', label: '户头代码'},
              {prop: 'hpfundAccountName', label: '户头名称'},
              {
                label: '生育保险单位扣款',
                children: [
                  {prop: 'maternityCompareCompPayValue', label: '工资'},
                  {prop: 'maternityActualCompPayValue', label: '实际'},
                  {prop: 'maternityDifferenceCompPayValue', label: '差异'}
                ]
              }
            ]
          },
          // 公积金
          {
            label: '公积金',
            children: [
              {prop: 'hpfundAccountCode', label: '户头代码'},
              {prop: 'hpfundAccountName', label: '户头名称'},
              {
                label: '公积金单位扣款',
                children: [
                  {prop: 'hpfundCompareCompPayValue', label: '工资'},
                  {prop: 'hpfundActualCompPayValue', label: '实际'},
                  {prop: 'hpfundDifferenceCompPayValue', label: '差异'}
                ]
              },
              {
                label: '公积金个人扣款',
                children: [
                  {prop: 'hpfundCompareEmpPayValue', label: '工资'},
                  {prop: 'hpfundActualEmpPayValue', label: '实际'},
                  {prop: 'hpfundDifferenceEmpPayValue', label: '差异'}
                ]
              }
            ]
          },
          // 小计
          {
            label: '小计',
            children: [
              {
                label: '社保单位扣款小计',
                children: [
                  {prop: 'subtotalCompareCompPayValue', label: '工资'},
                  {prop: 'subtotalActualCompPayValue', label: '实际'},
                  {prop: 'subtotalDifferenceCompPayValue', label: '差异'}
                ]
              },
              {
                label: '社保个人扣款小计',
                children: [
                  {prop: 'subtotalCompareEmpPayValue', label: '工资'},
                  {prop: 'subtotalActualEmpPayValue', label: '实际'},
                  {prop: 'subtotalDifferenceEmpPayValue', label: '差异'}
                ]
              }
            ]
          }
        ],
        setting: {
          toolbar: [
            {text: '差异明细表', func: this.showDetailTable, key: 'insDifferenceSummary'},
            {text: '差异汇总表', func: this.showCollectTable, key: 'insDifferenceSummaryGet'}
            // {text: '导出', func: this.exportTable}
            // , func: this.showCollectTable
          ],
          export: {
            config: {
              fileName: '五险一金差异明细表'
            },
            req: config.difference,        // api 配置信息（参数名以自身业务为准）【必填】
            elTable: null,                  // el-table 实例，在 mounted 时挂载【必填】
            key: 'insDifferenceExportPost'
          }
        },
        data: null,
        total: 0,
        info: null,
        showPagebar: true
      },
      // 汇总表
      collectTable: {
        columns: [
          {prop: 'accountCode', label: '户头'},
          {prop: 'payMonth', label: '月份'},
          {prop: 'insuranceType', label: '险种'},
          {
            label: '单位差异',
            children: [
              {prop: 'actualCompPayValue', label: '外部缴纳数据'},
              {prop: 'compareCompPayValue', label: '内部工资扣款'},
              {prop: 'differenceCompPayValue', label: '差异'}
            ]
          },
          {
            label: '个人差异',
            children: [
              {prop: 'actualEmpPayValue', label: '外部缴纳数据'},
              {prop: 'compareEmpPayValue', label: '内部工资扣款'},
              {prop: 'differenceEmpPayValue', label: '差异'}
            ]
          },
          {prop: 'totalDifferenceValue', label: '合计差异'}
        ],
        setting: {
          toolbar: [
            {text: '差异明细表', func: this.showDetailTable, key: 'insDifferenceSummary'},
            {text: '差异汇总表', func: this.showCollectTable, key: 'insDifferenceSummaryGet'}
          ],
          export: {
            config: {
              fileName: '五险一金差异汇总表'
            },
            req: config.difference,        // api 配置信息（参数名以自身业务为准）【必填】
            elTable: null,                  // el-table 实例，在 mounted 时挂载【必填】
            key: 'insDifferenceExportPost'
          }
        },
        data: null,
        total: 0,
        info: null,
        showPagebar: true
      }
    }
  },
  mixins: [access],
  mounted () {
    // this.loading = true
    this.detailTable.setting.export.elTable = this.$refs.detailElTable  // 挂载
    this.collectTable.setting.export.elTable = this.$refs.collectElTable  // 挂载
  },
  methods: {
    handleSizeChangeDetailTable (options) {
      this.DetailTableDate(options)
    },
    handleCurrentChangeDetailTable (options) {
      this.DetailTableDate(options)
    },
    handleSizeChangeCollectTable (options) {
      this.DetailTableDate(options)
    },
    handleCurrentChangeCollectTable (options) {
      this.DetailTableDate(options)
    },
    // 明细显示
    submitData (options) {
      let submitData = Object.assign({}, this.comparisonData, options)
      submitData.compareMonth = moment(submitData.compareMonth).format('YYYY-MM') + '-01 00:00:00'
      submitData.payMonth = moment(submitData.payMonth).format('YYYY-MM') + '-01 00:00:00'
      delete submitData.radio
      return submitData
    },
    DetailTableDate (options = {}) {
      req('difference', this.submitData(options)).then(res => {
        this.detailTable = Object.assign({}, this.detailTable, res)
      })
    },
    // 显示差异详细表
    showDetailTable () {
      this.isTableShow = true
    },
    // 显示差异汇总表
    showCollectTable () {
      this.isTableShow = false
      req('summary', this.submitData(this.comparisonData)).then(res => {
        this.collectTable = Object.assign({}, this.collectTable, res)
      })
    },
    resetInputs () {
      for (var key in this.searchData) {
        this.searchData[key] = ''
      }
    },
    search () {
      if (this.comparisonData.compareMonth && this.comparisonData.payMonth) {
        if (this.isTableShow) {
          this.loading = true
          req('difference', this.submitData(this.searchData)).then(res => {
            this.detailTable = Object.assign({}, this.detailTable, res)
            this.loading = false
          })
          .catch(err => {
            console.log(err)
            this.loading = false
          })
        } else {
          req('summary', this.submitData(this.searchData)).then(res => {
            this.collectTable = Object.assign({}, this.collectTable, res)
            this.loading = false
          })
          .catch(err => {
            console.log(err)
            this.loading = false
          })
        }
      } else {
        this.$message.error('请先填写工资月份和缴纳月份')
      }
    },
    changeTableLabel (columns, regular, string) {
      columns.forEach(column => {
        column.label = column.label.replace(regular, string)
        if (column.children) {
          this.changeTableLabel(column.children, regular, string)
        } else if (!column.children) {
          return
        }
      })
    },
    radioChange (label) {
      if (label === '1') {
        this.isFormShow = true
        this.comparisonData.compareTarget = 'payroll'
        this.comparisonData.payMonth = ''
        this.comparisonData.compareMonth = ''
        this.changeTableLabel(this.detailTable.columns, /计算/, '工资')
        this.changeTableLabel(this.collectTable.columns, /计算/, '工资')
      } else if (label === '2') {
        this.isFormShow = false
        this.comparisonData.compareTarget = 'calculation'
        this.comparisonData.payMonth = ''
        this.comparisonData.compareMonth = ''
        this.changeTableLabel(this.detailTable.columns, /工资/, '计算')
        this.changeTableLabel(this.collectTable.columns, /工资/, '计算')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.comparison-title{
  font-size:14px;
}
.content-card{
  padding:10px;
}
.flex{
  display: flex;
}
</style>
