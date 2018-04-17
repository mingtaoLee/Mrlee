<template>
  <div class="batch-set-user">
    <i-layout>
    <!-- 用户查询 -->
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item label="用户名称">
            <el-input v-model="searchParams.userName" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="登录账号">
            <el-input v-model="searchParams.loginId" maxlength="100"></el-input>
          </el-form-item>
          <!-- <el-form-item label="邮箱">
            <el-input v-model="searchParams.email"></el-input>
          </el-form-item> -->
        </i-form>
      </div>
   <!-- 配置用户管理表格 -->  
      <div slot="section">
        <i-table :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table 
            :data="tableScope.clone"
            border
            tooltip-effect="dark"
            style="width: 100%" align="center"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            :element-loading-text="$loadingText">
              <el-table-column type="selection" width="55" />
                <el-table-column v-for="(item, idx) in table.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :formatter="tableScope.formatter"
                  align="center"
                ></el-table-column>
              </el-table>
            </template>
        </i-table>
      </div>
    </i-layout>

    <!-- 新增用户模态框 -->
    <i-dialog :title="title" v-model="userDialogVisible" :toolbar="toolbar" size="large">
      <dialog-create-user ref="dialogCreateUser" :roleId='roleId' @unAuthorizedUser='getUnAuthorizedUser'></dialog-create-user>
    </i-dialog>
  </div>
</template>

<script>
import req from 'api/system/role-management'
import DialogCreateUser from './dialog-create-user'
export default {
  components: {
    DialogCreateUser
  },
  data () {
    return {
      loading: false,
      searchParams: {
        userName: '',
        loginId: ''
      },
      roleId: '',
      dialogFlag: false,
      toolbar: [{
        text: '取消',
        type: 'default',
        func: () => this.goBack()
      }, {
        text: '确定',
        type: 'primary',
        func: () => this.submitUnAuthorizedUser()
      }],
      table: {
        columns: [
          { prop: 'userName', label: '用户名称' },
          { prop: 'loginId', label: '登录账号' },
        //   { prop: 'value', label: '工号' },
          { prop: 'phone', label: '电话' },
          { prop: 'email', label: '邮箱' }
        ],
        setting: {
          toolbar: [{
            text: '新增用户',
            type: 'primary',
            key: 'sysRolesUpdateRoleUserPost',
            func: () => this.insertUser()
          }, {
            text: '删除',
            type: 'danger',
            key: 'sysRolesUserDelete',
            func: () => this.deleteAuthorizedUser()
          }]
        },
        data: null,
        showPagebar: true,
        search: null,
        info: null,
        total: 0
        // editRoleData: {}
      },

      // 模态框
      userDialogVisible: false,
       // 记录选择的条数
      multipleSelection: [],
      title: '添加权限用户',
      // 未授权的用户数据
      unAuthorizedUserData: []
    }
  },

  created () {
    this.roleId = this.$route.params.roleId
  },

  mounted () {
    this.table.search = { ...this.searchParams }
  },

  methods: {
    // 查询
    search () {
      this.table.search = { ...this.searchParams }
    },
    // 重置
    reset () {
      //  新添加方法重置
      Object.keys(this.searchParams).map(item => {
        this.searchParams[item] = ''
      })
      this.table.search = { ...this.searchParams }
    },
    // 监听 pageIndex 和 pageSize 的变动
    handleSizeChange (options) {
      this.loading = true
      this.getRoleUser(options)
    },
    handleCurrentChange (options) {
      this.loading = true
      this.getRoleUser(options)
    },
    // 获取参数列表
    getRoleUser (options) {
      options.roleId = this.roleId
      req('getRoleUser', options)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(
          key => (this.table[key] = res[key])
        )
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
    },
    // 新增按钮方法
    insertUser () {
      if (this.multipleSelection.length < 1) {
        // 显示模态框
        this.userDialogVisible = true
        this.dialogFlag && this.$refs['dialogCreateUser'].getData()
        this.dialogFlag = true
      } else {
        this.$message('添加权限用户，不能选择人员')
      }
    },
    // 选中某一项的时候
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取勾选的未授权用户数据
    getUnAuthorizedUser (val) {
      this.unAuthorizedUserData = val
    },
    // 提交添加权限用户数据
    submitUnAuthorizedUser () {
      req('postRoleUser', {roleId: this.roleId, userList: this.unAuthorizedUserData})
      .then(res => {
        this.userDialogVisible = false
        this.loading = true
        this.getRoleUser(this.searchParams)
      })
    },
    // 删除
    deleteAuthorizedUser () {
      if (this.multipleSelection.length < 1) {
        this.$message('请选择需要删除的用户')
      } else {
        //  获取数据，发送请求删除
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let userIds = []
          this.multipleSelection.map(item => userIds.push(item.userId))
          req('deleteRoleUser', {roleId: this.roleId, userIds: userIds.join(',')})
          .then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.loading = true
            this.getRoleUser(this.searchParams)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
       //  返回
    goBack () {
      // 隐藏模态框
      this.userDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

