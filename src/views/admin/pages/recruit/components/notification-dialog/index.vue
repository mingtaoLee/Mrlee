<template>
  <i-dialog
    size="standard"
    v-model="showMe"
    :title="myTitle"
    :toolbar="toolbar"
    :destroyedWhenClose="true"
    @close="handleClose">

    <i-layout>
      <el-form
        ref="notificationForm"
        slot="header"
        :model="notificationModel"
        :rules="notificationRules"
        label-width="120px"
        label-position="right"
        class="notification__el-form">
        <el-form-item
          v-if="notificationType === '3'"
          label="入职时间"
          prop="entryDate"
          required>
          <el-date-picker
            v-model="notificationModel.entryDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            placeholder="选择入职时间"
            :picker-options="entryDatePickerOpts">
          </el-date-picker>
        </el-form-item>
        <template v-if="notificationType === '1'">
          <el-form-item
            label="招聘需求"
            prop="requirementId">
            <el-select
              clearable
              placeholder="请选择招聘需求"
              v-model="requirementName"
              @change="handleRequirementChange">
              <el-option
                v-for="item in recruitRequirements"
                :key="item.requirementId"
                :label="item.name"
                :value="item.requirementId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="面试部门"
            prop="applyOrgId">
            <!-- <i-select-tree
              dataKey="org"
              nodeKey="orgUnitId"
              :lazy="true"
              :selectedNode.sync = "notificationModel.applyOrgNode"
              v-model="notificationModel.applyOrgId"
              placeholder="请选择面试部门">
            </i-select-tree> -->
            <i-select-tree
              v-model="notificationModel.applyOrgId"
              dataKey="org"
              nodeKey="orgUnitId"
              :lazy="true"
              :selectedNode.sync="selectedOrgNode"
              @delete="deleteOrgUnitId"
              @node-click='nodeClick'
              :props="orgprops"
            />
          </el-form-item>
          <el-form-item
            v-if="notificationType === '1'"
            label="面试职位"
            prop="applyPositionId">
            <!-- <el-input
              placeholder="请选择面试职位"
              :readonly="true"
              :value="applyPositionName"
              :class="{'input__can-click': !this.positionSelectedFlag}"
              @click.native="selectPosition">
              <i
                v-if="!applyPositionName"
                slot="suffix"
                class="el-input__icon el-icon-menu">
              </i>
              <i
                v-else
                slot="suffix"
                class="el-input__icon el-icon-close"
                @click.stop="clearSelectedPosition">
              </i>
            </el-input> -->
            <el-select v-model="notificationModel.applyPositionId" clearable>
              <el-option
                v-for="(item, idx) in notificationModel.posList"
                :key="idx"
                :label="item.name"
                :value="item.posPositionId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="面试地点"
            prop="workAddress"
            required>
            <el-input
              placeholder="请输入面试地点"
              v-model="notificationModel.workAddress">
            </el-input>
          </el-form-item>
        </template>
        <!-- FIXME: 应为多选思密达 -->
        <el-form-item
          v-if="notificationType !== '3'"
          label="面试官"
          prop="interviewer"
          required>
          <el-input
            placeholder="面试官最多选择3个"
            :readonly="true"
            :value="interviewerName"
            @click.native="selectInterviewer">
            <i slot="suffix"
              class="el-input__icon el-icon-menu"
              @click.stop="selectInterviewer">
            </i>
          </el-input>
        </el-form-item>
        <!-- FIXME: 应为多选思密达 -->
        <template v-else>
          <el-form-item
            label="通知抄送人"
            prop="copyToManId"
            required>
            <el-input
              :readonly="true"
              :value="copyToMan"
              @click.native="selectCopyToMan">
              <i slot="suffix"
                class="el-input__icon el-icon-menu"
                @click.stop="selectCopyToMan">
              </i>
            </el-input>
          </el-form-item>
          <el-form-item
            label="抄送人电话号码"
            prop="copyToManMobile"
            required>
            <el-input
              v-model="notificationModel.copyToManMobile"
              placeholder="请填写抄送人电话号码">
            </el-input>
          </el-form-item>
          <el-form-item
            label="抄送人邮箱"
            prop="copyToManEmail"
            required>
            <el-input
              v-model="notificationModel.copyToManEmail"
              placeholder="请填写抄送人邮箱"
            >
            </el-input>
             <el-card class="box-card" v-if="isShowCtpEmailList" >
                <div v-for="(item,id) in showCtpList" :key="id" @click="chooseNameQ(item)" >
                  <p class="text txt">{{item}}</p>
                </div>
              </el-card>
          </el-form-item>
        </template>
        <el-form-item
          v-if="notificationType !== '3'"
          label="面试时间"
          prop="interviewDate"
          required>
          <el-date-picker
            v-model="notificationModel.interviewDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            :picker-options="interviewDatePickerOpts"
            placeholder="选择面试时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="通知模板"
          prop="templateId">
          <el-select
            v-model="notificationModel.templateId"
            placeholder="请选择通知模板"
            @change="handleTemplateChange">
            <el-option
              v-for="item in templateIdOpts"
              :key="item.templateId"
              :label="item.name"
              :value="item.templateId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="notificationType !== '3'"
          label="面试评估模板"
          prop="evalTemplateId">
          <el-select
            v-model="notificationModel.evalTemplateId"
            placeholder="请选择面试评估模板"> 
            <el-option
              v-for="item in evaluateTemplateIdOpts"
              :key="item.evaluationTemplateId"
              :label="item.name"
              :value="item.evaluationTemplateId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="通知方式"
          prop="way"
          required>
          <el-checkbox
            v-model="msgChecked"
            @change="msgCheckedChange">
            短信
          </el-checkbox>
          <el-checkbox
            v-model="mailChecked"
            @change="mailCheckedChange">
            邮件
          </el-checkbox>
        </el-form-item>
        <el-form-item
          v-show="msgChecked"
          label="电话号码"
          prop="mobile"
          :rules="msgChecked === false ? {} : mobileRules"
          required>
          <el-input
            v-model="notificationModel.mobile"
            placeholder="请输入电话号码">
          </el-input>
        </el-form-item>
        <!-- <el-form-item
          v-show="msgChecked"
          prop="msgEditor"
          :rules="msgChecked === false ? {} : msgEditorRules"
          label="短信内容">
          <notification-editor
            editorId="msgEditor"
            ref="msgEditor">
          </notification-editor>
        </el-form-item> -->
        <el-form-item
          v-show="msgChecked"
          prop="noteContent"
          label="短信内容"
          :rules="msgChecked === false ? {} : noteContentRules"
          required>
          <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8}"
          placeholder="请输入短信内容"
          v-model="noteContent"
          ref="noteContent">
        </el-input>
        </el-form-item>
        <el-form-item
          v-show="mailChecked"
          label="邮箱"
          prop="email"
          :rules="mailChecked === false ? {} : emailRules"
          required>
          <el-input
            v-model="notificationModel.email"
            placeholder="请输入邮箱">
          </el-input>
          <el-card class="box-card" v-if="isShowEmailList" >
              <div v-for="(item,id) in showList" :key="id" @click="chooseName(item)" >
                <p class="text txt">{{item}}</p>
              </div>
          </el-card>
        </el-form-item>
        <el-form-item
          v-show="mailChecked"
          label="标题"
          prop="title"
          :rules="mailChecked === false ? {} : titleRules"
          required>
          <el-input
            placeholder="请输入标题"
            v-model="notificationModel.title">
          </el-input>
        </el-form-item>
        <!-- <el-form-item
          v-show="mailChecked"
          prop="mailEditor"
          :rules="mailChecked === false ? {} : mailEditorRules"
          label="邮件内容">
          <notification-editor
            editorId="mailEditor"
            ref="mailEditor">
          </notification-editor>
        </el-form-item> -->
        <el-form-item
          v-show="mailChecked"
          prop="mailContent"
          label="邮件内容"
          :rules="mailChecked === false ? {} : mailContentRules"
          required>
          <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8}"
          placeholder="请输入邮件内容"
          v-model="mailContent"
          ref="mailContent">
        </el-input>
        </el-form-item>
      </el-form>
    </i-layout>

    <!-- 人员选择 -->
    <i-personnel-select
      :isShow.sync="selectDialogFlag"
      :multiple="notificationType !== '3'"
      :autoClose="false"
      :limit="3"
      @confirm="selectPersonConfirm"
    >
    </i-personnel-select>

  </i-dialog>
</template>

<script>
import req from 'api/recruit'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
// import NotificationEditor from './editor'
import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
import PositionSelection from 'components/position/position-selection'
import { clone } from 'utils'

export default {
  name: 'NotificationDialog',

  components: {
    IDialog,
    IPersonnelSelect,
    // NotificationEditor,
    ISelectTree,
    PositionSelection
  },

  props: {
    // 通知类型: 1、邀约通知，2、复试通知，3、录用通知
    notificationType: {
      type: String,
      default: '1'
    },
    // 显示本组件标志位
    showMe: {
      type: Boolean,
      default: false,
      required: true
    },
    // 接收通知人对象
    notifyWho: {
      type: Object,
      required: true
    }
  },

  data () {
    // 面试官校验
    const interviewerValidator = (rule, val, cb) => {
      if (!this.interviewer.length) {
        cb(new Error('请选择面试官'))
      } else {
        cb()
      }
    }

    // 通知抄送人校验
    const copyToMansValidator = (rule, val, cb) => {
      if (!val) {
        cb(new Error('请选择通知抄送人'))
      } else {
        cb()
      }
    }

    // 通知方式校验
    const wayValidator = (rule, val, cb) => {
      if (!this.msgChecked && !this.mailChecked) {
        cb(new Error('请至少选择一种通知方式'))
      } else {
        cb()
      }
    }

    // 电话号码校验
    const mobileValidator = (rule, val, cb) => {
      let phoneTest = /^1[34578]\d{9}$/
      // 电话号码
      let num = /^0\d{2,3}-?\d{7,8}$/

      !val && cb(new Error('电话号码不能为空'))
      setTimeout(function () {
        !(phoneTest.test(val) || num.test(val)) ? cb(new Error('请输入正确的电话号码格式')) : cb()
      }, 0)
    }

    // 面试时间校验
    const interviewDateValidator = (rule, val, cb) => {
      if (!val) {
        cb(new Error('请选择面试时间'))
      } else {
        cb()
      }
    }

    // 入职时间校验
    const entryDateValidator = (rule, val, cb) => {
      if (!val) {
        cb(new Error('请选择入职时间'))
      } else {
        cb()
      }
    }
    const noteContentValidator = (rule, val, cb) => {
      if (!this.noteContent) {
        cb(new Error('请输入短信内容'))
      } else if (this.noteContent.length > 200) {
        cb(new Error('字符最大长度为200'))
      } else {
        cb()
      }
    }

    const mailContentValidator = (rule, val, cb) => {
      if (!this.mailContent) {
        cb(new Error('请输入邮件内容'))
      } else {
        cb()
      }
    }
    // const msgEditorValidator = (rule, val, cb) => {
    //   if (!this.$refs.msgEditor.getUEContent()) {
    //     cb(new Error('请输入短信内容'))
    //   } else if ((this.$refs.msgEditor.getUEContent()).length > 200) {
    //     cb(new Error('字符最大长度为200'))
    //   } else {
    //     cb()
    //   }
    // }
    // const mailEditorValidator = (rule, val, cb) => {
    //   if (!this.$refs.mailEditor.getUEContent()) {
    //     cb(new Error('请输入邮件内容'))
    //   } else {
    //     cb()
    //   }
    // }

    // 面试地点的校验
    const workAddressValidator = (rule, val, cb) => {
      if (!val) {
        cb(new Error('请填写面试地点'))
      } else if (val.length > 128) {
        cb(new Error('长度最大为128个字符'))
      } else {
        cb()
      }
    }

    const titleValidator = (rule, val, cb) => {
      if (!val) {
        cb(new Error('请填写标题'))
      } else if (val.length > 45) {
        cb(new Error('长度最大为45个字符'))
      } else {
        cb()
      }
    }

    let checkEmail = (rule, value, cb) => {
      let myreg = /^[a-zA-Z0-9_-]+\.*[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      let wordTest = /^[^\s]+$/
      value && setTimeout(function () {
        !wordTest.test(value) && cb(new Error('首尾不能含空格'))
        !myreg.test(value) && cb(new Error('请输入正确的邮箱格式'))
        cb()
      }, 100)
      !value && cb()
    }

    return {
      orgprops: {
        children: 'children',
        label: 'orgUnitName',
        disabled: (data, node) => {
          // console.log(data.status)
          if (data.status === '2') {
            return true
          } else {
            return false
          }
        }
      },
      selectedOrgNode: {},
      // i-dialog
      toolbar: [{
        text: '取消',
        type: 'default',
        func: (done) => {
          done()
        }
      }, {
        text: '确定',
        loading: false,
        type: 'primary',
        func: (done) => {
          this.$refs.notificationForm.validate(valid => {
            // console.log('valid: ', valid)
            if (valid) {
              this.postData(done)
            }
          })
        }
      }],
      isShowCtpEmailList: false,
      // 邮箱列表是否显示
      isShowEmailList: false,
      // 选择的邮箱后缀
      lastName: true,
      // 显示的列表
      showList: [],
      showCtpList: [],
      startTim: false,
      a: '',
      // 邮箱列表后缀
      emailsorce: ['@sina.com', '@163.com', '@qq.com', '@126.com', '@vip.sina.com', '@sina.cn', '@hotmail.com', '@gmail.com', '@sohu.com', '@yahoo.cn', '@139.com', '@wo.com.cn', '@189.cn'],
      // this
      posList: [],
      selectDialogFlag: false,          // 人员选择对话框标志位
      templateIdOpts: [],               // 选择通知模板选项数组
      evaluateTemplateIdOpts: [],       // 评估表模板选择项数组
      recruitRequirements: [],          // 选择招聘需求选项数组
      msgChecked: false,                // 勾选短信通知方式标志
      mailChecked: false,               // 勾选邮件通知方式标志
      msgEditor: null,                  // 短信通知富文本编辑器
      mailEditor: null,                 // 邮件通知富文本编辑器
      interviewerName: '',              // 选择的面试官回显字段
      // inteviewerSelectedFlag: false,    // 是否已选面试官标志位
      positionSelectedFlag: false,      // 面试职位是否已选标志
      copyToMan: '',                    // 选择的抄送人回显字段
      interviewId: '',
      // copyToManSelectedFlag: false,     // 抄送人是否已选标志位
      selectType: '',                   // 抄送人还是面试官标志
      applyPositionName: '',            // 表单面试职位回显字段
      interviewer: [],                  // 对应面试官回显的字段
      requirementName: '',              // 招聘需求对应回显字段
      templateName: '',                 // 通知模板对应回显字段
      notificationModel: {              // 表单需要填的所有字段
        title: '',                      // 标题
        // isCheck: '',                    // 是否背调
        copyToManId: '',                // 抄送人ID
        copyToManMobile: '',            // 抄送人电话
        copyToManEmail: '',             // 抄送人邮件
        interviewDate: '',              // 面试时间
        templateId: '',                 // 通知模板ID
        evalTemplateId: '',             // 评估表模板ID
        way: '',                        // 通知方式
        mobile: '',                     // 电话
        email: '',                      // 邮箱
        applyOrgId: '',                 // 面试部门
        entryDate: '',                  // 入职时间
        workAddress: '',                // 面试地点
        applyPositionId: '',            // 面试职位ID
        requirementId: '',              // 招聘需求ID
        planRecruitNum: 0,              // 计划招聘人数
        empType: ''                     // 员工类型
      },
      notificationRules: {                                                // 表单校验规则
        way: [{
          validator: wayValidator, trigger: 'change'                      // 通知方式校验
        }],
        // email: [{
        //   validator: emailValidator, trigger: 'change'                    // 邮箱字段校验
        // }],
        // mobile: [{
        //   validator: mobileValidator, trigger: 'change'                   // 电话字段校验
        // }],
        copyToManEmail: [{
          validator: checkEmail, trigger: 'change'                    // 抄送邮箱校验
        }],
        copyToManId: [{
          validator: copyToMansValidator, trigger: 'change'               // 抄送人ID校验
        }],
        // title: [{
        //   validator: titleValidator, trigger: 'change'         // 标题字段校验
        // }],
        copyToManMobile: [{
          validator: mobileValidator, trigger: 'change'                   // 抄送电话校验
        }],
        interviewer: [{
          validator: interviewerValidator, trigger: 'change'              // 面试官的校验
        }],
        // isCheck: [{
        //   required: true, message: '请选择是否背调', trigger: 'change'     // 是否背调校验
        // }],
        interviewDate: [{
          validator: interviewDateValidator, trigger: 'change'            // 面试时间校验
        }],
        templateId: [{
          required: true, message: '请选择通知模板', trigger: 'change'     // 通知模板校验
        }],
        applyOrgId: [{
          required: true, message: '请填写面试部门', trigger: 'change'     // 面试部门校验
        }],
        evalTemplateId: [{
          required: true, message: '请选择面试评估模板', trigger: 'change' // 评估模板校验
        }],
        entryDate: [{
          validator: entryDateValidator, trigger: 'change'                // 入职时间校验
        }],
        workAddress: [{
          validator: workAddressValidator, trigger: 'change'     // 面试地点校验
        }],
        // requirementId: [{
        //   required: true, message: '请选择招聘需求', trigger: 'change'     // 招聘需求校验
        // }],
        applyPositionId: [{
          required: true, message: '请选择面试职位', trigger: 'change'     // 面试职位校验
        }]
        // msgEditor: [{
        //   validator: msgEditorValidator, trigger: 'change'
        // }]
        // mailEditor: [{
        //   mailEditor: mailEditorValidator, trigger: 'change'
        // }]
      },
      // msgEditorRules: {
      //   validator: msgEditorValidator, trigger: 'blur'
      // },
      // mailEditorRules: {
      //   validator: mailEditorValidator, trigger: 'blur'
      // },
      noteContentRules: {validator: noteContentValidator, trigger: 'change'},
      mailContentRules: {validator: mailContentValidator, trigger: 'change'},
      mobileRules: {
        validator: mobileValidator, trigger: 'change'                   // 电话字段校验
      },
      emailRules: {
        validator: checkEmail, trigger: 'change'                    // 邮箱字段校验
      },
      titleRules: {
        validator: titleValidator, trigger: 'change'
      },
      entryDatePickerOpts: {                              // 入职时间选择限制
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      interviewDatePickerOpts: {                              // 面试时间选择限制
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },

  computed: {
    myTitle () {                                          // 对话框标题
      if (this.notifyWho) {
        return `给${this.notifyWho.name}发${this.notificationType === '1' ? '邀约' : this.notificationType === '2' ? '复试' : '录用'}通知`
      }
    },
    applyPositionId () {
      return this.notificationModel.applyPositionId
    },
    applyOrgId () {
      return this.notificationModel.applyOrgId
    }
  },
  watch: {
    'notificationModel.copyToManId': {
      handler: function (newVal, oldVal) {
        // 获取人员的电话和邮箱
        req('getPeople', {employeeId: this.notificationModel.copyToManId}).then(res => {
          this.notificationModel.copyToManMobile = res.mobile
          this.notificationModel.copyToManEmail = res.email
          // console.log(res)
        })
      },
      deep: true
    },
     // 邮箱后缀自动显示
    'notificationModel.email': {
      handler: function (newVal, oldVal) {
        // console.log(111,newVal,oldVal)
        if (newVal !== oldVal && this.lastName && this.startTim) {
          // console.log(newVal)
          // 选择符合条件的显示
          // 有@匹配符合的
          if (newVal.indexOf('@') !== -1) {
            // 截取@后面的内容和邮箱列表的进行对比
            this.a = newVal.slice(newVal.indexOf('@'))
            // console.log(a)
            this.showList = []
            this.emailsorce.forEach(item => {
              if (item.includes(this.a)) {
                let b = newVal.split('@')
                this.$set(this.showList, this.showList.length, b[0] + item)
              }
            })
          } else {
            // 没有@显示全部
            this.showList = []
            this.emailsorce.forEach(item => {
              this.$set(this.showList, this.showList.length, newVal + item)
            })
            // this.showList = this.emailsorce
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
    },
    'notificationModel.copyToManEmail': {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal && this.lastName && this.startTim) {
        // console.log(newVal)
        // 选择符合条件的显示
        // 有@匹配符合的
          if (newVal.indexOf('@') !== -1) {
            // 截取@后面的内容和邮箱列表的进行对比
            this.a = newVal.slice(newVal.indexOf('@'))
            // console.log(a)
            this.showCtpList = []
            this.emailsorce.forEach(item => {
              if (item.includes(this.a)) {
                let b = newVal.split('@')
                this.$set(this.showCtpList, this.showCtpList.length, b[0] + item)
              }
            })
          } else {
            // 没有@显示全部
            this.showCtpList = []
            this.emailsorce.forEach(item => {
              this.$set(this.showCtpList, this.showCtpList.length, newVal + item)
            })
            // this.showCtpList = this.emailsorce
          }
        // 如果输完了就隐藏列表或者没有匹配的也隐藏
          if (this.a.includes('.com') || this.showCtpList.length === 0 || newVal.length === 0) {
            this.isShowCtpEmailList = false
          } else {
            this.isShowCtpEmailList = true
          }
          // this.isShowEmailList = true
        } else {
          this.isShowCtpEmailList = false
          this.lastName = true
          this.startTim = true
        }
      },
      deep: true
    },
     // 监听组织ID，获取选中的职位信息，否则为职位ID为空，该组织下的职位列表也为空
    applyOrgId (newVal, oldVal) {
      !newVal && (this.notificationModel.posList = [])
      if (newVal) {
        req('getPosList', {orgUnitId: newVal, status: '1'}).then(res => {
          // res = res.map(item => { item.name = item.code + ' ' + item.name })
          this.$set(this.notificationModel, 'posList', res)
        })
        req('getArea', {id: newVal}).then(res => { this.notificationModel.orgs = res })
        // req('getArea', {id: newVal}).then(res => { this.positionInfo.orgs = res })
      }
    },
    applyPositionId (newVal, oldVal) {
      if (newVal) {
        this.notificationModel.selectedPos = this.notificationModel.posList.find(pos => { return pos.applyPositionId === newVal })
      }
    }
  },

  created () {
    this.getData()
    this.checkSecondInterview()
    this.checkSendInterview()
  },

  methods: {
     // 当组织变化时，需要将职位置空，因为不同的组织职位不同，需要重新选择
    nodeClick ($event, node, sel) {
      // console.log($event, node, sel)
      this.notificationModel.orgUnitName = $event.orgPathName
      this.notificationModel.applyPositionId = ''
    },
     // 删除组织id
    deleteOrgUnitId () {
      this.notificationModel.orgUnitName = ''
      // 组织id删除的时候，要删除该组织下面的职位
      this.notificationModel.applyPositionId = ''
    },
    //  // 邮箱校验
    // checkEmail (rule, value, callback) {
    //   if (value) {
    //     let reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
    //     if (reg.test(value)) {
    //       callback()
    //     } else {
    //       callback(new Error('请输入正确的邮箱格式'))
    //     }
    //   } else {
    //     callback(new Error('请输入邮箱'))
    //   }
    // },
    // 处理对话框关闭事件
    handleClose () {
      this.showMe = false
      this.$emit('update:showMe', false)
    },

    // 处理面试官选择对话框显示与否
    selectInterviewer () {
      // if (this.inteviewerSelectedFlag) return
      this.selectDialogFlag = !this.selectDialogFlag
      this.selectType = 'interviewer'
    },

    // 处理抄送人选择对话框显示与否
    selectCopyToMan () {
      // if (this.copyToManSelectedFlag) return
      this.selectDialogFlag = !this.selectDialogFlag
      this.selectType = 'copy'
    },

    // 处理选人对话框确认事件
    selectPersonConfirm (selectedArr) {
      // console.log(selectedArr)
      if (this.selectType === 'interviewer') {
        this.interviewer = selectedArr.map(ele => ele.employeeId)
        this.interviewerName = selectedArr.map(ele => ele.employeeName).join(',')
        this.selectDialogFlag = false
        // this.inteviewerSelectedFlag = true
      } else if (this.selectType === 'copy') {
        this.notificationModel.copyToManId = selectedArr[0].employeeId
        this.copyToMan = selectedArr[0].employeeName
        this.copyToManMobile = selectedArr[0].employeeMobile
        this.copyToManEmail = selectedArr[0].employeeEmail
        // this.copyToManSelectedFlag = true
      }
    },

    // 初始化本组件所需数据
    getData () {
      this.notificationModel.mobile = this.notifyWho.mobile
      this.notificationModel.email = this.notifyWho.email
      // 查询所有启用的通知模板
      req('getInformsEnabled').then(res => {
        this.templateIdOpts = res
      })
      // 查询所有启用的评估表模板
      req('getEvaluationTemplatesEnabled').then(res => {
        this.evaluateTemplateIdOpts = res
      })
      // 查询简历对应的发布中的需求
      /* req('getRequirementsReleased', {
        resumeId: this.notifyWho.resumeId
      }).then(res => {
        this.recruitRequirements = res
      }) */
      let requirementList = this.notifyWho.requirements
      this.recruitRequirements = requirementList
    },

    // 触发本组件确认事件时提交已填数据给后端
    postData (done) {
      this.toolbar[1].loading = true
      req('postNotification', {
        ...this.notificationModel,
        interviewId: this.notifyWho.interviewId,
        resumeId: this.notifyWho.resumeId,
        informType: this.notificationType,
        // noteContent: this.getMsgContent(),
        // mailContent: this.getMailContent(),
        noteContent: this.noteContent,
        mailContent: this.mailContent,
        isNote: this.msgChecked ? 'Y' : 'N',
        isMail: this.mailChecked ? 'Y' : 'N',
        interviewer: this.interviewer,
        copyToMans: [{
          copyToManId: this.notificationModel.copyToManId,
          copyToManMobile: this.notificationModel.copyToManMobile,
          copyToManEmail: this.notificationModel.copyToManEmail
        }],
        name: this.notifyWho.name
      }).then(res => {
        this.$message.success('发送通知成功')
        this.toolbar[1].loading = false
        this.$emit('getMyData')
        done()
      }).catch((err) => {
        console.log(err)
        this.toolbar[1].loading = false
      })
    },

    // // 获取短信内容
    // getMsgContent () {
    //   return this.$refs.msgEditor.getUEContent()
    // },

    // // 获取邮件内容
    // getMailContent () {
    //   return this.$refs.mailEditor.getUEContent()
    // },

    // 处理短信通知方式勾选事件
    msgCheckedChange (val) {
      this.$refs.notificationForm.validateField('way')
    },

    // 处理邮件通知方式勾选事件
    mailCheckedChange (val) {
      this.$refs.notificationForm.validateField('way')
    },

    // 处理招聘需求变更事件
    handleRequirementChange (selected) {
      this.recruitRequirements.forEach(element => {
        element.requirementId === selected && (selected = element)
      })
      this.notificationModel.requirementId = selected.requirementId
      this.notificationModel.applyOrgNode = {
        orgUnitId: selected.applyOrgId,
        orgUnitName: selected.applyOrgName
      }
      this.notificationModel.applyOrgId = selected.applyOrgId
      this.notificationModel.applyPositionId = selected.applyPositionId
      this.notificationModel.planRecruitNum = selected.planRecruitNum
      this.notificationModel.empType = selected.empType
      this.applyPositionName = selected.applyPositionName
    },
    // 处理通知模板变更事件
    handleTemplateChange (selected) {
      this.templateIdOpts.forEach(element => {
        element.templateId === selected && (selected = element)
      })
      this.templateName = selected.name
      console.log(selected)
      if (selected.isNote === 'Y') {
        this.msgChecked = true
        this.noteContent = selected.noteContent
        // this.$refs.msgEditor.setUEContent(selected.noteContent)
      }
      if (selected.isMail === 'Y') {
        this.mailChecked = true
        this.mailContent = selected.mailContent
        // this.$refs.mailEditor.setUEContent(selected.mailContent)
      }
      // this.notificationModel.templateId = selected.templateId
    },

    // 安排复试的校验处理
    checkSecondInterview () {
      if (this.notificationType === '2') {
        let rule = clone(this.notificationRules)
        this.notificationRules = null
        this.notificationRules = {
          title: rule.title,
          // isCheck: rule.isCheck,
          interviewer: rule.interviewer,
          interviewDate: rule.interviewDate,
          templateId: rule.templateId,
          evalTemplateId: rule.evalTemplateId,
          way: rule.way,
          mobile: rule.mobile
        }
      }
    },

    // 发送录用通知书的校验处理
    checkSendInterview () {
      if (this.notificationType === '3') {
        let rule = clone(this.notificationRules)
        this.notificationRules = null
        this.notificationRules = {
          title: rule.title,
          entryDate: rule.entryDate,
          copyToManId: rule.copyToManId,
          copyToManMobile: rule.copyToManMobile,
          copyToManEmail: rule.copyToManEmail,
          evalTemplateId: rule.evalTemplateId,
          templateId: rule.templateId,
          way: rule.way
        }
      }
    },

    // 选择邮箱后缀，拼接
    chooseName (name) {
      if (name) {
        let cc = name.split('@')
        if (this.notificationModel.email.indexOf('@') !== -1) {
        // 如果有@把后面的内容代替为选择的
          this.notificationModel.email = this.notificationModel.email.substring(0, this.notificationModel.email.indexOf('@'))
          // console.log( this.hireInfo.empEmployeeEmpContacts.email)
          this.notificationModel.email += '@' + cc[1]
        } else {
          this.notificationModel.email += '@' + cc[1]
        }
      // console.log(this.hireInfo.empEmployeeEmpContacts.email)
        this.isShowEmailList = false
        this.showList = []
        this.lastName = false
      } else {
        this.isShowEmailList = false
      }
    },
    chooseNameQ (name) {
      if (name) {
        let cc = name.split('@')
        if (this.notificationModel.copyToManEmail.indexOf('@') !== -1) {
        // 如果有@把后面的内容代替为选择的
          this.notificationModel.copyToManEmail = this.notificationModel.copyToManEmail.substring(0, this.notificationModel.copyToManEmail.indexOf('@'))
          // console.log( this.hireInfo.empEmployeeEmpContacts.email)
          this.notificationModel.copyToManEmail += '@' + cc[1]
        } else {
          this.notificationModel.copyToManEmail += '@' + cc[1]
        }
      // console.log(this.hireInfo.empEmployeeEmpContacts.email)
        this.isShowCtpEmailList = false
        this.showCtpList = []
        this.lastName = false
      } else {
        this.isShowCtpEmailList = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.notification__el-form {

  .el-form-item {
    margin-bottom: 20px;

    &:nth-child(1) {
      margin-top: 10px;
    }

    &:last-child {
      margin-bottom: 10px;
    }

    .el-form-item__content {
      margin-right: 10px;
    }
  }

  .el-input__icon {
    cursor: pointer;
  }
}
</style>

<style lang="scss">
.input__can-click {
  .el-input__inner {
    cursor: pointer;
  }
}
</style>
