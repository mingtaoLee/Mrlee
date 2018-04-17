<template>
  <div class="content-follow">
    <h2 class="info-title">标准职位信息</h2>
    <div class="info-content">
      <el-form
        :model="model"
        :rules="rules"
        label-width="150px"
        label-position="right"
        @submit.native.prevent
      >
        <el-form-item v-if="showMap.posJobFamilyId" prop="posJobFamilyId" label="所属职种/子职种">
          <el-col :span="8">
            <i-select-tree
              v-if="model.operationType==='0'"
              v-model="model.posJobFamilyId"
              :lazy="false"
              :search="false"
              :props="defaultProps"
              :disabled="disabledMap.posJobFamilyId"
              dataKey="jobFamilysAvailable"
              nodeKey="posJobFamilyId"
              placeholder="请选择"
              @change="handleOccupationChange"
            ></i-select-tree>
          </el-col>
        </el-form-item>
        <el-form-item v-if="showMap.name && model.operationType==='1'" prop="name" label="选择修改的标准职位">
          <el-row>
            <el-col :span="8">
              <el-input
                v-model.trim="model.name"
                :disabled="disabledMap.name"
                icon="close"
                placeholder="请选择"
                readonly
                @click="clearPosStandardJob"
              ></el-input>
            </el-col>
            <el-col :span="1">
              <el-button v-if="!disabledMap.name" type="primary" size="mini" @click="chooseStandardJob">选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="showMap.posTitleName && model.operationType=='0'" prop="posTitleId" label="职务">
          <el-col :span="8">
            <el-select filterable v-model="model.posTitleId" placeholder="" clearable @change="changeTitle" :disabled="disabledMap.posTitleName">
              <el-option v-for="item in titleList" :disabled="item.status === '2'" :key="item.posTitleId" filterable :label="item.name" :value="item.posTitleId">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form :model="model" :rules="rules" label-width="150px" label-position="right" ref="standardOc">
          <el-form-item label="标准职位名称" prop="name" v-if="showMap.name && model.operationType==='0'">
            <el-col :span="8">
              <el-input v-model.trim="model.name" :disabled="disabledMap.name||true"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <!-- <el-form-item label="品类" v-if="showMap.posCategoryName">
          <el-col :span="8">
            <el-select filterable v-model="model.posCategoryIds" multiple placeholder="" :disabled="disabledMap.posCategoryName">
              <el-option v-for="item in categoryList" :disabled="item.status === '2'" :key="item.posCategoryId" :label="item.name" :value="item.posCategoryId">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item> -->
        <el-form-item label="备注" prop="remark" v-if="showMap.remark">
          <el-col :span="8">
            <el-input type="textarea" v-model="model.remark" :disabled="disabledMap.remark"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </div>

    <standardjob-chosen ref="showStandardJob" @confirm="choosePosStandardJob"></standardjob-chosen>

  </div>
</template>

<script>
import req from 'api/position/standard-oc'
import StandardjobChosen from './standardjob-chosen'

export default {
  name: 'standardJobMaintain',
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
    },
    titleList: {
      type: Array,
      default: []
    }
    // categoryList: {
    //   type: Array,
    //   default: []
    // }
  },
  data () {
    const checkName = (rule, value, callback) => {
      if (this.model.operationType !== '0' || !this.model.name) return callback()
      var data = {
        posJobFamilyId: this.model.posJobFamilyId,
        name: this.model.name
      }
      if (this.model.posStandardJobId && this.model.posStandardJobId !== '') {
        Object.assign(data, {posStandardJobId: this.model.posStandardJobId})
      }
      req('checkStandardJobName', data).then(res => {
        if (res) {
            // 通过验证，可使用名称
          callback({
            successMessage: '该标准职位名称可用'
          })
        } else {
          callback(new Error('该标准职位名称已被使用'))
        }
      })
    }
    return {
      warning: false,
      info: false,
      rules: {
        name: [
          // { required: true, message: '请选择职位名称', trigger: 'blur' },
          // { max: 20, message: '长度不能超过20个字符', trigger: 'blur' },
          { validator: checkName, trigger: 'change' }
        ],
        effectiveDate: [{ type: 'date', required: true, message: '请输入生效日期', trigger: 'blur' }],
        posTitleId: [{ required: true, message: '请输入职务名称', trigger: 'change' }],
        remark: [{ max: 512, message: '长度不能超过512个字符', trigger: 'blur' }],
        posJobFamilyId: { required: true, type: 'number', message: '请选择职种/子职种', trigger: 'blur' }
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: (node) => {
          return node.parentId === -1 || node.hasOwnProperty('children')
        }
      },
      posTitleName: ''
    }
  },

  methods: {
    changeTitle (val) {
      this.titleList.map(ele => {
        if (ele.posTitleId === val) {
          this.posTitleName = ele.name
        }
      })
      this.controlName()
    },
    controlName () {
      console.log(this.model.posJobFamilyName, this.posTitleName)
      if (!this.model.posJobFamilyName || !this.posTitleName) return
      this.model.name = this.model.posJobFamilyName + this.posTitleName
      // this.$refs.standardOc.validate()
    },
    // 获取并向上发出限制时间
    controlLimitTime () {
      let params = {
        operationType: this.model.operationType,
        // 所属的职群职种id
        parentId: this.model.posJobFamilyId,
        posStandardJobId: this.model.posStandardJobId
      }
      req('getLimitTime', params).then(data => {
        this.$emit('limitTime', data)
      })
    },
    chooseStandardJob () {
      this.$refs.showStandardJob.showDetails = true
    },
    choosePosStandardJob (id, name) {
      var that = this
      this.model.name = name
      this.model.posStandardJobId = id
      this.controlLimitTime()
      req('getJobDetailsById', {posStandardJobId: id}).then(data => {
          // 删除可能被覆盖的有效时间
        delete data.effectiveDate
          // todo:覆盖名称
          // delete data.name
        Object.assign(that.model, data)
      })
    },
    handleOccupationChange (item) {
      if (!item) return
      this.model.posJobFamilyName = item.name
      this.controlName()
      this.controlLimitTime()
    }
  },

  created () {

  },
  mounted () {
    this.controlLimitTime()
  }
}
</script>

<style lang="scss" scoped>

</style>
