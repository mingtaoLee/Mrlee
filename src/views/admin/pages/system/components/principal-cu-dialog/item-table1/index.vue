<template>

  <i-table
    ref="table"
    slot="section"
    v-if="loaded"
    v-clickoutside="saveItems"
    :table="table"
    @pageSizeChange="handleSizeChange"
    @pageIndexChange="handleCurrentChange">
    <template slot="table" slot-scope="tableScope">
      <i-personnel-select :isShow.sync="isPersonShow" :multiple="false" @confirm="handlePersonConfirm"></i-personnel-select>

        <el-table :data="tableScope.clone">
          <el-table-column type="selection"/>

          <el-table-column
            prop="orgUnitCode"
            label="组织编码"
            width="200">
          </el-table-column>

          <el-table-column
            prop="orgUnitId"
            label="组织名字"
            width="200">
            <template slot-scope="scope">
              <i-table-cell :row="scope.row" col="orgUnitId" :table="tableScope" :ref="'cell0-'+scope.$index">
                <i-select-tree
                  v-model="scope.row.orgUnitId"
                  dataKey="org"
                  nodeKey="orgUnitId"
                  @node-click='nodeClick($event, scope.row)'
                  @delete="deleteOrgUnitId($event, scope.row)"
                />
              </i-table-cell>
            </template>
          </el-table-column>

          <el-table-column
            prop="employeeCode"
            label="员工工号"
            width="200">
          </el-table-column>

          <el-table-column
            prop="employeeName"
            label="员工名字"
            width="200">
            <template slot-scope="scope">
                <i-table-cell :row="scope.row" col="employeeName" :table="tableScope" :ref="'cell1-'+scope.$index">
                <el-input
                    v-model="scope.row.employeeName"
                    placeholder="请点击选择员工"
                    ref="waitForCheck"
                    readonly>
                      <i
                        slot="suffix"
                        class="el-icon-menu"
                        @click="showPersonDialog(scope.row)"
                      ></i>
                  </el-input>
                </i-table-cell>
            </template>
          </el-table-column>
        </el-table>

    </template>
  </i-table>
</template>

<script>
// import req from 'api/common/flow.js'
import Clickoutside from 'directives/clickoutside'

export default {
  name: 'ItemTable1',

  directives: {
    Clickoutside
  },
  props: {
    items: {
      required: true,
      type: Array,
      default: null
    }
  },
  data () {
    return {
      valueInputType: 'select',
      table: {
        columns: [
          { label: '组织编码', prop: 'orgUnitCode', minWidth: 200 },
          { label: '组织名字', prop: 'orgUnitName', minWidth: 200 },
          { label: '员工工号', prop: 'employeeCode', minWidth: 200 },
          { label: '员工名字', prop: 'employeeName', minWidth: 300 }
        ],
        data: null,
        showPagebar: false,
        search: null,
        info: null,
        total: 0,
        setting: {
          editor: {
            orgUnitId: {
              type: 'select',
              rules: {
                required: true,
                message: '请选择组织',
                trigger: 'blur'
              }
            },
            employeeName: {
              type: 'input',
              rules: {
                required: true,
                message: '请选择员工',
                trigger: 'blur'
              }
            }
          },
          toolbar: [{
            text: '增加',
            func: vm => vm.createData()
          }, {
            text: '删除',
            type: 'danger',
            func: vm => vm.deleteData()
          }]
        },
        editable: true
      },

      // 追加验证规则
      rules: {
        employeeName: [{ required: true, message: '请选择员工', trigger: 'blur' }],
        empEmployeeId: [{ required: true, message: '请选择员工', trigger: 'blur' }],
        orgUnitId: [{ required: true, message: '请选择组织', trigger: 'blur' }],
        orgUnitName: [{ required: true, message: '请选择组织', trigger: 'blur' }]
      },
      // el-form 临时用于绑定 触发验证
      ruleFromModel: {},
      // 维度下拉列表
      dimensionOpts: {},

      // 数据是否加载完成
      loaded: true,

      isPersonShow: false
    }
  },

  mounted () {
    this.table.data = this.items
  },

  methods: {
    /** 点击表格外面区域保存数据 */
    saveItems () {
      // 自定义下拉未知验证方法

      // HACK: 直接通过table取值
       // const saved = this.$refs.table.saveData()
      const saved = this.$refs.table

       // HACK: 遍历数组 组合refKey进行验证
      let filterData = saved.clone.filter((item, index) => {
        let refKey0 = 'cell0-' + index
        let refKey1 = 'cell1-' + index
        // console.log('访问ref.......')
        // console.info(this.$refs[refKey0])
        // console.info(this.$refs[refKey1])
        if (this.$refs[refKey0] && this.$refs[refKey1]) {
          if (this.$refs[refKey0].validate() && this.$refs[refKey1].validate()) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
      if (saved) this.$emit('saveSettingLists', filterData)
      // console.log(this.$refs.table)
      // console.log('更新提交表单值啦')
      // console.log(saved.clone)
    },
    nodeClick (obj, row) {
      let rowItem = row
      rowItem['orgUnitId'] = obj.orgUnitId
      rowItem['orgUnitCode'] = obj.orgUnitCode
      rowItem['orgPathName'] = obj.orgPathName
      rowItem['orgUnitName'] = obj.orgUnitName
    },
    // 删除组织id，清空对应的内容
    deleteOrgUnitId (obj, row) {
      let rowItem = row
      rowItem['orgUnitId'] = ''
      rowItem['orgUnitCode'] = ''
      rowItem['orgPathName'] = ''
      rowItem['orgUnitName'] = ''
    },

    showPersonDialog (row) {
      this.isPersonShow = true
      this.currentRow = row
    },

    handlePersonConfirm (selectedArr) {
      // clone只包含部分可视化属性?
      // let rowItem = this.$refs.table.clone[this.currentRowIndex]
      let rowItem = this.currentRow
      let obj = selectedArr[0]

      // console.log(obj)
      // console.log(this.$refs.table)
      // console.log(rowItem)

      if (obj) {
        rowItem['employeeCode'] = obj.employeeCode
        rowItem['empEmployeeId'] = obj.employeeId
        rowItem['employeeName'] = obj.employeeName
      } else {
        rowItem['employeeCode'] = ''
        rowItem['empEmployeeId'] = ''
        rowItem['employeeName'] = ''
      }
    }
  }
}
</script>
