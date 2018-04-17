<template>
  <i-layout header-key="iafExportInsAreasFindA">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <!--<el-form-item label="城市">-->
          <!--<el-input v-model="searchParam.cityName"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="区县">-->
          <!--<el-input v-model="searchParam.countryName"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="保险类型">
          <i-select v-model="searchParam.insuranceType" parameter="INSURANCE_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="户口性质">
          <i-select v-model="searchParam.householdCode" parameter="IAF_ACCOUNT_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="生效开始日期">
          <el-date-picker
            v-model="searchParam.startEffectiveDate"
            type="date"
            :editable="false"
            @change="handleDateChange(searchParam.startEffectiveDate, 'searchParam', 'startEffectiveDate', 'string')"
            :picker-options="startEffectOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="生效结束日期">
          <el-date-picker
            v-model="searchParam.endEffectiveDate"
            type="date"
            :editable="false"
            @change="handleDateChange(searchParam.endEffectiveDate, 'searchParam', 'endEffectiveDate', 'string')"
            :picker-options="endEffectOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效开始日期">
          <el-date-picker
            v-model="searchParam.startUneffectiveDate"
            type="date"
            :editable="false"
            @change="handleDateChange(searchParam.startUneffectiveDate, 'searchParam', 'startUneffectiveDate', 'string')"
            :picker-options="startUneffectOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效结束日期">
          <el-date-picker
            v-model="searchParam.endUneffectiveDate"
            type="date"
            :editable="false"
            @change="handleDateChange(searchParam.endUneffectiveDate, 'searchParam', 'endUneffectiveDate', 'string')"
            :picker-options="endUneffectOptions">
          </el-date-picker>
        </el-form-item>
      </i-form>
    </template>
    <template slot="section">
      <i-table
        class="table"
        :table="table"
        ref="table"
        @save="getTableData"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
        v-loading="loading"
        :element-loading-text="$loadingText" 
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            v-loading="tableScope.loading"
            :element-loading-text="$loadingText"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
            <el-table-column
              label="保险类型"
              prop="insuranceType"
              sortable
              :formatter="tableScope.formatter"
              width="120"
              align="center"
            ></el-table-column>
            <el-table-column
              label="省份"
              sortable
              prop="provinceName"
              align="center"
              width="140"
            ></el-table-column>
            <el-table-column
              label="城市"
              sortable
              width="130"
              prop="cityName"
            ></el-table-column>
            <el-table-column
              label="区/县"
              sortable
              width="130"
              prop="countryName"
            ></el-table-column>
            <el-table-column
              label="户口性质"
              prop="householdCode"
              width="120"
              align="center"
              :formatter="tableScope.formatter"
            ></el-table-column>
            <el-table-column label="个人缴纳" prop="empPay" align="center">
              <el-table-column
                label="基数上限"
                width="100"
                align="center"
                prop="empPayBaseLimit"
              ></el-table-column>
              <el-table-column
                label="基数下限"
                align="center"
                width="100"
                prop="empPayBaseLower"
              ></el-table-column>
              <el-table-column
                label="比例上限(%)"
                align="center"
                width="100"
                prop="empPayRatio"
              ></el-table-column>
              <el-table-column
                label="比例下限(%)"
                align="center"
                width="100"
                prop="empPayRatioMin"
              ></el-table-column>
              <el-table-column
                label="固定金额"
                align="center"
                width="100"
                prop="empPayFixedAmount"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="公司缴纳" prop="compPay" align="center">
              <el-table-column
                label="基数上限"
                align="center"
                width="100"
                prop="compPayBaseLimit"
              ></el-table-column>
              <el-table-column
                align="center"
                width="100"
                label="基数下限"
                prop="compPayBaseLower"
              ></el-table-column>
              <el-table-column
                label="比例上限(%)"
                align="center"
                width="100"
                prop="compPayRatio"
              ></el-table-column>
              <el-table-column
                label="比例下限(%)"
                align="center"
                width="100"
                prop="compPayRatioMin"
              ></el-table-column>
              <el-table-column
                label="固定金额"
                align="center"
                width="100"
                prop="compPayFixedAmount"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column
              label="生效日期"
              align="center"
              width="120"
              prop="effectiveDate"
              :formatter="tableScope.formatter"
            ></el-table-column>
            <el-table-column
              label="失效日期"
              width="120"
              align="center"
              prop="uneffectiveDate"
              :formatter="tableScope.formatter"
              disabled="true"
            ></el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="title"
        size="large"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit 
          ref="detailEdit" 
          :id="id" 
          :add="add"
          :areaInfoId="areaInfoId"
        ></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import req, { config } from 'api/iaf/policy-requirements'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import DetailEdit from './detail-edit/index.vue'
  import { showMessage, confirmPopover } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/iaf-pagination-mixin'
  import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
  import Access from 'mixins/access'
  import { Modifier } from './detail-edit/modifier.js'
  export default {
    name: 'FiveOne',
    mixins: [PaginationMixin, IafSearchMixin, Access],
    components: {
      ITable,
      ITableCell,
      IDialog,
      DetailEdit,
      ILayout
    },
    props: {
      id: String
    },
    data () {
      return {
        areaInfoId: '',
        title: '',
        // 弹窗控制按钮
        detailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '确认',
            throttle: true,
            func: done => {
              return this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,

        // 表格数据
        table: {
          columns: [
            {prop: 'insuranceType', display: { dict: 'INSURANCE_TYPE' }},
            {prop: 'householdCode', display: {dict: 'IAF_ACCOUNT_TYPE'}},
            {prop: 'compPayFixedAmount', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'empPayFixedAmount', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'effectiveDate', display: { date: 'default' }},
            {prop: 'uneffectiveDate', display: { date: 'default' }}
          ],
          setting: {
            export: {
              config: {
                fileName: '五险一金'
              },
              key: 'iafExportInsAreasInfo',
              req: config.getSecurityPolicyDetailList,
              param: () => ({ id: this.id })
            },
            import: {
              key: 'iafExportInsAreasImportA',
              business: 'iaf-insuranceAreaPolicy',
              show: () => ({ empty: false })
            },
            operator: [
              {
                key: 'iafUpdateInsAreasInfo',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'iafDeleteInsAreasInfo',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '返回',
              type: 'plain',
              func: this.back
            }, {
              key: 'iafCreateInsAreasInfo',
              text: '新增',
              func: this.add
            }]
          },
          data: [],
          multiple: true,
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        },
        searchParam: {
          insuranceType: '',
          householdCode: '',
          startEffectiveDate: '',
          endEffectiveDate: '',
          startUneffectiveDate: '',
          endUneffectiveDate: ''
        }
      }
    },
    methods: {
      fetch (options = {}) {
        this.loading = true
        req('getSecurityPolicyDetailList', Object.assign(options, { id: this.id })).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
      },
      add (vm) {
        const selectionRow = vm.getMultipleSelection()
        if (selectionRow.length > 1) return this.$message('新增时只能选择一条数据')
        this.title = '五险一金新增'
        this.areaInfoId = ''
        this.add = true
        this.openDetailDialog()
        selectionRow[0] && setTimeout(() => {
          this.$refs.detailEdit.areaInfoId = selectionRow[0].areaInfoId
          const opt = {
            vm: this.$refs.detailEdit
          }
          ;(new Modifier(opt)).initData()
        }, 0)
      },
      modifyRow (scope) {
        this.title = '五险一金修改'
        this.areaInfoId = scope.row.areaInfoId
        this.add = false
        this.openDetailDialog()
      },
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('deleteSecurityPolicyDetail', {id: this.id, areaInfoId: scope.row.areaInfoId}).then(res => {
            if (res) {
              showMessage('success', '删除成功！')
              this.fetch(this.allParam)
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
      },
      openDetailDialog () {
        this.isShowDialog = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
