<template>
  <section class="permission">
    <i-layout>
      <div slot="section">

        <el-form :model="listParams" :rules="rules" ref="form" label-width="150px" class="form">
          <el-form-item label="用户名称"  prop="roleType">
            <el-input v-model="listParams.userName" icon="menu" :disabled="$route.params.userId !== '-1'" readonly :on-icon-click="chooseUser" maxlength="100"/>
          </el-form-item>

          <el-form-item label="联系电话"   prop="roleType">
            <el-input v-model="listParams.phone"  disabled maxlength="100"/>
          </el-form-item>

          <el-form-item label="邮箱"  prop="description">
            <el-input v-model="listParams.email" disabled maxlength="100"/>
          </el-form-item>

          <el-form-item label="角色权限"   prop="description">

            <div v-for="(item,idx) in listParams.userRoleList" :key="idx" class="content">
              <el-select v-model="item.roleId" class="input" @change="changeValue(idx, $event)"  @visible-change="visibleSelect($event)">
                <el-option v-for="(rol, idx) in roleList" :key="idx" :label="rol.roleName" :disabled="rol.disabled" :value="rol.roleId"/>
              </el-select>
              <i class="el-icon-delete icon" @click="listParams.userRoleList.splice(idx,1) && roleIds.splice(idx, 1)" ></i>
            </div>
            <i v-if="!listParams.userRoleList.length || (roleList && roleList.length) !== listParams.userRoleList.length"  class="el-icon-plus" @click="plusRole" />
          </el-form-item>

          <!-- <el-form-item label="数据权限" :label-width="formLabelWidth" prop="description">
            <i class='el-icon-plus' @click='plusData'></i>
            <div v-for='(item,index) in dataRole' :key='index'>
              <el-input v-model="item.selectedRole" style='width:300px' disabled='disabled'></el-input>
              <i class="el-icon-menu" @click='selectedOneOrg(index)'></i>
              <i class="el-icon-delete" @click='dataRole.splice(index,1)'></i>
            </div>
          </el-form-item> -->

        </el-form>

        <div class="btn-group">
          <el-button  @click="reset">重 置</el-button>
          <el-button type="primary" @click="submitPermission">保 存</el-button>
        </div>
      </div>
    </i-layout>

    <i-dialog title="选择用户" v-model="visible.user" :toolbar="toolbar">
      <i-form @reset="acountList.loginId=''" @search="acountSearch">
        <el-form-item label="登录ID">
          <el-input v-model="acountList.loginId" maxlength="100"></el-input>
        </el-form-item>
      </i-form>

      <div>
        <i-table :table="acount" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table :data="tableScope.clone" border tooltip-effect="dark" highlight-current-row @row-click="rowClick">
              <el-table-column v-for="(item, idx) in acount.columns" :key="idx" :prop="item.prop" :label="item.label" :width="item.width"
                :formatter="tableScope.formatter" />
            </el-table>
          </template>
        </i-table>
      </div>
    </i-dialog>
  </section>
</template>

<script>
import req from 'api/system/employee-permission'
import reqRole from 'api/system/role-management'
import ISelect from 'components/common/i-select/i-select'
import ITable from 'components/common/i-table'
import IForm from 'components/common/i-form/i-form'
import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
import ITree from 'components/common/i-tree/i-tree.vue'
import OrgTree from 'components/org/public/org-tree'
import ILayout from 'components/common/i-layout'
import IDialog from 'components/common/i-dialog/i-dialog'
export default {
  components: {
    ISelect,
    ITable,
    IForm,
    ISelectTree,
    ITree,
    OrgTree,
    ILayout,
    IDialog
  },
  data () {
    return {
      roleIds: [],
      toolbar: [{
        text: '取消',
        type: 'default',
        func: (done) => {
          done()
        }
      }, {
        text: '确定',
        type: 'primary',
        func: (done) => {
          this.selectedOneUser()
          done()
        }
      }],

      listParams: {
        userName: '',
        userId: '',
        userRoleList: [],
        email: '',
        phone: ''
      },
      roleList: null,
      acount: {
        columns: [
          { prop: 'loginId', label: '登录ID', width: 100 },
          { prop: 'userName', label: '用户名', width: 100 },
          { prop: 'email', label: '邮箱', width: 150 },
          { prop: 'phone', label: '电话号码', width: 120 },
          { prop: 'isEnabled', label: '状态' }
        ],
        data: null,
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },
      selectedUser: '',

      acountList: {
        loginId: ''
      },
      visible: {
        user: false
      }
    }
  },
  methods: {
    handleSizeChange (options) {
      this.getUserList(options)
    },

    handleCurrentChange (options) {
      this.getUserList(options)
    },
    changeValue (idx, $event) {
      this.roleIds.splice(idx, 1, $event)
    },

    visibleSelect ($event) {
      this.roleList && this.roleList.map(key => {
        Array.indexOf(this.roleIds, key.roleId) !== -1 ? this.$set(key, 'disabled', true) : this.$set(key, 'disabled', false)
      })
    },
    rowClick (row, event, column) {
      this.selectedUser = row
    },

    reset () {
      Object.keys(this.listParams).map(key => { key === 'userRoleList' ? this.listParams[key] = [] : this.listParams[key] = '' })
      this.roleIds = []
    },

    selectedOneUser () {
      Object.keys(this.listParams).map(key => { this.listParams[key] = this.selectedUser[key] })
      this.listParams.userRoleList = []
    },

    getRoleList (listParams) {
      reqRole('getRoleList', listParams).then(res => { this.roleList = res.data })
    },

    plusRole () {
      this.listParams.userRoleList.push({ roleId: '' })
    },

    chooseUser () {
      this.getUserList()
      this.visible.user = true
    },

    getUserList (userId) {
      req('getUserList', userId)
      .then(res => {
        Object.keys(res).map(key => (this.acount[key] = res[key]))
      })
    },

    acountSearch () {
      this.acount.search = { ...this.acountList }
    },

    fill (userId) {
      req('getRole', {userId})
      .then(data => {
        Object.assign(this.listParams, data)
        data.userRoleList.map(key => {
          this.roleIds.push(key.roleId)
        })
      })
    },
    submitPermission () {
      this.listParams.userRoleList = this.listParams.userRoleList.filter(key => {
        return key.roleId !== ''
      })
      req('putUpdateUserRole', this.listParams)
      .then(res => {
        this.$route.params.userId === '-1' ? this.$message('新增成功') : this.$message('更新成功')
        this.$router.back(-1)
      })
    }
  },
  computed: {
    userRoleList () {
      return this.listParams.userRoleList
    }
  },
  watch: {
    roleIds (newVal, oldVal) {
      this.roleList.map(key => {
        Array.indexOf(newVal, key.roleId) !== -1 ? this.$set(key, 'disabled', true) : this.$set(key, 'disabled', false)
      })
    }
  },
  created () {
    this.getRoleList()
    this.$route.params.userId !== '-1' && this.fill(this.$route.params.userId)
  }
}
</script>

<style lang="scss" scoped>
  .permission {
    .form {
      width: 600px;
      margin: 100px auto 50px;
      .content {
        display: flex;
        justify-content: space-between;
        .input {
          flex-basis: 85%;
        }
        .icon {
          flex-basis: 15%;
          line-height: 36px;
          text-align: right;
        }
      }
    }
    .btn-group {
      text-align: center;
    }
  }
</style>
