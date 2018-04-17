<template>
  <section class="pers-certification lx-print-dialog">
     <!-- 证明查询 -->
    <!-- <div class="form-card card"> -->
    <i-layout>
      <i-form
      @reset="reset"
      @search="search"
      slot="header"
      v-if="accessMap.empPrintGet">
        <el-form-item label="姓名">
          <el-input v-model="listParams.employeeName" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="listParams.employeeCode" :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="申请打印类型">
           <!-- <i-select v-model="listParams.printType"  ></i-select> -->
           <el-select v-model="listParams.printType" clearable>
                <el-option
               :label="item.label"
               :value="item.value"
               v-for="(item,idx) in templateList"
               :key="idx">
                </el-option>
              </el-select>
        </el-form-item>

        <el-form-item label="人事范围名称">
          <remote-select 
              v-model="listParams.personnelGroupCode" 
              clearable 
              dataKey="personnelGroup"
              :extraParams="extraParams"
              :props="personnelProps"
              :hasPower="Y"
            >
            </remote-select>
        </el-form-item>
      </i-form>
    <!-- </div> -->
      <!-- 证明表格 -->
      <div slot="section">
        <i-table
         :table="table"
         @pageSizeChange="handleSizeChange"
         @pageIndexChange="handleCurrentChange"
         >
          <template slot="table" slot-scope="tableScope">
            <el-table
              ref="multipleTable"
              :data="tableScope.clone"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              v-loading="certificationLoading"
               :element-loading-text="$loadingText"
              >
              <el-table-column type="selection" width="55" />
              <el-table-column
                v-for="(item, idx) in table.columns"
                :key="idx"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :formatter="tableScope.formatter"
                :fixed="item.fixed"
                :align="item.align"
                sortable>
              </el-table-column>

              <i-table-operator :width="100" :table="tableScope"></i-table-operator>

            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>

      <!-- 打印 -->
      <i-dialog title="证明打印" v-model="dialogTableVisible">
        <editor
          :defaultMsg="content"
          :fill="false"
          :config="print"
          editorId="printCertification"
          @templateContent="dialogTableVisible=false"
          @cancel="dialogTableVisible=false"
          :btn="false">
        </editor>
      </i-dialog>

      <!-- 批量打印 -->
      <i-dialog 
        class="PrintDialog"
        title="证明打印批量打印"
        v-model="weatherShowPrintDialog"
        :toolbar="batchPrintDialogToolbar"
        @close="handlerClose">
        <div class="printBox" ref="printBox">
          <iframe v-if="weatherShowPrintDialog" id="printIframe" ref="printIframe" frameborder="0" scrolling="no" height="100%"></iframe>
          <!-- <div class="printArea" v-for="item of batchPrintContent" :key="item" v-html="item"></div> -->
        </div>
      </i-dialog>
  </section>
</template>

<script>
import { uploaderLinks } from 'api/common/upload'
import { getToken } from 'utils/auth'
import req from 'api/employee/personal'
import Editor from 'components/employee/editor'
import access from 'mixins/access'
import RemoteSelect from 'components/compensation/remote-select'

export default {
  components: {
    Editor,
    RemoteSelect
  },
  mixins: [access],
  data () {
    return {
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
        }
      ],
      templateTypeList: [],
      listParams: {
        employeeName: '',
        employeeCode: '',
        printType: '',
        personnelGroupCode: ''
      },
      // 表格
      table: {
        columns: [
          { prop: 'employeeCode', label: '工号', width: 100, fixed: 'left' },
          { prop: 'employeeName', label: '姓名', width: 100, fixed: 'left' },
          { prop: 'personnelGroupCode', label: '人事范围编码', width: 140, align: 'center' },
          { prop: 'personnelGroupName', label: '人事范围名称', width: 240 },
          { prop: 'orgPathName', label: '组织全称', width: 180, align: 'center' },
          { prop: 'printType', label: '申请打印类型', display: {dict: 'TEMPLATE_TYPE'}, align: 'center' },
          { prop: 'applicationDate', label: '申请日期', width: 200, display: { date: 'yyyy-MM-dd hh:mm:ss' }, align: 'center' }
        ],
        setting: {
          // 按钮
          toolbar: [
            {
              text: '新增',
              key: 'empPrintPost',
              type: 'primary',
              func: () => this.insertCertification()
            },
            {
              text: '批量打印',
              key: 'empPrintPost',
              type: 'primary',
              func: () => this.showBatchPrintDialog()
            }
          ],
          operator: [
            {
              text: '打印',
              key: 'empPrintPrint',
              func: this.editorCertification,
              show (row) {
                // 使用公司模板的才显示
                if (row.isUseTemplate === 'N') {
                  return { empty: true }
                }
              }
            }, {
              text: '下载',
              func: (row) => this.downLoad(row),
              show (row) {
                // 使用自定义模板的才显示
                if (row.isUseTemplate !== 'N') {
                  return { empty: true }
                }
              }
            }
          ]
        },
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },
      // 打印模态框
      dialogTableVisible: false,
      // 打印的内容
      content: '',
      print: {
        initialFrameWidth: null,
        initialFrameHeight: 500,
        toolbars: [['print']]
      },
      extraParams: {
        hasPower: 'Y'
      },
      personnelProps: {
        value: 'personnelGroupCode',
        label: 'personnelGroupName'
      },
      // 批量打印模态框
      weatherShowPrintDialog: false,
      batchPrintContent: [],
      selectedEmployee: [],
      // weatherShowPrintButton: false,
      batchPrintDialogToolbar: [
        {
          text: '取消',
          type: 'plain',
          func: (done) => {
            // this.weatherShowPrintButton = false
            done()
          }
        },
        {
          text: '打印',
          type: 'primary',
          func: (done) => {
            this.$nextTick(() => {
              this.doBatchPrint()
            })
            // done()
          }
          // hide: this.weatherShowPrintButton
        }
      ],
      certificationLoading: false
    }
  },
  mounted () {
    this.search()
    this.getTemplateList()
  },
  methods: {
    downLoad (row) {
      // console.log(row)
      const a = document.createElement('a')

      const href = `${uploaderLinks.download}?attachmentId=${row.attachmentId}&ihrAdminAuthorization=${getToken()}`
      // const href = `${uploaderLinks.download}?attachmentId=${row.attachmentId}`
      a.setAttribute('href', href)
      a.style.visibility = 'hidden'
      document.body.appendChild(a)

      a.click()
    },
     // 页数改变
    handleSizeChange (options) {
      this.getCertificationList(options)
    },
    // 改变当前页数
    handleCurrentChange (options) {
      this.getCertificationList(options)
    },
    // 获取证明打印列表
    getCertificationList (listParams) {
      this.certificationLoading = true
      req('getCertificationList', listParams)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(key => (this.table[key] = res[key]))
        this.certificationLoading = false
      })
      .catch(err => console.log(err))
    },
    // 获取证明打印维护模板列表
    getTemplateList (listParams) {
      req('getTemplateList', listParams)
        .then(data => {
          Object.keys(data).map(key => (this.templateTypeList[key] = data[key]))
        })
        .catch(err => console.log(err))
    },
    // 查询
    search () {
      this.table.search = { ...this.listParams }
    },

     // 重置
    reset () {
      //  新添加方法重置
      Object.keys(this.listParams).map(item => {
        this.listParams[item] = ''
      })
    },

    // ---------------------------------------------------------------------------------------------------
    // 选中列表的项
    handleSelectionChange (val) {
      this.selectedEmployee = val
    },

    // 新增
    insertCertification () {
      this.submitAction('employeeCertificateProcess', 'empFillIn')
    },

    // 打印
    editorCertification (row) {
      // 请求打印的内容
      req('getPintContent', {printId: row.empPrintId})
      .then(res => {
        res.templateContent = res.printContent.replace(/{.+?}/g, '               ')
        res.templateContent = res.templateContent.replace(/underline/g, 'none')
        this.content = res
        this.dialogTableVisible = true
      })
    },

     // 跳转流程
    submitAction (type, taskKey) {
      this.$store.commit('SET_FLOW_ACTION', {processType: type, taskKey: taskKey})
      this.$store.commit('FLOW_WINDOW_OPEN', '/flow.html#/flow/employeeCertificateProcess')
    },
    hid () {
      this.dialogTableVisible = false
    },
    // 打开批量打印弹窗
    async showBatchPrintDialog () {
      if (!this.selectedEmployee.length) {
        this.$message({
          message: '请您先选择需要打印证明的员工',
          type: 'warning'
        })
      } else {
        this.weatherShowPrintDialog = true
        this.batchPrintContent = []
        const arr = await this.getBatchPrintContent()
        // this.weatherShowPrintDialog = true
        arr.map(val => {
          this.selectedEmployee.map(val2 => {
            val.empPrintId === val2.empPrintId && this.batchPrintContent.push(val.printContent)
          })
        })
        this.addDomToIframe(this.batchPrintContent)
      }
    },
    // 给iframe添加需要打印的内容
    addDomToIframe (data) {
      let printIframe = document.getElementById('printIframe')
      let headDom = printIframe.contentDocument.head
      let bodyDom = printIframe.contentDocument.body
      printIframe.height = '100%'
      headDom.innerHTML = ''
      bodyDom.innerHTML = ''
      headDom.innerHTML += `<style media="print">@page{size:auto;margin:0mm}.printArea{width: 70%; margin-left: 15%;}</style>`
      data.map(val => {
        bodyDom.innerHTML += `<div class="printArea" style="page-break-after: always; margin-top: 50px;">${val}</div>`
      })
      printIframe.height = printIframe.contentDocument.body.scrollHeight + 'px'
      // this.weatherShowPrintButton = true
    },
    // handlerClose () {
    //   this.weatherShowPrintButton = false
    // },
    // 请求批量打印数据
    getBatchPrintContent () {
      return req('getBatchPrintContent', {})
      .then(res => {
        return res
      })
    },
    doBatchPrint () {
      let printIframe = document.getElementById('printIframe')
      printIframe.contentWindow.print()
    }
  }
  // beforeRouteLeave (to, from, next) {
  //   // 导航离开该组件的对应路由时调用
  //   // 可以访问组件实例 `this`
  //   console.log(from)
  //   if (from.fullPath === '/employee/employee/pers_certification') {
  //     console.log(this.dialogTableVisible)
  //     this.dialogTableVisible = false
  //     // this.hid()
  //   }
  //   next()
  // },
  // beforeDestroy () {
  //   this.dialogTableVisible = false
  // }
}
</script>

<style lang="scss" scoped>
#printIframe {
  width: 100%;
  min-height: 300px;
}
</style>
