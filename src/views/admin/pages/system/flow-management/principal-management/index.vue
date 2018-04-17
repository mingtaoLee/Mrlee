<template>
  <i-layout>
    <i-form
      slot="header"
      @reset="reset"
      @search="search"
      accessKey="wfPrincipalGet">
      <el-form-item label="主体编码">
        <el-input v-model.trim="searchParams.code"></el-input>
      </el-form-item>

      <el-form-item label="主体名称">
        <el-input v-model.trim="searchParams.name"></el-input>
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

            <i-table-operator :table="tableScope"/>
          </el-table>
        </template>
      </i-table>
    </section>

    <principal-cu-dialog
      slot="section"
      v-if="isShowCUDialog"
      :type="principalCUType"
      :show.sync="isShowCUDialog"
      :principal="principalRow"
      @updated="search">
    </principal-cu-dialog>

  </i-layout>
</template>

<script>
import req from 'api/common/flow.js'
import ILayout from 'components/common/i-layout'
import { showMessage, confirmPopover } from 'utils/index'
import PrincipalCuDialog from '../../components/principal-cu-dialog'
// import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'

export default {
  components: {
    ILayout,
    PrincipalCuDialog
    // iPersonnelSelect
  },

  data () {
    return {
      // table 渲染数据
      table: {
        columns: [
          { label: '主体编码', prop: 'code', minWidth: 200 },
          { label: '主体名称', prop: 'name', minWidth: 200 },
          { label: '主体类型', prop: 'principalType', display: { dict: 'WP_M_PRINCIPAL' }, minWidth: 200 }
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
            key: 'wfPrincipalCreatePost',
            func: this.showCreateDialog
          }],
          operator: [{
            key: 'wfPrincipalUpdatePut',
            text: '修改',
            func: this.showUpdateDialog
          },
          {
            key: 'wfPrincipalDelete',
            text: '删除',
            func: this.showDeleteDialog
          }]
        }
      },
      // 搜索条件
      searchParams: {
        code: '',
        name: ''
      },
      // 主体增改对话框类型标识
      principalCUType: '',
      // 主体增改对话框显示标识
      isShowCUDialog: false,
      // 表格Loading标识
      isTableLoading: true,
      // 要修改的主体对象
      principalRow: null
    }
  },

  mounted () {
    this.search()
  },

  methods: {
    /** 重置搜索条件 */
    reset () {
      this.searchParams = {
        name: '',
        cname: ''
      }
    },

    /** 搜索条件查询 */
    search () {
      this.table.search = { ...this.searchParams }
    },

    /** 获取数据 */
    fetch (opts) {
      this.isTableLoading = true
      req('getFlowPrincipal', opts).then(res => {
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

    /** 显示添加主体对话框 */
    showCreateDialog () {
      // principalRow分修改和新增情况
      this.principalRow = null
      this.principalCUType = 'c'
      this.isShowCUDialog = true
    },

    /** 显示修改主体对话框 */
    showUpdateDialog (row) {
      // HACK: 将比较符 从 Number 转成 String

      // TODO: 增加配置表功能 发现使用配置表后 operator会重置为null
      // 可对 row.pricipalType 做判断
      // 解决转换问题
      // try {
      //   for (let item of row.items) {
      //     item.operator = item.operator.toString()
      //   }
      // } catch (error) {
      //   console.log(error)
      // }

      // principalCUType控制增改样式
      this.principalRow = row
      this.principalCUType = 'u'
      this.isShowCUDialog = true
    },

    /** 显示删除主体对话框 */
    showDeleteDialog (row) {
      confirmPopover('warning', '确认删除该项吗？', () => {
        req('deleteFlowPrincipal', {
          principalId: row.wfPrincipalId
        }).then(res => {
          if (res) {
            showMessage('success', '删除成功')
            this.search()
          } else {
            showMessage('error', '删除失败')
          }
        })
      })
    }
  }
}
</script>
