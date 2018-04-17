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
        <el-form-item label="组织代码">
          <el-input v-model="searchParam.orgCode"></el-input>
        </el-form-item>
        <el-form-item label="组织名称">
          <el-input v-model="searchParam.orgName"></el-input>
          <!--<i-select-tree-->
            <!--:multiple="false"-->
            <!--dataKey="org"-->
            <!--nodeKey="orgUnitId"-->
            <!--v-model="searchParam.orgUnitId"-->
            <!--lazy-->
            <!--size="small"-->
          <!--&gt;</i-select-tree>-->
        </el-form-item>
        <el-form-item label="核算月份起">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="month"
            @change="handleEffectiveDateStartChange"
            :picker-options="effectStartOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="核算月份止">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="month"
            @change="handleEffectiveDateEndChange"
            :picker-options="effectEndOptions"
          >
          </el-date-picker>
        </el-form-item>
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
              :formatter="tableScope.formatter"
              :fixed="col.fixed"
            >
              <!--<template slot-scope="scope">-->
                <!--<p v-if="!col.func">{{scope.row[col.prop]}}</p>-->
                <!--<el-button v-else type="text" @click="col.func(scope)">{{scope.row[col.prop]}}</el-button>-->
              <!--</template>-->
            </el-table-column>
            <i-table-operator scope :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>
      <i-dialog
        v-model="isShowDialog"
        title="收银绩效设置"
        size="large"
        :toolbar="detailEditToolbar"
        destroyedWhenClose
      >
        <detail-edit ref="detailEdit" :id="id"></detail-edit>
      </i-dialog>
      <i-dialog
        v-model="isShowDetailDialog"
        title="收银绩效详情"
        size="large"
        destroyedWhenClose
      >
        <detail ref="detail" :data="currentRowData"></detail>
      </i-dialog>
    </template>
  </i-layout>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import req, { config } from 'api/compensation/data-collection/cashier-performance'
  import DetailEdit from './detail-edit'
  import Detail from './detail'
  import { showMessage, confirmPopover } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin],
    components: {
      ITable,
      ITableCell,
      DetailEdit,
      ILayout,
      Detail
    },
    data () {
      return {
        // 当前点击行数据
        currentRowData: {},
        // 详情编辑弹窗控制条
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
        isShowDetailDialog: false,
        // i-table表格数据
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', func: this.openDetailPage, align: 'left', width: '180', fixed: 'left' },
            { prop: 'employeeName', label: '姓名', func: this.openDetailPage, width: '120', fixed: 'left', align: 'left' },
            { prop: 'orgCode', label: '组织代码', align: 'left', width: '120' },
            { prop: 'orgName', label: '组织名称', width: '140', align: 'left' },
            { prop: 'personnelGroupName', label: '人事范围', width: '120', align: 'left' },
            { prop: 'jobName', label: '职位', width: '140', align: 'left' },
            { prop: 'jobCategory', label: '职位分类', width: '120', align: 'left' },
            { prop: 'cashMonth', label: '核算月份', width: '120', align: 'left', display: { date: 'short' } },
            { prop: 'hireDate', label: '入职时间', align: 'left', width: '120', display: {dict: 'yyyy-MM'} },
            { prop: 'cashTotal', label: '奖惩合计（元）', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'reward', label: '收银奖励', align: 'right', width: '120', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'cashNum', label: '收银件数', align: 'right', width: '120' },
            { prop: 'cashRatio', label: '收银系数', align: 'right', width: '120' },
            { prop: 'cashPerf', label: '收银绩效', align: 'right', width: '120' },
            { prop: 'efficency', label: '收银效率', align: 'right', width: '120' },
            { prop: 'cashServiceNum', label: '月服务顾客数', align: 'right', width: '120' },
            { prop: 'cashTranNum', label: '客单数', align: 'right', width: '120' },
            { prop: 'scanTotalNum', label: '月扫描总件数', align: 'right', width: '130' },
            { prop: 'workMinuteNum', label: '月上机分钟数', align: 'right', width: '130' },
            { prop: 'attendMinuteNum', label: '月出勤分钟数', align: 'right', width: '130' }
            // { prop: 'createBy', label: '操作者', width: '100', align: 'right' },
            // { prop: 'createDate', label: '操作时间', align: 'left', width: '120', display: { date: '' } }
          ],
          setting: {
            export: {
              req: config.getCashierPerformanceList
            },
            operator: [
              {
                text: '查看',
                func: this.openDetail
              },
              {
                text: '删除',
                func: this.deleteRow
              }
            ],
            toolbar: [{
              text: '新增',
              func: this.addPolicy
            }, {
              text: '删除',
              type: 'danger',
              func: this.delete
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
          orgCode: '',
          employeeCode: '',
          employeeName: '',
          orgName: '',
          effectiveDateStart: '',
          effectiveDateEnd: ''
        }
      }
    },
    methods: {
      fetch (options = {}) {
        req('getCashierPerformanceList', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
      },
      /** 打开详情页 */
      openDetailPage (scope) {
      },
      openDetail ({row}) {
        this.currentRowData = row
        this.isShowDetailDialog = true
      },
      addPolicy () {
        this.id = ''
        this.openDetailDialog()
      },
      modifyRow (scope) {
        this.id = scope.row.id
        this.openDetailDialog()
      },
      deleteRow (scope) {
        confirmPopover('warning', '确认删除该项吗？', () => {
          req('deleteCashierPerformance', {id: scope.row.id}).then(res => {
            if (res) {
              showMessage('success', '删除成功！')
              this.fetch(this.allParam)
            } else {
              showMessage('danger', '删除失败！')
            }
          })
        })
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
      },
      delete (vm) {
        const selected = vm.getMultipleSelection().map(item => {
          return item.id
        })
        if (!selected.length) return showMessage('info', '请选择至少一项！')
        confirmPopover('warning', '确认删除已选选项吗？', () => {
          req('deleteCashierPerformanceList', selected).then(res => {
            if (res) {
              this.fetch(this.allParam)
              showMessage('success', '恭喜你！删除成功！')
            }
          })
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
