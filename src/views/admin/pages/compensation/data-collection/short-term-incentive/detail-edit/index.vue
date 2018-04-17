<template>
  <el-form
    v-loading="loading"
    :element-loading-text="$loadingText"
    ref="form"
    :model="form"
    :rules="rules"
    label-width="120px"
  >
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item prop="employeeName" label="姓名">
          <el-input v-model="form.employeeName" readonly @click.native="handlePersonnelClick" :disabled="disabledItems">
            <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
          </el-input>
          <i-personnel-select
            filterType="all"
            :isShow.sync="isShowPersonnel"
            :defaultSelectedPersonnel="selectedPersonnel"
            @confirm="handlePersonnelDialogConfirm"
            :multiple="false"
          ></i-personnel-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="personnelGroupName" label="人事范围">
          <el-input v-model="form.personnelGroupName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="orgUnitName" label="组织名称">
          <el-input v-model="form.orgUnitName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="checkMonth" label="核算月份">
          <el-date-picker
            v-model="form.checkMonth"
            type="month"
            :disabled="disabledItems"
            :picker-options="checkMonthOptions"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="bestirInfoDto" label="激励信息">
          <i-table
            class="table"
            ref="table"
            :table="table"
            @loaded="handleLoaded"
          >
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="tableScope.clone"
                :cell-class-name="cellClassName"
                border
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
  import req from 'api/compensation/data-collection/short-term-incentive'
  import { getRule } from 'utils/index'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { NewEditor } from './new-editor'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  const RULES = {
    employeeName: getRule('请选择员工', 'change'),
    checkMonth: getRule('请选择核算月份', 'change', 'date')
  }
  export default {
    mixins: [CheckMonthMixin, EditorMixin],
    data () {
      return {
        table: {
          columns: [
            { prop: 'planName', label: '方案', align: 'center', width: '140' },
            { prop: 'planValue', label: '金额', align: 'center', width: '140' }
          ],
          setting: {
            editor: {
              planValue: {
                type: 'number',
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (!value) {
                        return callback(new Error('请输入金额值'))
                      } else if (!(/^[1-9]\d{0,7}(\.\d{1,2})?$/.test(value))) {
                        return callback(new Error('请输入8位以内的正数，最多两位小数'))
                      }
                      callback()
                    }
                  }
                ],
                options: {
                  // min: 10
                }
              },
              planName: {
                type: 'string',
                rules: [
                  {
                    min: 0, max: 60, message: '请输入60个以内的字符', trigger: 'change'
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (!value) {
                        return callback(new Error('请填写激励方案'))
                      }
                      if (this.$refs['table'].clone.filter(v => v.planName === value).length > 1) {
                        return callback(new Error('激励方案不能相同'))
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
              planName: '',
              planValue: ''
            }
          ],
          info: null,
          total: 0,
          showPagebar: false
        },
        isShowPersonnel: false,
        // planNameList: [],
        form: {
          personnelGroupName: '',
          orgUnitCode: '',
          orgUnitName: '',
          orgUnitId: '',
          employeeName: '',
          empEmployeeId: '',
          checkMonth: ''
          // planReward: ''
        },
        tableListClone: [],
        rules: RULES
      }
    },
    created () {
//      if (this.data.id) {
//        this.getBestirsById(this.data.id)
//      }
    },
    props: {
      id: String
    },
    watch: {
      tableListClone () {
        this.form.bestirInfoDto = this.tableListClone
      }
    },
    computed: {
      disabledItems () {
        return this.editorStatus !== '1' && this.editorStatus !== '2'
      }
    },
    methods: {
      /* 删除行操作 */
      deleteRow (scope) {
        this.instance.deleteRow(scope)
      },

      /* 增加行操作 */
      addRow (scope) {
        this.instance.addRow(scope)
      },
      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.getInstance(this.editorStatus, opts)
      },

      /** 获取对应实例 */
      getInstance (editorStatus, opts) {
        switch (editorStatus) {
          case '1':
            return new BaseEditor(opts)
          case '2':
            return new NewEditor(opts)
          default:
            return new Modifier(opts)
        }
      },
      handlePersonnelClick () {
        if (this.editorStatus !== '1' && this.editorStatus !== '2') return
        this.isShowPersonnel = true
      },
      handlePersonnelDialogConfirm (selected) {
        this.form.employeeName = selected[0].employeeName
        this.form.empEmployeeId = selected[0].employeeId
        this.getGroup(this.form.empEmployeeId)
      },
//      rowClickHandler ({ rowClickHandler }, row) {
//        rowClickHandler(row)
//      },
      handleLoaded (vm) {
        this.tableListClone = vm.clone
      },
//      getBestirsById (id) {
//        this.loading = true
//        return req('getBestirsById', { id }).then(res => {
//          if (res) {
//            if (res.checkMonth !== null) {
//              res.checkMonth = this.transformToDate(res.checkMonth)
//            }
//            this.form = res
//            this.table.data = res.bestirInfoDto
//            this.loading = false
//          }
//        })
//      },
      // 选择人员带出人事范围
      getGroup (empEmployeeId) {
        req('getGroup', {empEmployeeId}).then(res => {
          this.form.personnelGroupName = res.personnelGroupName
          this.form.orgUnitName = res.orgUnitName
        })
      },
      initData () {
        this.instance.initData(this.id)
      }
//      transformToDate (value) {
//        return new Date(value.slice(0, 4) + '-' + value.slice(4))
//      }
//      deleteRow (scope) {
//        if (this.$refs['table'].clone.length > 1) {
//          this.$refs['table'].deleteData([scope.row])
//        }
//      },
//      addRow (scope) {
//        let data = Object.assign({}, scope.row)
//        delete data['_id']
//        this.$refs['table'].createData({
//          planId: '',
//          planName: '',
//          planValue: ''
//        })
//      }
    }
  }
</script>
