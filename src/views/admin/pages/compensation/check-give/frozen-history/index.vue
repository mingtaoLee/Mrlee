<template>
  <section>
  <i-layout v-loading="loading" :element-loading-text="$loadingText" headerKey="payBlockedRecordsListGet">
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="出款月份:">
         <el-date-picker
            v-model="form.payMonth"
            value-format="yyyy-MM"
            type="month"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="所属组织:">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="form.unitId"
            lazy
            size="small"
          ></i-select-tree>
      </el-form-item>
      <el-form-item label="薪资组:">
        <remote-select
          v-model="form.groupId"
          :props="groupProps"
          dataKey="salaryGroup"
          :multiple="false"
          :collapseTags="false"
          :displayKeys="displayKeys"
          filterable
        ></remote-select>
      </el-form-item>
      <el-form-item label="员工状态:">
          <i-select v-model="form.employeeStatus" parameter="EMPLOYEE_STATUS"></i-select>
      </el-form-item>
      <el-form-item label="冻结原因:">
          <i-select v-model="form.blockedReason" parameter="BLOCKED_REASON"></i-select>
      </el-form-item>
      <el-form-item label="发放状态:">
          <i-select v-model="form.paymentStatus" parameter="PAY_STATUS"></i-select>
      </el-form-item>
      <el-form-item label="解冻原因:">
          <i-select v-model="form.unblockedReason" parameter="UNBLOCKED_REASON"></i-select>
      </el-form-item>
      <el-form-item label="工号:">
        <el-input v-model="form.employeeCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="姓名:">
        <el-input v-model="form.fullName" placeholder="请输入"></el-input>
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
            <el-table-column type="selection"/>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              :align="col.align"
              :sortable="col.sortable"
              :fixed="col.fixed"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
            <i-table-operator :table="tableScope"/>
          </el-table>
        </template>
      </i-table>
    </template>
  </i-layout>
  <i-dialog
    v-model="isShowDialog"
    title="解冻"
    :toolbar="detailEditToolbar"
    size="small"
    destroyedWhenClose
    >
      <detail-edit ref="detailEdit" :accountList="selectedList"></detail-edit>
    </i-dialog>
  </section>
</template>

<script>
  import DetailEdit from './unfreeze-edit'
  import req, { config } from 'api/compensation/check-give/frozen-history'
  import { showMessage, windowOpen } from 'utils/index'
  import Access from 'mixins/access'
  import RemoteSelect from 'components/compensation/remote-select/index'

  export default {
    name: 'FrozenHistory',
    mixins: [Access],
    components: {
      DetailEdit,
      RemoteSelect
    },
    data () {
      return {
        form: {
          payMonth: '',
          unitId: '',
          groupId: '',
          employeeStatus: '',
          blockedReason: '',
          paymentStatus: '',
          unblockedReason: ''
        },

        // 详情编辑
        detailEditToolbar: [
          {
            text: '返回',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '确定',
            func: done => {
              this.handleSave(done)
            }
          }
        ],
        pageLoading: false,
        isShowDialog: false,
        loading: true,
        selectedList: [], // 解冻列表数组
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        displayKeys: ['groupCode', 'groupName'],
        // 表格
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', width: '100', align: 'center', sortable: true, fixed: true },
            { prop: 'fullName', label: '姓名', width: '80', align: 'center', sortable: true, fixed: true },
            { prop: 'groupCode', label: '薪资组代码', align: 'left', width: '120', sortable: true },
            { prop: 'groupName', label: '薪资组', align: 'left', width: '80' },
            { prop: 'unitName', label: '组织名称', align: 'left', width: '100', sortable: true },
            { prop: 'employeeStatus', label: '员工状态', align: 'left', width: '100', display: {dict: 'EMPLOYEE_STATUS'} },
            { prop: 'payMonth', label: '出款月份', align: 'center', width: '100', sortable: true },
            { prop: 'mobile', label: '手机号', align: 'center', width: '80' },
            { prop: 'email', label: '邮箱', align: 'left', width: '120' },
            { prop: 'blockedValue', label: '冻结金额', align: 'right', width: '100', display: {mixin: (row, col) => this.currencyFormat(row[col])} },
            { prop: 'blockedReason', label: '冻结原因', align: 'left', width: '100', display: {dict: 'BLOCKED_REASON'} },
            { prop: 'createDate', label: '冻结时间', align: 'center', width: '140' },
            { prop: 'createCode', label: '冻结操作者', align: 'center', width: '100' },
            { prop: 'unblockedReason', label: '解冻原因', align: 'center', width: '140', display: { dict: 'UNBLOCKED_REASON' } },
            { prop: 'lastUpdateDate', label: '解冻时间', align: 'center', width: '140' },
            { prop: 'lastUpdateCode', label: '解冻操作者', align: 'center', width: '140' },
            { prop: 'paymentWay', label: '支付方式', align: 'center', width: '140', display: { dict: 'DELIVER_TYPE' } },
            { prop: 'paymentAmount', label: '支付金额', align: 'center', width: '140' },
            { prop: 'paymentStatus', label: '发放状态', align: 'center', width: '140', display: {dict: 'PAY_STATUS'} }
          ],
          setting: {
            export: {
              req: config.getFrozenList,
              key: 'payBlockedRecordsGet',
              config: {
                fileName: '冻结记录表'
              }
            },
            operator: [
              {
                text: '解冻',
                key: 'payBlockedRecordsUnblockPut',
                func: this.refreshRow,
                show (row) {
                  if (row.paymentStatus !== '02') {
                    return {
                      disable: true
                    }
                  }
                }
              }
            ],
            toolbar: [{
              text: '解冻',
              key: 'payBlockedRecordsUnblockPut',
              func: this.refresh
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
    created () {
      this.selectedList = []
    },
    mounted () {
      this.table.search = {}
    },
    methods: {
      /** 分页显示页数变化监听 */
      handleSizeChange (options) {
        this.fetch(Object.assign(options, this.form))
      },
      /** 当前页数变化监听 */
      handleCurrentChange (options) {
        this.pageLoading = true
        this.fetch(Object.assign(options, this.form))
      },
      fetch (options = {}) {
        req('getFrozenList', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.pageLoading = false
          this.loading = false
        })
      },
      /** 重置搜索条件 */
      reset () {
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
      },
      /** 执行搜索方法 */
      search () {
        this.pageLoading = true
        this.loading = true
        this.table.search = { ...this.form }
      },
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
      },
      /** 解冻单行 */
      refreshRow (row) {
        this.selectedList = []
        this.selectedList = [row]
        this.judgeRight(this.selectedList)
      },
      /** 解冻多行 */
      refresh (vm) {
        this.selectedList = vm.getMultipleSelection()
        if (this.selectedList.length === 0) {
          return showMessage('info', '请至少选择一项')
        }
        this.judgeRight(this.selectedList)
        // this.openDetailDialog()
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      /** 判断是否符合解冻条件 */
      judgeRight (val) {
        const judge = val.every(item => {
          return item.paymentStatus === '02'
        })
        // req('postCheckData', val).then(res => {
        //   if (res) {
        //     this.openDetailDialog()
        //   }
        // })
        if (judge) {
          this.openDetailDialog()
        } else {
          return showMessage('warning', '只有止付状态才能解冻')
        }
      },
      handleCancel (done) {
        this.selectedList = []
        done()
      },
      /** 确认解冻，启动解冻流程 */
      handleSave (done) {
        this.$refs.detailEdit.conforim().then(res => {
          const arr = this.$refs.detailEdit.sendList
          windowOpen(`/flow.html#/flow/payMentAgainProcess`, {processType: 'payMentAgainProcess', arr: encodeURIComponent(JSON.stringify(arr))})
          if (res) {
            showMessage('success', '恭喜你！解冻流程启动！')
            done()
          } else {
            showMessage('danger', '解冻流程启动失败！')
          }
        })
        this.selectedList = []
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
