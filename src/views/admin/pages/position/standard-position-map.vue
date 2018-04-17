<template>
  <i-layout headerKey="orgPosStdJobAtlas">
    <i-form
      slot="header"
      @reset="reset"
      @search="search">
        <el-form-item>
          <span slot="label">职群职种</span>
          <i-select-tree
            :lazy="false"
            dataKey="jobFamilys"
            nodeKey="posJobFamilyId"
            v-model="searchBox.posJobFamilyId"
            :selectedNode.sync="node"
            :props="defaultProps"
            placeholder="请输入"
          ></i-select-tree>
        </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="searchBox.startEffectiveDate"
          type="date"
          :editable="false"
          @change="monitor"
          placeholder="请选择"
          ref="startEffectiveDate"
          >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="endDate"
          type="date"
          :editable="false"
          @change="addDate"
          ref="endEffectiveDate"
          placeholder="请选择"
          :picker-options="pickerOptions">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="标准职位">
         <el-input v-model="searchBox.name" maxlength="20" placeholder="请输入"></el-input>
        </el-form-item>
    </i-form>
    <i-table
      slot="section"
      :table="table"
      @pageIndexChange="handleCurrentChange"
      @pageSizeChange="handleSizeChange"
    >
      <template slot="table" slot-scope="tableScope">
        <el-table ref="multipleTable" :data="tableScope.clone" style="width: 100%" v-loading="loading" :element-loading-text="$loadingText">
          <el-table-column
            prop="posJobFamilyName"
            label="职群"
            fixed="left"
            align="left"
            width="130"
            show-overflow-tooltip
            :resizable="false"
          />
          <el-table-column
            prop="jobClassName"
            label="职种"
            fixed="left"
            align="left"
            width="130"
            show-overflow-tooltip
            :resizable="false"
          />
          <el-table-column
            prop="subJobClassName"
            label="子职种"
            fixed="left"
            align="left"
            width="130"
            show-overflow-tooltip
            :resizable="false"
          />
          <el-table-column v-for="(item, index) in tableHeadName" :key="index" label="职务" align="left" :resizable="false">
            <el-table-column :label="item.name" align="left" min-width="150" show-overflow-tooltip :resizable="false">
              <template slot-scope="scope">
                <span v-if="scope.row.posTitleId === item.posTitleId">{{ scope.row.name }}</span>
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </i-layout>
</template>

<script>
  import IForm from 'components/common/i-form/i-form.vue'
  import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
  import req from 'api/position/standard-position-map'
  import {filter} from 'utils/compile'
  import date from './mixins/date'
  import tableHadle from './mixins/table-handle'

  export default {
    name: 'StandardPositionMap',
    components: {
      IForm,
      ISelectTree
    },
    mixins: [date, tableHadle],
    data () {
      return {
        // 表格的loading
        loading: false,
        // 下拉树的配置
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        // 职群职种选中的节点
        node: {},
        searchBox: {
          posJobFamilyId: '',
          startEffectiveDate: '',
          endEffectiveDate: '',
          name: ''
        },
        // 存放表格头的name
        tableHeadName: [],
        pickerOptions: {
          disabledDate: time => {
            return time.getTime() <= Date.parse(this.searchBox.startEffectiveDate) - 8.64e7
          }
        },
        // 存放表格信息
        table: {
          columns: [
            { prop: 'status', display: { dict: 'POSITION_STATUS' } }
          ],
          data: null,
          showPagebar: true,
          total: 0,
          search: '',
          info: null
        }
      }
    },
    methods: {
      reset () {
        this.endDate = ''
        Object.keys(this.searchBox).map(key => {
          this.searchBox[key] = ''
        })
        this.node = {}
        // 修复时间控件用户填写填写错误字段，重置不了的问题
        this.$refs.startEffectiveDate.$children[0].currentValue = ''
        this.$refs.endEffectiveDate.$children[0].currentValue = ''
      },
      search () {
        // 过滤，拼接参数
        let params = filter(this.searchBox)
        if (this.node && this.node.posJobFamilyId) {
          params.jobFamilyType = this.node.jobFamilyType
        }
        this.table.search = { ...params }
      },
      // 根据搜索内容，获取职位图谱列表
      fetch (params = {}) {
        this.loading = true
        req('standardPositionSearch', params)
        .then(res => {
          ({ info: this.table.info, data: this.table.data, total: this.table.total } = { ...res })
          this.loading = false
        })
      },
      // 获取表头信息
      getTableHead () {
        this.loading = true
        req('getStandardPositionHead')
        .then(res => {
          this.tableHeadName = res
          // 获取表头信息后搜索一次
          this.search()
        })
      }
    },
    created () {
      // 获取表头信息
      this.getTableHead()
    }
  }
</script>

<style lang="scss" scoped>
  .wrap{
    width:100%;
    .center{
      text-align:center;
    }
  }
</style>
