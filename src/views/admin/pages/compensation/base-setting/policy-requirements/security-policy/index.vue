<template>
  <i-layout headerKey="cpsInsAreasGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="所在区域">
          <i-select-area v-model="searchParam.areaId" search></i-select-area>
        </el-form-item>
        <el-form-item label="生效开始日期">
          <el-date-picker
            v-model="searchParam.effectiveDate"
            type="date"
            @change="handleEffectiveDateChange"
            :picker-options="effectOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效结束日期">
          <el-date-picker
            v-model="searchParam.uneffectiveDate"
            type="date"
            @change="handleUneffectDateChange"
            :picker-options="uneffectOptions">
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
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            v-loading="loading"
            :element-loading-text="$loadingText"
            :data="tableScope.clone"
            @selection-change="selectionChangeHandler(tableScope, $event)">
            <el-table-column type="selection" fixed="left"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
            >
              <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                />
              </template>
            </el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="title"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :idKey="idKey" :editorStatus="editorStatus" :id="id"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/base-setting/policy-requirements'
  import DetailEdit from './detail-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'
  export default {
    mixins: [SearchDateMixin, PaginationMixin, Access],
    components: {
      DetailEdit
    },
    data () {
      return {
        reqConfig: { req: req, getName: 'getSecurityPolicyList', deleteName: 'deleteSecurityPolicy' },
        idKey: 'id',
        title: '地域',
        // 查询参数
        searchParam: {
          areaId: '',
          effectiveDate: null,
          uneffectiveDate: null
        },
        // 编辑弹框控制按钮组
        detailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            throttle: true,
            text: '确认',
            func: done => {
              return this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,

        // 表格数据
        table: {
          columns: [
//            { prop: 'name', label: '社保政策名称', width: '130', align: 'center' },
            { prop: 'provinceName', label: '省份', sortable: true, align: 'left', width: '120' },
            { prop: 'cityName', label: '城市', align: 'left', width: '120' },
            { prop: 'countryName', label: '区/县', align: 'left', width: '120' },
            { prop: 'socialMinSalary', label: '最低工资', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'socialAverageSalary', label: '社平工资', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'socialMinHourSalary', label: '最低小时工资', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'effectiveDate', label: '生效日期', align: 'left', width: '120', display: {date: ''} },
            { prop: 'uneffectiveDate', label: '失效日期', align: 'left', display: {date: ''} }
          ],
          setting: {
            export: {
              config: {
                fileName: '地方政策'
              },
              key: 'cpsInsAreasExport',
              req: config.getSecurityPolicyList
            },
            import: {
              key: 'cpsInsAreasImport',
              business: 'cps-insuranceArea',
              show: () => ({ empty: false })
            },
            operator: [
              {
                key: 'cpsInsAreasUpdate',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'cpsInsAreasDelete',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              key: 'cpsInsAreasGreate',
              text: '新增',
              func: this.addPage
            }]
          },
          data: [],
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        }
      }
    },
    methods: {
      setFiveOne (scope) {
        this.$router.push({path: '/compensation/base-setting/policy-requirements/security-policy-detail', query: {id: scope.row.id}})
      },
      /** 处理区域选择 */
      handleAreaChange (id) {
        this.searchParam.areaName = id
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
