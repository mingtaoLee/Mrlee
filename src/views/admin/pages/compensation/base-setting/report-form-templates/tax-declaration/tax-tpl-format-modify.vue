<template>
  <el-tabs v-model="activeName" @tab-click="tabClick">
    <el-tab-pane label="表头信息" name="first">
      <i-table
        class="table"
        :table="table"
        ref="table"
        @loaded="handleHeadListLoaded"
        @pageSizeChange="headListHandleSizeChange"
        @pageIndexChange="headListHandleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            border
            @row-dblclick="rowClickHandler(tableScope, $event)">
            <el-table-column
              v-for="(col, idx) of table.columns"
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
                  ref="tableCell"
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
        @pageSizeChange="bodyListHandleSizeChange"
        @pageIndexChange="bodyListHandleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            border
            @row-dblclick="rowClickHandler(tableScope, $event)">
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
                  <template v-if="col.prop === 'itemContentFake'">
                    <i-select
                      key="tax1"
                      v-if="scope.row.itemType === '04'"
                      v-model="scope.row.itemContent"
                      :props="itemProps"
                      dataKey="salaryItem"
                      @option-click="handleSalaryItemClick($event, scope)"
                      :filterable="filterable"
                      :allow-create="allowCreate"
                      :clearable="false"
                    ></i-select>
                    <i-select
                      key="tax2"
                      v-else-if="scope.row.itemType === '03'"
                      parameter="EMPLOYEE_INFO"
                      v-model="scope.row.itemContent"
                      @option-click="handleItemClick($event, scope)"
                      :clearable="false"
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
  </el-tabs>
</template>
<script>
  import { getSelectData, getDict } from 'utils/index'
  import BankTaxMixin from 'mixins/compensation/bank-tax-mixin'
  const TABLEHEADEDITOR = {
    itemType: {
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
    columnsType: {
      type: 'select',
      rules: [{
        validator: (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请选择字段类型'))
          }
          callback()
        }
      }]
    }
  }
  const TABLEMAINEDITOR = {
    itemType: {
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
    itemContentFake: {
      rules: [{
        min: 0, max: 20, message: '请输入20个以内的字', trigger: 'change'
      }, {
        required: true, message: '请输入内容', trigger: 'change'
      }]
    },
    columnsType: {
      type: 'select',
      rules: [{
        required: true, message: '请选择字段类型', trigger: 'change'
      }]
    },
    isSum: {
      type: 'select',
      rules: [{
        required: true, message: '请选择是否汇总', trigger: 'change'
      }]
    },
    alignMode: {
      type: 'select',
      rules: [{
        required: true, message: '请选择对齐方式', trigger: 'change'
      }]
    },
    isDecimalPoint: {
      type: 'select',
      rules: [{
        required: true, message: '请选择输出小数点', trigger: 'change'
      }]
    },
    isThousSeperator: {
      type: 'select',
      rules: [{
        required: true, message: '请选择输出千位分隔符', trigger: 'change'
      }]
    },
    datePattern: {
      type: 'select',
      rules: [{
        required: true, message: '请选择日期格式', trigger: 'change'
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
        table: {
          columns: [
            { prop: 'itemType', label: '项目类型', width: '250', align: 'center', display: { dict: 'ITEM_TYPE_TABLE_HEAD' } },
            { prop: 'itemContent', label: '内容', width: '300', align: 'center' },
            { prop: 'columnsType', label: '字段类型', width: '250', align: 'center', display: { dict: 'COLUMNS_TYPE_TABLE_BODY' } }
          ],
          setting: {
            operator: [
              {
                text: '增加',
                func: (scope) => {
                  let data = Object.assign({}, scope.row, {})
                  data.templateContentId = ''
                  delete data._id
                  this.$refs['table'].createData(data)
                  // this.headList.splice(scope.$index, 0, scope.row)
                }
              },
              {
                text: '删除',
                func: (scope) => {
                  if (this.headList.length > 1) {
                    // this.headList.splice(scope.$index, 1)
                    this.$refs['table'].deleteData([scope.row])
                    const id = scope.row.templateContentId
                    // id && this.form.templateContentIdList.push(id)
                    if (id) {
                      !this.form.templateContentIdList && (this.form.templateContentIdList = [])
                      this.form.templateContentIdList.push(id)
                    }
                  }
                }
              }, {
                text: '上移',
                func: (scope) => {
                  if (scope.$index !== 0) {
                    const data = this.tableListMoveUp(scope, this.headList)
                    this.headList = data
                  }
                }
              }, {
                text: '下移',
                func: (scope) => {
                  if (scope.$index + 1 !== this.headList.length) {
                    const data = this.tableListMoveDown(scope, this.headList)
                    this.headList = data
                  }
                }
              }
            ],
            editor: TABLEHEADEDITOR
          },
          editable: true,
          data: [
            // {
            //   itemType: 'asds',
            //   itemContent: 'xxx',
            //   columnsType: 'vxv'
            // }
          ],
          info: null,
          total: 0,
          showPagebar: false
        },
        tableMain: {
          columns: [
            { prop: 'itemType', label: '项目类型', width: '250', align: 'center', display: { dict: 'ITEM_TYPE' } },
            { prop: 'itemContentFake', label: '内容', width: '300', align: 'center' },
            { prop: 'columnsType', label: '字段类型', width: '250', align: 'center', display: { dict: 'COLUMNS_TYPE' } },
            { prop: 'isSum', label: '是否汇总', width: '120', align: 'center', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'alignMode', label: '对齐方式', width: '250', align: 'center', display: { dict: 'ALIGN_MODE' } },
            { prop: 'isDecimalPoint', label: '输出小数点', width: '200', align: 'center', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'isThousSeperator', label: '输出千位分隔符', width: '200', align: 'center', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'datePattern', label: '日期格式', width: '250', align: 'center', display: { dict: 'DATE_FORMAT' } }
          ],
          setting: {
            operator: [
              {
                text: '增加',
                func: (scope) => {
                  let data = Object.assign({}, scope.row, {})
                  data.templateContentId = ''
                  delete data._id
                  this.$refs['tableMain'].createData(data)
                  // this.bodyList.splice(scope.$index, 0, scope.row)
                }
              },
              {
                text: '删除',
                func: (scope) => {
                  if (this.bodyList.length > 1) {
                    // this.bodyList.splice(scope.$index, 1)
                    this.$refs['tableMain'].deleteData([scope.row])
                    const id = scope.row.templateContentId
                    // id && this.form.templateContentIdList.push(id)
                    if (id) {
                      !this.form.templateContentIdList && (this.form.templateContentIdList = [])
                      this.form.templateContentIdList.push(id)
                    }
                  }
                }
              }, {
                text: '上移',
                func: (scope) => {
                  if (scope.$index !== 0) {
                    const data = this.tableListMoveUp(scope, this.bodyList)
                    this.bodyList = data
                  }
                }
              }, {
                text: '下移',
                func: (scope) => {
                  if (scope.$index + 1 !== this.bodyList.length) {
                    const data = this.tableListMoveDown(scope, this.bodyList)
                    this.bodyList = data
                  }
                }
              }
            ],
            editor: TABLEMAINEDITOR
          },
          editable: true,
          data: [
            // {
            //   itemType: '项目类型(【模板项目类型】)',
            //   itemContent: '项目内容',
            //   columnsType: '字段类型(【字段类型】)',
            //   isSum: '是否汇总',
            //   alignMode: '对齐方式(【对齐方式】)',
            //   isDecimalPoint: '输出小数点',
            //   isThousSeperator: '输出千位分隔符',
            //   datePattern: '日期格式(【日期格式类型】)'
            // }
          ],
          info: null,
          total: 0,
          showPagebar: false
        },
        headList: [],
        bodyList: [],
        activeName: 'first',
        salaryItemArr: [],
        employeeInfoArr: []
      }
    },
    props: {
      form: {
        type: Object,
        default: () => {
          return {
            headList: [],
            bodyList: [],
            templateContentIdList: []
          }
        }
      }
    },
    created () {
    },
    watch: {
      async form () {
        const headList = this.form.headList
        const bodyList = this.form.bodyList
        if (headList.length > 0) {
          this.table.data = headList
        } else if (headList.length === 0) {
          this.table.data = [{
            itemType: '',
            itemContent: '',
            columnsType: ''
          }]
        }
        if (bodyList.length > 0) {
//          await this.getItemContentData()
//          console.log(this.salaryItemArr, this.employeeInfoArr)
          this.tableMain.data = bodyList
        } else if (bodyList.length === 0) {
          this.tableMain.data = [{
            itemType: '',
            itemContent: '',
            columnsType: '',
            isSum: '',
            alignMode: '',
            isDecimalPoint: '',
            isThousSeperator: '',
            datePattern: ''
          }]
        }
      }
    },
    methods: {
      getItemContentData () {
        return Promise.all([
          getSelectData(`/compensation/basic/pay-components/search`, false),
          getDict('EMPLOYEE_INFO')
        ]).then((res) => {
          this.salaryItemArr = res[0]
          this.employeeInfoArr = res[1]
        })
      },
      getContent (row, col) {
        if (row.itemType === '04' && this.salaryItemArr.length > 0 && row.itemContent) {
//          console.log(this.salaryItemArr)
          return this.salaryItemArr.filter(v => v.componentId === row.itemContent)[0].componentName
        } else if (row.itemType === '03' && this.employeeInfoArr.length > 0 && row.itemContent) {
//          console.log(this.employeeInfoArr, row.itemContent)
          return this.employeeInfoArr.filter(v => v.value === row.itemContent)[0].label
        } else {
          return row.itemContentFake || row.itemContent
        }
      },
      handleChangeRules (val) {
        let tableMainProps = this.tableMain.columns.map(v => v.prop)
        let selectContentRules = [{
          required: true, message: '内容不能为空'
        }]
        tableMainProps.forEach(v => {
          if (v !== 'itemType') {
            if (val.val === '01') {
              if (v === 'alignMode' || v === 'itemContentFake') {
                val.updateRules(TABLEMAINEDITOR[v].rules, this.$refs['tableMainCell'], v)
              } else {
                val.updateRules([], this.$refs['tableMainCell'], v)
              }
            } else if (val.val === '02') {
              if (v === 'alignMode' || v === 'itemContentFake' || v === 'isSum') {
                val.updateRules(TABLEMAINEDITOR[v].rules, this.$refs['tableMainCell'], v)
              } else {
                val.updateRules([], this.$refs['tableMainCell'], v)
              }
            } else if (val.val === '03') {
              if (v === 'itemContentFake') {
                val.updateRules(selectContentRules, this.$refs['tableMainCell'], 'itemContentFake')
              } else if (v === 'alignMode') {
                val.updateRules(TABLEMAINEDITOR[v].rules, this.$refs['tableMainCell'], v)
              } else {
                val.updateRules([], this.$refs['tableMainCell'], v)
              }
            } else if (val.val === '04') {
              if (v === 'itemContentFake') {
                val.updateRules(selectContentRules, this.$refs['tableMainCell'], 'itemContentFake')
              } else if (v === 'alignMode' || v === 'isDecimalPoint' || v === 'isThousSeperator') {
                val.updateRules(TABLEMAINEDITOR[v].rules, this.$refs['tableMainCell'], v)
              } else {
                val.updateRules([], this.$refs['tableMainCell'], v)
              }
            } else {
              val.updateRules(TABLEMAINEDITOR[v].rules, this.$refs['tableMainCell'], v)
            }
          }
        })
      },
      handleMainTableCellChange (val) {
        console.log('suck', val)
        if (val.col === 'itemType') {
          if (!this.isInitTableRules) {
            val.row.itemContent = ''
            val.row.itemContentFake = ''
          }
          this.handleChangeRules(val)
        }
        if (val.col === 'itemContentFake') {
          val.row.itemContent = val.val
        }
      },
      handleHeadListLoaded (vm) {
        this.headList = vm.clone
      },
      handleBodyListLoaded (vm) {
        this.bodyList = vm.clone
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
          headList: this.headList,
          bodyList: this.bodyList
        }
      },
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      selectionChangeHandler () {},
      bodyListHandleSizeChange (options) {
        this.$emit('bodyListHandleSizeChange', options)
      },
      bodyListHandleCurrentChange (options) {
        this.$emit('bodyListHandleCurrentChange', options)
      },
      headListHandleSizeChange (options) {
        this.$emit('headListHandleSizeChange', options)
      },
      headListHandleCurrentChange (options) {
        this.$emit('headListHandleCurrentChange', options)
      },
      tabClick (tab, event) {
        // console.log(tab, event)
      },
      handleSalaryItemClick (data, scope) {
        scope.row.itemContent = data.componentId
        scope.row.itemContentFake = data.componentId
      },
      handleItemClick (data, scope) {
        // console.log(data, scope)
        scope.row.itemContent = data.value
        scope.row.itemContentFake = data.label
      }
    },
    components: {
    }
  }
</script>
