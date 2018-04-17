<template>
  <div class="contract-new">
   <i-process-flow 
    @fillin="fillIn"
    :model="signForm" 
    :processType="processType" 
    :createName="signForm.employeeName"
    >
    <!-- :createName="signForm.employeeName" -->
    <div class="content-follow" slot="empInfo">
      <h2 class="info-title">人员信息</h2>
      <el-form :model="signForm" class="info-content" label-width="150px" inline  v-if="signForm">
          
        
        <el-form-item label="姓名:" prop="employeeName" v-if="showMap.employeeName" class="box1">
          <el-input class="input-boxa" v-model="signForm.employeeName" :disabled="disabledMap.employeeName || !isFlowCenter" readonly>
              <i slot="suffix" class="el-icon-menu" v-if="!disabledMap.employeeName" @click="handleIconClick" ></i>
          </el-input>
          <i-show-personnelInfo 
            v-if="showMap.employeeName" 
            :id="signForm.empEmployeeId" 
            class="btn1" 
            v-show="signForm.employeeName"
          ></i-show-personnelInfo> 
          <i-personnel-select
            :isShow.sync="isShow"
            @confirm="handleConfirm"
            :multiple="false"
            filterType="renewContract"
            :hasGrant="false"
            ></i-personnel-select>
        </el-form-item>
        <el-form-item label="工号:" prop="employeeCode" v-if="showMap.employeeCode">
          <span v-text="signForm.employeeCode" :disabled="disabledMap.employeeCode"></span>

        </el-form-item>
        <el-form-item label="组织全称:" v-if="showMap.orgUnitName">
          <span v-text="signForm.orgUnitName" :disabled="disabledMap.orgUnitName"></span>
        </el-form-item>
        <el-form-item label="职位:" v-if="showMap.positionName">
          <span v-text="signForm.positionName" :disabled="disabledMap.positionName"></span>
        </el-form-item>
      </el-form>
    </div>
    <div slot="contractInfo" class="content-follow">
      <h2 class="info-title">合同信息</h2>
      <el-form
       class="info-content"  
       label-width="150px" 
       :rules="rules" 
       :model="signForm"  
       v-if="signForm">
        <el-form-item label="合同编号" prop="contractNo" v-if="showMap.contractNo">
          <el-input v-model="signForm.contractNo" disabled placeholder=""></el-input>
          <!-- <span v-text="signForm.contractNo" class="base"></span> -->
          <el-button type="text" @click="getContractNo" :disabled="disabledMap.contractNo" >获取合同编号</el-button>
        </el-form-item>
        <el-form-item label="续签次数" v-if="showMap.signNumber" >
          <span v-text="signForm.signNumber" :disabled="disabledMap.signNumber" class="base" placeholder=""></span>
        </el-form-item>

        <el-row><el-col :span="6">
            <el-form-item label="用工类型" prop="employeeType" v-if="showMap.employeeType">
              <i-select v-model="signForm.employeeType" parameter="EMPLOYEE_TYPE" :disabled="disabledMap.employeeType" placeholder=""></i-select>
            </el-form-item>
          </el-col></el-row>

        <el-row><el-col :span="6">
        <el-form-item label="合同类型" prop="contractType" v-if="showMap.contractType">
          <!-- <i-select v-model="signForm.contractType" :disabled="disabledMap.contractType" parameter="CONTRACT_TYPE" ></i-select> -->
           <el-select v-model="signForm.contractType" :disabled="disabledMap.contractType" clearable>
                <el-option
                  v-for="item in contractListType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
      </el-col></el-row>

      <el-row>
        <!-- <el-col :span="8"> -->
        <el-form-item label="合同模板" prop="empTemplateId" v-if="showMap.empTemplateId">
          <div class="tel">
              <el-select v-model="signForm.empTemplateId" :disabled="disabledMap.empTemplateId" clearable no-data-text="该合同类型没有模板可选" @change="ruleShow" @focus="rulesShow=false"  >
                <el-option v-for="(item,idx) in templateList" :key="idx" :label="item.templateName" :value="item.empTemplateId"></el-option>
              </el-select>
          <el-button type="text" @click="previewContract" v-if="showMap.show"  style="margin-left: 20px">预览</el-button>
          </div>

        </el-form-item>
        <!-- </el-col> -->
      </el-row>
        <el-row><el-col :span="6">
        <el-form-item label="合同主体" prop="companyName" v-if="showMap.contractSubject">
          <!-- <el-select v-model="signForm.contractSubject"
                     clearable
                     :disabled="disabledMap.contractSubject"
                     no-data-text="请选择">
            <el-option
             v-for="(item,idx) in contractSubjectList" 
             :key="idx" 
             :label="item.empCompanyName" 
             :value="item.empCompanyCode"
             ></el-option>
          </el-select> -->
          <el-input v-model="signForm.companyName" disabled></el-input>
        </el-form-item>
      </el-col></el-row>
        <el-form-item label="个人通讯地址" prop="contractAddress" v-if="showMap.contractAddress">
          <el-input v-model="signForm.contractAddress" :disabled="disabledMap.contractAddress" ></el-input>
        </el-form-item>
        <el-form-item label="最低工资" prop="leastSalary" v-if="showMap.leastSalary">
          <el-input v-model="signForm.leastSalary" :disabled="disabledMap.leastSalary" ></el-input>
        </el-form-item>
        <el-form-item label="上班地点" prop="workAdress" v-if="showMap.workAdress">
          <el-input v-model="signForm.workAdress" :disabled="disabledMap.workAdress" ></el-input>
        </el-form-item>
        <el-form-item label="合同期限类型" prop="contractPeriodType" v-if="showMap.contractPeriodType">
          <i-select parameter="CONTRACT_PERIOD_TYPE" :disabled="disabledMap.contractPeriodType || true" v-model="signForm.contractPeriodType" />
        </el-form-item>
        <el-form-item label="合同开始时间" prop="startDate" v-if="showMap.startDate">
          <el-date-picker v-model="signForm.startDate" :disabled="disabledMap.startDate" :picker-options="pickerOptions1" @change="dateChange($event,'startDate')"></el-date-picker>
        </el-form-item>
        <el-form-item label="合同期限" prop="contractPeriod" v-if="signForm.contractPeriodType === '1' && showMap.contractPeriod" >
          <el-row style="display:flex">
            <el-input v-model="signForm.contractPeriod" :disabled="disabledMap.contractPeriod" style="width:150px"/>
          <div style="flex:1;margin-left: 15px;">
              <el-radio v-model="signForm.yearOrMonth" :disabled="disabledMap.contractPeriod" label="year">年</el-radio>
              <el-radio v-model="signForm.yearOrMonth" :disabled="disabledMap.contractPeriod" label="month" style="margin-left: 14px">月</el-radio>
            <!-- <el-switch v-model="signForm.yearOrMonth" class="switch" on-color="#13ce66" off-color="#20a0ff" active-value="year" inactive-value="month" active-text="年" inactive-text="月" /> -->
            </div>
        </el-row>
        </el-form-item>
        <el-form-item label="试用期" prop="trainingPeriod" v-if="showMap.trainingPeriod">
            <el-input v-model="signForm.trainingPeriod" :disabled="disabledMap.trainingPeriod" style="width:150px"></el-input><span style="padding-left:15px;">个月</span>
        </el-form-item>
        <el-form-item label="合同结束时间" v-if="signForm.contractPeriodType == 1 && showMap.endDate">
            <el-date-picker v-model="signForm.endDate" :disabled="disabledMap.endDate" @change="dateChange($event,'endDate')"  ></el-date-picker>
        </el-form-item>
        <el-form-item label="签订时间" prop="signDate" v-if="showMap.signDate">
          <el-date-picker v-model="signForm.signDate" :disabled="disabledMap.signDate"   @change="dateChange($event,'signDate')" ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否已签订纸质合同" prop="isSignContract" v-if="showMap.isSignContract">
          <i-select v-model="signForm.isSignContract" :disabled="disabledMap.isSignContract"  parameter="WHETHER_TYPE" style="width: 300px"></i-select>
        </el-form-item>
      <el-row>
          <el-form-item label="附件" class="uploaderForm" v-if="showMap.fileList">
            <i-upload
              :previewMode="disabledMap.fileList"
              :fileList="signForm.fileList"
              @onRemove="onFileRemove"
              @onSuccess="onFileSuccess"
              @onError="onFileError"
            >
            </i-upload>
          </el-form-item></el-row>
      </el-form>

      <i-dialog title="合同预览" v-model="show">
        <editor
         :preview="fill" 
         :fill="false" 
         :btn="false" 
         :config="config" 
         editorId="newContract"
         @cancel="show=false" 
         @templateContent="putContractsSign"
        ></editor>
        <!-- <div v-html="signForm.contractContent" contenteditable="true"></div> -->
      </i-dialog>
    </div>
   </i-process-flow>
  </div>
</template>
<script>
  import ButtonGroup from 'components/flow/button-group'
  import BasicInfo from 'components/flow/basic-info'
  import ISelect from 'components/common/i-select/i-select'
  import req from 'api/employee/contract'
  import Editor from 'components/employee/editor'
  import IProcessFlow from 'components/common/i-process-flow'
  import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import IShowPersonnelInfo from 'components/common/i-show-personnelInfo'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import IUpload from 'components/common/upload/uploader'
  import reqd from 'api/employee/personal'
  import {formatTableDate} from 'utils/employee.js'
  import {formatDateToMi} from 'utils/employee'
  import moment from 'moment'

  export default {
    components: {
      ButtonGroup,
      BasicInfo,
      ISelect,
      Editor,
      IProcessFlow,
      IPersonnelSelect,
      IDialog,
      IUpload,
      IShowPersonnelInfo
    },
    data () {
      let validateMoney = (rule, value, cb) => {
        let isNum = /^(([0]{1}\.[0-9]*[0-9]+)|([1-9]+\.[0-9]*[1-9][0-9]*)|([1-9]+[0-9]*\.[0-9]+)|([1-9]+[0-9]*)|([0]{1}))$/
        let IsOnlyTwo = /^(([0]{1}\.[0-9]{0,2})|([1-9]+\.[0-9]{1,2})|([1-9]+[0-9]*\.[0-9]{1,2})|([1-9]+[0-9]*)|([0]{1}))$/
  
        !value && cb(new Error('工资不能为空'))

        if (isNum.exec(value)) {
          if (IsOnlyTwo.exec(value)) {
            cb()
          } else {
            cb(new Error('最多保留两位小数'))
          }
        } else {
          cb(new Error('请输入正确的数字!'))
        }
      }
      let check = (rule, value, cb) => {
        let test = /^\+?[1-9][0-9]*$/
        !value && cb(new Error('该字段不能为空'))
        test.test(value) ? cb() : cb(new Error('请输入大于0的整数'))
      }
      let check2 = (rule, value, cb) => {
        let test = /^\d+$/
        value === '' && cb(new Error('该字段不能为空'))
        test.test(value) ? cb() : cb(new Error('请输入数字'))
      }
      let checkNull = (rule, value, cb) => {
        // console.log(value)
        !value ? cb(new Error('请获取合同编号')) : cb()
      }
      let checkDate = (rule, value, cb) => {
        !value && cb(new Error('请选择日期'))
        cb()
      }
      return {
        isGetNo: false,
        previewMode: false,
        isShow: false, // 人员选择器
        show: false,
        empEmployeeId: this.$route.query.employeeId,
        taskId: this.$route.query.taskId,
        processType: this.$route.query.processType,
        processInstanceId: this.processInstanceId || '',
        wid: '',
        date: {
          startDate: '',
          signDate: ''
        },
        isFlowCenter: this.$route.query.isFlowCenter,
        // pickerOptions: {
        //   disabledDate: (time) => {
        //     let endDate = this.signForm.startDate || 0
        //     if (endDate) {
        //       return time.getTime() > new Date(endDate).getTime()
        //     }
        //   }
        // },
        pickerOptions1: {
          disabledDate: (time) => {
            let beginDateVal = this.signForm.hireDate || 0
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime()
            }
          }
        },
        rules: {
          contractNo: [{ required: true, validator: checkNull, trigger: 'change' }],
          contractType: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
          employeeName: [{ required: true, message: '请选择员工', trigger: 'change' }],
          contractAddress: [{ required: true, trigger: 'blur', message: '请输入地址' }],
          empTemplateId: [{ required: true, message: '请选择合同模板', trigger: 'change' }],
          // contractSubject: [{ required: true, message: '请选择合同主体', trigger: 'change' }],
          leastSalary: [{ required: true, validator: validateMoney, trigger: 'blur' }],
          workAddress: [{ required: true, trigger: 'blur', message: '请输入地址' }],
          signDate: [{ required: true, message: '请选择签订时间', trigger: 'change' }],
          startDate: [{ required: true, validator: checkDate, trigger: 'change' }],
          contractPeriodType: [{ required: true, message: '请选择合同期限类型', trigger: 'change' }],
          contractPeriod: [{ required: true, validator: check, trigger: 'blur' }],
          trainingPeriod: [{ required: true, validator: check2, trigger: 'blur' }],
          isSignContract: [{ required: true, message: '请选择是否签订纸质合同', trigger: 'change' }]
        },
        fill: {
          contractContent: ''
        },
        signForm: {
          leastSalary: '',
          workAdress: '',
          employeeName: '',
          employeeCode: '',
          employeeType: '', // 用工类型
          orgUnitName: '',
          positionName: '',
          empEmployeeId: '',
          empContractId: '',
          contractNo: null,
          contractType: '',
          empTemplateId: '',
          contractAddress: '',
          startDate: '',
          endDate: '',
          // contractSubject: '',
          companyName: '',
          contractPeriod: '',
          contractPeriodType: '',
          signDate: '',
          contractContent: '',
          fileList: [],
          yearOrMonth: 'year',
          trainingPeriod: '0',
          isSignContract: 'N'
        },

        contractContent: '',
        rulesShow: false,
        templateList: null,
        // contractSubjectList: [],
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 500,
          toolbars: [['print']]
        },

        filln: '',
        dictMap: {
          'CONTRACT_TYPE': 'contractType',
          'CONTRACT_PERIOD_TYPE': 'contractPeriodType',
          'GENDER': 'gender',
          'ID_TYPE': 'idType',
          'DOMICILE_TYPE': 'domicileType'
        },
        dictEmpMap: ['contractType', 'contractPeriodType', 'gender', 'idType', 'domicileType'],
        dictCodes: ['CONTRACT_TYPE', 'CONTRACT_PERIOD_TYPE', 'GENDER', 'ID_TYPE', 'DOMICILE_TYPE'],
        dicts: {},
        dict: {},
        contractListType: [] // 保存适用的合同类型
      }
    },
    watch: {
      // 监听员工姓名，如果姓名为空，则以下信息为空
      employeeId (newVal, oldVal) {
        if (this.wid && newVal === this.wid) {
          this.wid = ''
          return
        }
        newVal ? this.getDefaultSign(newVal) : Object.keys(this.signForm).map(key => { this.signForm[key] = '' })
        newVal && req('getcheck', {processInstanceId: this.processInstanceId, processDefineceId: 'empNewContractProcess', businessId: newVal})
        .then(res => {
          res && this.$message.error(`${this.signForm.employeeName}已在合同续签流程中，流程单号为${res}`)
        }).catch(err => {
          this.$message({message: err, type: 'warning'})
        })
      },

      empTemplateId (newVal, oldVal) {
        (newVal !== oldVal) && this.getContractContent(newVal)
      },
      'signForm.contractType': {
        immediate: true,
        handler (newVal, oldVal) {
          if (newVal !== oldVal) {
            this.signForm.contractPeriodType = newVal === '12' ? '2' : '1'
            this.signForm.empTemplateId = ''
            newVal ? this.getTemplateList(newVal) : (this.templateList = [])

          // 需求有变，暂时取消退休合同对结束时间的限制
          // let birth = new Date(this.signForm.birthDate)
          // if (isNaN(birth)) return
          // if (newVal === '9') {
          //   this.signForm.endDate = this.signForm.gender === 'M'
          //   ? birth.setFullYear(birth.getFullYear() + 50)
          //   : birth.setFullYear(birth.getFullYear() + 60)

          //   this.signForm.endDate = new Date(this.signForm.endDate).setDate(this.signForm.endDate.getDate() - 1)
          // }
          }
        }
      },
      'signForm.contractPeriodType': {
        immediate: true,
        handler (newVal, oldVal) {
          if (newVal !== oldVal) {
            this.signForm.contractPeriodType = this.signForm.contractType === '12' ? '2' : '1'
          }
        }
      },

      contractPeriod (newVal, oldVal) {
        newVal ? this.signForm.startDate && this.setDate(this.signForm.startDate, newVal, this.signForm.yearOrMonth) : this.signForm.endDate = ''
      },

      startDate (newVal, oldVal) {
        newVal ? this.signForm.contractPeriod && this.setDate(newVal, this.signForm.contractPeriod, this.signForm.yearOrMonth) : this.signForm.endDate = ''
      },
      'signForm.yearOrMonth': {
        handler: function (newVal, oldVal) {
          newVal ? this.signForm.contractPeriod && this.setDate(this.signForm.startDate, this.signForm.contractPeriod, newVal) : this.signForm.endDate = ''
        },
        deep: true
      },
      // 根据员工类型截取合同类型
      'signForm.employeeType' (newVal, oldVal) {
        if (newVal) {
          this.getContractType(newVal)
        }
        // 只有旧值的时候改变用工类型把合同类型清空
        oldVal ? this.signForm.contractType = '' : ''
      },

      'signForm.contractPeriod': {
        immediate: true,
        handler (newVal, oldVal) {
          (this.signForm.employeeType === '1' || this.signForm.employeeType === '2') && parseInt(newVal) === 3 && this.signForm.yearOrMonth === 'year' ? this.signForm.trainingPeriod = '6' : this.signForm.trainingPeriod = '0'
          // console.log('newVal', newVal)
        }
      }
      // yearOrMonth (newVal, oldVal) {
      //   console.log(this.signForm.startDate, newVal)
      //   newVal ? this.signForm.contractPeriod && this.setDate(this.signForm.startDate, this.signForm.contractPeriod, newVal) : this.signForm.endDate = ''
      // }
    },
    created () {
      this.empEmployeeId && this.getDefaultSign(this.empEmployeeId)
      // this.getContentDetailList()
      this.getDicts(this.dictCodes)
      this.signForm.contractType && this.getTemplateList(this.signForm.contractType)
      this.signForm.empTemplateId && this.getContractContent(this.signForm.empTemplateId)
    },
    computed: {
      empTemplateId () {
        return this.signForm.empTemplateId
      },

      contractType () {
        return this.signForm.contractType
      },

      contractPeriod () {
        return this.signForm.contractPeriod
      },

      startDate () {
        return this.signForm.startDate
      },

      employeeId () {
        return this.signForm.empEmployeeId
      },
      // contractSubject () {
      //   return this.signForm.contractSubject
      // },
      yearOrMonth () {
        return this.signForm.yearOrMonth
      }
    },

    methods: {
      async fillIn (data, isFlowCenter) {
        this.wid = data.empEmployeeId || ''
        isFlowCenter && (this.isFlowCenter = isFlowCenter)
        try {
          await data.empTemplateId && this.getTemplateList(data.contractType)
        } catch (err) {
          console.log(err)
        }
        this.$nextTick(() => {
          Object.keys(data).map(key => {
            this.signForm[key] = data[key]
          })
          // this.signForm.yearOrMonth = 'year'
        })
      },

      getContractNo () {
        if (!this.signForm.empEmployeeId) {
          this.$message({message: '请选择续签的人员', type: 'warning'})
          return false
        }
        req('getContactNo', {empEmployeeId: this.signForm.empEmployeeId})
        .then(data => {
          this.signForm.contractNo = data
          this.isGetNo = true
        })
        .catch(() => { this.isGetNo = false })
      },

      dateChange ($event, param) {
        $event ? this.signForm[param] = moment(new Date($event)).format('YYYY-MM-DD') : this.signForm[param] = ''
      },
      handleIconClick () {
        // this.isShow = !this.isShow
        this.isFlowCenter ? this.isShow = !this.isShow : false
      },
      handleConfirm (selected) {
        Object.keys(this.signForm).map(key => {
          selected[0][key] = this.signForm[key]
        })

        this.signForm.empEmployeeId = selected[0].employeeId
        this.signForm.orgUnitName = selected[0].unitPathName
        this.signForm.yearOrMonth = 'year'
      },
      previewContract () {
        if (this.signForm.empTemplateId) {
          this.showContract()
          // console.log('3', this.signForm)
          this.show = true
        } else {
          this.$message({message: '请选择合同模板', type: 'warning'})
        }
      },

      ruleShow () {
        this.signForm.empTemplateId ? this.rulesShow = false : this.rulesShow = true
      },

      showContract () {
        this.signForm.contractContent = this.contractContent

        this.fillContact()
      },
      getDicts (dictCodes) {
        reqd('getDicts', {'dictCodes[]': dictCodes.join(',')})
        .then(res => {
          res.map(key => {
            if (this.dictMap[key.dictName]) {
              this.dicts[this.dictMap[key.dictName]] = {}

              key.dict.map(dic => { this.dicts[this.dictMap[key.dictName]][dic.value] = dic.label })
            }
          })
        })
      },

      fillContact () {
        Object.assign(this.fill, this.signForm)
        this.fill.signDate = formatDateToMi(new Date(this.signForm.signDate || new Date())).c
        this.fill.startDate = this.signForm.startDate ? formatDateToMi(new Date(this.signForm.startDate)).c : ''
        this.fill.endDate = this.signForm.endDate ? formatDateToMi(new Date(this.signForm.endDate)).c : ''
        this.fill.probationType = this.signForm.probationType ? this.signForm.probationType : this.signForm.trainingPeriod
        this.fill.expectedProbationEndDate = this.signForm.expectedProbationEndDate ? formatDateToMi(new Date(this.signForm.expectedProbationEndDate)).c : (this.signForm.startDate) ? moment(this.signForm.startDate).add(this.fill.probationType, 'M').subtract(1, 'd').format('YYYY年MM月DD日') : ''
        let arr = this.contractContent && this.contractContent.split('#·')
        arr && arr.map((str, idx) => {
          if ((/^\{.*\}$/).test(str)) {
            str = str.split('')
            str.pop()
            str.shift()
            str = str.join('')

            // console.log(str)
            arr[idx] = this.dictEmpMap.indexOf(str) !== -1
            ? (this.dicts[str] && (this.signForm[str] ? (this.dicts[str][this.fill[str]] || '') : ''))
            : (this.fill[str] || '')
          }
        })
        this.signForm.contractContent = arr && arr.join('')
        this.fill.contractContent = arr && arr.join('')
      },

      postFlow () {
        this.showContract()
        return this.signForm
      },
      submitContract () {
        if (this.signForm.empTemplateId) {
          let aa = async () => {
            await this.showContract()
            this.putContractsSign()
          }

          aa()
        } else {
          this.rulesShow = true
        }
      },

      /** 发起合同新签 */
      putContractsSign (data) {
        data && (this.signForm.contractContent = data)
        let a

        a = this.empPfId ? 'putContractsSignByFlow' : 'putContractsSign'
        this.signForm.empPfId = this.empPfId || ''
        ;(this.signForm.contractPeriodType !== '1') && (this.signForm.endDate = '')

        req(a, this.signForm)
        .then(data => {
          this.$message(`${data}新签成功`)
          ;(this.show) && (this.show = false)
          this.empEmployeeId && this.getDefaultSign(this.empEmployeeId)
          this.empPfId && this.getDefaultSignByFlow(this.empPfId)
        }).catch(err => (console.log(err)))
      },

      getFlowBasicInfo (data) {
        Object.assign(this.flowBasicInfo, data)
      },

      getTemplateList (contractType) {
        let status = {status: 1}

        contractType && (status.contractType = contractType)
        this.templateList = []
        return req('getContractList', status)
        .then(data => {
          this.templateList = data.data
          !data.data.length && (this.signForm.empTemplateId = '')
          // console.log(this.templateList)
        })
      },

      getDefaultSign (empEmployeeId) {
        req('getDefaultSign', {empEmployeeId})
        .then(data => {
          data.endDate && formatTableDate([data], ['endDate'])
          // Object.assign(this.signForm, data)
          Object.keys(data).map(item => { data[item] && (this.signForm[item] = data[item]) })

          this.signForm.yearOrMonth = 'year'
          !this.signForm.isSignContract && (this.signForm.isSignContract = 'N')
          this.signForm.signNumber === 2 && (this.signForm.contractPeriodType = '1') && (this.signForm.contractPeriod = '5')
          this.signForm.signNumber >= 3 && (this.signForm.contractPeriodType = '2')
            // 签订时间默认是合同开始时间
          this.signForm.signDate = moment(this.signForm.startDate).format('YYYY-MM-DD')
          Object.assign(this.fill, this.signForm)
          this.fill.signDate = formatDateToMi(new Date(this.signForm.signDate || new Date())).c
          this.fill.startDate = formatDateToMi(new Date(this.signForm.startDate)).c
          this.fill.endDate = formatDateToMi(new Date(this.signForm.endDate)).c
        })
      },

      getContractContent (templateId) {
        req('showTemplate', {templateId})
        .then(data => {
          this.signForm.contractContent = data.templateContent
          this.contractContent = data.templateContent
        })
        .catch(err => console.log(err))
      },
      // 获取合同主体列表
      // getContentDetailList () {
      //   req('getContentDetailList', {}).then(res => {
      //     this.contractSubjectList = res
      //   })
      // },

      setDate (date, per, yearOrMonth) {
        let now = new Date(date)

        this.signForm.endDate = yearOrMonth === 'year' ? (new Date(now.setFullYear(now.getFullYear() + +per))) : (new Date(now.setMonth(now.getMonth() + +per)))
        this.signForm.endDate = new Date(this.signForm.endDate).setDate(this.signForm.endDate.getDate() - 1)
      },
      onFileSuccess (response, file, fileList) {
        this.$message.success('文件上传成功！')
        this.signForm.fileList.push(response)
      },
      onFileError (err, file, fileList) {
        console.log('err', err, file, fileList)
      },
      onFileRemove (file, fileList) {
        this.signForm.fileList.map(id => {
          id === file.response && this.signForm.fileList.splice(this.signForm.fileList.indexOf(id), 1)
        })
      },

       // 获取全部的合同类型
      getContractType (val) {
          // 每一次转换进入之前把之前的数组清空
        this.contractListType = []
        reqd('getDistCode', {dictCode: 'CONTRACT_TYPE'})
          .then(res => {
            // 如果没有选择就显示全部
            res.forEach((item, i) => {
              if (item.value.substring(0, 1) === val) {
                this.contractListType.push(item)
              }
            })
          })
      }
    }
  }
</script>
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
  .contract-new {
    .tel {
      display: flex
    }
    .base {
      margin-left: 20px;
    }
    .rules {
      font-size: 12px;
      color: #ff4949;
      margin-left: 5px;
    }
    .info-content {
      .el-input {
        width: 300px;
      }
    }
    .contract {
      display: flex;
      justify-content: space-between;
      .switch {
        width: 160px;
        margin-left: 10px;
        height: 30px;
        line-height: 30px;
      }
    }
    .uploaderForm {
      width: 800px;
    }
  }
</style>
