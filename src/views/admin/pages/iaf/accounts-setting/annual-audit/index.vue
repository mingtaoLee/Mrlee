<template>
  <i-layout header-key="cpsAccountUnemploymentSelectGet">
    <template slot="header">
      <i-form 
        @search="search" 
        @reset="reset" 
        labelWidth="large"
        access-key="iafSelectAccountUnemploymentAuditPageList"
      >
        <el-form-item label="户头代码">
          <el-input v-model="searchParam.accountCode"></el-input>
        </el-form-item>
        <el-form-item label="户头名称">
          <el-input v-model="searchParam.accountName"></el-input>
        </el-form-item>
        <el-form-item label="公司代码">
          <el-input v-model="searchParam.companyCode"></el-input>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="searchParam.companyName"></el-input>
        </el-form-item>
        <el-form-item label="年度">
          <el-date-picker
            v-model="searchParam.auditYear"
            type="year"
            :editable="false"
            value-format="yyyy"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="年检日期起">
          <el-date-picker
            v-model="searchParam.auditDateStart"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd"
            :picker-options="auditDateStartOption"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="年检日期止">
          <el-date-picker
            v-model="searchParam.auditDateEnd"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd"
            :picker-options="auditDateEndOption"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="到期日期起">
          <el-date-picker
            v-model="searchParam.uditEndDateStart"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd"
            :picker-options="uditEndDateStartOption"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="到期日期止">
          <el-date-picker
            v-model="searchParam.uditEndDateEnd"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd"
            :picker-options="uditEndDateEndOption"
          ></el-date-picker>
        </el-form-item>
      </i-form>
    </template>
    <template slot="section">
      <i-table
        class="table"
        :table="table"
        ref="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            border
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
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="title"
        width="800px"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :unempAuditId="unempAuditId" :toolbar="detailEditToolbar"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import req, { config } from 'api/iaf/company-rules'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import DetailEdit from './detail-edit'
  import { showMessage, confirmPopover } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/iaf-pagination-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, Access],
    components: {
      ITable,
      ITableCell,
      IDialog,
      DetailEdit,
      ILayout
    },
    data () {
      return {

        auditDateStartOption: {
          disabledDate: (time) => {
            return time.getTime() > Date.parse(this.searchParam.auditDateEnd) - 3600 * 1000 * 24
          }
        },
        auditDateEndOption: {
          disabledDate: (time) => {
            return time.getTime() < Date.parse(this.searchParam.auditDateStart)
          }
        },

        uditEndDateStartOption: {
          disabledDate: (time) => {
            return time.getTime() > Date.parse(this.searchParam.uditEndDateStart) - 3600 * 1000 * 24
          }
        },
        uditEndDateEndOption: {
          disabledDate: (time) => {
            return time.getTime() < Date.parse(this.searchParam.uditEndDateEnd)
          }
        },

        /* detail-edit */
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
              this.detailEditToolbar[1].loading = true
              return this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,
        /* table */
        table: {
          columns: [
            { prop: 'accountCode', sortable: true, label: '户头代码', align: 'left', width: '120' },
            { prop: 'accountName', label: '户头名称', width: '160', align: 'left' },
            { prop: 'companyCode', label: '公司代码', width: '120', align: 'left' },
            { prop: 'companyName', label: '公司名称', width: '160', align: 'left' },
            // { prop: 'securityNumber', label: '社保编号', width: '120', align: 'center' },
            { prop: 'auditYear', label: '年度', width: '100', align: 'center' },
            { prop: 'auditDate', label: '年检时间', width: '120', align: 'center', display: {date: ''} },
            { prop: 'uditEndDate', label: '到期时间', width: '120', align: 'center', display: {date: ''} },
            { prop: 'remark', label: '备注', width: '200', align: 'left' }
          ],
          setting: {
            export: {
              config: {
                fileName: '失业险年审'
              },
              key: 'iafExportAccountUnemploymentAudit',
              req: config.getAnnualAuditList
            },
            import: {
              key: 'iafImportAccountUnemploymentAudit11',
              business: 'iaf-unemploymentsImport',
              show: () => ({ empty: false })
            },
            operator: [
              {
                key: 'iafUpdateAccountUnemploymentAudit',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'iafDeleteAccountUnemploymentAudit',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '返回',
              type: 'plain',
              func: this.back
            }, {
              key: 'iafCreateAccountUnemploymentAudit',
              text: '新增',
              func: this.addPolicy
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
//          accountCode: '',
//          accountName: '',
//          companyCode: '',
//          companyName: ''
        }
      }
    },
    methods: {
      fetch (options = {}) {
        this.load()
        req('getAnnualAuditList', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
        .catch(err => {
          console.log(err)
          this.loaded()
        })
      },
      addPolicy () {
        this.title = '失业保险年审新增'
        this.unempAuditId = ''
        this.openDetailDialog()
      },
      modifyRow (scope) {
        this.title = '失业保险年审修改'
        this.unempAuditId = scope.row.unempAuditId
        this.openDetailDialog()
      },
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('deleteAnnualAudit', {unempAuditId: scope.row.unempAuditId}).then(res => {
            if (res) {
              showMessage('success', '删除成功！')
              this.fetch(this.allParam)
            } else {
              showMessage('warning', '删除失败！')
            }
          })
        })
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleSave (done) {
        return this.$refs.detailEdit.save()
        .then(res => {
          if (res) {
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            done()
            this.fetch()
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
