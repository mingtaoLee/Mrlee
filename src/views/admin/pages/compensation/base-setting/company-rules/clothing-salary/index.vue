<template>
  <i-layout v-loading="loading" :element-loading-text="$loadingText">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="区域">
          <i-select-area :id="searchParam.areaName" @change="handleAreaChange"></i-select-area>
          <!-- <el-input v-model="searchParam.areaName"></el-input> -->
        </el-form-item>
        <el-form-item label="门店">
          <el-input v-model="searchParam.orgUnitName"></el-input>
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
            @selection-change="selectionChangeHandler(tableScope, $event)">
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
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
        :title="dialogTitle"
        width="800px"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :componentId="id"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import req, { config } from 'api/compensation/base-setting/company-rules'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import DetailEdit from './detail-edit'
  import { showMessage, confirmPopover } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access],
    components: {
      ITable,
      ITableCell,
      IDialog,
      DetailEdit,
      ILayout
    },
    data () {
      return {
        dialogTitle: '',
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
            func: done => {
              this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,

        /* table */
        table: {
          columns: [
            { prop: 'areaName', label: '区域', width: '120', align: 'left' },
            { prop: 'orgUnitName', label: '门店', width: '160', align: 'left' },
            { prop: 'orgUnitCode', label: '门店编码', align: 'center', width: '120' },
            { prop: 'effectiveDate', label: '生效日期', width: '120', align: 'center', display: {date: ''} },
            { prop: 'uneffectiveDate', label: '失效日期', width: '120', align: 'center', display: {date: ''} },
            { prop: 'salary', label: '服装底薪', width: '120', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) } }
          ],
          setting: {
            export: {
              req: config.getClothingList
            },
            operator: [
              {
                text: '修改',
                func: this.modifyRow
              },
              {
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '新增',
              func: this.addPage
            }, {
              text: '导入',
              func: this.import
            }]
          },
          data: [],
          info: null,
          total: 0,
          showPagebar: true,
          search: null
        },
        // 查询参数
        searchParam: {
          orgUnitName: '',
          areaName: ''
        }
      }
    },
    methods: {
      fetch (options = {}) {
        req('getClothingList', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
      },
      addPage () {
        this.id = ''
        this.dialogTitle = '服装底薪新增'
        this.openDetailDialog()
      },
      modifyRow (scope) {
        this.id = scope.row.id
        this.dialogTitle = '服装底薪修改'
        this.openDetailDialog()
      },
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('delClothingList', {id: scope.row.id}).then(res => {
            if (res) {
              showMessage('success', '删除成功！')
              this.fetch(this.allParam)
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
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
