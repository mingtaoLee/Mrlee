<template>
  <i-layout 
    header-key="insCpsInsAreasGet" 
  >
    <template slot="header">
      <i-form @search="search" @reset="reset" access-key="insCpsInsAreasGet">
        <el-form-item label="所在区域">
          <i-select-area  ref="selectArea" v-model="searchParam.areaId" search></i-select-area>
        </el-form-item>
        <!--<el-form-item label="最低小时工资">-->
          <!--<el-input v-model="searchParam.socialMinHourSalary"></el-input>-->
        <!--</el-form-item>-->
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
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            border
            :data="tableScope.clone"
            @selection-change="selectionChangeHandler(tableScope, $event)"
            v-loading="loading"
            :element-loading-text="$loadingText"
          >
            <el-table-column type="selection" :fixed="true"></el-table-column>
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
              <!-- <template slot-scope="scope">
                <i-table-cell
                  :row="scope.row"
                  :col="col.prop"
                  :table="tableScope"
                />
              </template> -->
            </el-table-column>
            <el-table-column
              label="五险一金设置"
              width="130"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button type="text" @click.native.stop="setFiveOne(scope)" size="mini" v-if="accessMap.insCpsInsAreasPolicyBtn">设置</el-button>
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
        <detail-edit ref="detailEdit" :id="id" :toolbar="detailEditToolbar"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/iaf/policy-requirements'
  import DetailEdit from './detail-edit'
  import { showMessage, confirmPopover } from 'utils/index'
  import IafPaginationMixin from 'mixins/compensation/iaf-pagination-mixin'
  import IafSearchMixin from 'mixins/compensation/iaf-search-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [IafSearchMixin, IafPaginationMixin, Access],
    components: {
      DetailEdit
    },
    data () {
      return {
        // 查询参数
        searchParam: {
          areaId: '',
          startEffectiveDate: '',
          startUneffectiveDate: '',
          endUneffectiveDate: '',
          endEffectiveDate: ''
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
            text: '确认',
            throttle: true,
            loading: false,
            func: done => {
              this.$refs.detailEdit.$refs.form.validate(res => {
                !res && (this.detailEditToolbar[1].loading = false)
              })
              !this.$refs.detailEdit.form.executeDate && (this.detailEditToolbar[1].loading = false)
              return this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,
        // 表格数据
        table: {
          columns: [
//            { prop: 'name', label: '社保政策名称', width: '130', align: 'center' },
            { prop: 'provinceName', label: '省份', sortable: true, width: '120', align: 'left' },
            { prop: 'cityName', label: '城市', width: '120', align: 'left' },
            { prop: 'countryName', label: '区/县', width: '120', align: 'left' },
            // { prop: 'socialMinSalary', label: '最低工资', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            // { prop: 'socialAverageSalary', label: '社平工资', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            // { prop: 'socialMinHourSalary', label: '最低小时工资', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'executeDate', label: '执行日期', width: '120', align: 'center', display: {date: ''} },
            { prop: 'effectiveDate', label: '生效日期', width: '120', align: 'center', display: {date: ''} },
            { prop: 'uneffectiveDate', label: '失效日期', align: 'center', display: {date: ''} }
          ],
          setting: {
            export: {
              config: {
                fileName: '地方政策'
              },
              key: 'insCpsInsAreasExport',
              req: config.getSecurityPolicyList
            },
            import: {
              key: 'insCpsInsAreasImport',
              business: 'iaf-insuranceArea',
              show: () => ({ empty: false })
            },
            toolbar: [{
              key: 'insCpsInsAreasGreate',
              text: '新增',
              func: this.addPolicy
            }],
            operator: [
              {
                key: 'insCrpsInsAreasUpdate',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'insCpsInsAreasDelete',
                text: '删除',
                func: this.deleteRow
              }
            ]
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
      fetch (options = {}) {
        this.loading = true
        req('getSecurityPolicyList', options)
        .then(res => {
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
      /** 重置搜索条件 */
      reset () {
        this.isSearch = false
        Object.keys(this.searchParam).map(key => {
          this.searchParam[key] = ''
        })
        // 点击重置清除历史选择
        this.$refs.selectArea.deleteSelected()
      },
      addPolicy () {
        this.title = '地域新增'
        this.id = ''
        this.openDetailDialog()
      },
      modifyRow (scope) {
        this.title = '地域修改'
        this.id = scope.row.id
        this.openDetailDialog()
      },
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('deleteSecurityPolicy', {id: scope.row.id}).then(res => {
            if (res) {
              showMessage('success', '删除成功！')
              this.resetAllParam(1)
              this.fetch(this.allParam)
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
      },
      setFiveOne (scope) {
        this.$router.push({path: '/compensation/iaf/basic/security-policy-detail', query: {id: scope.row.id}})
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
