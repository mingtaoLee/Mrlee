<template>
  <i-layout headerKey="cpsTemplateSelectGet">
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="模板名称">
        <el-input v-model="searchParam.iitTemplateName"></el-input>
      </el-form-item>
      <el-form-item prop="companyCode" label="报税主体">
        <remote-select
          v-model="searchParam.companyCode"
          dataKey="company"
          :props="remoteProps"
        ></remote-select>
      </el-form-item>
      <el-form-item label="生效开始日期">
        <el-date-picker
          v-model="searchParam.effectiveDate"
          type="date"
          @change="handleEffectiveDateChange"
          :picker-options="effectOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="失效结束日期">
        <el-date-picker
          v-model="searchParam.uneffectiveDate"
          type="date"
          @change="handleUneffectDateChange"
          :picker-options="uneffectOptions"
        >
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
              width="140"
              align="center"
              v-if="accessMap['cpsTemplateContent']"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="setTpl(scope)" size="mini">设置</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              prop="remark"
              width="200"
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
        <TaxTplModify
          :editorStatus="editorStatus" 
          :idKey="idKey" 
          :id="iitTemplateId"
          ref="TaxTplModify"
        ></TaxTplModify>
      </i-dialog>
      <i-dialog
        v-model="isShowTplSettingDialog"
        title="个税申报模板格式设置"
        size="large"
        :toolbar="tplSettingDetailEditToolbar"
        destroyedWhenClose
      >
        <TaxTplModify
          v-loading="tplSettingLoading"
          :element-loading-text="$loadingText"
          :form="formDetail"
          previewMode
          ref="TplSettingDetail"
        >
          <TaxTplFormatModify
            slot="tab"
            :form.sync="formDetail"
            ref="TaxTplFormatModify"
            @headListHandleSizeChange="headListPageInfoChange"
            @headListHandleCurrentChange="headListPageInfoChange"
            @bodyListHandleSizeChange="bodyListPageInfoChange"
            @bodyListHandleCurrentChange="bodyListPageInfoChange"
          ></TaxTplFormatModify>
        </TaxTplModify>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req, { config } from 'api/compensation/base-setting/report-form-templates'
  import TaxTplModify from './detail-edit'
  import TaxTplFormatModify from './tpl-detail-edit'
  import { showMessage, confirmPopover } from 'utils/index'
  // import { formatDate } from 'utils/organization'
  import RemoteSelect from 'components/compensation/remote-select'
  import companyReq from 'api/compensation'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import Access from 'mixins/access'

  export default {
    mixins: [PaginationMixin, SearchDateMixin, Access],
    components: {
      TaxTplModify,
      TaxTplFormatModify,
      RemoteSelect
    },
    data () {
      return {
        title: '个税申报模板',
        reqConfig: { req: req, getName: 'getTaxTplList', deleteName: 'delTaxTpl' },
        // 行id键值
        idKey: 'iitTemplateId',
        isTaxTplModifyLoading: false,
//        loading: true,
        searchParam: {
          iitTemplateName: '',
          areaId: '',
          companyName: '',
          companyCode: '',
          effectiveDate: null,
          uneffectiveDate: null
        },
        tplSettingLoading: true,
        companyApiConfig: {
          req: companyReq,
          name: 'getCompanies'
        },
        remoteProps: {
          value: 'companyCode',
          label: 'companyCode'
        },
        detailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: this.handleCancel(done)
          },
          {
            throttle: true,
            text: '确认',
            func: done => this.handleDataSave(done)
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
            { prop: 'iitTemplateName', label: '模板名称', width: '160', align: 'left' },
            // { prop: 'areaId', label: '区域', width: '160', align: 'left', display: {dict: 'dict'} },
            { prop: 'companyCode', label: '报税主体', width: '120', align: 'left' },
            { prop: 'effectiveDate', label: '生效日期', align: 'left', width: '120', display: {date: ''} },
            { prop: 'uneffectiveDate', label: '失效日期', align: 'left', width: '120', display: {date: ''} }
          ],
          setting: {
            operator: [
              {
                text: '修改',
                key: 'cpsTemplateUpdatePut',
                func: this.modifyRow
              },
              {
                text: '删除',
                key: 'cpsTemplateDelete',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '新增',
              key: 'cpsTemplateCreatePost',
              func: this.addPage
            }],
            import: {
              business: 'cps-iitTemplate',
              key: 'cpsTemplateImport',
              show: () => ({ empty: false })
            },
            export: {
              config: {
                fileName: '个税申报模板'
              },
              req: config.getTaxTplList,
              key: 'cpsTemplateExport',
              elTable: null
            }
          },
          data: [],
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        },

        form: {
          iitTemplateId: null,
          iitTemplateName: '',
          areaId: '',
          companyName: '',
          companyCode: '',
          effectiveDate: '',
          uneffectiveDate: '',
          remark: ''
        },
        formDetail: {}
      }
    },
    created () {
      // this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
    },
    methods: {
      // changeEffect () {
      //   this.form.effectiveDate = formatDate(this.form.effectiveDate).slice(0, 10)
      // },
      // changeUneffect () {
      //   this.form.uneffectiveDate = formatDate(this.form.uneffectiveDate).slice(0, 10)
      // },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleDataSave (done) {
        return new Promise((resolve, reject) => {
          this.$refs['TaxTplModify'].$refs['tax-tpl-modify'].validate((res) => {
            if (res) {
              let submitData
              if (this.form.iitTemplateId) {
                submitData = this.transformSubmitData(this.form)
                this.editTaxTpl(submitData).then(() => {
                  resolve(true)
                  done()
                }).catch(() => {
                  resolve(true)
                })
              } else {
                submitData = this.transformSubmitData(this.form)
                this.createTaxTpl(submitData).then(() => {
                  resolve(true)
                  done()
                }).catch(() => {
                  resolve(true)
                })
              }
            } else {
              reject(false)
            }
          })
        })
      },
      handleTplSave (done) {
        return new Promise((resolve, reject) => {
          let tableCell = this.$refs['TaxTplFormatModify'].$refs['tableCell'].filter(el => !el.validate())
          let mainCell = this.$refs['TaxTplFormatModify'].$refs['tableMainCell'].filter(el => !el.validate())
          // debugger
          if (tableCell.length > 0 || mainCell.length > 0) {
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
      //   this.$refs['TaxTplModify'].setUneffectiveDate(submitData)
      //   return submitData
      // },
      // 表头信息和主体信息的分页改变事件
      headListPageInfoChange (params) {
        params.iitTemplateId = this.formDetail.iitTemplateId
        this.getTaxTplContent(params)
      },
      bodyListPageInfoChange (params) {
        params.iitTemplateId = this.formDetail.iitTemplateId
        this.getTaxTplContent(params)
      },
      // 保存模板详情处理事件
      saveTplSettingDetail () {
        const tableData = this.$refs['TaxTplFormatModify'].getTableData()
        const data = Object.assign({}, this.formDetail, tableData)
        return this.modifyTaxTplContent(data)
      },
      // 编辑表单列表信息
      // editTaxTpl (params) {
      //   return req('editTaxTpl', params).then(res => {
      //     if (res) {
      //       showMessage('success', '修改成功！')
      //       this.fetch(this.allParam)
      //     } else {
      //       showMessage('danger', '修改失败！')
      //     }
      //   })
      // },
      // 创建表单列表信息
      // createTaxTpl (params) {
      //   return req('createTaxTpl', {
      //     iitTemplateName: params.iitTemplateName,
      //     areaId: params.areaId,
      //     companyName: params.companyName,
      //     companyCode: params.companyCode,
      //     effectiveDate: params.effectiveDate,
      //     uneffectiveDate: params.uneffectiveDate,
      //     remark: params.remark
      //   }).then(res => {
      //     if (res) {
      //       this.reset()
      //       this.fetch({ pageSize: this.pageInfo.pageSize, pageIndex: 1 })
      //       showMessage('success', '添加成功！')
      //     } else {
      //       showMessage('danger', '添加失败！')
      //     }
      //   })
      // },
      // 修改模板详情信息
      modifyTaxTplContent (params) {
        return req('modifyTaxTplContent', params).then(res => {
          if (res) {
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            showMessage('success', '修改成功！')
            return res
          } else {
            showMessage('danger', '修改失败！')
          }
        })
      },
      // 获取模板详情信息
      getTaxTplContent (params) {
        req('getTaxTplContent', params).then(res => {
          if (res) {
            res.effectiveDate = new Date(res.effectiveDate)
            res.uneffectiveDate = new Date(res.uneffectiveDate)
            // 表体添加虚拟prop，把itemContent赋值给itemContentFake，并于tax-tpl-format-modify处理
            res.bodyList.length > 0 && res.bodyList.forEach(v => {
              v.itemContentFake = v.itemContent
            })
            this.formDetail = res
            // Hack: 初始化数据时强制触发tableCell的change事件，以进行动态校验
            this.$refs['TaxTplFormatModify'].changeTableCellRules('tableMainCell')
            this.tplSettingLoading = false
          }
        })
      },
      // 获取模板表单信息
      // fetch (params = {}) {
      //   this.load()
      //   req('getTaxTplList', params).then(res => {
      //     if (res) {
      //       Object.assign(this.table, res)
      //       this.loaded()
      //     }
      //   })
      // },
      // getTaxTplById (iitTemplateId) {
      //   return req('getTaxTplById', { iitTemplateId })
      // },
      // 添加行数据
      // @(PaginationMixin.beforeAdd)
      // addList (vm) {
      //   this.title = '个税申报模板新增'
      //   Object.assign(this.form, {
      //     iitTemplateId: null,
      //     iitTemplateName: '',
      //     areaId: '',
      //     companyName: '',
      //     companyCode: '',
      //     effectiveDate: '',
      //     uneffectiveDate: new Date('9999-12-31 00:00:00'),
      //     remark: ''
      //   })
      //   if (this.editorStatus === '2') {
      //     let selected = vm.getMultipleSelection()[0]
      //     this.isTaxTplModifyLoading = true
      //     this.getTaxTplById(selected.iitTemplateId)
      //       .then(res => {
      //         Object.assign(this.form, {
      //           iitTemplateId: null,
      //           iitTemplateName: res.iitTemplateName,
      //           areaId: res.areaId,
      //           companyName: res.companyName,
      //           companyCode: res.companyCode,
      //           effectiveDate: res.effectiveDate ? new Date(res.effectiveDate) : '',
      //           uneffectiveDate: res.uneffectiveDate ? new Date(res.uneffectiveDate) : '',
      //           remark: res.remark
      //         })
      //         this.isTaxTplModifyLoading = false
      //       })
      //   }
      //   this.isShowDialog = true
      // },
      // 修改行数据
      // modifyRow (scope) {
      //   this.title = '个税申报模板修改'
      //   this.isTaxTplModifyLoading = true
      //   this.getTaxTplById(scope.iitTemplateId).then(res => {
      //     Object.assign(this.form, {
      //       iitTemplateId: res.iitTemplateId,
      //       iitTemplateName: res.iitTemplateName,
      //       areaId: res.areaId,
      //       companyName: res.companyName,
      //       companyCode: res.companyCode,
      //       effectiveDate: res.effectiveDate ? new Date(res.effectiveDate) : '',
      //       uneffectiveDate: res.uneffectiveDate ? new Date(res.uneffectiveDate) : '',
      //       remark: res.remark
      //     })
      //     this.$refs['TaxTplModify'].setDateDisabled()
      //     this.isTaxTplModifyLoading = false
      //   })
      //   this.isShowDialog = true
      // },
      // 删除行数据
      // deleteRow (scope) {
      //   confirmPopover('warning', '确认删除该项吗？这会删除该模板下的所有详情信息。', () => {
      //     req('delTaxTpl', {iitTemplateId: scope.iitTemplateId}).then(res => {
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
      // 模板详情修改
      setTpl ({ row }) {
        this.tplSettingLoading = true
        this.isShowTplSettingDialog = true
        this.getTaxTplContent({
          iitTemplateId: row.iitTemplateId
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
