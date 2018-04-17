<template>
  <section class="content-follow positionInfo">
    <h2 class="info-title">职位信息</h2>
    <el-form
      :model="positionInfo"
      label-width="120px"
      class="form-main clearfix"
      :rules="rules">
      <el-row>
        <el-col :span="6">
          <el-form-item
            label="需求名"
            v-if="showMap['name']"
            prop="name">
           <el-input v-model.trim="positionInfo.name" :disabled="disabledMap['name']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="申请部门"
            v-if="showMap['applyOrgId']"
            prop="applyOrgId">
           <!-- <i-select-tree
              dataKey="org"
              nodeKey="orgUnitId"
              rootId=""
              v-model="positionInfo.applyOrgId"
              @node-click="departmentNodeClick"
              :readonly="true"
              :disabled="disabledMap['applyOrgId']">
            </i-select-tree> -->
            <i-select-tree
              v-model="positionInfo.applyOrgId"
              dataKey="org"
              nodeKey="orgUnitId"
              :lazy="true"
              :selectedNode.sync="selectedOrgNode"
              @delete="deleteOrgUnitId"
              @node-click='nodeClick'
              :disabled="disabledMap['applyOrgId']"
              :props="orgprops"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="申请职位"
            v-if="showMap['applyPositionId']"
            prop="applyPositionId">
            <!-- <el-input
              v-model.trim="positionInfo.applyPositionName"
              :disabled="disabledMap['applyPositionId']"
              @focus="showJobHandler"></el-input> -->
            <el-select v-model="positionInfo.applyPositionId" clearable :disabled="disabledMap['applyPositionId']">
              <el-option
                v-for="(item, idx) in positionInfo.posList"
                :key="idx"
                :label="item.name"
                :value="item.posPositionId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="汇报对象"
            v-if="showMap['reportManId']"
            prop="reportManId">
           <el-input
            v-model="positionInfo.reportManName"
            @click.native="handleIconClick('reportMan')"
            :disabled="disabledMap['reportManId']" readonly  >
              <i slot="suffix" class="el-icon-menu" v-if="!disabledMap['reportManId']" @click="handleIconClick('reportMan')" ></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="部门对接人"
            prop="relationManId"
            v-if="showMap['relationManId']">
            <el-input
              v-model="positionInfo.relationManName"
              @click.native="handleIconClick('relationMan')"
              :disabled="disabledMap['relationManId']" readonly  >
                <i slot="suffix" class="el-icon-menu" v-if="!disabledMap['relationManId']" @click="handleIconClick('relationMan')" ></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="接收简历邮箱"
            v-if="showMap['receiveEmail']"
            prop="receiveEmail">
             <el-input v-model.trim="positionInfo.receiveEmail" :disabled="disabledMap['receiveEmail']"></el-input>
             <el-card class="box-card" v-if="isShowEmailList" >
              <div v-for="(item,id) in showList" :key="id" @click="chooseName(item)" >
                <p class="text txt">{{item}}</p>
              </div>
          </el-card>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="固定编制"
            prop="fixationNum"
            v-if="showMap['fixationNum']">
           <el-input v-model.trim="positionInfo.fixationNum" :disabled="disabledMap['fixationNum']">
             <template slot="append">人</template>
           </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="现有人数"
            v-if="showMap['existingNum']"
            prop="existingNum">
           <el-input v-model.trim="positionInfo.existingNum" :disabled="disabledMap['existingNum']">
             <template slot="append">人</template>
           </el-input>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col :span="6">
          <el-form-item
            label="拟招人数"
            prop="recruitNum"
            v-if="showMap['recruitNum']">
           <el-input v-model.trim="positionInfo.recruitNum" :disabled="disabledMap['recruitNum']">
             <template slot="append">人</template>
           </el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item
            label="最小薪资"
            prop="floorSalary"
            v-if="showMap['floorSalary']">
           <el-input v-model.trim="positionInfo.floorSalary" :disabled="disabledMap['floorSalary']">
             <template slot="append">元/月</template>
           </el-input>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="6">
          <el-form-item
            label="最大薪资"
            prop="ceilSalary"
            v-if="showMap['ceilSalary']">
           <el-input v-model.trim="positionInfo.ceilSalary" :disabled="disabledMap['ceilSalary']">
             <template slot="append">元/月</template>
           </el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="薪资范围(元)" prop="salaryScope" v-if="showMap['salaryScope']">
            <i-select
              v-model="positionInfo.salaryScope"
              parameter='SALARY_SCOPE'
              placeholder='请选择'
              :disabled="disabledMap['salaryScope']"
            > 
            </i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="工作地点"
            prop="areaId"
            v-if="showMap['areaId']">
           <!-- <el-input v-model.trim="positionInfo.workAddress" :disabled="disabledMap['workAddress']"></el-input> -->
           <i-select-area
            search
            v-model="positionInfo.areaId"
             type="administrativeRegion"
            :disabled="disabledMap['areaId']"
            :placeholder="disabledMap['areaId'] && ''"
            ></i-select-area>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="拟到岗日期"
            prop="planInDate"
            v-if="showMap['planInDate']">
            <el-date-picker
              v-model="positionInfo.planInDate"
              value-format="yyyy-MM-dd"
              :picker-options="planInDatePickerOpts"
              :disabled="disabledMap['planInDate']">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="用工类型"
            prop="empType"
            v-if="showMap['empType']">
            <i-select
            :filterable="true"
            :disabled="disabledMap['empType']"
            v-model="positionInfo.empType"
            parameter="EMPLOYEE_TYPE"
            placeholder="请选择"></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="hasPlatformSupport()">
          <el-form-item
            label="需要平台支持"
            v-if="showMap['isPlatform']"
            prop="isPlatform">
            <i-select
              parameter="WHETHER_TYPE"
              v-model="positionInfo.isPlatform"
              :disabled="disabledMap['isPlatform']" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="办公用品"
            prop="officeSupplies"
            v-if="showMap['officeSupplies']">
           <el-select
              v-model="positionInfo.officeSupplies"
              multiple
              collapse-tags
              size="mini"
              clearable
              placeholder=""
              :disabled="disabledMap['officeSupplies']">
              <el-option
                v-for="item in officeSuppliesList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>
    </el-form>

     <i-personnel-select
        :isShow.sync="isShow"
        @confirm="handleConfirm"
        :multiple="false"
        filterType="newContract"></i-personnel-select>
  </section>
</template>
<script>
import { getDict } from 'utils'
import req from 'api/recruit/matriclated'
export default {
  name: 'DemandInfo',
  props: {
    // 职位信息数据
    positionInfo: Object
  },
  data () {
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
      // 规则
      rules: {
        name: [{ required: true, message: '请输入需求名', trigger: 'blur' }],
        applyOrgId: [{ required: true, message: '请选择申请部门', trigger: 'change' }],
        applyPositionId: [{ required: true, message: '请选择申请职位', trigger: 'change' }],
        reportManId: [{ required: true, message: '请选择汇报对象', trigger: 'change' }],
        relationManId: [{ required: true, message: '请输入用人部门对接人', trigger: 'change' }],
        receiveEmail: [{ required: true, validator: checkEmail, trigger: 'blur' }],
        // fixationNum: [{ required: true, validator: (rule, value, callback) => this.checkNum(rule, value, callback, '固定编制'), trigger: 'blur' }],
        existingNum: [{ required: true, validator: (rule, value, callback) => this.checkNum(rule, value, callback, '现有人数'), trigger: 'blur' }],
        recruitNum: [{ required: true, validator: (rule, value, callback) => this.checkNum1(rule, value, callback, '拟招人数'), trigger: 'blur' }],
        // floorSalary: [{ required: true, validator: this.checkMinSalary, trigger: 'blur' }],
        // ceilSalary: [{ required: true, validator: this.checkMaxSalary, trigger: 'blur' }],
        salaryScope: [{required: true, message: '请选择薪资范围', trigger: 'change'}],
        areaId: [{ required: true, message: '请输入工作地点', trigger: 'blur' }],
        planInDate: [{ required: true, message: '请选择拟到岗日期', trigger: 'change' }],
        empType: [{ required: true, message: '请选择用工类型', trigger: 'change' }],
        isPlatform: [{ required: true, message: '请选择是否需要平台支持', trigger: 'change' }]
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
      emailsorce: ['@sina.com', '@163.com', '@qq.com', '@126.com', '@vip.sina.com', '@sina.cn', '@hotmail.com', '@gmail.com', '@sohu.com', '@yahoo.cn', '@139.com', '@wo.com.cn', '@189.cn'],
      // 人员选择器显示
      isShow: false,
      // 人员选择器类型
      peopleType: '',

      // 办公用品数据
      officeSuppliesList: [],
      planInDatePickerOpts: {                              // 拟到岗时间选择限制
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  computed: {
    applyPositionId () {
      return this.positionInfo.applyPositionId
    },
    applyOrgId () {
      return this.positionInfo.applyOrgId
    }
  },

  watch: {
    // 监听组织ID，获取选中的职位信息，否则为职位ID为空，该组织下的职位列表也为空
    applyOrgId (newVal, oldVal) {
      !newVal && (this.positionInfo.posList = [])
      if (newVal) {
        req('getPosList', {orgUnitId: newVal, status: '1'}).then(res => {
          // res = res.map(item => { item.name = item.code + ' ' + item.name })
          this.$set(this.positionInfo, 'posList', res)
        })
        req('getArea', {id: newVal}).then(res => { this.positionInfo.orgs = res })
        // req('getArea', {id: newVal}).then(res => { this.positionInfo.orgs = res })
        req('getEmpCount', {orgUnitId: newVal}).then(res => {
          console.log(res)
          this.positionInfo.existingNum = res
        })
      }
    },
    applyPositionId (newVal, oldVal) {
      if (newVal) {
        // this.positionInfo.selectedPos = this.employInfo.posList.find(pos => { return pos.positionId === newVal })
      }
    },
     // 邮箱后缀自动显示
    'positionInfo.receiveEmail': {
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
    }
  },
  mounted () {
    // console.log(this.employInfo)
    this.getOfficeList()
  },
  methods: {
    // 当组织变化时，需要将职位置空，因为不同的组织职位不同，需要重新选择
    nodeClick ($event, node, sel) {
      // console.log($event, node, sel)
      this.positionInfo.orgUnitName = $event.orgPathName
      this.positionInfo.applyPositionId = ''
    },
     // 删除组织id
    deleteOrgUnitId () {
      this.positionInfo.orgUnitName = ''
      // 组织id删除的时候，要删除该组织下面的职位
      this.positionInfo.applyPositionId = ''
    },
     // 选择邮箱后缀，拼接
    chooseName (name) {
      if (name) {
        let cc = name.split('@')
        if (this.positionInfo.receiveEmail.indexOf('@') !== -1) {
        // 如果有@把后面的内容代替为选择的
          this.positionInfo.receiveEmail = this.positionInfo.receiveEmail.substring(0, this.positionInfo.receiveEmail.indexOf('@'))
          // console.log( this.hireInfo.empEmployeeEmpContacts.email)
          this.positionInfo.receiveEmail += '@' + cc[1]
        } else {
          this.positionInfo.receiveEmail += '@' + cc[1]
        }
      // console.log(this.hireInfo.empEmployeeEmpContacts.email)
        this.isShowEmailList = false
        this.showList = []
        this.lastName = false
      } else {
        this.isShowEmailList = false
      }
    },
    // 获取办公用品数据
    getOfficeList () {
      getDict('OFFICE_SUPPLIES').then(res => {
        this.officeSuppliesList = Object.assign({}, this.officeSuppliesList, res)
      })
    },
    // 显示people选择器
    handleIconClick (type) {
      this.peopleType = type
      this.isShow = !this.isShow
    },
    // people选择器回调
    handleConfirm (selected) {
      if (this.peopleType === 'reportMan') {
        this.positionInfo.reportManId = selected[0].employeeId
        this.positionInfo.reportManName = selected[0].employeeName
      } else {
        this.positionInfo.relationManId = selected[0].employeeId
        this.positionInfo.relationManName = selected[0].employeeName
      }
    },
    // 获取申请部门所选node
    departmentNodeClick (selected) {
      this.positionInfo.applyOrgNode = selected
    },
    // 显示职位弹窗
    showJobHandler () {
      this.$emit('showJob', 'info')
    },
    // 是否显示平台支持
    hasPlatformSupport () {
      if (this.$route.query.processType === 'rctRequirementProcess4shop') {
        return true
      } else {
        return false
      }
    },
    // 验证正整数
    checkNum (rule, value, callback, name) {
      if (value) {
        let regu = /^[0-9]\d*$/
        if (regu.test(value)) {
          callback()
        } else {
          callback(new Error(name + '为正整数'))
        }
      } else {
        callback(new Error('请输入' + name))
      }
    },
    checkNum1 (rule, value, callback, name) {
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
    }
    // // 验证最小工资
    // checkMinSalary (rule, value, callback) {
    //   if (value) {
    //     let regu = /^[1-9]{1}[0-9]{0,6}$|\.[0-9]{2}$/
    //     if (regu.test(value)) {
    //       let ceilSalary = parseInt(this.positionInfo.ceilSalary)
    //       if (parseInt(value) > ceilSalary) {
    //         callback(new Error('最小薪资不能大于最大薪资'))
    //       } else {
    //         callback()
    //       }
    //     } else {
    //       callback(new Error('最小薪资为7位正整数'))
    //     }
    //   } else {
    //     callback(new Error('请输入最小薪资'))
    //   }
    // },
    // // 验证最大工资
    // checkMaxSalary (rule, value, callback) {
    //   if (value) {
    //     let regu = /^[1-9]{1}[0-9]{0,6}$|\.[0-9]{2}$/
    //     if (regu.test(value)) {
    //       let floorSalary = parseInt(this.positionInfo.floorSalary)
    //       if (parseInt(value) < floorSalary) {
    //         callback(new Error('最大薪资不能小于最小薪资'))
    //       } else {
    //         callback()
    //       }
    //     } else {
    //       callback(new Error('最大薪资为7位正整数'))
    //     }
    //   } else {
    //     callback(new Error('请输入最大薪资'))
    //   }
    // },
    // // 检查邮件格式
    // checkEmail (rule, value, callback) {
    //   if (value) {
    //     let reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
    //     if (reg.test(value)) {
    //       callback()
    //     } else {
    //       callback(new Error('请输入正确的邮箱格式'))
    //     }
    //   } else {
    //     callback(new Error('请输入接收简历邮箱'))
    //   }
    // }
  }
}
</script>
<style lang="scss">
  .positionInfo {
    .el-select__tags {
      height: 20px;
    }
    .el-select__tags {
      position: absolute;
      height: 22px;
      white-space: nowrap;
      overflow: hidden;
      line-height: normal;
      white-space: nowrap;
      z-index: 1;
      top: 18px;
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
    }
    .el-select {
      .el-tag {
        height: 20px;
        line-height: 20px;
        margin: 1px;
      }
    }
    .el-input__inner {
      height: 28px;
    }
    .el-input--mini {
      font-size: 14px;
    }
  }
</style>
