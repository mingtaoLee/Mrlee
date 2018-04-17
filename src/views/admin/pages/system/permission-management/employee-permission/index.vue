<template>
  <div class="employee-permission">
     <!-- 员工权限表格 -->
    <i-layout>
      <div slot="section">
        <i-table 
          :table="table" 
          @pageSizeChange="handleSizeChange"
          @pageIndexChange="handleCurrentChange">
          <template slot="table" 
          slot-scope="tableScope"
        >
            <el-table
              :data="tableScope.clone"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              >
                <el-table-column v-for="(item, idx) in table.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :formatter="tableScope.formatter"
                  :align="item.align"
                />
                <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                  <i-table-operator :table="tableScope" :row="scope.row" />
                </template>
              </el-table-column>
              </el-table>
            </template>
        </i-table>
      </div>
    </i-layout>

  </div>
</template>

<script>
import req from 'api/system/employee-permission'
import ITable from 'components/common/i-table'
import ILayout from 'components/common/i-layout'
import ITableOperator from 'components/common/i-table-operator'
export default {
  components: {
    ITable,
    ILayout,
    ITableOperator
  },
  data () {
    return {
      table: {
        columns: [
          { prop: 'userName', label: '员工名称', width: 280 },
          { prop: 'email', label: '邮箱', width: 280 },
          { prop: 'phone', label: '联系电话', width: 280, align: 'center' },
          { prop: 'isEnabled', label: '状态', display: {dict: 'SYS_USER_STATUS'} }
        ],
        setting: {
          toolbar: [
            {
              text: '新增',
              type: 'primary',
              func: () => this.insertEmployee()
            }
          ],
          operator: [{
            text: '编辑',
            func: this.toEdit
          }]
        },
        data: null,
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      }
    }
  },

  methods: {
    handleSizeChange (options) {
      this.getpageQueryRoleUser(options)
    },

    handleCurrentChange (options) {
      this.getpageQueryRoleUser(options)
    },

    toEdit (row) {
      this.$router.push('new-permission/' + row.userId)
    },

    insertEmployee () {
      this.$router.push('new-permission/' + '-1')
    },

    getpageQueryRoleUser (listParams) {
      req('getpageQueryRoleUser', listParams)
      .then(data => {
        Object.assign(this.table, data)
      })
    }
  },

  created () {
    this.getpageQueryRoleUser({ pageIndex: 1, pageSize: 10 })
  }
}
</script>

<style lang="scss" scoped>
.employee-permission {
}
</style>
