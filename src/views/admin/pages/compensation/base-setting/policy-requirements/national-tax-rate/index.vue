<template>
  <i-layout headerKey="cpsIitaxratesGet">
    <template slot="section">
      <i-table :table="table">
        <template slot="table" slot-scope="tableScope">
          <el-table v-loading="loading" :element-loading-text="$loadingText" :data="tableScope.clone" @selection-change="selectionChangeHandler(tableScope, $event)">
            <el-table-column type="selection" fixed="left"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :formatter="tableScope.formatter"
              :align="col.align"
              :minWidth="col.width"
            ></el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="title"
        width="800px"
        :toolbar="dialogToolbar"
        destroyedWhenClose
      >
        <tax-rate-edit ref="taxRateEdit" :rule="isRule" :selected="selected" :iitaxrateId="iitaxrateId"></tax-rate-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import req from 'api/compensation/base-setting/policy-requirements'
  import ITable from 'components/common/i-table'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import TaxRateEdit from './tax-rate-edit'
  import { showMessage, confirmPopover } from 'utils/index'
  import BaseMixin from 'mixins/compensation/base-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [BaseMixin, Access],
    components: {
      ITable,
      IDialog,
      TaxRateEdit,
      ILayout
    },
    data () {
      return {
        iitaxrateId: '',
        isShowDialog: false,
        dialogToolbar: [
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
        table: {
          columns: [
            {label: '类型', prop: 'iitaxrateType', align: 'left', minWidth: '140', display: { dict: 'IITAXRATE_TYPE' }},
            {label: '版本', prop: 'version', align: 'left'},
            {label: '本国员工起征点', prop: 'nativeStartPoint', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {label: '外籍员工起征点', prop: 'foreignStartPoint', align: 'right', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {label: '生效日期', prop: 'effectiveDate', align: 'left', display: { date: '' }},
            {label: '失效日期', prop: 'uneffectiveDate', align: 'left', display: { date: '' }}
          ],
          setting: {
            operator: [
              {
                key: 'cpsIitaxratesUpdate',
                text: '修改',
                func: this.modifyRow
              },
              {
                key: 'cpsIitaxratesDelete',
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [
              {
                key: 'cpsIitaxratesCreate',
                text: '新增',
                func: this.addTaxRate
              }
            ]
          },
          data: null
        }
      }
    },
    methods: {
      fetch (options = {}) {
        this.load()
        req('getTaxRate', options).then(
          res => {
            this.table.data = res
            this.loaded()
          }
        )
      },
      addTaxRate (vm) {
        if (vm.getMultipleSelection().length > 1) {
          return showMessage('warning', '只能选择一个选项，请重新选择！')
        }
        this.selected = vm.getMultipleSelection()[0] ? JSON.parse(JSON.stringify(vm.getMultipleSelection()[0])) : {}
        this.title = '国家税率表新增'
        this.toggleDialog({})
      },
      modifyRow ({row}) {
        this.title = '国家税率表修改'
        this.toggleDialog(row)
      },
      deleteRow ({row}) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('deleteBaseTaxRate', {iitaxrateId: row.iitaxrateId}).then(res => {
            if (res) {
              showMessage('success', '删除成功！')
              this.fetch()
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
      },
      toggleDialog ({ iitaxrateId }) {
        this.iitaxrateId = iitaxrateId
        this.isShowDialog = !this.isShowDialog
      },
      handleSave (done) {
        return new Promise((resolve, reject) => {
          this.$refs.taxRateEdit.save().then(res => {
            resolve()
            if (res) {
              done()
              this.fetch()
            }
          }).catch((err) => {
            reject(err)
          })
        })
      },
      /** 表格复选框改变监听 */
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
