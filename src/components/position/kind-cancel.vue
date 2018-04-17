<template>
  <div class="content-follow">
      <h2 class="info-title">维护明细</h2>
      <div class="info-content">
        <el-form ref="cancel" :model="model"  :rules="rules" label-width="150px" label-position="right" @submit.native.prevent>
          <el-form-item label="撤销职群/职种" prop="posJobFamilyId" v-if="showMap.name">
            <el-col :span="8">
              <i-select-tree
                :lazy="false"
                :dataKey="$route.query.hasOwnProperty('processInstanceId')?'jobFamilys':'jobFamilysAvailable'"
                nodeKey="posJobFamilyId"
                v-model="model[model.operationType==='0'?'parentId':'posJobFamilyId']"
                :props="defaultProps"
                :disabled="disabledMap.name"
                @change="handleOccupationChange"
                placeholder="请选择"
              ></i-select-tree>
            </el-col>
            <el-button type="success" size="mini"
              v-if="showMap.repealExport&&(posJobFamilyNum||posStandardJobNum||positionNum||employeeNum)"
              :disabled="disabledMap.repealExport"
              @click="exportDetails">导出详情</el-button>
          </el-form-item>
          <el-form-item label="包含职种（子职种）" v-if="showMap.includingJobKind">
            <span>{{posJobFamilyNum||0}}</span>
          </el-form-item>
          <el-form-item label="包含标准职位" v-if="showMap.includingStandardJob">
            <span>{{posStandardJobNum||0}}</span>
          </el-form-item>
          <el-form-item label="包含职位" v-if="showMap.includingPosition">
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
  </div>
</template>

<script>
import req from 'api/position/occupation'
import {exportTable} from 'utils'

export default {
  name: 'KindCancel',
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
    const checkCancel = (rule, value, callback) => {
      if (!this.model.posJobFamilyId) return callback()
      req('cancelCheckByPeople', {posJobFamilyId: that.model.posJobFamilyId}).then(data => {
        that.posJobFamilyNum = data.posJobFamilyNum
        that.posStandardJobNum = data.posStandardJobNum
        that.positionNum = data.positionNum
        that.employeeNum = data.employeeNum
        that.employeeIds = data.employeeIds
        if (this.posJobFamilyNum || this.posStandardJobNum || this.positionNum || this.employeeNum) {
          callback(new Error('该职群/职种仍包括其下属其他内容，不允许撤销'))
        } else {
          callback()
        }
      })
    }
    return {
      isDisabled: true,
      posJobFamilyNum: 0,
      posStandardJobNum: 0,
      positionNum: 0,
      employeeNum: 0,
      employeeIds: [],
      rules: {
        posJobFamilyId: [
            { type: 'number', required: true, message: '请选择职群/职种', trigger: 'change' },
            // { min: 2, message: '长度必须大于两个字符', trigger: 'blur' },
            { validator: checkCancel, trigger: 'change' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  methods: {
    handleOccupationChange (node, validate = true) {
      if (validate && node) {
        this.$refs.cancel && this.$refs.cancel.validate()
      }
      if (!node) {
        this.posJobFamilyNum = 0
        this.posStandardJobNum = 0
        this.positionNum = 0
        this.employeeNum = 0
        return this.$emit('limitTime', 0)
      }
      let params = {
        operationType: this.model.operationType,
        posJobFamilyId: this.model.posJobFamilyId
      }
      req('getLimitTime', params).then(data => {
        this.$emit('limitTime', data)
      })
    },
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
        id: this.model.posJobFamilyId
      }
      exportTable('/pos/repeal/excel/0', params)
    }
  },

  mounted () {
    this.handleOccupationChange(this.model.selectedNode, false)
  }
}
</script>

<style lang="scss" scoped>

</style>
