<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      :postFlow="postFlow"
      :processType="processType"
      @jurConfig="handleJurConfig"
    >
      <section class="content-follow" slot="extraPayInfo">
        <h2 class="info-title">额外支付明细</h2>
        <i-table v-if="showMap['extraPayInfoTable']" :fetchAfterImported="false" class="info-content" :table="table" ref="iTable">
          <template slot="table" slot-scope="tableScope">
            <el-table :data="tableScope.clone"
              style="width: 100%"
              :row-key="getRowKey"
              @selection-change="selectionChangeHandler(tableScope, $event)"
              @row-click="rowClickHandler(tableScope, $event)">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column prop="employeeName" label="员工姓名">
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
                :formatter="tableScope.formatter">
                <template slot-scope="scope">
                  <i-table-cell
                    ref="cell"
                    :row="scope.row"
                    :col="col.prop"
                    :table="tableScope">
                    <i-select
                      v-if="col.prop === 'itemKey'"
                      v-model="scope.row['itemKey']"
                      :props="itemProps"
                      parameter="06"
                      dataKey="salaryItem"
                      @option-click="handleItemClick($event, scope.row)"
                      filterable>
                    </i-select>
                  </i-table-cell>
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
  import reqIndex from 'api/compensation'
  import req from 'api/compensation/flow'
  import IProcessFlow from 'components/common/i-process-flow'
  import { getRule } from 'utils/index'
  import IUpload from 'components/common/upload/uploader'

  export default {
    components: {
      IProcessFlow,
      IUpload
    },
    data () {
      return {
        componentList: [],
        itemProps: {
          value: 'componentId',
          label: 'componentName'
        },
        // 提交时所需要转换的日期字段
        datesKey: ['checkMonth'],
        empEmployeeId: this.$route.query.empEmployeeId,
        processType: this.$route.query.processType,
        table: {
          columns: [
            { prop: 'employeeCode', label: '员工工号' },
            { prop: 'orgName', label: '所属组织' },
            { prop: 'itemKey', label: '额外支付项目', display: { mixin: this.formatterItemLabel } },
            { prop: 'checkMonth', label: '核算月份', align: 'center', display: { date: 'short' } },
            { prop: 'itemValue', label: '金额' }
          ],
          setting: {
            import: {
              business: 'cps-workflow-extraPay',
              show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import }),
              callback: this.importCallback
            },
            toolbar: [{
              text: '添加',
              func: vm => vm.createData({
                employeeCode: '',
                orgName: '',
                itemValue: '',
                itemKey: '',
                extraPayTotalValue: '',
                checkMonth: '',
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
              orgName: {
                disable: true
              },
              itemKey: {
                type: 'select',
                rules: getRule('请选择支付项目', 'change'),
                options: {
                  option: []
                }
              },
              checkMonth: {
                rules: getRule('请选择核算月份', 'change', 'number'),
                type: 'date',
                options: {
                  disabledDate (time) {
                    return time.getTime() > Date.now()
                  },
                  type: 'month'
                }
              },
              itemValue: {
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
                type: 'number'
              }
            }
          },
          editable: true,
          data: [
            {
              employeeCode: '',
              orgName: '',
              itemValue: '',
              itemKey: '',
              extraPayTotalValue: '',
              checkMonth: '',
              isShowPersonnel: false,
              rowId: Math.random()
            }
          ],
          disable: false
        }
      }
    },

    methods: {
      /** 额外支付项目名称装换 */
      formatterItemLabel (row, col) {
        if (this.componentList.length) {
          for (let item of this.componentList) {
            if (item[this.itemProps.value] === row[col]) {
              return item[this.itemProps.label]
            }
          }
        }
      },
      /** 获取薪资项目数据 */
      async getSalaryItems () {
        await reqIndex('getSalaryItem', { componentType: '06' }).then(res => {
          if (res) {
            this.componentList = res
          }
        })
      },
      /* 导入成功回调 */
      importCallback (err) {
        if (!err) {
          req('getExtraPaymentImportData').then(res => {
            if (res && Array.isArray(res)) {
              res.map(item => {
                item = this.transformData(item)
                this.$refs.iTable.createData(item)
              })
            }
          })
        }
      },
      /** 时间格式转换为时间戳 */
      transformToDate (value) {
        return Date.parse(new Date(value.slice(0, 4) + '-' + value.slice(4)))
      },
      transformData (data) {
        this.datesKey.map(key => {
          data[key] = this.transformToDate(data[key])
        })
        return data
      },
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
        this.getSalaryItems().then(() => {
          this.table.data = data.extraPayInfoList
        })
      },

      /** 权限配置完成事件 */
      handleJurConfig (showMap, disabledMap) {
        this.setTableDisabled(disabledMap)
      },

      /** 设置表格是否可编辑 */
      setTableDisabled (disabledMap) {
        this.table.setting.toolbar = disabledMap.extraPayInfoTable ? [] : this.table.setting.toolbar
        this.table.disable = disabledMap.extraPayInfoTable
      },

      /** 提供给流程组件所需提交数据的方法 */
      postFlow () {
        return this.transformSubmitData(this.$refs.iTable.clone)
      },

      /** 提交数据格式转换 */
      transformSubmitData (data) {
        const submitData = {}
        submitData.extraPayInfoList = JSON.parse(JSON.stringify(data))
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
