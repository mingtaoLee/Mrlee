<template>
  <div class="wrap content-follow">
    <i-process-flow
      @fillin="fillIn"
      @submit="sendAll"
      :postFlow="postFlow"
      :processType="processType"
      @jurConfig="handleJurConfig"
    >
    <section class="content-follow" slot="paySeverance">
      <div v-if="showMap.severanceTable">
        <h2 class="info-title">离职补偿金申请</h2>
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
                        :fileList="scope.row.attachment"
                        :previewMode="previewMode && disabledMap.severanceTable"
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
import req from 'api/compensation/check-give/flow'
import IProcessFlow from 'components/common/i-process-flow'
import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import { formatDate } from 'utils/organization'
import IUpload from 'components/common/upload/uploader'
// import { getRule } from 'utils/index'
//  import {formatTableDate} from 'utils/employee.js'

export default {
  name: 'UrgentStopPay',
  components: {
    ISelect,
    IProcessFlow,
    IPersonnelSelect,
    IUpload
  },
  data () {
    return {
      isShow: false,
      table: {
        columns: [
          { prop: 'fullName' },
          { prop: 'employeeCode', label: '工号', align: 'center', width: 120 },
          { prop: 'orgAreaName', label: '省区', align: 'left', width: 120 },
          { prop: 'sysAreaName', label: '区域', align: 'left', width: 120 },
          { prop: 'groupName', label: '薪资组', align: 'left', width: 120 },
          { prop: 'orgUnitName', label: '所属组织', align: 'left', width: 120 },
          { prop: 'payMonth', label: '核算月份', align: 'center', width: 100, display: { date: 'short' } },
          { prop: 'amount', label: '金额', align: 'right', width: 100, display: {mixin: (row, col) => this.currencyFormat(row[col])} },
          { prop: 'fileListInfo' }
        ], // 表头
        setting: {
          toolbar: [{
            text: '添加',
            func: vm => vm.createData({
              fullName: '',
              employeeCode: '',
              orgAreaName: '',
              sysAreaName: '',
              groupName: '',
              orgUnitName: '',
              payMonth: '',
              amount: '',
              attachment: []
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
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请选择员工'))
                  cb()
                }
              }]
            },
            employeeCode: {
              disable: true
            },
            orgAreaName: {
              disable: true
            },
            sysAreaName: {
              disable: true
            },
            groupName: {
              disable: true
            },
            orgUnitName: {
              disable: true
            },
            payMonth: {
              type: 'date',
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请选择划拨月份'))
                  cb()
                }
              }],
              options: {
                type: 'month'
              }
            },
            amount: {
              type: 'number',
              rules: [{ required: true,
                validator: (rule, value, cb) => {
                  !value && cb(new Error('请输入金额'))
                  cb()
                }
              }]
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
      severanceData: null,
      previewMode: false,
      fileList: [],
      urlData: [],
      processId: ''
    }
  },
  created () {
    if (this.$route.query.taskKey !== undefined) {
      this.previewMode = true
    }
    // let params = window.location.href.split('?')[1].split('&')
    // params.forEach(item => {
    //   let arr = item.split('=')
    //   if (arr[0] === 'arr') {
    //     this.urlData = JSON.parse(decodeURIComponent(arr[1]))
    //   } else if (arr[0] === 'processId') {
    //     this.processId = arr[1]
    //   }
    // })
    // if (this.urlData.length) {
    //   this.urlData.processId = this.processId
    //   req('getStopPayFlow', this.urlData).then(res => {
    //     this.table.data = res
    //     this.table.editable = false
    //   })
    // }
  },
  methods: {
    // 传值
    postFlow () {
      this.$refs.table.saveData()
      return this.severanceData
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
      this.table.setting.toolbar = disabledMap.severanceTable ? [] : this.table.setting.toolbar
      this.table.disable = disabledMap.severanceTable
    },
    rowClickHandler ({ rowClickHandler }, row) {
      this.curRow = row
      // this.payForm = Object.assign(this.payForm, row)
      rowClickHandler(row)
    },
    sendAll () {
      console.log(1, this.severanceData)
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
      this.curRow.fullName = selected[0].employeeName
      this.curRow.employeeCode = selected[0].employeeCode
      this.curRow.employeeId = selected[0].employeeId
      req('getSeveranceByEmployeeId', { employeeId: selected[0].employeeId }).then(res => {
        this.curRow.orgAreaId = res.orgAreaId
        this.curRow.orgAreaName = res.orgAreaName
        this.curRow.sysAreaId = res.sysAreaId
        this.curRow.sysAreaName = res.sysAreaName
        this.curRow.groupId = res.groupId
        this.curRow.groupName = res.groupName
        this.curRow.orgUnitId = res.orgUnitId
        this.curRow.orgUnitName = res.orgUnitName
        this.triggerValidate()
      })
    },

    // 点击单元格触发
    changeData (data) {
      if (data.col === 'payMonth') {
        this.curRow.payMonth = data.val
      }
    },

    /** 删除已上传数据 */
    handleFileRemove (file, row) {
      console.log(row.attachment)
      row.attachment = row.attachment.filter(fileId => {
        return fileId !== file.attachmentId
      })
    },

    /** 上传成功事件监听 */
    handleUploadSuccess (responseId, row) {
      row.attachment.push(responseId)
    },

    getTableClone (data) {
      for (let i = 0; i < data.length; i++) {
        data[i].payMonth = formatDate(data[i].payMonth).slice(0, 7)
      }
      this.severanceData = data
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


