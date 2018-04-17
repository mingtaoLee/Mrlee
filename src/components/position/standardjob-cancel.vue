<template>
  <div class="content-follow">
    <h2 class="info-title">维护明细</h2>
    <div class="info-content">
      <el-form :model="model" :rules="rules" label-width="150px" label-position="right" ref="cancel" @submit.native.prevent>
        <!-- <el-form-item label="撤销的标准职位名称" prop="name" v-if="showMap.name">
          <el-col :span="8">
            <el-input v-model.trim="model.name" :disabled="disabledMap.name || !overWritten"></el-input>
          </el-col>
          <el-button type="success" size="mini"
            v-if="showMap.repealExport&&(positionNum||employeeNum)"
            :disabled="disabledMap.repealExport"
            @click="exportDetails">导出详情</el-button>
        </el-form-item> -->
        <el-form-item label="选择撤销的标准职位" prop="name" v-if="showMap.name">
          <el-row>
            <el-col :span="8">
              <el-input v-model.trim="model.name" :disabled="disabledMap.name" placeholder="请选择" readonly></el-input>
            </el-col>
            <el-button type="primary" size="mini" @click="chooseStandardJob" v-if="!disabledMap.name">选择</el-button>
            <el-button type="success" size="mini"
              v-if="showMap.repealExport&&(positionNum||employeeNum)"
              :disabled="disabledMap.repealExport"
              @click="exportDetails">导出详情</el-button>
          </el-row>
        </el-form-item>
        <el-form-item label="包含职位" v-if="showMap.includingJob">
          <span>{{positionNum||0}}</span>
        </el-form-item>
        <el-form-item label="包含员工" v-if="showMap.includingStaff">
          <span :class="{'red':employeeNum>0}">{{employeeNum||0}}</span>
          <el-button v-if="showMap.repealEmps&&employeeNum"
              :disabled="disabledMap.repealEmps"
              type="primary" size="mini" class="ml20" @click="massTransfer">批量调动</el-button>
        </el-form-item>
      </el-form>
    </div>

    <standardjob-chosen ref="showStandardJob" @confirm="choosePosStandardJob"></standardjob-chosen>

  </div>
</template>

<script>
import req from 'api/position/standard-oc'
import {exportTable} from 'utils'
import StandardjobChosen from './standardjob-chosen'

export default {
  name: 'StandardjobCancel',
  components: {
    StandardjobChosen
  },
  props: {
    model: {
      type: Object
    },
    overWritten: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var that = this
    const checkStandardJobCancel = (rule, value, callback) => {
      req('getPeopleDetails', { posStandardJobId: this.model.posStandardJobId }).then(data => {
        that.positionNum = data.positionNum
        that.employeeNum = data.employeeNum
        that.employeeIds = data.employeeIds
        if (this.employeeNum || this.positionNum) {
          callback(new Error('该标准职位仍包含职位或员工，不允许撤销'))
        } else {
          callback()
        }
      })
    }
    return {
      positionNum: 0,
      employeeNum: 0,
      employeeIds: [],
      rules: {
        name: [
          { required: true, message: '请选择标准职位', trigger: 'change' },
          { validator: checkStandardJobCancel, trigger: 'change' }
        ]
      }
    }
  },

  mounted () {
    if (this.model.name) {
      this.$refs.cancel.validate()
    }
    this.controlLimitTime()
  },

  methods: {
    // 批量调动
    massTransfer () {
      if (this.employeeNum > 20) {
        return this.$message('调动人数过多，请到人事管理模块进行操作！')
      }
      let statusStr = JSON.stringify(this.employeeIds)
      window.open(`/flow.html#/flow/new_employee_multi_movement?processType=4&empEmployeeId=${statusStr}`)
    },
    // 导出表格
    exportDetails () {
      let params = {
        id: this.model.posStandardJobId
      }
      exportTable('/pos/repeal/excel/1', params)
    },
    chooseStandardJob () {
      this.$refs.showStandardJob.showDetails = true
    },
    choosePosStandardJob (id, name) {
      this.model.name = name
      this.model.posStandardJobId = id
      this.controlLimitTime()
    },
    // 获取并向上发出限制时间
    controlLimitTime () {
      let params = {
        operationType: this.model.operationType,
        posStandardJobId: this.model.posStandardJobId
      }
      req('getLimitTime', params).then(data => {
        this.$emit('limitTime', data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
