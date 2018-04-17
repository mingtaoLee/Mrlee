<template>
  <section class="emp-job content-follow">
    <h2 class="info-title">岗位信息</h2>

    <el-form :model="jobInfo" label-width="124px" :rules="rules" class="form-main clearfix">

          <el-form-item label="招聘渠道" prop="employeeSource" v-if="showMap.employeeSource">
            <i-select v-model="jobInfo.employeeSource" parameter="EMPLOYEE_SOURCE" :disabled="disabledMap.employeeSource"></i-select>
          </el-form-item>

           <el-form-item label="人事范围" prop="personnelArea" v-if="showMap.personnelArea">
             <remote-select
                v-model="jobInfo.personnelArea"
                dataKey="personnelGroup"
                :props="personnelProps"
                :disabled="disabledMap.personnelArea"
                :displayKeys="personnelGroupLabel"
                @option-click="selectefPersonnelGroup"                      
                :defaultOptions="defaultPersonnelGroupLabel"
                :extraParams="params"
                @change="changePersonnelGrop" 
              ></remote-select>
           </el-form-item>

          <el-form-item label="所属组织" prop="orgUnitId" v-if="showMap.orgUnitId">
            <el-tooltip effect="dark" :content="jobInfo.orgUnitName" placement="top" :disabled="!jobInfo.orgUnitName">
            <i-select-tree
              v-model="jobInfo.orgUnitId"
              dataKey="org"
              nodeKey="orgUnitId"
              :lazy="true"
              :selectedNode.sync="selectedOrgNode"
              @delete="deleteOrgUnitId"
              @node-click='nodeClick'
              :disabled="disabledMap.orgUnitId"
              :props="orgprops"
            />
            <!-- :hasGrant="false" -->
           </el-tooltip>
          </el-form-item> 

          <el-form-item label="职位" prop="posPositionId" v-if="showMap.posPositionId">
            <el-select v-model="jobInfo.posPositionId" clearable :disabled="disabledMap.posPositionId">
              <el-option
                v-for="(item, idx) in jobInfo.posList"
                :key="idx"
                :label="item.name"
                :value="item.posPositionId">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="职群" prop="posJobFamilyName" v-if="showMap.posJobFamilyName">
            <el-input v-model="posJobFamilyName" :disabled="disabledMap.posJobFamilyName || true" placeholder=""></el-input>
          </el-form-item>

          <el-form-item label="职务" prop="posTitleName" v-if="showMap.posTitleName">
            <el-input v-model="posTitleName" :disabled="disabledMap.posTitleName || true" placeholder=""></el-input>
          </el-form-item>

          <el-form-item label="技工等级" v-if="showMap.artisanLevel">
            <i-select
              filterable
              v-model="jobInfo.artisanLevel"
              parameter="ARTISAN_LEVEL"
              :disabled="disabledMap.artisanLevel"
              :placeholder="disabledMap.artisanLevel && ''"></i-select>
          </el-form-item>

          <el-form-item label="用工类型" prop="employeeType" v-if="showMap.employeeType">
            <i-select
            v-model="jobInfo.employeeType"
            parameter="EMPLOYEE_TYPE"
            @change="controlEmployeeType"
            :disabled="disabledMap.employeeType || !posTitleName || isSelectedEmployeeType"
            ref="employeeType"
            ></i-select>
          </el-form-item>

          <el-form-item label="薪资组" prop="newSalaryAccounting" v-if="showMap.newSalaryAccounting">
               <remote-select
                v-model="jobInfo.newSalaryAccounting"
                dataKey="allSalaryGroup"
                :props="groupProps"
                :disabled="disabledMap.newSalaryAccounting || !jobInfo.personnelArea"
                :defaultOptions="defaultPayGroup"
                @option-click="selectefGroup"
                :extraParams="{personnelGroupCode: jobInfo.personnelArea || ''}"
                @change="changeSalaryGrop"
              ></remote-select>
          </el-form-item>

          <el-form-item label="工作制" prop="workSystem" v-if="showMap.workSystem">
            <i-select v-model="jobInfo.workSystem" parameter="WORK_SYSTEM" :disabled="disabledMap.workSystem"></i-select>
          </el-form-item>

          <el-form-item label="员工税类型" prop="revenueType" v-if="showMap.revenueType">
            <i-select v-model="jobInfo.revenueType" parameter="REVENUE_TYPE" :disabled="disabledMap.revenueType"></i-select>
          </el-form-item>

          <el-form-item label="入职日期" prop="hireDate" v-if="showMap.hireDate">
            <el-date-picker 
              type="date" 
              v-model="jobInfo.hireDate"
              :picker-options="hireOptions"
              @change="getSTime"
              style="width: 100%;"
              :disabled="disabledMap.hireDate">
              </el-date-picker>
          </el-form-item>
   
          <el-form-item label="转正前薪资" prop="probationSalary" v-if="showMap.probationSalary">
           <el-input v-model="jobInfo.probationSalary" class="input-with-select select" :disabled="disabledMap.probationSalary" size="mini" @blur="tipShow" maxlength="10">
             <el-select v-model="jobInfo.probationSalaryType" slot="append" :disabled="disabledMap.probationSalary">
               <el-option label="元/时" value="2"></el-option>
               <el-option label="元/月" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="转正后薪资" prop="expectedRegularSalary" v-if="showMap.expectedRegularSalary">
             <el-input v-model="jobInfo.expectedRegularSalary" class="input-with-select select" :disabled="disabledMap.expectedRegularSalary" size="mini" @blur="tipShow" maxlength="10">
             <el-select v-model="jobInfo.expectedRegularSalaryType" slot="append" :disabled="disabledMap.expectedRegularSalary">
               <el-option label="元/时" value="2"></el-option>
               <el-option label="元/月" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="是否随时效浮动" prop="newIsAgingFloat" v-if="showMap.newIsAgingFloat">
            <i-select v-model="jobInfo.newIsAgingFloat" parameter="WHETHER_TYPE" :disabled="disabledMap.newIsAgingFloat"></i-select>
          </el-form-item>

          <el-form-item label="户口等级" prop="domicileGrade"  v-if="showMap.domicileGrade && jobInfo.isShowDomicileGrade">
            <i-select
            parameter="DOMICILE_LEVE"
            v-model="jobInfo.domicileGrade"
            :disabled="disabledMap.domicileGrade"
            ></i-select>
          </el-form-item>

          <!-- <el-form-item label="办公地点" v-if="showMap.workAddress">
            <i-select-area
              search
              v-model="jobInfo.workAddress"
               type="yonghui"
              :disabled="disabledMap.workAddress"
              :placeholder="disabledMap.workAddress && ''"
              ></i-select-area>
          </el-form-item> -->
    </el-form>
    <p v-if="tip" class="flagtip">为规避法律风险，转正前薪资不得低于转正后薪资的80%</p>
  </section>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select'
  import req from 'api/employee/personal'
  import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
  import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import RemoteSelect from 'components/compensation/remote-select'

  export default {
    components: {
      ISelect,
      ISelectTree,
      IPersonnelSelect,
      RemoteSelect
    },
    props: {
      jobInfo: Object,
      hireInfo: Object,
      code: String

    },
    data () {
      const validateMoney = (rule, value, cb) => {
        // console.log(rule, value)
        // rule.field === 'probationSalary' && !this.jobInfo.probationSalaryType && cb(new Error('薪资单位不能为空'))
        // rule.field === 'expectedRegularSalary' && !this.jobInfo.expectedRegularSalary && cb(new Error('薪资单位不能为空'))
        let isNum = /^(([0]{1}\.[0-9]*[0-9]+)|([1-9]+\.[0-9]*[1-9][0-9]*)|([1-9]+[0-9]*\.[0-9]+)|([1-9]+[0-9]*)|([0]{1}))$/
        let IsOnlyTwo = /^(([0]{1}\.[0-9]{0,2})|([1-9]+\.[0-9]{1,2})|([1-9]+[0-9]*\.[0-9]{1,2})|([1-9]+[0-9]*)|([0]{1}))$/
        !value && cb(new Error('薪资不能为空'))

        if (isNum.exec(value)) {
          if (IsOnlyTwo.exec(value)) {
            cb()
          } else {
            cb(new Error('薪资最多保留两位小数'))
          }
        } else {
          cb(new Error('请输入正确的数字!'))
        }
      }
      const validateOrg = (rule, value, cb) => {
        !value && cb(new Error('组织不能为空'))
        cb()
      }
      let checkDate = (rule, value, cb) => {
        !value && cb(new Error('请选择日期'))
        cb()
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
          }},
             // 薪资组选择器配置
        groupProps: {value: 'groupId', label: 'groupName'},
        defaultGroupLabel: ['groupName'],
          // 人事范围选择器配置
        personnelGroupLabel: ['personnelGroupCode', 'personnelGroupName'],
        personnelProps: {value: 'personnelGroupCode', label: 'personnelGroupName'},
        params: {'hasPower': 'Y', 'usable': 'Y'},
        salparams: {'hasPower': 'Y'},
        tip: false,
        visible: {
          show: false
        },
        rules: {
          employeeSource: [
            { required: true, message: '请选择招聘渠道', trigger: 'change' }
          ],
          orgUnitId: [
            { required: true, validator: validateOrg, trigger: 'change' }
          ],
          posTitleId: [
            { required: true, message: '请选择职务', trigger: 'blur' }
          ],
          posPositionId: [
            { required: true, message: '请选择职位', trigger: 'change' }
          ],
          domicileGrade: [{ required: true, message: '户口等级不能为空', trigger: 'change' }],

          //  技工等级可以不填
          // artisanLevel: [
          //   { required: true, message: '请选择技工等级', trigger: 'change' }
          // ],
          employeeType: [
            { required: true, message: '请选择用工类型', trigger: 'change' }
          ],
          // TODO:人事范围，薪资组字段添加
          personnelArea: [
            { required: true, message: '请选择人事范围', trigger: 'change' }
          ],
          newSalaryAccounting: [
            { required: true, message: '请选择薪资组', trigger: 'change' }
          ],
          newIsAgingFloat: [
            { required: true, message: '请选择是否浮动', trigger: 'change' }
          ],
          workSystem: [
            { required: true, message: '请选择工作制', trigger: 'change' }
          ],
          revenueType: [
            { required: true, message: '请选择员工税类型', trigger: 'change' }
          ],
          hireDate: [
            { required: true, validator: checkDate, trigger: 'change' }
          ],
          probationSalary: [
            { required: true, validator: validateMoney, trigger: 'blur' }
          ],
          expectedRegularSalary: [
            { required: true, validator: validateMoney, trigger: 'blur' }
          ]
        },
        isReturn: false,
        defaultPeoPle: [],
        orgUnitIds: '', // 没用，删了
        selectedOrgNode: {},
        // 薪资组列表
        salaryList: [],
        // 可用人事范围列表
        personnelGroupList: [],
        // 入职时间最早于当前月1号，可以选择一号
        hireOptions: {
          disabledDate: (time) => {
            // let day = new Date()
            // day = day.setFullYear(day.getFullYear(), day.getMonth(), 0)
            if (this.jobInfo.dimissionDate) {
              return time.getTime() < new Date(this.hireInfo.empEmployeeEmpContacts.birthDate).getTime() || time.getTime() <= this.jobInfo.dimissionDate
            } else {
              return time.getTime() < new Date(this.hireInfo.empEmployeeEmpContacts.birthDate).getTime()
            }
          }
        },
        posTitleName: '',
        posJobFamilyName: '',
        isSelectedEmployeeType: false
      }
    },
    computed: {
      // // 职务名称，职位ID为空，则为空
      // posTitleName () {
      //   console.log('posTitleName')
      //   !this.jobInfo.posPositionId && (this.jobInfo.posTitleId = '')
      //   return this.jobInfo.posPositionId && this.jobInfo.selectedPos ? this.jobInfo.selectedPos.posTitleName : ''
      // },
      // // 职群名称，职位ID为空，则为空
      // posJobFamilyName () {
      //   return this.jobInfo.posPositionId && this.jobInfo.selectedPos ? this.jobInfo.selectedPos.posJobFamilyName : ''
      // },
      personnelArea () {
        return this.jobInfo.personnelArea
      },
      orgUnitId () {
        return this.jobInfo.orgUnitId
      },
      posPositionId () {
        return this.jobInfo.posPositionId
      },
      employeeType () {
        return this.jobInfo.employeeType
      },
      defaultPayGroup: function () {
        let any = []
        let data = {}
        data.groupId = this.jobInfo.newSalaryAccounting
        data.groupName = this.jobInfo.newSalaryAccountingName
        any.push(data)
        return any
      },
      defaultPersonnelGroupLabel: function () {
        let any = []
        let data = {}
        data.personnelGroupCode = this.jobInfo.personnelArea
        data.personnelGroupName = this.jobInfo.personnelAreaName
        any.push(data)
        return (this.jobInfo.personnelArea ? any : [])
      }
    },
    watch: {
      'jobInfo.probationSalaryType' (newVal, oldVal) {
        this.jobInfo.expectedRegularSalaryType = newVal
      },
      'jobInfo.expectedRegularSalaryType' (newVal, oldVal) {
        this.jobInfo.probationSalaryType = newVal
      },
      // 监听组织ID，获取选中的职位信息，否则为职位ID为空，该组织下的职位列表也为空
      orgUnitId (newVal, oldVal) {
        !newVal && (this.jobInfo.posList = [])
        if (newVal) {
          req('getPosList', {orgUnitId: newVal, status: '1'}).then(res => {
            res.map(item => { item.name = item.code + ' ' + item.name })
            this.$set(this.jobInfo, 'posList', res)
          })
          req('getArea', {id: newVal}).then(res => { this.jobInfo.orgs = res })
          req('getCluster', {orgUnitId: newVal}).then(res => { this.jobInfo.empCluster = res })
          newVal && (this.jobInfo.isGetAgain = true)
        }
      },
      // 监听职位ID，根据ID去获取选中的职位信息，否则职务ID为空，职务名字为空，职群名字为空
      'posPositionId': {
        immediate: true,
        handler (newVal, oldVal) {
          if (newVal) {
            if (this.jobInfo.posList) {
              this.resultSelectedPos(newVal)
            }
          } else {
            this.posTitleName = ''
            this.posJobFamilyName = ''
          }
        }
      },
      'jobInfo.posList' (newVal, oldVal) {
        if (newVal) {
          this.resultSelectedPos(this.jobInfo.posPositionId)
        }
      },
      personnelArea (newVal, oldVal) {
        this.jobInfo.newSalaryAccounting = ''
        newVal && (this.jobInfo.isGetAgain = true)
        // 是否显示户口等级
        newVal && this.jobInfo.employeeType && this.getDomicileGrade(this.jobInfo.employeeType, newVal)
      },

      posTitleName (newVal, oldVal) {
        if (newVal) {
          this.jobInfo.posTitleId = this.jobInfo.selectedPos.posTitleId
          req('checkIsSurety', {posTitleId: this.jobInfo.selectedPos.posTitleId}).then(res => { this.jobInfo.isSurety = res })
        } else {
          this.jobInfo.isSurety = false
        }
        // 用工类型选择调整.根据职务名称包含 的关键字，决定则用工类型必须选择项
        if (newVal.includes('小时工')) {
          this.jobInfo.employeeType = '3'
          this.isSelectedEmployeeType = true
        } else if (newVal.includes('实习生')) {
          this.jobInfo.employeeType = '4'
          this.isSelectedEmployeeType = true
        } else {
          this.isSelectedEmployeeType = false
          this.jobInfo.employeeType = ''
          this.$refs['employeeType'].setDisabled('3', 'disabled')
          this.$refs['employeeType'].setDisabled('4', 'disabled')
        }
      },
      //  监听员工类型，如果是正式员工并且是第一集群，则试用期默认为6个月
      employeeType (newVal, oldVal) {
        newVal && (this.jobInfo.isGetAgain = true)
        if (this.code !== '3') {
          this.hireInfo.empPosition.probationType = newVal === '1' ? '6' : ''
        }
        // 是否显示户口等级
        newVal && this.jobInfo.personnelArea && this.getDomicileGrade(newVal, this.jobInfo.personnelArea)
      }
      // //  监听集群，如果集群不为1，试用期清空
      // 'jobInfo.empCluster' (newVal, oldVal) {
      //   newVal !== 1 && this.$route.query.taskKey === 'suretyCheckSupplement' && (this.jobInfo.probationType = '')
      // }
    },
    created () {
      this.$set(this.jobInfo, 'posList', this.jobInfo.posList || [])
      // 只要不在流程的第一步，就去请求数据
      if (this.$route.query.employeeId) {
        // 先去获取默认节点，再根据默认节点去获取人事范围
        this.getOrgNode().then(selectedOrgNode => {
          req('getArea', {id: selectedOrgNode.orgUnitId})
            .then(res => {
              this.jobInfo.orgs = res
            })
          req('getPosList', {orgUnitId: selectedOrgNode.orgUnitId, status: '1'})
            .then(res => {
              res.map(item => { item.name = item.code + ' ' + item.name })
              this.jobInfo.posList = res
            })
        })
      }
      !this.jobInfo.expectedRegularSalaryType && (this.jobInfo.expectedRegularSalaryType = '1')
      !this.jobInfo.probationSalaryType && (this.jobInfo.probationSalaryType = '1')
      this.$nextTick(function () {
        !this.disabledMap.expectedRegularSalary && (document.getElementsByClassName('select')[0].getElementsByClassName('el-input-group__append')[0].style.backgroundColor = '#fff')
        !this.disabledMap.expectedRegularSalary && (document.getElementsByClassName('select')[1].getElementsByClassName('el-input-group__append')[0].style.backgroundColor = '#fff')
      })
    },
    mounted () {
      this.$nextTick(function () {
        document.getElementsByClassName('popper__arrow')[0].attr('style', '')
      })
    },
    methods: {
      getDomicileGrade (employeeType, personnelArea) {
        req('getDomicileGrade', {employeeType: employeeType, personnelGroupCode: personnelArea})
        .then(res => {
          console.log(res)
          // this.jobInfo.isShowDomicileGrade = res
          this.$set(this.jobInfo, 'isShowDomicileGrade', res)
        })
      },
      selectefGroup (sel) {
        this.jobInfo.newSalaryAccountingName = sel.groupName
      },
      selectefPersonnelGroup (sel) {
        this.jobInfo.personnelAreaName = sel.personnelGroupName
      },
      changePersonnelGrop (val) {
        this.jobInfo.newSalaryAccountingName = ''
        this.jobInfo.newSalaryAccounting = ''
      },
      changeSalaryGrop (val) {
        if (!val) {
          this.jobInfo.newSalaryAccountingName = ''
          this.jobInfo.newSalaryAccounting = ''
        }
      },
      // 控制人员选择器的显示隐藏
      clickPeople () {
        this.$refs.per.resetData()

        this.defaultPeoPle = []

        let employeeName = this.jobInfo.parentEmployeeName || ''
        let employeeId = this.jobInfo.parentEmployeeId || ''

        this.defaultPeoPle.push({employeeName, employeeId})

        this.visible.show = !this.visible.show
      },
      // 人员选择器选中人员
      handleConfirm (selected) {
        this.jobInfo.parentEmployeeName = selected[0] ? selected[0].employeeName : ''
        this.jobInfo.parentEmployeeId = selected[0] ? selected[0].employeeId : ''
      },
      // 提示显示于隐藏
      tipShow () {
        console.log(this.jobInfo.probationSalary < (this.jobInfo.expectedRegularSalary * 0.8))
        this.jobInfo.probationSalary < (this.jobInfo.expectedRegularSalary * 0.8) ? (this.tip = true) : (this.tip = false)
      },
      // 日期选择器赋值
      getSTime (val) {
        this.jobInfo.hireDate = val
      },
      // 当组织变化时，需要将职位置空，因为不同的组织职位不同，需要重新选择
      nodeClick ($event, node, sel) {
        // console.log($event, node, sel)
        this.jobInfo.orgUnitName = $event.orgPathName
        this.jobInfo.posPositionId = ''
      },
      // 获取组织
      getOrgNode () {
        return new Promise(resolve => {
          if (this.jobInfo.orgUnitId === '') {
            return false
          }
          req('getOrgUnitName', {orgUnitIds: this.jobInfo.orgUnitId})
            .then(res => {
              if (res) {
                this.selectedOrgNode = res[0]
                resolve(this.selectedOrgNode)
              }
            })
            .catch(err => console.log(err))
        })
      },
      // 删除组织id
      deleteOrgUnitId () {
        this.jobInfo.orgUnitName = ''
        // 组织id删除的时候，要删除该组织下面的职位
        this.jobInfo.posPositionId = ''
      },
      // 用工类型变化
      controlEmployeeType (val) {
        // todo:这里由字典确定的状态码
        let shortWorkers = ['3', '4', '5']
        if (shortWorkers.includes(val)) {
          this.$emit('shortWorkersChosed')
        }
      },

      resultSelectedPos (val) {
        this.jobInfo.selectedPos = this.jobInfo.posList.find(pos => { return pos.posPositionId === val }) || { posJobFamilyName: '', posTitleName: '' }
        this.posTitleName = this.jobInfo.selectedPos.posTitleName
        this.posJobFamilyName = this.jobInfo.selectedPos.posJobFamilyName
      }
          // 获取可用人事范围
      // getPersonnelGroup () {
      //   req('getPersonnelGroup')
      //    .then(res => {
      //      if (!res) {
      //        return false
      //      }
      //      res.map(item => {
      //       //  可用人事范围拼接，label:code +name,value:code
      //        let group = {}
      //        group.label = `${item.personnelGroupCode} ${item.personnelGroupName}`
      //        group.value = item.personnelGroupCode
      //        this.personnelGroupList.push(group)
      //       //  可用公司
      //       //  let company = {}
      //       //  company.label = item.companyName
      //       //  company.value = item.companyCode
      //       //  this.companyList.push(company)
      //      })
      //     //  保存可用人事列表，用作改变人事范围带出公司
      //     //  Object.assign(this.companyList, res)
      //    })
      // },
      //   // 获取薪资组列表
      // getSarayList (personnelGroupCode) {
      //   req('getSalary', { personnelGroupCode })
      //   .then(res => {
      //     this.salaryList = res
      //   })
      // }
    }
  
  }
</script>
<style lang="scss" >
  .emp-job {
    .el-radio__label {
      padding-left: 6px;
    }
   .input-with-select .el-input-group__append {
    padding: 0px;
   }
   .el-input-group__append {
     .el-input {
       width:80px;
       height: 26px;
     }
   }
   .el-input-group__append .el-select, .el-input-group__append .el-button, .el-input-group__prepend .el-select, .el-input-group__prepend .el-button{
     margin:0px;
   }
  }
  // .popper__arrow {
  //   //  left: 100% !important;
  //  }
  // .popper__arrow:nth-of-type(1) {
  //    left: 40px !important;
  //  }
</style>
<style lang="scss" scoped>
  .emp-job {
    position: relative;
    .form-main {
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
    .flagtip {
      position: absolute;
      color: #ff4949;
      font-size: 12px;
      line-height: 1;
      bottom: 0;
      text-align: center;
      width: 100%;
    }
  }
</style>


