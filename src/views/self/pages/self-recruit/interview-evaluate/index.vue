<template>
  <div>
    <i-table :table="table" ref="table">
      <template slot-scope="tableScope" slot="table">
        <el-table 
        :data="tableScope.clone"  
        v-loading="loading"
        :element-loading-text="$loadingText"
        @row-click="rowClickHandler(tableScope, $event)">

          <el-table-column
          v-for="(col, index) in table.columns"
          :key="index"
          :prop="col.prop"
          :label="col.label">
            <template slot-scope="scope">
              <i-table-cell
                ref="cell"
                :row="scope.row"
                :col="col.prop"
                :table="tableScope"
              ></i-table-cell>
            </template>
          </el-table-column>
          
        </el-table>
      </template>
    </i-table>

    <el-form 
    :model="formData" 
    class="gengtp-recruit-evaluate-form mt10" 
    :rules="rules"
    ref="form"
    >
      <el-form-item label="面试意见" prop="opinion">
        <el-input v-model="formData.opinion" type="textarea"></el-input>
      </el-form-item>

      <el-form-item label="建议" prop="result">
        <el-radio-group v-model="formData.result">
          <el-radio label="1">通过</el-radio>
          <el-radio label="0">淘汰</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="面试官" prop="interviewerName">
        <el-input v-model="formData.interviewerName" @click.native="handleIconClick">
          <i slot="suffix" class="interviewer-icon el-icon-menu" @click.stop="handleIconClick"></i>
        </el-input>
      </el-form-item>

      <el-form-item label="填表日期" prop="interviewDate">
        <el-date-picker 
        v-model="formData.interviewDate"
        format="yyyy-MM-dd HH:mm"
        :picker-options="interviewDatePickerOpts"
        type="datetime" 
        ></el-date-picker>
      </el-form-item>
    </el-form>

      <i-personnel-select
      :isShow.sync="isShow"
      :limit="3"
      :autoClose="false"
      @confirm="handleConfirm"
      multiple>
      </i-personnel-select>
  </div>
</template>

<script>
import req from 'api/recruit'
// import moment from 'moment'
import { clone } from 'utils/index'
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'

export default {
  name: 'interview-evaluate',

  components: {
    iPersonnelSelect
  },

  props: {
    interviewRow: Object
  },

  data () {
    // 目前只实现当点击单行时触发校验
    // var obtainScoreValidator = (rule, val, cb) => {
    //   !val && cb(new Error('请输入建议分数'))
    //   !Number.isInteger(val) && cb(new Error('请输入数字'))
    //   this.current.obtainScore > this.current.totalScore ? cb(new Error('打分不能大于满分')) : cb()
    // }

    return {
      // loading
      loading: false,
      isShow: false,
      current: null,
      // showPersonSelect: false,
      // selectedInterviewers: null,

      formData: {
        interviewDate: '',
        interviewers: null,
        interviewerName: ''
      },

      // initObtainScoreRules: [],

      table: {
        data: [],
        editable: true,
        columns: [
          {prop: 'optionType', label: '评估大类', display: { dict: 'EVALUATION_OPTION_TYPE' }},
          {prop: 'description', label: '评估项'},
          // {prop: 'totalScore', label: '满分'},
          // {prop: 'obtainScore', label: '得分'},
          {prop: 'comment', label: '评语'}
        ],
        setting: {
          editor: {
            optionType: {
              disable: true
            },
            description: {
              disable: true
            },
            // totalScore: {
            //   disable: true
            // },
            // obtainScore: {
            //   type: 'number',
            //   rules: {validator: obtainScoreValidator, trigger: 'change'}
            // },
            comment: {
              type: 'textarea',
              rules: {required: true, message: '请输入意见', trigger: 'blur'}
            }
          }
        }
      },

      rules: {
        opinion: {required: true, message: '请输入意见', trigger: 'blur'},
        result: {required: true, message: '请输入结果建议', trigger: 'blur'},
        interviewerId: {required: true, message: '请选择面试官姓名', trigger: 'blur'},
        interviewDate: {required: true, message: '请输入面试日期', trigger: 'change', type: 'date'}
      },
      // 填表日期选择限制
      interviewDatePickerOpts: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },

  created () {
    this.init()
  },

  methods: {
    // 人员选择的弹框
    handleIconClick () {
      this.isShow = !this.isShow
    },
    // 面试官拼接
    getListName (row) {
      let len = row.length
      let item
      let arr = []
      if (len === 0) {
        return ''
      } else {
        while (len--) {
          item = row[len]
          arr.push(item.interviewerName)
        }
        return arr.toString()
      }
    },
     // 人员选择遍历
    handleConfirm (selected) {
      this.interviewers = selected.map(ele => {
        return {
          interviewerId: ele.employeeId,
          interviewerName: ele.employeeName
        }
      })
      this.formData.interviewerName = this.getListName(this.interviewers).split(',')
      this.isShow = false
    },
    /* 加载对话框数据 */
    init () {
      this.loading = true
      req('geInterviewEvaluate', {interviewId: this.interviewRow.interviewId}).then(res => {
        res.interviewDate ? res.interviewDate = new Date(res.interviewDate) : res.interviewDate = new Date(Date.now())
        res.interviewerName = this.getListName(res.interviewers)
        this.formData = res
        this.table.data = this.formData.evaluationOptions
        this.loading = false
      })
    },

    rowClickHandler ({ rowClickHandler }, row) {
      this.current = row
      rowClickHandler(row)
    },

    /* 修改后发送数据 */
    editEvaluate (data) {
      return req('postInterviewEvaluate', {...data, interviewId: this.interviewRow.interviewId})
    },

    /* 校验 */
    doValidate () {
      return new Promise((resolve, reject) => {
        // for (let i of this.$refs.table.clone) {
          // if (i.obtainScore > i.totalScore) {
          //   this.$message({
          //     message: '打分不得超过满分',
          //     type: 'warning'
          //   })
          //   reject()
          //   break
          // }
        // }
        this.$refs.form.validate(valid => {
          this.$refs.cell.map(cell => cell.validate())
          valid && this.$refs.table.saveData() ? resolve() : reject
        })
      })
    },

    /* 发送修改的请求，此处供父级调用 */
    doEditData () {
      return new Promise((resolve) => {
        this.doValidate().then(() => {
          let tableData = this.$refs.table.clone
          let form = clone(this.formData)
          this.interviewers ? form.interviewers = this.interviewers : form.interviewers
          let data = Object.assign({}, form, {evaluationOptions: tableData})
          this.editEvaluate(data).then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            resolve()
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
.gengtp-recruit-evaluate-form{
  .el-form-item {
    display: flex;
    .el-form-item__label{
      width: 15%;
    }
    .el-form-item__content{
      width: 85%;
    }
  }
}
.interviewer-icon {
  cursor: pointer;
}
</style>

