<template>
  <div class="wrap">
    <i-process-flow
      :postFlow="postFlow"
      :processType="processType"
      @fillin="fillIn"
      @jurConfig="handleJurConfig"
    >
      <section class="content-follow" slot="bankCardChangeInfo">
        <h2 class="info-title">银行卡修改申请</h2>
        <i-table v-if="showMap['bankCardChangeInfoTable']" class="info-content" :table="table" ref="iTable">
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
                        <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
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
                    <i-select-area
                      v-if="col.prop === 'areaName'"
                      v-model="scope.row.areaId"
                      return-node
                      @change="handleAreaChange($event, scope.row)"
                      filterable>
                    </i-select-area>
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
        // 提交时所需要转换的日期字段
        datesKey: ['checkMonth'],
        processType: this.$route.query.processType,
        table: {
          columns: [
            { prop: 'employeeCode', label: '员工工号' },
            { prop: 'orgName', label: '所属组织' },
            { prop: 'groupName', label: '薪资组' },
            { prop: 'cardType', label: '账户类型', display: { dict: 'CARD_TYPE' } },
            { prop: 'account', label: '银行卡号' },
            { prop: 'bankCode', label: '银行类别', display: { dict: 'BANK_TYPE' } },
            { prop: 'areaName', label: '开户区域' },
            { prop: 'bankName', label: '开户行名称' },
            { prop: 'effectiveDate', label: '生效时间', display: { date: 'default' } }
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
                cardType: '',
                account: '',
                areaName: '',
                areaId: '',
                bankCode: '',
                bankName: '',
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
                rules: {required: true, message: '请选择员工工号', trigger: 'change'}
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
              cardType: {
                type: 'select'
              },
              account: {
                // type: 'number',
                rules: { min: 10, max: 30, message: '请输入10到30个以内的数', trigger: 'change' }
              },
              bankCode: {
                disable: true
              },
              areaName: {
                rules: getRule('请选择省市区域', 'change')
              },
              bankName: {
                rules: getRule('请输入开户行名称')
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
              employeeCode: '',
              orgName: '',
              groupName: '',
              cardType: '',
              account: '',
              areaName: '',
              areaId: '',
              bankCode: '',
              bankName: '',
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

      /** 数据填充 */
      fillIn (data) {
        this.table.data = data.accountChangeList
        this.table.editable = false
      },

      /** 权限配置完成事件 */
      handleJurConfig (showMap, disabledMap) {
        this.setTableDisabled(disabledMap)
      },

      /** 设置表格是否可编辑 */
      setTableDisabled (disabledMap) {
        this.table.setting.toolbar = disabledMap.bankCardChangeInfoTable ? [] : this.table.setting.toolbar
        this.table.disable = disabledMap.bankCardChangeInfoTable
      },

      /** 区域选择改变事件 */
      handleAreaChange (data, row) {
        row.areaName = data.areaName
      },

      /** 提交数据格式转换 */
      transformSubmitData (data) {
        const submitData = {}

        submitData.accountChangeList = JSON.parse(JSON.stringify(data))
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

        this.getDetailInfo(row.empEmployeeId, row)
      },

      /** 根据人员id获取详细信息 */
      getDetailInfo (employeeId, row) {
        req('getEmpBankInfo', { empEmployeeId: employeeId }).then(res => {
          if (res) {
            row.groupId = res.groupId
            row.groupName = res.groupName
            row.account = res.account
            row.empAccountId = res.empAccountId
            row.areaId = res.areaId
            row.areaName = res.areaName
            row.cardType = res.cardType
            row.bankCode = res.bankCode
            row.bankName = res.bankName
            row.effectiveDate = res.effectiveDate
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
