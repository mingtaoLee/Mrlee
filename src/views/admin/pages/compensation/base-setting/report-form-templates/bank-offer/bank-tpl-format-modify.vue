<template>
    <el-form :model="form" :rules="rules" v-loading="tplSettingLoading" :element-loading-text="$loadingText" ref="bank-tpl-modify" label-width="130px">
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item prop="bankTemplateName" label="模板名称">
            <el-input v-model="form.bankTemplateName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="zeroInclude" label="零值生成报盘数据">
            <i-select v-model="form.zeroInclude" parameter="WHETHER_TYPE"></i-select>
            <!--<el-input v-model="form.zeroInclude"></el-input>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item prop="rowSeperator" label="行间分隔符">
            <i-select v-model="form.rowSeperator" parameter="ROW_SEPERATOR"></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="userRowSeperator" label="自定义行间分隔符">
            <el-input v-model="form.userRowSeperator" :disabled="form.rowSeperator !== '03'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="columnSeperator" label="列间分隔符">
            <i-select v-model="form.columnSeperator" parameter="COLUMN_SEPERATOR"></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="userColumnSeperator" label="自定义列间分隔符">
            <el-input v-model="form.userColumnSeperator" :disabled="form.columnSeperator !== '06'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-tabs v-model="activeName">
            <el-tab-pane label="首部信息" name="first">
              <i-table
                class="table"
                :table="tableHead"
                ref="tableHead"
                @loaded="handleHeadListLoaded"
              >
                <template slot="table" slot-scope="tableScope">
                  <el-table
                    :data="tableScope.clone"
                    border
                  >
                    <el-table-column
                      v-for="(col, idx) of tableHead.columns"
                      :key="idx"
                      :prop="col.prop"
                      :label="col.label"
                      :minWidth="col.width"
                      :align="col.align"
                      :formatter="tableScope.formatter"
                    >
                      <template slot-scope="scope">
                        <i-table-cell
                          :row="scope.row"
                          :col="col.prop"
                          :table="tableScope"
                          ref="tableHeadCell"
                          @change="handleHeadTableCellChange"
                        ></i-table-cell>
                      </template>
                    </el-table-column>
                    <i-table-operator :table="tableScope" width="180" scope></i-table-operator>
                  </el-table>
                </template>
              </i-table>
            </el-tab-pane>
            <el-tab-pane label="主体信息" name="second">
              <i-table
                class="table"
                :table="tableMain"
                ref="tableMain"
                @loaded="handleBodyListLoaded"
              >
                <template slot="table" slot-scope="tableScope">
                  <el-table
                    :data="tableScope.clone"
                    border
                  >
                    <el-table-column
                      v-for="(col, idx) of tableMain.columns"
                      :key="idx"
                      :prop="col.prop"
                      :label="col.label"
                      :minWidth="col.width"
                      :align="col.align"
                      :formatter="tableScope.formatter"
                    >
                      <template slot-scope="scope">
                        <i-table-cell
                          :row="scope.row"
                          :col="col.prop"
                          :table="tableScope"
                          ref="tableMainCell"
                          @change="handleMainTableCellChange"
                        >
                          <template v-if="col.prop === 'itemContent'">
                            <i-select
                              key="bank1"
                              v-if="scope.row.itemType === '02'"
                              v-model="scope.row.itemContent"
                              :props="itemProps"
                              dataKey="salaryItem"
                              @option-click="handleSalaryItemClick($event, scope)"
                            ></i-select>
                            <i-select
                              key="bank2"
                              v-if="scope.row.itemType === '03'"
                              parameter="BANK_EMPLOYEE_INFO"
                              v-model="scope.row.itemContent"
                              @option-click="handleItemClick($event, scope)"
                            ></i-select>
                          </template>
                        </i-table-cell>
                      </template>
                    </el-table-column>
                    <i-table-operator :table="tableScope" width="180" scope></i-table-operator>
                  </el-table>
                </template>
              </i-table>
            </el-tab-pane>
            <el-tab-pane label="尾部信息" name="third">
              <i-table
                class="table"
                :table="tableTail"
                ref="tableTail"
                @loaded="handleTailListLoaded"
              >
                <template slot="table" slot-scope="tableScope">
                  <el-table
                    :data="tableScope.clone"
                    border
                  >
                    <el-table-column
                      v-for="(col, idx) of tableTail.columns"
                      :key="idx"
                      :prop="col.prop"
                      :label="col.label"
                      :minWidth="col.width"
                      :align="col.align"
                      :formatter="tableScope.formatter"
                    >
                      <template slot-scope="scope">
                        <i-table-cell
                          :row="scope.row"
                          :col="col.prop"
                          :table="tableScope"
                          ref="tableTailCell"
                          @change="handleTailTableCellChange"
                        ></i-table-cell>
                      </template>
                    </el-table-column>
                    <i-table-operator :table="tableScope" width="180" scope></i-table-operator>
                  </el-table>
                </template>
              </i-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-form>
</template>
<script>
  import req from 'api/compensation/base-setting/bank-offer'
  import BankTaxMixin from 'mixins/compensation/bank-tax-mixin'

  const tableColumns = [
    { prop: 'itemType', label: '项目类型', width: '250', align: 'center', display: { dict: 'BANK_TEMPLATE_ITEM_TYPE' } },
    { prop: 'itemContent', label: '内容', width: '300', align: 'center' },
    { prop: 'itemLength', label: '长度', width: '100', align: 'center' },
    { prop: 'alignMode', label: '对齐方式', width: '250', align: 'center', display: { dict: 'ALIGN_MODE' } },
    { prop: 'fillMode', label: '补位方式', width: '300', align: 'center', display: { dict: 'FILL_MODE' } },
    { prop: 'isDecimalPoint', label: '输出小数点', width: '100', align: 'center', display: { dict: 'WHETHER_TYPE' } },
    { prop: 'isThousSeperator', label: '输出千位分隔符', width: '100', align: 'center', display: { dict: 'WHETHER_TYPE' } },
    { prop: 'dateFormat', label: '日期格式', width: '250', align: 'center', display: { dict: 'DATE_FORMAT' } }
  ]
  const tableEditor = {
    itemType: {
      disable: false,
      type: 'select',
      rules: [{
        validator: (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请选择项目类型'))
          }
          callback()
        }
      }]
    },
    itemContent: {
      disable: false,
      rules: [{
        min: 0, max: 20, message: '请输入20个以内的字', trigger: 'change'
      }, {
        validator: (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请输入内容'))
          }
          callback()
        }
      }]
    },
    itemLength: {
      disable: false,
      type: 'number',
      rules: [{
        pattern: /^\+?[1-9][0-9]*$/, message: '请输入整数', trigger: 'change'
      }, {
        max: 999, message: '请输入百位以内的数', trigger: 'change', type: 'number'
      }, {
        validator: (rule, value, callback) => {
          if (value <= 0) {
            return callback(new Error('长度必须大于0'))
          }
          callback()
        }
      }]
    },
    alignMode: {
      disable: false,
      type: 'select',
      rules: [{
        validator: (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请选择对齐方式'))
          }
          callback()
        }
      }]
    },
    fillMode: {
      disable: false,
      type: 'select',
      rules: [{
        validator: (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请选择补位方式'))
          }
          callback()
        }
      }]
    },
    isDecimalPoint: {
      disable: false,
      type: 'select',
      rules: [{
        validator: (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请选择输出小数点'))
          }
          callback()
        }
      }]
    },
    isThousSeperator: {
      disable: false,
      type: 'select',
      rules: [{
        validator: (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请选择输出千位分隔符'))
          }
          callback()
        }
      }]
    },
    dateFormat: {
      disable: false,
      type: 'select',
      rules: [{
        validator: (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请选择日期格式'))
          }
          callback()
        }
      }]
    }
  }
  export default {
    mixins: [BankTaxMixin],
    data () {
      return {
        // 公司薪资项目配置
        itemProps: {
          value: 'componentId',
          label: 'componentName'
        },
        tableHead: {
          columns: tableColumns,
          setting: {
            operator: [
              {
                text: '增加',
                func: (scope) => {
                  let data = Object.assign({}, scope.row, {})
                  data.templateContentId = ''
                  delete data._id
                  // this.tabData.bankTmpContentHeadDto.splice(scope.$index, 0, data)
                  // console.log(scope, this.tabData.bankTmpContentHeadDto)
                  this.$refs['tableHead'].createData({})
                }
              },
              {
                text: '删除',
                func: (scope) => {
                  if (this.tabData.bankTmpContentHeadDto.length > 1) {
                    // this.tabData.bankTmpContentHeadDto.splice(scope.$index, 1)
                    this.$refs['tableHead'].deleteData([scope.row])
                    this.addDeleteIdAction(scope)
                  }
                }
              }, {
                text: '上移',
                func: (scope) => {
                  if (scope.$index !== 0) {
                    const data = this.tableListMoveUp(scope, this.tabData.bankTmpContentHeadDto)
                    this.tabData.bankTmpContentHeadDto = data
                  }
                }
              }, {
                text: '下移',
                func: (scope) => {
                  if (scope.$index + 1 !== this.tabData.bankTmpContentHeadDto.length) {
                    const data = this.tableListMoveDown(scope, this.tabData.bankTmpContentHeadDto)
                    this.tabData.bankTmpContentHeadDto = data
                  }
                }
              }
            ],
            editor: tableEditor
          },
          editable: true,
          data: [],
          info: null,
          total: 0,
          showPagebar: false
        },
        tableMain: {
          columns: [
            { prop: 'itemType', label: '项目类型', width: '250', align: 'center', display: { dict: 'BANK_TEMPLATE_BODY_TYPE' } },
            { prop: 'itemContent', label: '内容', width: '300', align: 'center' },
            { prop: 'itemLength', label: '长度', width: '100', align: 'center' },
            { prop: 'alignMode', label: '对齐方式', width: '250', align: 'center', display: { dict: 'ALIGN_MODE' } },
            { prop: 'fillMode', label: '补位方式', width: '300', align: 'center', display: { dict: 'FILL_MODE' } },
            { prop: 'isDecimalPoint', label: '输出小数点', width: '100', align: 'center', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'isThousSeperator', label: '输出千位分隔符', width: '100', align: 'center', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'dateFormat', label: '日期格式', width: '250', align: 'center', display: { dict: 'DATE_FORMAT' } }
          ],
          setting: {
            operator: [
              {
                text: '增加',
                func: (scope) => {
                  let data = Object.assign({}, scope.row, {})
                  data.templateContentId = ''
                  delete data._id
                  this.$refs['tableMain'].createData({})
                  // this.tabData.bankTmpContentBodyDto.splice(scope.$index, 0, scope.row)
                }
              },
              {
                text: '删除',
                func: (scope) => {
                  if (this.tabData.bankTmpContentBodyDto.length > 1) {
                    this.$refs['tableMain'].deleteData([scope.row])
                    // this.tabData.bankTmpContentBodyDto.splice(scope.$index, 1)
                    this.addDeleteIdAction(scope)
                  }
                }
              }, {
                text: '上移',
                func: (scope) => {
                  if (scope.$index !== 0) {
                    const data = this.tableListMoveUp(scope, this.tabData.bankTmpContentBodyDto)
                    this.tabData.bankTmpContentBodyDto = data
                  }
                }
              }, {
                text: '下移',
                func: (scope) => {
                  if (scope.$index + 1 !== this.tabData.bankTmpContentBodyDto.length) {
                    const data = this.tableListMoveDown(scope, this.tabData.bankTmpContentBodyDto)
                    this.tabData.bankTmpContentBodyDto = data
                  }
                }
              }
            ],
            editor: tableEditor
          },
          editable: true,
          data: [],
          info: null,
          total: 0,
          showPagebar: false
        },
        tableTail: {
          columns: tableColumns,
          setting: {
            operator: [
              {
                text: '增加',
                func: (scope) => {
                  let data = Object.assign({}, scope.row)
                  data.templateContentId = ''
                  delete data._id
                  this.$refs['tableTail'].createData({})
                  // this.tabData.bankTmpContentTailDto.splice(scope.$index, 0, scope.row)
                }
              },
              {
                text: '删除',
                func: (scope) => {
                  if (this.tabData.bankTmpContentTailDto.length > 1) {
                    // this.tabData.bankTmpContentTailDto.splice(scope.$index, 1)
                    this.$refs['tableTail'].deleteData([scope.row])
                    this.addDeleteIdAction(scope)
                  }
                }
              }, {
                text: '上移',
                func: (scope) => {
                  if (scope.$index !== 0) {
                    const data = this.tableListMoveUp(scope, this.tabData.bankTmpContentTailDto)
                    this.tabData.bankTmpContentTailDto = data
                  }
                }
              }, {
                text: '下移',
                func: (scope) => {
                  if (scope.$index + 1 !== this.tabData.bankTmpContentTailDto.length) {
                    const data = this.tableListMoveDown(scope, this.tabData.bankTmpContentTailDto)
                    this.tabData.bankTmpContentTailDto = data
                  }
                }
              }
            ],
            editor: tableEditor
          },
          editable: true,
          data: [],
          info: null,
          total: 0,
          showPagebar: false
        },

        form: {},
        tabData: {},
        tplSettingLoading: true,
        activeName: 'first'
      }
    },
    props: {
      bankTemplateId: {
        type: String,
        default: ''
      }
    },
    created () {
      this.getBankTplContent(this.bankTemplateId)
    },
    watch: {
      form () {
        const bankTmpContentHeadDto = this.form.bankTmpContentHeadDto
        const bankTmpContentBodyDto = this.form.bankTmpContentBodyDto
        const bankTmpContentTailDto = this.form.bankTmpContentTailDto
        const defaultData = [{
//          templateContentId: '',
//          bankTemplateId: '',
          itemType: '',
          itemContent: '',
          columnsType: null,
          itemLength: '',
          fillMode: '',
          alignMode: '',
          isDecimalPoint: '',
          isThousSeperator: '',
          dateFormat: ''
        }]
        if (bankTmpContentHeadDto.length > 0) {
          this.tableHead.data = bankTmpContentHeadDto
        } else if (bankTmpContentHeadDto.length === 0) {
          this.tableHead.data = defaultData
        }
        if (bankTmpContentBodyDto.length > 0) {
          this.tableMain.data = bankTmpContentBodyDto
        } else if (bankTmpContentBodyDto.length === 0) {
          this.tableMain.data = defaultData
        }
        if (bankTmpContentTailDto.length > 0) {
          this.tableTail.data = bankTmpContentTailDto
        } else if (bankTmpContentTailDto.length === 0) {
          this.tableTail.data = defaultData
        }
      },
      bankTemplateId () {
        this.getBankTplContent(this.bankTemplateId)
      }
    },
    methods: {
      addDeleteIdAction (scope) {
        const id = scope.row.templateContentId
        if (id) {
          !this.form.readyToDel && (this.form.readyToDel = [])
          this.form.readyToDel.push(id)
        }
      },
      getBankTplContent (bankTemplateId) {
        bankTemplateId && req('getBankTplContent', { bankTemplateId }).then(res => {
          // console.log('getBankTplContent?', res)
          if (res) {
            this.form = res
            // Hack: 初始化数据时强制触发tableCell的change事件，以进行动态校验
            this.changeTableCellRules('tableHeadCell', 'tableMainCell', 'tableTailCell')
            this.tplSettingLoading = false
          }
        })
      },
      handleHeadListLoaded (vm) {
        this.tabData.bankTmpContentHeadDto = vm.clone
      },
      handleBodyListLoaded (vm) {
        this.tabData.bankTmpContentBodyDto = vm.clone
      },
      handleTailListLoaded (vm) {
        this.tabData.bankTmpContentTailDto = vm.clone
      },
      tableListMoveUp (scope, data) {
        let tableData = data
        let delItem = tableData.splice(scope.$index, 1)
        tableData.splice(scope.$index - 1, 0, delItem[0])
        // console.log('move up', tableData)
        return tableData
      },
      tableListMoveDown (scope, data) {
        let tableData = data
        let delItem = tableData.splice(scope.$index, 1)
        tableData.splice(scope.$index + 1, 0, delItem[0])
        // console.log('move down', tableData)
        return tableData
      },
      getTableData () {
        return {
          form: this.form,
          tabData: this.tabData
        }
      },
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      handleItemClick (data, scope) {
        scope.row.itemContent = data.value
      },
      updateTableRules (data, refsName) {
        tableColumns.forEach(v => {
          if (v.prop !== 'itemType') {
            (!this.isInitTableRules) && (data.row[v.prop] = '')
            if (data.val === '04') {
              data.updateDisabled(true, this.$refs[refsName], v.prop)
              data.updateRules([], this.$refs[refsName], v.prop)
            } else if (data.val === '01') {
              if (v.prop === 'isDecimalPoint' || v.prop === 'isThousSeperator' || v.prop === 'dateFormat') {
                data.updateDisabled(true, this.$refs[refsName], v.prop)
                data.updateRules([], this.$refs[refsName], v.prop)
              } else {
                data.updateDisabled(false, this.$refs[refsName], v.prop)
                data.updateRules(tableEditor[v.prop].rules, this.$refs[refsName], v.prop)
              }
            } else if (data.val === '05') {
              if (v.prop === 'alignMode' || v.prop === 'dateFormat') {
                data.updateDisabled(false, this.$refs[refsName], v.prop)
                data.updateRules(tableEditor[v.prop].rules, this.$refs[refsName], v.prop)
              } else {
                data.updateDisabled(true, this.$refs[refsName], v.prop)
                data.updateRules([], this.$refs[refsName], v.prop)
              }
            } else {
              data.updateDisabled(false, this.$refs[refsName], v.prop)
              data.updateRules(tableEditor[v.prop].rules, this.$refs[refsName], v.prop)
            }
          }
        })
      },
      handleHeadTableCellChange (data) {
        if (data.col === 'itemType') {
          this.updateTableRules(data, 'tableHeadCell')
        }
      },
      handleTailTableCellChange (data) {
        if (data.col === 'itemType') {
          this.updateTableRules(data, 'tableTailCell')
        }
      },
      handleMainTableCellChange (val) {
        if (val.col === 'itemType') {
          (!this.isInitTableRules) && (val.row.itemContent = '')
          if (val.val === '02' || val.val === '03') {
            val.updateRules([{
              required: true, message: '内容不能为空'
            }], this.$refs['tableMainCell'], 'itemContent')
          } else {
            val.updateRules(tableEditor.itemContent.rules, this.$refs['tableMainCell'], 'itemContent')
          }
        }
        if (val.col === 'itemContent') {
          val.row.itemContent = val.val
        }
      },
      handleSalaryItemClick (data, scope) {
        scope.row.itemContent = data.componentId
      }
    },
    components: {
    }
  }
</script>
