<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      :processType="processType"
      @jurConfig="handleJurConfig">
      <section class="content-follow" slot="laborHourTransfer" >
        <div v-if="showMap.laborHourTable">
          <h2 class="info-title">工时划拨明细</h2>
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
              @selection-change="selectionChangeHandler(tableScope, $event)"
              @row-click="rowClickHandler(tableScope, $event)"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="employeeName" label="姓名" align="left">
                <template slot-scope="scope">
                  <i-table-cell
                    :table="tableScope"
                    :row="scope.row"
                    col="employeeName"
                    ref="cell"
                    :formatter="tableScope.formatter"
                  >
                    <el-input
                      v-model="payForm.employeeName"
                      icon="menu"
                      @click.native="handleIconClick($event, scope)"
                      :disabled="editable"
                      readonly
                    >
                      <i slot="suffix" class="el-icon-menu"></i>
                    </el-input>
                    <i-personnel-select
                      :isShow.sync="isShow"
                      @confirm="handleConfirm($event, scope)"
                      :disabled="editable"
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
                :formatter="tableScope.formatter"
                :width="col.width"
                :align="col.align"
                v-model="col.prop"
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
              <el-table-column prop="transferInPunitName" label="划入门店" v-else-if="col.isTransferInPunit">
                <template slot-scope="scope">
                  <i-table-cell
                    :table="tableScope"
                    :row="scope.row"
                    col="transferInPunitName"
                    align='left'
                    :formatter="tableScope.formatter"
                  >
                    <i-select-tree
                      :multiple="false"
                      dataKey="org"
                      nodeKey="orgUnitId"
                      treeWidth='180'
                      @node-click="clickSelect($event, scope.row)"
                      lazy
                    ></i-select-tree>
                  </i-table-cell>
                </template>
              </el-table-column>
              <el-table-column prop="transferInUnitName" label="划入小店" v-else-if="col.isTransferInUnit">
                <template slot-scope="scope">
                  <i-table-cell
                    :table="tableScope"
                    :row="scope.row"
                    align='left'
                    col="transferInUnitName"
                    :formatter="tableScope.formatter"
                  >
                    <i-select-tree
                      :multiple="false"
                      dataKey="org"
                      nodeKey="orgUnitId"
                      treeWidth='180'
                      @node-click="clickSelectInUnit($event, scope.row)"
                      v-model="payForm.transferInUnitName"
                      lazy
                    ></i-select-tree>
                  </i-table-cell>
                </template>
              </el-table-column>
              <el-table-column
                prop="transferIngroupName"
                label="划入薪资组"
                width="110"
                v-else-if="col.isTransferInPaygroup"
              >
                <template slot-scope="scope">
                  <i-table-cell
                    :table="tableScope"
                    :row="scope.row"
                    col="transferIngroupName"
                    :align='left'
                    ref="groupCell"
                    :formatter="tableScope.formatter"
                  >
                    <i-select
                      v-model="payForm.groupId"
                      :props="groupProps"
                      dataKey="salaryGroup"
                      @option-click='clickSalaryGroup($event, scope.row)'
                      filterable
                    ></i-select>
                  </i-table-cell>
                </template>
              </el-table-column>
              <el-table-column prop="transferReason" label='划拨原因'>
                <template slot-scope="scope">
                  <i-table-cell
                    :row="scope.row"
                    col="transferReason"
                    :table="tableScope"
                    :formatter="tableScope.formatter"
                    :align='left'
                    v-model='scope.row.transferReason'
                    v-if='isReasonShow'
                    @change="cellChange"
                  />
                  <el-input
                    type="textarea"
                    v-if="!isReasonShow"
                    v-model="scope.row.transferReason"
                    placeholder="请输入划拨原因">
                  </el-input>
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
  import ButtonGroup from 'components/flow/button-group'
  import BasicInfo from 'components/flow/basic-info'
  import ISelect from 'components/common/i-select/i-select'
  import req from '../../../../../api/compensation/check-give/flow'
  import Editor from 'components/employee/editor'
  import IProcessFlow from 'components/common/i-process-flow'
  import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import IUpload from 'components/common/upload/uploader'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
 // import { showMessage, confirmPopover } from 'utils/index'
//  import { formatDate } from 'utils/organization'
//  import {formatTableDate} from 'utils/employee.js'

  export default {
    name: 'WorkHourTransfer',
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
      IUpload
    },
    data () {
      return {
        payForm: {
          // 员工id
          employeeId: '',
          // 员工姓名
          employeeName: '',
          // 划入小店
          transferInUnitName: '',
          // 划入薪资组
          transferIngroupName: '',
          // 划入薪资组id
          transferIngroupId: '',
          // 划拨月份
          transferMonth: '',
          // 划入工时
          transferInHour: '',
          // 划拨原因
          transferReason: '',
          flieList: '',
          // 划入门店店编
          transferInPunitCode: '',
          // 划入门店
          transferInPunitName: '',
          // 划入门店id
          transferInPunitId: '',
          // 划入小店id
          transferInUnitId: '',
          // 划出工时
          transferOutHours: '',
          // 划出薪资组
          transferOutgroupName: '',
          // 划出薪资组id
          transferOutgroupId: '',
          // 划出小店
          transferOutUnitName: '',
          // 划出门店店编
          transferOutPunitCode: '',
          // 划出小店id
          transferOutUnitId: '',
          // 划出门店id
          transferOutPunitId: '',
          // 划出门店
          transferOutPunitName: '',
          // 工号
          employeeCode: '',
          groupId: ''
        },
        // 人员选择器的显示
        isShow: false,
        // 划拨原因选择器
        isReasonShow: true,
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        table: {
          columns: [
            { prop: 'employeeName' },
            { prop: 'employeeCode', label: '工号', align: 'center' },
            { prop: 'transferMonth', label: '划拨月份', display: { date: 'short' }, width: '120', align: 'center' },
            { prop: 'transferOutPunitName', label: '划出门店', width: '100', align: 'left' },
            { prop: 'transferOutPunitCode', label: '划出门店店编', width: '120', align: 'center' },
            { prop: 'transferOutUnitName', label: '划出小店', align: 'left' },
            { prop: 'transferOutgroupName', label: '划出薪资组', width: '110', align: 'left' },
            { prop: 'transferOutHours', label: '划出工时', type: 'number', width: '100', align: 'center' },
            { prop: 'transferInPunitName', width: '100', isTransferInPunit: 'true', align: 'center' },
            { prop: 'transferInPunitCode', label: '划入门店店编', width: '120', align: 'left' },
            { prop: 'transferInUnitName', isTransferInUnit: 'true', align: 'center' },
            { prop: 'transferIngroupName', isTransferInPaygroup: 'true', align: 'center' },
            { prop: 'transferInHours', label: '划入工时', width: '100', align: 'left' },
            { prop: 'transferReason', align: 'left', display: {dict: 'LABORHOUR_TRANSFER_TYPE'} }
          ], // 表头
          setting: {
            toolbar: [{
              text: '添加',
              func: vm => vm.createData(),
              show: () => {
                return { disable: this.disabledMap.addButton, empty: !this.showMap.addButton }
              }
            }, {
              text: '删除',
              type: 'danger',
              func: vm => vm.deleteData(),
              show: () => {
                return { disable: this.disabledMap.delButton, empty: !this.showMap.delButton }
              }
            }],
            import: {
              business: 'test',
              show: () => {
                return { disable: this.disabledMap.importButton, empty: !this.showMap.importButton }
              }
            },
            editor: {
              employeeCode: {
                disable: true,
                // rules: getRule('请选择员工', 'change')
                rules: [{ required: true, trigger: 'change' }]
              },
              transferInPunitCode: {
                disable: true,
                rules: [{ required: true, trigger: 'change' }]
              },
              transferOutgroupName: {
                disable: true,
                rules: [{ required: true, trigger: 'change' }]
              },
              transferOutPunitName: {
                disable: true,
                rules: [{ required: true, trigger: 'change' }]
              },
              transferOutPunitCode: {
                disable: true,
                rules: [{ required: true, trigger: 'change' }]
              },
              transferOutUnitName: {
                disable: true,
                rules: [{ required: true, trigger: 'change' }]
              },
              transferMonth: {
                type: 'date',
                rules: [{ required: true,
                  validator: (rule, value, cb) => {
                    !value && cb(new Error('请选择薪资月份'))
                    cb()
                  }
                }],
                options: {
                  type: 'month'
                }
              },
              transferInPunitName: {
                rules: [{ required: true, message: '请选择划入门店', trigger: 'change' }]
              },
              transferInUnitName: {
                rules: [{ required: true, message: '请选择划入小店', trigger: 'change' }]
              },
              transferOutHours: {
                type: 'number',
                rules: [{                                        // 自定义规则
                  validator: (rule, value, callback) => {
                    if (!value) {
                      return callback(new Error('工时不能为空'))
                    } else {
                      if (value < 0) {
                        callback(new Error('工时不能小于零'))
                      } else
                      if (value > 99999999) {
                        callback(new Error('输入工时过大'))
                      } else {
                        callback()
                      }
                    }
                  }
                }]
              },
              transferInHours: {
                type: 'number',
                disable: true
              },
              transferIngroupName: {
                // type: 'select',
                // rules: getRule('选择薪资组', 'change')
                rules: [{ required: true, message: '请选择选择薪资组', trigger: 'change' }]
              },
              employeeName: {
                rules: [{ required: true, message: '请选择员工', trigger: 'change' }]
              },
              transferReason: {
                type: 'select',
                rules: [{ required: true, message: '请输入原因', trigger: 'change' }]
              }
            }
          },
          editable: true,
          // 占位符，用于挂载数据
          data: null
        },
        empEmployeeId: this.$route.query.empEmployeeId,
        taskId: this.$route.query.taskId,
        taskKey: this.$route.query.taskKey,
        processType: this.$route.query.processType,
        filln: '',
        dict: {},
        curRow: {},
        itable: null,
        stopData: null
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
        this.table.setting.toolbar = disabledMap.laborHourTable ? [] : this.table.setting.toolbar
        this.table.disable = disabledMap.laborHourTable
      },
      rowClickHandler ({ rowClickHandler }, row) {
        this.curRow = row
        this.payForm = Object.assign(this.payForm, row)
        rowClickHandler(row)
        // console.log(this.curRow)
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },
      sendAll () {
        // this.$refs.table.saveData()
      },
      // 人员选择器的显示隐藏
      handleIconClick () {
        this.isShow = !this.isShow
      },
      handleLoaded (vm) {
        this.itable = vm
      },
      // 删除行
      // deleteData (vm) {
      //   const accountSelected = vm.getMultipleSelection().map(item => {
      //     return item.costTransferId
      //   })
      //   if (!accountSelected.length) return showMessage('info', '请选择至少一项！')
      //   confirmPopover('warning', '确认删除已选选项吗？', () => {
      //     req('delCostTranferLog', accountSelected).then(res => {
      //       if (res) {
      //         showMessage('success', '恭喜你！删除成功！')
      //         this.fetch()
      //       } else {
      //         showMessage('danger', '删除失败！')
      //       }
      //     })
      //   })
      // },
      // 触发表单校验
      triggerValidate () {
        this.$refs.cell.map(el => el.validate())
      },
      //  人员选择方法
      handleConfirm (selected) {
      //  选中的人员数组
        if (selected.length === 1) {
          this.curRow.employeeName = selected[0].employeeName
          this.fetch({ employeeId: selected[0].employeeId })
        }
      },
      // 带出员工相关信息
      fetch (options = {}) {
        req('postTransferQuery', options)
        .then(res => {
          this.curRow = Object.assign(this.curRow, res)
          this.triggerValidate()
        })
      },
      // 划入门店 选择门店获取（划入门店编号）
      clickSelect (data, row) {
        row.transferInPunitName = data.orgUnitName
        row.transferInUnitId = data.orgUnitId
        // console.log(data, row)
        req('getTransferInPunitcode', { transferInUnit: data.orgUnitId })
        .then(res => {
          row.transferInPunitCode = res.transferInPunitCode
          this.triggerValidate()
        })
      },
      // 划入小店
      clickSelectInUnit (data, row) {
        row.transferInUnitName = data.orgUnitName
        // console.log(data)
        row.transferInPunitId = data.orgUnitId
      },
      // 划入薪资小组
      clickSalaryGroup (data, row) {
        this.curRow.transferIngroupName = data.groupName
        row.transferIngroupName = data.groupName
        row.transferIngroupId = data.groupId
        // 触发表单验证
        this.$refs.groupCell.validate()
      },
      changeData (val) {
        // 判断时间是否为负数
        val.row.transferOutHours = val.row.transferOutHours < 0 ? 0 : val.row.transferOutHours
      },
      getTableClone (data) {
        this.stopData = data
      }
      /** 根据下拉选择改变输入框 */
      // cellChange (row) {
      //   console.log(row)
      //   console(this.payForm.transferReason)
      //   if (row === '05') {
      //     this.payForm.transferReason = ''
      //     this.isReasonShow = false
      //   }
      // }
    },
    computed: {
    },
    watch: {
      'payForm.transferOutHours' (a) {
        this.curRow.transferInHours = a
      }
    }
  }
</script>
<style lang="scss">

</style>
