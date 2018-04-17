<template>
  <div class="wrap">
    <el-row class="mt10 mb20">
      <el-col :span="12">
        信息集：<b>{{infName}}</b>
      </el-col>
      <el-col :span="12">
        表名：<b>{{tableName}}</b>
      </el-col>
    </el-row>

    <i-layout headerKey="ColumnQuery">
      <!-- 搜索部分 -->
      <field-management-search slot="header" @search="search" :tableName="tableName"></field-management-search>

      <!-- 列表部分 -->
      <div slot="section">
        <i-table
          :table="table"
          @pageIndexChange="handleCurrentChange"
          @pageSizeChange="handleSizeChange"
        >
          <template slot="table" slot-scope="tableScope">
            <el-table
              :data="tableScope.clone"
              v-loading="fieldLoading"
              :element-loading-text="$loadingText"
              @selection-change="handleSelectionChange"
              ref="elTable"
            >
              <el-table-column
                type="selection"
                fixed="left"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                v-for="(col, idx) of table.columns"
                :key="idx"
                :prop="col.prop"
                :label="col.label"
                :formatter="tableScope.formatter"
                :align="col.align"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <i-table-cell
                    :row="scope.row"
                    :col="col.prop"
                    :table="tableScope"
                  ></i-table-cell>
                </template>
              </el-table-column>
              <i-table-operator :table="tableScope">
              </i-table-operator>
            </el-table>
          </template>
        </i-table>
      </div>

    </i-layout>

    <!-- 新增、修改的模态框 -->
    <field-addmodify-dialog ref="fieldAddModifyDialog" :fieldID="fieldID" :tableName="tableName" @submit="reload"></field-addmodify-dialog>

  </div>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import FieldManagementSearch from './field-management-search/index'
  import FieldAddmodifyDialog from './field-addmodify-dialog/index'
  import reqFd from 'api/system/info-management/field-management/index'

  export default{
    name: 'FieldManagement',
    components: {
      ILayout,
      FieldManagementSearch,
      FieldAddmodifyDialog
    },
    data () {
      return {
        // 表格加载的初始状态
        fieldLoading: false,
        // 字段的ID
        fieldID: '',
        // 信息集名称
        infName: '',
        // 表名
        tableName: '',
        // 选中需要启用字段的ID
        hasFieldID: null,
        // 列表
        table: {
          columns: [
            { prop: 'columnName', label: '字段名称' },
            { prop: 'columnFieldName', label: '数据库列' },
            { prop: 'columnType', label: '字段类型' },
            { prop: 'componentType', label: '组件类型', display: {dict: 'MSG_COMPONENT_TYPE'} },
            { prop: 'status', label: '状态', display: { dict: 'MSG_INF_STATUS' } }
          ],
          setting: {
            toolbar: [
              {
                text: '新增',
                key: 'ColumnCreate',
                func: this.addField
              },
              {
                text: '启用',
                key: 'ColumnEnable',
                func: this.enableField
              },
              {
                text: '禁用',
                key: 'ColumnDisable',
                func: this.disableField
              },
              {
                text: '删除',
                type: 'danger',
                key: 'ColumnDelete',
                func: this.deleteField
              }
            ],
            editor: {
              columnName: {
                type: 'button',
                func: row => this.checkFieldDetails(row)
              }
            },
            operator: [{
              text: '修改',
              key: 'ColumnUpdate',
              func: row => this.modifyField(row),
              show (row) {
                if (row.status === '02') {
                  return {
                    disable: true
                  }
                }
              }
            }]
          },
          data: null,
          showPagebar: true,
          total: 0,
          search: null,
          info: null
        }
      }
    },
    created () {
      this.fieldID = this.$route.query.infTableId
      this.infName = this.$route.query.infName
      this.tableName = this.$route.query.tableName
    },
    mounted () {
      if (this.fieldID) {
        this.table.search = {infTableId: this.fieldID}
      }
    },
    methods: {
      // 每页展示多少条数据
      handleSizeChange (params) {
        console.log(params)
        this.fetch(params)
      },
      // 获取页数数据
      handleCurrentChange (params) {
        console.log(params)
        this.fetch(params)
      },
      // 勾选选择的表格项
      handleSelectionChange (val) {
        this.hasFieldID = val.map(item => {
          return item.infColumnId
        })
      },
      // 根据搜索条件，获取信息集列表
      fetch (params = {}) {
        this.fieldLoading = true
        reqFd('getFieldList', params).then(res => {
          this.fieldLoading = false
          if (res) {
            console.log(res)
            this.table = Object.assign(this.table, res)
          }
        })
      },
      // 搜索按钮
      search (params = {}) {
        if (this.fieldID) {
          params.infTableId = this.fieldID
        }
        console.log(params)
        this.table.search = {...params}
      },
      // 新增字段集按钮
      addField () {
        this.$refs.fieldAddModifyDialog.openDialog(true)
      },
      // 修改字段集按钮
      modifyField (row) {
        this.$refs.fieldAddModifyDialog.openDialog(true, row)
      },
      // 查看信息集详情
      checkFieldDetails (row) {
        this.$refs.fieldAddModifyDialog.openDialog(true, row, true)
      },
      // 启用字段的按钮
      enableField () {
        if ((!this.hasFieldID) || (this.hasFieldID.length === 0)) {
          this.$message.warning('请勾选需要启用的字段！')
        } else {
          this.$confirm('确定要启用字段吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = this.hasFieldID
            reqFd('enableField', params).then(res => {
              if (res) {
                this.$message.success('启用成功！')
                this.reload()
              }
            })
          }).catch(() => {
            console.log('已取消！')
          })
        }
      },
      // 禁用字段的按钮
      disableField () {
        if ((!this.hasFieldID) || (this.hasFieldID.length === 0)) {
          this.$message.warning('请勾选需要禁用的字段！')
        } else {
          this.$confirm('确定要禁用字段吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = this.hasFieldID
            reqFd('disableField', params).then(res => {
              if (res) {
                this.$message.success('禁用成功！')
                this.reload()
              }
            })
          }).catch(() => {
            console.log('已取消！')
          })
        }
      },
      // 删除字段的按钮
      deleteField () {
        if ((!this.hasFieldID) || (this.hasFieldID.length === 0)) {
          this.$message.warning('请勾选要删除的字段！')
        } else {
          let paramsData = {infColumnIds: this.hasFieldID.join(',')}
          console.log(paramsData)
          reqFd('validateDeleteColumn', paramsData).then(res => {
            console.log(res)
            this.hint(res)
          })
        }
      },
      // 删除字段时的提示语函数
      hint (val) {
        this.$confirm(val !== '' ? `${val}, 是否继续删除？` : '确定要删除该字段吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {infColumnIds: this.hasFieldID.join(',')}
          reqFd('deleteField', params).then(res => {
            if (res) {
              this.$message.success('删除成功！')
              this.reload()
            }
          })
        }).catch(() => {
          console.log('已取消删除！')
        })
      },
      // 刷新页面
      reload () {
        if (this.fieldID) {
          this.table.search = {infTableId: this.fieldID}
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

