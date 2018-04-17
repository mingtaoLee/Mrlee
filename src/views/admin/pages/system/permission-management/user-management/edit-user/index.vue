<template>
  <i-layout>
    <div class="edit-user" slot="section">
        <user-template ref="userTemplate" :model="model"></user-template>
        <!-- 底部按钮 -->
        <el-row>
          <el-col :span="12"></el-col>
          <el-col :span="12">
            <div>
              <el-button @click="goBack">返 回</el-button>
              <el-button type="primary" @click="submitUserData('form')">提 交</el-button>
            </div>
          </el-col>
        </el-row>
    </div>
  </i-layout>
</template>

<script>
// import reqRole from 'api/system/role-management'
import req from 'api/system/user-managerment'
// import reqSalary from 'api/compensation'
import UserTemplate from './user-template'
import ISelect from 'components/common/i-select/i-select'
import ITable from 'components/common/i-table'
import IForm from 'components/common/i-form/i-form'
import ITableOperator from 'components/common/i-table-operator'
import ILayout from 'components/common/i-layout'
export default {
  components: {
    ISelect,
    ITable,
    IForm,
    ITableOperator,
    ILayout,
    UserTemplate
  },
  data () {
    return {
      // 绑定的数据
      model: {
        // 组织权限
        orgsObj: {
          orgs: '',
          orgNodes: []
          // orgSelectChild: false
        },
        form: {
          // 记录账号
          loginId: '',
          // 记录用户名
          userName: '',
          // 记录电话
          phone: '',
          // 记录是否允许本机登录
          canLocalLogin: '',
          // isEnabled: '',
          // 记录邮箱
          email: '',
          // 记录密码，修改用户时不会使用，新增用户时不会使用
          pwd: '',
          // 记录户头是否选择全选
          accountHasAll: false,
          // 记录选择的户头列表
          account: [],
          // 记录选择的角色列表
          roleList: [],
          // 记录薪资是否全选
          payGroupHasAll: false,
          // 记录选择薪资列表
          payGroup: [],
          // 记录人事是否全选
          personnelHasAll: false,
          // 记录选择的人事列表
          personnelGroup: [],
          // 记录组织列表是否全选
          unitHasAll: false,
          // 记录选择的组织列表
          orgUnit: []
        },
        // 已选户头数据resourceId数组
        accountResourceIdList: [],
        // 已选角色的数据roleId数组
        roleSelectRoleIdList: [],
        // 已选薪资数据resourceId数组
        salaryResourceIdtList: [],
        // 已选人事数据resourceId数组
        personnelResourceIdList: [],
        // 编辑时pwd框不显示，新增时密码框显示
        pwdIsShow: false,
        // 记录当前是编辑还是新增用户状态
        nowType: null
      }
    }
  },
  methods: {
    // 提交编辑的数据
    submitUserData (formName) {
      // 处理组织权限选择的数据
      // 滞空防止重复
      this.model.form.orgUnit = []
      this.model.orgsObj.orgs !== '' && this.model.orgsObj.orgs.split(',').map(val => {
        this.model.form.orgUnit.push({resourceId: val})
      })
      // console.log(this.model.form.orgUnit)
      // orgUnitId
      // if (this.model.orgsObj.orgs !== '' && this.model.orgsObj.orgNodes.length) {
      //   this.model.orgsObj.orgs.split(',').map(val => {
      //     this.model.orgsObj.orgNodes.map(val2 => {
      //       val === val2.orgUnitId && this.model.form.orgUnit.push({resourceId: val})
      //     })
      //   })
      // }
      // 把true和false全部换成Y和N
      this.model.form.accountHasAll = this.model.form.accountHasAll ? 'Y' : 'N'
      this.model.form.payGroupHasAll = this.model.form.payGroupHasAll ? 'Y' : 'N'
      this.model.form.personnelHasAll = this.model.form.personnelHasAll ? 'Y' : 'N'
      this.model.form.unitHasAll = this.model.form.unitHasAll ? 'Y' : 'N'
      this.$refs.userTemplate.$refs[formName].validate(valid => {
        if (valid) {
          if (this.nowType === 'doCreated') {
            // 新增时提交数据
            req('createUser', this.model.form)
            .then(res => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.$router.push('user_management')
            })
          } else if (this.nowType === 'doEditor') {
            // 修改时候提交数据
            delete this.model.form.pwd
            req('updateUser', this.model.form)
            .then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$router.push({path: 'user_management', query: { info: this.$route.query.info }})
            })
          }
        } else {
          this.$message.error('请先按要求输入')
          return false
        }
      })
    },
    // 返回
    goBack () {
      // 先把内容全部置空
      Object.keys(this.model.form).map(item => {
        this.model.form[item] = ''
      })
      this.$router.push({path: 'user_management', query: { info: this.$route.query.info }})
    },
    // 获取用户数据
    getUserData (row) {
      req('findUserAndGrant', {loginId: row.loginId})
      .then(res => {
        Object.keys(res).map(item => {
          this.model.form[item] = res[item]
        })
        // 给全选按钮赋值
        this.model.form.accountHasAll = this.model.form.accountHasAll === 'Y' ? !false : !true
        this.model.form.payGroupHasAll = this.model.form.payGroupHasAll === 'Y' ? !false : !true
        this.model.form.personnelHasAll = this.model.form.personnelHasAll === 'Y' ? !false : !true
        this.model.form.unitHasAll = this.model.form.unitHasAll === 'Y' ? !false : !true
        // // 第一次这些数据等于null会报错，初始化处理
        !this.model.form.account && (this.model.form.account = [])
        !this.model.form.roleList && (this.model.form.roleList = [])
        !this.model.form.payGroup && (this.model.form.payGroup = [])
        !this.model.form.personnelGroup && (this.model.form.personnelGroup = [])
        // 已选户头数据resourceId数组
        res.account.length && res.account.map(val => {
          this.model.accountResourceIdList.push(val.resourceId)
        })
        // 已选角色的数据roleId数组
        res.roleList.length && res.roleList.map(val => {
          this.model.roleSelectRoleIdList.push(val.roleId)
        })
        // 已选薪资数据resourceId数组
        res.payGroup.length && res.payGroup.map(val => {
          this.model.salaryResourceIdtList.push(val.resourceId)
        })
        // 已选人事数据resourceId数组
        res.personnelGroup.length && res.personnelGroup.map(val => {
          this.model.personnelResourceIdList.push(val.resourceId)
        })
        // 组织权限
        let orgsId = []
        res.orgUnit.forEach(val => {
          orgsId.push(val.resourceId)
          // let obj = {
          //   orgShortName: val.resourceName,
          //   orgUnitId: val.resourceId,
          //   orgUnitName: val.resourceName
          // }
          // this.model.orgsObj.orgNodes.push(obj)
        })
        this.model.orgsObj.orgs = orgsId.join(',')
        // console.log(this.model.orgsObj)
      })
    }
  },
  created () {
    // 当跳转至编辑页面时才需要渲染用户的相关数据
    if (this.$route.query.type === 'doEditor') {
      this.model.pwdIsShow = false
      this.nowType = 'doEditor'
      if (this.$route.query.row.loginId) {
        localStorage.setItem('row', JSON.stringify(this.$route.query.row))
        this.getUserData(this.$route.query.row)
      } else {
        this.getUserData(JSON.parse(localStorage.getItem('row')))
      }
    } else if (this.$route.query.type === 'doCreated') {
      this.model.pwdIsShow = true
      this.nowType = 'doCreated'
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form-item {
    margin-bottom: 22px;
  }
  .el-col-12 {
    float: right;
  }
  .roleDialog {
    text-align: center;
  }
</style>