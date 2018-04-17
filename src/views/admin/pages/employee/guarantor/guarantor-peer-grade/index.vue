<template>
  <section class="pers-dimission">
    <i-layout>
      <i-form
       @reset="reset"
       @search="search"
       slot="header"
       v-if="accessMap.empSuretysAssessmentGet">
        <el-form-item label="问卷名称" prop="empSuretyAssessmentName">
          <el-input v-model="listParams.empSuretyAssessmentName" :maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="发布状态" prop="status">
          <i-select v-model="listParams.status" parameter="ASSESSMENT_STATUS"></i-select>
        </el-form-item>
      </i-form>

      <div class="table-card" slot="section">
        <div class="table">
          <i-table :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
            <template slot="table" slot-scope="tableScope">
              <el-table 
              :data="tableScope.clone"
              tooltip-effect="dark"
              style="width: 100%"
              v-loading="searchLoading"
              :element-loading-text="$loadingText"
              >
                <el-table-column
                  v-for="(item, idx) in table.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :formatter="tableScope.formatter"
                  :min-width="item.width"
                  :align="item.align"
                  sortable
                >
                </el-table-column>
                <i-table-operator :table="tableScope" width="200"></i-table-operator>
              </el-table>
            </template>
          </i-table>
        </div>
      </div>
    </i-layout>

    <div>
          <i-dialog
            v-model="visible.newAss"
            :close-on-click-modal="false"
            title="新增问卷"
            v-if="visible.newAss"
            :toolbar="newToolbar"
           >
            <p style="font-size: 11px;padding: 0 12px;">提示：每题满分五分，总分数不得超过(5x题目数)，题目描述不得超过255个字</p>
            <show
             @confirmAss="postNewAss"
             :assessment="suretyAssessment"
             :editAble="edit"
             ref="new"
             >
             </show>
          </i-dialog>

          <i-dialog title="发布问卷" v-model="visible.publishFormVisible" :toolbar="toolbarPublish">
            <el-form
              label-width="120px"
              :rules="rulesPublish"
              ref="refPublish"
              :model="publish"
              >
              <el-row>
                <el-col :span="22">
                  <el-form-item label="评测开始日期" prop="beginDate">
                    <el-date-picker
                      v-model="publish.beginDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22">
                  <el-form-item label="评测结束日期" prop="endDate">
                    <el-date-picker
                      v-model="publish.endDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions1"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22">
                  <el-form-item label="评测发布范围" prop="orgUnitId">
                    <i-select-tree
                     v-model="publish.orgUnitId"
                     dataKey="org"
                     nodeKey="orgUnitId"
                     :defaultNode="defaultNode"
                     :rootId="root"
                     :lazy="true"
                      size="large"
                      :accordion="true"
                      :hasGrant="false"
                      ></i-select-tree>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </i-dialog>

          <i-dialog title="调查结果" v-model="visible.showResult" size='large'>
            <i-table :table="resTable" @pageSizeChange="handleSizeChangeRes" @pageIndexChange="handleCurrentChangeRes">
              <template slot="table" slot-scope="resTableScope">
                <el-table 
                :data="resTableScope.clone" 
                tooltip-effect="dark" 
                style="width: 100%" 
                @selection-change="handleChangeRes"
                v-loading="searchResultLoading"
                :element-loading-text="$loadingText"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column
                    v-for="(item, idx) in resTable.columns"
                    :label="item.label" :prop="item.prop"
                    :key="idx"
                    :formatter="resTableScope.formatter"
                    :width="item.width"
                    :min-width="item.minWidth"
                    :align="item.align"/>
                </el-table>
              </template>
            </i-table>
          </i-dialog>

          <i-dialog title="查看进度" v-model="visible.showProgress">
            <i-table :table="processTable" @pageSizeChange="handleSizeChangeProgress" @pageIndexChange="handleCurrentChangeProgress">
              <template slot="table" slot-scope="proTableScope">
                <el-table 
                :data="proTableScope.clone"
                v-loading="searchProgressLoading"
                :element-loading-text="$loadingText"
                >
                  <el-table-column v-for="(item,idx) in processTable.columns" :key="idx" :label="item.label" :prop="item.prop"/>
                  <el-table-column label="联保人" prop="finishList">
                    <template slot-scope="scope">
                      <el-checkbox-group v-model="scope.row.checkList">
                       <el-checkbox v-for="(item, idx) in scope.row.unfinishList" :key="idx" :label="item.employeeName" style="width:50%;text-align:left"></el-checkbox>
                       <el-checkbox v-for="(item, idx) in scope.row.finishList" :key="idx" disabled :label="item.employeeName"></el-checkbox>
                      </el-checkbox-group>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="remind(scope.row)">催评</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </i-table>
          </i-dialog>

          <i-dialog v-model="visible.showAss" close-on-click-modal="false" title="查看问卷">
            <show
             @confirmAss="updateAss"
             :assessment="assessmentTitle"
             :editAble="edit"
             ref="view"
             ></show>
          </i-dialog>
          <i-dialog
           v-model="visible.showAssEdit"
           :close-on-click-modal="false"
           title="修改问卷"
           :toolbar="editToolbar">
            <show
             @confirmAss="updateAss"
             :assessment="assessmentTitle"
             :editAble="edit"
             ref="edit"
             ></show>
          </i-dialog>
        </div>
  </section>
</template>
<script>
  // const table = require('./data-mock.js')
  import req, {config} from 'api/employee/guarantor'
  import Show from 'components/employee/guarantor/assessment-show'
  import access from 'mixins/access'
  // import reqDict from 'api/employee/contract'
  export default {
    components: {
      Show
    },
    mixins: [access],
    data () {
      return {
        listParams: {
          status: '',
          empSuretyAssessmentName: ''
        },
        newToolbar: [{
          type: 'primary',
          text: '新增题目',
          func: () => { this.$refs.new.addTest() }
        }, {
          type: 'primary',
          text: '确定',
          func: () => { this.$refs.new.submit() }
        }],
        editToolbar: [{
          type: 'primary',
          text: '新增题目',
          func: () => { this.$refs.edit.addTest() }
        }, {
          type: 'primary',
          text: '确定',
          func: () => { this.$refs.edit.submit() }
        }],
        rulesPublish: {
          beginDate: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          endDate: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          orgUnitId: [
            {required: true, message: '请选择发布范围', trigger: 'change'}
          ]
        },
        selectedTableScope: null, // 用于发布问卷的数据存储

        resListParams: {
          assessmentId: ''
        },
        publishId: '',
        publish: {
          empSuretyAssessmentId: '',
          beginDate: '',
          endDate: '',
          orgUnitId: ''
        },
        toolbarPublish: [{
          text: '发布',
          type: 'primary',
          func: (done) => {
            this.$refs.refPublish.validate((valid) => {
              if (valid) {
                this.publish.empSuretyAssessmentId = this.publishId
                req('publishAssessment', this.publish)
                .then(data => {
                  this.visible.publishFormVisible = false
                  this.getAss({pageIndex: this.table.info.pageIndex, pageSize: this.table.info.pageSize})
                  this.props(this.publish)
                  this.publishId = ''
                })
                .catch((err) => console.log(err))
              } else {
                console.log('error submit')
                return
              }
            })
          }
        }, {
          text: '取消',
          type: 'text',
          func: (done) => {
            this.visible.publishFormVisible = false
            this.props(this.publish)
            console.log('cancel')
          }
        }],
        pickerOptions: {
          disabledDate: (time) => {
            let endDate = new Date(this.publish.endDate)
            if (!endDate) {
              return time.getTime() < Date.now() - 8.64e7
            } else {
              return time.getTime() > endDate || time.getTime() < Date.now() - 8.64e7
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            let beginDateVal = new Date(this.publish.beginDate)
            if (beginDateVal) {
              return time.getTime() < beginDateVal
            } else {
              return time.getTime() < Date.now() - 8.64e7
            }
          }
        },
        table: {
          columns: [
            { prop: 'empSuretyAssessmentName', label: '问卷名称', width: 220 },
            { prop: 'beginDate', label: '开始', width: 100, align: 'center', display: { date: '' } },
            { prop: 'endDate', label: '结束', width: 100, align: 'center', display: { date: '' } },
            { prop: 'orgUnitName', label: '发布范围', width: 200, align: 'center' },
            { prop: 'status', label: '状态', width: 100, display: { dict: 'ASSESSMENT_STATUS' }, align: 'center' }
          ],
          data: null,
          showPagebar: true,
          info: null,
          search: null,
          total: 0,
          setting: {
            toolbar: [{
              text: '新增问卷',
              key: 'empSuretysAssessmentPost',
              type: 'primary',
              func: () => this.newAss()
            }],
            operator: [{
              text: '查看问卷',
              key: 'empSuretysAssessmentOneGet',
              func: this.showAssTitle
            }, {
              text: '发布问卷',
              key: 'empSuretysAssessmentReleasePut',
              func: this.publishNew,
              show (row) {
                if (row.status !== '0') return { empty: true }
              }
            }, {
              text: '修改问卷',
              key: 'empSuretysAssessmentPut',
              func: this.showAssTitleEdit,
              show (row) {
                if (row.status !== '0') return { empty: true }
              }
            }, {
              text: '撤销发布',
              key: 'empSuretysAssessmentUnpublishPut',
              func: this.unpublish,
              show (row) {
                if (row.status !== '1') return { empty: true }
              }
            }, {
              text: '查看进度',
              key: 'empSuretysAssessmentStatusGet',
              func: this.showAssessProgress,
              show (row) {
                if (row.status !== '2') return { empty: true }
              }
            }, {
              text: '结束问卷',
              key: 'empSuretysAssessmentFinishPut',
              func: this.endAssessment,
              show (row) {
                if (row.status !== '2') return { empty: true }
              }
            }, {
              text: '查看结果',
              key: 'empSuretysAssessmentResultGet',
              func: this.getAssessResult,
              show (row) {
                if (row.status !== '3') return { empty: true }
              }
            }]
          }
        },
        proList: [
          { title: 'empSuretyAssessmentName', label: '联保人' },
          { title: 'beginDate', label: '状态', width: 80 }
        ],
        resTable: {
          columns: [
            // { title: 'evaluationName', label: '问卷姓名', width: 120},
            { prop: 'cosuretyName', label: '联保人姓名', width: 120 },
            { prop: 'cosuretyCode', label: '联保人工号', width: 120, align: 'center' },
            { prop: 'employeeName', label: '被联保人姓名', width: 150 },
            { prop: 'employeeCode', label: '被联保人工号', width: 150, align: 'center' },
            { prop: 'status', label: '结果', width: 120, display: {dict: 'EVALUATION_STATUS'}, align: 'center' },
            { prop: 'score', label: '得分', width: 80, align: 'right' },
            { prop: 'cosuretyUnitName', label: '联保人组织', width: 120 },
            { prop: 'cosuretyPostion', label: '联保人职位', width: 120 },
            { prop: 'employeeUnitName', label: '被联保人组织', width: 150 },
            { prop: 'employeePostion', label: '被联保人职位', width: 150 },
            { prop: 'beginDate', label: '开始日期', width: 120, align: 'center', display: { date: '' } },
            { prop: 'endDate', label: '结束日期', width: 120, align: 'center', display: { date: '' } }
          ],
          data: null,
          showPagebar: true,
          info: null,
          total: 0,
          setting: {
            export: {
              config: {
                fileName: '联保人',
                sync: {
                  page: true,
                  select: true,
                  all: false
                }
              },
              key: 'empSuretysAssessmentExport',
              req: config.getAssResult,
              param: () => ({assessmentId: this.resListParams.assessmentId})

            }
          }
        },
        proListParams: {
          assessmentId: ''
        },
        processTable: {
          columns: [
            {label: '被联保人', prop: 'employeeName'}
          ],
          data: null,
          showPagebar: true,
          info: null,
          total: 0,
          setting: {
            // toolbar: [{
            //   text: '一键催评',
            //   type: 'primary',
            //   func: () => this.remindAll()
            // }]
          }
        },
        assessmentId: '',
        visible: {
          newAss: false,
          publishFormVisible: false,
          showAssessmentContent: false,
          unpublish: false,
          showProgress: false,
          endAss: false,
          showResult: false,
          showAss: false,
          showAssEdit: false
        },
        showEnd: false,
        edit: false,
        suretyAssessment: {
          empSuretyAssessmentName: '',
          passMark: '',
          assessmentList: [{
            orderNo: '',
            question: '',
            description: '1分-代表什么；2分-代表什么；3分-代表什么；4分-代表什么；5分-代表什么'
          }]
        },
        init: {
          empSuretyAssessmentName: '',
          passMark: '',
          assessmentList: [{
            orderNo: '',
            question: '',
            description: '1分-代表什么；2分-代表什么；3分-代表什么；4分-代表什么；5分-代表什么'
          }]
        },
        assessment: {},
        // 问卷明细
        assessmentTitle: null,
        assessmentList: null,
        assessmentContent: null,
        assessmentResult: null,
        assessmentProgress: null,
        progressList: null,
        endAssess: false,
        showEdit: false,
        updateEdit: null,
        searchLoading: false,
        searchProgressLoading: false,
        searchResultLoading: false
      }
    },
    created () {
      // this.getAss()
      // this.search()
    },
    mounted () {
      this.table.search = this.listParams
    },
    methods: {
       // 重置搜索条件
      reset () {
        Object.keys(this.listParams).map(item => {
          this.listParams[item] = ''
        })
      },
      // 执行搜索方法
      search () {
        this.table.search = { ...this.listParams }
      },
      handleSizeChange (options) {
        this.getAss(options)
      },
      handleCurrentChange (options) {
        this.getAss(options)
      },
      handleSizeChangeRes (options) {
        options.assessmentId = this.resListParams.assessmentId
        this.getAssessRes(options)
      },
      handleCurrentChangeRes (options) {
        options.assessmentId = this.resListParams.assessmentId
        this.getAssessRes(options)
      },
      handleSizeChangeProgress (options) {
        options.assessmentId = this.proListParams.assessmentId
        this.getAssessentProgress(options)
      },
      handleCurrentChangeProgress (options) {
        options.assessmentId = this.proListParams.assessmentId
        this.getAssessentProgress(options)
      },
      unpublish (item) {
        console.log('触发了撤销发布')
        this.$confirm('确定要撤销发布吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteAss(item)
        }).catch(err => console.log(err))
      },

      postNewAss (data) {
        data.assessmentList.map((item, idx) => {
          item.orderNo = idx + 1
        })
        req('assessment', data)
        .then(data => {
          this.visible.newAss = false
          this.getAss({pageIndex: this.table.info.pageIndex, pageSize: this.table.info.pageSize})
          this.suretyAssessment = {
            empSuretyAssessmentName: '',
            passMark: '',
            assessmentList: [{
              orderNo: '',
              question: '',
              description: '1分-代表什么；2分-代表什么；3分-代表什么；4分-代表什么；5分-代表什么'
            }]
          }
          this.$message.success('新增成功！')
        })
        .catch(err => console.log(err))
      },

      newAss () {
        this.edit = true
        this.visible.newAss = true
      },

      // 发布问卷
      publishNew (item) {
        console.log('触发了发布问卷')
        this.selectedTableScope = item // 点击发布问卷，将该行数据放进selectedTableScope保存起来
        this.visible.publishFormVisible = true
        // console.error(item.empSuretyAssessmentId)
        this.publishId = item.empSuretyAssessmentId
      },
      // 确定发布问卷
      // publishNewAss () {
      //   this.$refs.refPublish.validate((valid) => {
      //     if (valid) {
      //       // console.error('这里是发布的ID', this.publishId.empSuretyAssessmentId)
      //       this.publish.empSuretyAssessmentId = this.publishId
      //       this.publish.orgUnitId = this.publish.orgUnitId.orgUnitId
      //       // console.log(this.publish)
      //       req('publishAssessment', this.publish)
      //       .then(data => {
      //         // console.log(data)
      //         this.visible.publishFormVisible = false
      //         this.getAss()
      //         this.props(this.publish)
      //         this.props(this.date)
      //         this.publishId = ''
      //       })
      //       // .catch(err => {
      //       //   console.log(err)
      //       //   this.$message('发布失败')
      //       // })
      //     } else {
      //       console.log('error submit')
      //       return
      //     }
      //   })
      // },
      handleChangeRes (val) {
        console.log(val)
      },
      props (obj) {
        Object.keys(obj).map((item) => {
          obj[item] = ''
        })
      },

      showAssTitleEdit (item) {
        // console.log('修改问卷', this.visible.showAss)
        let assessmentId = item.empSuretyAssessmentId
        // console.log(assessmentId)
        req('assessmentTitles', {assessmentId})
        .then(data => {
          this.assessmentTitle = data
          if (this.assessmentTitle) {
            this.edit = true
            this.visible.showAssEdit = true
          }
        })
      },

      showAssTitle (item) {
        // console.log(item)
        let assessmentId = item.empSuretyAssessmentId

        req('assessmentTitles', {assessmentId})
        .then(data => {
          this.assessmentTitle = data

          if (this.assessmentTitle) {
            this.edit = false
            this.visible.showAss = true
          }
        })
      },
      change ($event, prop) {
        this.publish[prop] = $event
      },

      updateAss (data, edit) {
        if (edit) {
          this.updateEdit = data

          req('updateAssessment', this.updateEdit)
          .then(data => {
            this.visible.showAssEdit = false
          })
          .catch(err => console.log(err))
        } else {
          this.visible.showAss = false
        }
      },

      deleteAss (item) {
        let assessmentId = item.empSuretyAssessmentId

        req('deleteAssessment', {assessmentId})
        .then(data => {
          this.visible.unpublish = false
          this.getAss({pageIndex: this.table.info.pageIndex, pageSize: this.table.info.pageSize})
        })
        .catch(err => console.log(err))
      },

      // 获取问卷列表
      getAss (options) {
        this.searchLoading = true
        req('assessmentList', options)
        .then(data => {
          this.assessmentList = data
          this.table.data = data.data
          this.table.info = data.info
          this.table.total = data.total
          this.searchLoading = false
        })
        .catch(err => console.log(err))
      },
      // 结束问卷
      endAssessment (item) {
        let assessmentId = item.empSuretyAssessmentId

        req('getOrEnd', {assessmentId})
        .then(data => {
          (data === 0) && (this.showEnd = true)
          this.$confirm(this.showEnd ? '当前评测已完成，确定要结束问卷吗？' : '当前测评未完成，请等待测评完成或者强行结束，确定强行结束吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.finishAss(item)
          }).catch(err => console.log(err))
        })
      },

      finishAss (item) {
        let assessmentId = item.empSuretyAssessmentId

        req('finishAssessment', {assessmentId})
        .then(data => {
          this.getAss({pageIndex: this.table.info.pageIndex, pageSize: this.table.info.pageSize})
          this.visible.endAss = false
        })
        .catch(err => {
          this.$message(err + '结束问卷失败')
          // alert('结束问卷失败', err)
        })
      },

      showAssessProgress (item) {
        this.proListParams.assessmentId = item.empSuretyAssessmentId
        this.getAssessentProgress(this.proListParams)
      },
  
      // 获取问卷进度
      getAssessentProgress (proListParams) {
        this.searchProgressLoading = true
        req('getAssessentProgress', {...proListParams})
        .then(data => {
          Object.keys(data).map(key => {
            this.processTable[key] = data[key]
            this.processTable.data.map(item => {
              item.checkList = []
            })
            this.visible.showProgress = true
          })
          this.searchProgressLoading = false
          // console.log('processTable', this.processTable)
        })
        .catch(err => console.log('获取失败', err))
      },
       // 一键崔评
      remindAll () {
        console.log('一键催评', this.assessmentId)
        req('getRemindInfo', {assessmentId: this.assessmentId})
         .then(res => {
           res ? this.$message('催评成功') : this.$message('催评失败')
         })
      },
      // 催评
      remind (row) {
        if (!row.checkList.length) {
          return this.$message('请选择需要催评的联保人')
        }
        let id = []
        // 根据选中的联保人，拼成Id数组
        row.checkList.map(item => {
          console.log(row.unfinishList)
          row.unfinishList.map(res => {
            if (res.employeeName === item) {
              id.push(res.evaluationId)
            }
          })
        })
        req('postRemindInfo', {
          suretyEvaluationId: id.join(',')
        }, false)
        .then(res => {
          res ? this.$message('催评成功') : this.$message('催评失败')
        })
      },
      getAssessResult (item) {
        this.resListParams.assessmentId = item.empSuretyAssessmentId
        this.getAssessRes(this.resListParams)
      },

      getAssessRes (resListParams) {
        this.searchResultLoading = true
        req('getAssResult', {...resListParams})
        .then(data => {
          Object.keys(data).map(key => {
            this.resTable[key] = data[key]
            this.visible.showResult = true
          })
          this.searchResultLoading = false
          // console.log('问卷列表', listParams)
        })
      },
      showAssess () {
        this.visible.showAssessmentContent = true
        this.getAssessmentContent()
      }
    }

  }

</script>
<style lang="scss" scoped>
.pers-dimission {
  .table-card .table {
    padding: 0;
  }
}
</style>
