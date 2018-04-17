<template>
  <div class="template">
    <i-layout headerKey="pfmTemplatesGet">
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item label="名称">
            <el-input v-model.trim="param.keyword"></el-input>
          </el-form-item>
          <el-form-item label="模版状态">
            <el-select v-model="param.status" placeholder="请选择" clearable >
              <el-option
                v-for="item in statusDict"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </i-form>
      </div>
      <div slot="section">
        <i-dialog
          v-model="dialogFormVisible"
          :title="`${this.type?'修改':'新建'}绩效模版`"
          width="800px"
          size="huge"
          :toolbar="dialogToolbar"
          destroyedWhenClose
        >
          <template-dialog
            :form="form"
            :templateId="templateId"
            @templateDialogVisible="templateDialogVisible"
            :type="type"
            ref="templateEdit"
          >
          </template-dialog>
        </i-dialog>
        <i-dialog
          v-model="dialogFormGetVisible"
          :title="`查看绩效模版`"
          width="800px"
          size="huge"
          :toolbar="dialogToolbar2"
          destroyedWhenClose
        >
          <template-dialog-check :form="form">
          </template-dialog-check>
        </i-dialog>
        <!-- 绩效模板自定义导出 -->
        <i-dialog
          title="导出绩效模板"
          :toolbar="exportToolbar"
          v-model="showTemExport"
          size="small"
          destroyedWhenClose
          ref="iTable"
        >
          <el-form
          :model="exportForm"
          :rules="rules"
          class="export-dialog">
            <el-form-item label="文件名" prop="name" class="export-dialog-item">
              <el-input v-model="exportForm.name"></el-input>
            </el-form-item>
          </el-form>
        </i-dialog>
        <div class="table">
          <i-table
          :table="table"
          @pageSizeChange="handleSizeChange"
          @pageIndexChange="handleCurrentChange">
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="table.data"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column prop="name" label="模版名称" show-overflow-tooltip>
                  <!--<template slot-scope="scope">-->
                  <!--<div slot="reference" class="pointer" @click="oneTemplateGetDetail(scope.row)">-->
                  <!--{{ scope.row.name }}-->
                  <!--</div>-->
                  <!--</template>-->
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" sortable>
                  <template slot-scope="scope">
                    {{scope.row.status | statusFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
               <i-table-operator :table="tableScope" scope></i-table-operator>
              </el-table>
            </template>
          </i-table>
        </div>
      </div>
    </i-layout>
  </div>
</template>
<script>
  import req from 'api/performance/template'
  import templateDialog from './template-dialog.vue'
  import templateDialogCheck from './template-dialog-check.vue'
  import {BASE_URL} from '../../../../../config/api'
  // 查询组件
  import IForm from 'components/common/i-form/i-form.vue'
  import ILayout from 'components/common/i-layout'
  import { selectMutiId, filterId } from 'utils/performance'
  import ITable from 'components/common/i-table'
  import { statusDict } from 'config/dict'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import enableMixin from '../enable-disable-mixin'
  import { createTokenInput } from 'utils/auth'
  
  export default {
    name: 'template',

    mixins: [enableMixin],

    data () {
      return {
        table: {
          data: [],
          setting: {
            toolbar: [{
              text: '新建',
              type: 'primary',
              key: 'pfmTemplatePost',
              func: () => this.addNewTemplate()
            },
            //  {
            //   text: '启用',
            //   type: 'default',
            //   key: 'pfmTemplatesEnablePost',
            //   func: scope => this.startMuti()
            // }, {
            //   text: '禁用',
            //   type: 'default',
            //   key: 'pfmTemplatesDisablePost',
            //   func: () => this.forbidMuti()
            // },
            {
              text: '删除',
              type: 'default',
              key: 'pfmTemplatesDelete',
              func: () => this.removeMuti()
            }, {
              text: '导出',
              type: 'success',
              key: 'pfmTemplateExport',
              func: () => this.showExportDialog()
            }],
            operator: [
              {
                text: '查看',
                key: 'pfmTemplateGet',
                func: scope => this.oneTemplateGetDetail(scope.row)
              },
              {
                text: '修改',
                key: 'pfmTemplatePut',
                func: scope => this.oneTemplateDetail(scope.row)
              },
              {
                text: '启用',
                type: 'default',
                key: 'pfmTemplatesEnablePost',
                func: scope => this.startMuti(scope, req, 'templateId', 'enabledTemplates'),
                show: (row) => row.status === '1' && {empty: true}
              }, {
                text: '禁用',
                type: 'default',
                key: 'pfmTemplatesDisablePost',
                func: scope => this.forbidMuti(scope, req, 'templateId', 'disabledTemplates'),
                show: (row) => row.status === '0' && {empty: true}
              },
              {
                text: '删除',
                key: 'pfmTemplatesDelete',
                type: 'danger',
                func: scope => this.removeOne(scope.row, scope.$index)
              }
            ]
          },
          info: null,
          search: null,
          total: 0, //  后台获取到的total个数
          showPagebar: true,
          dialogToolbar: [
            {
              text: '取消',
              func: done => {
                this.handleCancel(done)
              }
            },
            {
              text: '保存',
              func: done => {
                this.handleSave(done)
              }
            }
          ]
        },
        statusDict: statusDict,
        templateId: '',
        multiSelection: [],
        dialogFormVisible: false,
        dialogFormGetVisible: false,
        showTemExport: false, // 控制导出对话框
        exportForm: {
          name: null
        },
        rules: { // 模板导出校验
          name: {required: true, message: '请输入导出的文件名', trigger: 'blur'}
        },
        form: {
          name: '',
          description: '',
          checkedPeriod: [],
          kpi: {
            isChecked: false,
            weight: 0
          },
          keyEvent: {
            isChecked: false
          },
          keyWork: {
            isChecked: false,
            weight: 0
          },
          evaluationMethod: '',
          standardId: '',
          standardName: '',
          status: 1
        },
        // 查询条件
        param: {
          status: '',
          keyword: ''
        },
        type: 0,
        dialogToolbar: [
          {
            text: '取消',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '保存',
            func: done => {
              this.handleSave(done)
            }
          }
        ],
        dialogToolbar2: [
          {
            text: '返回',
            func: done => {
              this.handleCancel(done)
            }
          }
        ],
        exportToolbar: [
          {
            text: '取消',
            func: done => done()
          },
          {
            text: '确定',
            func: done => this.doExport(done)
          }
        ]
      }
    },
    components: {
      templateDialog,
      templateDialogCheck,
      IForm,
      ITable,
      ILayout,
      IDialog
    },
    mounted () {
      this.search()
    },
    filters: {
      statusFilter (status) {
        const statusMap = {
          0: '无效',
          1: '有效'
        }
        return statusMap[status]
      }
    },
    methods: {
      reset () {
        // 在这里写重置逻辑
        this.param = {
          status: '',
          keyword: ''
        }
//        this.getTemplateList()
      },
      // 搜索按钮
      search (val) {
        // this.getTemplateList()
        this.table.search = {...this.param}
      },
      handleSelectionChange (val) {
        this.multiSelection = val
      },
      handleCurrentChange (opts) {
        // this.table.info = opts
        this.getTemplateList(opts)
      },
      // 分页器每页显示几个
      handleSizeChange (opts) {
        // this.table.info = opts
        this.getTemplateList(opts)
      },

      // 模板导出
      showExportDialog () {
        if (this.multiSelection.length > 0) {
          this.showTemExport = true
        } else {
          this.$message({
            message: '请选择一个',
            type: 'warning'
          })
        }
      },

      doExport (done) {
        var temp = document.createElement('form')
        temp.action = `${BASE_URL}/performance/templates/${this.exportForm.name}/export`
        temp.method = 'post'
        temp.style.display = 'none'
        var el = document.createElement('input')
        el.name = 'data'
        el.value = this.multiSelection.map(ele => ele.templateId).join(',')
        temp.appendChild(el)
        temp.appendChild(createTokenInput())
        document.body.appendChild(temp)
        temp.submit()
        document.body.removeChild(temp)
        done()
      },

      start (rowData) {
        this.$confirm('确定启用绩效模板吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.templateId) {
            rowData.status = 1
            req('enabledTemplates', [rowData.templateId]).then((data) => {
              this.$message({
                message: '恭喜你，启用成功',
                type: 'success'
              })
              this.getTemplateList(this.table.info)
            }).catch((err) => {
              console.log(err)
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
      },
      // startMuti () {
      //   if (this.multiSelection.toString()) {
      //     let templateIdArr = selectMutiId(this.multiSelection, 'templateId')
      //     let isAllTrue = this.multiSelection.map((val, index) => {
      //       return val.status
      //     })
      //     this.$confirm('确定启用绩效模板吗？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消'
      //     }).then(() => {
      //       if (isAllTrue.includes('1') || isAllTrue.includes(1)) {
      //         this.$message({
      //           message: '所选值含有启用状态,请重选',
      //           type: 'warning'
      //         })
      //         return
      //       }
      //       req('enabledTemplates', templateIdArr).then((data) => {
      //         filterId(templateIdArr, this.table.data, 'templateId', 'enable')
      //         this.$message({
      //           message: '恭喜你，启用成功',
      //           type: 'success'
      //         })
      //         this.getTemplateList(this.table.info)
      //       }).catch((err) => {
      //         console.log(err)
      //       })
      //       // 拿着这个id去删除,然后重新获取listArr
      //       return
      //     }).catch(() => {
      //       this.$message({
      //         type: 'info',
      //         message: '已取消启用'
      //       })
      //     })
      //   } else {
      //     this.$message({
      //       message: '请至少选择一个绩效模版',
      //       type: 'warning'
      //     })
      //   }
      // },
      forbid (rowData) {
        this.$confirm('确定禁用绩效模板吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.templateId) {
            req('disabledTemplates', [rowData.templateId]).then((data) => {
              rowData.status = 0
              this.$message({
                message: '恭喜你，禁用成功',
                type: 'success'
              })
              this.getTemplateList(this.table.info)
            }).catch((err) => {
              console.log(err)
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消禁用'
          })
        })
      },
      // forbidMuti () {
      //   if (this.multiSelection.toString()) {
      //     let templateIdArr = selectMutiId(this.multiSelection, 'templateId')
      //     let isAllTrue = this.multiSelection.map((val, index) => {
      //       return val.status
      //     })
      //     // 拿着这个id去删除,然后重新获取listArr
      //     this.$confirm('确定禁用绩效模板吗？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消'
      //     }).then(() => {
      //       if (isAllTrue.includes('0') || isAllTrue.includes(0)) {
      //         this.$message({
      //           message: '所选值含有禁用状态,请重选',
      //           type: 'warning'
      //         })
      //         return
      //       }
      //       req('disabledTemplates', templateIdArr).then((data) => {
      //         filterId(templateIdArr, this.table.data, 'templateId', 'disable')
      //         this.$message({
      //           message: '恭喜你，禁用成功',
      //           type: 'success'
      //         })
      //         this.getTemplateList()
      //       }).catch((err) => {
      //         console.log(err)
      //       })
      //       return
      //     }).catch(() => {
      //       this.$message({
      //         type: 'info',
      //         message: '已取消禁用'
      //       })
      //     })
      //   } else {
      //     this.$message({
      //       message: '请至少选择一个绩效模版',
      //       type: 'warning'
      //     })
      //   }
      // },
      addNewTemplate () {
        this.form = {
          name: '',
          description: '',
          checkedPeriod: [],
          kpi: {
            isChecked: false,
            weight: 0
          },
          keyEvent: {
            isChecked: false
          },
          keyWork: {
            isChecked: false,
            weight: 0
          },
          evaluationMethod: '',
          standardId: '',
          standardName: '',
          month: {
            isCurrent4PlanStart: '',
            planBeginDay: '',
            isMakePlan: '',
            leaderEvaluationWeight: 0,
            period: [],
            selfEvaluationWeight: 0,
            isCurrent4EvaluationBegin: '',
            evaluationBeginDay: '',
            isCurrent4EvaluationEnd: '',
            evaluationEndDay: '',
            isChecked: false
          },
          quarter: {
            evaluationBeginDate: '',
            evaluationEndDate: '',
            isMakePlan: '',
            leaderEvaluationWeight: 0,
            period: [],
            firstPlanBeginDate: '',
            secondPlanBeginDate: '',
            thirdPlanBeginDate: '',
            fourPlanBeginDate: '',
            selfEvaluationWeight: 0,
            isCalculateByChildren: '',
            firstEvaluationBeginDate: '',
            firstEvaluationEndDate: '',
            fourEvaluationBeginDate: '',
            fourEvaluationEndDate: '',
            secondEvaluationBeginDate: '',
            secondEvaluationEndDate: '',
            thirdEvaluationBeginDate: '',
            thirdEvaluationEndDate: '',
            isChecked: false
          },
          halfYear: {
            evaluationBeginDate: '',
            evaluationEndDate: '',
            isCalculateByChildren: '',
            isMakePlan: '',
            leaderEvaluationWeight: 0,
            period: [],
            lastPlanBeginDate: '',
            nextPlanBeginDate: '',
            selfEvaluationWeight: 0,
            lastEvaluationBeginDate: '',
            lastEvaluationEndDate: '',
            nextEvaluationBeginDate: '',
            nextEvaluationEndDate: '',
            isChecked: false
          },
          year: {
            evaluationBeginDate: '',
            evaluationEndDate: '',
            isCalculateByChildren: '',
            isMakePlan: '',
            leaderEvaluationWeight: 0,
            period: [],
            planBeginDate: '',
            selfEvaluationWeight: 0,
            isChecked: false
          },

          status: 1
        }
        this.type = 0
        this.dialogFormVisible = true
      },
      removeMuti () {
        if (this.multiSelection.toString()) {
          let templateIdArr = selectMutiId(this.multiSelection, 'templateId')
          // 拿着这个id去删除,然后重新获取listArr
          this.$confirm('确定删除绩效模板吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            req('deleteTemplates', templateIdArr).then((data) => {
              filterId(templateIdArr, this.table.data, 'templateId', 'delete')
              this.$message({
                message: '恭喜你，删除成功',
                type: 'success'
              })
              this.getTemplateList()
            }).catch((err) => {
              console.log(err)
            })
            return
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          this.$message({
            message: '请至少选择一个绩效模版',
            type: 'warning'
          })
        }
      },
      removeOne (rowData, index) {
        this.$confirm('确定删除绩效模板吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.templateId) {
            req('deleteTemplates', [rowData.templateId]).then((data) => {
              this.table.data.splice(index, 1)
              this.$message({
                message: '恭喜你，删除成功',
                type: 'success'
              })
              this.getTemplateList()
            }).catch((err) => {
              console.log(err)
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      oneTemplateDetail ({templateId}) {
        if (templateId) {
          req('oneTemplateDetail', {templateId: templateId}).then((data) => {
            if (data.month.length) {
              data.month = {
                isCurrent4PlanStart: data.month[0].isCurrent4PlanStart,
                planBeginDay: data.month[0].planBeginDay,
                isMakePlan: data.month[0].isMakePlan,
                leaderEvaluationWeight: data.month[0].leaderEvaluationWeight,
                period: data.month.map(val => val.period),
                selfEvaluationWeight: data.month[0].selfEvaluationWeight,
                isCurrent4EvaluationBegin: data.month[0].isCurrent4EvaluationBegin,
                evaluationBeginDay: data.month[0].evaluationBeginDay,
                isCurrent4EvaluationEnd: data.month[0].isCurrent4EvaluationEnd,
                evaluationEndDay: data.month[0].evaluationEndDay,
                isChecked: true
              }
            } else {
              data.month = {
                isCurrent4PlanStart: '',
                planBeginDay: '',
                isMakePlan: '',
                leaderEvaluationWeight: 0,
                period: [],
                selfEvaluationWeight: 0,
                isCurrent4EvaluationBegin: '',
                evaluationBeginDay: '',
                isCurrent4EvaluationEnd: '',
                evaluationEndDay: '',
                isChecked: false
              }
            }
            if (data.quarter.length) {
              let quarter = {
                isMakePlan: data.quarter[0].isMakePlan,
                isCalculateByChildren: data.quarter[0].isCalculateByChildren,
                selfEvaluationWeight: data.quarter[0].selfEvaluationWeight,
                leaderEvaluationWeight: data.quarter[0].leaderEvaluationWeight,
                period: data.quarter.map(val => val.period),
                isChecked: true,
                firstPlanBeginDate: '',
                firstEvaluationBeginDate: '',
                firstEvaluationEndDate: '',
                secondPlanBeginDate: '',
                secondEvaluationBeginDate: '',
                secondEvaluationEndDate: '',
                thirdPlanBeginDate: '',
                thirdEvaluationBeginDate: '',
                thirdEvaluationEndDate: '',
                fourPlanBeginDate: '',
                fourEvaluationBeginDate: '',
                fourEvaluationEndDate: ''
              }
              data.quarter.forEach((val, index) => {
                if (val.period === '4') {
                  quarter.firstPlanBeginDate = val.planBeginDate ? new Date(val.planBeginDate) : ''
                  quarter.firstEvaluationBeginDate = val.evaluationBeginDate ? new Date(val.evaluationBeginDate) : ''
                  quarter.firstEvaluationEndDate = val.evaluationEndDate ? new Date(val.evaluationEndDate) : ''
                }
                if (val.period === '8') {
                  quarter.secondPlanBeginDate = val.planBeginDate ? new Date(val.planBeginDate) : ''
                  quarter.secondEvaluationBeginDate = val.evaluationBeginDate ? new Date(val.evaluationBeginDate) : ''
                  quarter.secondEvaluationEndDate = val.evaluationEndDate ? new Date(val.evaluationEndDate) : ''
                }
                if (val.period === '13') {
                  quarter.thirdPlanBeginDate = val.planBeginDate ? new Date(val.planBeginDate) : ''
                  quarter.thirdEvaluationBeginDate = val.evaluationBeginDate ? new Date(val.evaluationBeginDate) : ''
                  quarter.thirdEvaluationEndDate = val.evaluationEndDate ? new Date(val.evaluationEndDate) : ''
                }
                if (val.period === '17') {
                  quarter.fourPlanBeginDate = val.planBeginDate ? new Date(val.planBeginDate) : ''
                  quarter.fourEvaluationBeginDate = val.evaluationBeginDate ? new Date(val.evaluationBeginDate) : ''
                  quarter.fourEvaluationEndDate = val.evaluationEndDate ? new Date(val.evaluationEndDate) : ''
                }
              })
              data.quarter = quarter
            } else {
              data.quarter = {
                evaluationBeginDate: '',
                evaluationEndDate: '',
                isMakePlan: '',
                leaderEvaluationWeight: 0,
                period: [],
                firstPlanBeginDate: '',
                secondPlanBeginDate: '',
                thirdPlanBeginDate: '',
                fourPlanBeginDate: '',
                selfEvaluationWeight: 0,
                isCalculateByChildren: '',
                firstEvaluationBeginDate: '',
                firstEvaluationEndDate: '',
                fourEvaluationBeginDate: '',
                fourEvaluationEndDate: '',
                secondEvaluationBeginDate: '',
                secondEvaluationEndDate: '',
                thirdEvaluationBeginDate: '',
                thirdEvaluationEndDate: '',
                isChecked: false
              }
            }
            if (data.halfYear.length) {
              let halfYear = {
                isMakePlan: data.halfYear[0].isMakePlan,
                isCalculateByChildren: data.halfYear[0].isCalculateByChildren,
                selfEvaluationWeight: data.halfYear[0].selfEvaluationWeight,
                leaderEvaluationWeight: data.halfYear[0].leaderEvaluationWeight,
                period: data.halfYear.map(val => val.period),
                isChecked: true,
                lastPlanBeginDate: '',
                lastEvaluationBeginDate: '',
                lastEvaluationEndDate: '',
                nextPlanBeginDate: '',
                nextEvaluationBeginDate: '',
                nextEvaluationEndDate: ''
              }
              data.halfYear.forEach((val, index) => {
                if (val.period === '9') {
                  halfYear.lastPlanBeginDate = val.planBeginDate ? new Date(val.planBeginDate) : ''
                  halfYear.lastEvaluationBeginDate = val.evaluationBeginDate ? new Date(val.evaluationBeginDate) : ''
                  halfYear.lastEvaluationEndDate = val.evaluationEndDate ? new Date(val.evaluationEndDate) : ''
                }
                if (val.period === '18') {
                  halfYear.nextPlanBeginDate = val.planBeginDate ? new Date(val.planBeginDate) : ''
                  halfYear.nextEvaluationBeginDate = val.evaluationBeginDate ? new Date(val.evaluationBeginDate) : ''
                  halfYear.nextEvaluationEndDate = val.evaluationEndDate ? new Date(val.evaluationEndDate) : ''
                }
              })
              data.halfYear = halfYear
            } else {
              data.halfYear = {
                evaluationBeginDate: '',
                evaluationEndDate: '',
                isCalculateByChildren: '',
                isMakePlan: '',
                leaderEvaluationWeight: 0,
                period: [],
                lastPlanBeginDate: '',
                nextPlanBeginDate: '',
                selfEvaluationWeight: 0,
                lastEvaluationBeginDate: '',
                lastEvaluationEndDate: '',
                nextEvaluationBeginDate: '',
                nextEvaluationEndDate: '',
                isChecked: false
              }
            }
            if (data.year.length) {
              data.year = {
                isMakePlan: data.year[0].isMakePlan,
                isCalculateByChildren: data.year[0].isCalculateByChildren,
                selfEvaluationWeight: data.year[0].selfEvaluationWeight,
                leaderEvaluationWeight: data.year[0].leaderEvaluationWeight,
                planBeginDate: new Date(data.year[0].planBeginDate),
                evaluationBeginDate: data.year[0].evaluationBeginDate ? new Date(data.year[0].evaluationBeginDate) : '',
                evaluationEndDate: data.year[0].evaluationEndDate ? new Date(data.year[0].evaluationEndDate) : '',
                period: [data.year[0].period],
                isChecked: true
              }
            } else {
              data.year = {
                evaluationBeginDate: '',
                evaluationEndDate: '',
                isCalculateByChildren: '',
                isMakePlan: '',
                leaderEvaluationWeight: 0,
                period: [],
                planBeginDate: '',
                selfEvaluationWeight: 0,
                isChecked: false
              }
            }
//            // 计划
            this.form = data
            delete this.form.templateId
            this.type = 1
            this.templateId = templateId
            this.dialogFormVisible = true
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      getTemplateList (opts) {
        req('templateList', opts).then((res) => {
          Object.assign(this.table, res)
        }).catch((err) => {
          console.log(err)
        })
      },
      oneTemplateGetDetail ({templateId}) {
        if (templateId) {
          req('oneTemplateDetail', {templateId: templateId}).then((data) => {
            if (data.month.length) {
              data.month = {
                isCurrent4PlanStart: data.month[0].isCurrent4PlanStart,
                planBeginDay: data.month[0].planBeginDay,
                isMakePlan: data.month[0].isMakePlan,
                leaderEvaluationWeight: data.month[0].leaderEvaluationWeight,
                period: data.month.map(val => val.period),
                selfEvaluationWeight: data.month[0].selfEvaluationWeight,
                isCurrent4EvaluationBegin: data.month[0].isCurrent4EvaluationBegin,
                evaluationBeginDay: data.month[0].evaluationBeginDay,
                isCurrent4EvaluationEnd: data.month[0].isCurrent4EvaluationEnd,
                evaluationEndDay: data.month[0].evaluationEndDay,
                isChecked: true
              }
            } else {
              data.month = {
                isCurrent4PlanStart: '',
                planBeginDay: '',
                isMakePlan: '',
                leaderEvaluationWeight: 0,
                period: [],
                selfEvaluationWeight: 0,
                isCurrent4EvaluationBegin: '',
                evaluationBeginDay: '',
                isCurrent4EvaluationEnd: '',
                evaluationEndDay: '',
                isChecked: false
              }
            }
            if (data.quarter.length) {
              let quarter = {
                isMakePlan: data.quarter[0].isMakePlan,
                isCalculateByChildren: data.quarter[0].isCalculateByChildren,
                selfEvaluationWeight: data.quarter[0].selfEvaluationWeight,
                leaderEvaluationWeight: data.quarter[0].leaderEvaluationWeight,
                period: data.quarter.map(val => val.period),
                isChecked: true,
                firstPlanBeginDate: '',
                firstEvaluationBeginDate: '',
                firstEvaluationEndDate: '',
                secondPlanBeginDate: '',
                secondEvaluationBeginDate: '',
                secondEvaluationEndDate: '',
                thirdPlanBeginDate: '',
                thirdEvaluationBeginDate: '',
                thirdEvaluationEndDate: '',
                fourPlanBeginDate: '',
                fourEvaluationBeginDate: '',
                fourEvaluationEndDate: ''
              }
              data.quarter.forEach((val, index) => {
                if (val.period === '4') {
                  quarter.firstPlanBeginDate = new Date(val.planBeginDate)
                  quarter.firstEvaluationBeginDate = new Date(val.evaluationBeginDate)
                  quarter.firstEvaluationEndDate = new Date(val.evaluationEndDate)
                }
                if (val.period === '8') {
                  quarter.secondPlanBeginDate = new Date(val.planBeginDate)
                  quarter.secondEvaluationBeginDate = new Date(val.evaluationBeginDate)
                  quarter.secondEvaluationEndDate = new Date(val.evaluationEndDate)
                }
                if (val.period === '13') {
                  quarter.thirdPlanBeginDate = new Date(val.planBeginDate)
                  quarter.thirdEvaluationBeginDate = new Date(val.evaluationBeginDate)
                  quarter.thirdEvaluationEndDate = new Date(val.evaluationEndDate)
                }
                if (val.period === '17') {
                  quarter.fourPlanBeginDate = new Date(val.planBeginDate)
                  quarter.fourEvaluationBeginDate = new Date(val.evaluationBeginDate)
                  quarter.fourEvaluationEndDate = new Date(val.evaluationEndDate)
                }
              })
              data.quarter = quarter
            } else {
              data.quarter = {
                evaluationBeginDate: '',
                evaluationEndDate: '',
                isMakePlan: '',
                leaderEvaluationWeight: 0,
                period: [],
                firstPlanBeginDate: '',
                secondPlanBeginDate: '',
                thirdPlanBeginDate: '',
                fourPlanBeginDate: '',
                selfEvaluationWeight: 0,
                isCalculateByChildren: '',
                firstEvaluationBeginDate: '',
                firstEvaluationEndDate: '',
                fourEvaluationBeginDate: '',
                fourEvaluationEndDate: '',
                secondEvaluationBeginDate: '',
                secondEvaluationEndDate: '',
                thirdEvaluationBeginDate: '',
                thirdEvaluationEndDate: '',
                isChecked: false
              }
            }
            if (data.halfYear.length) {
              let halfYear = {
                isMakePlan: data.halfYear[0].isMakePlan,
                isCalculateByChildren: data.halfYear[0].isCalculateByChildren,
                selfEvaluationWeight: data.halfYear[0].selfEvaluationWeight,
                leaderEvaluationWeight: data.halfYear[0].leaderEvaluationWeight,
                period: data.halfYear.map(val => val.period),
                isChecked: true,
                lastPlanBeginDate: '',
                lastEvaluationBeginDate: '',
                lastEvaluationEndDate: '',
                nextPlanBeginDate: '',
                nextEvaluationBeginDate: '',
                nextEvaluationEndDate: ''
              }
              data.halfYear.forEach((val, index) => {
                if (val.period === '9') {
                  halfYear.lastPlanBeginDate = new Date(val.planBeginDate)
                  halfYear.lastEvaluationBeginDate = new Date(val.evaluationBeginDate)
                  halfYear.lastEvaluationEndDate = new Date(val.evaluationEndDate)
                }
                if (val.period === '18') {
                  halfYear.nextPlanBeginDate = new Date(val.planBeginDate)
                  halfYear.nextEvaluationBeginDate = new Date(val.evaluationBeginDate)
                  halfYear.nextEvaluationEndDate = new Date(val.evaluationEndDate)
                }
              })
              data.halfYear = halfYear
            } else {
              data.halfYear = {
                evaluationBeginDate: '',
                evaluationEndDate: '',
                isCalculateByChildren: '',
                isMakePlan: '',
                leaderEvaluationWeight: 0,
                period: [],
                lastPlanBeginDate: '',
                nextPlanBeginDate: '',
                selfEvaluationWeight: 0,
                lastEvaluationBeginDate: '',
                lastEvaluationEndDate: '',
                nextEvaluationBeginDate: '',
                nextEvaluationEndDate: '',
                isChecked: false
              }
            }
            if (data.year.length) {
              data.year = {
                isMakePlan: data.year[0].isMakePlan,
                isCurrent4PlanStart: data.year[0].isCurrent4PlanStart,
                isCalculateByChildren: data.year[0].isCalculateByChildren,
                selfEvaluationWeight: data.year[0].selfEvaluationWeight,
                leaderEvaluationWeight: data.year[0].selfEvaluationWeight,
                planBeginDate: new Date(data.year[0].planBeginDate),
                evaluationBeginDate: new Date(data.year[0].evaluationBeginDate),
                evaluationEndDate: new Date(data.year[0].evaluationEndDate),
                period: [data.year[0].period],
                isChecked: true
              }
            } else {
              data.year = {
                evaluationBeginDate: '',
                evaluationEndDate: '',
                isCalculateByChildren: '',
                isMakePlan: '',
                leaderEvaluationWeight: 0,
                period: [],
                planBeginDate: '',
                selfEvaluationWeight: 0,
                isChecked: false
              }
            }
//            // 计划
            this.form = data
            delete this.form.templateId
            this.type = 1
            this.templateId = templateId
            this.dialogFormGetVisible = true
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      templateDialogVisible (val, formData, type) {
        this.dialogFormVisible = val
        if (formData && type === 0) {
          formData.status = 1
          req('addOneTemplate', formData).then((data) => {
            // 要根据后台返回的值
            formData.templateId = data
            this.$message({
              message: '恭喜你，添加成功',
              type: 'success'
            })
            this.getTemplateList(this.table.info)
          })
        } else if (formData && type === 1) {
          req('modifiedTemplate', {templateId: this.templateId, ...formData}).then((data) => {
            for (let i = 0; i < this.table.data.length; i++) {
              if (this.templateId === this.table.data[i].templateId) {
                this.table.data.splice(i, 1, {templateId: this.templateId, ...formData})
                this.$message({
                  message: '恭喜你，修改成功',
                  type: 'success'
                })
              }
            }
            this.dialogFormVisible = false
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      templateDialogGetVisible (val) {
        this.dialogFormGetVisible = val
      },
      // 确认按钮
      handleSave (done) {
        this.$refs.templateEdit.save().then(res => {
          if (res) {
            this.getTemplateList(this.table.info)
            done()
          }
        })
      },
      // 取消按钮
      handleCancel (done) {
        done()
      }
    }
  }
</script>
<style scoped lang="scss">
  .pointer {
    cursor: pointer;
  }
  .export-dialog {
    vertical-align: middle;
  }
  .export-dialog-item {
    display: flex;
    margin: 0 auto;
    width: 80%;
    justify-content: space-around;
  }
</style>
