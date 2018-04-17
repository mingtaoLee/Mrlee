<template>
  <div>
    <div slot="header">
      <i-form @reset="reset" @search="search">
        <el-form-item label="标签名称">
          <el-input v-model.trim="param.keyword"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <i-select v-model="param.status" clearable parameter="IS_VALID" placeholder=""></i-select>
        </el-form-item>
      </i-form>
    </div>
    <div slot="section">
      <i-dialog
      v-model="dialogFormVisible"
      :title="`${this.type?'修改':'新建'}标签`"
      :toolbar="dialogToolbar"
      destroyedWhenClose
      size="huge"
      width="800px"
      class="i-dialog-width-800">
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
      width="800"
      class="i-dialog-width-800">
        <label-dialog-check
        :form="form"
        :labelId="labelId"
        :type="type">
        </label-dialog-check>
      </i-dialog>
      <div class="table">
        <i-table :table="table" @pageSizeChange="handleSizeChange"
                @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table :data="table.data"  @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column prop="name" label="标签名称" show-overflow-tooltip></el-table-column>
              <el-table-column prop="status" label="状态" align="center" sortable>
                <template slot-scope="scope">
                {{scope.row.status | statusFilter}}
              </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="seeLabel(scope.row)">查看</el-button>
                  <el-button type="text" @click="updateLabel(scope.row)">修改</el-button>
                  <el-button type="text" @click="deleteOneLabel(scope.row,scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </i-table>
      </div>
    </div>
  </div>
</template>
<script>
  // 公共组件
  import IForm from 'components/common/i-form/i-form.vue'
  import ITable from 'components/common/i-table'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import { statusDict } from 'config/dict'
  import { selectMutiId, filterId } from 'utils/performance'
  // api
  import req from 'api/recruit/index'
  // 对话框组件
  import labelDialog from './label-dialog'
  import labelDialogCheck from './label-dialog-check'
  export default {
    name: 'LabelList',
    data () {
      return {
        param: {
          keyword: '',
          status: ''
        },
        statusDict: statusDict,
        dialogFormVisible: false, // 新建或者修改对话框不可见
        dialogCheckVisible: false, // 查看对话框不可见
        type: 0, // 区分当前弹出框是增加还是修改0是增加，1是修改
        labelId: '1222', // 保存当前打开修改面板的等级id
        multiSelection: [],
        form: { // 弹出框的表单
          name: '',
          status: '',
          description: ''
          // labelId: ''
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
        table: {
          data: [],
          setting: {
            toolbar: [{
              text: '新建',
              type: 'primary',
              func: () => this.addNewLabel()
            }, {
              text: '启用',
              type: 'default',
              func: () => this.startMutiLabel()
            }, {
              text: '禁用',
              type: 'default',
              func: () => this.forbidMutiLabel()
            }, {
              text: '删除',
              type: 'default',
              func: () => this.deleteMutiLabel()
            }]
          },
          info: null,
          search: null,
          total: 0, //  后台获取到的total个数
          showPagebar: true
        }
      }
    },
    components: {
      IForm,
      ITable,
      IDialog,
      labelDialog,
      labelDialogCheck
    },
    mounted () {
      // 确保Dom已经渲染
      this.getLabelList()
    },
    methods: {
      reset () {
        this.param = {
          keyword: '',
          status: ''
        }
      },
      search () {
        this.getLabelList()
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
      // 多选
      handleSelectionChange (val) {
        this.multiSelection = val
      },
       // 当分页器页码变动时调用
      handleCurrentChange (opts) {
        this.table.info = opts
        this.getLabelList()
      },
      // 分页器每页显示几个
      handleSizeChange (opts) {
        this.table.info = opts
        this.getLabelList()
      },
      getLabelList () {
        req('labelList', {
          ...this.param,
          ...this.table.info,
          status: this.param.status.toString()
        }).then((res) => {
          console.log(res)
          this.table = Object.assign({}, this.table, res)
        }).catch((err) => {
          console.log(err)
        })
      },
      addNewLabel () {
        this.form = {
          name: '',
          status: 0,
          description: ''
        }
        this.dialogFormVisible = true
        this.type = 0
      },
      updateLabel (labelId) {
        console.log(labelId)
        if (labelId) {
          // 此处后期需要请求接口获取一条修改数据
          this.form = {
            name: '测试数据1',
            status: 0,
            description: '测试数据1的描述'
            // labelId: '12333'从接口拿到的ID，然后赋值给this.labelId
          }
          this.dialogFormVisible = true
          this.type = 1
          this.labelId = '23444'
        }
      },
      seeLabel (labelId) {
        console.log(labelId)
        if (labelId) {
          // 此处后期需要请求接口获取一条修改数据
          this.form = {
            name: '测试数据1',
            status: 0,
            description: '测试数据1的描述'
            // labelId: '12333'
          }
          this.dialogCheckVisible = true
          this.type = 2
          this.labelId = '23444'
        }
      },
      handleCancel (done) {
        done()
      },
      handleSave (done) {
        this.$refs.labelEdit.save().then(res => {
          this.getLabelList()
          done()
        })
      },
      deleteOneLabel (rowData, index) {
        this.$confirm('确定删除标签吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
         // if (rowData.levelId) {
         //    req('deleteLevels', [rowData.levelId]).then((data) => {
         //      this.table.data.splice(index, 1)
         //      this.$message({
         //        message: '恭喜你，删除成功',
         //        type: 'success'
         //      })
         //      this.getLevelList()
         //    }).catch((err) => {
         //      console.log(err)
         //    })
         //  }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
            req('deleteLevels', labelIdArr).then((data) => {
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
      forbidMutiLabel () {
        if (this.multiSelection.length > 0) {
          let labelIdArr = selectMutiId(this.multiSelection, 'labelId')
          // 拿着这个id去删除,然后重新获取listArr
          this.$confirm('确定禁用标签吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            req('deleteLevels', labelIdArr).then((data) => {
              filterId(labelIdArr, this.table.data, 'labelId', 'delete')
              this.$message({
                message: '恭喜你，禁用成功',
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
              message: '已取消禁用'
            })
          })
        } else {
          this.$message({
            message: '请至少选择一个标签',
            type: 'warning'
          })
        }
      },
      startMutiLabel () {
        if (this.multiSelection.length > 0) {
          let labelIdArr = selectMutiId(this.multiSelection, 'labelId')
          // 拿着这个id去删除,然后重新获取listArr
          this.$confirm('确定禁用标签吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            req('deleteLevels', labelIdArr).then((data) => {
              filterId(labelIdArr, this.table.data, 'labelId', 'delete')
              this.$message({
                message: '恭喜你，启用成功',
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
              message: '已取消启用'
            })
          })
        } else {
          this.$message({
            message: '请至少选择一个标签',
            type: 'warning'
          })
        }
      }
    }
  }
</script>
