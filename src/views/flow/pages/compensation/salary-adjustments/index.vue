<template>
  <div class="wrap">
    <i-process-flow
      :postFlow="postFlow"
      :processType="processType"
      @fillin="fillIn"
      @jurConfig="handleJurConfig"
    >
      <section class="content-follow" slot="salaryAdjustmentsInfo">
        <h2 class="info-title">调薪申请</h2>
        <i-table v-if="showMap['salaryAdjustmentsInfoTable']" class="info-content" :table="table" ref="iTable">
          <template slot="table" slot-scope="tableScope">
            <el-table
              :row-key="getRowKey"
              :data="tableScope.clone"
              style="width: 100%"
              @selection-change="selectionChangeHandler(tableScope, $event)"
              @row-click="rowClickHandler(tableScope, $event)">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column prop="employeeName" width="120" label="员工姓名">
                <template slot-scope="scope">
                  <i-table-cell
                    :table="tableScope"
                    :row="scope.row"
                    col="employeeName"
                    :formatter="tableScope.formatter">
                    <div>
                      <el-input v-model="scope.row.employeeName" readonly @click.native="handlePersonnelClick(scope)">
                        <i slot="suffix" class="el-input__icon iconfont icon-hr" @click="handlePersonnelClick(scope)"></i>
                      </el-input>
                      <i-personnel-select :isShow.sync="scope.row.isShowPersonnel" :multiple="false" @confirm="handlePersonnelDialogConfirm($event, scope)"></i-personnel-select>
                    </div>
                  </i-table-cell>
                </template>
              </el-table-column>
              <el-table-column
                v-for="(col, idx) of table.columns || []"
                :key="idx"
                :prop="col.prop"
                :label="col.label"
                :minWidth="col.width || '120'"
                :formatter="tableScope.formatter">
                <template slot-scope="scope">
                  <i-table-cell
                    ref="cell"
                    :row="scope.row"
                    :col="col.prop"
                    :table="tableScope"
                    @change="handleCellChange"
                  ></i-table-cell>
                </template>
              </el-table-column>
              <el-table-column label="附件" prop="fileList" width="160" align="center">
                <template slot-scope="scope">
                  <i-upload
                    type="text"
                    mode="table"
                    :preview-mode="false"
                    :file-list="scope.row.fileList"
                    @onRemove="handleFileRemove($event, scope.row)"
                    @onSuccess="handleUploadSuccess($event, scope.row)"
                    @onError="onError"
                    @onChange="onChange"></i-upload>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </i-table>
      </section>
    </i-process-flow>
  </div>
</template>
<script>
  import moment from 'moment'
  import IProcessFlow from 'components/common/i-process-flow'
  import { getRule } from 'utils/index'
  import req from 'api/compensation/flow'
  import IUpload from 'components/common/upload/uploader'

  export default {
    components: {
      IProcessFlow,
      IUpload
    },
    data () {
      return {
        // 提交时所需要转换的日期字段
        datesKey: ['checkMonth'],
        taskId: this.$route.query.taskId,
        processType: this.$route.query.processType,
        table: {
          columns: [
            { prop: 'employeeCode', label: '员工工号', align: 'center' },
            { prop: 'orgName', label: '所属组织', align: 'left' },
            { prop: 'groupName', label: '薪资组', align: 'left' },
            { prop: 'positionName', label: '职位', align: 'left' },
            { prop: 'beforeMonthStandard', label: '调整前月薪', display: {mixin: (row, col) => this.currencyFormat(row[col])}, align: 'right' },
            { prop: 'beforeHourStandard', label: '调整前时薪', display: {mixin: (row, col) => this.currencyFormat(row[col])}, align: 'right' },
            { prop: 'beforeHourWorkStandard', label: '调整前小时工标准', display: {mixin: (row, col) => this.currencyFormat(row[col])}, align: 'right' },
            { prop: 'monthStandard', label: '调整后月薪' },
            { prop: 'hourStandard', label: '调整后时薪' },
            { prop: 'hourWorkStandard', label: '调整后小时工资' },
            { prop: 'preWageStandard', label: '原工资标准' },
            { prop: 'isCompare', label: '是否与原工资标准对比', width: '150', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'varyWithHourstd', label: '随时效浮动', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'adjustType', label: '调薪类型', display: { dict: 'PAY_ADJUST_TYPE' } },
            { prop: 'adjustReason', label: '调整原因', align: 'left', width: '160' },
            { prop: 'effectiveDate', label: '生效日期', width: '160', display: { date: 'short' }, align: 'center' }
            // { prop: 'uneffectiveDate', label: '失效日期', display: { date: 'default' }, align: 'center' }
          ],
          setting: {
            // import: {
            //   business: '',
            //   show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            // },
            toolbar: [{
              text: '添加',
              func: vm => vm.createData({
                employeeName: '',
                employeeCode: '',
                orgName: '',
                groupName: '',
                positionName: '',
                beforeMonthStandard: '',
                beforeHourStandard: '',
                beforeHourWorkStandard: '',
                monthStandard: '',
                hourStandard: '',
                hourWorkStandard: '',
                preWageStandard: '',
                isCompare: '',
                varyWithHourstd: '',
                adjustType: '',
                adjustReason: '',
                fileList: [],
                effectiveDate: '',
                // uneffectiveDate: '',
                isShowPersonnel: false,
                rowId: Math.random()
              }),
              show: () => ({ disable: this.disabledMap.add, empty: !this.showMap.add })
            }, {
              text: '删除',
              type: 'danger',
              func: vm => vm.deleteData(),
              show: () => ({ disable: this.disabledMap.delete, empty: !this.showMap.delete })
            }],
            editor: {
              employeeName: {
                rules: getRule('请选择员工', 'change')
              },
              employeeCode: {
                disable: true
              },
              positionName: {
                disable: true
              },
              orgName: {
                disable: true
              },
              groupName: {
                disable: true
              },
              adjustmentReason: {
                type: 'textarea'
              },
              beforeMonthStandard: {
                disable: true
              },
              beforeHourStandard: {
                disable: true
              },
              beforeHourWorkStandard: {
                disable: true
              },
              monthStandard: {
                type: 'number',
                rules: {
                  validator: (rule, value, cb) => {
                    if (!value && value !== 0) return cb(new Error('请输入金额'))
                    if (value < 0 || value >= 100000000) {
                      cb(new Error('请输入8位以内的非负数'))
                    } else {
                      cb()
                    }
                  },
                  trigger: 'blur'
                },
                disable: false
              },
              hourStandard: {
                type: 'number',
                rules: {
                  validator: (rule, value, cb) => {
                    if (!value && value !== 0) return cb(new Error('请输入金额'))
                    if (value < 0 || value >= 100000000) {
                      cb(new Error('请输入8位以内的非负数'))
                    } else {
                      cb()
                    }
                  },
                  trigger: 'blur'
                },
                disable: false
              },
              hourWorkStandard: {
                type: 'number',
                rules: {
                  validator: (rule, value, cb) => {
                    if (!value && value !== 0) return cb(new Error('请输入金额'))
                    if (value < 0 || value >= 100000000) {
                      cb(new Error('请输入8位以内的非负数'))
                    } else {
                      cb()
                    }
                  },
                  trigger: 'blur'
                },
                disable: false
              },
              preWageStandard: {},
              isCompare: {
                type: 'select'
              },
              varyWithHourstd: {
                type: 'select'
              },
              adjustType: {
                type: 'select',
                rules: getRule('请选择调薪类型', 'change')
              },
              effectiveDate: {
                type: 'date',
                options: {
                  type: 'month',
                  disabledDate (time) {
                    return time.getTime() < moment().startOf('month').valueOf()
                  }
                },
                rules: [
                  { required: true, message: '请选择生效日期' }
                ]
              }
            }
          },
          editable: true,
          data: [
            {
              employeeCode: '',
              orgName: '',
              groupName: '',
              positionName: '',
              beforeMonthStandard: '',
              beforeHourStandard: '',
              beforeHourWorkStandard: '',
              monthStandard: '',
              hourStandard: '',
              hourWorkStandard: '',
              preWageStandard: '',
              isCompare: '',
              varyWithHourstd: '',
              adjustType: '',
              adjustReason: '',
              fileList: [],
              effectiveDate: '',
              // uneffectiveDate: '',
              isShowPersonnel: false,
              rowId: Math.random()
            }
          ]
        }
      }
    },

    methods: {
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },
      /** 处理表格变动 */
      handleCellChange ({ row, col, updateRules, updateDisabled }) {
        if (col === 'monthStandard' || col === 'hourStandard' || col === 'hourWorkStandard') {
          if (!row[col]) {
            ['monthStandard', 'hourStandard', 'hourWorkStandard'].map(key => {
              if (key !== col) {
                updateDisabled(false, this.$refs.cell, key)
              }
            })
          } else {
            ['monthStandard', 'hourStandard', 'hourWorkStandard'].map(key => {
              if (key !== col) {
                updateDisabled(true, this.$refs.cell, key)
                row[key] = 0
              }
            })
          }
        }
      },

      /* 获取表格行key值 */
      getRowKey (row) {
        return row.rowId
      },

      /** 数据填充 */
      fillIn (data) {
        this.table.data = data.salaryAdjustments
      },

      /** 权限配置完成事件 */
      handleJurConfig (showMap, disabledMap) {
        this.setTableDisabled(disabledMap)
      },

      /** 设置表格是否可编辑 */
      setTableDisabled (disabledMap) {
        this.table.setting.toolbar = disabledMap.salaryAdjustmentsInfoTable ? [] : this.table.setting.toolbar
        this.table.disable = disabledMap.salaryAdjustmentsInfoTable
      },

      /** 提供给流程组件所需提交数据的方法 */
      postFlow () {
        return this.transformSubmitData(this.$refs.iTable.clone)
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

      /** 提交数据格式转换 */
      transformSubmitData (data) {
        const submitData = {}
        submitData.salaryAdjustments = JSON.parse(JSON.stringify(data))
        submitData.processType = this.processType
//        submitData.processData.forEach(item => {
//          this.datesKey.map(key => {
//            item[key] = Date.parse(item[key])
//          })
//        })
        return submitData
      },

      /** 人员选择事件监听 */
      handlePersonnelClick ({ row }) {
        this.$set(row, 'isShowPersonnel', true)
      },

      /** 人员选择确认事件 */
      handlePersonnelDialogConfirm (selected, {row}) {
        const selectedData = selected[0]
        row.employeeName = selectedData.employeeName
        row.employeeCode = selectedData.employeeCode
        row.empEmployeeId = selectedData.employeeId
        row.positionName = selectedData.positionName
        row.orgName = selectedData.unitName
        this.getAdjustmentBefore(row)
      },

      /** 获取员工调整前薪资标准 */
      getAdjustmentBefore (row) {
        req('getEmpAdjustSalary', { employeeId: row.empEmployeeId }).then(res => {
          if (res) {
            row.beforeHourStandard = res.beforeHourStandard
            row.beforeHourWorkStandard = res.beforeHourWorkStandard
            row.beforeMonthStandard = res.beforeMonthStandard
            row.groupCode = res.groupCode
            row.groupName = res.groupName
          }
        })
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
