<template>
  <section class="emp-job content-follow">
    <h2 class="info-title">员工录用信息</h2>

    <el-form
      :model="employInfo"
      label-width="120px"
      class="form-main clearfix"
      :rules="rules">
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="姓名"
            v-if="showMap['name']"
            prop="name">
           <el-input
            v-model.trim="employInfo.name"
            :disabled="disabledMap['name'] || isEditWithName"
            @focus="employInfoNameFocusHandler"
            :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="录用公司"
            v-if="showMap['company']"
            prop="company">
           <el-input v-model.trim="employInfo.company" :disabled="disabledMap['company'] || true" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="录用部门"
            v-if="showMap['orgUnitId']"
            prop="orgUnitId">
            <i-select-tree
              v-model="employInfo.orgUnitId"
              dataKey="org"
              nodeKey="orgUnitId"
              :lazy="true"
              :selectedNode.sync="selectedOrgNode"
              @delete="deleteOrgUnitId"
              @node-click='nodeClick'
              :disabled="disabledMap['orgUnitId']"
              :props="orgprops"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="录用岗位"
            v-if="showMap['positionId']"
            prop="positionId">
            <el-select v-model="employInfo.positionName" clearable :disabled="disabledMap['positionId']">
              <el-option
                v-for="(item, idx) in employInfo.posList"
                :key="idx"
                :label="item.name"
                :value="item.posPositionId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="拟入职日期"
            v-if="showMap['entryDate']"
            prop="entryDate">
           <el-date-picker
              v-model="employInfo.entryDate"
              :picker-options="entryDatePickerOpts"
              value-format="yyyy-MM-dd"
              :disabled="disabledMap['entryDate']">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="合同年限"
            v-if="showMap['contractTime']"
            prop="contractTime">
           <el-input v-model.trim="employInfo.contractTime" :disabled="disabledMap['contractTime']">
             <template slot="append">年</template>
           </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="试用期"
            v-if="showMap['probationTime']"
            prop="probationTime">
           <el-input v-model.trim="employInfo.probationTime" :disabled="disabledMap['probationTime']">
             <template slot="append">个月</template>
           </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="聘用方式"
            v-if="showMap['hireType']"
            prop="hireType">
            <i-select
              :filterable="true"
              v-model="employInfo.hireType"
              parameter="HIRE_TYPE"
              :disabled="disabledMap['hireType']"
              placeholder="请选择"></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="用工类型"
            v-if="showMap['empType']"
            prop="empType">
            <i-select
              :filterable="true"
              v-model="employInfo.empType"
              parameter="EMPLOYEE_TYPE"
              :disabled="disabledMap['empType']"
              placeholder="请选择"></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="试用期薪资"
            v-if="showMap['probationPay']"
            prop="probationPay">
           <el-input v-model.trim="employInfo.probationPay"
            class="input-with-select select"
            :disabled="disabledMap['probationPay']"
            size="mini"
            @blur="tipShow"
            >
             <el-select
              v-model="employInfo.probationPayType"
              slot="append"
              :disabled="disabledMap['probationPay']"
             >
              <el-option label="元/时" value="2"></el-option>
              <el-option label="元/月" value="1"></el-option>
            </el-select>
           </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="转正后薪资"
            v-if="showMap['salary']"
            prop="salary"
          >
           <el-input
            v-model.trim="employInfo.salary"
            class="input-with-select select"
            :disabled="disabledMap['salary']"
            size="mini"
            @blur="tipShow"
           >
            <el-select
              v-model="employInfo.salaryType"
              slot="append"
              :disabled="disabledMap['salary']"
             >
               <el-option label="元/时" value="2"></el-option>
               <el-option label="元/月" value="1"></el-option>
            </el-select>
           </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="其他说明"
            v-if="showMap['otherExplain']"
            prop="otherExplain">
           <el-input
            type="textarea"
            v-model.trim="employInfo.otherExplain"
            :disabled="disabledMap['otherExplain']"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 职位选择器 -->
    <position-selection
      type="mini"
      v-model="positionSelectDialogFlag"
      @change="selectPositionConfirm">
    </position-selection>
    <!-- 选择录用者姓名弹窗 -->
    <employ-people-dialog
      :show="peopleDialogFlag"
      @cancel="cancelPeopleDialogHandler"
      @confirm="confirmPeopleDialogHandler"
      ></employ-people-dialog>
  </section>
</template>
<script>
import PositionSelection from 'components/position/position-selection'
import EmployPeopleDialog from './employ-people-dialog/index'
import req from 'api/recruit/matriclated'
export default {
  name: 'EmployInfo',
  components: {
    PositionSelection,
    EmployPeopleDialog
  },
  props: {
    // 录用信息
    employInfo: Object,
    // 名字是否可编辑
    isEditWithName: {
      type: Boolean,
      default: true
    }
  },
  data () {
     // 验证试用期薪资
    const checkProbationWage = (rule, value, callback) => {
      if (value) {
        let regu = /^[1-9]{1}[0-9]{0,6}$|\.[0-9]{2}$/
        if (regu.test(value)) {
          let salary = parseInt(this.employInfo.salary)
          if (parseInt(value) > salary) {
            callback(new Error('试用期薪资应小于或等于转正后薪资'))
          } else {
            callback()
          }
        } else {
          callback(new Error('试用期薪资最大为7位正整数'))
        }
      } else {
        callback(new Error('请输入试用期薪资'))
      }
    }

    // 验证转正后薪资
    const checkFormalWage = (rule, value, callback) => {
      if (value) {
        let regu = /^[1-9]{1}[0-9]{0,6}$|\.[0-9]{2}$/
        if (regu.test(value)) {
          let probationPay = parseInt(this.employInfo.probationPay)
          if (parseInt(value) < probationPay) {
            callback(new Error('转正后薪资应大于或等于试用期薪资'))
          } else {
            callback()
          }
        } else {
          callback(new Error('转正后薪资最大为7位正整数'))
        }
      } else {
        callback(new Error('请输入转正后薪资'))
      }
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
      orgUnitIds: '',
      selectedOrgNode: {},
      // 职位选择器显示
      positionSelectDialogFlag: false,
      // 需求者姓名弹窗
      peopleDialogFlag: false,
      // 规则
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
        company: [{ required: true, message: '请输入录用公司', trigger: 'blur' }],
        department: [{ required: true, message: '请选择录用部门', trigger: 'change' }],
        position: [{ required: true, message: '请选择录用岗位', trigger: 'change' }],
        entryDate: [{ required: true, message: '请选择拟入职日期', trigger: 'change' }],
        contractTime: [{ required: true, validator: (rule, value, callback) => this.checkNum(rule, value, callback, '合同年限'), trigger: 'blur' }],
        probationTime: [{ required: true, validator: (rule, value, callback) => this.checkNum(rule, value, callback, '试用期'), trigger: 'blur' }],
        hireType: [{ required: true, message: '请选择聘用方式', trigger: 'change' }],
        empType: [{ required: true, message: '请选择用工类型', trigger: 'change' }],
        // probationPay: [{ required: true, validator: this.checkProbationWage, trigger: 'blur' }],
        probationPay: [{ required: true, validator: checkProbationWage, trigger: 'blur' }],
        // salary: [{ required: true, validator: this.checkFormalWage, trigger: 'blur' }]
        salary: [{ required: true, validator: checkFormalWage, trigger: 'blur' }]
      },

      entryDatePickerOpts: {                              // 入职日期选择限制
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }

    }
  },
  computed: {
    positionId () {
      return this.employInfo.positionId
    },
    orgUnitId () {
      return this.employInfo.orgUnitId
    },
    company () {
      return this.employInfo.positionId && this.employInfo.selectedPos ? this.employInfo.selectedPos.company : ''
    }
  },
  watch: {
    // 监听组织ID，获取选中的职位信息，否则为职位ID为空，该组织下的职位列表也为空
    orgUnitId (newVal, oldVal) {
      !newVal && (this.employInfo.posList = [])
      if (newVal) {
        req('getPosList', {orgUnitId: newVal, status: '1'}).then(res => {
          res.map(item => { item.name = item.code + ' ' + item.name })
          this.$set(this.employInfo, 'posList', res)
        })
        req('getArea', {id: newVal}).then(res => { this.employInfo.orgs = res })
        req('getCompanyName', {orgUnitId: newVal}).then(res => {
          this.employInfo.company = res.companyName
        })
      }
    },
  // 监听职位ID，根据ID去获取选中的职位信息，否则职务ID为空，职务名字为空，职群名字为空
    positionId (newVal, oldVal) {
      if (newVal) {
        this.employInfo.selectedPos = this.employInfo.posList.find(pos => { return pos.positionId === newVal })
        // let tmp = this.employInfo.posList.find(pos => pos.posPositionId === newVal)
        // tmp.posJobFamilyName && (this.employInfo.company = tmp.posJobFamilyName)
      }
    }
  },
  created () {
    this.$set(this.employInfo, 'posList', this.employInfo.posList || [])
      // 只要不在流程的第一步，就去请求数据
    if (this.$route.query.taskId) {
      // 先去获取默认节点，再根据默认节点去获取人事范围
      this.getOrgNode().then(selectedOrgNode => {
        req('getArea', {id: selectedOrgNode.orgUnitId})
          .then(res => {
            this.employInfo.orgs = res
          })
        req('getPosList', {orgUnitId: selectedOrgNode.orgUnitId, status: '1'})
          .then(res => {
            console.log(res)
            res.map(item => { item.name = item.code + ' ' + item.name })
            this.employInfo.posList = res
          })
      })
    }
    !this.employInfo.probationPayType && (this.employInfo.probationPayType = '1')
    !this.employInfo.salaryType && (this.employInfo.salaryType = '1')
    this.$nextTick(function () {
      !this.disabledMap.salaryType && (document.getElementsByClassName('select')[0].getElementsByClassName('el-input-group__append')[0].style.backgroundColor = '#fff')
      !this.disabledMap.salaryType && (document.getElementsByClassName('select')[1].getElementsByClassName('el-input-group__append')[0].style.backgroundColor = '#fff')
    })
  },
  mounted () {
    // console.log(this.employInfo)
    // if (!this.isFlow) {
    //   this.rules = {}
    // }
  },
  methods: {
    // 获取组织
    getOrgNode () {
      return new Promise(resolve => {
        if (this.employInfo.orgUnitId === '') {
          return false
        }
        req('getOrgUnitName', {orgUnitIds: this.employInfo.orgUnitId})
          .then(res => {
            if (res) {
              this.selectedOrgNode = res[0]
              resolve(this.selectedOrgNode)
            }
          })
          .catch(err => console.log(err))
      })
    },
    // 当组织变化时，需要将职位置空，因为不同的组织职位不同，需要重新选择
    nodeClick ($event, node, sel) {
      // console.log($event, node, sel)
      this.employInfo.orgUnitName = $event.orgPathName
      this.employInfo.positionId = ''
      this.employInfo.company = ''
      this.employInfo.positionName = ''
    },
    // 删除组织id
    deleteOrgUnitId () {
      // this.employInfo.orgUnitName = ''
      this.employInfo.orgUnitId = ''
      // 组织id删除的时候，要删除该组织下面的职位
      this.employInfo.positionId = ''
      this.employInfo.company = ''
      this.employInfo.positionName = ''
    },
    // 提示显示于隐藏
    tipShow () {
      console.log(this.employInfo.probationPay < (this.employInfo.salary * 0.8))
      this.employInfo.probationPay < (this.employInfo.salary * 0.8) ? (this.tip = true) : (this.tip = false)
    },
    // 显示职位弹窗
    showJobHandler () {
      this.positionSelectDialogFlag = true
    },
    // 验证正整数
    checkNum (rule, value, callback, name) {
      if (value) {
        let regu = /^[1-9]\d*$/
        if (regu.test(value)) {
          callback()
        } else {
          callback(new Error(name + '为正整数'))
        }
      } else {
        callback(new Error('请输入' + name))
      }
    },
    // // 验证试用期薪资
    // checkProbationWage (rule, value, callback) {
    //   if (value) {
    //     let regu = /^[1-9]{1}[0-9]{0,6}$|\.[0-9]{2}$/
    //     if (regu.test(value)) {
    //       let salary = parseInt(this.employInfo.salary)
    //       if (parseInt(value) > salary) {
    //         callback(new Error('试用期薪资不能大于转正后薪资'))
    //       } else {
    //         callback()
    //       }
    //     } else {
    //       callback(new Error('试用期薪资最大为7位正整数'))
    //     }
    //   } else {
    //     callback(new Error('请输入试用期薪资'))
    //   }
    // },
    // // 验证转正后薪资
    // checkFormalWage (rule, value, callback) {
    //   if (value) {
    //     let regu = /^[1-9]{1}[0-9]{0,6}$|\.[0-9]{2}$/
    //     if (regu.test(value)) {
    //       let probationPay = parseInt(this.employInfo.probationPay)
    //       if (parseInt(value) < probationPay) {
    //         callback(new Error('转正后薪资不能小于试用期薪资'))
    //       } else {
    //         callback()
    //       }
    //     } else {
    //       callback(new Error('转正后薪资最大为7位正整数'))
    //     }
    //   } else {
    //     callback(new Error('请输入转正后薪资'))
    //   }
    // },
    // 获取录用部门所选node
    departmentNodeClick (selected) {
      this.employInfo.departmentNode = selected
    },
    // 获取职位
    selectPositionConfirm (selected) {
      this.employInfo.position = selected.posPositionId
      this.employInfo.positionName = selected.name
      this.positionSelectDialogFlag = false
    },
    // 显示录用人弹窗
    employInfoNameFocusHandler () {
      this.peopleDialogFlag = true
    },
    // 取消录用人弹窗
    cancelPeopleDialogHandler () {
      this.peopleDialogFlag = false
    },
    // 选择录用人
    confirmPeopleDialogHandler (selected) {
      this.peopleDialogFlag = false
      this.employInfo.name = selected.name
      this.employInfo.rctInterviewId = selected.interviewId
      this.employInfo.department = selected.applyOrgId
      this.employInfo.departmentNode = {
        orgUnitId: selected.applyOrgId,
        orgUnitName: selected.applyOrgName
      }
      this.employInfo.position = selected.applyPositionId
      this.employInfo.positionName = selected.applyPosition
      this.employInfo.empType = selected.empType
    }
  }
}
</script>
<style lang="scss">
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
</style>
<style lang="scss" scoped>
 
</style>


