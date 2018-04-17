<template>
  <div class="level">
    <i-layout headerKey="pfmLevelsGet">
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item label="名称">
            <el-input v-model.trim="param.keyword"></el-input>
          </el-form-item>
          <el-form-item label="等级状态">
            <el-select v-model="param.status" clearable placeholder="请选择">
              <el-option
                v-for="item in statusDict"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分等类型">
            <el-select
              v-model="param.levelType"
              multiple
              clearable
              size="mini"
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="item in LevelTypeDict"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </i-form>
      </div>
      <div
        slot="section"
        class="level-section">
        <i-dialog
          v-model="dialogFormVisible"
          :title="`${this.type?'修改':'新建'}绩效等级`"
          :toolbar="dialogToolbar"
          destroyedWhenClose
          size="large"
          class="i-dialog-width-1200"
        >
          <level-dialog
            :form="form"
            :levelId="levelId"
            :type="type"
            ref="levelEdit">
          </level-dialog>
        </i-dialog>
        <i-dialog
          class="i-dialog-width-1200"
          v-model="dialogFormGetVisible"
          title="查看绩效等级"
          size="large"
          :toolbar="dialogToolbar2"
          destroyedWhenClose
        >
          <level-dialog-check 
            v-model="dialogFormGetVisible" 
            :form="form"
            @levelDialogGetVisible="levelDialogGetVisible"
          ></level-dialog-check>
        </i-dialog>
        <div class="table">
          <i-table 
            :table="table" 
            @pageSizeChange="handleSizeChange"
            @pageIndexChange="handleCurrentChange"
          >
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
                <el-table-column prop="levelType" label="分等类型" align="center" sortable>
                  <template slot-scope="scope">
                    {{scope.row.levelType | levelTypeFilter}}
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
import req from 'api/performance/level'
import levelDialog from './level-dialog.vue'
import levelDialogCheck from './level-dialog-check.vue'
import { selectMutiId, filterId } from 'utils/performance'
import ILayout from 'components/common/i-layout'
  // 查询组件
import IForm from 'components/common/i-form/i-form.vue'
import ITable from 'components/common/i-table'
import { statusDict, LevelTypeDict } from 'config/dict'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import enableMixin from '../enable-disable-mixin'

export default {
  name: 'level',

  mixins: [enableMixin],

  data () {
    return {
      table: {
        data: [],
        setting: {
          toolbar: [{
            text: '新建',
            type: 'primary',
            key: 'pfmLevelPost',
            func: () => this.addNewLevel()
          },
          // {
          //   text: '启用',
          //   type: 'default',
          //   key: 'pfmLevelsEnablePost',
          //   func: () => this.startMuti()
          // }, {
          //   text: '禁用',
          //   type: 'default',
          //   key: 'pfmLevelsDisablePost',
          //   func: () => this.forbidMuti()
          // },
          {
            text: '删除',
            type: 'default',
            key: 'pfmLevelsDelete',
            func: () => this.removeMuti()
          }],
          operator: [
            {
              text: '查看',
              key: 'pfmLevelGet',
              func: scope => this.oneLevelGetDetail(scope.row)
            },
            {
              text: '启用',
              type: 'default',
              key: 'pfmLevelsEnablePost',
              func: scope => this.startMuti(scope, req, 'levelId', 'enabledLevels'),
              show: (row) => row.status === '1' && {empty: true}
            }, {
              text: '禁用',
              type: 'default',
              key: 'pfmLevelsDisablePost',
              func: (scope) => this.forbidMuti(scope, req, 'levelId', 'disabledLevels'),
              show: (row) => row.status === '0' && {empty: true}
            },
            {
              text: '修改',
              key: 'pfmLevelPut',
              func: scope => this.oneLevelDetail(scope.row)
            },
            {
              text: '删除',
              type: 'danger',
              key: 'pfmLevelsDelete',
              func: scope => this.removeOne(scope.row, scope.$index)
            }
          ]
        },
        info: null,
        search: null,
        total: 0, //  后台获取到的total个数
        showPagebar: true
      },
      statusDict: statusDict, // 搜索状态
      LevelTypeDict: LevelTypeDict, // 搜索状态
      multiSelection: [], // 多选
      dialogFormVisible: false, // 可以填写的弹出框
      type: 0, // 区分当前弹出框是增加还是修改0是增加，1是修改
      dialogFormGetVisible: false, // 不可以填写的弹出框
      form: { // 弹出框的表单
        name: '',
        detail: [],
        status: '',
        levelType: '',
        description: ''
      },
      levelId: '', // 保存当前打开修改面板的等级id
        // 查询条件
      param: {
        status: '',
        levelType: '',
        keyword: ''
      },
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
    levelDialog,
    levelDialogCheck,
    IForm,
    ITable,
    ILayout,
    IDialog
  },
  mounted () {
    // this.getLevelList()
    this.search()
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: '无效',
        1: '有效'
      }
      return statusMap[status]
    },
    levelTypeFilter (status) {
      const statusMap = {
        1: '区间',
        2: '比例',
//          3: '人数',
        3: '区间加比例'
      }
      return statusMap[status]
    }
  },
  computed: {
    isSHow () {
      return this.param.levelType.length > 2 || this.param.levelType.length > 1 && this.param.levelType.includes(2)
    }
  },
  methods: {
    reset () {
        // 在这里写重置逻辑
      this.param = {
        status: '',
        levelType: [],
        keyword: ''
      }
//        this.getLevelList()
    },
      // 搜索按钮
    search (val) {
      // this.getLevelList()
      this.table.search = {...this.param}
    },
      // 多选赋值操作
    handleSelectionChange (val) {
      this.multiSelection = val
    },
      // 当分页器页码变动时调用
    handleCurrentChange (opts) {
      // this.table.info = opts
      this.getLevelList(opts)
    },
      // 分页器每页显示几个
    handleSizeChange (opts) {
      // this.table.info = opts
      this.getLevelList(opts)
    },
      // 启动绩效等级
    start (rowData) {
      this.$confirm('确定启用绩效等级吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (rowData.levelId) {
          req('enabledLevels', [rowData.levelId]).then((data) => {
            rowData.status = 1
            this.$message({
              message: '恭喜你，启用成功',
              type: 'success'
            })
            // this.getLevelList()
            this.search()
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
    // startMuti (scope) {
    //   // if (this.multiSelection.toString()) {

    //   // } else {
    //   //   this.$message({
    //   //     message: '请至少选择一个绩效等级',
    //   //     type: 'warning'
    //   //   })
    //   // }
    //   // let levelIdArr = selectMutiId(this.multiSelection, 'levelId')
    //   let levelIdArr = [scope.row.levelId]
    //   this.$confirm('确定启用绩效等级吗？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消'
    //   }).then(() => {
    //     if (scope.row.status === '1' || scope.row.status === 1) {
    //       this.$message.warning('已经为启用状态')
    //       return
    //     }
    //     req('enabledLevels', levelIdArr).then((data) => {
    //       filterId(levelIdArr, this.table.data, 'levelId', 'enable')
    //       this.$message({
    //         message: '恭喜你，启用成功',
    //         type: 'success'
    //       }).catch(err => this.$message.error(err.message))
    //         // this.getLevelList()
    //       this.search()
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消启用'
    //     })
    //   })
    // },
      // 禁止
    forbid (rowData) {
      this.$confirm('确定禁用绩效等级吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (rowData.levelId) {
          req('disabledLevels', [rowData.levelId]).then((data) => {
            rowData.status = 0
            this.$message({
              message: '恭喜你，禁用成功',
              type: 'success'
            })
            // this.getLevelList()
            this.search()
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
    // forbidMuti (scope) {
    //   // if (this.multiSelection.toString()) {

    //   // } else {
    //   //   this.$message({
    //   //     message: '请至少选择一个绩效等级',
    //   //     type: 'warning'
    //   //   })
    //   // }
    //   // let levelIdArr = selectMutiId(this.multiSelection, 'levelId')
    //       // 拿着这个id去删除,然后重新获取listArr
    //   let levelIdArr = [scope.row.levelId]
    //   this.$confirm('确定禁用绩效等级吗？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消'
    //   }).then(() => {
    //     if (scope.row.status === '0' || scope.row.status === 0) {
    //       this.$message.warning('已经为禁用状态')
    //       return
    //     }
    //     req('disabledLevels', levelIdArr).then((data) => {
    //       filterId(levelIdArr, this.table.data, 'levelId', 'disable')
    //       this.$message({
    //         message: '恭喜你，禁用成功',
    //         type: 'success'
    //       }).catch(err => this.$message.error(err.message))
    //         // this.getLevelList()
    //       this.search()
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消禁用'
    //     })
    //   })
    // },
      // 删除多个
    removeMuti () {
      if (this.multiSelection.length > 0) {
        let levelIdArr = selectMutiId(this.multiSelection, 'levelId')
          // 拿着这个id去删除,然后重新获取listArr
        this.$confirm('确定删除绩效等级吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          req('deleteLevels', levelIdArr).then((data) => {
            filterId(levelIdArr, this.table.data, 'levelId', 'delete')
            this.$message({
              message: '恭喜你，删除成功',
              type: 'success'
            })
            // this.getLevelList()
            this.search()
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
          message: '请至少选择一个绩效等级',
          type: 'warning'
        })
      }
    },
      // 删除一个
    removeOne (rowData, index) {
      this.$confirm('确定删除绩效等级吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (rowData.levelId) {
          req('deleteLevels', [rowData.levelId]).then((data) => {
            this.table.data.splice(index, 1)
            this.$message({
              message: '恭喜你，删除成功',
              type: 'success'
            })
            // this.getLevelList()
            this.search()
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
    addNewLevel () {
      this.form = {
        name: '',
        detail: [],
        status: 1,
        levelType: '',
        description: ''
      }
      this.dialogFormVisible = true
      this.type = 0
    },
      // 获取一个等级的信息(用于点击修改之前的操作 )
    oneLevelDetail ({levelId}) {
      if (levelId) {
        req('oneLevelDetail', {levelId: levelId}).then((data) => {
          let {name, status, description, levelType, detail} = data
          detail[detail.length - 1].minScore = ''
          this.form = {
            name: name,
            status: status,
            description: description,
            levelType: levelType,
            detail: detail
          }
          this.type = 1
          this.levelId = levelId
          this.dialogFormVisible = true
        }).catch((err) => {
          console.log(err)
        })
      }
    },
      // 获取绩效等级列表
    getLevelList (opts) {
      req('levelList', {
        ...opts,
        levelType: this.param.levelType.toString()
      }).then((res) => {
        Object.assign(this.table, res)
      }).catch((err) => {
        console.log(err)
      })
    },
      // 查看等级列表
    oneLevelGetDetail ({levelId}) {
      if (levelId) {
        req('oneLevelDetail', {levelId: levelId}).then((data) => {
          let {name, status, description, levelType, detail} = data
          this.form = {
            name: name,
            status: status,
            description: description,
            levelType: levelType,
            detail: detail
          }
          this.form.detail.detailId = detail.detailId
          this.dialogFormGetVisible = true
        }).catch((err) => {
          console.log(err)
        })
      }
    },
      // 弹出框确认取消按钮(可修改)
    levelDialogVisible (val, formData, type) {
      if (formData && type === 0) {
        req('addOneLevel', formData).then((data) => {
            // 要根据后台返回的值
          formData.levelId = data
          this.$message({
            message: '恭喜你，添加成功',
            type: 'success'
          })
//            this.table.data.unshift(formData)
//           this.getLevelList()
          this.search()
        })
      } else if (formData && type === 1) {
        req('modifiedLevel', {levelId: this.levelId, ...formData}).then((data) => {
          for (let i = 0; i < this.table.data.length; i++) {
            if (this.levelId === this.table.data[i].levelId) {
              this.table.data.splice(i, 1, {levelId: this.levelId, ...formData})
              this.$message({
                message: '恭喜你，修改成功',
                type: 'success'
              })
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },
      // 弹出框确认取消按钮(不可修改)
    levelDialogGetVisible (val) {
      this.dialogFormGetVisible = val
    },
      // 确认按钮
    handleSave (done) {
      if (this.$refs.levelEdit.save) {
        this.$refs.levelEdit.save().then(res => {
          if (res) {
            // this.getLevelList()
            this.search()
            done()
          }
        })
      }
    },
      // 取消按钮
    handleCancel (done) {
      done()
    }
  }
}
</script>

<style scoped lang="scss">
  .level {
    .pointer {
      cursor: pointer;
    }

    .i-form__item {
      .el-select {

      }
      .el-tag {
        padding: 0;
      }
      .el-tag--primary {
        color: black
      }
    }
  }
</style>
<style lang="scss">
  .level {
    .el-select__tags {
      height: 20px;
    }
    .el-select__tags {
      position: absolute;
      height: 22px;
      white-space: nowrap;
      overflow: hidden;
      line-height: normal;
      white-space: nowrap;
      z-index: 1;
      top: 18px;
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
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

