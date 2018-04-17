<template>
  <!-- 联保人互评管理 -->
  <section class="pers" >
   <i-layout>
      <div slot="section">
        <i-table :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
        <el-table 
          :data="tableScope.clone"
          tooltip-effect="dark"
          style="width: 100%" 
          v-loading="searchLoading"
          :element-loading-text="$loadingText">
          <el-table-column
            label="问卷名称"
            prop="evaluationName"
            sortable
            width="250">
            <template slot-scope="scope">
              <el-button type="text" @click="fillin(scope.row)" >{{ scope.row.evaluationName }} </el-button>
              <i-dialog v-model="isShowAss" :toolbar="toolbar" size="large">
                <!-- status为0时可编辑 -->
                <el-table 
                :data="question.evaluationList" 
                class="tmm-persa" 
                 v-loading="searchDialogLoading"
                :element-loading-text="$loadingText"
                >
                  <el-table-column
                  label="填写问卷"
                  prop="description">
                  <template slot-scope="scope">
                    <el-row :style="radioDisable ? 'background:#eef1f6;' : ''">
                      <el-col :span="14">
                        <h4 class="question padding5" ><span class="title">题目{{scope.row.orderNo}}.</span> {{scope.row.quesion}}</h4>
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

              </i-dialog>
            </template>
          </el-table-column>
          <el-table-column  
            v-for="(item, idx) in table.columns" 
            :formatter="tableScope.formatter" 
            :key="idx+1"  
            :prop="item.prop"  
            :label="item.label"  
            :width="item.width" 
            :min-width="item.minWidth" 
            :align="item.align"
            sortable/>
        </el-table>
        </template>
      </i-table>
      </div>
    </i-layout>
  </section>
</template>

<script>
  import req from 'api/employee/guarantor'
  import ITable from 'components/common/i-table'
  import ILayout from 'components/common/i-layout'
  import IDialog from 'components/common/i-dialog/i-dialog'
  import access from 'mixins/access'
  export default {
    components: {
      ITable,
      ILayout,
      IDialog
    },
    mixins: [access],
    data () {
      return {
        question: {},
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
        toolbar: [{
          type: 'primary',
          text: '确定',
          func: () => {
            this.submitDetail()
          }
        }],
        table: {
          columns: [
            { prop: 'employeeName', label: '被联保人姓名', minWidth: 180 },
            { prop: 'employeeUnitName', label: '被联保人组织', width: 200 },
            { prop: 'employeePostion', label: '被联保人职位', width: 200 },
            { prop: 'personnelGroupName', label: '人事范围', width: 150, align: 'center' },
            { prop: 'orgPathName', label: '组织全称', width: 300, align: 'center' },
            { prop: 'beginDate', label: '开始时间', width: 200, align: 'center', display: { date: 'long' } },
            { prop: 'endDate', label: '结束时间', width: 200, align: 'center', display: { date: 'long' } },
            { prop: 'score', label: '评分', width: 130, align: 'right' },
            { prop: 'status', label: '结果', width: 100, display: { dict: 'EVALUATION_STATUS' } }
          ],
          info: null,
          total: 0,
          showPagebar: true,
          data: null,
          search: null
        },
        isShowAss: false,
        // assessmentList: null,
        // assessmentDetail: null,
        // radioDis: false,
        // scoreList: {},
        radioDisable: true,
        searchLoading: false,
        searchDialogLoading: false
      }
    },
    computed: {
      cosuretyId () {
        return this.$store.state.user.info.empEmployeeId
      }
    },
    watch: {
      cosuretyId () {
        this.getEmpAss({pageSize: 10, pageIndex: 1})
      },
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
    mounted () {
      this.table.search = {}
    },
    methods: {
      handleSizeChange (options) {
        this.getEmpAss(options)
      },
      handleCurrentChange (options) {
        this.getEmpAss(options)
      },
      getScore (val) {
        console.log('val: ', val)
      },

      getEmpAss (options) {
        // if (this.cosuretyId) {
        this.searchLoading = true
        req('getEmpAssessmentList', {cosuretyId: this.cosuretyId, ...options})
        .then(data => {
          Object.keys(data).map(key => (this.table[key] = data[key]))
          this.searchLoading = false
        })
        .catch(err => console.log(err))
        // } else {
        //   this.$message({ type: 'error', message: '该用户非法，无法获取数据' })
        // }
      },
      checkScore (item) {
        return item.score >= 1
      },
      submitDetail () {
        this.fillinContent.employeeId = this.question.empEmployeeId
        this.fillinContent.endDate = new Date().getTime()
        this.fillinContent.beginDate = this.question.beginDate
        this.fillinContent.employeeName = this.question.employeeName
        this.fillinContent.empSuretyEvaluationId = this.question.empSuretyEvaluationId
        this.fillinContent.evaluationList = this.question.evaluationList
        // console.log(this.fillinContent.evaluationList)
        let isfinished = this.fillinContent.evaluationList.every((item) => {
          return item.score >= 1
        })
        console.log(isfinished)
        if (isfinished) {
          this.requestData()
        } else {
          this.confirm()
        }
      },
      // 提交数据
      requestData () {
        req('finishAss', this.fillinContent)
        .then(data => {
          // console.log('data', data)
          this.getEmpAss()
          this.isShowAss = false
        })
        .catch(err => console.log(err))
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

      // cloneObj (target, obj) {
      //   Object.keys(target).map((item) => {
      //     !target[item] && (target[item] = obj[item])
      //     if (Object.prototype.toString.call(target[item]) === '[object Array]') {
      //       console.log(item, obj, obj[item], !!obj[item])
      //       target[item].map((val, idx) => { this.cloneObj(val, obj[item][idx]) })
      //     }
      //   })
      // },
      // cloneObj (target, obj) {
      //   Object.keys(target).forEach((item) => {
      //     if (target[item] === '') {
      //       target[item] = obj[item]
      //     } else if (Array.isArray(target[item])) {
      //       target[item].map((val, idx) => {
      //         console.log('target[item]', target[item])
      //         console.log('idx', idx)
      //         this.cloneObj(val, obj[item][idx])
      //       })
      //     }
      //   })
      // },

      fillin (row) {
        // req('assessmentContent', {'empSuretyEvaluationId': row.empSuretyEvaluationId})
        // .then(data => {
        //   this.question = data
        //   this.question.beginDate = new Date().getTime()
        //   this.isShowAss = true
        // })
        // .catch(err => console.log(err))
        this.$router.push(`guarantor_peer_detail/${row.empSuretyEvaluationId}?fromIndex=false`)
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
</style>
<style lang="scss" >
.tmm-persa {
  .el-table .cell, .el-table th>div {
    padding: 0
  }
}
</style>
