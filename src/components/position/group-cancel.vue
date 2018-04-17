<template>
  <div class="content-follow">
      <h2 class="info-title">维护明细</h2>
      <div class="info-content">
        <el-form :model="model"  :rules="rules" label-width="150px" label-position="right" ref="cancel" @submit.native.prevent>
          <el-form-item label="撤销职群" prop="name" v-if="showMap.name">
            <el-col :span="8">
              <el-input v-model.trim="model.name" :disabled="disabledMap.name || isDisabled" :readOnly="readOnly"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="包含职种" v-if="showMap.includingJobKind">
            <span>{{posJobFamilyNum||0}}</span>
          </el-form-item>
          <el-form-item label="包含标准职位" v-if="showMap.includingStandardJob">
            <span>{{posStandardJobNum||0}}</span>
          </el-form-item>
          <el-form-item label="包含员工" v-if="showMap.includingStaff">
            <span :class="{'red':employeeNum>0}">{{employeeNum||0}}</span>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
import req from 'api/position/occupation'

export default {
  name: 'GroupCancel',
  props: {
    model: {
      type: Object
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    var that = this
    const checkGroupCancel = (rule, value, callback) => {
      req('cancelCheckByPeople', {posJobFamilyId: that.model.posJobFamilyId}).then(data => {
        that.posJobFamilyNum = data.posJobFamilyNum
        that.posStandardJobNum = data.posStandardJobNum
        that.employeeNum = data.employeeNum
        if (this.employeeNum > 0) {
          callback(new Error('该职群仍包含员工，不允许撤销'))
        } else {
          callback()
        }
      })
    }
    return {
      isDisabled: true,
      checkCancel: true,
      posJobFamilyNum: 0,
      posStandardJobNum: 0,
      employeeNum: 0,
      rules: {
        name: [
            { validator: checkGroupCancel, trigger: 'change' }
        ]
      }
    }
  },

  methods: {

  },

  mounted () {
    this.$refs.cancel.validate()
  },

  updated () {
    // this.$refs.cancel.validate()
  }
}
</script>

<style lang="scss" scoped>

</style>
