<template>
  <i-layout headerKey="rctEvaTempsListGet">
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item label="模板名称">
            <el-input v-model.trim="param.name"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <i-select v-model="param.status"
             parameter='IS_VALID'
             placeholder='请选择'></i-select>
          </el-form-item>
        </i-form>
      </div>
      <div slot="section">
        <div class="table">
          <i-table
            ref="itable"
            :table="table"
            @pageSizeChange="handleSizeChange"
            @pageIndexChange="handleCurrentChange">
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="table.data"
                @selection-change="handleSelectionChange"
                v-loading="loading"
                :element-loading-text="$loadingText">
                <el-table-column
                  type="selection"
                  width="40">
                </el-table-column>
                <el-table-column
                v-for="(col, index) in table.columns || []"
                :key="index"
                :prop="col.prop"
                :align="col.align"
                :width="col.width"
                :fixed="col.fixed"
                :formatter="tableScope.formatter"
                :label="col.label"
                :sortable="col.sortable"></el-table-column>
                <i-table-operator :table="tableScope"/>
                <!-- <el-table-column label="操作" align="center" v-if="operatorColumn">
                  <template slot-scope="scope">
                    <i-table-operator @accessControl="accessControl" :table="tableScope" :row="scope.row"></i-table-operator>
                    <el-button type="text" @click="oneTemplateGetDetail(scope.row)">查看</el-button>
                    <el-button type="text" @click="oneTemplateDetail(scope.row)">修改</el-button>
                    <el-button type="text"
                       size="small"
                       class="color-red"
                       @click="removeOne(scope.row,scope.$index)">删除</el-button>
                    <el-button v-show="scope.row.status == 0" type="text" size="small" @click="start(scope.row)">启用
                    </el-button>
                    <el-button v-show="scope.row.status == 1" type="text" size="small" @click="forbid(scope.row)">禁用
                    </el-button>
                  </template>
                </el-table-column> -->
              </el-table>
            </template>
          </i-table>
        </div>
      </div>

      <evaluate-list-template-dialog
        v-if="EvaluateListTemplateDialogFlag"
        slot="section"
        :myType="diffType"
        :showMe.sync="EvaluateListTemplateDialogFlag"
        :templateItem="templateItem"
        @getMyData="handleGetedData">
      </evaluate-list-template-dialog>

    </i-layout>
</template>
<script>
  import access from 'mixins/access'
  import req from 'api/recruit/evaluate-list'
  // 查询组件
  import {selectMutiId, filterId} from 'utils/performance'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import EvaluateListTemplateDialog from '../../components/evaluate-template-dialog'

  export default {
    name: 'template',
    components: {
      IDialog,
      EvaluateListTemplateDialog
    },
    mixins: [access],
    data () {
      return {
        table: {
          data: [],
          columns: [
            { prop: 'name', label: '模板名称' },
            { prop: 'status', label: '状态', display: {dict: 'IS_VALID'}, sortable: true },
            { prop: 'description', label: '描述' }
          ],
          setting: {
            toolbar: [{
              text: '新建',
              type: 'primary',
              key: 'rctEvaTempCreatePost',
              func: () => this.addNewTemplate()
            },
            // {
            //   text: '启用',
            //   type: 'default',
            //   key: 'rctEvaTempsEnabledPost',
            //   func: () => this.startMuti()
            // }, {
            //   text: '禁用',
            //   type: 'default',
            //   key: 'rctEvaTempsDisabledPost',
            //   func: () => this.forbidMuti()
            // },
            {
              text: '删除',
              type: 'default',
              key: 'rctEvaTempsDeletePut',
              func: () => this.removeMuti()
            }],
            operator: [{
              text: '查看',
              key: 'rctEvaTempSelectGet',
              func: this.oneTemplateGetDetail
            }, {
              text: '修改',
              key: 'rctEvaTempUpdatePut',
              func: this.oneTemplateDetail
            },
            {
              text: '启用',
              key: 'rctEvaTempsEnabledPost',
              func: this.start,
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
              key: 'rctEvaTempsDisabledPost',
              func: this.forbid,
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
              key: 'rctEvaTempsDeletePut',
              func: this.removeOne
            }]
          },
          info: null,
          search: null,
          total: 0, //  后台获取到的total个数
          showPagebar: true
        },
        loading: false, // 默认不加载
        evaluationTemplateId: '', // 评估表模板的id
        multiSelection: [], // 多选
        form: {
          name: '', // 评估表模板名称
          description: '', // 描述
          status: '' // 模板的状态，0无效，1有效
        },
        // 查询条件
        param: {
          status: '',
          name: ''
        },
        type: 0,
        toolbar: [{
          text: '取消',
          type: 'primary',
          func: (done) => {
            done()
          }
        }, {
          text: '确定',
          type: 'primary',
          func: (done) => {
            if (this.$refs.cell) {
              this.$refs.cell.map(el => el.validate())
            }
            done()
          }
        }],
        EvaluateListTemplateDialogFlag: false,
        diffType: 'add',
        templateItem: []
      }
    },
    mounted () {
      // this.getEvaluateList()
      this.search()
    },
    methods: {
      // 在这里写重置逻辑
      reset () {
        this.param = {
          status: '',
          name: ''
        }
      },

      // 搜索按钮
      search (val) {
        this.table.search = {...this.param}
      },

      // 多选选中的值
      handleSelectionChange (val) {
        this.multiSelection = val
      },

      // 分页器显示的当前页
      handleCurrentChange (opts) {
        this.loading = true
        this.getEvaluateList(opts)
      },

      // 分页器每页显示几个
      handleSizeChange (opts) {
        this.loading = true
        this.getEvaluateList(opts)
      },

      // 单个启用
      start (rowData) {
        this.$confirm('确定启用评估表模板吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.evaluationTemplateId) {
            req('enabledTemplates', [rowData.evaluationTemplateId]).then((data) => {
              this.$message({
                message: '恭喜你，启用成功',
                type: 'success'
              })
              this.getEvaluateList()
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

      // 多选启用
      startMuti () {
        if (this.multiSelection.toString()) {
          let templateIdArr = selectMutiId(this.multiSelection, 'evaluationTemplateId')
          let isAllTrue = this.multiSelection.map((val, index) => {
            return val.status
          })
          this.$confirm('确定启用评估表模板吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            if (isAllTrue.includes('1') || isAllTrue.includes(1)) {
              this.$message({
                message: '所选值含有启用状态,请重选',
                type: 'warning'
              })
              return
            }
            req('enabledTemplates', templateIdArr).then((data) => {
              filterId(templateIdArr, this.table.data, 'evaluationTemplateId', 'enable')
              this.$message({
                message: '恭喜你，启用成功',
                type: 'success'
              })
            }).catch((err) => {
              console.log(err)
            })
            // 拿着这个id去删除,然后重新获取listArr
            return
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消启用'
            })
          })
        } else {
          this.$message({
            message: '请至少选择一个评估表模版',
            type: 'warning'
          })
        }
      },

      // 单个禁用
      forbid (rowData) {
        this.$confirm('确定禁用评估表模板吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.evaluationTemplateId) {
            req('disabledTemplates', [rowData.evaluationTemplateId]).then((data) => {
              this.$message({
                message: '恭喜你，禁用成功',
                type: 'success'
              })
              this.getEvaluateList()
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

      // 多选禁用
      forbidMuti () {
        if (this.multiSelection.toString()) {
          let templateIdArr = selectMutiId(this.multiSelection, 'evaluationTemplateId')
          let isAllTrue = this.multiSelection.map((val, index) => {
            return val.status
          })
          // 拿着这个id去删除,然后重新获取listArr
          this.$confirm('确定禁用评估表模板吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            if (isAllTrue.includes('0') || isAllTrue.includes(0)) {
              this.$message({
                message: '所选值含有禁用状态,请重选',
                type: 'warning'
              })
              return
            }
            req('disabledTemplates', templateIdArr).then((data) => {
              filterId(templateIdArr, this.table.data, 'evaluationTemplateId', 'disable')
              this.$message({
                message: '恭喜你，禁用成功',
                type: 'success'
              })
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
        } else {
          this.$message({
            message: '请至少选择一个评估表模版',
            type: 'warning'
          })
        }
      },

      // 新增
      addNewTemplate () {
        this.diffType = 'add'
        this.EvaluateListTemplateDialogFlag = true
        this.templateItem = []
      },

      // 多选删除
      removeMuti () {
        if (this.multiSelection.toString()) {
          let templateIdArr = selectMutiId(this.multiSelection, 'evaluationTemplateId')
          // 拿着这个id去删除,然后重新获取listArr
          this.$confirm('确定删除评估表模板吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            req('deleteTemplates', templateIdArr).then((data) => {
              filterId(templateIdArr, this.table.data, 'evaluationTemplateId', 'delete')
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
            message: '请至少选择一个评估表模版',
            type: 'warning'
          })
        }
      },

      // 单个删除
      removeOne (rowData, index) {
        this.$confirm('确定删除评估表模板吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.evaluationTemplateId) {
            req('deleteTemplates', [rowData.evaluationTemplateId]).then((data) => {
              this.table.data.splice(index, 1)
              this.$message({
                message: '恭喜你，删除成功',
                type: 'success'
              })
              this.getEvaluateList()
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

      // 获取列表
      getEvaluateList (opts) {
        req('evaluateList', opts).then((res) => {
          Object.assign(this.table, res)
          this.loading = false
        }).catch((err) => {
          console.log(err)
          this.loading = false
        })
      },

      // 操作栏的修改
      oneTemplateDetail (row) {
        if (row.evaluationTemplateId) {
          this.diffType = 'modify'
          this.templateItem = row
          this.EvaluateListTemplateDialogFlag = true
        }
      },

      // 操作栏的查看
      oneTemplateGetDetail (row) {
        if (row.evaluationTemplateId) {
          this.diffType = ''
          this.templateItem = row
          this.EvaluateListTemplateDialogFlag = true
        }
      },

      handleGetedData (data) {
        this.getEvaluateList()
        for (let i of data) {
          this.$refs.itable.createData(i)
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .pointer {
    cursor: pointer;
  }
  .color-red{
    color: red!important;
  }
</style>
