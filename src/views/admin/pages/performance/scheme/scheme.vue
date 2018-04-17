<template>
  <div class="scheme">
    <i-layout headerKey="pfmSchemesGet">
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item label="名称">
            <el-input v-model.trim="param.keyword"></el-input>
          </el-form-item>
          <el-form-item label="方案状态">
            <el-select v-model="param.status" placeholder="" clearable>
              <el-option
                v-for="item in statusDict"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始年份">
            <el-date-picker
              v-model="param.beginDate"
              align="right"
              type="year"
              placeholder=""
              :picker-options="yearStartPickerOptions"
              clearable
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束年份">
            <el-date-picker
              v-model="param.endDate"
              align="right"
              type="year"
              placeholder=""
              :picker-options="yearEndPickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </i-form>
      </div>
      <div slot="section">
        <i-dialog
          v-model="dialogFormVisible"
          :title="`${this.type?'修改':'新建'}绩效方案`"
          width="600px"
          :toolbar="dialogToolbar"
          destroyedWhenClose
        >
          <scheme-dialog
            :form="form"
            :type="type"
            :schemeId="schemeId"
            ref="schemeEdit"
          ></scheme-dialog>
        </i-dialog>
        <i-dialog
          v-model="dialogFormGetVisible"
          :title="`查看绩效方案`"
          width="800px"
          :toolbar="dialogToolbar2"
          destroyedWhenClose
        >
          <scheme-dialog-check v-model="dialogFormGetVisible" :form="form"></scheme-dialog-check>
        </i-dialog>
        <div class="table">
          <i-table :table="table" @pageSizeChange="handleSizeChange"
                   @pageIndexChange="handleCurrentChange">
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="table.data"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column prop="name" label="名称" show-overflow-tooltip>
                  <!--<template slot-scope="scope">-->
                  <!--<div class="pointer" @click="oneSchemeGetDetail(scope.row)">-->
                  <!--{{ scope.row.name }}-->
                  <!--</div>-->
                  <!--</template>-->
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" sortable>
                  <template slot-scope="scope">
                    {{scope.row.status | statusFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="year" label="年份" align="center" sortable>
                  <template slot-scope="scope">
                    {{scope.row.year}}
                  </template>
                </el-table-column>
                <el-table-column prop="orgName" label="适用范围" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="操作" align="center" v-if="columnOperator">
                   <template slot-scope="scope">
                    <i-table-operator
                      :table="tableScope"
                      :row="scope.row"
                      :index="scope.$index"
                      @accessControl="accessControl"
                    />
                  </template>
                </el-table-column> -->
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
  import access from 'mixins/access'
  import req from 'api/performance/scheme'
  import schemeDialog from './scheme-dialog.vue'
  import schemeDialogCheck from './scheme-dialog-check.vue'
  // 查询组件
  import IForm from 'components/common/i-form/i-form.vue'
  import ILayout from 'components/common/i-layout'

  import { selectMutiId, filterId } from 'utils/performance'
  import ITable from 'components/common/i-table'
  import { statusDict } from 'config/dict'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import enableMixin from '../enable-disable-mixin'

  export default {
    name: 'scheme',

    mixins: [access, enableMixin],

    data () {
      return {
        table: {
          data: [],
          setting: {
            toolbar: [{
              text: '新建',
              type: 'primary',
              key: 'pfmSchemePost',
              func: () => this.addNewScheme()
            },
            // {
            //   text: '启动',
            //   type: 'default',
            //   key: 'pfmSchemesEnablePut',
            //   func: () => this.startMuti()
            // }, {
            //   text: '关闭',
            //   type: 'default',
            //   key: 'pfmSchemesDisablePut',
            //   func: () => this.forbidMuti()
            // },
            {
              text: '删除',
              type: 'default',
              key: 'pfmSchemesDelete',
              func: () => this.removeMuti()
            }],
            operator: [
              {
                text: '查看',
                key: 'pfmSchemeGet',
                func: scope => this.oneSchemeGetDetail(scope.row)
              },
              {
                text: '修改',
                key: 'pfmSchemePut',
                func: scope => this.oneSchemeDetail(scope.row)
              },
              {
                text: '启用',
                type: 'default',
                key: 'pfmSchemesEnablePut',
                func: scope => this.startMuti(scope, req, 'schemeId', 'enabledSchemes'),
                show: (row) => row.status === '1' && {empty: true}
              }, {
                text: '禁用',
                type: 'default',
                key: 'pfmSchemesDisablePut',
                func: scope => this.forbidMuti(scope, req, 'schemeId', 'closeSchemes'),
                show: (row) => row.status === '0' && {empty: true}
              },
              {
                text: '删除',
                type: 'danger',
                key: 'pfmSchemesDelete',
                func: scope => this.removeOne(scope.row, scope.$index)
              }
            ],
            export: {
            }
          },
          // info ==> null zhengwq5 2017/11/28 rewrite
          info: null,
          search: null,
          total: 0, //  后台获取到的total个数
          showPagebar: true
        },
        statusDict: statusDict,
        multiSelection: [], // 多选
        dialogFormVisible: false, // 可以填写的弹出框
        type: 0, // 区分当前弹出框是增加还是修改0是增加，1是修改
        dialogFormGetVisible: false, // 不可以填写的弹出框
        form: { // 弹出框的表单
          name: '',
          detail: [],
          status: '',
          schemeType: '',
          description: ''
        },
        param: {
          status: '',
          beginDate: '',
          endDate: '',
          keyword: ''
        },
        schemeId: '',
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
        yearStartPickerOptions: {
          disabledDate: (time) => {
            return (this.param.endDate && this.param.endDate.getTime && (time.getTime() > this.param.endDate.getTime()))
          }
        },
        yearEndPickerOptions: {
          disabledDate: (time) => {
            return (this.param.beginDate && this.param.beginDate.getTime && (time.getTime() < this.param.beginDate.getTime()))
          }
        }
      }
    },
    components: {
      schemeDialog,
      schemeDialogCheck,
      IForm,
      ITable,
      ILayout,
      IDialog
    },
    mounted () {
      // this.getSchemeList()
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
          beginDate: '',
          endDate: '',
          keyword: ''
        }
//        this.getSchemeList()
      },
      // 搜索按钮
      search (val) {
        // this.getSchemeList()
        this.table.search = {...this.param}
      },
      // 多选赋值操作
      handleSelectionChange (val) {
        this.multiSelection = val
      },
      // 当分页器页码变动时调用
      handleCurrentChange (opts) {
        // this.table.info = opts
        this.getSchemeList(opts)
      },
      // 分页器每页显示几个
      handleSizeChange (opts) {
        // this.table.info = opts
        this.getSchemeList(opts)
      },
      // 启动绩效模版
      start (rowData) {
        this.$confirm('确定启用绩效方案吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.schemeId) {
            req('enabledSchemes', [rowData.schemeId]).then((data) => {
              rowData.status = 1
              this.$message({
                message: '恭喜你，启用成功',
                type: 'success'
              })
              this.getSchemeList(this.table.info)
            }).catch((err) => {
              this.$message({
                type: 'error',
                message: err.response.data.message
              })
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
      // startMuti () {
      //   if (this.multiSelection.toString()) {
      //     let schemeIdArr = selectMutiId(this.multiSelection, 'schemeId')
      //     // let isAllTrue = this.multiSelection.map((val, index) => {
      //     //   return val.status
      //     // })
      //     this.$confirm('确定启用绩效方案吗？', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消'
      //     }).then(() => {
      //       // if (isAllTrue.includes('1') || isAllTrue.includes(1)) {
      //       //   this.$message({
      //       //     message: '所选值含有启用状态,请重选',
      //       //     type: 'warning'
      //       //   })
      //       //   return
      //       // }
      //       req('enabledSchemes', schemeIdArr).then((data) => {
      //         filterId(schemeIdArr, this.table.data, 'schemeId', 'enable')
      //         this.$message({
      //           message: '恭喜你，启用成功',
      //           type: 'success'
      //         })
      //         this.getSchemeList(this.table.info)
      //       }).catch((err) => {
      //         this.$message({
      //           type: 'error',
      //           message: err.response.data.message
      //         })
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
      //       message: '请至少选择一个绩效方案',
      //       type: 'warning'
      //     })
      //   }
      // },
      // 禁止
      forbid (rowData) {
        this.$confirm('确定关闭绩效方案吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.schemeId) {
            console.log(rowData.schemeId)
            req('closeSchemes', [rowData.schemeId]).then((data) => {
              rowData.status = 0
              this.$message({
                message: '恭喜你，关闭成功',
                type: 'success'
              })
              this.getSchemeList(this.table.info)
            }).catch((err) => {
              this.$message({
                type: 'error',
                message: err.response.data.message
              })
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关闭'
          })
        })
      },
      // // 禁止多个
      // forbidMuti () {
      //   if (this.multiSelection.toString()) {
      //     let schemeIdArr = selectMutiId(this.multiSelection, 'schemeId')
      //     let isAllTrue = this.multiSelection.map((val, index) => {
      //       return val.status
      //     })
      //     // 拿着这个id去删除,然后重新获取listArr
      //     this.$confirm('确定关闭绩效方案吗？', '提示', {
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
      //       req('closeSchemes', schemeIdArr).then((data) => {
      //         filterId(schemeIdArr, this.table.data, 'schemeId', 'disable')
      //         this.$message({
      //           message: '恭喜你，关闭成功',
      //           type: 'success'
      //         })
      //         this.getSchemeList(this.table.info)
      //       }).catch((err) => {
      //         this.$message({
      //           type: 'error',
      //           message: err.response.data.message
      //         })
      //       })
      //       return
      //     }).catch(() => {
      //       this.$message({
      //         type: 'info',
      //         message: '已取消关闭'
      //       })
      //     })
      //   } else {
      //     this.$message({
      //       message: '请至少选择一个绩效方案',
      //       type: 'warning'
      //     })
      //   }
      // },
      // 删除多个
      removeMuti () {
        if (this.multiSelection.toString()) {
          let schemeIdArr = selectMutiId(this.multiSelection, 'schemeId')
          // 拿着这个id去删除,然后重新获取listArr
          this.$confirm('确定删除绩效方案吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            req('deleteSchemes', schemeIdArr).then((data) => {
              filterId(schemeIdArr, this.table.data, 'schemeId', 'delete')
              this.$message({
                message: '恭喜你，删除成功',
                type: 'success'
              })
              this.getSchemeList(this.table.info)
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
            message: '请至少选择一个绩效方案',
            type: 'warning'
          })
        }
      },
      // 删除一个
      removeOne (rowData, index) {
        this.$confirm('确定删除绩效方案吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (rowData.schemeId) {
            req('deleteSchemes', [rowData.schemeId]).then((data) => {
              this.table.data.splice(index, 1)
              this.$message({
                message: '恭喜你，删除成功',
                type: 'success'
              })
              this.getSchemeList(this.table.info)
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
      // 新增
      addNewScheme () {
        this.form = {
          name: '',
          levelId: '',
          levelName: '',
          templateId: '',
          templateName: '',
          isMakePlan: '',
          orgName: '',
          orgId: '',
          description: '',
          year: '',
          kpis: [],
          keyWorks: [],
          status: 1
        }
        this.dialogFormVisible = true
        this.type = 0
      },
      // 获取一个等级的信息(用于点击修改之前的操作 )
      oneSchemeDetail ({schemeId}) {
        if (schemeId) {
          req('oneSchemeDetail', {schemeId: schemeId}).then((data) => {
            let {name, levelId, levelName, description, templateId, templateName, isMakePlan, orgName, orgId, year, kpis, keyWorks, status} = data
            this.form = {
              name: name,
              levelId: levelId,
              levelName: levelName,
              templateId: templateId,
              templateName: templateName,
              isMakePlan: isMakePlan,
              orgName: orgName,
              orgId: orgId,
              description: description,
              year: new Date(year.toString()),
              kpis: kpis,
              keyWorks: keyWorks,
              status: status
            }
            this.type = 1
            this.schemeId = schemeId
            this.dialogFormVisible = true
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      // 获取绩效等级列表
      getSchemeList (opts) {
        req('schemeList', {
          ...opts,
          'beginDate': !this.param.beginDate ? '' : this.param.beginDate.getFullYear(),
          'endDate': !this.param.endDate ? '' : this.param.endDate.getFullYear()
        }).then((res) => {
          // zhengwq5 2017/11/28 rewrite
          Object.assign(this.table, res)
        }).catch((err) => {
          console.log(err)
        })
      },
      // 查看等级列表
      oneSchemeGetDetail ({schemeId}) {
        if (schemeId) {
          req('oneSchemeDetail', {schemeId: schemeId}).then((data) => {
            let {name, levelId, levelName, description, templateId, templateName, isMakePlan, orgName, orgId, year, kpis, keyWorks} = data
            this.form = {
              name: name,
              levelId: levelId,
              levelName: levelName,
              templateId: templateId,
              templateName: templateName,
              isMakePlan: isMakePlan,
              orgName: orgName,
              orgId: orgId,
              description: description,
              year: new Date(year.toString()),
              kpis: kpis,
              keyWorks: keyWorks
            }
            this.dialogFormGetVisible = true
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      // 确认按钮
      handleSave (done) {
        this.$refs.schemeEdit.save().then(res => {
          if (res) {
            this.getSchemeList(this.table.info)
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
