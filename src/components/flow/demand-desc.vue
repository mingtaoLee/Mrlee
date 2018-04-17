<template>
  <div class="content-follow">
    <h2 class="info-title">需求描述</h2>
    <div class="info-content">
      <el-form :model="model" :rules="rules" label-width="150px" label-position="right" @submit.native.prevent>
        <el-form-item label="维护功能">
          <span class="bold">{{action}}</span>
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate" v-if="showMap.effectiveDate">
          <el-col :span="8">
            <el-date-picker v-model="model.effectiveDate" :type="dateSelectType" size="small" :disabled="disabledMap.effectiveDate"
             :picker-options="pickerOptions">
            </el-date-picker>
          </el-col>
        </el-form-item>

        <!-- 这个用于月份类选择的日期选择，还是日期选择器，只是默认选择1号 -->
        <el-form-item label="生效日期" prop="effectiveDate" v-if="showMap.effectiveMonth">
          <el-col :span="8">
            <el-date-picker v-model="model.effectiveDate" size="small" :disabled="disabledMap.effectiveMonth"
             :picker-options="monthPickerOptions">
            </el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="描述" v-if="showMap.desc && ifDesc" prop="desc">
          <el-col :span="8">
            <el-input type="textarea" :placeholder="disabledMap.reason ? '' : '请输入'" v-model="model.desc" :disabled="disabledMap.desc"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="附件" v-if="showMap.attachmentIds">
          <el-col :span="12">
            <uploader :previewMode="disabledMap.attachmentIds" @onChange="getFileIds" :fileList="fileList"></uploader>
          </el-col>
        </el-form-item>
        <el-form-item label="附件" v-if="showMap.attachmentIdList">
          <el-col :span="12">
            <uploader :previewMode="disabledMap.attachmentIdList" @onChange="getFileIds" :fileList="fileList"></uploader>
          </el-col>
        </el-form-item>
        <el-form-item label="原因" prop="reason" v-if="showMap.reason">
          <el-col :span="8">
            <el-input type="textarea" :placeholder="disabledMap.reason ? '' : '请输入'" v-model="model.reason" :disabled="disabledMap.reason"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/**
 * 流程需求描述组件
 * @param model(需求描述数据)
 * @param action(维护功能)
 * @param readOnly(可读)
 */
import Uploader from 'components/common/upload/uploader'

export default {
  name: 'DemandDesc',
  components: {
    Uploader
  },
  props: {
    model: {
      type: Object,
      default: () => {
        return {
          effectiveDate: '', // 生效日期
          desc: '', // 描述
          reason: ''  // 原因
        }
      }
    },
    action: String,
    readOnly: {
      type: Boolean,
      default: false
    },
    ifDesc: {
      type: Boolean,
      default: true
    },
    // 限制不可选的时间戳（该时间前的均不可选）
    limitTime: {
      type: Number,
      default: 0
    },
    // 控制时间选择器的type
    dateSelectType: {
      type: String,
      default: 'date'
    }
  },
  data () {
    return {
      fileList: [],
      rules: {
        effectiveDate: [
          { type: 'date', required: true, message: '请选择生效日期', trigger: 'change' }
        ],
        desc: [{ max: 512, message: '长度不能超过512个字符', trigger: 'blur' }],
        reason: [{ max: 512, message: '长度不能超过512个字符', trigger: 'blur' }]
      }
    }
  },
  computed: {
    pickerOptions () {
      let that = this
      // 如果时间是限制时间之前，则清空选择
      if (this.model.effectiveDate && Date.parse(this.model.effectiveDate) < that.limitTime) {
        this.model.effectiveDate = null
      }
      return {
        disabledDate (time) {
          return that.limitTime ? (time.getTime() <= that.limitTime) : 0
        }
      }
    },
    monthPickerOptions () {
      let that = this
      // 如果时间是限制时间之前，则时间默认选择限制时间之后，本月或下一个月1号
      if (Date.parse(this.model.effectiveDate) < that.limitTime || !this.model.effectiveDate) {
        let now = new Date()
        let beginOfNow = new Date(now.getFullYear(), now.getMonth(), 1)
        if (that.limitTime) {
          if (beginOfNow.getTime() >= that.limitTime) {
            this.model.effectiveDate = beginOfNow
          } else {
            this.model.effectiveDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
          }
        } else {
          this.model.effectiveDate = beginOfNow
        }
      }
      return {
        disabledDate (time) {
          return that.limitTime ? (time.getTime() < that.limitTime) : 0
        }
      }
    }
  },
  created () {
    this.fileList = this.model.attachmentIds && JSON.parse(JSON.stringify(this.model.attachmentIds)) || []
  },
  mounted () {
    this.model.effectiveDate = new Date(this.model.effectiveDate)
  },
  methods: {
    getFileIds (file, fileList) {
      this.model.attachmentIds = []
      fileList.map(ele => {
        if (!this.model.attachmentIds.includes(ele.attachmentId)) {
          this.model.attachmentIds.push(ele.attachmentId)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
