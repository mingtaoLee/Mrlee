<template>
  <i-layout headerKey="cpsEmpPayAmountGet">
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="工号">
          <el-input v-model="searchParam.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchParam.fullName"></el-input>
        </el-form-item>
        <el-form-item label="薪资组">
          <remote-select
            v-model="searchParam.groupId"
            dataKey="salaryGroup"
            placeholder="请输入代码或名称搜索"
            :displayKeys="['groupCode', 'groupName']"
            :props="groupProps"
          ></remote-select>
        </el-form-item>
        <el-form-item label="组织名称">
          <i-select-tree
            v-model="searchParam.orgUnitId"
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            size="small"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="员工状态">
          <i-select v-model="searchParam.employeeStatus" parameter="EMPLOYEE_STATUS"></i-select>
        </el-form-item>
        <el-form-item label="生效开始日期">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="date"
            :picker-options="effectStartOptions"
            @change="handleEffectiveDateStartChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效结束日期">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="date"
            @change="handleEffectiveDateEndChange"
            :picker-options="effectEndOptions"
          >
          </el-date-picker>
        </el-form-item>
      </i-form>
    </template>
    <template slot="section">
      <!--<div v-if="tabs.length" class="nav mb20">-->
        <!--<el-tabs v-model="currentComponentListId" @tab-click="handleProgramClick">-->

          <!--<el-tab-pane-->
            <!--v-for="tab in tabs"-->
            <!--:key="tab.componentListId"-->
            <!--:label="tab.componentListName"-->
            <!--:name="tab.componentListId"-->
          <!--&gt;-->
          <!--</el-tab-pane>-->
        <!--</el-tabs>-->
      <!--</div>-->
      <i-table
        ref="table"
        class="table"
        :table="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
        sift
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            v-loading="loading"
            :element-loading-text="$loadingText"
            :data="tableScope.clone"
            :span-method="handleSpanMethod"
            border
          >
            <el-table-column type="selection" fixed="left"></el-table-column>
            <el-table-column
              v-for="(col, idx) of tableScope.siftColumns"
              :key="col.label"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import ILayout from 'components/common/i-layout'
  import req from 'api/compensation/employee-info/salary-split'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'

  export default {
    components: {
      ILayout,
      RemoteSelect
    },
    mixins: [PaginationMixin, SearchDateMixin],
    props: {
      id: String
    },
    data () {
      return {
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        tabs: [],
        currentComponentListId: '',
        detailEditToolbar: [
          {
            text: '取消',
            type: 'plain',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '确认',
            func: done => {
              this.handleSave(done)
            }
          }
        ],
        isShowDialog: false,
        table: {
          columns: [
          ],
          columnsExt: {
            employeeCode: { sortable: true, align: 'left', width: '120', fixed: 'left' },
            fullName: { width: '120', align: 'left', fixed: 'left' },
            groupName: { width: '120', align: 'left' },
            orgUnitCode: { width: '120', align: 'left' },
            orgUnitName: { width: '160', align: 'left' },
            jobName: { width: '120', align: 'left' },
            employeeStatus: { align: 'left', width: '120px', display: { dict: 'EMPLOYEE_STATUS' } },
            effectiveDateStart: { width: '120', align: 'left', display: { date: 'default' } },
            effectiveDateEnd: { width: '120', align: 'left', display: { date: 'default' } }
          },
          setting: {
            toolbar: [{
              text: '一键拆分',
              key: 'cpsFixedSalarySplitPost',
              func: this.handleSplit
            }]
          },
          sift: {
            exclude: [
              'employeeCode',
              'fullName',
              'groupName',
              'orgUnitCode',
              'orgUnitName',
              'jobName',
              'employeeStatus',
              'effectiveDateStart',
              'effectiveDateEnd',
              'itemKey8a90d50861300c400161359305242c77'
            ]
          },
          renderColumns: true,
          data: [],
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        },
        searchParam: {
          fullName: '',
          employeeCode: '',
          groupName: '',
          groupId: '',
          orgUnitId: '',
          workType: '',
          effectiveDateStart: '',
          effectiveDateEnd: ''
        }
      }
    },
    methods: {
      handleSpanMethod ({ row, column, rowIndex, columnIndex }) {
//        if (columnIndex === 2 || columnIndex === 1) {
//          console.log({ row, column, rowIndex, columnIndex })
//          if (rowIndex % 2 === 0) {
//            return {
//              rowspan: 2,
//              colspan: 1
//            }
//          } else {
//            return {
//              rowspan: 0,
//              colspan: 0
//            }
//          }
//        }
      },
      /** 一键拆分点击事件 */
      handleSplit (vm) {
        let EMP_ID_ARR = []
        const SELECTION = vm.getMultipleSelection()
        if (SELECTION.length === 0) {
          return this.$message({
            message: '请至少选择一项!',
            type: 'warning'
          })
        }
        EMP_ID_ARR = SELECTION.map(v => v.employeeId)
        req('splitSalaryManual', EMP_ID_ARR)
          .then(res => {
            if (res) {
              this.$message({
                message: '拆分成功!',
                type: 'success'
              })
              this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
            }
          })
      },

      /** 项目点击事件监听 */
      handleProgramClick () {
        this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
      },

      /** 获取薪资组分配列表 */
      fetch (options = {}) {
        this.load()
        req('getSalarySplit', options).then(res => {
          if (res) {
            this.table['columns'] = this.transformColumns(res.columns)
//            this.currentComponentListId || (this.tabs = res.tabs)
//            this.currentComponentListId = res.tabs[0].componentListId
            Object.keys(res.pagedResult).map(key => {
              this.table[key] = res.pagedResult[key]
            })
          }
          this.loaded()
        })
      },
      transformColumns (columns) {
        columns.map(column => {
          if ((/^itemKey/).test(column.prop)) {
            column.width = this.getColumnWidth(this.getStrLength(column.label))
            column.align = 'right'
            column.display = { mixin: (row, col) => this.currencyFormat(row[col]) }
          }
        })
        return columns
      },
      getColumnWidth (length) {
        if (length < 5) {
          return 100
        } else if (length < 7) {
          return 120
        } else {
          return 140
        }
      },
      getStrLength (str) {
        return str.length
      },
      /** 打开设置页面 */
      openDetailDialog () {
        this.isShowDialog = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .nav {
    line-height: 50px;
    height: 50px;
  }
  .label {
    display: inline-block;
    margin-right: 10px;
    font-size: 14px;
    font-weight: 600;
  }
  .btn {
    margin-top: 10px;
  }
</style>
