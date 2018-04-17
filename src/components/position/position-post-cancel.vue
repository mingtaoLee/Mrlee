<template>
  <div class="content-follow">
    <h2 class="info-title">维护明细</h2>
    <div class="info-content">
      <el-form :model="model" :rules="rules" label-width="150px" label-position="right" ref="cancel" @submit.native.prevent>
        <el-form-item label="选择撤销的职位" v-if="showMap.name" prop="name">
          <el-col :span="8">
            <el-input v-model="model.name" :disabled="disabledMap.name" placeholder="请选择" readonly></el-input>
          </el-col>
          <el-button type="primary" size="mini" @click="isShow=true" v-if="!disabledMap.name">选择</el-button>
          <el-button type="success" size="mini"
            v-if="showMap.repealExport&&employeeNum"
            :disabled="disabledMap.repealExport"
            @click="exportDetails">导出详情</el-button>
        </el-form-item>
        <el-form-item label="包含员工" v-if="showMap.includingStaff">
          <span :class="{'red':employeeNum>0}">{{employeeNum||0}}</span>
          <el-button v-if="showMap.repealEmps&&employeeNum"
              :disabled="disabledMap.repealEmps"
              type="primary" size="mini" class="ml20" @click="massTransfer">批量调动</el-button>
        </el-form-item>
      </el-form>
    </div>

    <position-selection ref="position" v-model="isShow" @change="choosePosition" loaded></position-selection>

  </div>
</template>

<script>
import req from 'api/position/position-post'
import {exportTable} from 'utils'
import PositionSelection from 'components/position/position-selection'

export default {
  name: 'PositionPostCancel',
  components: {
    PositionSelection
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
    const checkPositionCancel = (rule, value, callback) => {
      req('checkIfEmployee', {posPositionId: this.model.posPositionId}).then(data => {
        that.employeeNum = data.employeeNum
        that.employeeIds = data.employeeIds
        if (this.employeeNum > 0) {
          callback(new Error('该职位仍包含员工，不允许撤销'))
        } else {
          callback()
        }
      })
    }
    return {
      isShow: false,
      employeeNum: 0,
      employeeIds: [],
      rules: {
        name: [
          { required: true, message: '请选择职位', trigger: 'change' },
          { validator: checkPositionCancel, trigger: 'change' }
        ]
      }
    }
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
    choosePosition (item) {
      if (!item) return
      this.model.posPositionId = item.posPositionId
      this.model.name = item.name
      this.$emit('limitTime', item.effectiveDate)
    },
    // 导出表格
    exportDetails () {
      let params = {
        id: this.model.posPositionId
      }
      exportTable('/pos/repeal/excel/2', params)
    }
  },

  mounted () {
    if (this.model.name) {
      this.$refs.cancel.validate()
    }
  },

  created () {

  }
}
</script>

<style lang="scss" scoped>

</style>
