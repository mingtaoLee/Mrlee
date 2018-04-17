<template>
  <i-layout v-loading="loading" :element-loading-text="$loadingText" headerKey="payRollAuditGet">
    <i-form @reset="reset" @search="search" slot="header">

      <el-form-item label="申请人姓名:">
          <el-input v-model="form.createBy" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="申请原因:">
          <el-input v-model="form.auditReason" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item label="核算月份:">
        <el-date-picker
          v-model="form.auditMonth"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月份"
          >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="审批状态:">
          <i-select v-model="form.auditStauts" parameter="AUDIT_STATUS" placeholder="请选择"></i-select>
      </el-form-item>

      <el-form-item label="申请时间起:">
        <el-date-picker
          v-model="form.createDate"
          type="date"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions1"
          >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="至:">
        <el-date-picker
          v-model="form.endDate"
          type="date"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions2"
          >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="总额起:">
          <el-input type="number" v-model.number="form.finalPayingAmount"></el-input>
      </el-form-item>

      <el-form-item label="至:">
          <el-input type="number" v-model.number="form.finalPayingAmountMax"></el-input>
      </el-form-item> 

    </i-form>

    <template slot="section">
      <i-table
        class="table"
        :table="table"
        ref="table"
        v-loading="pageLoading"
        :element-loading-text="$loadingText"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableScope.clone"
            border
            @selection-change="selectionChangeHandler(tableScope, $event)">
            <!-- <el-table-column type="selection" width="50" align="right"/> -->
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              :align="col.align"
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
            >
            </el-table-column>

          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowApply"
        title="新增用款申请"
        :toolbar="addApplyToolbar"
        destroyedWhenClose
        size="large"
      >
        <add-salaryapply ref="addSalaryapply"></add-salaryapply>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req from 'api/compensation/check-give/salary-apply'
  import AddSalaryapply from './add-salary-apply'
  // import { showMessage } from 'utils/index'
  import Access from 'mixins/access'
  import PaginationMixins from '../mixins/paginationMixins'

  export default {
    name: 'salaryApply',
    mixins: [PaginationMixins, Access],
    components: {
      AddSalaryapply
    },
    data () {
      return {
        // 查询表单数据汇总
        form: {
          auditReason: '',
          auditMonth: '',
          auditStauts: '',
          createBy: '',
          createDate: null,
          endDate: null,
          finalPayingAmount: '',
          finalPayingAmountMax: ''
        },
        // 新增用款申请页面
        addApplyToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          }, {
            text: '下一步',
            func: done => {
              this.handleNext(done)
            }
          }
        ],
        isShowApply: false,
        loading: true,
        // 时间限制
        pickerOptions1: {
          disabledDate: (time) => {
            if (!this.form.endDate) return false
            return time.getTime() > new Date(this.form.endDate) - 24 * 3600 * 1000
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            if (!this.form.createDate) return false
            return time.getTime() < new Date(this.form.createDate) - 24 * 3600 * 1000
          }
        },
        // 表格
        table: {
          columns: [
            { prop: 'auditReason', label: '申请原因', width: '200', align: 'left', sortable: true },
            { prop: 'auditMonth', label: '核算月份', width: '160', align: 'left', sortable: true },
            { prop: 'auditStauts', label: '审批状态', align: 'left', width: '200', display: { dict: 'AUDIT_STATUS' }, sortable: true },
            { prop: 'totalNumber', label: '人数', align: 'left', width: '160', sortable: true },
            { prop: 'finalPayingAmount', label: '总额', align: 'center', width: '160', sortable: true },
            { prop: 'createDate', label: '申请时间', align: 'center', width: '180', display: { date: 'long' }, sortable: true },
            { prop: 'createBy', label: '申请人姓名', align: 'center', sortable: true }
          ],
          setting: {
            toolbar: [{
              text: '新增用款申请',
              func: this.addSalaryApply,
              key: 'payRollAuditProcessListGet'
            }]
          },
          data: [],
          info: null,
          total: 0,
          showPagebar: true,
          search: null
        }
      }
    },
    methods: {
      fetch (options = {}) {
        req('getSalaryApplyList', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.pageLoading = false
          this.loading = false
        })
      },
      /** 新增按钮函数 */
      addSalaryApply () {
        this.openaddSalaryApply()
      },
      /** 弹窗显示 */
      openaddSalaryApply () {
        this.isShowApply = true
      },
      /** 新增用款申请页面按钮 */
      handleCancel (done) {
        done()
      },
      handleNext (done) {
        this.$refs.addSalaryapply.check().then(res => {
          if (res) {
            done()
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>


