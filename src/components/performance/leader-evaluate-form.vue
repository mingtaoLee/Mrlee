<template>

  <div class="evaluate-form">
    <h3>评估人:{{indicator.evaluationLeaders[leaderIndex].leaderName }} <span class="leader-weight">({{indicator.evaluationLeaders[leaderIndex].weight}})%</span></h3>
    <div class="score-area">
      <div class="label">复评分:</div>
      <div class="standard">
        <el-form-item  
        :rules="indicator.isPermission === 'N'? null : rules.standard" 
        class="performance-detail-form-item" 
        v-if="indicator.evaluationMethod === '1'">
          <el-select 
          v-model="label"
          clearable
          @change="standardChange"
          :disabled="indicator.isPermission === 'N' || indicator.evaluationLeaders[leaderIndex].isCurrentPerson === 'N'">
            <el-option 
            v-for="standard in indicator.evaluationStandard" 
            :key="standard.standardDetailName" 
            :label="standard.standardDetailName" 
            :value="standard.standardDetailId"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="score">
        <el-form-item 
        :prop="`${correctPath}[${rowIndex}].evaluationLeaders[${leaderIndex}].leaderEvaluationScore`" 
        :rules="(indicator.isPermission === 'N' || indicator.evaluationLeaders[leaderIndex].isCurrentPerson === 'N') ? null : indicator.evaluationMethod === '1' ?  rules.score : rules.scoreInput" 
        class="performance-detail-form-item" >
          <el-select 
          v-model="indicator.evaluationLeaders[leaderIndex].leaderEvaluationScore" 
          :disabled="indicator.isPermission === 'N' ||　indicator.evaluationLeaders[leaderIndex].isCurrentPerson === 'N'" 
          v-if="indicator.evaluationMethod === '1'"
          clearable
           >
            <el-option v-for="score in scoreList" :key="score" :value="score" :label="score"></el-option>
          </el-select>
          <el-input type="number" max="1000" 
          v-model.number="indicator.evaluationLeaders[leaderIndex].leaderEvaluationScore" 
          :disabled="indicator.isPermission === 'N'　|| indicator.evaluationLeaders[leaderIndex].isCurrentPerson === 'N'" v-else></el-input>
        </el-form-item>

      </div>
    </div>
    <i class="show-description-icon el-icon-arrow-down" @click="showDescription = true" v-show="!showDescription" v-if="indicator.evaluationLeaders.length > 1"></i>
    <i class="show-description-icon el-icon-arrow-up" @click="showDescription = false" v-show="showDescription" v-if="indicator.evaluationLeaders.length > 1"></i>
    <el-collapse-transition>
      <div class="description-area" v-show="indicator.evaluationLeaders.length === 1 || showDescription">
      <div class="label">完成情况:</div>
      <el-form-item 
      :prop="`${correctPath}[${rowIndex}].evaluationLeaders[${leaderIndex}].leaderEvaluationDescription`" 
      :rules="indicator.isPermission === 'N' ||　indicator.evaluationLeaders[leaderIndex].isCurrentPerson === 'N'　? null : rules.description" 
      class="performance-detail-description-item">
        <el-input 
        v-model="indicator.evaluationLeaders[leaderIndex].leaderEvaluationDescription"
        placeholder="请输入详情" 
        type="textarea" 
        :disabled="indicator.isPermission === 'N' ||　indicator.evaluationLeaders[leaderIndex].isCurrentPerson === 'N'" 
        :rows="1"></el-input>
      </el-form-item>

    </div>
    </el-collapse-transition>

  </div>


</template>
<script>
export default {
  name: 'leader-evaluate-form',
  props: {
    processStatus: {
      type: String
    },
    indicator: {
      type: Object
    },
    rowIndex: {
      type: [Number, String]
    },
    leaderIndex: Number,
    isKeywork: Boolean,
    isSupply: Boolean
  },
  data () {
    let that = this
    return {
      scoreLabel: that.indicator.evaluationLeaders[that.leaderIndex].leaderEvaluationScore,
      descriptionLabel: that.indicator.evaluationLeaders[that.leaderIndex].leaderEvaluationDescription,
      timer: null,
      showDescription: false,
      label: '',
      rules: {
        standard: {required: true, message: '请选择标准', trigger: 'blur'},
        scoreInput: {required: true, max: 1000, message: '请打分，输入小于1000', trigger: 'change', type: 'number'},
        score: {required: true, message: '请打分', trigger: 'change', type: 'number'},
        description: {required: true, max: 150, message: '请输入描述，不超过150', trigger: 'blur'}
      }
    }
  },
  methods: {
    standardChange () {
      this.indicator.evaluationLeaders[this.leaderIndex].leaderEvaluationScore = null
    }
  },
  computed: {
    scoreList () {
      for (let i of this.indicator.evaluationStandard) {
        if (this.label === i.standardDetailId) return i.score
      }
    },
    correctPath () {
      let result = ''
      this.isKeywork ? result = 'keyWork' : this.isSupply ? result = 'supplementIndicators' : result = 'fixedIndicators'
      return result
    }
  }
}
</script>
<style lang="scss" scoped>
.evaluate-form {
  display: flex;
  flex-wrap: wrap;
  padding-right: 5px;
  padding-left: 5px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ececec;
  h3 {
    font-weight: 500;
    .leader-weight {
      font-size: 8px;
      font-weight: normal;
      color: #555;
    }
  }
  .score-area {
    .label {
      width: 65px;
      margin-top: 3px;
      text-align: left;
      flex-shrink: 0;
    }
    width: 100%;
    display: flex;
    .standard {
      margin-right: 10px; 
      flex-shrink: 1;  
    }
    .score {
      flex-shrink: 1;
      height: 50px;
    }
  }
  .description-area {
    margin-top: 10px;
    display: flex;
    width:100%;
    .label {
      min-width: 65px;
      text-align: left;
    }
  }
  .show-description-icon {
    cursor: pointer;
    font-size: 10px;
  }
}
.evaluate-form:nth-last-child(1) {
  border-bottom: none;
}
.pulldown-enter {
  transform: translate(0, -30px)
}
.pulldown-enter-active,.pulldown-leave-active{
  transition: 0.5s;
}
.pulldown-leave-to {
  transform: translate(0, -25px)
}
</style>
<style lang="scss">

  .performance-detail-form-item {
    margin-top: 0;
    margin-bottom: 0;
    //width: 80%;
  }
  .performance-detail-description-item {
    margin-top: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
