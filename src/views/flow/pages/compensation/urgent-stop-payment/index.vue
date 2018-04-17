<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      @submit="sendAll"
      :postFlow="postFlow"
      :processType="processType"
      @jurConfig="handleJurConfig"
    >
    <section class="content-follow" slot="urgentStopPay">
      <div v-if="showMap.urgentStopTable">
        <h2 class="info-title">申请紧急止付</h2>
          <div>
            <i-table
              :table="table"
              ref="table"
              @save="saveData"
              @clone="getTableClone"
              @loaded="handleLoaded"
            >
              <template slot="table" slot-scope="tableScope">
                <el-table
                  :data="tableScope.clone"
                  style="width: 100%"
                  @row-click="rowClickHandler(tableScope, $event)"
                >
                  <el-table-column v-if="!previewMode" type="selection" width="55"></el-table-column>
                  <el-table-column
                    label="序号"
                    align="center"
                    type="index"
                    width="60"
                  ></el-table-column>
                  <el-table-column
                    prop="fullName"
                    label="姓名"
                    align='left'
                    min-width="80"
                  >
                    <template slot-scope="scope">
                      <i-table-cell
                        :table="tableScope"
                        :row="scope.row"
                        col="fullName"
                        :formatter="tableScope.formatter"
                        @change="changeData"
                      >
                        <el-input
                          v-model="scope.row.fullName"
                          @click.native="handleIconClick"
                          readonly
                        >
                          <i slot="suffix" class="el-input__icon iconfont icon-hr" @click.native="handleIconClick" ></i>
                        </el-input>
                        <i-personnel-select
                          :isShow.sync="isShow"
                          @confirm="handleConfirm"
                          :multiple="false"
                        ></i-personnel-select>
                      </i-table-cell>
                    </template>
                  </el-table-column>

                  <el-table-column
                    v-for="(col, idx) of table.columns || []"
                    :key="idx"
                    :prop="col.prop"
                    :label="col.label"
                    :align="col.align"
                    :formatter="tableScope.formatter"
                    :min-width="col.width"
                    v-if="col.label"
                  >
                    <template slot-scope="scope">
                      <i-table-cell
                        :row="scope.row"
                        :col="col.prop"
                        :table="tableScope"
                        ref="cell"
                        @change="changeData"
                      ></i-table-cell>
                    </template>
                  </el-table-column>

                  <el-table-column 
                    label="附件" 
                    prop="fileListInfo" 
                    align="center"
                    min-width="120"
                  >
                    <template slot-scope="scope">
                      <i-upload
                        mode="table"
                        type="text"
                        :previewMode="previewMode && disabledMap.urgentStopTable"
                        :fileList="scope.row.fileList"
                        @onRemove="handleFileRemove($event, scope.row)"
                        @onSuccess="handleUploadSuccess($event, scope.row)"
                        @onError="onError"
                        @onChange="onChange">
                      </i-upload>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </i-table>
          </div>
        </div>
      </section>
    </i-process-flow>
  </div>
</template>
<script>
import ISelect from 'components/common/i-select/i-select'
import reqflow from 'api/compensation/check-give/flow'
import req from 'api/compensation/check-give/salary-give'
import IProcessFlow from 'components/common/i-process-flow'
import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import IDialog from 'components/common/i-dialog/i-dialog'
import ITable from 'components/common/i-table'
import ITableCell from 'components/common/i-table-cell'
import { formatDate } from 'utils/organization'
import IUpload from 'components/common/upload/uploader'
import { getRule, showMessage } from 'utils/index'

export default {
  name: 'UrgentStopPay',
  components: {
    ISelect,
    IProcessFlow,
    IPersonnelSelect,
    IDialog,
    ITable,
    ITableCell,
    IUpload
  },
  data () {
    return {
      isShow: false,
      table: {
        columns: [
          { prop: 'fullName' },
          { prop: 'employeeCode', label: '工号', align: 'center', width: 120 },
          { prop: 'payCompanyName', label: '发薪主体', align: 'left', width: 120 },
          { prop: 'groupName', label: '薪资组', align: 'left', width: 120 },
          { prop: 'personnelGroupName', label: '人事范围', align: 'left', width: 120 },
          { prop: 'payMonth', label: '薪资月份', align: 'center', width: 100, display: { date: 'short' } },
          { prop: 'calculatedValue', label: '金额', align: 'right', width: 100, display: {mixin: (row, col) => this.currencyFormat(row[col])} },
          { prop: 'blockedReason', label: '止付原因', align: 'left', width: 100, display: {dict: 'BLOCKED_REASON'} },
          { prop: 'fileListInfo', align: 'center' }
        ], // 表头
        setting: {
          toolbar: [{
            text: '添加',
            func: vm => vm.createData({
              fullName: '',
              employeeCode: '',
              payCompanyName: '',
              personnelGroupName: '',
              payMonth: '',
              calculatedValue: '',
              blockedReason: '',
              fileList: [],
              paymentStatus: ''
            }),
            show: () => {
              return { disable: this.disabledMap.addButton, empty: !this.showMap.addButton } // 按钮权限控制
            }
          }, {
            text: '删除',
            type: 'danger',
            func: vm => vm.deleteData(),
            show: () => {
              return { disable: this.disabledMap.delButton, empty: !this.showMap.delButton } // 按钮权限控制
            }
          }],
          // 对每一列进行配置
          editor: {
            fullname: {
              rules: getRule('请选择员工姓名', 'change')
            },
            employeeCode: {
              disable: true
            },
            payCompanyName: {
              disable: true
            },
            groupName: {
              disable: true
            },
            personnelGroupName: {
              disable: true
            },
            calculatedValue: {
              disable: true
            },
            payMonth: {
              type: 'date',
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请选择月份'))
                  cb()
                }
              }],
              options: {
                type: 'month'
              }
            },
            blockedReason: {
              type: 'select',
              rules: getRule('请选择止付原因', 'change')
            }
          }
        },
        editable: true,
        data: []
      },
      empEmployeeId: this.$route.query.empEmployeeId,
      taskId: this.$route.query.taskId,
      taskKey: this.$route.query.taskKey,
      processType: this.$route.query.processType,
      curRow: {},
      itable: null,
      stopData: null,
      previewMode: false,
      fileList: [],
      urlData: [],
      processId: '',
      // 查询没有发放信息时的校验
      errorRule: [{ required: true,
        validator: (rule, value, cb) => {
          !value && cb(new Error('请选择月份'))
          cb(new Error('该月份无发放信息'))
        }
      }],
      // 查询发放信息存在,有金额时的校验
      rightRule: [{ required: true,
        validator: (rule, value, cb) => {
          !value && cb(new Error('请选择月份'))
          cb()
        }
      }]
    }
  },
  created () {
    if (this.$route.query.taskKey !== undefined) {
      this.previewMode = true
    }
    let params = window.location.href.split('?')[1].split('&')
    params.forEach(item => {
      let arr = item.split('=')
      if (arr[0] === 'arr') {
        this.urlData = JSON.parse(decodeURIComponent(arr[1]))
      } else if (arr[0] === 'processId') {
        this.processId = arr[1]
      }
    })
    if (this.urlData.length) {
      this.urlData.processId = this.processId
      req('getStopPayFlow', this.urlData).then(res => {
        this.table.data = res
        this.table.editable = false
      })
    }
  },
  methods: {
    // 传值
    postFlow () {
      this.$refs.table.saveData()
      return this.stopData
    },
    // 赋值给审批人界面
    fillIn (data) {
      this.table.data = data
    },
    /** 权限配置完成事件 */
    handleJurConfig (showMap, disabledMap) {
      this.setTableDisabled(disabledMap)
    },

    /** 设置表格是否可编辑 */
    setTableDisabled (disabledMap) {
      this.table.setting.toolbar = disabledMap.urgentStopTable ? [] : this.table.setting.toolbar
      this.table.disable = disabledMap.urgentStopTable
    },
    rowClickHandler ({ rowClickHandler }, row) {
      this.curRow = row
      // this.payForm = Object.assign(this.payForm, row)
      rowClickHandler(row)
    },
    handleIconClick () {
      this.isShow = !this.isShow
    },
    handleLoaded (vm) {
      this.itable = vm
    },
    delData (vm) {
    },
    // 触发表单校验
    triggerValidate () {
      this.$refs.cell.map(el => el.validate())
    },
    //  人员选择方法
    handleConfirm (selected) {
    //  选中的人员数组
      // 先判断选择员工是否存在发放过程
      const employeeId = selected[0].employeeId
      this.fetch({ employeeId: employeeId })
      if (this.curRow.payMonth && employeeId) {
        reqflow('geturgentStopMoney', { payMonth: formatDate(this.curRow.payMonth).slice(0, 7), employeeId: employeeId }).then(res => {
          this.curRow.calculatedValue = res.calculatedValue
          this.curRow.paymentStatus = res.paymentStatus
          this.curRow.processId = res.processId
          this.curRow.processRecordId = res.processRecordId
        })
        this.triggerValidate()
      }
    },
    fetch (options = {}) {
      reqflow('geturgentStopData', options)
      .then(res => {
        if (!res) {
          showMessage('warning', '该员工无发放过程,无法创建紧急止付,请重新选择')
          return false
        } else {
          this.curRow.employeeId = res.employeeId
          this.curRow.fullName = res.fullName
          this.curRow.employeeCode = res.employeeCode
          this.curRow.groupName = res.groupName
          this.curRow.payCompanyName = res.payCompanyName
          this.curRow.payCompanyCode = res.payCompanyCode
          this.curRow.personnelGroupName = res.personnelGroupName
          return true
        }
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
    // 监听表格数据变化
    changeData (val) {
      // 监听
      if (val.col === 'payMonth') {
        if (val.val && this.curRow.employeeId) {
          reqflow('geturgentStopMoney', { payMonth: formatDate(val.val).slice(0, 7), employeeId: val.row.employeeId }).then(res => {
            val.updateRules(this.rightRule, this.$refs.cell, 'payMonth')
            this.curRow.calculatedValue = res.calculatedValue
            this.curRow.paymentStatus = res.paymentStatus
            this.curRow.processId = res.processId
            this.curRow.processRecordId = res.processRecordId
          }).catch(err => {
            if (err) {
              val.updateRules(this.errorRule, this.$refs.cell, 'payMonth')
              this.curRow.calculatedValue = 0
            }
          })
        }
        this.curRow.payMonth = val.val
        this.triggerValidate()
      }
      if (val.col === 'blockedReason') {
        this.triggerValidate()
      }
    },
    getTableClone (data) {
      this.stopData = data
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
  }
</style>
