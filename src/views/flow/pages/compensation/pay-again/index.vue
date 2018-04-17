<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      @submit="sendAll"
      :processType="processType"
      @jurConfig="handleJurConfig">

      <section class="content-follow" slot="payAgain" >
        <div v-if="showMap.payAgainTable">
          <h2 class="info-title">再次支付流程</h2>
          <div>
          <i-table
          :table="table"
          ref="table"
          @save="saveData"
          @clone="getTableClone"
          >
          <template slot="table" slot-scope="tableScope">
            <el-table
            :data="tableScope.clone"
            style="width: 100%"
            @row-click="rowClickHandler(tableScope, $event)">
              <el-table-column
                label="序号"
                align="center"
                type="index"
                width="55">
              </el-table-column>
              <el-table-column
                v-for="(col, idx) of table.columns || []"
                :key="idx"
                :prop="col.prop"
                :label="col.label"
                :align="col.align"
                :formatter="tableScope.formatter"
                :width="col.width"
                v-if="col.label"
                >
                <template slot-scope="scope">
                  <i-table-cell
                    :row="scope.row"
                    :col="col.prop"
                    :table="tableScope"
                    ref="cell"
                  >
                  </i-table-cell>
                </template>
              </el-table-column>

              <!-- <el-table-column label="止付附件" prop="stopFileList" align="center">
                <template slot-scope="scope">
                  <i-upload
                    mode="table"
                    type="text"
                    :previewMode= true
                    :fileList="scope.row.stopFile"
                    @onRemove="handleFileRemove($event, scope.row)"
                    @onSuccess="handleUploadSuccess($event, scope.row)"
                    @onError="onError"
                    @onChange="onChange">
                  </i-upload>
                </template>
              </el-table-column> -->

              <el-table-column prop="unblockedReason" label="解冻原因">
                <template slot-scope="scope">
                  <i-table-cell
                    :row="scope.row"
                    col="unblockedReason"
                    :table="tableScope"
                    :formatter="tableScope.formatter"
                    v-if="scope.row.show"
                    @change="cellChange"
                  />
                  <el-input
                  v-if="!scope.row.show"
                  v-model="scope.row.unblockedReason">
                    <i slot="suffix" class="el-input__icon el-icon-error" @click="changeStyle(scope.row)"></i>
                  </el-input>
                </template>
              </el-table-column>

              <el-table-column label="申请附件" prop="fileListInfo" align="center">
                <template slot-scope="scope">
                  <i-upload
                    mode="table"
                    type="text"
                    :previewMode="previewMode && disabledMap.payAgainTable"
                    :fileList="scope.row.fileList"
                    @onRemove="handleFileRemove($event, scope.row)"
                    @onSuccess="handleUploadSuccess($event, scope.row)"
                    @onError="onError"
                    @onChange="onChange">
                  </i-upload>
                </template>
              </el-table-column>

              <i-table-operator v-if="showMap.delButton" :table="tableScope" scope/>
            </el-table>
          </template>
        </i-table>
        <i-dialog
          v-model="isShowDialog"
          title='选择已止付的记录'
          :toolbar="editToolbar"
          size="huge"
          destroyedWhenClose
          >
              <stop-list ref="stopPayList"></stop-list>
          </i-dialog>
          </div>
        </div>
      </section>
    </i-process-flow>
  </div>
</template>
<script>
  import ButtonGroup from 'components/flow/button-group'
  import BasicInfo from 'components/flow/basic-info'
  import ISelect from 'components/common/i-select/i-select'
  import Editor from 'components/employee/editor'
  import IProcessFlow from 'components/common/i-process-flow'
  import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import IUpload from 'components/common/upload/uploader'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import StopList from './stopPay-list'
  import req from 'api/compensation/check-give/frozen-history'
  import { confirmPopover, showMessage } from 'utils/index'

  export default {
    name: 'UrgentStopPay',
    components: {
      ButtonGroup,
      BasicInfo,
      ISelect,
      Editor,
      IProcessFlow,
      IPersonnelSelect,
      IDialog,
      ITable,
      ITableCell,
      IUpload,
      StopList
    },
    data () {
      return {
        isShow: false,
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', align: 'center' },
            { prop: 'fullName', label: '姓名', align: 'center' },
            { prop: 'companyName', label: '发薪主体', align: 'left' },
            { prop: 'groupName', label: '薪资组', align: 'left' },
            { prop: 'scopePersonnel', label: '人事范围', align: 'left' },
            { prop: 'payMonth', label: '薪资月份', align: 'center' },
            { prop: 'blockedValue', label: '止付金额', align: 'right', display: {mixin: (row, col) => this.currencyFormat(row[col])} },
            { prop: 'createDate', label: '止付时间', align: 'center', width: '200' },
            { prop: 'blockedReason', label: '止付原因', align: 'left', display: {dict: 'BLOCKED_REASON'} },
            { prop: 'stopFileList', align: 'center' },
            { prop: 'unblockedReason', display: {dict: 'UNBLOCKED_REASON'} },
            { prop: 'fileListInfo', align: 'center' }
          ], // 表头
          setting: {
            // import: {
            //   business: '',
            //   show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            // },
            editor: {
              employeeCode: {
                disable: true
              },
              fullName: {
                disable: true
              },
              companyName: {
                disable: true
              },
              groupName: {
                disable: true
              },
              scopePersonnel: {
                disable: true
              },
              payMonth: {
                disable: true
              },
              blockedValue: {
                disable: true
              },
              createDate: {
                disable: true
              },
              blockedReason: {
                disable: true
              },
              unblockedReason: {
                type: 'select',
                rules: [{ required: true, message: '请选择支付原因', trigger: 'change' }]
              }
            },
            toolbar: [{
              text: '添加',
              func: this.addPayAgain,
              show: () => {
                return { disable: this.disabledMap.addButton, empty: !this.showMap.addButton } // 按钮权限控制
              }
            }],
            operator: [{
              text: '删除',
              type: 'danger',
              func: this.deleteRow,    // 与 toolbar 类似，在 func 绑定相应的方法
              show: () => {
                return { disable: this.disabledMap.delButton, empty: !this.showMap.delButton } // 按钮权限控制
              }
            }]
          },
          editable: true,
          data: [] // 占位符，用于挂载数据
        },
        // 选择页面
        editToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          }, {
            text: '确定',
            func: done => {
              this.handleSave(done)
            }
          }
        ],
        empEmployeeId: this.$route.query.empEmployeeId,
        taskId: this.$route.query.taskId,
        taskKey: this.$route.query.taskKey,
        processType: this.$route.query.processType,
        filln: '',
        dict: {},
        curRow: {},
        itable: null,
        isShowDialog: false,
        checkData: [],
        stopData: null
      }
    },
    created () {
      /** 从url中截取id数组 */
      let params = window.location.href.split('?')[1].split('&')
      params.map(item => {
        let arr = item.split('=')
        if (arr[0] === 'arr') {
          this.checkData = JSON.parse(decodeURIComponent(arr[1]))
        }
      })
      if (this.checkData.length) {
        req('putRefreshFrozen', this.checkData).then(res => {
          res.forEach(item => {
            item.fileList = []
            item.show = true
          })
          this.table.data = res
        })
      }
      if (this.$route.query.taskKey) {
        this.previewMode = true
      }
    },
    methods: {
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      /** 传值 */
      postFlow () {
        this.$refs.table.saveData()
        console.log(this.stopData)
        return this.stopData
      },
      /** 赋值给审批人界面 */
      fillIn (data) {
        this.table.data = data
      },
      /** 权限配置完成事件 */
      handleJurConfig (showMap, disabledMap) {
        this.setTableDisabled(disabledMap)
      },

      /** 设置表格是否可编辑 */
      setTableDisabled (disabledMap) {
        this.table.setting.toolbar = disabledMap.payAgainTable ? [] : this.table.setting.toolbar
        this.table.disable = disabledMap.payAgainTable
      },
      sendAll () {
        console.log(this.$refs.table.clone.data)
      },
      /** 选取完成 */
      handleSave (done) {
        let transferData = this.$refs.stopPayList.unblockList
        const loop = transferData.every(item => {
          return item.paymentStatus === '02'
        })
        if (!loop) {
          return showMessage('danger', '只有止付状态才能解冻！')
        }
        // 给每一个新加入的数据的支付原因输入方式给一个初始值
        transferData.forEach(item => {
          item.fileList = []
          item.show = true
        })
        const tableData = this.table.data
        /** 去除重复数据 */
        if (tableData.length) {
          transferData = transferData.filter(item => {
            for (let newItem of tableData) {
              if (item.employeeCode === newItem.employeeCode) {
                return false
              }
            }
            return true
          })
        }
        /** 合并去重后的数据 */
        this.table.data = [...tableData, ...transferData]
        done()
      },
      handleCancel (done) {
        done()
      },
      addPayAgain () {
        this.isShowDialog = true
      },
      /** 单行删除 */
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          this.table.data.splice(scope.$index, 1)
          showMessage('success', '删除成功！')
        })
      },
       /** 删除已上传数据 */
      handleFileRemove (file, row) {
        row.fileList = row.fileList.filter(fileId => {
          return fileId !== file.attachmentId
        })
      },
      /** 上传成功事件监听 */
      handleUploadSuccess (responseId, row) {
        row.fileList.push(responseId)
      },
      /** 根据下拉选择改变输入框 */
      cellChange (row) {
        if (row.col === 'unblockedReason' && row.val === '03') {
          row.row.show = false
          row.row.unblockedReason = ''
        }
      },
      // 得到表格数据
      getTableClone (data) {
        this.stopData = data
      },
      changeStyle (val) {
        val.show = true
        val.unblockedReason = ''
      }
    }
  }
</script>
<style lang="scss">
  .contract-new {
    .base {
      margin-left: 20px;
    }
    .rules {
      font-size: 12px;
      color: #ff4949;
      margin-left: 5px;
    }
    .info-content {
      .el-input {
        width: 300px;
      }
    }
    .uploaderForm {
      width: 800px;
    }
    #icon-error{
      margin-bottom: 10px;
      margin-left: 10xp;
    }
  }
</style>
