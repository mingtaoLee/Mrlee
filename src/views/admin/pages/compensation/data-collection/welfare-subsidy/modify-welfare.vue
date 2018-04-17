<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" :model="form" :rules="rules" label-width="120px" ref="modify-welfare">
    <el-row :gutter="5">
      <template v-if="data.id">
        <el-col :span="12">
          <el-form-item prop="personnelGroupCode" label="人事范围代码">
            {{form.personnelGroupCode}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="personnelGroupName" label="人事范围名称">
            {{form.personnelGroupName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="orgUnitCode" label="组织代码">
            {{form.orgUnitCode}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="orgUnitName" label="组织名称">
            {{form.orgUnitName}}
          </el-form-item>
        </el-col>
      </template>
      <el-col :span="12">
        <el-form-item prop="employeeName" label="姓名">
          <el-input
            v-model="form.employeeName"
            :disabled="data.id"
            placeholder="请选择"
            readonly
            @click.native="handleIconClick"
          >
            <i slot="suffix" class="iconfont icon-hr"></i>
          </el-input>
          <i-personnel-select
            ref="personnelSelect"
            :isShow.sync="isShow"
            :defaultSelectedPersonnel="selectedPersonnel"
            :multiple="false"
            filterType="all"
            @confirm="handleConfirm"
            @cancel="handlePersonnelDialogCancel"
          ></i-personnel-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="checkMonth" label="核算月份">
          <el-date-picker
            v-model="form.checkMonth"
            :disabled="data.id"
            :picker-options="checkMonthOptions"
            type="month"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="allowanceInfoList" label="其他数据">
          <i-table
            class="table"
            :table="table"
            ref="table"
            @loaded="handleLoaded"
          >
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="tableScope.clone" :cell-class-name="cellClassName"
                border
                @row-click="rowClickHandler(tableScope, $event)"
              >
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
                    >
                      <i-select
                        v-if="col.prop === 'componentName'"
                        v-model="scope.row.itemKey"
                        :props="itemProps"
                        dataKey="salaryItem"
                        parameter="03"
                        @option-click="handleItemClick($event, scope)"
                        filterable>
                      </i-select>
                      <el-input
                        v-if="col.prop === 'itemValue'"
                        v-model.number="scope.row.itemValue"
                        type="number"
                        @change="handleValueChange($event, scope)"
                      ></el-input>
                    </i-table-cell>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  fixed="right"
                  width="120"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      v-for="(btn, idx) of tableScope.operator" size="mini"
                      :key="idx"
                      type="text"
                      @click="btn.func(scope)">
                      {{ btn.text }}
                </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </i-table>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import CheckMonthMixin from 'mixins/compensation/check-month-mixin'
  import req from 'api/compensation/data-collection/welfare-subsidy'
  import { getRule, getDict } from 'utils/index'

  const RULES = {
    employeeName: getRule('请填写姓名', 'change'),
    checkMonth: getRule('请填写核算月份', 'change', 'date')
  }
  export default {
    mixins: [CheckMonthMixin],
    data () {
      return {
        itemProps: {
          value: 'componentId',
          label: 'componentName'
        },
        rules: RULES,
        table: {
          columns: [
            { prop: 'componentName', label: '项目', align: 'center', width: '140' },
            { prop: 'itemValue', label: '金额', align: 'center', width: '140' }
          ],
          setting: {
            editor: {
              itemValue: {
                rules: [
                  {
                    validator: (rule, value, cb) => {
                      if (!value && value !== 0) return cb(new Error('请输入金额'))
                      if (value < 0 || value >= 100000000) {
                        cb(new Error('请输入8位以内的非负数'))
                      } else {
                        cb()
                      }
                    }
                  }
                ],
                type: 'number',
                options: {
                  min: 10
                }
              },
              componentName: {
                type: 'select',
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (!value) {
                        return callback(new Error('请选择福利项目'))
                      }
                      if (this.$refs['table'].clone.filter(v => v.componentName === value).length > 1) {
                        return callback(new Error('福利项目不能相同'))
                      }
                      callback()
                    }
                  }
                ]
              }
            },
            operator: [
              {
                text: '增加',
                func: this.addRow
              },
              {
                text: '删除',
                func: this.deleteRow
              }
            ]
          },
          editable: true,
          data: [
            {
              componentName: '',
              itemKey: '',
              itemValue: ''
            }
          ],
          info: null,
          total: 0,
          showPagebar: false
        },
        isShow: false,
        personnels: '',
        form: {
          empEmployeeId: '',
          iitTemplateName: '',
          orgCode: '',
          orgName: '',
          employeeCode: '',
          employeeName: '',
          checkMonth: ''
        },
        tableListClone: []
      }
    },
    created () {
      if (this.data.id) {
        this.getAllowancesById(this.data.id)
      }
    },
    props: {
      data: {
        type: Object,
        default: () => {}
      }
    },
    watch: {
      tableListClone () {
        this.form.allowanceInfoList = this.tableListClone
      }
    },
    methods: {
      handleValueChange (value, scope) {
        scope.row.itemValue = parseFloat((scope.row.itemValue).toFixed(2))
      },
      handleItemClick (data, scope) {
//        console.log(data, scope)
        scope.row.componentName = data.componentName
      },
      handleConfirm (selected) {
        this.form.empEmployeeId = selected[0].employeeId
        this.form.employeeCode = selected[0].employeeCode
        this.form.employeeName = selected[0].employeeName
      },
      handleIconClick () {
        this.isShow = !this.isShow
      },
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      handleLoaded (vm) {
        this.tableListClone = vm.clone
      },
      getAllowancesById (id) {
        this.loading = true
        return req('getAllowancesById', { id }).then(res => {
          if (res) {
            if (res.checkMonth !== null) {
              res.checkMonth = this.transformToDate(res.checkMonth)
            }
            this.form = Object.assign(this.form, res)
            res.allowanceInfoList.length > 0 && (this.table.data = res.allowanceInfoList)
            this.loading = false
          }
        })
      },
      transformToDate (value) {
        return new Date(value.slice(0, 4) + '-' + value.slice(4))
      },
      deleteRow (scope) {
//        this.tableListClone.splice(scope.$index, 1)
        if (this.$refs['table'].clone.length > 1) {
          this.$refs['table'].deleteData([scope.row])
        }
      },
      addRow (scope) {
        console.log('fucl', scope)
        let data = Object.assign({}, scope.row)
        delete data['_id']
        this.$refs['table'].createData({
          componentName: '',
          itemKey: '',
          itemValue: ''
        })
//        this.tableListClone.splice(scope.$index, 0, scope.row)
      },
      /** 人员选择取消事件 */
      handlePersonnelDialogCancel () {
        // 如果表单未选中人则重置人员选择
        this.form.employeeId || this.$refs.personnelSelect.resetData()
      },
      /** 初始化数据 */
      initData () {
        // 获取数据
        getDict('ATTENDANCE_ITEM').then(res => {
          if (res) {
//            this.attendanceOptions = this.transformAttendanceOptions(res)
            // 加载详情数据
//            this.instance.initData(this.id)
          }
        })
      }
    }
  }
</script>
