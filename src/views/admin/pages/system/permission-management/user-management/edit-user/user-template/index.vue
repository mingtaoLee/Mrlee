<template>
  <div class="wrap p20 mUsertemplate">
    <!-- 配置表单 -->
    <el-form :model="model" :rules="rules" ref='form' class="myForm">
      <el-form-item label="账号" :label-width="formLabelWidth" prop="form.loginId" >
        <el-input v-model="model.form.loginId" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="用户名称" :label-width="formLabelWidth" prop="form.userName">
        <el-input v-model="model.form.userName" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" prop="form.pwd" v-if="model.pwdIsShow">
        <el-input v-model="model.form.pwd" type="password" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label='电话号码' :label-width="formLabelWidth" prop="form.phone">
        <el-input v-model="model.form.phone"></el-input>
      </el-form-item>
      <el-form-item label='邮箱' :label-width="formLabelWidth" prop="form.email" class="box">
        <el-input v-model="model.form.email"></el-input>
        <el-card class="box-card" v-if="isShowEmailList">
          <div v-for="(item,id) in showList" :key="id" @click="chooseName(item)">
            <p class="text txt">{{item}}</p>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label='角色' :label-width="formLabelWidth" prop="form.role">
        <el-button size="mini" @click="roleChoose">选择</el-button>
        <span class="chooseCounts">已经选择：{{model.form.roleList.length}}/{{roleList.length}}</span>
      </el-form-item>
      <el-form-item label='户头' :label-width="formLabelWidth" prop="form.role">
        <el-checkbox 
          class="chooseAll"
          v-model="model.form.accountHasAll"
          label="全选"
          border
          size="mini"
          @change="accountHasAllChange"
        >
        </el-checkbox>
        <el-button size="mini" @click="accountChoose" :disabled="model.form.accountHasAll">选择</el-button>
        <span class="chooseCounts">已经选择：{{model.form.account.length}}/{{accountList.length}}</span>
      </el-form-item>
      <el-form-item label='薪资组权限' :label-width="formLabelWidth" prop="salarySelectList">
        <el-checkbox 
          class="chooseAll"
          v-model="model.form.payGroupHasAll"
          label="全选"
          border
          size="mini"
          @change="payGroupHasAllChange"
        >
        </el-checkbox>
        <el-button size="mini" @click="salaryChoose" :disabled="model.form.payGroupHasAll">选择</el-button>
        <span class="chooseCounts">已经选择：{{model.form.payGroup.length}}/{{salaryList.length}}</span>
      </el-form-item>
      <el-form-item label='人事范围权限' :label-width="formLabelWidth" prop="form.personnel">
        <el-checkbox 
          class="chooseAll"
          v-model="model.form.personnelHasAll"
          label="全选"
          border
          size="mini"
          @change="personnelHasAllChange"
        >
        </el-checkbox>
        <el-button size="mini" @click="personnelChoose" :disabled="model.form.personnelHasAll">选择</el-button>
        <span class="chooseCounts">已经选择：{{model.form.personnelGroup.length}}/{{personnelList.length}}</span>
      </el-form-item>
      <!-- 组织权限start -->
      <!-- <new-template-1 ref="newTemplate1" :model.sync="model.orgsObj" :unitHasAllForm="model.form" :ifMotify="isMotify"></new-template-1> -->
      <new-template-1 :model="model.orgsObj" :unitHasAllForm="model.form"></new-template-1>
      <!-- 组织权限over -->
      <el-form-item label='允许本机登录' :label-width="formLabelWidth">
        <i-select v-model="model.form.canLocalLogin" parameter="WHETHER_TYPE"></i-select>
      </el-form-item>
    </el-form>

    <!-- 户头选择模态框 -->
    <el-dialog title="户头选择" :visible.sync="accountDialogVisible" center class="accoutDialog">
      <el-transfer
        filterable
        v-model="model.accountResourceIdList"
        :filter-placeholder="searchPlace"
        :filter-method="accountFilterMethod"
        :titles="titleList"
        :data="accountList"
        :props="{
          key: 'accountCode',
          label: 'accountName'
        }"
      >
      </el-transfer>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleGoBack">返 回</el-button>
        <el-button type="primary" @click="accountSelect">提 交</el-button>
      </div>
    </el-dialog>

    <!-- 角色选择模态框 -->
    <el-dialog title="角色选择" :visible.sync="userDialogVisible" center class="roleDialog">
      <el-transfer
        filterable
        v-model="model.roleSelectRoleIdList"
        :filter-placeholder="searchPlace"
        :filter-method="roleFilterMethod"
        :titles="titleList"
        :data="roleList"
        :props="{
          key: 'roleId',
          label: 'roleName'
        }"
      >
      </el-transfer>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleGoBack">返 回</el-button>
        <el-button type="primary" @click="roleSelect">提 交</el-button>
      </div>
    </el-dialog>

    <!-- 薪资模态框 -->
    <el-dialog title="薪资组权限" :visible.sync="salaryDialogVisible" center > 
      <el-transfer
        filterable
        v-model="model.salaryResourceIdtList"
        :filter-placeholder="searchPlace"
        :filter-method="salaryFilterMethod"
        :titles="titleList"
        :data="salaryList"
        :props="{
          key: 'groupId',
          label: 'groupName'
        }"
      >
      </el-transfer>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleGoBack">返 回</el-button>
        <el-button type="primary" @click="salarySelect">提 交</el-button>
      </div>
    </el-dialog>

    <!-- 人事范围权限模态框 -->
    <el-dialog title="人事范围权限" :visible.sync="personnelDialogVisible" center >
      <el-transfer
        filterable
        v-model="model.personnelResourceIdList"
        :filter-placeholder="searchPlace"
        :filter-method="personnelFilterMethod"
        :titles="titleList"
        :data="personnelList"
        :props="{
          key: 'personnelGroupCode',
          label: 'personnelGroupName'
        }"
      >
      </el-transfer>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleGoBack">返 回</el-button>
        <el-button type="primary" @click="personnelSelect">提 交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
/**
 * @prop {Object} model 传进来的数据
 * @prop {Boolean} ifMotify 确认是否为修改操作
 */
// import reqTp from 'api/compile/template'
import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
import ISelect from 'components/common/i-select/i-select.vue'
import req from 'api/system/role-management'
import reqSalary from 'api/compensation'
import reqs from 'api/system/user-managerment'
import NewTemplate1 from './orgTemplate'
import ILayout from 'components/common/i-layout'
export default {
  name: 'UserTemplate',

  components: {
    ISelectTree,
    ISelect,
    NewTemplate1,
    ILayout
  },

  props: {
    model: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  data () {
    /* eslint-disable */
    function getQueryString(name)  {
      // "actionType=0&idNumber=-1&empEmployeeId=-1"
      var arr = (location.hash || "").replace(/^\#/,'').split("?")[1]
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)")
      var r = arr.match(reg)
      if(r!=null) {
        return  unescape(r[2])
      }
      return null
    }
    let checkEmail = (rule, value, cb) => {
      let myreg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      !value && cb()
      value && setTimeout(function() {
        !myreg.test(value) ? cb(new Error("请输入正确的邮件格式")) : cb();
      }, 100);
    }
    let checkPhone = (rule, value, cb) => {
      // let phoneTest = /^1[34578]\d{9}$/
      let phoneTest = /^(0|\+?[1-9][0-9]*)$/
      !value && cb(new Error('电话号码不能为空'))
      setTimeout(function () {
        !phoneTest.test(value) ? cb(new Error('请输入正确的电话号码格式')) : cb()
      }, 0)
    }
    let checkLoginId = (rule, value, cb) => {
      let zmnumReg = /^[0-9a-zA-Z]*$/;
      !value && cb(new Error("账号不能为空"));
      setTimeout(function() {
        !zmnumReg.test(value) &&  value != "" ? cb(new Error("请输入正确的账号格式")) : cb();
      }, 0);
    }
    return {
      // 表单的验证规则
      rules: {
        form: {
          loginId: [
            { required: true, validator: checkLoginId, trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '请输入用户名称', trigger: 'blur' }
          ],
          pwd: [
            { required: true, message: '请填写密码', trigger: 'blur' }
          ],
          phone: [
            { required: true, validator: checkPhone, trigger: 'blur' }
          ],
          email: [
            { validator: checkEmail, trigger: "change" }
          ]
        }
      },
      // 户头选择模态框
      accountDialogVisible: false,
      // 角色选择模态框
      userDialogVisible: false,
      // 薪酬选择模态框
      salaryDialogVisible: false,
      // 人事选择模态框
      personnelDialogVisible: false,
      // 表单宽度
      formLabelWidth: '120px',
      // Transfer 穿梭框列表标题文字
      titleList: ['待选列表', '已选列表'],
      // Transfer 穿梭框搜索框提示文字
      searchPlace: '请填写关键字',
      // 户头穿梭框渲染列表数据
      accountList: [],
      // 角色穿梭框渲染列表数据
      roleList: [],
      // 薪资穿梭框渲染列表数据
      salaryList: [],
      // 人事穿梭框渲染列表数据
      personnelList: [],
      // 户头选择Transfer 穿梭框自定义搜索方法
      accountFilterMethod (query, item) {
        return item.accountName.indexOf(query) > -1;
      },
      // 角色选择Transfer 穿梭框自定义搜索方法
      roleFilterMethod (query, item) {
        return item.roleName.indexOf(query) > -1;
      },
      // 薪资选择Transfer 穿梭框自定义搜索方法
      salaryFilterMethod (query, item) {
        return item.groupName.indexOf(query) > -1;
      },
      // 人事选择Transfer 穿梭框自定义搜索方法
      personnelFilterMethod (query, item) {
        return item.personnelGroupName.indexOf(query) > -1;
      },
      // 邮箱列表是否显示
      isShowEmailList: false,
      // 选择的邮箱后缀
      lastName: true,
      // 显示的列表
      showList: [],
      startTim: false,
      a: '',
      // 邮箱列表后缀
      emailsorce: ["@sina.com", "@163.com", "@qq.com", "@126.com", "@vip.sina.com","@sina.cn", "@hotmail.com", "@gmail.com", "@sohu.com", "@yahoo.cn", "@139.com","@wo.com.cn", "@189.cn"]
    }
  },

  watch: {
    // 邮箱后缀自动显示
    'model.form.email': {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal && this.lastName && this.startTim) {
          // 选择符合条件的显示
          // 有@匹配符合的
          if (newVal.indexOf('@') != -1) {
            // 截取@后面的内容和邮箱列表的进行对比
            this.a = newVal.slice(newVal.indexOf('@'))
            this.showList = []
            this.emailsorce.forEach(item => {
              if (item.includes(this.a)) {
                // this.showList.push(item)
                this.$set(this.showList, this.showList.length, item)
              }
            })
          } else {
            // 没有@显示全部
            this.showList = this.emailsorce
          }
          // 如果输完了就隐藏列表或者没有匹配的也隐藏                
          if (this.a.includes('.com') || this.showList.length === 0 || newVal.length === 0) {
            this.isShowEmailList = false
          } else {
            this.isShowEmailList = true
          }
          // this.isShowEmailList = true
        } else {
          this.isShowEmailList = false
          this.lastName = true
          this.startTim = true
        }
      }
    }
  },

  methods: {
    // 户头，薪资，角色，人事弹出框中取消按钮均调用此方法关闭
    roleGoBack () {
      this.accountDialogVisible = false
      this.userDialogVisible = false
      this.salaryDialogVisible = false
      this.personnelDialogVisible = false
    },
    // 户头返回
    // roleGoBackAccount () {
    //   this.accountDialogVisible = false
    //   this.model.accountResourceIdList = 
    // },
    // 弹出户头选择模态框
    accountChoose () {
      // this.getAccountLit()
      this.accountDialogVisible = true
    },
    // 获取户头穿梭框渲染列表数据
    getAccountLit () {
      req('getAccountLit')
      .then(res => {
        this.accountList = res
      })
    },
    // 全选户头清空已选数据
    accountHasAllChange (val) {
      val && (this.model.accountResourceIdList = [])
      val && (this.model.form.account = [])
    },
    // 提交户头选择
    accountSelect () {
      // 清空防止重复
      this.model.form.account = []
      this.accountList.map(val => {
        this.model.accountResourceIdList.map(val2 => {
          val.accountCode === val2 && this.model.form.account.push({resourceId: val2})
        })
      })
      this.accountDialogVisible = false
    },
    // 弹出角色选择模态框
    roleChoose () {
      // this.getRoleList()
      this.userDialogVisible = true
    },
    // 获取角色列表
    getRoleList () {
      req('getRoleAll')
      .then(res => {
        this.roleList = res
      })
    },
    // 提交角色选择
    roleSelect () {
      this.model.form.roleList = []
      this.roleList.map(val => {
        this.model.roleSelectRoleIdList.map(val2 => {
          val.roleId === val2 && this.model.form.roleList.push({roleId: val2})
        })
      })
      this.userDialogVisible = false
    },
    // 弹出薪资选择模态框
    salaryChoose () {   
      // this.getSalaryList()      
      this.salaryDialogVisible = true
    },
    // 获取薪资列表
    getSalaryList () {
      reqs('getGroups')
      .then(res => {
        // this.salaryList = res
        this.salaryList = res
      })
    },
    // 全选清空已选数据
    payGroupHasAllChange (val) {
      val && (this.model.salaryResourceIdtList = [])
      val && (this.model.form.payGroup = [])
    },
    // 薪资提交
    salarySelect () {
      // 清空防止重复
      this.model.form.payGroup = []
      this.salaryList.map(val => {
        this.model.salaryResourceIdtList.map(val2 => {
          val.groupId === val2 && this.model.form.payGroup.push({resourceId: val2})
        })
      })
      this.salaryDialogVisible = false
    },
    // 弹出人事选择模态框
    personnelChoose () {
      // this.getPersonnelList()
      this.personnelDialogVisible = true
    },
    // 获取人事列表
    getPersonnelList () {
      reqSalary('getPersonnelGroups')
      .then(res => {
        this.personnelList = res
      })
    },
    // 全选清空已选数据
    personnelHasAllChange (val) {
      val && (this.model.personnelResourceIdList = [])
      val && (this.model.form.personnelGroup = [])
    },
    // 人事提交
    personnelSelect () {
      // 清空防止重复
      this.model.form.personnelGroup = []
      this.personnelList.map(val => {
        this.model.personnelResourceIdList.map(val2 => {
          val.personnelGroupCode === val2 && this.model.form.personnelGroup.push({resourceId: val2})
        })
      })
     this.personnelDialogVisible = false
    },
     //选择邮箱后缀，拼接
    chooseName (name) {
      if (this.model.form.email.indexOf('@') !== -1) {
        // 如果有@把后面的内容代替为选择的
          this.model.form.email = this.model.form.email.substring(0, this.model.form.email.indexOf('@'))
          this.model.form.email += name
      } else {
        this.model.form.email += name
      }
      this.isShowEmailList = false
      this.showList = []
      this.lastName = false
    }
  },
  
  created () {
    this.getAccountLit()
    this.getRoleList()
    this.getSalaryList()
    this.getPersonnelList()
  }
}
</script>

<style lang="scss">
.mUsertemplate {
  .myForm {
    width: 50%;
    .el-form-item {
      margin-bottom: 22px;
      .chooseAll {
        vertical-align: middle;
        margin-top: -1px;
        line-height: 20px;
        margin-right: 5px;
      }
      .chooseCounts {
        color: #8d8d8d;
        font-size: 13px;
        margin-left: 5px;
      }
    }
  }
  .el-transfer {
    display: flex;
    justify-content: center;
    .el-transfer__buttons {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
  .box {
    position: relative;
    &:hover {
      .box-card {
        display: block;
      }
    }
  }
  .box-card {
    display:none;
    position: absolute;
    top: 37px;
    width: 60%;
    z-index: 999;
    max-height: 274px;
    overflow: scroll;
    div {
      width: 100%;
      cursor: pointer;
      .text:hover {
        background-color: #e4e8f1
      }
    }
    .text {
    font-size: 14px;
    }
    .txt {
      width:80%;
      height: 30px;
      line-height: 30px;
      margin: 0px,20px,20px;
      padding-left: 20px;
    }
  }
}
</style>