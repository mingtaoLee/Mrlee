<template>
  <div class="wrap">
    <i-process-flow
      :postFlow="postFlow"
      :processType="processType"
      @fillin="fillIn"
      @jurConfig="handleJurConfig"
    >
      <section class="content-follow" slot="threeClustersNormalConstantInfo">
        <h2 class="info-title">非计件计量绩效奖金（常温定温）</h2>
        <i-table v-if="showMap['threeClustersNormalConstantTable']" class="info-content" :table="table" ref="iTable">
          <template slot="table" slot-scope="tableScope">
            <el-table
              :row-key="getRowKey"
              :data="tableScope.clone"
              style="width: 100%"
              @selection-change="selectionChangeHandler(tableScope, $event)"
              @row-click="rowClickHandler(tableScope, $event)"
            >
              <el-table-column
                type="index"
                label="序号"
                width="55">
              </el-table-column>
              <el-table-column prop="employeeName" label="姓名">
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
                      <i-personnel-select :isShow.sync="scope.row.isShowPersonnel" @confirm="handlePersonnelDialogConfirm($event, scope)"></i-personnel-select>
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
        // 提交时所需要转换的日期字段
        datesKey: ['checkMonth'],
        empEmployeeId: this.$route.query.empEmployeeId,
        processType: this.$route.query.processType,
        taskKey: this.$route.query.taskKey,
        processDefinitionId: this.$route.query.processDefinitionId,
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', align: 'center' },
            { prop: 'teamName', label: '团队', align: 'left' },
            { prop: 'groupName', label: '组别', align: 'left' },
            { prop: 'jobTitleName', label: '职务', align: 'left' },
            { prop: 'checkMonth', label: '核算月份', align: 'center', display: { date: 'short' } },
            { prop: 'aidBonus', label: '支援奖金', align: 'right' },
            { prop: 'bonus', label: '奖金', align: 'right' },
            { prop: 'achievementBonus', label: '最终发放奖金', align: 'right' }
          ],
          setting: {
            import: {
              business: '',
              show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            },
            toolbar: [{
              text: '添加',
              func: vm => vm.createData({
                teamName: '',
                groupName: '',
                employeeName: '',
                employeeCode: '',
                jobTitleName: '',
                checkMonth: '',
                aidBonus: '',
                bonus: '',
                achievementBonus: '',
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
              teamName: {
                disable: true
              },
              groupName: {
                disable: true
              },
              jobTitleName: {
                disable: true
              },
              checkMonth: {
                type: 'date',
                rules: getRule('请选择核算月份', 'change', 'number'),
                options: {
                  type: 'month'
                }
              },
              achievementBonus: {
                rules: getRule('请输入最终发放奖金', 'change')
              }
            }
          },
          editable: true,
          data: [
            {
              teamName: '',
              groupName: '',
              employeeName: '',
              employeeCode: '',
              jobTitleName: '',
              checkMonth: '',
              aidBonus: '',
              bonus: '',
              achievementBonus: '',
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

      /* 获取表格行key值 */
      getRowKey (row) {
        return row.rowId
      },

      /** 数据填充 */
      fillIn (data) {
        this.table.data = data.threeClustersNormalConstantments
      },

      /** 权限配置完成事件 */
      handleJurConfig (showMap, disabledMap) {
        this.setTableDisabled(disabledMap)
      },

      /** 设置表格是否可编辑 */
      setTableDisabled (disabledMap) {
        this.table.setting.toolbar = disabledMap.threeClustersNormalConstantTable ? [] : this.table.setting.toolbar
        this.table.disable = disabledMap.threeClustersNormalConstantTable
      },

      /** 提供给流程组件所需提交数据的方法 */
      postFlow () {
        return this.transformSubmitData(this.$refs.iTable.clone)
      },

      /** 提交数据格式转换 */
      transformSubmitData (data) {
        const submitData = {}
        submitData.threeClustersNormalConstantments = JSON.parse(JSON.stringify(data))
        submitData.processType = this.processType
        submitData.taskKey = this.taskKey
        submitData.processDefinitionId = this.processDefinitionId
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
        row.teamName = selectedData.unitPathName
        row.groupName = selectedData.unitName
        row.jobTitleName = selectedData.positionName
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
