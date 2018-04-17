<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      :postFlow="postFlow"
      :processType="processType"
      @jurConfig="handleJurConfig"
    >
      <section class="content-follow" slot="payCompanyChangeInfo">
        <h2 class="info-title">发薪主体基本信息</h2>
        <i-table v-if="showMap['payCompanyChangeInfoTable']" class="info-content" :table="table" ref="iTable">
          <template slot="table" slot-scope="tableScope">
            <el-table
              :data="tableScope.clone"
              style="width: 100%"
              :row-key="getRowKey"
              @selection-change="selectionChangeHandler(tableScope, $event)"
              @row-click="rowClickHandler(tableScope, $event)"
            >
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
                        <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
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
                    <i-select
                      v-if="judgeIsCompany(col.prop)"
                      v-model="scope.row[col.prop]"
                      dataKey="company"
                      filterable
                      :props="companyProps"
                      @option-click="handleCompanyOptionClick($event, col.prop, scope.row)"
                    ></i-select>
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
  import req from 'api/compensation/flow'
  import IProcessFlow from 'components/common/i-process-flow'
  import { getRule } from 'utils/index'

  export default {
    components: {
      IProcessFlow
    },
    data () {
      return {
        // 公司列表配置
        companyProps: {
          value: 'companyName',
          label: 'companyName'
        },
        // 提交时所需要转换的日期字段
        datesKey: ['effectiveDate'],
        processType: this.$route.query.processType,
        table: {
          columns: [
            { prop: 'employeeCode', label: '员工工号' },
            { prop: 'orgName', label: '所属组织' },
            { prop: 'groupName', label: '薪资组' },
            { prop: 'costCenterName', label: '成本中心' },
            { prop: 'payCompanyName', label: '发薪主体' },
            { prop: 'taxCompanyName', label: '报税主体' },
            { prop: 'effectiveDate', label: '生效时间', display: { date: 'default ' } }
          ],
          setting: {
            // import: {
            //   business: '',
            //   show: () => ({ disable: this.disabledMap.import, empty: !this.showMap.import })
            // },
            toolbar: [{
              text: '添加',
              func: vm => vm.createData({
                employeeCode: '',
                orgName: '',
                groupName: '',
                costCenterName: '',
                payCompanyName: '',
                taxCompanyName: '',
                isShowPersonnel: false,
                effectiveDate: '',
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
              groupName: {
                disable: true
              },
              costCenterName: {
                rules: getRule('请选择成本中心', 'change')
              },
              payCompanyName: {
                rules: getRule('请选择发薪主体', 'change')
              },
              taxCompanyName: {
                rules: getRule('请选择报税主体', 'change')
              },
              effectiveDate: {
                rules: getRule('请选择生效日期', 'change', 'number'),
                type: 'date',
                options: {
                  type: 'date'
                }
              }
            }
          },
          editable: true,
          data: [
            {
              effectiveDate: '',
              employeeCode: '',
              orgName: '',
              groupName: '',
              costCenterName: '',
              payCompanyName: '',
              taxCompanyName: '',
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

      /** 提供给流程组件所需提交数据的方法 */
      postFlow () {
        return this.transformSubmitData(this.$refs.iTable.clone)
      },

      /** 数据回填 */
      fillIn (data) {
        this.table.data = data.payChangeEmpObjectList
      },

      /** 权限配置完成事件 */
      handleJurConfig (showMap, disabledMap) {
        this.setTableDisabled(disabledMap)
      },

      /** 设置表格是否可编辑 */
      setTableDisabled (disabledMap) {
        this.table.setting.toolbar = disabledMap.payCompanyChangeInfoTable ? [] : this.table.setting.toolbar
        this.table.disable = disabledMap.payCompanyChangeInfoTable
      },

      /** 公司选项点击事件 */
      handleCompanyOptionClick (option, prop, row) {
        switch (prop) {
          case 'costCenterName':
            this.setCompanyData(row, option, 'costCenterName', 'costCenterCode')
            return
          case 'payCompanyName':
            this.setCompanyData(row, option, 'payCompanyName', 'payCompanyCode')
            return
          case 'taxCompanyName':
            this.setCompanyData(row, option, 'taxCompanyName', 'taxCompanyCode')
            break
        }
      },

      /** 判断是否是公司选择 */
      judgeIsCompany (propName) {
        return (propName === 'costCenterName') || (propName === 'payCompanyName') || (propName === 'taxCompanyName')
      },

      /** 设置公司属性 */
      setCompanyData (row, option, nameProp, codeProp) {
        row[nameProp] = option.companyName
        row[codeProp] = option.companyCode
      },

      /** 提交数据格式转换 */
      transformSubmitData (data) {
        const submitData = {}

        submitData.payChangeEmpObjectList = JSON.parse(JSON.stringify(data))
        submitData.processType = this.processType

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

        this.getDetailInfo(row.empEmployeeId, row)
      },

      /** 根据人员id获取详细信息 */
      getDetailInfo (employeeId, row) {
        req('getMainAccountChange', { employeeId: employeeId }).then(res => {
          if (res) {
            ['groupId', 'groupName', 'costCenterCode', 'costCenterName', 'payCompanyCode', 'payCompanyName', 'taxCompanyCode', 'taxCompanyName'].map(key => {
              row[key] = res[key]
            })
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
