<template>
  <div>
    <el-form
    class="salary-apply"
    ref="form"
    labelWidth="120px"
    :model="form"
    :rules="rules"
    v-cloak>
      <ul class="i-dialog-form">
        <li class="item">
          <el-form-item label="月份:" prop="auditMonth">
            <el-date-picker
              v-model="form.auditMonth"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月份"
              :default-value="defaultDate"
              >
            </el-date-picker>
          </el-form-item>
        </li>
        <li class="item">
          <el-form-item label="工资套类型:" prop="componentListType">
            <i-select
            v-model="form.componentListType"
            parameter="COMPONENT_LIST_TYPE"
            placeholder="请选择"
            @option-click="optionClick"></i-select>
          </el-form-item>
        </li>
      </ul>
      <el-form-item  label="申请原因" prop="auditReason">
          <el-input
          v-model="form.auditReason"
          type="textarea"
          maxlength="100"
          placeholder="请输入申请原因,按照工资性质和范围填写,如:XX大区10月份月度工资出款申请"></el-input>
      </el-form-item>
    </el-form>
      <i-table :table="table">
        <template slot="table" slot-scope="tableScope">
          <el-table :data="tableScope.clone">
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :formatter="tableScope.formatter"
              :align="col.align"
              :minWidth="col.width"
            >
            </el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowProcess"
        title="选择发放过程"
        :toolbar="selectProcessToolbar"
        destroyedWhenClose
        size="huge"
      >
        <add-process ref="addProcess" :firstSearch="firstSearch" :selectType="selectType"></add-process>
      </i-dialog>
  </div>
</template>
<script>
  import AddProcess from './process-table'
  import { showMessage, confirmPopover, windowOpen } from 'utils/index'
  import initMonthMixin from '../../mixins/initMonthMixin'
  // import req from 'api/compensation/check-give/salary-apply'

  export default {
    mixins: [initMonthMixin],
    name: 'AddSalaryApply',
    components: {
      AddProcess
    },
    data () {
      return {
        form: {
          auditMonth: '',
          componentListType: '',
          auditReason: ''
        },
        rules: {
          auditMonth: [{ required: true, message: '请选择月份' }],
          componentListType: [{ required: true, message: '请选薪资组' }],
          auditReason: [{ required: true, message: '请输入申请原因' }]
        },
        isShowProcess: false,
        // 选择发放过程页面
        selectProcessToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          }, {
            text: '确定',
            func: done => {
              this.handleSelect(done)
            }
          }
        ],
        // 表格
        table: {
          columns: [
            { prop: 'areaName', label: '省/区/范围', align: 'left', width: '180' },
            { prop: 'processCode', label: '发放批次号', align: 'left', width: '140' },
            { prop: 'groupName', label: '薪资组名称', align: 'left', width: '140' },
            { prop: 'processName', label: '发放过程名称', align: 'left', width: '140' }
          ],
          setting: {
            operator: [
              {
                text: '移除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '请选择发放过程',
              func: this.selectProcess,
              key: 'payRollAuditSummaryPost'
            }]
          },
          data: []
        },
        firstSearch: null, // 初始筛选条件
        selectType: '' // 工资套类型名称
      }
    },
    created () {
      // 初始筛选条件赋值
      this.getInitMonth()
      this.form.auditMonth = this.searchMonth
      this.form.componentListType = '01'
      this.selectType = '月度工资'
    },
    methods: {
      /** 删除行 */
      deleteRow (scope) {
        confirmPopover('warning', '确认移除该项吗？', () => {
          this.table.data.splice(scope.$index, 1)
        })
      },
      /** 跳转选择发放过程页面的校验 */
      selectProcess () {
        // return new Promise(resolve => {
        //   this.validate().then(res => {
        //     if (res) {
        //       this.firstSearch = res
        //       this.isShowProcess = true
        //     } else {
        //       return showMessage('warning', '请输入初始筛选条件')
        //     }
        //   })
        // })
        if (!this.form.auditMonth || !this.form.componentListType) {
          return showMessage('warning', '月份或工资套未填写')
        } else {
          this.firstSearch = this.form
          this.isShowProcess = true
        }
      },
      /** 选择发放过程页面按钮 */
      handleCancel (done) {
        done()
      },
      /** 确认按钮，判断是否有选择 */
      handleSelect (done) {
        const selectedList = this.$refs.addProcess.selectedList
        if (!selectedList.length) {
          return showMessage('warning', '请至少选择一个发放过程！')
        } else {
          const tableData = this.table.data
          /** 去除重复数据 */
          if (tableData.length) {
            const filterList = selectedList.filter(item => {
              for (let newItem of tableData) {
                if (item.processId === newItem.processId) {
                  return false
                }
              }
              return true
            })
            /** 合并去重后的数据 */
            this.table.data = [...tableData, ...filterList]
          } else {
            this.table.data = selectedList
          }
          done()
        }
      },

       /** 跳转流程页面的数据校验 */
      check () {
        let tableData = this.table.data
        if (!tableData.length) {
          return showMessage('warning', '请至少选择一个发放过程！')
        }
        return new Promise(resolve => {
          this.validate().then(res => {
            if (res) {
              const processIdList = tableData.map(item => {
                return item.processId
              })
              resolve(true)
              res.processIdList = processIdList
              windowOpen(`/flow.html#/flow/paySalaryApprovalProcess`, { processType: 'paySalaryApprovalProcess', arr: encodeURIComponent(JSON.stringify(res)) })
            } else {
              resolve(false)
            }
          })
        })
      },

      /** 数据校验 */
      validate () {
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.form)
            } else {
              resolve(false)
            }
          })
        })
      },
      optionClick (val) {
        this.selectType = val.label
      }
    },
    watch: {
      /** 监听工资套类型，如果发生改变，就清空表格 */
      'form.componentListType' (val, old) {
        this.table.data = []
        if (old) {
          return showMessage('warning', '工资套类型改变,请重新选择发放过程')
        }
      }
    }
  }
</script>
<style lang="scss">
</style>




