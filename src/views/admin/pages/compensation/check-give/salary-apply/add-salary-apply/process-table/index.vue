<template>
  <section class="pers-change table-card">
  <div class="title">初始筛选条件：<span class="params">月份: {{firstSearch.auditMonth}}</span><span class="params">工资套类型: {{selectType}}</span></div>
  <i-layout v-loading="loading" :element-loading-text="$loadingText">
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="发放批次号:">
          <el-input v-model="form.processCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="发放过程名称:">
          <el-input v-model="form.processName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="支付主体:">
          <el-input v-model="form.payMentCompanyName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="公司:">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="form.companyName"
            lazy
            size="small"
          ></i-select-tree>
          <!-- <el-input v-model="form.companyName" placeholder="请输入"></el-input> -->
      </el-form-item>
      <el-form-item label="省/区/范围:">
          <i-select-tree
            :multiple="false"
            :lazy="false"
            dataKey="areaUnit"
            nodeKey="areaId"
            :props="setProps"
            v-model="form.areaId"
            @input="handleOccupationChange"
            size="small"
          ></i-select-tree>
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
            <el-table-column type="selection" label="选择"/>
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
  import req from 'api/compensation/check-give/salary-apply'
  import RemoteSelect from 'components/compensation/remote-select/index'
  // import { showMessage } from 'utils/index'

  export default {
    name: 'ProcessTable',
    components: {
      RemoteSelect
    },
    props: {
      firstSearch: Object,
      selectType: String
    },
    data () {
      return {
        form: {
          processCode: '',
          processName: '',
          groupId: '',
          areaId: '',
          companyName: '',
          payMentCompanyName: ''
        },
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        // 薪资组组合显示
        displayKeys: ['groupCode', 'groupName'],
         // 省区树配置
        setProps: {
          children: 'children',
          label: 'areaName'
        },
        // 表格
        table: {
          columns: [
            { prop: 'processCode', label: '发放批次号', align: 'center' },
            { prop: 'processName', label: '发放过程名称', align: 'center' },
            { prop: 'groupName', label: '薪资组', align: 'center' },
            { prop: 'areaName', label: '省/区/范围', align: 'center' },
            { prop: 'companyName', label: '公司', align: 'center' },
            { prop: 'payMentCompanyName', label: '支付主体', align: 'center' }
          ],
          data: [],
          info: null,
          total: 0,
          showPagebar: true,
          selectedList: []
        },
        loading: true,
        pageLoading: false
      }
    },
    created () {
      this.form = Object.assign({ ...this.form, ...this.firstSearch })
      this.selectedList = []
      this.fetch(this.form)
    },
    methods: {
      // 监听 pageIndex 和 pageSize 的变动
      handleSizeChange (options) {
        this.fetch(options)
      },
      handleCurrentChange (options) {
        this.pageLoading = true
        this.fetch(options)
      },
      fetch (options = {}) {
        req('getProcessList', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loading = false
          this.pageLoading = false
        })
      },
      /** 重置搜索条件 */
      reset () {
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
        // 重置后，再次加入初始条件
        this.form = Object.assign({ ...this.form, ...this.firstSearch })
      },
      /** 执行搜索方法 */
      search () {
        this.pageLoading = true
        this.fetch({ ...this.form })
      },
      /** 判断搜索条件是否全为空 */
      judgeSearch () {
        const param = this.form
        for (let key in param) {
          if (param[key]) {
            return true
          }
        }
        return false
      },
      /** 获取选中的过程列表 */
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
        this.selectedList = selection
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    text-align:center;
    .params {
      margin-left: 30px;
    }
  }
</style>


