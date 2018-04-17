<template>
    <div class="certificate-print">
      <i-process-flow
        @fillin='fillIn'
        :processType="processType"
        :slotArr="slotArr"
        :editBase="true"
        :model="changeList"
        :createName="changeList.employeeName"
        >
        <div slot='base'>

          <el-form :model="changeList" :rules="rules">

            <el-form-item label="发起人"  label-width="150px" v-if="showMap.employeeName" prop="employeeName" class="box1">
              <el-col :span="8" style='width:200px'>
                 <el-input
                     class="input-boxa"
                    v-model="changeList.employeeName" 
                    :placeholder="changeList.employeeName ? changeList.employeeName : username"
                    :disabled="disabledMap.employeeName || isFlowCenter"
                    readonly>
                   <i slot="suffix" class="el-icon-menu" v-if="!disabledMap.employeeName" @click="handleIconClick" ></i>                   
                  </el-input>
                  <i-show-personnelInfo 
                    v-if="showMap.employeeName" 
                    :id="changeList.empEmployeeId || id" 
                    class="btn1" 
                    v-show="changeList.employeeName"
                  ></i-show-personnelInfo> 
                  <i-personnel-select
                    :isShow.sync="isShow"
                    @confirm="handleConfirm"
                    :modal='false'
                    :multiple="false"
                    filterType="personnelGroup"
                    :hasGrant="false"
                    >
                  </i-personnel-select>
              </el-col>
            </el-form-item>

            <el-form-item label="证明类型"  label-width="150px" prop="printType" v-if="showMap.printType">
              <el-col :span="10" style='width:200px'>
                <!-- <i-select v-model="changeList.printType" parameter="PRINT_TYPE" :disabled="editAble" ></i-select>-->
                 <el-select v-model="changeList.printType" :disabled="disabledMap.printType" clearable>
                     <el-option
                       :label="item.label"
                       :value="item.value"
                       v-for="(item,idx) in templateType"
                       :key="idx">
                     </el-option>
                 </el-select>
              </el-col>
            </el-form-item>

          <el-form-item label="是否使用公司模板" label-width="150px" prop="isUseTemplate" v-if="showMap.isUseTemplate">
             <el-col :span="10" style='width:200px'>
                <i-select v-model="changeList.isUseTemplate" :disabled="disabledMap.isUseTemplate" parameter="WHETHER_TYPE" />
            </el-col>
          </el-form-item>

            <el-form-item label="证明模板" label-width="150px" prop="empTemplateId" v-if="changeList.isUseTemplate==='Y' && showMap.empTemplateId">
              <el-col :span="10" style='width:200px'>
                <el-select
                  v-model="changeList.empTemplateId"
                  :disabled="disabledMap.empTemplateId"
                  clearable
                  no-data-text="该证明类型没有模板可选"
                  @change="ruleShow"
                  @focus="isRulesShow=false">
                  <el-option
                    v-for="(item,idx) in templateList"
                    :key="idx"
                    :label="item.templateName"
                    :value="item.empTemplateId">
                  </el-option>
                </el-select>
                <el-button
                  type="text"
                  @click="previewContract"
                  style="margin-left: 20px"
                  class='btn'
                  v-if="showMap.show || true"
                  :disabled="disabledMap.show"
                 >
                 预览
                 </el-button>
              </el-col>
            </el-form-item>

            <el-form-item label="证明份数" label-width="150px" prop="num" v-if="showMap.num">
               <el-col :span="10" style='width:200px'>
                 <el-input-number v-model="changeList.num" :min="1" :disabled="disabledMap.num"></el-input-number>
               </el-col>
            </el-form-item>

            <el-form-item label="证明用途" label-width="150px" prop="useType" v-if="showMap.useType">
              <el-col :span="10" style='width:200px'>
                <el-input v-model="changeList.useType" :disabled="disabledMap.useType" maxlength="100" ></el-input>
              </el-col>
            </el-form-item>

            <el-form-item 
            label="盖章类型"
            label-width="150px"
            prop="sealType"
            v-if="changeList.printType!=='4' && showMap.sealType">
              <el-col :span="10">
                <el-radio
                  class="radio"
                  v-model="changeList.sealType"
                  label="公章"
                  :disabled="disabledMap.sealType"
                  >
                  公章
                 </el-radio>
                 <el-radio
                   class="radio"
                   v-model="changeList.sealType"
                   label="人事章"
                   :disabled="disabledMap.sealType"
                   >
                  人事章
                  </el-radio>
              </el-col>
            </el-form-item>

            <el-form-item
            label="收取方式"
            label-width="150px"
            prop="collectionMethod"
            v-if="changeList.printType!=='4' && showMap.collectionMethod">
              <el-col :span="10">
                 <el-radio
                   class="radio1"
                   v-model="changeList.collectionMethod"
                   label="自取"
                   :disabled="disabledMap.collectionMethod"
                 >
                 自取
                 </el-radio>
                 <el-radio
                   class="radio1"
                   v-model="changeList.collectionMethod"
                   label="邮寄(邮费到付)"
                   :disabled="disabledMap.collectionMethod"
                 >
                 邮寄(邮费到付)
                 </el-radio>
              </el-col>
            </el-form-item>

            <el-form-item
              label="地址"
              label-width="150px"
              v-if="changeList.printType!=='4' && changeList.collectionMethod==='邮寄(邮费到付)'  && showMap.address"
              prop="address">
              <el-col :span="10" style="width:400px">
                <el-input type="textarea" v-model="changeList.address" :disabled="disabledMap.address" maxlength="100"></el-input>
              </el-col>
            </el-form-item>

             <!-- 快递公司 -->
            <el-form-item
               label="快递公司"
               label-width="150px"
               v-if="isShowCompany && showMap.expressCompany"
               prop="expressCompany">
               <el-col :span="10" style="width:400px">
                 <el-input v-model="changeList.expressCompany" :disabled="disabledMap.expressCompany"   maxlength="15"></el-input>
               </el-col>
            </el-form-item>

             <!-- 快递单号 -->
            <el-form-item
               label="快递单号"
               label-width="150px"
               v-if="isShowExpressNumber && showMap.expressNumber"
               prop="expressNumber">
               <el-col :span="10" style='width:400px'>
                 <el-input v-model="changeList.expressNumber" :disabled="disabledMap.expressNumber" maxlength="20"></el-input>
               </el-col>
            </el-form-item>

          <el-form-item label-width="150px" label="模板附件" prop="fileList" v-if="changeList.isUseTemplate==='N' && showMap.fileList">
            <i-upload
              :previewMode="disabledMap.fileList"
              :fileLimit="fileLimit"
              :fileList="changeList.fileList"
              @onRemove="onFileRemove"
              @onSuccess="onFileSuccess"
              @onError="onFileError">
            </i-upload>
          </el-form-item>

          </el-form>

          <i-dialog title="模板预览" v-model="isShowTemplate">
             <div>
               <editor
                  :btn="false"
                 :preview="changeList"
                 :fill="false"
                 :config="config"
                 editorId="newTemplate"
                 @cancel="isShowTemplate=false"
                 @templateContent="putContractsSign">
              </editor>
             </div>
          </i-dialog>

        </div>
      </i-process-flow>
    </div>
</template>

<script>
import ButtonGroup from 'components/flow/button-group'
import BasicInfo from 'components/flow/basic-info'
import ISelect from 'components/common/i-select/i-select'
import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import ISelectTree from 'components/common/i-select-tree/i-select-tree'
import IProcessFlow from 'components/common/i-process-flow/index'
import Editor from 'components/employee/editor'
import IUpload from 'components/common/upload/uploader'
import IShowPersonnelInfo from 'components/common/i-show-personnelInfo'
import IDialog from 'components/common/i-dialog/i-dialog'
import req from 'api/employee/templateMaintain'
// import reqInfo from 'api/employee/personal'
import moment from 'moment'
export default {
  components: {
    ButtonGroup,
    BasicInfo,
    ISelect,
    IPersonnelSelect,
    ISelectTree,
    IProcessFlow,
    Editor,
    IUpload,
    IDialog,
    IShowPersonnelInfo
  },
  data () {
    let validatefileList = (rule, value, cb) => {
      !value ? cb(new Error('请上传模板附件!')) : cb()
    }
    let check = (rul, value, callback) => {
      value = this.changeList.num
      let isNumReg = /[.]/
      if (!value) {
        return callback(new Error('打印份数不能为空'))
      } else if (isNumReg.test(value)) {
        return callback(new Error('请输入正整数'))
      } else {
        callback()
      }
    }
    return {
      fileLimit: 1,
      changeList: {
        employeeName: '',
        printType: '',
        // 是否使用公司模板
        isUseTemplate: 'Y',
        fileList: [],
        num: '',
        useType: '',
        sealType: '',
        collectionMethod: '',
        address: '',
        empEmployeeId: '',
        empTemplateId: '',
        // 模板内容
        contractContent: '',
        printContent: '',
        // 仅仅用于前端层面
        // 快递公司
        expressCompany: '',
        // 快递单号
        expressNumber: ''
      },
      contractContent: '',
        // 模板类型的数据字典
      templateType: [
        {
          label: '在职证明模板',
          value: '2'
        },
        {
          label: '薪资证明模板',
          value: '3'
        },
        {
          label: '工牌打印模板',
          value: '4'
        },
        {
          label: '离职证明模板',
          value: '5'
        }
      ],
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 500,
        toolbars: [['print']]
      },
      templateList: [],
      isShowTemplate: false,
      isRulesShow: false,
      rules: {
        num: [
          { validator: check, trigger: 'blur' }
        ],
        employeeName: [
            { required: true, message: '请选择人员', trigger: 'change' }
        ],
        printType: [
            { required: true, message: '请选择打印类型', trigger: 'change' }
        ],
        isUseTemplate: [
            { required: true, message: '请选择是否使用公司模板', trigger: 'change' }
        ],
        fileList: [
            { required: true, validator: validatefileList, trigger: 'blur,change' }
        ],
        empTemplateId: [
            { required: true, message: '请选择打印模板', trigger: 'change' }
        ],
        address: [
            { required: true, message: '收货地址不可为空', trigger: 'blur' }
        ],
        expressCompany: [
            { required: true, message: '快递公司不可为空', trigger: 'blur' }
        ],
        expressNumber: [
            { required: true, message: '快递单号不可为空', trigger: 'blur' }
        ],
        useType: [
            { required: true, message: '证明用途不可为空', trigger: 'blur' }
        ],
        sealType: [
            { required: true, message: '请选择盖章类型', trigger: 'change' }
        ],
        collectionMethod: [
            { required: true, message: '请选择收取方式', trigger: 'change' }
        ]
      },
    // 保存路由带来的信息
      isFlowCenter: this.$route.query.isFlowCenter,
      empEmployeeId: this.$route.query.employeeId,
      processStatus: this.$route.query.processStatus,
      taskId: this.$route.query.taskId,
      processType: this.$route.query.processType,
      // slotArr: ['empFillIn', 'leader', 'hrDeal'],
      isShow: false
         //   禁用&启动
    }
  },
  computed: {
    username () {
      this.changeList.employeeName = this.$store.state.user.info ? this.$store.state.user.info.fullName : ''
      return this.$store.state.user.info ? this.$store.state.user.info.fullName : ''
    },
    id () {
      this.changeList.empEmployeeId = this.$store.state.user.info.empEmployeeId
      return this.$store.state.user.info.empEmployeeId
    },
    isShowWorkCard () {
      return this.changeList.printType !== '工牌打印模板'
    },
    isShowCompany () {
      return this.changeList.collectionMethod === '邮寄(邮费到付)' && this.disabledMap.collectionMethod && this.changeList.printType !== '4'
    },
    isShowExpressNumber () {
      return this.changeList.collectionMethod === '邮寄(邮费到付)' && this.disabledMap.collectionMethod && this.changeList.printType !== '4'
    }
  },
  watch: {
    // 证明类型改变则重新获取模板列表
    'changeList.printType': {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          // 发送请求请求相应的模板列表
          let status = {status: 1}
          newVal && (status.templateType = newVal)
          req('getTemplateList', status, true, false)
          .then(data => {
            // console.log(data)
            this.templateList = data.data
          })
          // 模板的占位清空
        }
        oldVal ? this.changeList.empTemplateId = '' : ''
      },
      deep: true
    },

    // 模板id改变重新获取模板内容
    'changeList.empTemplateId': {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getContractContent(newVal)
        } else {
          // this.templateList.length = 0
        }
      },
      deep: true
    }
  },
  // created () {
  //   // console.log(1111, this.showMap)
  //   this.changeList.isUseTemplate === 'Y'
  // },
  methods: {
    // 文件上传成功
    onFileSuccess (response, file, fileList) {
      this.$message.success('文件上传成功！')
      !Array.isArray(this.changeList.fileList) && (this.changeList.fileList = [])
      this.changeList.fileList.push(response)
    },

    // 移除文件
    onFileRemove (file, fileList) {
      this.changeList.fileList.map(id => {
        id === file.response && this.changeList.fileList.splice(this.changeList.fileList.indexOf(id), 1)
      })
    },

     // 文件上传失败
    onFileError (err, file, fileList) {
      console.log('err', err, file, fileList)
    },

    // 人员选择器弹框控制显示或者隐藏
    handleIconClick () {
      // 从流程中心进入则可以选人，人事进入则默认就是本人不可修改
      !this.isFlowCenter ? this.isShow = !this.isShow : this.isShow = false
    },

    // 人员选择器选中人员
    handleConfirm (selected) {
      if (selected.length === 1) {
        this.changeList.employeeName = selected[0].employeeName
        this.changeList.empEmployeeId = selected[0].employeeId
      }
    },

     // 提交到流程的表单信息
    fillIn (data, isFlowCenter) {
      isFlowCenter && (this.isFlowCenter = isFlowCenter)
      this.changeList.printContent = this.changeList.contractContent
      return this.changeList
    },

    // 点击预览按钮显示模板内容
    previewContract () {
      if (this.changeList.empTemplateId) {
        this.showContract()
        this.isShowTemplate = true
      } else {
        this.isRulesShow = true
      }
    },

    // 判断证明模板是否有值，决定预览弹框是否需要显示
    ruleShow () {
      this.changeList.empTemplateId ? this.isRulesShow = false : this.isRulesShow = true
    },

    // 模板要展示的内容
    showContract () {
      this.changeList.contractContent = this.contractContent
      // 根据人员id获取基本信息，再替换模板内容的Key
      req('getInfo', {empEmployeeId: this.changeList.empEmployeeId || this.id})
      .then(res => {
        // console.log(res)
        // 循环基本信息，把符合的模板内容进行替换
        Object.keys(res).map(key => {
          let reg = new RegExp('{' + key + '}', 'g')
          // res[key] ? res[key] : ''
          if (key === 'hireDate' || key === 'dimissionDate') {
            res[key] = res[key] ? (moment(new Date(res[key])).format('YYYY年MM月DD日')) : ''
          }
          if (key === 'gender') {
            res[key] === 'M' ? res[key] = '先生' : res[key] = '女士'
            this.changeList.contractContent = this.changeList.contractContent.replace('先生/女士', res[key])
          }
          this.changeList.contractContent = this.changeList.contractContent.replace(reg, res[key])
        })
        // 替换头像
        this.changeList.contractContent = this.changeList.contractContent.replace('{headImage}', `<p><img src="/yh/ihr/api/system/attachments/image/${res.photoPath}" width="100" title="头像" /></p>`)
      })
      // 日期默认是当天
      this.changeList.contractContent = this.changeList.contractContent.replace('{creatDate}', moment(Date.now()).format('YYYY年MM月DD日'))
      this.changeList.contractContent = this.changeList.contractContent.replace(/underline/g, 'none')
    },

    // 提交的模板内容
    putContractsSign () {
      // console.log(this.changeList.contractContent)
      this.changeList.printContent = this.changeList.contractContent
      this.isShowTemplate = false
    },

     // 获取模板内容
    getContractContent (templateId) {
      req('showTemplate', {templateId})
      .then(data => {
        // console.log(data)
        if (!data) {
          return false
        }
        this.changeList.contractContent = data.templateContent
        this.contractContent = data.templateContent
        this.showContract()
      })
      .catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss" scoped>
.certificate-print {
  .btn {
    position: absolute;
    left: 200px;
    top:0;
  }
  .el-radio + .el-radio {
    margin-left: 19px;
}

}

</style>
<style lang="scss">
     .input-boxa {
      .el-input__inner{
        text-indent: 10px;
      }
    }
     .box1 {
       position: relative;
       .btn1 {
         z-index: 999;
          position: absolute;
          left:6px;
          top:0;
       }
    }
  .certificate-print {
    .el-input-number__decrease, .el-input-number__increase {
      line-height:26px !important;
     }
  .el-input__inner {
    height:28px !important;
  }
  }
</style>