<template>
  <div class="assessment-wrapper">
    <div class="assessment-little-info">
      <div>员工姓名:{{row.employeeName}}</div>
      <div>员工工号:{{row.employeeCode}}</div>
      <div>员工组织:{{row.orgName}}</div>
    </div>
    <div class="assessment-person">
      <div class="assessment-person-header">
        直接上级
      </div>
      <div class="assessment-person-body">
        <div class="person-names">
          <div class="person-name" v-if="assessment.leader">{{assessment.leader.employeeName}}</div>
        </div>
        <div class="person-icon" @click="modifyAssessment(`leader`)">
          <i class="iconfont icon-username font-size-large"></i>
        </div>
      </div>
    </div>
     <div class="assessment-person">
      <div class="assessment-person-header">
        评估人
      </div>
      <div class="assessment-person-body assessment-person-evaluator-body">
        <div class="person-evaluator-names" v-for="(item, index) in assessment.evaluator" 
          :key="index">
          <div class="person-evaluator-name" 
          >{{item.employeeName}}</div>
          <div class="person-evaluator-icon">
            <i class="iconfont icon-username font-size-large person-evaluator-icon" @click="modifyAssessment(`evaluator.${index}`)"></i>  </div>
          </div>
      </div>
    </div>
     <div class="assessment-person" v-if="assessment.isShowCollect === 'Y'">
      <div class="assessment-person-header">
        收集人
      </div>
      <div class="assessment-person-body">
        <div class="person-names">
          <div class="person-name" v-if="assessment.collector">{{assessment.collector.employeeName}}</div>
        </div>
        <div class="person-icon" @click="modifyAssessment(`collector}`)">
          <i class="iconfont icon-username font-size-large"></i>
        </div>
      </div>
    </div>
     <div class="assessment-person" v-if="assessment.isShowCollect === 'Y' ">
      <div class="assessment-person-header">
        收集负责人
      </div>
      <div class="assessment-person-body">
        <div class="person-names">
          <div class="person-name" v-if="assessment.collectLeader">{{assessment.collectLeader.employeeName}}</div>
        </div>
        <div class="person-icon" @click="modifyAssessment(`collectLeader`)">
          <i class="iconfont icon-username font-size-large"></i>
        </div>
      </div>
    </div>
    <div class="assessment-btn-area mt10">
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import req from 'api/performance/plan-manage'
import {clone} from 'utils/index'
export default {

  props: ['row', 'selected'],

  data () {
    return {
      showPersonSelect: false,
      defaultSelectedPersonnel: [],
      cloneData: {}
    }
  },

  methods: {

    getAssessement () {
      req('getAssessment', {planId: this.row.planId}).then(res => {
        this.assessment = res
      })
    },

    dealData (target, source, targetKey) {
      source.leader && (target.leader[targetKey] = source.leader.employeeId)
      source.collector && (target.collector[targetKey] = source.collector.employeeId)
      if (source.collectLeader && source.collectLeader !== null) target.collectLeader[targetKey] = source.collectLeader.employeeId
      for (let i = 0; i < source.evaluator.length; i += 1) {
        target.evaluator[i][targetKey] = source.evaluator[i].employeeId
      }
      // Object.assign(target, source)
    },

    generatePostData () {
      let postData = {
        leader: {},
        collector: {},
        evaluator: [],
        collectLeader: {}
      }
      for (let i = 0; i < this.assessment.evaluator.length; i += 1) {
        postData.evaluator.push({
          preEmpId: '',
          employeeId: ''
        })
      }
      this.dealData(postData, this.cloneData, 'preEmpId')
      this.dealData(postData, this.assessment, 'employeeId')
      return postData
    },

    validateSelect (source, target) {
      let result = false
      if (target.constructor === Object) {
        Object.keys(target).forEach(element => {
          if (element === 'evaluator') {
            target[element].forEach(ele => ele.employeeId === source.employeeId && (result = true))
          } else {
            if (target[element].employeeId === source.employeeId) result = true
          }
        })
      }
      return result
    },

    confirm () {
      let param = this.generatePostData()
      if (this.validateSelect(this.row, param)) {
        this.$message({
          message: '评估人和上级不能选员工自己',
          type: 'warning'
        })
      } else {
        param.planId = this.row.planId
        req('setAssessment', param).then(() => {
          this.$emit('close')
        })
      }
    },

    cancel () {
      this.$emit('close')
    },

    modifyAssessment (val) {
      // this.showPersonSelect = true
      this.$emit('modifyAssessment', val)
    }
  },

  computed: {

    assessment () {
      return this.$store.state.performance.tableAssessment
    }

  },
  created () {
    // this.getAssessement()
    // this.$store.dispatch('PER_EMPLOYEE_ASSESSMENT', this.row.planId)
    req('getAssessment', {planId: this.row.planId}).then(res => {
      !res.evaluator.length && res.evaluator.push({})
      this.cloneData = clone(res)
      this.$store.commit('PER_SET_ASSESSMENT', res)
    })
  },

  components: {
    personSelect: () => import('components/common/i-personnel-select/i-personnel-select.vue')
  }
}
</script>
<style lang="scss" scoped>
.assessment-little-info {
 text-align: left;
}
.assessment-person {
  width: 100%;
  border: 1px solid #ececec;
  margin-top:10px
}
.assessment-person-header {
  height: 20px;
  border-bottom: 1px solid #ececec;
  background-color: #eef1f6;
  padding-left: 10px;
}
.assessment-person-body {
  display: flex;
  padding-left: 10px;
  .person-names {
    width: 50%;
    .person-name {
      margin-bottom: 5px;
    }
  }
}
.person-icon {
  width: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
}
.assessment-person-evaluator-body {
  display: flex;
  flex-wrap: wrap;
}
.person-evaluator-names {
  width: 100%;
  display:flex;
  .person-evaluator-name {
    width: 50%;
  }
  .person-evaluator-icon {
    width: 50%;
    text-align: center;
  }
}
.assessment-btn-area{
  text-align: right;
}
.person-evaluator-icon {
  width: 50%;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
}
</style>
