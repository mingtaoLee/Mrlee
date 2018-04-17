<template>
  <section>
  <!-- <i-layout v-loading="loading" :element-loading-text="$loadingText" headerKey="payAbnormalRecordsInformGet"> -->
  <i-layout v-loading="loading" :element-loading-text="$loadingText">
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="月份:">
         <el-date-picker
            v-model="form.payMonth"
            value-format="yyyy-MM"
            placeholder="请选择"
            type="month"
        >
        </el-date-picker>
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
      <el-form-item label="工资套类型:">
          <i-select v-model="form.componentListType" parameter="COMPONENT_LIST_TYPE" placeholder="请选择"></i-select>
      </el-form-item>
      <el-form-item label="已通知:">
          <i-select v-model="form.isMessage" parameter="WHETHER_TYPE" placeholder="请选择"></i-select>
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
              :fixed="col.fixed"
              :sortable="col.sortable"
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
    title="通知员工"
    :toolbar="detailEditToolbar"
    size="small"
    destroyedWhenClose
    >
        <detail-edit ref="detailEdit" :informList="informList"></detail-edit>
    </i-dialog>
  </section>
</template>

<script>
  import DetailEdit from './inform-detail'
  import req, { config } from 'api/compensation/check-give/unusual-takeout'
  import { showMessage } from 'utils/index'
  import Access from 'mixins/access'
  import RemoteSelect from 'components/compensation/remote-select/index'

  export default {
    name: 'UnusualTakeout',
    mixins: [Access],
    components: {
      DetailEdit,
      RemoteSelect
    },
    data () {
      return {
        form: {
          payMonth: null,
          groupId: '',
          componentListType: '',
          isMessage: '',
          employeeCode: '',
          fullName: ''
        },
        // 详情编辑
        detailEditToolbar: [
          {
            text: '确定',
            func: done => {
              this.handle(done)
            }
          },
          {
            text: '返回',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          }
        ],
        isShowDialog: false,
        loading: true,
        pageLoading: false,
        informList: [],
        // 通知信息
        msg: '',
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        displayKeys: ['groupCode', 'groupName'],
        // 表格
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', width: '80', align: 'center', fixed: true, sortable: true },
            { prop: 'fullName', label: '姓名', width: '80', align: 'center', fixed: true },
            { prop: 'unitName', label: '组织', width: '80', align: 'center', fixed: true, sortable: true },
            { prop: 'name', label: '职务', width: '80', align: 'center', fixed: true },
            { prop: 'mobile', label: '手机号', width: '80', align: 'center' },
            { prop: 'email', label: '邮箱', width: '80', align: 'left' },
            { prop: 'payMonth', label: '出款月份', align: 'center', width: '100', sortable: true },
            { prop: 'processName', label: '发放过程', align: 'left', width: '100' },
            { prop: 'groupName', label: '薪资组', align: 'center', width: '100', display: {dict: 'dict'}, sortable: true },
            { prop: 'componentListType', label: '工资套类型', align: 'center', width: '100', display: {dict: 'COMPONENT_LIST_TYPE'} },
            { prop: 'abnormalInfo', label: '异常信息', align: 'left', width: '100' },
            { prop: 'abnormalStatus', label: '状态', align: 'center', width: '120', display: {dict: 'ABNORMAL_PAYMENT_STATUS'} },
            { prop: 'abnormalDate', label: '异常时间', align: 'center', width: '120' },
            { prop: 'isMessage', label: '已通知', align: 'center', width: '100', display: {dict: 'WHETHER_TYPE'} }
          ],
          setting: {
            export: {
              req: config.getUnusualTakeoutList,
              config: {
                fileName: '异常出款表'
              },
              key: 'payAbnormalRecordsExport'
            },
            operator: [
              {
                text: '通知员工',
                key: 'payAbnormalRecordsInformPut',
                func: this.informRow
              }
            ],
            toolbar: [{
              text: '通知员工',
              key: 'payAbnormalRecordsInformPut',
              func: this.inform
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
    mounted () {
      this.table.search = {}
    },
    methods: {
      handleSizeChange (options) {
        this.fetch(Object.assign(options, this.form))
      },
      handleCurrentChange (options) {
        this.pageLoading = true
        this.fetch(Object.assign(options, this.form))
      },
      fetch (options = {}) {
        req('getUnusualTakeoutList', options).then(res => {
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
      /** 通知单人 */
      informRow (row) {
        this.informList = []
        this.informList = [row.abnormalRecordId]
        this.openDetailDialog()
      },
      /** 通知多人 */
      inform (vm) {
        this.informList = vm.getMultipleSelection().map(item => {
          return item.abnormalRecordId
        })
        if (!this.informList.length) return showMessage('info', '请选择至少一项！')
        this.openDetailDialog()
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleCancel (done) {
        this.informList = []
        done()
      },
      /** 确认通知 */
      handle (done) {
        this.$refs.detailEdit.sendMsg().then(res => {
          if (res) {
            done()
            this.informList = []
          }
        })
      },
      import () {}
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
