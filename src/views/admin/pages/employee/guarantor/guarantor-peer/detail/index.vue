<template>
  <section>
    <i-layout>
        <div slot="section" class="pers">
                <el-table 
                :data="question.evaluationList" 
                class="tmm-persa" 
                 v-loading="contractLoading"
                :element-loading-text="$loadingText"
                >
                  <el-table-column
                  label="填写问卷"
                  prop="description">
                  <template slot-scope="scope">
                    <el-row :style="radioDisable ? 'background:#eef1f6;' : ''">
                      <el-col :span="14">
                        <h4 class="question padding5" style="justify-content:left"><span class="title">题目{{scope.row.orderNo}}.</span> {{scope.row.quesion}}</h4>
                      </el-col>
                      <el-col :span="10">
                      <template>
                        <el-radio-group v-model="scope.row.score" style="padding: 5px 0" :disabled="radioDisable">
                          <el-radio :label="1"></el-radio>
                          <el-radio :label="2"></el-radio>
                          <el-radio :label="3"></el-radio>
                          <el-radio :label="4"></el-radio>
                          <el-radio :label="5"></el-radio>
                        </el-radio-group>
                      </template>
                    </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <p class="des padding5"><span class="title">描述：</span>  {{scope.row.description}}</p>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                </el-table>

                <div class="guarantor-peer-detail">
                  <el-button @click="goBack" v-if="!isSelf">返 回</el-button>
                  <el-button type="primary" @click="submitDetail">确定</el-button>
                </div>
        </div>
        
    </i-layout>
  </section>
</template>
<script>
  import req from 'api/employee/guarantor'
  import access from 'mixins/access'
  export default {
    mixins: [access],
    data () {
      return {
        question: {
        },
        fillinContent: {
          employeeId: '',
          employeeName: '',
          beginDate: '',
          endDate: '',
          empSuretyEvaluationId: '',
          assessmentList: [{
            assessmentDetailId: '',
            orderNo: '',
            quesion: '',
            description: '',
            score: ''
          }]
        },
        contractLoading: false,
        radioDisable: true,
        submitDisable: false,
        isSelf: false
      }
    },
    mounted () {
      this.getDetail()
    },
    watch: {
      'question.status': {
        handler: function (newVal, oldVal) {
          if (newVal === '0') {
            this.radioDisable = false
          } else {
            this.radioDisable = true
          }
        },
        deep: true
      }
    },
    methods: {
      getDetail () {
        const _this = this
        _this.contractLoading = true
        if (window.location.href.indexOf('self.html') > -1) {
          _this.isSelf = true
        }
        req('assessmentContent', {'empSuretyEvaluationId': _this.$route.params.id})
        .then(data => {
          console.log(data)
          _this.question = data
          _this.contractLoading = false
          _this.question.beginDate = new Date().getTime()
        })
        .catch(err => {
          _this.contractLoading = false
          _this.$message({type: 'error', message: err.message})
        })
      },
      // 提交数据
      requestData () {
        const _this = this
        _this.contractLoading = true
        if (!_this.submitDisable) {
          _this.submitDisable = true
          req('finishAss', this.fillinContent)
          .then(data => {
            // console.log('data', data)
            _this.contractLoading = false
            _this.$message({type: 'success', message: '提交成功！'})
            _this.submitDisable = false
            setTimeout(() => {
              if (_this.isSelf) {
                // window.close()
                history.back()
              } else {
                _this.goBack()
              }
            }, 1000)
          })
          .catch(err => {
            _this.contractLoading = false
            _this.submitDisable = false
            _this.$message({type: 'error', message: err.message})
          })
        }
      },
      confirm () {
        this.$confirm('您问卷未填写完毕, 是否确认提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.requestData()
        }).catch(() => this.$message('您已取消操作'))
      },
      submitDetail () {
        this.fillinContent.employeeId = this.question.empEmployeeId
        this.fillinContent.endDate = new Date().getTime()
        this.fillinContent.beginDate = this.question.beginDate
        this.fillinContent.employeeName = this.question.employeeName
        this.fillinContent.empSuretyEvaluationId = this.question.empSuretyEvaluationId
        this.fillinContent.evaluationList = this.question.evaluationList
        let isfinished = this.fillinContent.evaluationList.every((item) => {
          return item.score >= 1
        })
        if (isfinished) {
          this.requestData()
        } else {
          this.confirm()
        }
      },
      goBack () {
        this.$router.push({path: '/employee/guarantor/guarantor_peer'})
      }
    }
  }
</script>
<style lang="scss" scoped>
  .pers{
    .card {
      padding-top:40px;
    }
    .question{
      display: flex;
      justify-content: space-between;
      .el-radio-group{
        flex-basis: 240px;
        padding-top: 8px;
      }
    }
  }
.guarantor-peer-detail {
  margin-top: 20px;
  text-align: right;
}
.tmm-persa {
  .el-table .cell, .el-table th>div {
    padding: 0
  }
}
</style>