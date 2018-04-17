<template>
  <div>
    <i-layout>
      <!-- 用户查询 -->
      <div slot="header" v-if="accessMap.sysUsersFindUserListGet">
        <i-form  @reset="doReset" @search="doSearch">
          <el-form-item label="用户名称">
            <el-input v-model="searchCondition.userName" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="searchCondition.loginId" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <i-select v-model="searchCondition.isEnabled" parameter="SYS_USER_STATUS" placeholder="请选择字典"></i-select>
            <!-- <el-input v-model="searchCondition.isEnabled"></el-input> -->
          </el-form-item>
        </i-form>
      </div>
      <!-- 用户表格列表 -->
      <div slot="section">
        <i-table :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table
              border
              ref="multipleTable"
              :data="tableScope.clone"
              tooltip-effect="dark"
              style="width: 100%"
              v-loading="loading"
              :element-loading-text="$loadingText"
            >
              <!-- <el-table-column type="selection"></el-table-column> -->
              <el-table-column
                type="index"
                label="ID"
                align="center"
                width="55"
              >
              </el-table-column>
              <el-table-column 
                v-for="(item, idx) in table.columns"
                :key="idx"
                :prop="item.prop"
                :label="item.label"
                :align="item.align"
                :formatter="tableScope.formatter"
              ></el-table-column>
              <!-- 用户表格右侧操作按钮列 -->
              <i-table-operator :table="tableScope"></i-table-operator>
            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>
    
    <!-- 增加以及修改用户公用dialog -->
    <i-dialog 
      v-model="showAddOrEditorUserDialog"
      :title="title"
      size="standard"
      :toolbar="toolbar"
      @close="resetUserInfo"
    >
      <el-form :model="userInfo" status-icon :rules="userInfoRules" ref="addOrEditorForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名称：" prop="userName" required>
          <el-input v-model="userInfo.userName" auto-complete="off" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="登录账户：" prop="loginId" required>
          <el-input v-model="userInfo.loginId" auto-complete="off" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="登录密码：" prop="pwd" v-if="addOREditorStatu === 'addUser'" required>
          <el-input type="password" v-model="userInfo.pwd" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone" required>
          <el-input v-model="userInfo.phone" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email" required>
          <el-input type="text" v-model="userInfo.email" maxlength="100"></el-input>
        </el-form-item>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import req from 'api/system/user-managerment'
import access from 'mixins/access'
export default {
  mixins: [access],

  data () {
    return {
      loading: true,
      // 查询用户条件
      searchCondition: {
        userName: '',
        loginId: '',
        isEnabled: ''
      },
      // 用户管理表格
      table: {
        columns: [
          // 表格每列表头及相关配置
          { prop: 'userName', label: '用户名称', align: 'center' },
          { prop: 'loginId', label: '账号', align: 'center' },
          { prop: 'email', label: '邮箱', align: 'center' },
          { prop: 'phone', label: '手机号码', align: 'center' },
          { prop: 'isEnabled', label: '状态', display: {dict: 'SYS_USER_STATUS'}, align: 'center' }
        ],
        setting: {
          // 表格上方按钮配置
          toolbar: [
            {
              text: '新增用户',
              type: 'primary',
              key: 'sysUsersCreateUserPost',
              func: () => this.addUser()
            }
          ],
          // 用来记录'停用'按钮的text文字内容
          stopCurrentUserTextContent: '',
          // 表格右侧操作栏按钮配置
          operator: [
            {
              text: '修改',
              key: 'sysUsersUpdateUserPut',
              func: (row) => {
                this.editorUser(row)
              }
            },
            {
              text: '授权',
              key: 'systemUsersGrantRouter',
              func: (row) => this.givingPower(row)
            }
            // {
            //   text: '停用',
            //   key: 'sysUsersDisablePut',
            //   func: (row) => {
            //     this.stopCurrentUser(row)
            //   },
            //   show: (row) => {
            //     if (row.canLocalLogin === 'N') {
            //       return {
            //         message: '十分抱歉，您不可以停用该用户！',
            //         disable: true
            //       }
            //     }
            //     if (row.isEnabled === 'N') {
            //       return {
            //         disable: true
            //       }
            //     }
            //   }
            // },
            // {
            //   text: '启用',
            //   key: 'sysUsersEnabledPut',
            //   func: (row) => {
            //     this.startCurrentUser(row)
            //   },
            //   show: (row) => {
            //     if (row.canLocalLogin === 'N') {
            //       return {
            //         message: '十分抱歉，您不可以启用该用户！',
            //         disable: true
            //       }
            //     }
            //     if (row.isEnabled === 'Y') {
            //       return {
            //         disable: true
            //       }
            //     }
            //   }
            // }
            // {
            //   text: '删除',
            //   key: 'sysUsersUpdateUserPut',
            //   // func: () => this.deleteCurrentUser()
            //   func: function () {

            //   }
            // }
          ]
        },
        data: null,
        // 查询条件，i-table通过监听table.search来触发数据请求
        search: null,
        // 注册 page 相关信息
        showPagebar: true,
        info: null,
        total: 0
      },
      // 当前页面请求数据的条件
      // nowSearchCondition: {},
      // 控制模态框显示隐藏
      showAddOrEditorUserDialog: false,
      // 新增修改用户弹窗标题
      title: '',
      // 记录弹窗状态(新增还是编辑)
      addOREditorStatu: '',
      // 新增修改模态框按钮
      toolbar: [
        {
          text: '取消',
          type: 'text',
          func: () => {
            this.resetUserInfo()
          }
        },
        {
          throttle: true,
          text: '确定',
          type: 'primary',
          func: () => {
            return this.postNewUserOrChangedUserInfo()
          }
        }
      ],
      // 增加或者修改用户表单配置
      userInfo: {
        userName: '',
        loginId: '',
        pwd: '',
        phone: '',
        email: ''
      },
      // 新增修改模态框规则验证
      userInfoRules: {
        userName: [{
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('您好！请输入用户名'))
            } else {
              if (/\s/.test(value)) {
                callback(new Error('亲！用户名中不可以包含空格'))
              } else if (!/^.{2,15}$/.test(value)) {
                callback(new Error('sorry！用户名长度为3-15位'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }],
        loginId: [{
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('您好！请输入登录账号'))
            } else {
              if (/\s/.test(value)) {
                callback(new Error('亲！登录账号中不可以包含空格'))
              } else if (!/^.{2,15}$/.test(value)) {
                callback(new Error('sorry！登录账号长度为3-15位'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }],
        pwd: [{
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('您好！请输入密码'))
            } else {
              if (/[\u4e00-\u9fa5\s]/.test(value)) {
                callback(new Error('亲！密码中不可以包含中文或者空格'))
              } else if (!/^.{6,20}$/.test(value)) {
                callback(new Error('sorry！密码长度需要为6~20位'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }],
        phone: [{
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('您好！请输入电话号码'))
            } else {
              if (!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(value)) {
                callback(new Error('亲！您的手机号码格式有误'))
              } else {
                callback()
              }
            }
          },
          trigger: 'blur'
        }],
        email: [{
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('您好！请输入邮箱'))
            } else {
              if (!/^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/.test(value)) {
                callback(new Error('亲！您的邮箱格式有误'))
              } else {
                callback()
              }
            }
          },
          trigger: 'change, blur'
        }]
      }
    }
  },

  methods: {
    // 监听 pageIndex 和 pageSize 的变动
    handleSizeChange (searchCondition) {
      // this.nowSearchCondition = searchCondition
      this.table.info = searchCondition
      this.loading = true
      this.getUserList(searchCondition)
    },
    handleCurrentChange (searchCondition) {
      // this.nowSearchCondition = searchCondition
      this.table.info = searchCondition
      this.loading = true
      this.getUserList(searchCondition)
    },
    // 获取用户列表数据
    getUserList (searchCondition) {
      req('getUserList', searchCondition)
      .then(res => {
        Object.keys(res).map(key => {
          key !== 'additions' && (this.table[key] = res[key])
        })
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
    },
    // 查询
    doSearch () {
      this.table.search = { ...this.searchCondition }
    },
    // 置空用户表单查询条件，同时重新请求数据
    doReset () {
      Object.keys(this.searchCondition).map(key => {
        this.searchCondition[key] = ''
      })
      this.table.search = { ...this.searchCondition }
    },
    // 设置新增状态时弹框标题和状态
    addUser () {
      this.title = '新增用户'
      this.addOREditorStatu = 'addUser'
      this.showAddOrEditorUserDialog = true
    },
    // 设置修改状态时弹框标题和状态
    editorUser (row) {
      this.title = '修改用户'
      this.addOREditorStatu = 'editorUser'
      this.getUserInfo(row)
      this.showAddOrEditorUserDialog = true
    },
    // 当用户点击修改按钮时候请求该数据
    getUserInfo (row) {
      req('getUserInfo', {loginId: row.loginId})
      .then(res => {
        Object.keys(res).map(key => {
          this.userInfo[key] = res[key]
        })
      })
    },
    // 弹窗关闭时应该清空表单数据同时清空表单验证规则提示
    resetUserInfo () {
      this.showAddOrEditorUserDialog = false
      this.$refs.addOrEditorForm.resetFields()
      Object.keys(this.userInfo).map(key => {
        this.userInfo[key] = ''
      })
    },
    // 提交新增的用户或者被修改的用户信息
    postNewUserOrChangedUserInfo () {
      let statu = false
      this.$refs['addOrEditorForm'].validate((valid) => {
        valid && (statu = true)
      })
      if (statu) {
        // this.addOREditorStatu === 'addUser' && this.postNewUserInfo()
        // this.addOREditorStatu === 'editorUser' && this.postChangedUserInfo()
        if (this.addOREditorStatu === 'addUser') return this.postNewUserInfo()
        if (this.addOREditorStatu === 'editorUser') return this.postChangedUserInfo()
      } else {
        this.$message.error('请将用户信息填写完整')
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    // 提交新增用户
    postNewUserInfo () {
      // 临时加入被干掉的这个东西。应为后台代码还没有更改---开始
      this.$set(this.userInfo, 'canLocalLogin', 'Y')
      // 临时加入被干掉的这个东西。应为后台代码还没有更改---结束
      return req('createUser', this.userInfo)
      .then(res => {
        this.resetUserInfo()
        this.$message.success('恭喜您，新增用户成功！')
        // this.table.search = { ...this.searchCondition }
        Object.keys(this.searchCondition).map(key => {
          this.searchCondition.key = ''
        })
        this.loading = true
        this.getUserList({...this.searchCondition, pageIndex: 1, pageSize: this.table.info.pageSize})
      })
    },
    // 提交被修改的用户
    postChangedUserInfo () {
      return req('updateUser', this.userInfo)
      .then(res => {
        this.resetUserInfo()
        this.$message.success('恭喜您，用户修改成功！')
        this.loading = true
        this.getUserList(this.table.info)
      })
    },
    // 跳转至授权页面
    givingPower (row) {
      this.$router.push({
        path: 'power_management',
        query: {userId: row.userId, userNmae: row.userName, loginId: row.loginId, conditions: JSON.stringify(this.searchCondition)}
      })
    },
    // 停用当前用户
    stopCurrentUser (row) {
      this.$confirm(`此操作将禁用${row.userName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        req('stopUser', {userId: row.userId})
        .then(res => {
          this.$message.success(`${row.userName}被您成功禁用`)
          this.loading = true
          this.getUserList(this.table.info)
        })
      }).catch(() => {
        this.$message.info('您已经取消禁用')
      })
    },
    // 启用当前用户
    startCurrentUser (row) {
      this.$confirm(`此操作将启用${row.userName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        req('startUser', {userId: row.userId})
        .then(res => {
          this.$message.success(`${row.userName}被您成功启用`)
          this.loading = true
          this.getUserList(this.table.info)
        })
      }).catch(() => {
        this.$message.info('您已经取消启用')
      })
    },
    // 删除当前用户
    deleteCurrentUser () {
      console.log('deleteCurrentUser')
    }
  },

  mounted () {
    // 组件挂完成后触发i-table监听请求数据
    this.$route.query.conditions && (this.searchCondition = JSON.parse(this.$route.query.conditions))
    this.table.search = { ...this.searchCondition }
  }
}
</script>

<style lang="scss" scoped>

</style>
