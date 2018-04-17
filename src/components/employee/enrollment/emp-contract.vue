<template>
  <section class="emp-contract content-follow">
    <h2 class="info-title">劳动合同信息</h2>
   
    <el-form
     :model="hireInfo.empContract" 
     label-width="110px" 
     class="form-main clearfix" 
     :rules="rules"
     ref="ruleForm"
     >

  
         <div class="base">
          <el-form-item label="合同编号" prop="contractNo" v-if="showMap.contractNo">
            <span v-text="hireInfo.empContract.contractNo" ></span>
            <el-button type="text" @click="getContractNo" :disabled="disabledMap.contractNo">获取合同编号</el-button>
          </el-form-item>
    
          <el-form-item label="合同类型" prop="contractType" v-if="showMap.contractType">
              <el-select v-model="hireInfo.empContract.contractType" :disabled="disabledMap.contractType" clearable>
                <el-option
                  v-for="item in contractListType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>

            <el-form-item label="合同模板" prop="empTemplateId" v-if="showMap.empTemplateId">
              <el-row>
                <el-col :span="20">
                  <el-select v-model="hireInfo.empContract.empTemplateId" clearable no-data-text="该合同类型没有模板可选" :disabled="disabledMap.empTemplateId">
                  <el-option
                  v-for="(item,idx) in templateList" 
                  :key="idx" 
                  :label="item.templateName"
                  :value="item.empTemplateId"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4" v-if="showMap.show"><el-button type="text" @click="previewContract" style="margin-left: 20px">预览</el-button></el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="合同主体" prop="companyName" v-if="showMap.companyName" required>
              <el-input v-model="hireInfo.empContract.companyName" :disabled="disabledMap.companyName || true" placeholder=""></el-input>
            </el-form-item>
          <!-- </el-col> -->

        <!-- <el-col v-for="(item,idx) in formList" :key="idx" :span="6">
            <el-form-item :label="item.label" :prop="item.prop">
              <el-input  v-model="hireInfo.empContract[item.model]"></el-input>
            </el-form-item>
          </el-col> -->
      <!-- </el-row> -->
      <!-- <el-row>
          <el-col :span="6"> -->
          <el-form-item label="试用期(月)" prop="probationType" v-if="showMap.probationType">
            <el-input v-model="hireInfo.empPosition.probationType" :disabled="disabledMap.probationType"></el-input>
          </el-form-item>

            <el-form-item label="个人通讯地址" prop="contractAddress" v-if="showMap.contractAddress">
              <el-input  v-model="hireInfo.empContract.contractAddress" :disabled="disabledMap.contractAddress" maxlength="30"></el-input>
            </el-form-item>
        
            <el-form-item label="最低工资" prop="leastSalary" v-if="showMap.leastSalary">
              <el-input  v-model="hireInfo.empContract.leastSalary" :disabled="disabledMap.leastSalary" maxlength="10"></el-input>
            </el-form-item>
        
            <el-form-item label="上班地点" prop="workAdress" v-if="showMap.workAdress">
              <el-input  v-model="hireInfo.empContract.workAdress" :disabled="disabledMap.workAdress" maxlength="30"></el-input>
            </el-form-item>
      
          <el-form-item :label="`${title}期限类型`" prop="contractPeriodType" v-if="showMap.contractPeriodType">
            <i-select v-model="hireInfo.empContract.contractPeriodType" parameter="CONTRACT_PERIOD_TYPE" :disabled="disabledMap.contractPeriodType || true" placeholder=""></i-select>            
          </el-form-item>
  
          <el-form-item label="开始日期" prop="startDate" v-if="showMap.startDate">
            <el-date-picker
              type="date"
              v-model="hireInfo.empContract.startDate"
              style="width: 100%;"
              @change="getStartDate"
              :picker-options="picker"
              :disabled="disabledMap.startDate"></el-date-picker>
          </el-form-item>
      
          <el-form-item label="截止日期" prop="endDate" v-if="showMap.endDate && hireInfo.empContract.contractPeriodType==='1'" >
            <el-date-picker type="date" v-model="hireInfo.empContract.endDate" style="width: 100%;" @change="getEndDate" disabled placeholder=""></el-date-picker>
          </el-form-item>
          
          <el-form-item :label="`${title}期限`" prop="contractPeriod" v-if="showMap.contractPeriod && hireInfo.empContract.contractPeriodType==='1' && hireInfo.empContract.startDate && hireInfo.empContract.contractType !=='9'">
                 <el-row style="display:flex">
               <el-input v-model="hireInfo.empContract.contractPeriod" style="flex:1" :disabled="disabledMap.contractPeriod"/>
              <div style="flex:1;display:flex;margin-top: 10px;margin-left: 10px">
                  <el-radio v-model="hireInfo.empContract.yearOrMonth" label="year" :disabled="disabledMap.contractPeriod">年</el-radio>
                  <el-radio v-model="hireInfo.empContract.yearOrMonth" label="month" style="margin-left: 14px" :disabled="disabledMap.contractPeriod">月</el-radio>
               </div>
            </el-row>
              <!-- </el-row> -->
          </el-form-item>

          <el-form-item label="是否已签订纸质合同" prop="isSignContract" v-if="showMap.isSignContract">
            <i-select v-model="hireInfo.isSignContract" :disabled="disabledMap.isSignContract"  parameter="WHETHER_TYPE"></i-select>
          </el-form-item>
        </div>

      </el-row>
      <el-row>
          <el-form-item label="合同附件" class="uploaderForm" v-if="showMap.contractFileList">
              <i-upload
                :previewMode="disabledMap.contractFileList"
                :fileList="hireInfo.empContract.fileList"
                @onRemove="onFileRemove"
                @onSuccess="onFileSuccess"
                @onError="onFileError" >
              </i-upload>
            </el-form-item>
      </el-row>
    </el-form>
    <i-dialog title="合同预览"  v-model="show" class="tmm-dialog" >

        <editor
         :preview="fill" 
         :fill="false" 
         :btn="false" 
         :config="config"
         editorId="empContractFlow"
         @cancel="show=false"
         @templateContent="putContractsSign"
         ></editor>

        <!-- <div v-html="hireInfo.contractContent" contenteditable="true"></div> -->
      </i-dialog>
      <!-- <el-button @click="te"></el-button> -->
  </section>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select'
  import req from 'api/employee/personal'
  import reqc from 'api/employee/contract'
  import IUpload from 'components/common/upload/uploader'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import Editor from 'components/employee/editor'
  import {formatDateToMi} from 'utils/employee'
  import moment from 'moment'

  export default {
    components: {
      ISelect,
      IUpload,
      Editor,
      IDialog
    },
    props: {
      hireInfo: Object,
      year: Boolean
    },
    data () {
      let validateMoney = (rule, value, cb) => {
        let isNum = /^(([0]{1}\.[0-9]*[0-9]+)|([1-9]+\.[0-9]*[1-9][0-9]*)|([1-9]+[0-9]*\.[0-9]+)|([1-9]+[0-9]*)|([0]{1}))$/
        let IsOnlyTwo = /^(([0]{1}\.[0-9]{0,2})|([1-9]+\.[0-9]{1,2})|([1-9]+[0-9]*\.[0-9]{1,2})|([1-9]+[0-9]*)|([0]{1}))$/
        !value && cb(new Error('最低工资不能为空'))
        if (isNum.exec(value)) {
          if (IsOnlyTwo.exec(value)) {
            cb()
          } else {
            cb(new Error('工资最多保留两位小数'))
          }
        } else {
          cb(new Error('请输入正确的数字!'))
        }
      }
      const validateNumber = (rule, value, cb) => {
        var num = /^\+?[1-9][0-9]*$/
        !value && cb(new Error('合同期限不能为空'))
        setTimeout(function () {
          !num.exec(value) ? cb(new Error('期限必须为大于0的整数')) : cb()
        }, 0)
      }
      let checkDate = (rule, value, cb) => {
        !value && cb(new Error('请选择日期'))
        cb()
      }
      const validateProbationType = (rule, value, cb) => {
        var num = /^[0-9]{1}$/
        !this.hireInfo.empPosition.probationType && cb(new Error('试用期不能为空'))
        this.hireInfo.empPosition.probationType && !num.exec(this.hireInfo.empPosition.probationType) ? cb(new Error('试用期必须为0-9以内整数')) : cb()
      }
      return {
        picker: {
          disabledDate: (time) => {
            let hire = this.hireInfo.empPosition.hireDate
            return time.getTime() < new Date(hire)
          }
        },
        isGetNo: false,
        show: false,
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 500,
          toolbars: [['print']]
        },
        previewMode: false,
        // contractSubjectList: [],
        templateList: null,
        formList: [
          {label: '通讯地址', model: 'contractAddress', prop: 'contractAddress'},
          {label: '最低工资', model: 'leastSalary', prop: 'leastSalary'},
          {label: '上班地点', model: 'workAdress', prop: 'workAdress'}
        ],
        dicts: {},
        fill: {
          contractContent: '',
          emergencyContact: '',
          emergencyContactPhone: '',
          signDate: formatDateToMi(new Date()).c,
          startDate: formatDateToMi(new Date(this.hireInfo.empContract.startDate)).c,
          endDate: formatDateToMi(new Date(this.hireInfo.empContract.endDate)).c
        },
        rules: {
          contractType: [
            { required: true, message: '请选择合同类型', trigger: 'change' }
          ],
          startDate: [
            { required: true, validator: checkDate, trigger: 'change' }
          ],
          // endDate: [
          //   { validator: checkDate, trigger: 'change' }
          // ],
          probationType: [
            { required: true, validator: validateProbationType, trigger: 'blur' }
          ],
          contractPeriod: [
            { required: true, validator: validateNumber, trigger: 'blur' }
          ],
          contractPeriodType: [
            { required: true, message: '请选择合同类型期限', trigger: 'change' }
          ],
          contractNo: [{ required: true, message: '请获取合同编号', trigger: 'change' }],
          contractAddress: [{ required: true, trigger: 'blur', message: '请输入地址' }],
          empTemplateId: [{ required: true, message: '请选择合同模板', trigger: 'change' }],
          // companyName: [{ required: true, message: '请选择合同主体', trigger: 'change' }],
          leastSalary: [{ required: true, validator: validateMoney, trigger: 'blur' }],
          workAdress: [{ required: true, trigger: 'blur', message: '请输入地址' }],
          isSignContract: [{ required: true, message: '请选择是否签订纸质版合同', trigger: 'change' }]

        },
        // 根据合同期限类型，判断是否显示合同期限
        isShowContractPeriod: false,
        contractTypeList: [],
        contractContent: '',
        title: '合同',

        dictMap: {
          'CONTRACT_TYPE': 'contractType',
          'CONTRACT_PERIOD_TYPE': 'contractPeriodType',
          'GENDER': 'gender',
          'ID_TYPE': 'idType',
          'DOMICILE_TYPE': 'domicileType'
        },
        dictEmpMap: ['contractType', 'contractPeriodType', 'gender', 'idType', 'domicileType'],
        dictCodes: ['CONTRACT_TYPE', 'CONTRACT_PERIOD_TYPE', 'GENDER', 'ID_TYPE', 'DOMICILE_TYPE'],

        dict: {},
        contractListType: [] // 保存适用的合同类型
      }
    },
    watch: {
        // 根据合同期限类型，判断是否显示合同期限
      'hireInfo.empContract.contractPeriodType': {
        handler: function (newVal) {
          if (newVal === '1') {
            this.isShowContractPeriod = true
            this.hireInfo.empPosition.empCluster === 1 && this.hireInfo.empPosition.employeeType === '1' && this.$route.query.tsakKey === 'HRsupplementMessage' && (this.hireInfo.empContract.contractPeriod = '3')
          } else {
            this.hireInfo.empContract.contractPeriod = ''
            this.hireInfo.empContract.endDate = ''
            this.isShowContractPeriod = false
          }
        },
        deep: true
      },
      'hireInfo.empPosition.personnelArea': {
        handler: function (newVal) {
          this.getLowestSalary(newVal)
        },
        deep: true
      },
      'hireInfo.empContract.contractPeriod': {
        handler: function (newVal) {
          if (newVal) {
            this.controlContractPeriod()
          }
        },
        deep: true
      },
      'hireInfo.empContract.startDate': {
        handler: function (newVal) {
          this.hireInfo.empContract.contractPeriod ? this.controlContractPeriod() : ''
        },
        deep: true
      },
      'hireInfo.empContract.empTemplateId': {
        handler: function (newVal, oldVal) {
          (newVal !== oldVal) && this.getContractContent(newVal)
        },
        deep: true
      },
      'hireInfo.empContract.contractType': {
        handler: function (newVal, oldVal) {
          this.hireInfo.empContract.contractPeriodType = newVal === '12' ? '2' : '1'
          this.$refs.ruleForm.validateField('contractPeriodType', res => { })
          this.hireInfo.empContract.empTemplateId = ''
          if (newVal !== oldVal && newVal) {
            this.getTemplateList(newVal)
          } else {
            this.templateList = []
          }
          this.hireInfo.empPosition.employeeType === '1' && this.hireInfo.empContract.contractPeriodType !== '12' && (this.hireInfo.empContract.contractPeriod = '3')

          // 需求有变，暂时取消退休合同对结束时间的限制
          // let birth = new Date(this.hireInfo.empEmployeeEmpContacts.birthDate)
          // if (isNaN(birth)) return

          // if (newVal === '9') {
          //   this.hireInfo.empContract.endDate = this.hireInfo.empEmployeeEmpContacts.gender === 'M'
          //   ? birth.setFullYear(birth.getFullYear() + 50)
          //   : birth.setFullYear(birth.getFullYear() + 60)

          //   this.hireInfo.empContract.endDate = new Date(this.hireInfo.empContract.endDate).setDate(this.hireInfo.empContract.endDate.getDate() - 1)
          //   this.hireInfo.empContract.contractPeriodType = '1'
          // }
        }
      },
      'hireInfo.empContract.yearOrMonth': {
        handler: function (newVal) {
          this.controlContractPeriod()
        },
        deep: true
      },
      // 'hireInfo.empContract.contractSubject': {
      //   handler: function (newVal, oldVal) {
      //     this.contractSubjectList.map(key => {
      //       key.empCompanyCode === newVal && (this.hireInfo.empContract.companyName = key.empCompanyName)
      //     })
      //   }
      // },
      employeeType (newVal, oldVal) {
        this.getContractType(newVal)
      }
    },
    computed: {
      employeeType () {
        return this.hireInfo.empPosition.employeeType
      }
    },
    created () {
      !this.hireInfo.empContract.fileList && (this.hireInfo.empContract.fileList = [])
      // 合同开始时间默认是入职时间
      !this.hireInfo.empContract.startDate && (this.hireInfo.empContract.startDate = this.hireInfo.empPosition.hireDate)
        // 默认的是选中年
      !this.hireInfo.empContract.yearOrMonth && (this.hireInfo.empContract.yearOrMonth = 'year')

      this.getDict('CONTRACT_TYPE')
      // this.getContractAllType()
      this.hireInfo.empPosition.employeeType && this.getContractType(this.hireInfo.empPosition.employeeType)
      this.hireInfo.empPosition.personnelArea && this.getCompanyName(this.hireInfo.empPosition.personnelArea)
      Object.assign(this.fill, this.hireInfo.empEmployeeEmpContacts, this.hireInfo.empPosition)

      this.fill.signDate = formatDateToMi(new Date()).c
      this.fill.startDate = formatDateToMi(new Date(this.hireInfo.empContract.startDate)).c
      this.fill.endDate = formatDateToMi(new Date(this.hireInfo.empContract.endDate)).c
      this.fill.expectedProbationEndDate = formatDateToMi(new Date(new Date(this.hireInfo.empContract.startDate).setMonth(new Date(this.hireInfo.empContract.startDate).getMonth() + parseInt(this.hireInfo.empPosition.probationType || 0)))).c

      this.fill.employeeName = this.hireInfo.empEmployeeEmpContacts.fullName
      !this.hireInfo.familyData && (this.hireInfo.familyData = this.hireInfo.allEmpFamilyMemberList)
      this.hireInfo.familyData.map(row => {
        if (row.isEmergency === 'Y') {
          this.fill.emergencyContact = row.name
          this.fill.emergencyContactPhone = row.primaryPhone
        }
      })
      console.log(this.hireInfo.empContract)
      this.hireInfo.empContract.contractType && this.getTemplateList(this.hireInfo.empContract.contractType)

      this.hireInfo.empContract.empTemplateId && this.getContractContent(this.hireInfo.empContract.empTemplateId)
      this.getDicts(this.dictCodes)
    },
    mounted () {
      this.hireInfo.empPosition.personnelArea && !this.hireInfo.empContract.leastSalary && this.getLowestSalary(this.hireInfo.empPosition.personnelArea)
    },
    methods: {
      getLowestSalary (personnelGroupCode) {
        req('getLowestSalary', {personnelGroupCode})
        .then(res => {
          this.hireInfo.empContract.leastSalary = res.toString()
        })
      },

      getDicts (dictCodes) {
        req('getDicts', {'dictCodes[]': dictCodes.join(',')})
        .then(res => {
          res.map(key => {
            if (this.dictMap[key.dictName]) {
              this.dicts[this.dictMap[key.dictName]] = {}

              key.dict.map(dic => { this.dicts[this.dictMap[key.dictName]][dic.value] = dic.label })
            }
          })
        })
      },
      getContractNo () {
        this.hireInfo.employeeCode
        ? this.getContractNum(this.hireInfo.employeeCode)
  
         : req('getEmployeeCode')
           .then(employeeCode => {
             this.hireInfo.employeeCode = employeeCode
             this.getContractNum(employeeCode)
           })
           .catch(() => { this.isGetNo = false })
        // reqc('getContactNo')
        // .then(data => {
        //   this.hireInfo.empContract.contractNo = data
        //   this.isGetNo = true
        // })
        // .catch(() => { this.isGetNo = false })
      },
      getContractNum (employeeCode) {
        req('getContractNum', { employeeCode }).then(num => {
          this.hireInfo.empContract.contractNo = this.hireInfo.empPosition.personnelArea + '_' + employeeCode + '_' + num
          this.$refs.ruleForm.validateField('contractNo', res => {})
          this.isGetNo = true
        }).catch(() => { this.isGetNo = false })
      },
      previewContract () {
        if (this.hireInfo.empContract.empTemplateId) {
          this.showContract()
          this.show = true
        } else {
          this.$message('请选择合同模板预览')
        }
      },
      showContract () {
        this.hireInfo.empContract.contractContent = this.contractContent
        this.fill.contractContent = this.contractContent
        this.fillContact()
      },

      fillContact () {
        Object.assign(this.fill, this.hireInfo.empEmployeeEmpContacts, this.hireInfo.empPosition, this.hireInfo.empContract)
        this.fill.signDate = formatDateToMi(new Date(this.hireInfo.empContract.signDate || new Date())).c
        this.fill.startDate = this.hireInfo.empContract.startDate ? formatDateToMi(new Date(this.hireInfo.empContract.startDate)).c : ''
        this.fill.endDate = this.hireInfo.empContract.endDate ? formatDateToMi(new Date(this.hireInfo.empContract.endDate)).c : ''
        this.fill.expectedProbationEndDate = formatDateToMi(new Date(new Date(this.hireInfo.empContract.startDate).setMonth(new Date(this.hireInfo.empContract.startDate).getMonth() + parseInt(this.hireInfo.empPosition.probationType || 0)))).c
  
        this.fill.employeeName = this.hireInfo.empEmployeeEmpContacts.fullName

        this.hireInfo.familyData.map(row => {
          if (row.isEmergency === 'Y') {
            this.fill.emergencyContact = row.name
            this.fill.emergencyContactPhone = row.primaryPhone
          }
        })

        let arr = this.contractContent.split('#·')
        arr.map((str, idx) => {
          if ((/^\{.*\}$/).test(str)) {
            str = str.split('')
            str.pop()
            str.shift()
            str = str.join('')

            arr[idx] = this.dictEmpMap.indexOf(str) !== -1
            ? (this.dicts[str] && (this.fill[str] ? (this.dicts[str][this.fill[str]] || '') : ''))
            : (this.fill[str] || '')
          }
        })
        this.hireInfo.empContract.contractContent = arr.join('')
        this.fill.contractContent = arr.join('')
      },
      getCompanyName (personnelGroupCode) {
        req('getEmployeeCompany', {personnelGroupCode}).then(res => {
          this.hireInfo.empContract.companyName = res.companyName || ''
        })
      },
      getTemplateList (contractType) {
        let status = {status: 1}

        contractType && (status.contractType = contractType)
        this.templateList = []
        reqc('getContractList', status)
        .then(data => {
          this.templateList = data.data
        })
      },
      getContractContent (templateId) {
        reqc('showTemplate', {templateId})
        .then(data => {
          this.hireInfo.empContract.contractContent = data.templateContent
          this.contractContent = data.templateContent
        })
        .catch(err => console.log(err))
      },
      onFileSuccess (response, file, fileList) {
        this.$message.success('文件上传成功！')
        this.hireInfo.empContract.fileList.push(response)
      },
      onFileError (err, file, fileList) {
        console.log('err', err, file, fileList)
      },
      onFileRemove (file, fileList) {
        this.hireInfo.empContract.fileList.map(id => {
          id === file.response && this.hireInfo.empContract.fileList.splice(this.hireInfo.empContract.fileList.indexOf(id), 1)
        })
      },
      getStartDate (val) {
        val ? this.hireInfo.empContract.startDate = moment(val).format('YYYY-MM-DD') : this.hireInfo.empContract.startDate = ''
        // 根据开始日期，计算结束日期，结束日期为开始日期年数加一
        // var str = (parseInt(val.substring(0, 4)) + 1).toString() + val.substring(4)
        // this.hireInfo.empContract.endDate = str
      },
      test () {
      },
      getEndDate (val) {
        val ? this.hireInfo.empContract.endDate = moment(val).format('YYYY-MM-DD') : this.hireInfo.empContract.endDate = ''
      },

      getDict (dictCode) {
        req('getDistCode', {dictCode})
        .then(res => {
          this.contractTypeList = res
        })
      },
      controlContractPeriod () {
        let limit = this.hireInfo.empContract.contractPeriod
        if (isNaN(limit)) {
          return
        }
        let beginYear = new Date(this.hireInfo.empContract.startDate)
        let finalYear = new Date(beginYear)

        if (this.hireInfo.empContract.yearOrMonth === 'year') {
          finalYear.setFullYear(finalYear.getFullYear() + Number(limit))
          finalYear.setDate(finalYear.getDate() - 1)
        } else {
          finalYear.setMonth(finalYear.getMonth() + Number(limit))
          finalYear.setDate(finalYear.getDate() - 1)
        }
        this.hireInfo.empContract.endDate = finalYear
      },
        // 获取对应用工类型合同类型
      getContractType (val) {
          // 每一次转换进入之前把之前的数组清空
           // 每一次转换进入之前把之前的数组清空
        this.contractListType = []
        req('getDistCode', {dictCode: 'CONTRACT_TYPE'})
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
<style lang="scss" scoped>
  .emp-contract {
    .contract {
      display: flex;
      justify-content: space-between;
      .right {
        width: 90px;
        margin-left: 10px;
        height: 30px;
      }
      .switch {
        width: 160px;
        margin-left: 10px;
        height: 30px;
        line-height: 30px;
      }
    }
    .base {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      .content > * {
        width: 100%;
      }
      & > * {
        flex-basis: 23%;
        padding: 0 1%;
      }
    }
  }
</style>
<style lang="scss">
  .tmm-dialog {
    .el-dialog__headerbtn {
      height: 20px;
      width: 20px;
    }
  }
</style>