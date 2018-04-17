<template>
  <!-- <main> -->
    <section>
    <i-layout headerKey="pfmPlanListGet">
      <i-form @search="searchPerformanceData" @reset="reset" slot="header">
        <el-form-item label="名称">
          <el-input v-model="params.keyword"></el-input>
        </el-form-item>
        <el-form-item label="方案状态">
          <el-select v-model="params.status" clearable >
          <el-option v-for="item in statusDict" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="方案开始年份" >
          <el-date-picker
          v-model="params.beginDate"
          clearable
          type="year"
          value-format="yyyy"
          :picker-options="yearStartPickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="方案结束年份">
          <el-date-picker
          v-model="params.endDate"
          clearable
          type="year"
          value-format="yyyy"
          :picker-options="yearEndPickerOptions"></el-date-picker>
        </el-form-item>
      </i-form>

      <i-table
        slot="section"
        :table="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange">
        <template
          slot-scope="tableScope"
          slot="table">
          <el-table
            :data="tableScope.clone"
            @cell-click="handleNameClick"
            v-loading.body="tableLoading">
            <el-table-column label="方案名称" prop="name" show-overflow-tooltip>
              <template slot-scope="nameScope">
                <div class="plan-name">{{nameScope.row.name}}</div>
              </template>
            </el-table-column>
            <el-table-column
            label="状态"
            prop="status"
            :formatter="statusFormatter"
            align="center"
            sortable></el-table-column>
            <!-- TODO 点击排序后列要有变化 -->
            <el-table-column label="年份" prop="year" sortable align="center"></el-table-column>

            <el-table-column label="描述" prop="description" show-overflow-tooltip ></el-table-column>

             <i-table-operator :table="tableScope"></i-table-operator>
          </el-table>
        </template>
      </i-table>


    </i-layout>
    <i-dialog title="查看绩效方案" v-model="showSchemeDetail" destroyedWhenClose :toolbar="toolbar">
        <scheme-detail :initData="schemeDetail"></scheme-detail>
      </i-dialog>
    </section>
  <!-- </main> -->
</template>
<script>
import { peformanceSchemeStatus } from '../../../../../config/dict'
import request from 'api/performance/plan-manage.js'
import IForm from 'components/common/i-form/i-form.vue'
import iDialog from 'components/common/i-dialog/i-dialog.vue'
import {findDictLabel} from 'utils/index'
// import moment from 'moment'
export default {
  data () {
    return {
      // 获取列表数据参数项
      tableLoading: false,
      toolbar: [
        {
          text: '确定',
          type: 'primary',
          func: done => {
            done()
          }
        },
        {
          text: '取消',
          type: 'text',
          func: done => {
            done()
          }
        }
      ],
      table: {
        data: null,
        total: 0,
        showPagebar: true,
        search: null,
        info: null,
        setting: {
          operator: [
            {
              text: '管理计划',
              key: 'pfmManagerPlan',
              func: row => this.managePlanDetail(row)
            }
          ]
        }
      },
      params: {
        keyword: '',
        status: '',
        beginDate: null,
        endDate: null,
        sort: ''
      },
      statusDict: peformanceSchemeStatus,
      // clickedCol: 'sss',
      schemeDetail: {},
      showSchemeDetail: false,
      yearStartPickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.parse(this.params.beginDate) - 3600 * 1000 * 24
        }
      },
      yearEndPickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.parse(this.params.beginDate)
        }
      }
    }
  },
  methods: {
    // 状态过滤
    statusFormatter (row, col) {
      let val = row[col.property]
      return findDictLabel(this.statusDict, val)
    },
    managePlanDetail (row) {
      this.$router.replace(`/performance/plan/${row.schemeId}/detail`)
    },
    // 请求获取列表数据
    getPerformanceData (opts) {
      console.log(this.params)
      request('getPlanManageData', opts).then((res) => {
        Object.assign(this.table, res)
        this.tableLoading = false
      })
    },
    // 切换页码
    handleCurrentChange (opts) {
      this.getPerformanceData(opts)
    },
    // 用户改变当前列表显示条数
    handleSizeChange (opts) {
      this.getPerformanceData(opts)
    },
    // 获取绩效方案详情
    handleNameClick (row, col, cell, e) {
      if (col.property === 'name') {
        this.getSchemeDetail(row.schemeId)
      }
    },
    getSchemeDetail (schemeId) {
      request('getSchemeDetail', {schemeId}).then((res) => {
        this.schemeDetail = res
        this.showSchemeDetail = true
      })
    },

    statusChange (status) {
      this.params.status = status
    },

    searchPerformanceData () {
      this.table.search = { ...this.params }
    },
    reset () {
      this.params = {
        status: '',
        beginDate: null,
        endDate: null,
        keyword: '',
        sort: ''
      }
    }
  },

  mounted () {
    this.tableLoading = true
    // this.getPerformanceData(this.table.info)
    this.searchPerformanceData()
  },

  components: {
    schemeDetail: () => import('./schemeDetail.vue'),
    IForm,
    iDialog
  }
}
</script>
<style lang="scss" scoped>
.plan-name {
  cursor: pointer;
}
  .pagination {
    margin-top: 15px;
    text-align: right;
  }

</style>

<style lang="scss">
  .clickedCol {
    color: blue
  }
</style>
