<template>
  <div class="wrap">
    <i-process-flow
      :postFlow="postFlow"
      :processType="processType"
      @fillin="fillIn"
      @jurConfig="handleJurConfig"
    >
      <section class="content-follow" slot="insideSalaryChangeInfoList">
        <h2 class="info-title">政策调薪申请</h2>
        <i-table v-if="showMap['insideSalaryChangeTable']" class="info-content" :table="table" ref="iTable">
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
                    :table="tableScope">
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
//  import { getRule } from 'utils/index'
//  import req from 'api/compensation/flow'
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
            { prop: 'changeDesc', label: '调薪原因' },
            { prop: 'changeRange', label: '调薪范围' },
            { prop: 'changeCalculate', label: '调薪规则' },
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
                changeDesc: '',
                changeRange: '',
                changeCalculate: '',
                effectiveDate: '',
                fileId: ''
              }),
              show: () => ({ disable: this.disabledMap.add, empty: !this.showMap.add })
            }, {
              text: '删除',
              type: 'danger',
              func: vm => vm.deleteData(),
              show: () => ({ disable: this.disabledMap.delete, empty: !this.showMap.delete })
            }],
            editor: {
              changeDesc: {
              },
              changeRange: {
              },
              changeCalculate: {
              },
              effectiveDate: {
                type: 'date',
                options: {
                  disabledDate (time) {
                    return this.row.uneffectiveDate ? time > this.row.uneffectiveDate : false
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
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },

      /* 获取表格行key值 */
      getRowKey (row) {
        return row.rowId
      },

      /** 数据填充 */
      fillIn (data) {
        this.table.data = data.insideSalaryChangeInfoList
      },

      /** 权限配置完成事件 */
      handleJurConfig (showMap, disabledMap) {
        this.setTableDisabled(disabledMap)
      },

      /** 设置表格是否可编辑 */
      setTableDisabled (disabledMap) {
        this.table.setting.toolbar = disabledMap.insideSalaryChangeTable ? [] : this.table.setting.toolbar
        this.table.disable = disabledMap.insideSalaryChangeTable
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
//        row.fileList.push(responseId)
        row.fileId = responseId
      },

      /** 提交数据格式转换 */
      transformSubmitData (data) {
        const submitData = {}
        submitData.insideSalaryChangeInfoList = JSON.parse(JSON.stringify(data))
        return submitData
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
