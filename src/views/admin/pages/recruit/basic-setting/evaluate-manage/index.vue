<template>
  <div class="evaluate">
    <i-layout headerKey="rctEvaOptionsListGet">
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item label="评估类型">
            <i-select v-model="param.optionType" clearable parameter="EVALUATION_OPTION_TYPE" placeholder="请选择"></i-select>
          </el-form-item>
          <el-form-item label="状态">
            <i-select v-model="param.status" clearable parameter="IS_VALID" placeholder="请选择"></i-select>
          </el-form-item>
        </i-form>
      </div>
      <div slot="section">
        <div class="table">
          <i-dialog
          v-model="dialogFormVisible"
          :title="`${this.type?'修改':'新建'}评估项`"
          :toolbar="dialogToolbar"
          destroyedWhenClose
          size="huge"
          width="600px"
          class="i-dialog-width-600">
            <evaluate-dialog
            :form="form"
            :evaluationOptionId="evaluationOptionId"
            :type="type"
            ref="evaluatEdit">
            </evaluate-dialog>
          </i-dialog>
          <i-dialog
          v-model="dialogCheckVisible"
          :title="`查看评估项`"
          :toolbar="dialogToolbar2"
          destroyedWhenClose
          size="huge"
          width="600px"
          class="i-dialog-width-600">
            <evaluate-dialog-check
            :form="form"
            :evaluationOptionId="evaluationOptionId"
            :type="type">
            </evaluate-dialog-check>
          </i-dialog>
          <i-table :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
            <template slot="table" slot-scope="tableScope">
              <el-table :data="table.data"
               v-loading="loading"
               :element-loading-text="$loadingText"
               @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column prop="optionType" label="评估类型" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.optionType | optionTypeFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="评估项" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="状态" sortable>
                  <template slot-scope="scope">
                    {{scope.row.status | statusFilter}}
                  </template>
                </el-table-column>
                <i-table-operator :table="tableScope"/>
                <!-- <el-table-column label="操作" align="center" v-if="operatorColumn">
                  <template slot-scope="scope">
                    <i-table-operator @accessControl="accessControl" :table="tableScope" :row="scope.row"></i-table-operator>
                    <el-button type="text" @click="seeEvaluate(scope.row)">查看</el-button>
                    <el-button type="text" @click="updateEvaluate(scope.row)">修改</el-button>
                    <el-button type="text" @click="deleteOneEvaluate(scope.row,scope.$index)">删除</el-button>
                  </template>
                </el-table-column> -->
              </el-table>
            </template>
          </i-table>
        </div>
      </div>
    </i-layout>
  </div>
</template>
<script type="text/javascript">
  // 公共组件
  import access from 'mixins/access'
  import { selectMutiId, filterId } from 'utils/performance'
  import req from 'api/recruit/index.js'
  import evaluateDialog from './components/evaluate-dialog'
  import evaluateDialogCheck from './components/evaluate-dialog-check'
  import { statusDict } from 'config/dict'
  export default {
    name: 'EvaluateManage',
    filters: {
      statusFilter (status) {
        const statusMap = {
          0: '无效',
          1: '有效'
        }
        return statusMap[status]
      },
      optionTypeFilter (optionType) {
        const optionTypeMap = {
          1: '综合素质',
          2: '岗位胜任能力',
          3: '企业文化匹配'
        }
        return optionTypeMap[optionType]
      }
    },
    components: {
      evaluateDialog,
      evaluateDialogCheck
    },
    mixins: [access],
    data () {
      return {
        loading: false,
        param: {
          optionType: '',
          status: ''
        },
        statusDict: statusDict,
        dialogFormVisible: false, // 修改或新建弹出框不可见
        dialogCheckVisible: false, // 查看弹框不可见
        type: 0, // 0为新建 1为修改
        evaluationOptionId: '',
        multiSelection: [],
        dialogToolbar: [{
          text: '取消',
          type: 'default',
          func: done => {
            this.handleCancel(done)
          }
        }, {
          text: '保存',
          loading: false,
          func: done => {
            this.handleSave(done)
          }
        }],
        dialogToolbar2: [{
          text: '返回',
          func: done => {
            this.handleCancel(done)
          }
        }],
        table: {
          data: [],
          setting: {
            toolbar: [{
              text: '新建',
              type: 'primary',
              key: 'rctEvaOptionCreatePost',
              func: () => this.addNewEvaluate()
            },
            // {
            //   text: '启用',
            //   type: 'default',
            //   key: 'rctEvaOptionsEnabledPost',
            //   func: () => this.startMutiEvaluate()
            // }, {
            //   text: '禁用',
            //   type: 'default',
            //   key: 'rctEvaOptionsDisabledPost',
            //   func: () => this.forbidMutiEvaluate()
            // },
            {
              text: '删除',
              type: 'default',
              key: 'rctEvaOptionsDeletePut',
              func: () => this.deleteMutiEvaluate()
            }],
            operator: [{
              text: '查看',
              key: 'rctEvaOptionSelectGet',
              func: this.seeEvaluate
            }, {
              text: '修改',
              key: 'rctEvaOptionUpdatePut',
              func: this.updateEvaluate
            },
            {
              text: '启用',
              key: 'rctEvaOptionsEnabledPost',
              func: this.oneStartEvaluate,
              show (row) {
                if (row.status !== '0') {
                  return {
                    empty: true
                  }
                }
              }
            },
            {
              text: '禁用',
              key: 'rctEvaOptionsDisabledPost',
              func: this.oneForbidEvaluate,
              show (row) {
                if (row.status !== '1') {
                  return {
                    empty: true
                  }
                }
              }
            },
            {
              text: '删除',
              key: 'rctEvaOptionsDeletePut',
              func: this.deleteOneEvaluate
            }]
          },
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        },
        form: { // 弹出框的表单
          optionType: '',
          status: '',
          description: ''
        }
      }
    },
    mounted () {
      this.search()
    },
    methods: {
      getEvaluateList (opts) {
        req('evaluateList', {
          ...opts,
          status: this.param.status.toString(),
          optionType: this.param.optionType.toString()
        }).then((res) => {
          Object.assign(this.table, res)
          this.loading = false
          // console.log(this.table.data)
        }).catch((err) => {
          this.loading = false
          console.log(err)
        })
      },
      reset () {
        this.param = {
          optionType: '',
          status: ''
        }
      },
      search (val) {
        this.table.search = {...this.param}
      },
      // 多选
      handleSelectionChange (val) {
        this.multiSelection = val
      },
       // 当分页器页码变动时调用
      handleCurrentChange (opts) {
        this.loading = true
        // this.table.info = opts
        this.getEvaluateList(opts)
      },
      // 分页器每页显示几个
      handleSizeChange (opts) {
        this.loading = true
        // this.table.info = opts
        this.getEvaluateList(opts)
      },
      addNewEvaluate () {
        this.form = { // 弹出框的表单
          optionType: '',
          status: '',
          description: ''
        }
        this.dialogFormVisible = true
        this.type = 0
      },
      handleCancel (done) {
        done()
      },
      handleSave (done) {
        this.dialogToolbar[1].loading = true
        this.$refs.evaluatEdit.save().then(res => {
          this.getEvaluateList()
          done()
          this.dialogToolbar[1].loading = false
        }).catch(() => {
          this.dialogToolbar[1].loading = false
        })
      },
      updateEvaluate (row) {
        let evaluationOptionId = row.evaluationOptionId
        console.log(row)
        if (evaluationOptionId) {
          if (row.isUse === 'Y') {
            this.$message.warning('所选值含是占用状态,不可修改')
            return
          } else {
            req('seeEvaluate', {evaluationOptionId: evaluationOptionId}).then((res) => {
              let {optionType, status, description} = res
              this.form = {
                optionType: optionType,
                status: status,
                description: description
              }
              this.dialogFormVisible = true
              this.type = 1
              this.evaluationOptionId = row.evaluationOptionId
            })
          }
        }
      },
      seeEvaluate (row) {
        let evaluationOptionId = row.evaluationOptionId
        if (evaluationOptionId) {
          req('seeEvaluate', {evaluationOptionId: evaluationOptionId}).then((res) => {
            console.log(res)
            let {optionType, status, description} = res
            this.form = {
              optionType: optionType,
              status: status,
              description: description
            }
            this.dialogCheckVisible = true
          })
        }
      },
      deleteOneEvaluate (rowData, index) {
        if (rowData.isUse === 'Y') {
          this.$message.warning('所选值含是占用状态,不可删除')
          return
        } else {
          this.$confirm('确定删除评估项吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            console.log(rowData)
            if (rowData.evaluationOptionId) {
              req('deleteEvaluate', [rowData.evaluationOptionId]).then((data) => {
                this.table.data.splice(index, 1)
                this.$message({
                  message: '恭喜你，删除成功',
                  type: 'success'
                })
                this.getEvaluateList()
              }).catch((err) => {
                console.log(err)
              })
              return
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
       // 删除多个
      deleteMutiEvaluate () {
        if (this.multiSelection.length > 0) {
          let evaluateIdArr = selectMutiId(this.multiSelection, 'evaluationOptionId')
          // 拿着这个id去删除,然后重新获取listArr
          this.$confirm('确定删除评估项吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            for (let i of this.multiSelection) {
              if (i.isUse === 'Y') {
                this.$message.warning('所选值含有占用状态,不可删除,请重选')
                return
              }
            }
            req('deleteEvaluate', evaluateIdArr).then((data) => {
              filterId(evaluateIdArr, this.table.data, 'evaluationOptionId', 'delete')
              this.$message({
                message: '恭喜你，删除成功',
                type: 'success'
              })
              this.getEvaluateList()
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
            message: '请至少选择一个评估项',
            type: 'warning'
          })
        }
      },
      // forbidMutiEvaluate () {
      //   if (this.multiSelection.length > 0) {
      //     let evaluateIdArr = selectMutiId(this.multiSelection, 'evaluationOptionId')
      //     // 拿着这个id去删除,然后重新获取listArr
      //     this.$confirm('确定禁用评估项吗？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消'
      //     }).then(() => {
      //       for (let i of this.multiSelection) {
      //         if (i.status === '0' || i.status === 0) {
      //           this.$message.warning('所选值含有禁用状态,请重选')
      //           return
      //         }
      //       }
      //       req('forbidEvaluate', evaluateIdArr).then((data) => {
      //         filterId(evaluateIdArr, this.table.data, 'evaluationOptionId', 'disable')
      //         this.$message({
      //           message: '恭喜你，禁用成功',
      //           type: 'success'
      //         })
      //         this.getEvaluateList()
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
      //       message: '请至少选择一个评估项',
      //       type: 'warning'
      //     })
      //   }
      // },
      // startMutiEvaluate () {
      //   if (this.multiSelection.length > 0) {
      //     let evaluateIdArr = selectMutiId(this.multiSelection, 'evaluationOptionId')
      //     // 拿着这个id去删除,然后重新获取listArr
      //     this.$confirm('确定启用评估项吗？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消'
      //     }).then(() => {
      //       for (let i of this.multiSelection) {
      //         if (i.status === '1' || i.status === 1) {
      //           this.$message.warning('所选值含有启用状态,请重选')
      //           return
      //         }
      //       }
      //       req('startEvaluate', evaluateIdArr).then((data) => {
      //         filterId(evaluateIdArr, this.table.data, 'evaluationOptionId', 'enable')
      //         this.$message({
      //           message: '恭喜你，启用成功',
      //           type: 'success'
      //         })
      //         this.getEvaluateList()
      //       }).catch((err) => {
      //         console.log(err)
      //       })
      //       return
      //     }).catch(() => {
      //       this.$message({
      //         type: 'info',
      //         message: '已取消启用'
      //       })
      //     })
      //   } else {
      //     this.$message({
      //       message: '请至少选择一个评估项',
      //       type: 'warning'
      //     })
      //   }
      // },
      oneForbidEvaluate (row, index) {
        this.$confirm('确定禁用评估项吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (row.evaluationOptionId) {
            req('forbidEvaluate', [row.evaluationOptionId]).then((res) => {
              this.$message({
                message: '恭喜你，禁用成功',
                type: 'success'
              })
              this.getEvaluateList()
            }).catch((err) => {
              console.log(err)
            })
          }
        })
      },
      oneStartEvaluate (row, index) {
        this.$confirm('确定启用评估项吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (row.evaluationOptionId) {
            req('startEvaluate', [row.evaluationOptionId]).then((data) => {
              this.$message({
                message: '恭喜你，启用成功',
                type: 'success'
              })
              this.getEvaluateList()
            }).catch((err) => {
              console.log(err)
            })
          }
        })
      }
    }
  }
</script>
