<template>
<div>
   <i-layout headerKey="rctInterviewOnHandGet">
    <i-table
      slot="section"
      :table="table"
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange"
    >
      <template slot="table" slot-scope="tableScope">
        <el-table :data="tableScope.clone" v-loading="loading" :element-loading-text="$loadingText">

          <el-table-column
          v-for="(col, index) in table.columns"
          :key="index"
          :prop="col.prop"
          :formatter="tableScope.formatter"
          :label="col.label"></el-table-column>
          <i-table-operator :table="tableScope"/>
          <!-- <el-table-column label="操作" fixed="right" align="center" width="200">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="look(scope.row)">查看简历</el-button>
              <el-button
                type="text"
                @click="look1(scope.row)">面试评估</el-button>
            </template>
          </el-table-column> -->

        </el-table>
      </template>
    </i-table>
  </i-layout>

  <i-dialog
  v-model="showEvaluate"
  destroyedWhenClose
  :toolbar="toolbar"
  title="面试评估">
    <interview-evaluate
    :interviewRow="currentRow"
    ref="interviewEvaluateDialog"
    @close="closeInterviewEvaluate"></interview-evaluate>
  </i-dialog>



</div>

</template>

<script>
// import access from 'mixins/access'
import tableMixin from '../../../../admin/pages/performance/table-mixin'
import req from 'api/recruit'
import interviewEvaluate from '../interview-evaluate'
import { ResumePageSource } from 'views/admin/pages/recruit/config'
import {windowOpen} from 'utils'
import {BASE_URL} from '../../../../../config/api'

export default {
  name: 'self-recruit-interviewer',

  components: {
    interviewEvaluate
  },

  mixins: [tableMixin],

  data () {
    return {
      loading: true,
      interviewEvaluate: [],
      showEvaluate: false,

      table: {
        data: [],
        showPagebar: true,
        total: null,
        info: {
          pageIndex: 1,
          pageSize: 10
        },
        columns: [
          {prop: 'applyPositionName', label: '岗位名称'},
          {prop: 'applyOrgName', label: '用人部门'},
          {prop: 'requireNum', label: '拟招人数'},
          {prop: 'empType', label: '用工类型', display: { dict: 'EMPLOYEE_TYPE' }},
          {prop: 'arrangeMan', label: '招聘负责人'},
          {prop: 'interviewee', label: '应聘人姓名'},
          {prop: 'intervieweePhone', label: '应聘人电话'},
          {prop: 'interviewers', label: '面试官'}
        ],
        setting: {
          operator: [
            {
              text: '查看简历',
              // key: 'rctResumeSelfGet',
              func: row => {
                // this.$router.replace({
                //   path: '/recruit/resume/resumeDetail',
                //   query: {
                //     resumeId: row.resumeId,
                //     source: ResumePageSource.SELFDEMAND
                //   }
                // })
                windowOpen('self.html#/recruit/resume/resumeDetail', {
                  resumeId: row.resumeId,
                  source: ResumePageSource.SELFDEMAND
                })
              }
            },
            {
              text: '面试评估',
              // key: 'rctInterviewResultPost',
              func: row => {
                this.currentRow = row
                this.showEvaluate = true
              }
            }
          ]
        }
      },

      toolbar: [
        {
          text: '下载',
          type: 'success',
          func: done => this.downLoad(done)
        }, {
          text: '取消',
          type: 'default',
          func: (done) => {
            done()
          }
        }, {
          text: '确定',
          type: 'primary',
          func: (done) => {
            this.$refs.interviewEvaluateDialog && this.$refs.interviewEvaluateDialog.doEditData().then(() => {
              done()
              this.init()
            })
          }
        }
      ]
    }
  },

  created () {
    this.loading = true
    this.init()
  },

  methods: {
    // 分页器显示当前页
    handleCurrentChange (opts) {
      this.loading = true
      this.init(opts)
    },

    // 分页器每页显示几个
    handleSizeChange (opts) {
      this.loading = true
      this.init(opts)
    },

    look (row) {
      this.$router.push({
        // path: 'recruit/resume/resumeDetail',
        query: {
          resumeId: row.resumeId,
          source: ResumePageSource.SELFDEMAND
        }
      })
    },

    look1 (row) {
      this.currentRow = row
      this.showEvaluate = true
    },

    // 发送下载请求
    downLoad (done) {
      // req('postDownloadform', {interviewId: this.currentRow.interviewId}).then(() => {})
      var el = document.createElement('a')
      document.body.appendChild(el)
      el.href = `${BASE_URL}/recruit/interviews/${this.currentRow.interviewId}/download`
      el.target = '_self'
      var e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      el.dispatchEvent(e)
      document.body.removeChild(el)
    },

    init (opts) {
      req('getAgencyInterviews', opts).then(res => {
        res.data.forEach(ele => (ele.interviewers = (ele.interviewers.join(','))))
        Object.assign(this.table, res)
        this.loading = false
      })
    },

    closeInterviewEvaluate () {
      this.showEvaluate = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
