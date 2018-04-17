<template>
  <main>
    <section class="set-relation">
      <div class="relation-items">
        <div class="set-item">
          <span class="label">直接上级</span><span class="value ml10 font8">{{assessment.leader.employeeName}}</span>
          <i class="iconfont icon-username" @click="handleIconClick('leader')"></i>
        </div>
         <div class="set-item evaluator">
          <span class="label mr10">评估人</span><i class="iconfont icon-username personIcon" @click="handleIconClick('assessmenter')"></i>
          <div v-for="(item, index) in assessment.assessmenter" :key="index" v-if="assessment.assessmenter.length > 0" class="evaluate-area">
            <span class="value ml10 font8">{{item.employeeName}}</span>
            <input type="number" class="percent"  v-model="clone.assessmenter[index].weight" @blur="percentValidate" :min="0" :max="100"></input>%
            <!-- <el-input-number v-model="clone.assessmenter[index].weight" class="percent"></el-input-number>% -->
          </div>
          <span class="validate" v-if="validateFail">评估人权重分配应共为100%</span>
        </div>
         <div class="set-item" v-if="isCollect === 'Y'">
          <span class="label">收集人</span><span class="value ml10 font8">{{assessment.collector.employeeName}}</span>
          <i class="iconfont icon-username" @click="handleIconClick('collector')"></i>
        </div>
         <div class="set-item" v-if="isCollect === 'Y'">
          <span class="label">收集负责人</span><span class="value ml10 font8">{{assessment.collectLeader.employeeName}}</span>
          <i class="iconfont icon-username" @click="handleIconClick('collectLeader')"></i>
        </div>
      </div>
    </section>
    <section class="employee-relation">
      <h4 class="title">员工考核关系</h4>
      <el-table :data="assessmentTable" border  height="300" v-loading="tableLoading" :element-loading-text="$loadingText">
        <el-table-column label="员工" prop='employeeName'></el-table-column>
        <el-table-column label="直接上级">
          <template slot-scope="scope">
            <div v-if="scope.row.leader">{{scope.row.leader.employeeName}}({{scope.row.leader.isHandle | isHandleFormat}})</div>
          </template>
        </el-table-column>
        <el-table-column label="评估人">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.evaluator" :key="index">{{item.employeeName}}({{item.isHandle | isHandleFormat}})</div>
          </template>
        </el-table-column>
        <el-table-column label="收集人" v-if="isCollect === 'Y'">
          <template slot-scope="scope">
            <div v-if="scope.row.collector">{{scope.row.collector.employeeName}}({{scope.row.collector.isHandle | isHandleFormat}})</div>
          </template>
        </el-table-column>
        <el-table-column label="收集负责人" v-if="isCollect === 'Y'">
           <template slot-scope="scope">
            <div v-if="scope.row.collectLeader">{{scope.row.collectLeader.employeeName}}({{scope.row.collectLeader.isHandle | isHandleFormat}})</div>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="btn-area">
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button @click="closeAssessment">取消</el-button>
    </section>
  </main>
</template>
<script>
import request from 'api/performance/plan-manage'
export default {
  name: 'assestment-relations',
  props: {
    selectedEmployees: {
      type: Array,
      required: true
    },
    assessment: {
      type: Object
    },
    period: [String, Number],
    schemeId: [String, Number]
  },
  data () {
    return {
      assessmentTable: [],
      clone: {},
      validateFail: false,
      totalWeight: 0,
      isCollect: '',
      tableLoading: false
    }
  },
  methods: {
    handleIconClick (val) {
      this.$emit('selectPerson', val)
    },
    generateParams () {
      let params = {}
      let arr = []
      for (let i of this.clone.assessmenter) {
        arr.push({ employeeId: i.employeeId, weight: i.weight })
      }
      params.planIds = this.getEmployees()
      params.leader = {
        employeeId: this.clone.leader.employeeId
      }
      if (this.clone.collector) {
        params.collector = {
          employeeId: this.clone.collector.employeeId
        }
      }
      if (this.clone.collectorLeader) {
        params.collectorLeader = {
          employeeId: this.clone.collectorLeader.employeeId
        }
      }
      params.evaluator = arr
      return params
    },
    validateArray (val, arr) {
      if (val && arr instanceof Array) {
        for (let i of arr) {
          if (val.employeeId === i.employeeId) {
            return true
          }
        }
        return false
      }
    },
    validateRelation (source, select) {
      let result
      if (source instanceof Array) {
        for (let i of source) {
          if (select instanceof Array) {
            result = this.validateArray(i, select)
          } else {
            result = i.employeeId === select.employeeId
          }
        }
      } else {
        select instanceof Array ? result = this.validateArray(source, select) : result = source.employeeId === select.employeeId
      }
      return result
    },
    confirm () {
      let params = this.generateParams()
      let wrong = []
      let canGo = true
      Object.keys(params).forEach(ele => {
        ele !== 'planIds' && wrong.push(this.validateRelation(params[ele], this.selectedEmployees))
      })
      wrong.forEach(ele => {
        if (ele === true) {
          canGo = false
        }
      })
      if (canGo === true) {
        params.period = this.period
        params.schemeId = this.schemeId
        if (!this.validateFail) {
          this.$msgbox('确认修改考核关系', '提示').then(() => {
            request('assessmentAdjust', params).then(() => {
              this.$emit('confirm')
            })
          })
        }
      } else {
        this.$message({
          message: '评估人和上级不能选员工自己',
          type: 'warning'
        })
      }
    },
    closeAssessment () {
      this.$emit('close')
    },
    getEmployees (special) {
      // if (!this.selectedEmployees) return
      let arr = []
      if (special) {
        this.selectedEmployees.forEach(person => {
          if (Number(person.planManageStatus) < 3) {
            arr.push(person.planId)
          }
        })
      } else {
        arr = this.selectedEmployees.map(person => person.planId)
      }
      return arr
    },
    getAssessmentTable () {
      let arr = this.getEmployees()
      request('getAllAssessment', arr).then((res) => {
        this.assessmentTable = res.dataList
        this.isCollect = res.isShowCollect
        this.tableLoading = false
      })
    },
    percentValidate () {
      let sum = 0
      for (let i of this.clone.assessmenter) {
        sum += Number(i.weight)
      }
      sum !== 100 ? this.validateFail = true : this.validateFail = false
    }
  },
  watch: {
    assessment (val) {
      if (val.leader.employeeName) this.clone = JSON.stringify(JSON.parse(val))
    }
  },
  filters: {
    isHandleFormat (val) {
      let dict = {
        'Y': '不可更改',
        'N': '可更改'
      }
      return dict[val]
    }
  },
  created () {
    this.tableLoading = true
    this.getAssessmentTable()
    this.clone = this.assessment
  }

}
</script>
<style lang="scss" scoped>
.icon-username {
  cursor: pointer;
}
.relation-items {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-bottom: 20px;
  .set-item {
    width: 50%;
    margin-top: 10px;
  }
}
.employee-relation {
  .title {
    margin-bottom: 10px;
  }
}
.evaluate-area {
  width: 160px;
  margin-bottom: 5px;
  .value {
    width:50px;
    display: inline-block;
  }
}
.btn-area {
  text-align: right;
  margin-top: 20px;
}
.percent {
  width: 50px;
}
.validate {
  color: red;
}
.evaluator {
  position: relative;
}
</style>
