<template>
  <i-form
    @reset="onResetHandler"
    @search="onSearchHandler"
    :rules="rules"
    ref="form">
    <el-form-item label="姓名">
      <el-input v-model.trim="searchParam.name" placeholder="请输入应聘者姓名"></el-input>
    </el-form-item>
    <el-form-item label="学历" prop="education">
        <i-select
          :filterable="true"
          v-model.trim="searchParam.education"
          parameter="EDUCATIONAL_BACKGROUND"
          placeholder="请选择学历"></i-select>
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile">
      <el-input
        v-model.trim="searchParam.mobile"
        :maxlength="11"
        placeholder="请输入手机号码"></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-select
        multiple
        collapse-tags
        v-model="searchParam.resumeStatus"
        size="mini"
        placeholder="请输入招聘状态">
        <el-option
          v-for="item in resumeStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="简历来源" v-if="showFlagList">
       <i-select
        :filterable="true"
        v-model.trim="searchParam.resumeSource"
        parameter="RESUME_SOURCE"
        placeholder="请输入简历来源"></i-select>
    </el-form-item>
    <el-form-item label="入库开始时间">
      <el-date-picker
        v-model="searchParam.inBeginDate"
        type="date"
        @change="handleBeginDateChange"
        :picker-options="beginOptions"
        placeholder="">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="入库结束时间">
      <el-date-picker
        v-model="searchParam.inEndDate"
        type="date"
        @change="handleEndDateChange"
        :picker-options="endOptions"
        placeholder="">
      </el-date-picker>
    </el-form-item>
    <el-form-item
      label="最小年龄"
      prop="minAge"
      :rules="[{ validator: checkMinAge, trigger: 'blur' }]">
      <el-input v-model.trim="searchParam.minAge" placeholder="请输入最小年龄"></el-input>
    </el-form-item>
    <el-form-item
      label="最大年龄"
      prop="maxAge"
      :rules="[{ validator: checkMaxAge, trigger: 'blur' }]">
      <el-input v-model.trim="searchParam.maxAge" placeholder="请输入最大年龄"></el-input>
    </el-form-item>
    <el-form-item label="标签名">
      <el-select
        multiple
        collapse-tags
        v-model="searchParam.labels"
        size="mini"
        clearable
        placeholder="请选择标签">
        <el-option
          v-for="item in resumeLabel"
          :key="item.labelId"
          :label="item.name"
          :value="item.labelId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="需求名称">
      <el-select
        v-model="searchParam.requirementId"
        size="mini"
        clearable
        placeholder="请选择需求名称"
      >
      <el-option
        v-for="item in requirements"
        :key="item.requirementId"
        :label="item.requirementName"
        :value="item.requirementId"
      >
      </el-option>
      </el-select>
    </el-form-item>
  </i-form>
</template>
<script>
import { getDict } from 'utils/index'
import moment from 'moment'
import req from 'api/recruit/index'
export default {
  name: 'ResumeForm',
  data () {
    return {
      showFlagList: false, // 查看简历列表控制简历来源的显示
      // 查询表单
      searchParam: {
        name: '',
        education: '',
        mobile: '',
        resumeStatus: [],
        resumeSource: this.$route.query.resumeSource || '',
        requirementId: this.$route.query.requirementId || '',
        resumeLineType: this.$route.query.resumeLineType || '',

        inBeginDate: null,
        inEndDate: null,
        minAge: '',
        maxAge: '',
        labels: []
      },
      // 简历状态列表
      resumeStatusList: [],
      // 简历标签列表
      resumeLabel: [],

      // 需求列表
      requirements: [],

      // 开始时间参数
      beginOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.parse(this.searchParam.inEndDate) - 3600 * 1000 * 24
        }
      },
      // 结束时间参数
      endOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.parse(this.searchParam.inBeginDate)
        }
      }
    }
  },
  created () {
    this.$store.commit('MODIFY_RESUMEFORM', this.searchParam)
    if (this.$route.name === '简历库') {
      this.showFlagList = true
    }
  },
  mounted () {
    this.getResumeStatus()
    this.getResumeLabel()
    this.getRequirments()
  },
  methods: {
    // 检查最小年龄
    checkMinAge (rule, value, callback) {
      if (this.searchParam.maxAge.length > 0) {
        if (parseInt(this.searchParam.minAge) > parseInt(this.searchParam.maxAge)) {
          callback(new Error('最小年龄不能大于最大年龄'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 检查最大年龄
    checkMaxAge (rule, value, callback) {
      if (this.searchParam.minAge.length > 0) {
        if (parseInt(this.searchParam.maxAge) < parseInt(this.searchParam.minAge)) {
          callback(new Error('最大年龄不能小于最小年龄'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 开始时间改变
    handleBeginDateChange (value) {
      this.searchParam.inBeginDate = value ? moment(value).format('YYYY-MM-DD') : ''
    },
    // 结束时间改变
    handleEndDateChange (value) {
      this.searchParam.inEndDate = value ? moment(value).format('YYYY-MM-DD') : ''
    },
    // 重置
    onResetHandler () {
      this.searchParam = {
        name: '',
        education: '',
        mobile: '',
        positionId: '',
        resumeStatus: [],
        // 简历来源
        resumeSource: this.$route.query.resumeSource || '',
        // 需求id
        requirementId: this.$route.query.requirementId || '',

        inBeginDate: null,
        inEndDate: null,
        minAge: '',
        maxAge: '',
        labels: []
      }
    },
    // 查询
    onSearchHandler () {
      // console.log(this.searchParam)
      this.$store.commit('MODIFY_RESUMEFORM', this.searchParam)
    },
    // 获取所有启用的标签
    getResumeLabel () {
      req('getLabelsEnabled').then((res) => {
        this.resumeLabel = Object.assign({}, this.resumeLabel, res)
      })
    },
    // 获取所有状态
    getResumeStatus () {
      getDict('RESUME_STATUS').then(res => {
        this.resumeStatusList = res
      })
    },

    // 获取所有需求
    getRequirments () {
      req('requirementList').then(res => {
        this.requirements = res.data
      })
    }
  }
}
</script>
