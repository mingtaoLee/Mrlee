<template>
  <div class="standard">
    <i-layout headerKey="grpStandardsGet">
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item label="名称">
            <el-input v-model="param.keyword"></el-input>
          </el-form-item>
          <!--<el-form-item label="评分标准状态">-->
            <!--<el-select v-model="param.status" placeholder="" clearable>-->
              <!--<el-option-->
                <!--v-for="item in statusDict"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        </i-form>
      </div>
      <div slot="section">
        <i-dialog
          v-model="dialogFormVisible"
          :title="`${title}评分标准`"
          width="950px"
          :toolbar="dialogToolbar"
          destroyedWhenClose
        >
          <standard-dialog :standardId="standardId" ref="standardEdit"></standard-dialog>
        </i-dialog>
        <i-dialog
          v-model="dialogFormGetVisible"
          title="查看评分标准"
          width="800px"
          :toolbar="dialogToolbar2"
          destroyedWhenClose
        >
          <standard-dialog-check :standardId="standardId"></standard-dialog-check>
        </i-dialog>
        <div class="table">
          <i-table :table="table" @pageSizeChange="handleSizeChange"
                   @pageIndexChange="handleCurrentChange">
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="tableScope.clone"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column prop="name" label="名称" show-overflow-tooltip>
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
  import req from 'api/performance/grape-standard'
  import standardDialog from './grape-standard-dialog.vue'
  //  import standardDialog from './standard-x.vue'
  import standardDialogCheck from './grape-standard-dialog-check.vue'
  import { selectMutiId, filterId } from 'utils/performance'
  import ITable from 'components/common/i-table'
  import ILayout from 'components/common/i-layout'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'

  // 查询组件
  import IForm from 'components/common/i-form/i-form.vue'
  import { statusDict } from 'config/dict'

  export default {
    name: 'standard',

    data () {
      return {
        table: {
          data: [],
          setting: {
            toolbar: [{
              text: '新建',
              type: 'primary',
              key: 'grpStandardPost',
              func: () => this.addNewStandard()
            },
            // {
            //   text: '启用',
            //   type: 'default',
            //   key: 'grpStandardsEnablePost',
            //   func: () => this.startMuti()
            // }, {
            //   text: '禁用',
            //   type: 'default',
            //   key: 'grpStandardsDisablePost',
            //   func: () => this.forbidMuti()
            // }
            {
              text: '删除',
              type: 'default',
              key: 'grpStandardDelete',
              func: () => this.removeMuti()
            }],
            operator: [
              {
                text: '启用',
                type: 'default',
                key: 'grpStandardsEnablePost',
                func: (row) => this.startMuti(row)
              }, {
                text: '禁用',
                type: 'default',
                key: 'grpStandardsDisablePost',
                func: (row) => this.forbidMuti(row)
              },
              {
                text: '查看',
                key: 'grpStandardGet',
                func: scope => this.oneStandardGetDetail(scope.row)
              },
              {
                text: '修改',
                key: 'grpStandardPut',
                func: scope => this.oneStandardDetail(scope.row)
              },
              {
                text: '删除',
                type: 'danger',
                key: 'grpStandardDelete',
                func: scope => this.removeOne(scope.row, scope.$index)
              }
            ]
          },
          info: null,
          search: null,
          total: 0, //  后台获取到的total个数
          showPagebar: true
        },
        statusDict: statusDict,
        multiSelection: [], // 多选
        dialogFormVisible: false, // 可以填写的弹出框
        dialogFormGetVisible: false, // 不可以填写的弹出框
        // 查询条件
        param: {
          status: '',
          keyword: ''
        },
        standardId: '',
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
        title: ''
      }
    },
  
    components: {
      standardDialog,
      standardDialogCheck,
      IForm,
      ITable,
      ILayout,
      IDialog
    },

    // created () {
    //   this.getstandardList()
    // },

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
//        this.getstandardList()
      },
      // 搜索按钮
      search (val) {
        // this.getstandardList(val)
        this.table.search = {...this.param}
      },
      // 多选赋值操作
      handleSelectionChange (val) {
        this.multiSelection = val
      },
      // 当分页器页码变动时调用
      handleCurrentChange (opts) {
        this.getstandardList(opts)
      },
      // 分页器每页显示几个
      handleSizeChange (opts) {
        this.getstandardList(opts)
      },
      getstandardList (opt) {
        req('standardList', {
          ...opt
        }).then((res) => {
          Object.assign(this.table, res)
        }).catch((err) => {
          console.log(err)
        })
      },
      // 启动评分标准
      start (rowData) {
        this.$confirm('确定启用评分标准吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.standardId) {
            req('enabledStandards', [rowData.standardId]).then((data) => {
              rowData.status = 1
              this.$message({
                message: '恭喜你，启用成功',
                type: 'success'
              })
              this.getstandardList(this.table.info)
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
      // 启动多个
      startMuti (scope) {
        let row = scope.row

        // if (this.multiSelection.toString()) {
  
        // } else {
        //   this.$message({
        //     message: '请至少选择一个评分标准',
        //     type: 'warning'
        //   })
        // }
        // let standardIdArr = selectMutiId(this.multiSelection, 'standardId')
        this.$confirm('确定启用评分标准吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          req('enabledStandards', [row.standardId]).then((data) => {
            filterId([row.standardId], this.table.data, 'standardId', 'enable')
            this.$message({
              message: '恭喜你，启用成功',
              type: 'success'
            })
            this.getstandardList(this.table.info)
          }).catch((err) => {
            console.log(err)
          })
          return
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
      },
      // 禁止
      forbid (rowData) {
        this.$confirm('确定禁用评分标准吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.standardId) {
            req('disabledStandards', [rowData.standardId]).then((data) => {
              rowData.status = 0
              this.$message({
                message: '恭喜你，禁用成功',
                type: 'success'
              })
              this.getstandardList(this.table.info)
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
      // 禁止多个
      forbidMuti (scope) {
        let row = scope.row
        // if (this.multiSelection.toString()) {
        //   let standardIdArr = selectMutiId(this.multiSelection, 'standardId')
        //   // 拿着这个id去删除,然后重新获取listArr
  
        // } else {
        //   this.$message({
        //     message: '请至少选择一个评分标准',
        //     type: 'warning'
        //   })
        // }
        this.$confirm('确定禁用评分标准吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          req('disabledStandards', [row.standardId]).then((data) => {
            filterId([row.standardId], this.table.data, 'standardId', 'disable')
            this.$message({
              message: '恭喜你，禁用成功',
              type: 'success'
            })
            this.getstandardList(this.table.info)
          }).catch((err) => {
            console.log(err)
          })
          return
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消禁用'
          })
        })
      },
      // 删除一个
      removeOne (rowData, index) {
        this.$confirm('确定删除评分标准吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.standardId) {
            req('deleteStandards', [rowData.standardId]).then((data) => {
              this.table.data.splice(index, 1)
              this.$message({
                message: '恭喜你，删除成功',
                type: 'success'
              })
              this.getstandardList()
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
      // 删除多个
      removeMuti () {
        if (this.multiSelection.toString()) {
          let standardIdArr = selectMutiId(this.multiSelection, 'standardId')
          // 拿着这个id去删除,然后重新获取listArr
          this.$confirm('确定删除评分标准吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            req('deleteStandards', standardIdArr).then((data) => {
              filterId(standardIdArr, this.table.data, 'standardId', 'delete')
              this.$message({
                message: '恭喜你，删除成功',
                type: 'success'
              })
              this.getstandardList()
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
            message: '请至少选择一个评分标准',
            type: 'warning'
          })
        }
      },
      // 新增
      addNewStandard () {
        this.dialogFormVisible = true
        this.standardId = undefined
        this.title = '新建'
      },
      // 获取一个等级的信息(用于点击修改之前的操作 )
      oneStandardDetail ({standardId}) {
        if (standardId) {
          this.standardId = standardId
          this.dialogFormVisible = true
          this.title = '修改'
        }
      },
      // 查看等级列表
      oneStandardGetDetail ({standardId}) {
        if (standardId) {
          this.standardId = standardId
          this.dialogFormGetVisible = true
        }
      },
      // 确认按钮
      handleSave (done) {
        this.$refs.standardEdit.save().then(res => {
          if (res) {
            this.getstandardList()
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
</style>
