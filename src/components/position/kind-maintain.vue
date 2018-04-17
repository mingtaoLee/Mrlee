<template>
  <div class="content-follow">
      <h2 class="info-title">维护明细</h2>
      <div class="info-content">
        <el-form ref="maintain" :model="model"  :rules="model.operationType==='0'?rules:modifyRules" label-width="150px" label-position="right" @submit.native.prevent>
          <el-form-item v-if="showMap[model.operationType==='0'?'parentName':'chooseName']" :prop="model.operationType==='0'?'parentId':'posJobFamilyId'">
            <span slot="label">{{model.operationType==='0'?'选择所属职群/职种':'选择修改的职群/职种'}}</span>
            <el-col :span="8">
              <i-select-tree
                :lazy="false"
                :search="false"
                :dataKey="model.operationType==='0'?'jobFamilysAvailableWithoutClass':$route.query.hasOwnProperty('processInstanceId')?'jobFamilys':'jobFamilysAvailable'"
                nodeKey="posJobFamilyId"
                v-model="model[model.operationType==='0'?'parentId':'posJobFamilyId']"
                :props="defaultProps"
                :disabled="disabledMap[model.operationType==='0'?'parentName':'chooseName']"
                @change="handleOccupationChange"
                placeholder="请选择"
              ></i-select-tree>
            </el-col>
          </el-form-item>
          <el-form-item prop="name" v-if="showMap.name">
            <span slot="label">{{nameLabel}}</span>
            <el-col :span="8">
              <el-input v-model.trim="model.name" :disabled="disabledMap.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="备注" prop="remark" v-if="showMap.remark">
            <el-col :span="8">
            <el-input type="textarea" v-model.trim="model.remark" :disabled="disabledMap.remark"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
import req from 'api/position/occupation'

export default {
  name: 'KindMaintain',
  props: {
    model: {
      type: Object
    }
  },
  data () {
    const checkJobFamily = (rule, value, callback) => {
      if (!this.model.name || this.disabledMap.name) return callback()
      var data = {
        name: this.model.name,
        parentId: this.model.parentId || -1
      }
      this.model.posJobFamilyId && (data.posJobFamilyId = this.model.posJobFamilyId)
      req('checkOcName', data).then(res => {
        if (res) {
            // 通过验证，可使用名称
          callback({
            successMessage: '该名称可用'
          })
        } else {
          callback(new Error('该名称已被使用'))
        }
      })
    }
    const checkCanNewOrNot = (rule, value, callback) => {
      req('checkCanNewOrNot', {posJobFamilyId: this.model.parentId}).then(res => {
        if (res) {
            // 通过验证，可使用名称
          callback()
        } else {
          callback(new Error('该职种下挂有标准职位，不可新建'))
        }
      })
    }
    return {
      // 名称标签
      nameLabel: '职群名称',
      superOcGroup: '',
      superOcKind: '',
      temName: '',
      disGroupName: true,
      rules: {
        parentId: [{ validator: checkCanNewOrNot, trigger: 'change' }],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' },
          { validator: checkJobFamily, trigger: 'blur' }
        ],
        remark: [{ max: 512, message: '长度不能超过512个字符', trigger: 'blur' }]
      },
      modifyRules: {
        posJobFamilyId: [{type: 'number', required: true, message: '请选择职群/职种', trigger: 'blur'}],
        name: [
          // { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' },
          { validator: checkJobFamily, trigger: 'blur' }
        ],
        remark: [{ max: 512, message: '长度不能超过512个字符', trigger: 'blur' }]
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  methods: {
    // 选择不同的职群职种
    handleOccupationChange (node, normal = true) {
      if (this.model.operationType === '1') {
        this.model.parentId = node.parentId
      }
      this.model.selectedNode = node || {}
      this.controlNameLabel()
      // if (this.model.operationType === '1' && normal) {
      //   this.model.name = this.model.selectedNode.name
      // }
      this.model.name && this.$refs.maintain && this.$refs.maintain.validate()
      // 没有所属职群职种，则不获取限制时间
      if (!node) return this.$emit('limitTime', 0)
      let params = {
        operationType: this.model.operationType,
        parentId: this.model.parentId,
        posJobFamilyId: this.model.posJobFamilyId || this.model.selectedNode.posJobFamilyId
      }
      req('getLimitTime', params).then(data => {
        this.$emit('limitTime', data)
      })
    },
    // 控制显示标签名称
    controlNameLabel () {
      switch (this.model.selectedNode.jobFamilyType) {
        case '0':
          this.nameLabel = this.model.operationType === '0' ? '填写新建的职种名称' : '修改后的职群名称'
          break
        case '1':
          this.nameLabel = this.model.operationType === '0' ? '填写新建的子职种名称' : '修改后的职种名称'
          break
        case '2':
          this.nameLabel = '修改后的子职种名称'
          break
        default:
          this.nameLabel = '填写新建的职群名称'
      }
    }
  },

  updated () {

  },

  mounted () {
    this.handleOccupationChange(this.model.selectedNode, false)
  }
}
</script>

<style lang="scss" scoped>

</style>
