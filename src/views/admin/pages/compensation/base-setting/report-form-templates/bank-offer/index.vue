<template>
  <i-layout headerKey="cpsBankTemplatesGet">
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="模板名称">
        <el-input v-model="searchParam.bankTemplateName"></el-input>
      </el-form-item>
      <!-- <el-form-item label="银行名称">
        <el-input v-model="searchParam.bankName"></el-input>
      </el-form-item> -->
      <el-form-item prop="bankCode" label="银行名称">
        <i-select v-model="searchParam.bankCode" parameter="BANK_TYPE"></i-select>
      </el-form-item>
      <el-form-item label="所在区域">
        <i-select-area v-model="searchParam.areaId" :panelAmount="2" search></i-select-area>
      </el-form-item>
      <el-form-item label="生效开始日期">
        <el-date-picker
          v-model="searchParam.effectiveDate"
          type="date"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="失效结束日期">
        <el-date-picker
          v-model="searchParam.uneffectiveDate"
          type="date"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
    </i-form>
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
            ref="elTable"
            :data="tableScope.clone"
            border
          >
            <el-table-column type="selection" fixed="left"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
            <el-table-column
              label="模板设置"
              width="100"
              align="center"
              v-if="accessMap['cpsBankTemplatesUpdatePost']"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="setTpl(scope)" size="mini">设置</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              width="200"
              prop="remark"
              align="left"
            ></el-table-column>
            <i-table-operator :table="tableScope" scope></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        :title="title"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <BankTplModify
          :editorStatus="editorStatus" 
          :idKey="idKey" 
          :id="bankTemplateId"
          ref="BankTplModify"></BankTplModify>
      </i-dialog>
      <i-dialog
        v-model="isShowTplSettingDialog"
        title="银行报盘模板格式设置"
        :toolbar="tplSettingDetailEditToolbar"
        size="large"
        destroyedWhenClose
      >
        <BankTplFormatModify
          :bankTemplateId="currentBankTemplateId"
          ref="BankTplFormatModify"
        ></BankTplFormatModify>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/base-setting/bank-offer'
  import BankTplModify from './detail-edit'
  import BankTplFormatModify from './tpl-detail-edit'
  import { showMessage } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    components: {
      BankTplModify,
      BankTplFormatModify
    },
    mixins: [PaginationMixin, SearchDateMixin, Access],
    data () {
      return {
        title: '银行报盘模板',
        reqConfig: { req: req, getName: 'getBankTplList', deleteName: 'delBankTpl' },
        // 行id键值
        idKey: 'bankTemplateId',
        bankTplModifyLoading: false,
        instance: null,
        searchParam: {
          bankTemplateName: null,
          bankName: null,
          areaId: null,
          effectiveDate: null,
          uneffectiveDate: null
        },
//        loading: true,
        tplSettingLoading: true,
        detailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => this.handleCancel(done)
          },
          {
            throttle: true,
            text: '确认',
            func: done => this.handleSave(done)
          }
        ],
        isShowDialog: false,
        isShowTplSettingDialog: false,
        tplSettingDetailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => this.handleCancel(done)
          },
          {
            throttle: true,
            text: '确认',
            func: done => this.handleTplSave(done)
          }
        ],
        // 表格
        table: {
          columns: [
            { prop: 'bankTemplateName', label: '模板名称', width: '180', align: 'left' },
            { prop: 'bankCode', label: '银行名称', width: '180', align: 'left', display: { dict: 'BANK_TYPE' } },
            { prop: 'provinceName', label: '省份', width: '160', align: 'left' },
            { prop: 'cityName', label: '城市', width: '160', align: 'left' },
            { prop: 'effectiveDate', label: '生效日期', align: 'left', width: '150', display: {date: 'default'} },
            { prop: 'uneffectiveDate', label: '失效日期', align: 'left', width: '150', display: {date: 'default'} }
          ],
          setting: {
            operator: [
              {
                text: '修改',
                key: 'cpsBankTemplatesPut',
                func: this.modifyRow
              },
              {
                text: '删除',
                key: 'cpsBankTemplatesDelete',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '新增',
              key: 'cpsBankTemplatesPost',
              func: this.addPage
            }],
            import: {
              business: 'cps-bankTemplate',
              key: 'cpsBankTemplateImportPost',
              show: () => ({ empty: false })
            },
            export: {
              req: config.getBankTplList,
              key: 'cpsBankTemplateExport',
              config: {
                fileName: '银行报盘模板'
              }
            }
          },
          data: [],
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        },

        form: {
          bankTemplateId: null,
          bankTemplateName: '',
          bankName: '',
          areaId: '',
          effectiveDate: '',
          uneffectiveDate: '',
          columnSeperator: '',
          rowSeperator: '',
          userColumnSeperator: '',
          userRowSeperator: '',
          zeroInclude: '',
          remark: ''
        },
        currentBankTemplateId: '',
        previewMode: false
      }
    },
    methods: {
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleSave (done) {
        return new Promise((resolve, reject) => {
          this.$refs['BankTplModify'].save().then(res => {
            if (res) {
              this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
              resolve(true)
              done()
            } else {
              reject(false)
            }
          }).catch(() => {
            reject(false)
          })
        })
      },
      handleTplSave (done) {
        return new Promise((resolve, reject) => {
          let headCell = this.$refs['BankTplFormatModify'].$refs['tableHeadCell'].filter(el => !el.validate())
          let mainCell = this.$refs['BankTplFormatModify'].$refs['tableMainCell'].filter(el => !el.validate())
          let tailCell = this.$refs['BankTplFormatModify'].$refs['tableTailCell'].filter(el => !el.validate())
          if (headCell.length > 0 || mainCell.length > 0 || tailCell.length > 0) {
            showMessage('error', '请检查是否存在空值未输入或输入内容长度（格式）有误！')
            reject(false)
          } else {
            this.saveTplSettingDetail().then(() => {
              resolve(true)
              done()
            }).catch(() => {
              resolve(true)
            })
          }
        })
      },
      // transformSubmitData (data) {
      //   const submitData = JSON.parse(JSON.stringify(data))
      //   let datesKey = ['effectiveDate', 'uneffectiveDate']
      //   datesKey.map(key => {
      //     submitData[key] = Date.parse(submitData[key])
      //   })
      //   this.$refs['BankTplModify'].setUneffectiveDate(submitData)
      //   return submitData
      // },
      // 保存模板详情处理事件
      saveTplSettingDetail () {
        const data = this.$refs['BankTplFormatModify'].getTableData()
        const params = Object.assign({}, data.form, data.tabData)
        return this.modifyBankTplContent(params)
      },
      // 编辑表单列表信息
      // editBankTpl (params) {
      //   return req('editBankTpl', params).then(res => {
      //     if (res) {
      //       showMessage('success', '修改成功！')
      //       this.fetch(this.allParam)
      //     } else {
      //       showMessage('danger', '修改失败！')
      //     }
      //   })
      // },
      // 创建表单列表信息
      // createBankTpl (params) {
      //   return req('createBankTpl', {
      //     bankTemplateName: params.bankTemplateName,
      //     bankName: params.bankName,
      //     bankCode: params.bankCode,
      //     areaId: params.areaId,
      //     effectiveDate: params.effectiveDate,
      //     uneffectiveDate: params.uneffectiveDate,
      //     remark: params.remark
      //   }).then(res => {
      //     if (res) {
      //       showMessage('success', '添加成功！')
      //       this.reset()
      //       this.fetch({ pageSize: this.pageInfo.pageSize, pageIndex: 1 })
      //     } else {
      //       showMessage('danger', '添加失败！')
      //     }
      //   })
      // },
      // 修改模板详情信息
      modifyBankTplContent (params) {
        return req('modifyBankTplContent', params).then(res => {
          if (res) {
            this.fetch(this.allParam)
            showMessage('success', '修改成功！')
            return res
          } else {
            showMessage('danger', '修改失败！')
            return false
          }
        })
      },
      // 获取模板表单信息
      // fetch (params = {}) {
      //   this.load()
      //   req('getBankTplList', params).then(res => {
      //     if (res) {
      //       Object.assign(this.table, res)
      //       this.loaded()
      //     }
      //   })
      // },
      // 添加行数据
      // @(PaginationMixin.beforeAdd)
      // addList (vm) {
      //   this.title = '银行报盘模板新增'
      //   Object.assign(this.form, {
      //     bankTemplateId: null,
      //     bankTemplateName: null,
      //     bankName: null,
      //     bankCode: null,
      //     areaId: null,
      //     effectiveDate: '',
      //     uneffectiveDate: new Date('9999-12-31 00:00:00'),
      //     remark: ''
      //   })
      //   if (this.editorStatus === '2') {
      //     let selected = vm.getMultipleSelection()[0]
      //     this.bankTplModifyLoading = true
      //     this.getBankTplById(selected.bankTemplateId)
      //       .then(res => {
      //         Object.assign(this.form, {
      //           bankTemplateId: null,
      //           bankTemplateName: res.bankTemplateName,
      //           bankName: res.bankName,
      //           bankCode: res.bankCode,
      //           areaId: res.areaId,
      //           effectiveDate: res.effectiveDate ? new Date(res.effectiveDate) : '',
      //           uneffectiveDate: res.uneffectiveDate ? new Date(res.uneffectiveDate) : '',
      //           remark: res.remark
      //         })
      //         this.bankTplModifyLoading = false
      //       })
      //   }
      //   this.previewMode = false
      //   this.isShowDialog = true
      // },
      // 修改行数据
//       @(PaginationMixin.beforeModify)
//       modifyRow (scope) {
//         this.title = '银行报盘模板修改'
// //        Object.assign(this.form, {
// //          bankTemplateId: scope.bankTemplateId,
// //          bankTemplateName: scope.bankTemplateName,
// //          bankName: scope.bankName,
// //          bankCode: scope.bankCode,
// //          areaId: scope.areaId,
// //          effectiveDate: scope.effectiveDate,
// //          uneffectiveDate: scope.uneffectiveDate,
// //          remark: scope.remark
// //        })
//         this.bankTplModifyLoading = true
//         this.getBankTplById(scope.bankTemplateId)
//           .then(res => {
//             Object.assign(this.form, {
//               bankTemplateId: res.bankTemplateId,
//               bankTemplateName: res.bankTemplateName,
//               bankName: res.bankName,
//               bankCode: res.bankCode,
//               areaId: res.areaId,
//               effectiveDate: res.effectiveDate ? new Date(res.effectiveDate) : '',
//               uneffectiveDate: res.uneffectiveDate ? new Date(res.uneffectiveDate) : '',
//               remark: res.remark
//             })
//             this.$refs['BankTplModify'].setDateDisabled()
//             this.bankTplModifyLoading = false
//           })
//         this.previewMode = true
//         this.isShowDialog = true
//       },
      // 删除行数据
      // deleteRow (scope) {
      //   confirmPopover('warning', '确认删除该项吗？', () => {
      //     req('delBankTpl', {bankTemplateId: scope.bankTemplateId}).then(res => {
      //       if (res) {
      //         showMessage('success', '删除成功！')
      //         this.resetAllParam(1)
      //         this.fetch(this.allParam)
      //       } else {
      //         showMessage('danger', '删除失败！')
      //       }
      //     })
      //   })
      // },
      // 银行报盘模板id查询
      // getBankTplById (bankTemplateId) {
      //   return req('getBankTplById', { bankTemplateId })
      // },
      // 模板详情修改
      setTpl ({ row }) {
        this.currentBankTemplateId = row.bankTemplateId
        this.isShowTplSettingDialog = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
