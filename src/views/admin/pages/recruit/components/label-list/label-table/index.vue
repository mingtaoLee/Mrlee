<template>
  <div>
    <i-dialog
      v-model="dialogFormVisible"
      :title="`${this.type?'修改':'新建'}标签`"
      :toolbar="dialogToolbar"
      destroyedWhenClose
      size="huge"
      width="600px"
      class="i-dialog-width-600">
        <label-dialog
        :form="form"
        :labelId="labelId"
        :type="type"
        ref="labelEdit">
        </label-dialog>
      </i-dialog>
      <i-dialog
      v-model="dialogCheckVisible"
      :title="`查看标签`"
      :toolbar="dialogToolbar2"
      destroyedWhenClose
      size="huge"
      width="600px"
      class="i-dialog-width-600">
        <label-dialog-check
        v-model="dialogCheckVisible"
        :form="form">
        </label-dialog-check>
      </i-dialog>
      <div class="table">
        <i-table :table="table" @pageSizeChange="handleSizeChange"
                @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table :data="table.data"
             v-loading="loading"
             :element-loading-text="$loadingText"
             @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column prop="name" label="标签名称" show-overflow-tooltip></el-table-column>
              <el-table-column prop="status" label="状态" sortable>
                <template slot-scope="scope">
                {{scope.row.status | statusFilter}}
              </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
              <i-table-operator v-if="type !== 'dialog'" :table="tableScope"/>
              <!-- <el-table-column label="操作" align="center" v-if="type !== 'dialog' && operatorColumn">
                <template slot-scope="scope">
                  <i-table-operator @accessControl="accessControl" :table="tableScope" :row="scope.row"></i-table-operator>
                  <el-button type="text" @click="seeLabel(scope.row)">查看</el-button>
                  <el-button type="text" @click="updateLabel(scope.row)">修改</el-button>
                  <el-button type="text" class="color-red" @click="deleteOneLabel(scope.row,scope.$index)">删除</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </template>
        </i-table>
      </div>
  </div>
</template>
<script>
import access from 'mixins/access'
import { selectMutiId, filterId } from 'utils/performance'
// api
import req from 'api/recruit/index'
// 对话框组件
import LabelDialog from '../label-dialog'
import LabelDialogCheck from '../label-dialog-check'
export default {
  name: 'LabelTable',
  components: {
    LabelDialog,
    LabelDialogCheck
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
  mixins: [access],
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      dialogFormVisible: false, // 新建或者修改对话框不可见
      dialogCheckVisible: false, // 查看对话框不可见
      type: 0, // 区分当前弹出框是增加还是修改0是增加，1是修改
      labelId: '', // 保存当前打开修改面板的等级id
      multiSelection: [],
      form: { // 弹出框的表单
        name: '',
        status: '',
        description: ''
      },
      dialogToolbar: [
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
      table: {
        data: [],
        setting: {
          toolbar: [],
          operator: [{
            text: '查看',
            key: 'rctLabelSelectGet',
            func: this.seeLabel
          }, {
            text: '修改',
            key: 'rctLabelUpdatePut',
            func: this.updateLabel
          },
          {
            text: '启用',
            key: 'rctLabelsEnabledPost',
            func: this.oneStartLabel,
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
            key: 'rctLabelsDisabledPost',
            func: this.OneForbidLabel,
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
            key: 'rctLabelsDeletePut',
            func: this.deleteOneLabel
          }]
        },
        info: null,
        search: null,
        total: 0, //  后台获取到的total个数
        showPagebar: true
      }
    }
  },
  computed: {
    param () {
      return this.$store.state.recruit.labelFormParam
    }
  },
  watch: {
    param () {
      this.table.search = {...this.param}
      // this.getLabelList()
    }
  },
  created () {
    this.init()
  },
  mounted () {
    // 确保Dom已经渲染
    // this.getLabelList()
    this.search()
  },
  methods: {
    // 初始化
    init () {
      if (this.type === 'dialog') {
        this.table.setting.toolbar = [
          {
            text: '新建',
            type: 'primary',
            key: 'rctLabelCreatePost',
            func: () => this.addNewLabel()
          }
        ]
        this.param.status = '1'
      } else {
        this.table.setting.toolbar = [
          {
            text: '新建',
            type: 'primary',
            key: 'rctLabelCreatePost',
            func: () => this.addNewLabel()
          },
          // {
          //   text: '启用',
          //   type: 'default',
          //   key: 'rctLabelsEnabledPost',
          //   func: () => this.startMutiLabel()
          // }, {
          //   text: '禁用',
          //   type: 'default',
          //   key: 'rctLabelsDisabledPost',
          //   func: () => this.forbidMutiLabel()
          // },
          {
            text: '删除',
            type: 'default',
            class: 'color-red',
            key: 'rctLabelsDeletePut',
            func: () => this.deleteMutiLabel()
          }
        ]
      }
    },
    search () {
      this.table.search = {...this.param}
    },
    // 过滤器
    filters: {
      statusFilter (status) {
        const statusMap = {
          0: '无效',
          1: '有效'
        }
        return statusMap[status]
      }
    },
    // 多选
    handleSelectionChange (val) {
      this.multiSelection = val
    },
      // 当分页器页码变动时调用
    handleCurrentChange (opts) {
      this.loading = true
      // this.table.info = opts
      this.getLabelList(opts)
    },
    // 分页器每页显示几个
    handleSizeChange (opts) {
      // this.table.info = opts
      this.loading = true
      this.getLabelList(opts)
    },
    // 获取标签列表
    getLabelList (opts) {
      req('labelList', opts).then((res) => {
        Object.assign(this.table, res)
        this.loading = false
      }).catch((err) => {
        console.log(err)
        this.loading = false
      })
    },
    // 增加新标签
    addNewLabel () {
      this.form = {
        name: '',
        status: 0,
        description: ''
      }
      this.dialogFormVisible = true
      this.type = 0
    },
    // 更新新标签
    updateLabel (row) {
      let labelId = row.labelId
      if (labelId) {
        if (row.isUser === 'Y') {
          this.$message.warning('所选值含是占用状态,不可修改')
          return
        } else {
          req('seeLabel', {labelId: labelId}).then((data) => {
            console.log(data)
            let {name, status, description, labelId} = data
            this.form = {
              name: name,
              status: status,
              description: description
            }
            this.dialogFormVisible = true
            this.type = 1
            this.labelId = labelId
          })
        }
      }
    },
    // 查看标签
    seeLabel (row) {
      let labelId = row.labelId
      if (labelId) {
        req('seeLabel', {labelId: labelId}).then((data) => {
          console.log(data)
          let {name, status, description} = data
          this.form = {
            name: name,
            status: status,
            description: description
          }
          this.dialogCheckVisible = true
        })
      }
    },
    // 取消
    handleCancel (done) {
      done()
    },
    // 保存
    handleSave (done) {
      this.dialogToolbar[1].loading = true
      this.$refs.labelEdit.save().then(res => {
        console.log(res)
        if (res) {
          this.getLabelList()
          done()
        }
        this.dialogToolbar[1].loading = false
      })
      .catch(() => {
        this.dialogToolbar[1].loading = false
      })
    },
    // 删除标签
    deleteOneLabel (rowData, index) {
      if (rowData.isUser === 'Y') {
        this.$message.warning('所选值含是占用状态,不可删除')
        return
      } else {
        this.$confirm('确定删除标签吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          console.log(rowData)
          if (rowData.labelId) {
            req('deleteLabel', [rowData.labelId]).then((data) => {
              this.table.data.splice(index, 1)
              this.$message({
                message: '恭喜你，删除成功',
                type: 'success'
              })
              this.getLabelList()
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
    deleteMutiLabel () {
      if (this.multiSelection.length > 0) {
        let labelIdArr = selectMutiId(this.multiSelection, 'labelId')
        // 拿着这个id去删除,然后重新获取listArr
        this.$confirm('确定删除标签吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          for (let i of this.multiSelection) {
            if (i.isUse === 'Y') {
              this.$message.warning('所选值含有占用状态,不可删除,请重选')
              return
            }
          }
          req('deleteLabel', labelIdArr).then((data) => {
            filterId(labelIdArr, this.table.data, 'labelId', 'delete')
            this.$message({
              message: '恭喜你，删除成功',
              type: 'success'
            })
            this.getLabelList()
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
          message: '请至少选择一个标签',
          type: 'warning'
        })
      }
    },
    // 禁用标签
    // forbidMutiLabel () {
    //   if (this.multiSelection.length > 0) {
    //     let labelIdArr = selectMutiId(this.multiSelection, 'labelId')
    //     // 拿着这个id去删除,然后重新获取listArr
    //     this.$confirm('确定禁用标签吗？', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消'
    //     }).then(() => {
    //       for (let i of this.multiSelection) {
    //         if (i.status === '0' || i.status === 0) {
    //           this.$message.warning('所选值含有禁用状态,请重选')
    //           return
    //         }
    //       }
    //       req('forbidLabel', labelIdArr).then((data) => {
    //         filterId(labelIdArr, this.table.data, 'labelId', 'disable')
    //         this.$message({
    //           message: '恭喜你，禁用成功',
    //           type: 'success'
    //         })
    //         this.getLabelList()
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
    //       message: '请至少选择一个标签',
    //       type: 'warning'
    //     })
    //   }
    // },
    OneForbidLabel (row, index) {
      this.$confirm('确定禁用标签吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (row.labelId) {
          req('forbidLabel', [row.labelId]).then((res) => {
            this.$message({
              message: '恭喜你，禁用成功',
              type: 'success'
            })
            this.getLabelList()
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    },
    // 启用标签
    // startMutiLabel () {
    //   if (this.multiSelection.length > 0) {
    //     let labelIdArr = selectMutiId(this.multiSelection, 'labelId')
    //     // 拿着这个id去删除,然后重新获取listArr
    //     this.$confirm('确定启用标签吗？', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消'
    //     }).then(() => {
    //       for (let i of this.multiSelection) {
    //         if (i.status === '1' || i.status === 1) {
    //           this.$message.warning('所选值含有启用状态,请重选')
    //           return
    //         }
    //       }
    //       req('startLabel', labelIdArr).then((data) => {
    //         filterId(labelIdArr, this.table.data, 'labelId', 'enable')
    //         this.$message({
    //           message: '恭喜你，启用成功',
    //           type: 'success'
    //         })
    //         this.getLabelList()
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
    //       message: '请至少选择一个标签',
    //       type: 'warning'
    //     })
    //   }
    // },
    oneStartLabel (row, index) {
      this.$confirm('确定启用标签吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (row.labelId) {
          req('startLabel', [row.labelId]).then((res) => {
            console.log(res)
            this.$message({
              message: '恭喜你，启用成功',
              type: 'success'
            })
            this.getLabelList()
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    },
    // 获取选择项列表
    getMultiSelection () {
      return this.multiSelection
    }
  }
}
</script>
<style scoped>
  .color-gray{
    color: #666;
  }
  .color-red{
    color: red!important;
  }
</style>

