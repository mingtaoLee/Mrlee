<template>
  <section class="pers-change table-card" v-loading="loading" :element-loading-text="$loadingText">
    <div class="select">
      <b class="headText">已选择:</b>
      <el-tag
        class="elTag"
        :key="tag"
        v-for="tag in arr"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)">
        {{tag}}
      </el-tag> 
    </div>
  <i-layout>
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="工号:">
          <el-input v-model="form.employeeCode"></el-input>
      </el-form-item>
      <el-form-item label="姓名:">
          <el-input v-model="form.fullName"></el-input>
      </el-form-item>
      <el-form-item label="人事范围:">
          <i-select-tree
          <remote-select
            v-model="form.scopePersonnel"
            :props="personalAreaProps"
            dataKey="personnelGroup"
            filterable
          ></remote-select>
      </el-form-item>
      <el-form-item label="薪资组:">
          <remote-select
            v-model="form.groupId"
            :props="groupProps"
            dataKey="salaryGroup"
            :displayKeys="displayKeys"
            filterable
          ></remote-select>
      </el-form-item>
      <el-form-item label="薪资月份:">
         <el-date-picker
            v-model="form.payMonth"
            type="month"
            value-format="yyyy-MM"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="止付时间起:">
         <el-date-picker
            v-model="form.createDate"
            type="date"
            value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="至:">
         <el-date-picker
            v-model="form.endDate"
            type="date"
            value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
    </i-form>

    <template slot="section">
      <i-table
        class="table"
        :table="table"
        ref="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            ref="elTable"
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
              :formatter="tableScope.formatter"
            >
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </template>
  </i-layout>
  </section>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import req from 'api/compensation/check-give/frozen-history'
  import RemoteSelect from 'components/compensation/remote-select/index'
  // import { showMessage, confirmPopover } from 'utils/index'

  export default {
    name: 'OuterTaxpayLog',
    components: {
      ITable,
      ITableCell,
      ILayout,
      RemoteSelect
    },
    data () {
      return {
        // 查询表单数据汇总
        form: {
          employeeCode: '',
          fullName: '',
          scopePersonnel: '',
          groupId: '',
          payMonth: '',
          createDate: '',
          endDate: ''
        },
        loading: true,
        dialogTitle: '',
        // 表格
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', width: '120', align: 'center' },
            { prop: 'fullName', label: '姓名', align: 'center', width: '80' },
            { prop: 'companyName', label: '发薪主体', align: 'left', width: '120' },
            { prop: 'groupName', label: '薪资组', align: 'left', width: '100' },
            { prop: 'scopePersonnel', label: '人事范围', align: 'left', width: '120' },
            { prop: 'payMonth', label: '薪资月份', align: 'center', width: '120' },
            { prop: 'createDate', label: '止付时间点', align: 'center', width: '150' },
            { prop: 'paymentStatus', label: '发放状态', align: 'center', width: '140', display: {dict: 'PAY_STATUS'} },
            { prop: 'blockedReason', label: '止付原因', align: 'left', width: '120', display: {dict: 'BLOCKED_REASON'} },
            { prop: 'personalIncomeTax', label: '止付附件', align: 'center' }
          ],
          data: [],
          info: null,
          total: 0,
          showPagebar: true
        },
        arr: [], // 顶部标签数组
        unblockList: [], // 表格选中数组
        // 工资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
         // 人事范围下拉配置
        personalAreaProps: {
          value: 'personnelGroupName',
          label: 'personnelGroupName'
        },
        displayKeys: ['groupCode', 'groupName']
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.fetch()
      },
      handleSizeChange (options) {
        this.fetch(options)
      },
      handleCurrentChange (options) {
        this.fetch(options)
      },
      fetch (options = { }) {
        req('getFrozenList', options).then(res => {
          // res.data = res.data.filter(item => {
          //   return item.paymentStatus === '02'
          // })
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
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
        this.fetch({ ...this.form })
      },
      rowClickHandler ({ rowClickHandler }, row) {
        rowClickHandler(row)
      },
      /** 标签数组获取 */
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
        this.arr = []
        this.unblockList = selection
        selection.map(item => {
          this.arr.push(item.fullName + '(' + item.payMonth + ')')
        })
      },
      /** 关闭标签，同时获取需要取消选中的行数据 */
      handleClose (tag) {
        const row = this.arr.indexOf(tag)
        this.arr.splice(row, 1)
        this.toggleSelection(this.unblockList[row])
      },
      /** 对应取消行选中 */
      toggleSelection (row) {
        if (row) {
          this.$refs.elTable.toggleRowSelection(row)
        } else {
          return null
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
  .select {
    min-height:50px;
    line-height:50px;
  }
  .headText {
    margin-right:10px;
  }
  .elTag {
    margin:0 5px;
  }
</style>

