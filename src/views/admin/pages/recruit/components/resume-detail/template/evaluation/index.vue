<template>
  <div>
    <section class="content-follow">
      <h2 class="info-title">{{title}}</h2>

      <!-- 面试评估 -->
      <i-table :table="table">
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="table.data"
            border>
            <el-table-column
            align="center"
            :formatter="tableScope.formatter"
            v-for="column in table.columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label">
              </el-table-column>
            <slot></slot>
          </el-table>
        </template>
      </i-table>

      <!-- 面试意见 -->
      <div class="form"> 
        <el-row>
          <el-col :span="3" class="form-label">面试建议</el-col>
          <el-col :span="21" class="form-value">{{formData.suggest === '' || !formData.suggest ? '':formData.suggest === '1' ? '通过' : '淘汰'}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="form-label big">面试意见</el-col>
          <el-col :span="21" class="form-value big">{{formData.opinion}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="form-label bb">面试官</el-col>
          <el-col :span="9" class="form-value br bb">{{formData.people}}</el-col>
          <el-col :span="3" class="form-label bb">填表日期</el-col>
          <el-col :span="9" class="form-value bb">{{formData.date}}</el-col>
        </el-row>
      </div>

    </section>
  </div>
</template>
<script>
import moment from 'moment'
/**
 * @prop data 数据
 */
export default {
  name: 'EvaluationTemplate',
  props: {
    // 面试评估数据
    evalutionData: Object
  },
  data () {
    return {
      // 标题
      title: '',
      // 评估表
      table: {
        columns: [
          {
            prop: 'optionType',
            label: '评估类型',
            display: { dict: 'EVALUATION_OPTION_TYPE' }
          },
          {
            prop: 'description',
            label: '评估项'
          },
          // {
          //   prop: 'totalScore',
          //   label: '满分(10)'
          // }
          // {
          //   prop: 'obtainScore',
          //   label: '得分'
          // },
          {
            prop: 'comment',
            label: '评语'
          }
        ],
        data: null
      },

      // 面试意见数据
      formData: {
        opinion: '',
        suggest: '',
        people: '',
        date: ''
      }
    }
  },
  methods: {
    // 设置标题
    setTitle () {
      switch (this.evalutionData.interviewProcess) {
        case '1':
          this.title = '初面'
          break
        case '2':
          this.title = '一轮复试'
          break
        case '3':
          this.title = '二轮复试'
          break
        case '4':
          this.title = '三轮复试'
          break
        case '5':
          this.title = '四轮复试'
          break
        default:
          this.title = '面试评估'
          break
      }
    },
    // 设置表格数据
    setTableData () {
      this.table.data = this.evalutionData.evaluationOptions
    },
    // 设置其他数据
    setOtherData () {
      let interviewerNames = this.getListName(this.evalutionData.interviewers)
      this.formData = {
        opinion: this.evalutionData.opinion,
        suggest: this.evalutionData.result,
        people: interviewerNames,
        date: this.dateFormat(parseInt(this.evalutionData.interviewDate))
      }
    },

    // 面试官拼接
    getListName (interviewers) {
      let len = interviewers.length
      let item
      let arr = []
      if (len === 0) {
        return ''
      } else {
        while (len--) {
          item = interviewers[len]
          arr.push(item.interviewerName)
        }
        console.log(arr.toString())
        return arr.toString()
      }
    },
    // 格式化时间
    dateFormat (value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD')
      }
    }
  },
  mounted () {
    this.setTitle()
    this.setTableData()
    this.setOtherData()
  }
}
</script>
<style lang="scss" scoped>
.form {
  margin: 50px 0 20px 0;
  font-size: 14px;
  border: 1px solid #ccc;
  .form-label {
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-weight: 700;
    color: #000;
    background-color: #f9f9f9;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
  .form-value {
    padding-left: 10px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ccc;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .big {
    height: 50px;
    line-height: 50px;
  }
  .br {
    border-right: 1px solid #ccc;
  }
  .bb {
    border-bottom: 0;
  }
}
</style>
