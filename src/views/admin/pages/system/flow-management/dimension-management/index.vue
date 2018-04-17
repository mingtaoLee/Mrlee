<template>
  <i-layout>
    <i-form
      slot="header"
      @reset="reset"
      @search="search"
      accessKey="wfDimensionsGet">
      <el-form-item label="维度Key">
        <el-input v-model.trim="searchParams.dimensionKey"></el-input>
      </el-form-item>

      <el-form-item label="维度名称">
        <el-input v-model.trim="searchParams.dimensionName"></el-input>
      </el-form-item>
    </i-form>

    <section slot="section">
      <i-table
        :table="table"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange">
        <template slot="table" slot-scope="tableScope">
          <el-table :data="tableScope.clone" v-loading="isTableLoading">
            <el-table-column
              v-for="(col, idx) in table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :min-width="col.minWidth"
              :align="col.align"
              :formatter="tableScope.formatter"
            ></el-table-column>

            <el-table-column
              label="链接路径"
              prop="linkPaths"
              min-width="200"
              show-overflow-tooltip>
            </el-table-column>

            <i-table-operator :table="tableScope"/>
          </el-table>
        </template>
      </i-table>
    </section>

    <dimension-cu-dialog
      slot="section"
      v-if="isShowCUDialog"
      :type="dimensionCUType"
      :show.sync="isShowCUDialog"
      :dimension="dimensionRow"
      @updated="search">
    </dimension-cu-dialog>

  </i-layout>
</template>

<script>
import req from 'api/common/flow.js'
import ILayout from 'components/common/i-layout'
import { showMessage, confirmPopover } from 'utils/index'
import ITableOperator from 'components/common/i-table-operator'
import DimensionCuDialog from '../../components/dimension-cu-dialog'

export default {
  components: {
    ILayout,
    ITableOperator,
    DimensionCuDialog
  },

  data () {
    return {
      // table渲染数据
      table: {
        columns: [
          { label: '维度Key', prop: 'dimensionKey', minWidth: 200 },
          { label: '维度名称', prop: 'dimensionName', minWidth: 200 },
          { label: '表名', prop: 'objectName', minWidth: 200 },
          { label: '字段名', prop: 'fieldName', minWidth: 200 }
        ],
        data: null,
        showPagebar: true,
        search: null,
        info: null,
        total: 0,
        setting: {
          toolbar: [{
            text: '新增',
            type: 'primary',
            key: 'wfDimensionsCreatePost',
            func: () => this.showCreateDialog()
          }],
          operator: [{
            key: 'wfDimensionsUpdatePut',
            text: '修改',
            type: 'primary',
            func: this.showUpdateDialog
          },
          {
            key: 'wfDimensionsDelete',
            text: '删除',
            type: 'danger',
            func: this.showDeleteDialog
          }]
        }
      },
      // 维度增改对话框类型标识
      dimensionCUType: '',
      // 维度增改对话框显示标识
      isShowCUDialog: false,
      // 搜索条件
      searchParams: {
        dimensionKey: '',
        dimensionName: ''
      },
      // 表格Loading标识
      isTableLoading: true,
      // 维度修改对话框传入对象
      dimensionRow: null
    }
  },

  mounted () {
    this.search()
  },

  methods: {
    /** 重置搜索条件 */
    reset () {
      this.searchParams = {
        dimensionKey: '',
        dimensionName: ''
      }
    },

    /** 搜索条件查询 */
    search () {
      this.table.search = { ...this.searchParams }
    },

    /** 获取数据 */
    fetch (opts = {}) {
      this.isTableLoading = true
      req('getFlowDimension', opts).then(res => {
        this.table = Object.assign(this.table, res)
        this.isTableLoading = false
      })
    },

    /** 页数变化 */
    handleSizeChange (opts) {
      this.fetch(opts)
    },

    /** 页码变化 */
    handleCurrentChange (opts) {
      this.fetch(opts)
    },

    /** 显示添加维度对话框 */
    showCreateDialog () {
      this.dimensionRow = null
      this.dimensionCUType = 'c'
      this.isShowCUDialog = true
    },

    /** 显示修改维度对话框 */
    showUpdateDialog (row) {
      this.dimensionRow = row
      this.dimensionCUType = 'u'
      this.isShowCUDialog = true
    },

    /** 显示删除维度提示框 */
    showDeleteDialog (row) {
      confirmPopover('warning', '确认删除该项吗？', () => {
        req('deleteFlowDimension', {
          dimensionId: row.wfDimensionId
        }).then(res => {
          res
            ? showMessage('success', '删除成功') && this.search()
            : showMessage('danger', '删除失败')
        })
      })
    }
  }
}
</script>
