<template>
  <!-- 合同模板 -->
  <section class="contract-template">
    <!-- <div class="form-card card"> -->
    <i-layout>
      <i-form @search="search" @reset="reset" slot="header" v-if="accessMap.empContTmptSearch">
        <el-form-item label="合同模板名称">
          <el-input v-model="listParams.templateName" :maxlength="100"></el-input>
        </el-form-item>
        <!-- <el-form-item label="适用用工类型">
          <i-select parameter="EMPLOYEE_TYPE" v-model="listParams.employeeType" ></i-select>
        </el-form-item> -->
        <el-form-item label="合同类型">
          <i-select parameter="CONTRACT_TYPE" v-model="listParams.contractType" ></i-select>
        </el-form-item>
        <el-form-item label="状态">
          <i-select parameter="TEMPLATE_STATUS" v-model="listParams.status" ></i-select>
        </el-form-item>
      </i-form>
    <!-- </div> -->

      <div slot="section">
        <i-table
        :table="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
        >
          <template slot="table" slot-scope="tableScope">
            <el-table
             :data="tableScope.clone"
             tooltip-effect="dark"
             style="width: 100%"
             v-loading="contractLoading"
            :element-loading-text="$loadingText">
              <el-table-column type="selection" width="55" ></el-table-column>
              <el-table-column
                v-for="(item, idx) in table.columns"
                :key="idx"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :min-width="item.minWidth"
                show-overflow-tooltip
                :formatter="tableScope.formatter"
                :align="item.align"
                sortable
              ></el-table-column>
              <i-table-operator :table="tableScope" :width="180"></i-table-operator>
            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>

        <section>
      <i-dialog
       title="新建模板"
       v-model="visible.newTemplate"
       :close-on-click-modal="false"
       :destroyedWhenClose="true">
        <editor
         defaultMsg="请输入合同模板内容"
         :config="config"
         editorId="new"
         @templateContent="postTemplate"
         @cancel="visible.newTemplate=false"
         ref="newTemplate"></editor>
      </i-dialog>
      <i-dialog
       title="修改合同模板"
       v-model="visible.showTemplate"
       :close-on-click-modal="false"
       :destroyedWhenClose="true">
        <editor
         :defaultMsg="defaultMsg"
         :config="config"
         editorId="editorId"
         @templateContent="putTemplate"
         @cancel="visible.showTemplate=false"></editor>
      </i-dialog>
      <i-dialog title="打印合同模板" v-model="visible.printTemplate">
        <editor
          :defaultMsg="defaultMsg"
          :fill="false"
          :config="print"
          editorId="print"
          @templateContent="visible.showTemplate=false"
          @cancel="visible.showTemplate=false"
          :btn="false"></editor>
      </i-dialog>
      <i-dialog title="查看模板" v-model="visible.changeTemplate" v-if="showContent">
          <article class="checkTemplate" style="margin-bottom: 10px">
            <section>
              <h2 class="contract-title">合同模板名称: <span class="contract-title-content" v-text="showContent.templateName"/></h2>
            </section>
            <section>
              <h2 class="contract-title">合同模板内容: </h2>
              <p v-html="showContent.templateContent" />
              <!-- <editor :defaultMsg="showContent" :fill="false" :config="print" editorId="look" @templateContent="visible.showTemplate=false" @cancel="visible.showTemplate=false"></editor>               -->
            </section>
          </article>
        </i-dialog>
    </section>
  </section>
</template>
<script>
  // const table = require('../../guarantor/guarantor-info/mock-data')
  import req from 'api/employee/contract'
  import ISelect from 'components/common/i-select/i-select'
  import IForm from 'components/common/i-form/i-form'
  import ITable from 'components/common/i-table/index.vue'
  import ILayout from 'components/common/i-layout'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import {formatTableDate} from 'utils/employee.js'
  import Editor from 'components/employee/editor'
  import access from 'mixins/access'
  import template from './template.js'
  export default {
    components: {
      ISelect,
      IForm,
      ITable,
      ILayout,
      Editor,
      IDialog
    },
    mixins: [access],
    data () {
      return {
        template,
        currentPage: 1,
        pageSize: 5,
        contractLoading: false,
        // 合同表单
        listParams: {
          contractType: '',
          templateName: '',
          status: ''
          // employeeType: ''
        },
        visible: {
          newTemplate: false,
          printTemplate: false,
          showTemplate: false,
          stopTemplate: false,
          changeTemplate: false,
          deleteTemplate: false,
          startTemplate: false
        },
        optionsValue: '',
        statusValue: '',
        table: {
          columns: [
            { prop: 'templateName', label: '合同模板名称', minWidth: 150 },
            { prop: 'contractType', label: '合同类型', width: 150, display: {dict: 'CONTRACT_TYPE'} },
            { prop: 'status', label: '状态', width: 100, display: {dict: 'TEMPLATE_STATUS'}, align: 'center' },
            { prop: 'beginDate', label: '启用时间', width: 120, align: 'center', display: {date: ''} },
            { prop: 'endDate', label: '停用时间', width: 120, align: 'center', display: {date: ''} }
          ],
          showPagebar: true,
          data: null,
          search: null,
          info: null,
          total: 0,
          setting: {
            toolbar: [{
              type: 'primary',
              text: '新建模板',
              key: 'empContTmptCerate',
              func: () => {
                this.$router.push({
                  path: 'contract_template-editor',
                  query: {
                    id: 'new',
                    print: 'false',
                    read: 'false'
                  }
                })
                // this.visible.newTemplate = true
              }
            }],
            // export: {
            //   req: config.getContractList,
            //   key: 'empContTmptExport'
            // },
            operator: [{
              text: '修改',
              key: 'empContTmptUpdate',
              // func: this.showTemplate,
              func: (row) => {
                this.$router.push({
                  path: 'contract_template-editor',
                  query: {
                    id: row.empTemplateId,
                    print: 'false',
                    read: 'false'
                  }
                })
              },
              show (row) {
                if (row.status === '1') return { empty: true }
              }
            }, {
              text: '禁用',
              key: 'empContTmptDisable',
              func: this.putTemplateDisable,
              show (row) {
                if (row.status !== '1') return { empty: true }
              }
            }, {
              text: '启用',
              key: 'empContTmptEnable',
              func: this.putTemplateEnable,
              show (row) {
                if (row.status === '1') return { empty: true }
              }
            }, {
              text: '查看',
              key: 'empContTmptDetail',
              // func: this.look,
              func: (row) => {
                this.$router.push({
                  path: 'contract_template-editor',
                  query: {
                    id: row.empTemplateId,
                    print: 'false',
                    read: 'true'
                  }
                })
              },
              show (row) {
                if (row.status === '0') return { empty: true }
              }
            }, {
              text: '删除',
              key: 'empContTmptDelete',
              func: this.deleteTemplate,
              show (row) {
                if (row.status !== '0') return { empty: true }
              }
            }, {
              text: '打印',
              key: 'empContTmptPrint',
              // func: this.printTemplate,
              func: (row) => {
                this.$router.push({
                  path: 'contract_template-editor',
                  query: {
                    id: row.empTemplateId,
                    print: 'true',
                    read: 'false'
                  }
                })
              },
              show (row) {
                if (row.status !== '1') return { empty: true }
              }
            }]
          }
        },
        // 新建模板的参数
        newTemplateParams: null,
        contractList: null,
        // editor的参数
        defaultMsg: '',
        editorId: '',
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 500
        },
        print: {
          initialFrameWidth: null,
          initialFrameHeight: 500,
          toolbars: [['print']]
        },
        showContent: null
      }
    },

    computed: {
      employmentType () {
        return this.newTemplateParams.employmentType
      }
    },
    // created () {
    //   this.getTemplateList({...this.listParams, pageIndex: 1, pageSize: 10})
    // },

    mounted () {
      this.search()
    },
    methods: {
      handleSizeChange (options) {
        this.getTemplateList(options)
      },

      handleCurrentChange (options) {
        this.getTemplateList(options)
      },

      // 获取合同模板列表
      getTemplateList (listParams) {
        this.contractLoading = true
        req('getContractList', listParams)
        .then(data => {
          this.contractList = data
          Object.keys(data).map(key => (this.table[key] = data[key]))
          formatTableDate(this.table.data, ['endDate', 'beginDate'])
          this.contractLoading = false
        })
        .catch(err => {
          console.log(err)
          this.contractLoading = false
        })
      },

      // 新建合同模板
      postTemplate (data) {
        this.newTemplateParams = data
        req('postContractTemplate', this.newTemplateParams)
        .then(data => {
          this.$message('新建模板成功')
          this.visible.newTemplate = false
          let info = {
            pageIndex: this.table.info.pageIndex,
            pageSize: this.table.info.pageSize
          }
          this.getTemplateList({...info, ...this.listParams})
          this.$refs.newTemplate.reset()
        })
        .catch(err => console.log(err))
      },

      // 修改合同模板
      putTemplate (data) {
        data.empTemplateId = this.editorId
        req('putTemplate', data)
        .then(data => {
          this.$message('修改成功')
          this.visible.showTemplate = false
          let info = {pageIndex: this.table.info.pageIndex, pageSize: this.table.info.pageSize}

          this.getTemplateList({...this.listParams, ...info})
        })
        .catch(err => {
          this.$message(err + '修改不成功')
        })
      },

      // 查看合同模板
      look (item) {
        let templateId = item.empTemplateId

        req('showTemplate', {templateId})
        .then(data => {
          data.templateContent = data.templateContent.replace(/_ueditor_page_break_tag_/g, '<div style="page-break-after: always;"></div>')
          this.showContent = data
          this.visible.changeTemplate = true
        })
        .catch(err => console.log(err))
      },

      // 查看合同模板内容
      showTemplate (item) {
        let templateId = item.empTemplateId

        this.editorId = templateId
        req('showTemplate', {templateId})
        .then(data => {
          data.templateContent = data.templateContent.replace(/_ueditor_page_break_tag_/g, '<p style="page-break-after: always;"><i style="display:none">1111</i></p>')
          this.defaultMsg = data
          this.visible.showTemplate = true
        })
        .catch(err => console.log(err))
      },

      // 打印合同模板
      printTemplate (item) {
        let templateId = item.empTemplateId

        this.editorId = templateId
        req('showTemplate', {templateId})
        .then(data => {
          data.templateContent = data.templateContent.replace(/#·{.+?}#·/g, '               ')
          data.templateContent = data.templateContent.replace(/_ueditor_page_break_tag_/g, '<p style="page-break-after: always;"><i style="display:none">1111</i></p>')
          this.defaultMsg = data
          this.visible.printTemplate = true
        })
      },

      // 启用合同模板
      putTemplateEnable (item) {
        this.disableOrEnable(item, '启用', 'putTemplateEnable')
      },

      // 停用合同模板
      putTemplateDisable (item) {
        this.disableOrEnable(item, '停用', 'putTemplateDisable')
      },

      // 删除合同模板
      deleteTemplate (item) {
        this.disableOrEnable(item, '删除', 'deleteTemplate')
      },

      // 停用/启用
      disableOrEnable (item, title, reqcontent) {
        let templateId = item.empTemplateId

        this.$confirm(`确定${title}该合同吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          req(reqcontent, {templateId})
          .then(data => {
            this.$message(`${title}成功`)
            let info = {
              pageIndex: this.table.info.pageIndex,
              pageSize: this.table.info.pageSize
            }
            this.getTemplateList({...info, ...this.listParams})
          })
          .catch(err => console.log(err))
        })
      },

      // 重置搜索条件
      reset () {
        this.props(this.listParams)
      },

      // 重置对象
      props (obj, arr) {
        Object.keys(obj).forEach((item) => {
          (!arr || (arr && arr.indexOf(item) === -1)) && (obj[item] = '')
        })
      },

      // 表单查询
      search () {
        this.table.search = { ...this.listParams }
      }
    }
  }

</script>

<style lang="scss" scoped media="print">
  .contract-template {
    .contract-title {
      font-size: 20px;
      margin:  20px 5px;;
      span {
        padding-left: 20px;
      }
    }
  }
  @page {
      size: auto;  /* auto is the initial value */
      margin: 0mm; /* this affects the margin in the printer settings */
    }
    .checkTemplate{
      padding:20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      min-width: 600px;
      min-height: 500px;
    }
</style>
