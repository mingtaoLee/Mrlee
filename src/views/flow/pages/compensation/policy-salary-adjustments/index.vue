<template>
  <div class="wrap">
    <i-process-flow
      :postFlow="postFlow"
      :processType="processType"
      @fillin="fillIn"
      @jurConfig="handleJurConfig"
    >
      <section class="content-follow" slot="policySalaryAdjustInfoList">
        <h2 class="info-title">地方政策调整申请</h2>
        <i-table
          v-if="showMap['policySalaryAdjustTable']"
          class="info-content"
          :table="table"
          ref="iTable"
        >
          <template slot="table" slot-scope="tableScope">
            <el-table
              :row-key="getRowKey"
              :data="tableScope.clone"
              style="width: 100%"
            >
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                v-for="(col, idx) of table.columns || []"
                :key="idx"
                :prop="col.prop"
                :label="col.label"
                :formatter="tableScope.formatter">
                <template slot-scope="scope">
                  <i-table-cell
                    ref="cell"
                    :row="scope.row"
                    :col="col.prop"
                    :table="tableScope"
                    @change="handleTableDataChange($event, scope)"
                  >
                    <div v-if="col.prop === 'areaName'">
                      <i-select-area
                        v-model="scope.row.areaId"
                        search
                        return-node
                        @change="change($event, scope)"
                      ></i-select-area>
                    </div>
                  </i-table-cell>
                </template>
              </el-table-column>
              <el-table-column label="附件" prop="fileList" align="center">
                <template slot-scope="scope">
                  <i-upload
                    type="text"
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
      </section>
    </i-process-flow>
  </div>
</template>
<script>
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
        empEmployeeId: this.$route.query.empEmployeeId,
        taskId: this.$route.query.taskId,
        taskKey: this.$route.query.taskKey,
        processType: this.$route.query.processType,
        processInstanceId: this.$route.query.processInstanceId || '',
        table: {
          columns: [
            { prop: 'areaName', label: '所在区域' },
            { prop: 'beforeMinSalary', label: '调整前最低工资' },
            { prop: 'beforeMinHoursalary', label: '调整前最低小时工资' },
            { prop: 'beforeSocialAverageSalary', label: '调整前社平工资' },
            { prop: 'afterMinSalary', label: '调整后最低工资' },
            { prop: 'afterMinHoursalary', label: '调整后最低小时工资' },
            { prop: 'afterSocialAverageSalary', label: '调整后社平工资' },
            { prop: 'effectiveDate', label: '生效日期', display: { date: 'default' } }
          ],
          setting: {
            // import: {
            //   business: '',
            //   show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            // },
            toolbar: [{
              text: '添加',
              func: vm => vm.createData({
                areaId: '',
                beforeMinSalary: '',
                beforeMinHoursalary: '',
                afterMinSalary: '',
                afterMinHoursalary: '',
                fileId: '',
                effectiveDate: ''
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
              beforeMinSalary: {
                disable: true
              },
              beforeMinHoursalary: {
                disable: true
              },
              beforeSocialAverageSalary: {
                disable: true
              },
              afterMinSalary: {
                type: 'number'
              },
              afterMinHoursalary: {
                type: 'number'
              },
              afterSocialAverageSalary: {
                type: 'number'
              },
              effectiveDate: {
                type: 'date',
                options: {
                  disabledDate (time) {
                    return this.row.allowedTime ? time < this.row.allowedTime : false
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
          ]
        }
      }
    },

    methods: {
      handleTableDataChange (val, scope) {
//        const INDEX = scope.$index
        console.log('handleTableDataChange', val, scope)
        if (val.col === 'areaName') {
//          console.log('DataChange', val, scope)
//          this.getBeforeSalaryData(val.row.areaId)
//            .then(res => {
//              if (res) {
//                this.$refs.iTable.clone[INDEX].allowedTime = res.allowedTime
//                this.$refs.iTable.clone[INDEX].beforeMinSalary = res.beforeMinSalary
//                this.$refs.iTable.clone[INDEX].beforeMinHoursalary = res.beforeMinHoursalary
//                this.$refs.iTable.clone[INDEX].beforeSocialAverageSalary = res.beforeSocialAverageSalary
//              }
//            })
        }
      },
      getBeforeSalaryData (areaId) {
        return req('getPolicyAdjust', {areaId})
      },
      change (val, scope) {
        console.log(val, scope)
//        const INDEX = scope.$index
        if (val) {
//          this.$refs.iTable.clone[INDEX].areaId = val[val.length - 1]
          scope.row.areaName = val.areaName
          this.getBeforeSalaryData(val.areaId)
            .then(res => {
              if (res) {
                scope.row.allowedTime = res.allowedTime
                scope.row.beforeMinSalary = res.beforeMinSalary
                scope.row.beforeMinHoursalary = res.beforeMinHoursalary
                scope.row.beforeSocialAverageSalary = res.beforeSocialAverageSalary
              }
            })
        } else {
//          this.$refs.iTable.clone[INDEX].beforeMinSalary = ''
//          this.$refs.iTable.clone[INDEX].beforeMinHoursalary = ''
        }
      },

      /* 获取表格行key值 */
      getRowKey (row) {
        return row.rowId
      },

      /** 数据填充 */
      fillIn (data) {
        this.table.data = data.policySalaryAdjustInfoList
      },

      /** 权限配置完成事件 */
      handleJurConfig (showMap, disabledMap) {
        this.setTableDisabled(disabledMap)
      },

      /** 设置表格是否可编辑 */
      setTableDisabled (disabledMap) {
        this.table.setting.toolbar = disabledMap.policySalaryAdjustTable ? [] : this.table.setting.toolbar
        this.table.disable = disabledMap.policySalaryAdjustTable
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
        submitData.policySalaryAdjustInfoList = JSON.parse(JSON.stringify(data))
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
        row.orgName = selectedData.unitName
        this.getAdjustmentBefore(row)
      },

      /** 获取员工调整前薪资标准 */
      getAdjustmentBefore (row) {
        req('getEmpAdjustSalary', { employeeId: row.empEmployeeId }).then(res => {
          if (res) {
            row.adjustmentBefore = res.adjustmentBefore
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
