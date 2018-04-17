<template>
  <i-layout>

    <i-form @reset="reset" @search="search" slot="header">
      <el-form-item label="工号">
        <el-input v-model="params.staffCode" clearable ></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <i-select
          v-model="params.evaluateType"
          clearable
          parameter="IS_VALID"
        ></i-select>
      </el-form-item>
    </i-form>

    <i-table
      :table="table"
      slot="section"
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange"
    >
      <template slot-scope="tableScope" slot="table">
        <el-table :data="tableScope.clone" v-loading="tableLoading" :element-loading-text="$loadingText">
          <el-table-column
            v-for="(col, index) in table.columns"
            :key="index"
            :prop="col.prop"
            :label="col.label"
          ></el-table-column>
        </el-table>
      </template>
    </i-table>

  </i-layout>
</template>

<script>
import tableMixin from '../../table-mixin'
import req from 'api/grape/monitor'
import ISelect from 'components/common/i-select/i-select'

export default {
  name: 'monitor-dialog',

  components: {
    ISelect
  },

  mixins: [tableMixin],

  props: ['schemeId', 'status', 'evaluateDate'],

  data () {
    return {
      params: {
        staffCode: '',
        evaluateType: '',
        evaluateDate: this.evaluateDate
      },

      table: {
        data: null,
        info: null,
        showPagebar: true,
        search: null,
        columns: [
          {prop: 'staffName', label: '姓名'},
          {prop: 'staffCode', label: '工号'},
          {prop: 'staffPosition', label: '职务'},
          {prop: 'staffOrgName', label: '部门'},
          {prop: 'leaderName', label: '评估人'},
          {prop: 'leaderCode', label: '评估人工号'},
          {prop: 'leaderPosition', label: '评估人职务'},
          {prop: 'leaderOrgName', label: '评估人部门'},
          {prop: 'evaluateDate', label: '评估日期'},
          {prop: 'score', label: '得分'}
        ]
      },

      tableLoading: false

    }
  },

  methods: {

    getMonitorDetail (opts) {
      req(this.api, {
        ...opts,
        schemeId: this.schemeId,
        evaluateDate: this.evaluateDate
      }).then(res => {
        this.tableLoading = false
        Object.assign(this.table, res)
      })
    },

    handleSizeChange (opts) {
      this.getMonitorDetail(opts)
    },

    handleCurrentChange (opts) {
      this.getMonitorDetail(opts)
    },

    reset () {
      this.params = {employeeCode: ''}
    },

    search () {
      this.table.search = {...this.params}
    }

  },

  computed: {
    api () {
      let result = 'getMonitorDetail'
      this.status === 1 && (result = 'getDoneDetail')
      this.status === 2 && (result = 'getUnDoDetail')
      return result
    }
  },

  // created () {
  //   this.tableLoading = true
  //   this.search()
  // },

  mounted () {
    this.search()
  }

}
</script>

<style lang="scss" scoped>

</style>
