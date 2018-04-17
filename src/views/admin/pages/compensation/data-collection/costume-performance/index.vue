<template>
  <i-layout>
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="工号">
          <el-input v-model="searchParam.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchParam.employeeName"></el-input>
        </el-form-item>
        <el-form-item label="组织名称">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="searchParam.orgUnitId"
            lazy
            size="small"
          ></i-select-tree>
        </el-form-item>
        <!--<el-form-item label="开业日期起">-->
        <!--<el-date-picker-->
        <!--v-model="searchParam.attendanceMonth"-->
        <!--type="date"-->
        <!--@change="handleMonthChange"-->
        <!--&gt;-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="开业日期止">-->
        <!--<el-date-picker-->
        <!--v-model="searchParam.attendanceMonth"-->
        <!--type="date"-->
        <!--@change="handleMonthChange"-->
        <!--&gt;-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="销售日期起">-->
        <!--<el-date-picker-->
        <!--v-model="searchParam.attendanceMonth"-->
        <!--type="date"-->
        <!--@change="handleMonthChange"-->
        <!--&gt;-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="销售日期止">-->
        <!--<el-date-picker-->
        <!--v-model="searchParam.attendanceMonth"-->
        <!--type="date"-->
        <!--@change="handleMonthChange"-->
        <!--&gt;-->
        <!--</el-date-picker>-->
        <!--</el-form-item>-->
      </i-form>
    </template>
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
            v-loading="loading"
            :element-loading-text="$loadingText"
            :data="tableScope.clone" :cell-class-name="cellClassName"
            border
            @selection-change="selectionChangeHandler(tableScope, $event)"
          >
            <el-table-column type="selection" fixed="left"></el-table-column>
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
              :fixed="col.fixed"
            >
            </el-table-column>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        title="抽数"
        size="mini"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :id="id"></detail-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import req, { config } from 'api/compensation/data-collection/costume-performance'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import DetailEdit from './detail-edit'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin],
    components: {
      ITable,
      ITableCell,
      IDialog,
      DetailEdit,
      ILayout
    },
    data () {
      return {

        /* detail-edit */
        detailEditToolbar: [
          {
            text: '取消',
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
        isShowDialog: false,

        /* table */
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', align: 'left', width: '120', fixed: 'left' },
            { prop: 'employeeName', label: '姓名', align: 'left', width: '120', fixed: 'left' },
            { prop: 'region', label: '区域', sortable: true, width: '120', align: 'left' },
            { prop: 'orgCode', label: '组织代码', align: 'left', width: '120' },
            { prop: 'orgUnitName', label: '组织名称', align: 'left', width: '120' },
            { prop: 'checkMonth', label: '核算月份', align: 'left', width: '120' },
            { prop: 'meanSellAmount', label: '日人均销售', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'monthWorkHour', label: '员工个人月工时', align: 'right', width: '120' },
            { prop: 'monthSellAmount', label: '员工个人月销售总额', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'orgSellRate', label: '门店销售同比', align: 'right', width: '120' },
            { prop: 'costumeAward', label: '服装提成', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } }
          ],
          setting: {
            export: {
              req: config.getCostumes
            },
            toolbar: [{
              text: '抽数',
              func: this.addPolicy
            }, {
              text: '导入',
              func: this.import
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          employeeCode: '',
          employeeName: '',
          orgUnitId: ''
        }
      }
    },
    methods: {
      fetch (options = {}) {
        req('getCostumes', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
      },
      addPolicy () {
        this.id = ''
        this.openDetailDialog()
      },
      openDetailDialog () {
        this.isShowDialog = true
      },
      handleSave (done) {
        this.$refs.detailEdit.save().then(res => {
          if (res) {
            this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
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
