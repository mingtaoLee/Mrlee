<template>
  <i-layout>
    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="工号">
        <el-input v-model="searchParam.employeeCode"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="searchParam.employeeName"></el-input>
      </el-form-item>
      <el-form-item label="组织名称">
        <el-input v-model="searchParam.orgName"></el-input>
      </el-form-item>
      <el-form-item label="组织代码">
        <el-input v-model="searchParam.orgCode"></el-input>
      </el-form-item>
      <el-form-item label="核算月份">
        <el-date-picker
          v-model="searchParam.checkMonth"
          type="month">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="员工状态">
        <el-input v-model="searchParam.employeeStatus"></el-input>
      </el-form-item> -->
      <el-form-item label="职位名称">
        <el-input v-model="searchParam.postName"></el-input>
      </el-form-item>
      <el-form-item label="入职日期">
        <el-date-picker
          v-model="searchParam.hireDate"
          type="date">
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
              :fixed="col.fixed"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowIsolate"
        title="抽数"
        size="mini"
        :toolbar="isolateEditToolbar"
        destroyedWhenClose
      >
        <isolate-edit ref="isolateEdit" :id="id"></isolate-edit>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import req from 'api/compensation/data-collection/guaranteed-bonuses'
  import IsolateEdit from 'components/compensation/isolate-edit'
  import mixin from '../../mixins'
  import Access from 'mixins/access'
  import { dateFormat } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  import isolateMixin from 'mixins/compensation/isolate-mixin'

  export default {
    mixins: [mixin, Access, PaginationMixin, SearchDateMixin, isolateMixin],
    components: {
      IsolateEdit
    },
    data () {
      return {
        isolateConfig: { req: req, name: 'getSyncData' },
        searchParam: {
          employeeCode: '',
          employeeName: '',
          orgName: '',
          orgCode: '',
          checkMonth: '',
          employeeStatus: '',
          postName: '',
          hireDate: ''
        },

        /* table */
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', align: 'left', width: '120', fixed: 'left' },
            { prop: 'employeeName', label: '姓名', align: 'left', width: '120', fixed: 'left' },
            { prop: 'areaName', label: '区域', width: '140', align: 'left' },
            { prop: 'effectiveDate', label: '薪资组', align: 'left', width: '140' },
            { prop: 'prescription', label: '职位', align: 'left', width: '140' },
            { prop: 'normSellAmount', label: '职位分类', align: 'left', width: '140' },
            { prop: 'checkMonth', label: '核算月份', align: 'left', width: '120', display: { date: 'short' } },
            { prop: 'groupName', label: '店编', align: 'left', width: '120' },
            { prop: 'orgUnitName', label: '门店名称', align: 'left', width: '160' },
            { prop: 'normTotalHour', label: '员工工资', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'normPrescription', label: '随时效浮动', align: 'right', width: '120' },
            { prop: 'level', label: '保底分红档级', align: 'left', width: '140', display: {dict: 'dict'} },
            { prop: 'type', label: '保底分红档级-标准', align: 'left', width: '160', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'normPrescription', label: '保底分红档级-应发', align: 'left', width: '160', display: { mixin: (row, col) => this.currencyFormat(row[col]) } }
            // { prop: 'createBy', label: '操作者', align: 'left', width: '120' },
            // { prop: 'createDate', label: '操作时间', align: 'left', width: '140', display: { date: '' } }
          ],
          setting: {
            toolbar: [{
              text: '抽数',
              key: '',
              func: this.isolatePolicy
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        }
      }
    },
    // created () {
    //   this.init()
    // },
    methods: {
      fetch (options = {}) {
        req('getLowests', options).then(res => {
          res.data.map(item => {
            if (item.checkMonth !== null) {
              item.checkMonth = item.checkMonth.slice(0, 4) + '-' + item.checkMonth.slice(4)
            } else {
              return ''
            }
          })
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loading = false
        })
      },
      handleSave (done) {
        const data = this.$refs.detailEdit
        data.checkMonth = dateFormat(data.checkMonth, 'YYYYMM')
        data.save().then(res => {
          if (res) {
            // TODO search参数
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
