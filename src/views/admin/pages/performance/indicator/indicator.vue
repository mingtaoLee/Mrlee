<template>
  <div class="indicator">
    <i-layout headerKey="pfmIndicatorsGet">
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item label="名称">
            <el-input v-model.trim="param.keyword"></el-input>
          </el-form-item>
          <el-form-item label="指标状态">
            <el-select
              v-model="param.status"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in statusDict"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评估类型">
            <el-select
              v-model="param.evaluationType"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in evaluationTypeDict"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评估方法">
            <el-select
              v-model="param.evaluationMethod"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in evaluationMethodDict"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评估方向">
            <el-select
              v-model="param.evaluationDirection"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in evaluationDirectionDict"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="指标类别">
            <el-select
              multiple
              v-model="param.indicatorType"
              size="mini"
              clearable
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="item in indicatorTypedDict"
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
          :title="`${title}绩效指标`"
          width="800px"
          :toolbar="dialogToolbar"
          destroyedWhenClose>
          <indicator-dialog :indicatorId="indicatorId" ref="indicatorEdit"></indicator-dialog>
        </i-dialog>
        <i-dialog
          v-model="dialogFormGetVisible"
          title="查看绩效指标"
          width="800px"
          :toolbar="dialogToolbar2"
          destroyedWhenClose
        >
          <indicator-dialog-check :indicatorId="indicatorId"></indicator-dialog-check>
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
                <el-table-column prop="name" label="指标名称" show-overflow-tooltip>
                  <!--<template slot-scope="scope">-->
                  <!--<div class="pointer" slot="reference" @click="oneIndicatorGetDetail(scope.row)">-->
                  <!--{{ scope.row.name }}-->
                  <!--</div>-->
                  <!--</template>-->
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" sortable>
                  <template slot-scope="scope">
                    {{scope.row.status | statusFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="indicatorType" label="指标类别" align="center" sortable>
                  <template slot-scope="scope">
                    {{indicatorTyper(scope.row.indicatorType)}}
                  </template>
                </el-table-column>
                <el-table-column prop="evaluationDirection" label="评估方向" align="center" sortable>
                  <template slot-scope="scope">
                    {{evaluationDirectioner(scope.row.evaluationDirection)}}
                  </template>
                </el-table-column>
                <el-table-column prop="evaluationType" label="评估类型" align="center" sortable>
                  <template slot-scope="scope">
                    {{evaluationTyper(scope.row.evaluationType)}}
                  </template>
                </el-table-column>
                <el-table-column prop="evaluationMethod" label="评估方法" align="center" sortable>
                  <template slot-scope="scope">
                    {{evaluationMethoder(scope.row.evaluationMethod)}}
                  </template>
                </el-table-column>
                <i-table-operator :table="tableScope" scope width="200"></i-table-operator>
              </el-table>
            </template>
          </i-table>
        </div>
      </div>
    </i-layout>
  </div>
</template>
<script>
import req from 'api/performance/indicator'
import indicatorDialog from './indicator-dialog.vue'
import indicatorDialogCheck from './indicator-dialog-check.vue'
import ITable from 'components/common/i-table'
import ILayout from 'components/common/i-layout'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import {
    evaluationDirectionDict,
    indicatorTypedDict,
    evaluationTypeDict,
    evaluationMethodDict,
    statusDict
  } from '../../../../../config/dict'

import { findDictLabel } from 'utils/index'
  // 查询组件
import IForm from 'components/common/i-form/i-form.vue'
import { selectMutiId, filterId } from 'utils/performance'
import enableMixin from '../enable-disable-mixin'

export default {

  name: 'indicator',

  mixins: [enableMixin],

  data () {
    return {
      table: {
        data: [],
        setting: {
          toolbar: [{
            text: '新建',
            type: 'primary',
            key: 'pfmIndicatorPost',
            func: () => this.addNewindicator()
          },
          // {
          //   text: '启用',
          //   type: 'default',
          //   key: 'pfmIndicatorsEnablePost',
          //   func: () => this.startMuti()
          // }, {
          //   text: '禁用',
          //   type: 'default',
          //   key: 'pfmIndicatorsDisablePost',
          //   func: () => this.forbidMuti()
          // },
          {
            text: '删除',
            type: 'default',
            key: 'pfmIndicatorsDelete',
            func: () => this.removeMuti()
          }],
          operator: [
            {
              text: '查看',
              key: 'pfmIndicatorGet',
              func: scope => this.oneIndicatorGetDetail(scope.row)
            },
            {
              text: '修改',
              key: 'pfmIndicatorPut',
              func: scope => this.modifiedindicator(scope.row)
            },
            {
              text: '启用',
              type: 'default',
              key: 'pfmIndicatorsEnablePost',
              func: scope => this.startMuti(scope, req, 'indicatorId', 'enabledIndicators'),
              show: (row) => row.status === '1' && {empty: true}
            }, {
              text: '禁用',
              type: 'default',
              key: 'pfmIndicatorsDisablePost',
              func: scope => this.forbidMuti(scope, req, 'indicatorId', 'disabledIndicators'),
              show: (row) => row.status === '0' && {empty: true}
            },
            {
              text: '删除',
              key: 'pfmIndicatorsDelete',
              type: 'danger',
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
      evaluationDirectionDict: evaluationDirectionDict,
      indicatorTypedDict: indicatorTypedDict,
      evaluationTypeDict: evaluationTypeDict,
      evaluationMethodDict: evaluationMethodDict,
      multiSelection: [],
      dialogFormVisible: false, // 可以填写的弹出框
      dialogFormGetVisible: false, // 不可以填写的弹出框
        // 查询条件
      param: {
        status: '',
        evaluationDirection: '',
        evaluationMethod: '',
        indicatorType: [],
        evaluationType: '',
        keyword: ''
      },
      indicatorId: '',
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
    indicatorDialog,
    indicatorDialogCheck,
    IForm,
    ITable,
    ILayout,
    IDialog
  },

  mounted () {
    // this.getIndicatorList()
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
        evaluationDirection: '',
        evaluationMethod: '',
        indicatorType: [],
        evaluationType: '',
        keyword: ''
      }
//        this.getIndicatorList()
    },
      // 搜索按钮
    search () {
      // this.getIndicatorList()
      this.table.search = {...this.param}
    },
    evaluationDirectioner (val) {
      return findDictLabel(evaluationDirectionDict, val)
    },
    indicatorTyper (val) {
      return findDictLabel(indicatorTypedDict, val)
    },
    evaluationTyper (val) {
      return findDictLabel(evaluationTypeDict, val)
    },
    evaluationMethoder (val) {
      return findDictLabel(evaluationMethodDict, val)
    },

    handleSelectionChange (val) {
      this.multiSelection = val
    },
      // 当分页器页码变动时调用
    handleCurrentChange (opts) {
      // this.table.info = opts
      this.getIndicatorList(opts)
    },
      // 分页器每页显示几个
    handleSizeChange (opts) {
      // this.table.info = opts
      this.getIndicatorList(opts)
    },
    start (rowData) {
      this.$confirm('确定启用绩效指标吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (rowData.indicatorId) {
          req('enabledIndicators', [rowData.indicatorId]).then((data) => {
            rowData.status = 1
            this.$message({
              message: '恭喜你，启用成功',
              type: 'success'
            })
            this.getIndicatorList(this.table.info)
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
    // startMuti () {
    //   if (this.multiSelection.toString()) {
    //     let indicatorIdArr = selectMutiId(this.multiSelection, 'indicatorId')
    //     let isAllTrue = this.multiSelection.map((val, index) => {
    //       return val.status
    //     })
    //     this.$confirm('确定启用绩效指标吗？', '提示', {
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
    //       req('enabledIndicators', indicatorIdArr).then((data) => {
    //         for (let i = 0; i < this.table.data.length; i++) {
    //           if (indicatorIdArr.indexOf(this.table.data[i].indicatorId) !== -1) {
    //             this.table.data[i].status = 1
    //           }
    //         }
    //         this.$message({
    //           message: '恭喜你，启用成功',
    //           type: 'success'
    //         })
    //         this.getIndicatorList(this.table.info)
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
    //       message: '请至少选择一个绩效指标',
    //       type: 'warning'
    //     })
    //   }
    // },
      // 禁止
    forbid (rowData) {
      this.$confirm('确定禁用绩效指标吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (rowData.indicatorId) {
          req('disabledIndicators', [rowData.indicatorId]).then((data) => {
            rowData.status = 0
            this.$message({
              message: '恭喜你，禁用成功',
              type: 'success'
            })
            this.getIndicatorList(this.table.info)
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
    // forbidMuti () {
    //   if (this.multiSelection.toString()) {
    //     let indicatorIdArr = selectMutiId(this.multiSelection, 'indicatorId')
    //     let isAllTrue = this.multiSelection.map((val, index) => {
    //       return val.status
    //     })
    //       // 拿着这个id去删除,然后重新获取listArr
    //     this.$confirm('确定禁用绩效指标吗？', '提示', {
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
    //       req('disabledIndicators', indicatorIdArr).then((data) => {
    //         filterId(indicatorIdArr, this.table.data, 'indicatorId', 'disable')
    //         this.$message({
    //           message: '恭喜你，禁用成功',
    //           type: 'success'
    //         })
    //         this.getIndicatorList(this.table.info)
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
    //       message: '请至少选择一个绩效指标',
    //       type: 'warning'
    //     })
    //   }
    // },
      // 新增
    addNewindicator () {
      this.dialogFormVisible = true
      this.indicatorId = undefined
      this.title = '新建'
    },

      // 查看等级列表
    oneIndicatorGetDetail ({indicatorId}) {
      if (indicatorId) {
        this.indicatorId = indicatorId
        this.dialogFormGetVisible = true
      }
    },
      // 获取绩效等级列表
    getIndicatorList (opts) {
      req('indicatorslList', {
        ...opts,
        indicatorType: this.param.indicatorType.toString()
      }).then((res) => {
        Object.assign(this.table, res)
      }).catch((err) => {
        console.log(err)
      })
    },
      // 删除多个
    removeMuti () {
      if (this.multiSelection.toString()) {
        let indicatorIdArr = selectMutiId(this.multiSelection, 'indicatorId')
          // 拿着这个id去删除,然后重新获取listArr
        this.$confirm('确定删除绩效指标吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          req('deleteIndicators', indicatorIdArr).then((data) => {
            filterId(indicatorIdArr, this.table.data, 'indicatorId', 'delete')
            this.$message({
              message: '恭喜你，删除成功',
              type: 'success'
            })
            this.getIndicatorList(this.table.info)
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
          message: '请至少选择一个绩效指标',
          type: 'warning'
        })
      }
    },
      // 删除一个
    removeOne (rowData, index) {
      this.$confirm('确定删除绩效指标吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (rowData.indicatorId) {
          req('deleteIndicators', [rowData.indicatorId]).then((data) => {
            this.table.data.splice(index, 1)
            this.$message({
              message: '恭喜你，删除成功',
              type: 'success'
            })
            this.getIndicatorList(this.table.info)
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

      // 修改等级列表
    modifiedindicator ({indicatorId}) {
      if (indicatorId) {
        this.indicatorId = indicatorId
        this.dialogFormVisible = true
        this.title = '修改'
      }
    },

      // 确认按钮
    handleSave (done) {
      this.$refs.indicatorEdit.save().then(res => {
        if (res) {
          this.getIndicatorList(this.table.info)
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
<style lang="scss">
  .indicator {
    .el-select__tags {
      min-height: 22px;
    }
    .el-select {
      .el-tag {
        height: 20px;
        line-height: 20px;
        margin: 1px;
      }
    }
    .el-input__inner {
      height: 28px;
    }
    .el-input--mini {
      font-size: 14px;
    }
  }
</style>
