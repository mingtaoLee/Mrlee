<template>
  <table class="self-table">
    <tr>
      <td class="ar pr10">自评分:</td>

      <td v-if="indicator.evaluationType === '2'">
        <div>{{ indicator.selfEvaluationScore }}</div>
      </td>

      <template
        v-else-if="indicator.evaluationMethod !== '2' && !needDisable">
        <td>
          <el-form-item class="input-area">
            <el-select
              @change="clearNextSelect"
              v-model="label"
              clearable
              :disabled="needDisable || indicator.isPermission === 'N'">

              <el-option
                v-for="standard in indicator.evaluationStandard"
                :key="standard.standardDetailName"
                :label="standard.standardDetailName"
                :value="standard.standardDetailId">
              </el-option>

            </el-select>
          </el-form-item>
        </td>

        <td>
          <el-form-item
            class="input-area"
            :prop="`${correctPath}[${rowIndex}].selfEvaluationScore`"
            :rules="needDisable || indicator.isPermission === 'N' ? null : rules.score">

            <el-select
              v-model="indicator.selfEvaluationScore"
              clearable
              :disabled="needDisable || indicator.isPermission === 'N'">
              <el-option
                v-for="score in scoreList"
                :key="score"
                :value="score">
              </el-option>

            </el-select>
          </el-form-item>
        </td>
      </template>

      <td v-else>
        <el-form-item
          :prop="`${correctPath}[${rowIndex}].selfEvaluationScore`"
          :rules="(needDisable || indicator.isPermission === 'N') ? null : rules.scoreInput">

          <el-input
            class="input-area"
            type="number"
            :min="0"
            :max="999"
            :disabled="needDisable || indicator.isPermission === 'N'"
            v-model.number="indicator.selfEvaluationScore">
          </el-input>

        </el-form-item>
      </td>
    </tr>

    <tr>
      <td class="ar pr10">完成情况:</td>

      <td colspan="2">

        <el-form-item
          :class="{'descript-area-small': size === 'small',
            'descript-area-middle': size === 'middle',
            'descript-area-big': size === 'big'}"
          :prop="`${correctPath}[${rowIndex}].selfEvaluationDescription`"
          :rules="(needDisable || indicator.isPermission === 'N') ? null : rules.description">

          <el-input
            v-model="indicator.selfEvaluationDescription"
            type="textarea"
            :value="descriptionLabel"
            :autosize="{ minRows: 3}"
            :disabled="needDisable || indicator.isPermission === 'N'">
          </el-input>

        </el-form-item>
      </td>
    </tr>
  </table>
</template>
<script>
export default {
  name: 'self-evaluate-form',
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
    leaderName: String,
    isKeywork: Boolean,
    isSupply: Boolean,
    needDisable: Boolean,
    size: {
      type: String,
      default: 'middle'
    }
  },

  data () {
    let that = this
    return {
      descriptionLabel: that.indicator.selfEvaluationDescription,
      timer: null,
      label: '',
      score: null,
      rules: {
        standard: {required: true, message: '请选择标准', trigger: 'blur'},
        scoreInput: {required: true, min: 0, max: 999, message: '请打分,输入小于1000', trigger: 'change', type: 'number'},
        score: {required: true, message: '请打分', trigger: 'change', type: 'number'},
        description: {required: true, max: 255, message: '请输入描述，不超过255', trigger: 'blur'}
      }
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
  },

  methods: {
    clearNextSelect () {
      this.indicator.selfEvaluationScore = null
    },

    setScore () {
      this.indicator.selfEvaluationScore = this.score
    }
  }
}
</script>

<style lang="scss" scoped>
.self-table {
  margin: 0 auto;

  div {
    margin: 5px 0;
  }

  td {
    box-sizing: border-box;

    .input-area {
      box-sizing: border-box;
      width: 150px;
    }

    .descript-area-small {
      box-sizing: border-box;
      width: 200px;
    }

    .descript-area-middle {
      box-sizing: border-box;
      width: 300px;
    }

    .descript-area-big {
      box-sizing: border-box;
      width: 500px;
    }
  }
}
</style>
