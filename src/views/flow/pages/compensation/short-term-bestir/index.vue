<template>
  <div class="wrap">
    <i-process-flow
      :postFlow="postFlow"
      :processType="processType"
      @fillin="fillIn"
      @jurConfig="handleJurConfig"
    >

      <section class="content-follow" slot="shortTermBestirInfo">
        <h2 class="info-title">短期激励方案</h2>
        <i-table v-if="showMap['shortTermBestirInfoTable']" class="info-content" :table="table" ref="iTable">
          <template slot="table" slot-scope="tableScope">
            <el-table
              style="width: 100%"
              :data="tableScope.clone"
              :row-key="getRowKey"
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
                    <i-select-tree
                      v-if="col.prop === 'orgName'"
                      lazy
                      :multiple="false"
                      dataKey="org"
                      nodeKey="orgUnitId"
                      size="small"
                      treeWidth="250"
                      @node-click="handleOrgTreeNodeClick($event, scope.row)"
                    ></i-select-tree>
                  </i-table-cell>
                </template>
              </el-table-column>
              <el-table-column label="方案说明" prop="fileIdList">
                <template slot-scope="scope">
                  <i-upload
                    type="text"
                    :previewMode="scope.row.disable"
                    :fileList="scope.row.fileIdList"
                    @onRemove="handleFileRemove($event, scope.row)"
                    @onSuccess="handleUploadSuccess($event, scope.row)"
                    @onError="onError"
                    @onChange="onChange"
                  ></i-upload>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </i-table>
        <i-dialog
          v-model="isShowPlanSelect"
          title="待调入列表"
          :toolbar="planSelectToolbar"
          destroyedWhenClose
        >
          <plan-select ref="planSelect"></plan-select>
        </i-dialog>
      </section>
    </i-process-flow>
  </div>
</template>
<script>
  import PlanSelect from './plan-select'
  import IProcessFlow from 'components/common/i-process-flow'
  import { getRule } from 'utils/index'
  import IUpload from 'components/common/upload/uploader'

  export default {
    components: {
      IProcessFlow,
      IUpload,
      PlanSelect
    },
    data () {
      return {
        isShowPlanSelect: false,
        planSelectToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: (done) => {
              done()
            }
          },
          {
            text: '确认',
            func: this.confirmSelectPlans
          }
        ],
        itemProps: {
          value: 'componentName',
          label: 'componentName'
        },
        // 提交时所需要转换的日期字段
        datesKey: ['checkMonth'],
        empEmployeeId: this.$route.query.empEmployeeId,
        taskId: this.$route.query.taskId,
        taskKey: this.$route.query.taskKey,
        processType: this.$route.query.processType,
        processInstanceId: this.$route.query.processInstanceId || '',
        table: {
//          title: '短期激励方案',
          columns: [
            { prop: 'planName', label: '方案名称' },
            { prop: 'allocation', label: '方案分配形式', display: { dict: 'ALLOCATION' } },
            { prop: 'orgName', label: '方案归属' }
          ],
          setting: {
            // import: {
            //   business: '',
            //   show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            // },
            toolbar: [{
              text: '选择已有方案',
              func: this.openPlanSelect,
              show: () => ({ disable: this.disabledMap.plan, empty: !this.showMap.plan })
            }, {
              text: '添加',
              func: vm => vm.createData({
                planName: '',
                fileIdList: [],
                allocation: '',
                orgId: '',
                disable: false,
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
              planName: {
                rules: getRule('请输入方案名称')
              },
              allocation: {
                type: 'select',
                rules: getRule('请选择分配形式', 'change')
              },
              orgName: {
                rules: getRule('请选择方案归属', 'change')
              }
            }
          },
          editable: true,
          data: []
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

      /** 组织树节点点击事件 */
      handleOrgTreeNodeClick (data, row) {
        row.orgId = data.orgUnitId
        row.orgName = data.orgUnitName
      },

      /** 提供给流程组件所需提交数据的方法 */
      postFlow () {
        return this.transformSubmitData(this.$refs.iTable.clone)
      },

      /** 数据填充 */
      fillIn (data) {
        this.table.data = this.transformFillData(data.bestirList)
      },

      /** 权限配置完成事件 */
      handleJurConfig (showMap, disabledMap) {
        this.setTableDisabled(disabledMap)
      },

      /** 设置表格是否可编辑 */
      setTableDisabled (disabledMap) {
        this.table.setting.toolbar = disabledMap.shortTermBestirInfoTable ? [] : this.table.setting.toolbar
        this.table.disable = disabledMap.shortTermBestirInfoTable
      },

      /** 填充数据转换 */
      transformFillData (data) {
        return data.map(item => {
          item.disable = true
          return item
        })
      },

      /** 选择方案 */
      openPlanSelect () {
        this.isShowPlanSelect = true
      },

      /** 删除已上传数据 */
      handleFileRemove (file, row) {
        row.fileIdList = row.fileIdList.filter(fileId => {
          return fileId !== file.attachmentId
        })
      },

      /** 上传成功事件监听 */
      handleUploadSuccess (responseId, row) {
        row.fileIdList.push(responseId)
      },

      /** 提交数据格式转换 */
      transformSubmitData (data) {
        const submitData = {}
        submitData.bestirList = JSON.parse(JSON.stringify(data))
        submitData.processType = this.processType
        return submitData
      },

      /** 确认选中数据 */
      confirmSelectPlans (done) {
        this.$refs.planSelect.confirm().then(selected => {
          if (selected) {
            selected.forEach(item => {
              delete item._ids
              item.orgName = item.orgUnitName
              delete item.orgUnitName
              item.disable = true
              this.$set(item, 'fileIdList', item.fileList.map(file => {
                return file.fileId
              }))
              this.$refs.iTable.createData(item)
            })
            done()
          }
        })
      },
      /** 选项点击事件监听 */
      handleItemClick (item, row) {
        row.itemKey = item.componentId
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
