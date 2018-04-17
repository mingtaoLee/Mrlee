<template>
  <!-- 证明模板维护 -->
  <section class="contract-template">
    <!-- <div class="form-card card"> -->
    <i-layout>
      <i-form
       @search="search"
       @reset="reset"
       slot="header"
       v-if="accessMap.empPrintTemplateGet">
        <el-form-item label="模板名称">
          <el-input v-model="listParams.templateName" :maxlength="100" ></el-input>
        </el-form-item>
        <!-- <el-form-item label="适用用工类型">
          <i-select parameter="EMPLOYEE_TYPE" v-model="listParams.employeeType" ></i-select>
        </el-form-item> -->
        <el-form-item label="模板类型">
          <!-- <i-select parameter="TEMPLATE_TYPE" v-model="listParams.templateType" ></i-select> -->
          <el-select v-model="listParams.templateType"  clearable>
             <el-option
               :label="item.label"
               :value="item.value"
               v-for="(item,idx) in templateList"
               :key="idx">
             </el-option>
          </el-select>

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
             v-loading="templateLoading"
             :element-loading-text="$loadingText">
             <el-table-column type="selection" width="55"></el-table-column>
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
               sortable>
             </el-table-column>
             <i-table-operator :width="200" :table="tableScope"></i-table-operator>
              <!-- <el-table-column
                label="操作"
                width="160"
                fixed="right"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="showTemplate(scope.row)"
                    v-if="scope.row.status == 0">
                    修改
                  </el-button>

                  <el-button
                    type="text"
                    size="small"
                    @click="putTemplateDisable(scope.row)"
                    v-if="scope.row.status == 1">
                    禁用
                  </el-button>

                  <el-button
                    type="text"
                    size="small"
                    @click="putTemplateEnable(scope.row)"
                    v-if="scope.row.status == 0 || scope.row.status != 1">
                    启用
                  </el-button>

                  <el-button
                    type="text"
                    size="small"
                    @click="look(scope.row)"
                    v-if="scope.row.status != 0">
                    查看
                  </el-button>

                  <el-button
                    type="text"
                    size="small"
                    @click="deleteTemplate(scope.row)"
                    v-if="scope.row.status == 0">
                    删除
                  </el-button>

                  <el-button
                    type="text"
                    size="small"
                    @click="printTemplate(scope.row)"
                    v-if="scope.row.status == 1" >
                    打印
                  </el-button>
                </template>
              </el-table-column> -->
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
        <Template
          defaultMsg="请输入模板内容"
          :config="config"
          editorId="new"
          @templateContent="postTemplate"
          @cancel="visible.newTemplate=false"
          ref="newTemplate">
        </Template>
      </i-dialog>

      <i-dialog
        title="修改模板"
        v-model="visible.showTemplate"
        :close-on-click-modal="false"
        :destroyedWhenClose="true">
        <Template
          :defaultMsg="defaultMsg"
          :config="config"
          editorId="editorId"
          @templateContent="putTemplate"
          @cancel="visible.showTemplate=false">
        </Template>
      </i-dialog>

      <i-dialog title="打印模板" v-model="visible.printTemplate">
        <Template
          :defaultMsg="defaultMsg"
          :fill="false"
          :config="print"
          editorId="print"
          @templateContent="visible.showTemplate=false"
          @cancel="visible.showTemplate=false"
          :btn="false">
        </Template>
      </i-dialog>

      <i-dialog title="查看模板" v-model="visible.changeTemplate" v-if="showContent">
        <article class="checkTemplate" style="margin-bottom: 10px">
          <section>
            <h2 class="contract-title">模板名称: <span class="contract-title-content" v-text="showContent.templateName"></span></h2>
          </section>
          <section>
           <h2 class="contract-title">模板内容: </h2>
           <p v-html="showContent.templateContent"></p>
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
  import reqList, {config} from 'api/employee/templateMaintain'
  import Template from 'components/employee/templateMaintain'
  import access from 'mixins/access'
  import template from './template.js'
  export default {
    components: {
      Template
    },
    mixins: [access],
    data () {
      return {
        templateLoading: false,
        template,
        currentPage: 1,
        pageSize: 5,
        // 合同表单
        listParams: {
          templateType: '',
          templateName: '',
          status: ''
        //   employeeType: ''
        },
        // 模板类型的数据字典
        templateList: [
          {
            label: '在职证明模板',
            value: '2'
          },
          {
            label: '薪资证明模板',
            value: '3'
          },
          {
            label: '工牌打印模板',
            value: '4'
          },
          {
            label: '离职证明模板',
            value: '5'
          }
        ],
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
            { prop: 'templateName', label: '模板名称', maxWidth: 150, align: 'center' },
            // { prop: 'employeeType', label: '适用用工类型', width: 150, display: {dict: 'EMPLOYEE_TYPE'} },
            { prop: 'templateType', label: '模板类型', width: 180, display: {dict: 'TEMPLATE_TYPE'} },
            { prop: 'status', label: '状态', width: 150, display: {dict: 'TEMPLATE_STATUS'}, align: 'center' },
            { prop: 'beginDate', label: '启用时间', width: 180, align: 'center', display: { date: '' } },
            { prop: 'endDate', label: '停用时间', width: 180, align: 'center', display: { date: '' } }
          ],
          showPagebar: true,
          data: null,
          search: null,
          info: null,
          total: 0,
          setting: {
            export: {
              config: {
                fileName: '证明打印模板',
                sync: {
                  page: true,
                  select: true,
                  all: false
                }
              },
              req: config.getTemplateList,
              key: 'empPrintTemplateExport'
            },
            toolbar: [{
              type: 'primary',
              key: 'empPrintTemplatePost',
              text: '新建模板',
              func: () => {
                this.visible.newTemplate = true
              }
            }],
            operator: [{
              text: '修改',
              key: 'empPrintTmptUpdate',
              func: this.showTemplate,
              show (row) {
                if (row.status === '1') return { empty: true }
              }
            }, {
              text: '禁用',
              key: 'empPrintTmptDisable',
              func: this.putTemplateDisable,
              show (row) {
                if (row.status !== '1') return { empty: true }
              }
            }, {
              text: '启用',
              key: 'empPrintTmptEnable',
              func: this.putTemplateEnable,
              show (row) {
                if (row.status === '1') return { empty: true }
              }
            }, {
              text: '查看',
              key: 'empPrintTmptDetail',
              func: this.look,
              show (row) {
                if (row.status === '0') return { empty: true }
              }
            }, {
              text: '删除',
              key: 'empPrintTmptDelete',
              func: this.deleteTemplate,
              show (row) {
                if (row.status !== '0') return { empty: true }
              }
            }, {
              text: '打印',
              key: 'empPrintTemplatePrint',
              func: this.printTemplate,
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
    created () {
      // this.listParams.pageIndex = 1
      // this.listParams.pageSize = 10
      // this.getTemplateList(this.listParams)
    },
    mounted () {
      this.search()
    },

    methods: {
      // 改变页数页码，获取对应的列表
      handleSizeChange (options) {
        this.getTemplateList(options)
      },

      // 改变页数页码，获取对应的列表
      handleCurrentChange (options) {
        this.getTemplateList(options)
      },

       // 获取证明打印维护模板列表
      getTemplateList (listParams) {
        this.templateLoading = true
        reqList('getTemplateList', listParams)
        .then(data => {
          this.contractList = data
          Object.keys(data).map(key => (this.table[key] = data[key]))
          // console.log(this.table.data)
          this.templateLoading = false
          // 设置
        })
        .catch(err => console.log(err))
      },

       // 新建模板
      postTemplate (data) {
        this.newTemplateParams = data
        // console.log(this.newTemplateParams)
        reqList('postNewTemplate', this.newTemplateParams)
        .then(data => {
          this.$message('新建模板成功')
          this.visible.newTemplate = false
          this.getTemplateList(this.listParams)
          this.$refs.newTemplate.reset()
          // this.$message('新建模板成功')
        })
        .catch(err => console.log(err))
      },

       // 修改模板
      putTemplate (data) {
        data.empTemplateId = this.editorId
        req('putTemplate', data)
        .then(data => {
          this.$message('修改成功')
          this.visible.showTemplate = false
          this.getTemplateList(this.listParams)
        })
        .catch(err => {
          this.$message(err + '修改不成功')
        })
      },

       // 查看模板
      look (item) {
        let templateId = item.empTemplateId

        req('showTemplate', {templateId})
        .then(data => {
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
          this.defaultMsg = data
          // console.log('show', this.editorId)
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
          data.templateContent = data.templateContent.replace(/{.+?}/g, '               ')
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

       // 删除模板
      deleteTemplate (item) {
        this.disableOrEnable(item, '删除', 'deleteTemplate')
      },

       // 停用或者禁用操作
      disableOrEnable (item, title, reqcontent) {
        let templateId = item.empTemplateId

        this.$confirm(`确定${title}该模板吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          req(reqcontent, {templateId})
          .then(data => {
            this.$message(`${title}成功`)
            this.getTemplateList(this.listParams)
          })
          .catch(err => console.log(err))
        })
      },

       // 重置
      reset () {
        this.props(this.listParams)
        console.log(this.listParams)
      },

      // 重置搜索条件
      props (obj, arr) {
        Object.keys(obj).forEach((item) => {
          (!arr || (arr && arr.indexOf(item) === -1)) && (obj[item] = '')
        })
      },

       // 查找
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
