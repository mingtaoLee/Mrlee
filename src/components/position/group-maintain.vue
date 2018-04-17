<template>
  <div class="content-follow">
      <h2 class="info-title">维护明细</h2>
      <div class="info-content">
        <el-form :model="model" :rules="rules" label-width="150px" label-position="right" ref="maintain" @submit.native.prevent>
          <el-form-item label="职群名称" prop="name" v-if="showMap.name">
            <el-col :span="8">
              <el-input v-model.trim="model.name" :readonly="readOnly" :disabled="disabledMap.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="备注" prop="remark" v-if="showMap.remark">
            <el-col :span="8">
            <el-input type="textarea" v-model.trim="model.remark" :readonly="readOnly" :disabled="disabledMap.remark"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
import req from 'api/position/occupation'

export default {
  name: 'GroupMaintain',
  props: {
    model: {
      type: Object,
      default: {}
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const checkJobFamily = (rule, value, callback) => {
      var data = {
        posJobFamilyId: this.model.posJobFamilyId,
        parentId: this.model.parentId || '-1',
        name: this.model.name
      }
      req('checkOcName', data).then(res => {
        if (res) {
            // 通过验证，可使用名称
          callback({
            successMessage: '该职群名称可用'
          })
        } else {
          callback(new Error('该职群名称已被使用'))
        }
      })
    }
    return {
      rules: {
        name: [
            { required: true, message: '请输入职群名称', trigger: 'blur' },
            { max: 20, message: '长度不能超过20个字符', trigger: 'blur' },
            { validator: checkJobFamily, trigger: 'blur' }
        ],
        remark: [{ max: 512, message: '长度不能超过512个字符', trigger: 'blur' }]
      }
    }
  },

  methods: {

  },

  created () {

  }
}
</script>

<style lang="scss" scoped>

</style>
