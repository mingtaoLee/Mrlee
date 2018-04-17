<template>
  <!-- <div class="template"> -->
    <i-layout headerKey="rctInformsListGet">
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item label="模板名称">
            <el-input v-model.trim="param.name"></el-input>
          </el-form-item>
          <el-form-item label="适用范围">
            <i-select-tree
              dataKey="org"
              v-model="param.orgId"
              nodeKey="orgUnitId"
              clearable>
            </i-select-tree>
          </el-form-item>
          <el-form-item label="状态">
            <i-select v-model="param.status" parameter="IS_VALID" placeholder="请选择">
            </i-select>
          </el-form-item>
          <el-form-item label="模板类型">
            <i-select v-model="param.informType" parameter="INFORM_TYPE"
            placeholder="请选择">
            </i-select>
          </el-form-item>
        </i-form>
      </div>
      <div slot="section">
        <i-dialog
        v-model="dialogFormVisible"
        :title="`${this.type?'修改':'新建'}通知模版`"
        :toolbar="dialogToolbar"
        width="700px"
        size="huge"
        destroyedWhenClose>
          <template-dialog
            v-if="dialogFormVisible"
            ref="templateEdit"
            :form="form"
            :templateId="templateId"
            :type="type">
          </template-dialog>
        </i-dialog>
        <i-dialog
          v-model="dialogFormGetVisible"
          :title="`查看通知模版`"
          width="700px"
          size="huge"
          :toolbar="dialogToolbar2"
          destroyedWhenClose>
          <template-dialog-check
            v-if="dialogFormGetVisible"
            :form="form"
            :templateId="templateId"
            :value="value"
            :type="type">
          </template-dialog-check>
        </i-dialog>
        <i-table :table="table" @pageSizeChange="handleSizeChange"
                  @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table
              :data="table.data"
              v-loading="loading"
              :element-loading-text="$loadingText"
              @selection-change="handleSelectionChange">
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
                </template>
              </el-table-column> -->
            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>
  <!-- </div> -->
</template>
<script>
  import access from 'mixins/access'
  import req from 'api/recruit/inform-template'
  import templateDialog from './template-dialog.vue'
  import templateDialogCheck from './template-dialog-check.vue'
  // 查询组件
  import { selectMutiId, filterId } from 'utils/performance'

  export default {
    name: 'InformTemplate',
    components: {
      templateDialog,
      templateDialogCheck
    },
    mixins: [access],
    data () {
      return {
        loading: false,
        table: {
          data: [],
          columns: [
            { prop: 'name', label: '模板名称' },
            { prop: 'informType', label: '模板类型', display: {dict: 'INFORM_TYPE'}, sortable: true },
            { prop: 'orgName', label: '适用范围' },
            { prop: 'status', label: '状态', display: {dict: 'IS_VALID'}, sortable: true }
          ],
          setting: {
            toolbar: [{
              text: '新建',
              type: 'primary',
              key: 'rctInformCreatePost',
              func: () => this.addNewTemplate()
            },
            // {
            //   text: '启用',
            //   type: 'default',
            //   key: 'rctInformsEnabledPost',
            //   func: () => this.startMuti()
            // }, {
            //   text: '禁用',
            //   type: 'default',
            //   key: 'rctInformsDisabledPost',
            //   func: () => this.forbidMuti()
            // },
            {
              text: '删除',
              type: 'default',
              key: 'rctInformsDeletePut',
              func: () => this.removeMuti()
            }],
            operator: [{
              text: '查看',
              key: 'rctInformSelectGet',
              func: this.oneTemplateGetDetail
            }, {
              text: '修改',
              key: 'rctInformUpdatePut',
              func: this.oneTemplateDetail
            },
            {
              text: '启用',
              key: 'rctInformsEnabledPost',
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
              key: 'rctInformsDisabledPost',
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
              key: 'rctInformsDeletePut',
              func: this.removeOne
            }]
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
              loading: false,
              func: done => {
                this.handleSave(done)
              }
            }
          ]
        },
        type: 0, // 新建是0，修改是1
        orgId: '', // 部门id
        templateId: '', // 模板id
        informType: [], // 模板类型字典
        multiSelection: [], // 多选
        dialogFormVisible: false, // 新建修改弹框显隐
        dialogFormGetVisible: false, // 查看弹框显隐
        form: {
          name: '', // 模板名称
          orgId: '', // 组织结构id
          orgName: '', // 组织结构名
          informType: '', // 模板类型
          isNote: false, // 短信默认不选中
          isMail: false,  // 邮件默认不选中
          noteContent: {}, // 短信内容
          mailContent: {}, // 邮件内容
          status: '' // 状态，0无效，1有效
        },
        // 查询条件
        param: {
          status: '',
          name: '',
          informType: null,
          orgId: '',
          orgName: null
        },
        dialogToolbar: [ // 新建/修改的弹窗
          {
            text: '取消',
            type: 'default',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '保存',
            loading: false,
            func: (done) => {
              this.$refs.templateEdit.validate().then(valid => {
                if (valid) {
                  this.handleSave(done)
                }
              })
            }
          }
        ],
        dialogToolbar2: [ // 查看弹窗的
          {
            text: '返回',
            func: done => {
              this.handleCancel(done)
            }
          }
        ]
      }
    },

    mounted () {
      // this.getTemplateList()
      this.search()
    },

    methods: {
      // 在这里写重置逻辑
      reset () {
        this.param = {
          status: '',
          name: '',
          orgId: null,
          orgName: '',
          informType: null
        }
        // this.getTemplateList()
      },

      // 搜索按钮
      search (val) {
        // console.log(this.param)
        this.table.search = {...this.param}
      },

       // 多选选中的值
      handleSelectionChange (val) {
        this.multiSelection = val
      },

      // 分页器显示当前页
      handleCurrentChange (opts) {
        this.loading = true
        this.getTemplateList(opts)
      },

      // 分页器每页显示几个
      handleSizeChange (opts) {
        this.loading = true
        this.getTemplateList(opts)
      },

      // 单个启用
      start (rowData) {
        this.$confirm('确定启用通知模板吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.templateId) {
            req('enabledTemplates', [rowData.templateId]).then((data) => {
              this.$message({
                message: '恭喜你，启用成功',
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
            message: '已取消启用'
          })
        })
      },

      // // 多选启用
      // startMuti () {
      //   if (this.multiSelection.toString()) {
      //     let templateIdArr = selectMutiId(this.multiSelection, 'templateId')
      //     let isAllTrue = this.multiSelection.map((val, index) => {
      //       return val.status
      //     })
      //     this.$confirm('确定启用通知模板吗？', '提示', {
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
      //       message: '请至少选择一个通知模版',
      //       type: 'warning'
      //     })
      //   }
      // },

      // 单个禁用
      forbid (rowData) {
        this.$confirm('确定禁用通知模板吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.templateId) {
            req('disabledTemplates', [rowData.templateId]).then((data) => {
              this.$message({
                message: '恭喜你，禁用成功',
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
            message: '已取消禁用'
          })
        })
      },

      // // 多选禁用
      // forbidMuti () {
      //   if (this.multiSelection.toString()) {
      //     let templateIdArr = selectMutiId(this.multiSelection, 'templateId')
      //     let isAllTrue = this.multiSelection.map((val, index) => {
      //       return val.status
      //     })
      //     // 拿着这个id去删除,然后重新获取listArr
      //     this.$confirm('确定禁用通知模板吗？', '提示', {
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
      //       message: '请至少选择一个通知模版',
      //       type: 'warning'
      //     })
      //   }
      // },

      // 新增
      addNewTemplate () {
        this.form = {
          name: '',
          orgId: '',
          orgName: '',
          informType: '',
          isNote: false,
          isMail: false,
          noteContent: {},
          mailContent: {},
          status: ''
        }
        this.templateId = ''
        this.type = 0
        this.dialogFormVisible = true
      },

      // 多选删除
      removeMuti () {
        if (this.multiSelection.toString()) {
          let templateIdArr = selectMutiId(this.multiSelection, 'templateId')
          // 拿着这个id去删除,然后重新获取listArr
          this.$confirm('确定删除通知模板吗？', '提示', {
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
            message: '请至少选择一个通知模版',
            type: 'warning'
          })
        }
      },

      // 单个删除
      removeOne (rowData, index) {
        this.$confirm('确定删除通知模板吗？', '提示', {
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

      // 单个修改
      oneTemplateDetail ({templateId}) {
        if (templateId) {
          req('oneTemplateDetail', {templateId: templateId}).then((data) => {
            this.form = {
              name: data.name,
              orgId: data.orgId,
              orgName: data.orgName,
              isNote: data.isNote,
              isMail: data.isMail,
              noteContent: data.noteContent,
              mailContent: data.mailContent,
              informType: data.informType,
              status: data.status
            }
            delete this.form.templateId
            this.type = 1
            this.templateId = templateId
            this.dialogFormVisible = true
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      // 获取列表
      getTemplateList (opts) {
        // this.loading = true
        req('templateList', opts).then((res) => {
          Object.assign(this.table, res)
          this.loading = false
          // console.log(res)
        }).catch((err) => {
          console.log(err)
          this.loading = false
        })
      },

      // 查看详情
      oneTemplateGetDetail ({templateId}) {
        if (templateId) {
          req('oneTemplateDetail', {templateId: templateId}).then((data) => {
            this.form = {
              name: data.name,
              orgId: data.orgId,
              orgName: data.orgName,
              informType: data.informType
            }
            delete this.form.templateId
            this.type = 1
            this.templateId = templateId
            this.dialogFormGetVisible = true
          }).catch((err) => {
            console.log(err)
          })
        }
      },

      // 确认按钮
      handleSave (done) {
        this.dialogToolbar[1].loading = true
        this.$refs.templateEdit.save().then(res => {
          if (res) {
            this.getTemplateList()
            done()
          }
          this.dialogToolbar[1].loading = false
        }).catch(() => {
          this.dialogToolbar[1].loading = false
        })
      },
      // 取消按钮
      handleCancel (done) {
        this.dialogFormVisible = false
        done()
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

