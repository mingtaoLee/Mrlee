<template>
  <div class="role-management">
    <i-layout>
      <!-- <div class="form-card card"  v-if="accessMap.sysRolesPageGet"> -->
      <!-- 搜索 -->
      <div slot="header"  v-if="accessMap.sysRolesPageGet">
        <i-form @reset="reset" @search="search" @submit.native.prevent>
          <el-form-item label="角色名称">
            <el-input v-model="searchList.roleName" placeholder="角色名称" maxlength="100"></el-input>
          </el-form-item>
        </i-form>
      </div>

      <!-- 角色管理表格 -->
      <div slot="section">
        <i-table :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table
              :data="tableScope.clone"
              border 
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              v-loading="loading"
              :element-loading-text="$loadingText"
              >
              <el-table-column type="selection" width="55" />
              <!-- <el-table-column
                label="系统角色"
                width="300"
                align="center">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.roleName }}-我新增加的可以了吧</el-button>
                </template>
              </el-table-column> -->
              <el-table-column v-for="(item, idx) in table.columns"
                :key="idx"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :formatter="tableScope.formatter"
                align="center"
              />
              <!-- <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope"> -->
                  <i-table-operator :table="tableScope" />
                <!-- </template>
              </el-table-column> -->
            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>

    <!-- 新增与编辑模态框 -->
    <i-dialog :title="title" v-model="roleDialogVisible" :toolbar="toolbar">
      <!-- 上表单 -->
      <el-form :model="form" :rules="rules" ref='form'>
        <el-form-item label="系统角色" :label-width="formLabelWidth"  prop="roleName">
          <el-input v-model="form.roleName" style='width:500px' maxlength="100"></el-input>
        </el-form-item>
        <!-- <el-form-item label="角色类型" :label-width="formLabelWidth"  prop="roleType"> -->
          <!-- TODO：改成选择 -->
          <!-- <el-input v-model="form.roleType" style='width:400px'></el-input>
          <i-select v-model="form.roleType" parameter="WHETHER_TYPE"  style='width:400px'></i-select>                   
        </el-form-item> -->
        <el-form-item label="描述" :label-width="formLabelWidth"  prop="description">
          <el-input v-model="form.description" style='width:500px' maxlength="100"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="goBack">返 回</el-button>
        <el-button type="primary" @click="submitRoleData('form')">提 交</el-button>
      </div> -->
    </i-dialog>

    <!-- 权限管理模态框 -->
     <!-- <el-dialog title="功能权限" :visible.sync="functionDialogVisible" >
       <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="系统管理" name="1">
          <table> -->
          <!-- TODO:暂定需要根据父节点的id显示-->
            <!-- v-if='item.parentMenuId === "1"?true:false' -->
            <!-- <tr v-for='item in jurisdictionList.roleMenuList' :key='item.menuId' >
              <td class="" style="width: 150px;">
                {{item.menuName}}
              </td>
              <td>
                <el-checkbox v-model="item.isHadPower" :disabled='isAble?true:false'>View</el-checkbox>
              </td>
            </tr>
          </table>
        </el-collapse-item>
        <el-collapse-item title="应用管理" name="2">
          <table> -->
            <!-- v-if='item.parentMenuId === "1"?true:false' -->
            <!-- <tr v-for='item in jurisdictionList.roleMenuList' :key='item.menuId' v-if='item.parentMenuId === "1"?true:false'>
              <td class="" style="width: 150px;">
                {{item.menuName}}
              </td>
              <td>
                <el-checkbox v-model="item.isHadPower">View</el-checkbox>
              </td>
            </tr>
          </table>
        </el-collapse-item>
       </el-collapse>
        <div slot="footer" class="dialog-footer">
          <el-button @click="functionDialogVisible = false">返 回</el-button>
          <el-button type="primary" @click="submitJurisdictionList()" v-if='!isAble?true:false'>确 定</el-button>
        </div>
     </el-dialog> -->
  </div>
</template>

<script>
import req from 'api/system/role-management'
// import ISelect from 'components/common/i-select/i-select'
import ITable from 'components/common/i-table'
import IForm from 'components/common/i-form/i-form'
import ILayout from 'components/common/i-layout'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import ITableOperator from 'components/common/i-table-operator'
import access from 'mixins/access'
export default {
  mixins: [access],

  components: {
    // ISelect,
    ITable,
    IForm,
    IDialog,
    ILayout,
    ITableOperator
  },

  data () {
    return {
      loading: false,
      // 记录输入的搜索条件
      searchList: {
        roleName: null
      },
      toolbar: [{
        text: '取消',
        type: 'default',
        func: () => this.goBack()
      }, {
        throttle: true,
        text: '确定',
        type: 'primary',
        func: () => this.submitRoleData('form')
      }],
      table: {
        columns: [
          { prop: 'roleName', label: '系统角色' },
          // { prop: 'roleType', label: '角色类型', width: 300 },
          { prop: 'description', label: '描述' }
        ],
        setting: {
          toolbar: [{
            text: '新增',
            type: 'primary',
            key: 'sysRolesPost',
            func: () => this.insertRole()
          }, {
            text: '删除',
            type: 'danger',
            key: 'sysRolesIdsDelete',
            func: () => this.deleteRole()
          }],
          operator: [{
            text: '编辑',
            key: 'sysRolesPut',
            func: this.getJurisdictionList
          }, {
            text: '赋权',
            key: 'sysRolesRoleMenuUrlPowerPost',
            func: this.giveJurisdiction
          }, {
            text: '批量设置用户',
            key: 'sysRolesSetUserRouter',
            func: this.batchSetUser
          }]
        },
        data: null,
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },
      // 新增模态框
      roleDialogVisible: false,
      formLabelWidth: '120px',
       // 表单
      form: {
        // 角色名称
        roleName: '',
        // 角色类型
        roleType: '',
        // 描述
        description: ''
      },
      // 功能模态框
      // functionDialogVisible: false,
      // 检验规则
      rules: {
        roleName: [
          { required: true, message: '请输入系统角色', trigger: 'blur' }
        ],
        roleType: [
          { required: true, message: '请选择角色类型', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写描述', trigger: 'blur' }
        ]
      },
       // 记录选择的条数
      multipleSelection: [],
      // 权限列表
      jurisdictionList: {},
      // 是否可以编辑权限
      isAble: false,
      // 折叠板把全部打开
      activeNames: ['1', '2'],
      // 模态框名称
      title: '',
      // 判断是新增还是编辑
      addOReditor: 0
    }
  },

  methods: {
    // 查询
    search () {
      this.table.search = { ...this.searchList }
    },
    // 重置
    reset () {
      //  新添加方法重置
      Object.keys(this.searchList).map(item => {
        this.searchList[item] = ''
      })
      this.table.search = { ...this.searchList }
    },
    // 点击编辑事件
    getJurisdictionList (row) {
      // this.$router.push('person/' + row.roleId + '/' + true)
      Object.keys(this.form).map(item => {
        this.form[item] = ''
      })
      this.title = '编辑系统角色'
      // 显示模态框
      this.roleDialogVisible = true
      // 编辑状态标记
      this.addOReditor = 2
      // let editRoleData = this.table.data.filter((val, index) => {
      //   return val.roleId === row.roleId
      // })[0]
      // 给form赋值
      Object.keys(row).map(
        key => (this.form[key] = row[key])
      )
      delete this.form._id
    },
    // 赋权
    giveJurisdiction ({roleId, roleName}) {
      this.$router.push({
        path: 'customers_role_management',
        query: {
          roleId,
          roleName
        }
      })
    },
    // 批量设置用户
    batchSetUser (row) {
      this.$router.push('batch_set_user/' + row.roleId)
    },
    // handleClick (row) {
    //   this.$router.push('person/' + row.roleId + '/' + false)
    // },
    // 监听 pageIndex 和 pageSize 的变动
    handleSizeChange (options) {
      this.table.info = options
      this.loading = true
      this.getRoleList(options)
    },
    handleCurrentChange (options) {
      this.table.info = options
      this.loading = true
      this.getRoleList(options)
    },
    // 获取角色列表
    getRoleList (listParams) {
      req('getRoleList', listParams)
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
    insertRole () {
      if (this.multipleSelection.length < 1) {
        // 先把form清空,以防上一次有影响
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
        delete this.form.roleId
        delete this.form.createBy
        delete this.form.createDate
        delete this.form.lastUpdateBy
        delete this.form.lastUpdateDate
        this.title = '新增系统角色'
        // 显示模态框
        this.roleDialogVisible = true
        this.addOReditor = 1
      } else {
        this.$message.error('新增用户，不能选择人员')
      }
    },
    // 提交信息
    submitRoleData (formName) {
      let status = false
      this.$refs[formName].validate(valid => {
        valid && (status = true)
      })
      if (status) {
      // 根据状态选择是发送新增请求还是修改的请求
        if (this.addOReditor === 1) {
          //  新增请求
          return req('createRole', this.form)
            .then(res => {
              this.loading = true
              this.getRoleList(this.table.info)
              // this.$message('新增成功')
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              // 隐藏模态框
              this.roleDialogVisible = false
            })
        } else if (this.addOReditor === 2) {
          // 修改请求
          return req('putEditRole', this.form)
            .then(res => {
              this.loading = true
              this.getRoleList(this.table.info)
              // this.$message('修改成功')
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              // 隐藏模态框
              this.roleDialogVisible = false
            })
        }
      } else {
        this.$message.error('请先按要求输入')
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    },
    // 选中某一项的时候
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 提交权限菜单
    // submitJurisdictionList () {
    //   this.jurisdictionList.roleMenuList.map(item => {
    //     if (item.isHadPower) {
    //       item.isHadPower = 'Y'
    //     } else {
    //       item.isHadPower = 'N'
    //     }
    //   })
    //   // console.log(this.jurisdictionList)
    //   req('submitJurisdictionList', this.jurisdictionList)
    //     .then(res => {
    //       if (res) {
    //         this.$message({
    //           message: '保存成功',
    //           type: 'success'
    //         })
    //       }
    //     })
    //   // this.functionDialogVisible = false
    // },
    // 删除
    deleteRole () {
      if (this.multipleSelection.length < 1) {
        this.$message('请选择需要删除的角色')
      } else {
        //  获取数据，发送请求删除
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let ids = []
          this.multipleSelection.map(item => ids.push(item.roleId))

          req('deleteDeleteRoles', {ids: ids.join(',')})
          .then(res => {
            // this.$message('删除成功')
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.loading = true
            this.getRoleList(this.table.info)
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
      // 先把内容全部置空
      Object.keys(this.form).map(item => {
        this.form[item] = ''
      })
      // 隐藏模态框
      this.roleDialogVisible = false
    }
  },

  mounted () {
    this.table.search = {...this.searchList}
  }
}
</script>

<style lang="scss" scoped>

</style>
