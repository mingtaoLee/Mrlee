<template>
  <div class="wrap">
    <i-layout headerKey="InfQuery">
      <!-- 搜索部分 -->
      <info-management-search slot="header" @search="search"></info-management-search>

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
              v-loading="infoLoading"
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
    <info-addmodify-dialog ref="infoAddModifyDialog" @submit="reload"></info-addmodify-dialog>

    <!-- 查看的模态框 -->
    <info-details-dialog ref="infoDetailsDialog"></info-details-dialog>

  </div>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import InfoManagementSearch from './info-management-search/index'
  import InfoAddmodifyDialog from './info-addmodify-dialog/index'
  import InfoDetailsDialog from './info-details-dialog/index'
  import reqIn from 'api/system/info-management/index'

  export default {
    name: 'InfoManagement',
    components: {
      ILayout,
      InfoManagementSearch,
      InfoAddmodifyDialog,
      InfoDetailsDialog
    },
    data () {
      return {
        // 表格加载的初始状态
        infoLoading: false,
        // 选中需要启用的信息集的ID
        hasInfoID: null,
        // 列表
        table: {
          columns: [
            { prop: 'infName', label: '信息集名称' },
            { prop: 'tableName', label: '数据库表' },
            { prop: 'classification', label: '相关类型', display: { dict: 'MSG_INF_TABCODE' } },
            { prop: 'refStatus', label: '规则引用', display: { dict: 'WHETHER_TYPE' } },
            { prop: 'status', label: '状态', display: { dict: 'MSG_INF_STATUS' } }
          ],
          setting: {
            toolbar: [
              {
                text: '新增',
                key: 'InfCreate',
                func: this.addInfoManagement
              },
              {
                text: '启用',
                key: 'InfEnable',
                func: this.enableInfo
              },
              {
                text: '禁用',
                key: 'InfDisable',
                func: this.disableInfo
              },
              {
                text: '删除',
                type: 'danger',
                key: 'InfDelete',
                func: this.deleteInfoManagement
              }
            ],
            editor: {
              infName: {
                type: 'button',
                func: row => this.checkDetails(row)
              }
            },
            operator: [{
              text: '字段管理',
              key: 'ColumnManage',
              func: row => this.goFieldManagement(row),
              show (row) {
                if (row.status === '02') {
                  return {
                    disable: true
                  }
                }
              }
            }, {
              text: '修改',
              key: 'InfUpdate',
              func: row => this.modifyInfoManagement(row),
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
    mounted () {
      this.table.search = {}
    },
    methods: {
      // 每页展示多少条数据
      handleSizeChange (params) {
        this.fetch(params)
      },
      // 获取页数数据
      handleCurrentChange (params) {
        this.fetch(params)
      },
      // 勾选选择的表格项
      handleSelectionChange (val) {
        this.hasInfoID = val.map(obj => obj.infTableId)
      },
      // 根据搜索条件，获取信息集列表
      fetch (params = {}) {
        this.infoLoading = true
        reqIn('getInfoList', params).then(res => {
          this.infoLoading = false
          if (res) {
            this.table = Object.assign(this.table, res)
          }
        })
      },
      // 搜索按钮
      search (params = {}) {
        this.table.search = {...params}
      },
      // 新增信息集按钮
      addInfoManagement () {
        this.$refs.infoAddModifyDialog.openDialog(true)
      },
      // 修改信息集详情
      modifyInfoManagement (row) {
        this.$refs.infoAddModifyDialog.openDialog(true, row)
      },
      // 查看信息集详情
      checkDetails (row) {
//        this.$refs.infoDetailsDialog.openDialog(true, row)
        this.$refs.infoAddModifyDialog.openDialog(true, row, 'check')
      },
      // 去字段管理页面
      goFieldManagement (row) {
        this.$router.push({path: '/system/field_management', query: { infTableId: row.infTableId, infName: row.infName, tableName: row.tableName }})
      },
      // 启用信息集的按钮
      enableInfo () {
        if ((!this.hasInfoID) || (this.hasInfoID.length === 0)) {
          this.$message.warning('请勾选需要启用的信息集！')
        } else {
          this.$confirm('确定要启用信息集吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = this.hasInfoID
            reqIn('enableInfo', params).then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '启用成功!'
                })
                this.reload()
              }
            })
          }).catch(() => {
            console.log('已取消！')
          })
        }
      },
      // 禁用信息集的按钮
      disableInfo () {
        if ((!this.hasInfoID) || (this.hasInfoID.length === 0)) {
          this.$message.warning('请勾选需要禁用的信息集！')
        } else {
          this.$confirm('确定要禁用信息集吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = this.hasInfoID
            reqIn('disableInfo', params).then(res => {
              console.log(res)
              if (res) {
                this.$message({
                  type: 'success',
                  message: '禁用成功!'
                })
                this.reload()
              }
            })
          }).catch(() => {
            console.log('已取消！')
          })
        }
      },
      // 删除信息集按钮
      deleteInfoManagement () {
        if ((!this.hasInfoID) || (this.hasInfoID.length === 0)) {
          this.$message.warning('请勾选要删除的信息集！')
        } else {
          let paramsData = {infTableIds: this.hasInfoID.join(',')}
          reqIn('validateDeleteInfo', paramsData).then(res => {
            this.hint(res)
          })
        }
      },
      // 删除信息集时的提示函数
      hint (val) {
        this.$confirm(val !== '' ? `${val}, 是否继续删除？` : '确定要删除该信息集吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {infTableIds: this.hasInfoID.join(',')}
          reqIn('deleteInfo', params).then(res => {
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
        this.table.search = {}
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
