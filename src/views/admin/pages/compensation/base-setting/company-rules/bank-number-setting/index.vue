<template>
  <i-layout headerKey="cpsBankingSelectGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="联行号">
          <el-input v-model="searchParam.bankingFirmId"></el-input>
        </el-form-item>
        <el-form-item label="银行类别">
          <i-select v-model="searchParam.bankType" parameter="BANK_TYPE"></i-select>
        </el-form-item>
        <el-form-item label="银行名称">
          <el-input v-model="searchParam.bankName"></el-input>
        </el-form-item>
        <el-form-item label="所在区域">
          <i-select-area v-model="searchParam.areaId" search></i-select-area>
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
            v-loading="loading"
            :element-loading-text="$loadingText"
            :data="tableScope.clone"
            border
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
        <detail-edit ref="detailEdit" :editorStatus="editorStatus" :idKey="idKey" :payBankingFirmId="payBankingFirmId"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import req, { config } from 'api/compensation/base-setting/company-rules'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import DetailEdit from './detail-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, Access],
    components: {
      ITable,
      IDialog,
      DetailEdit,
      ILayout
    },
    data () {
      return {
        reqConfig: { req: req, getName: 'getBankNumbers', deleteName: 'deleteBankNumber' },
        idKey: 'payBankingFirmId',
        title: '联行号',
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
            throttle: true,
            text: '确认',
            func: done => {
              return this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,

        /* table */
        table: {
          columns: [
            { prop: 'bankingFirmId', label: '联行号', sortable: true, align: 'left', width: '120' },
            { prop: 'bankType', label: '银行类别', sortable: true, width: '120', align: 'left', display: { dict: 'BANK_TYPE' } },
            { prop: 'bankName', label: '银行名称', width: '160', align: 'left' },
            { prop: 'provinceName', label: '省份', sortable: true, width: '100', align: 'left' },
            { prop: 'cityName', label: '城市', width: '120', align: 'left' },
            { prop: 'countryName', label: '区/县', width: '120', align: 'left' },
            { prop: 'remark', label: '备注', align: 'left', width: '200' }
          ],
          setting: {
            export: {
              config: {
                fileName: '联行号'
              },
              key: 'cpsBankingExport',
              req: config.getBankNumbers
            },
            import: {
              key: 'cpsBankingImport',
              business: 'cps-payBankingFirm',
              show: () => ({ empty: false })
            },
            operator: [
              {
                key: 'cpsBankingUpdatePut',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'cpsBankingDelete',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              key: 'cpsBankingCreatePost',
              text: '新增',
              func: this.addPage
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          bankingFirmId: '',
          bankType: '',
          bankName: '',
          areaId: ''
        }
      }
    },
    methods: {
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
