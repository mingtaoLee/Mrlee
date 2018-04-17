<template>
  <div>
    <div class="table-card card">
      <header>
        <i-form @reset="reset" @search="getIndiatiors">
          <el-form-item label="名称">
            <el-input v-model.trim="params.name" clearable ></el-input>
          </el-form-item>
        </i-form>
      </header>
      <!--<scheme-dialog v-model="dialogFormVisible" :form="form"-->
      <!--@schemeDialogVisible="schemeDialogVisible" :type="type"></scheme-dialog>-->
      <div class="table">
        <el-button @click="addNewindicator" type="primary">新增</el-button>
        <el-table
          :data="indicatorslList"
          style="width: 100%"
          ref="multipleTable"
          class="mt10"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="40">
          </el-table-column>
          <el-table-column label="名称">
            <template slot-scope="scope">
              <div slot="reference">
                {{ scope.row.indicatorName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="类型">
            <template slot-scope="scope">
              {{evaluationTyper(scope.row.evaluationType) }}
            </template>
          </el-table-column>
          <el-table-column prop="schemeType" label="方法">
            <template slot-scope="scope">
              {{evaluationMethoder(scope.row.evaluationMethod)}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="choose(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <footer>
          <div class="right tools">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="indicatorsLength">
            </el-pagination>
          </div>
        </footer>
      </div>
    </div>
    <i-dialog
      v-model="dialogFormVisible"
      title="新增绩效指标"
      width="800px"
      :toolbar="dialogToolbar"
      destroyedWhenClose
      :modal="false"
    >
      <indicator-dialog 
      :form="form"
      ref="indicatorEdit"
      @indicatorDialogVisible="indicatorDialogVisible"></indicator-dialog>
    </i-dialog>
  </div>
</template>
<script>
  import req from 'api/performance/scheme'
  import schemeDialog from './scheme-dialog.vue'
  import schemeDialogCheck from './scheme-dialog-check.vue'
  import indicatorDialog from './indicator-dialog.vue'
  import {
    evaluationTypeDict,
    evaluationMethodDict
  } from '../../../../../config/dict'
  import { findDictLabel } from 'utils/index'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import iForm from 'components/common/i-form/i-form.vue'

  export default {
    name: 'choose-indicator-dialog',
    data () {
      return {
        params: {
          name: ''
        },
        visible: false, // 弹出框是否显示
        indicatorslList: [], // 渲染数据
        indicatorsLength: 0, //  后台获取到的total个数
        multiSelection: [], // 多选
        currentPage: 1, //
        pageSize: 3, // 分页器每页显示个数
        pageIndex: 1,
        dialogFormVisible: false, // 可以填写的弹出框
        type: 0, // 区分当前弹出框是增加还是修改0是增加，1是修改
//        dialogFormGetVisible: false, // 不可以填写的弹出框
        form: { // 弹出框的表单
          name: '',
          evaluationDirection: '',
          indicatorType: '',
          evaluationType: '',
          evaluationMethod: '',
          standardId: '',
          unit: '',
          standard: '',
          description: '',
          status: 1
        },
        dialogToolbar: [
          {
            text: '取消',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '确定',
            func: done => {
              this.handleSave(done)
            }
          }
        ]
      }
    },
    components: {
      schemeDialog,
      schemeDialogCheck,
      indicatorDialog,
      IDialog,
      iForm
    },
    props: ['value', 'storageIndicators'],
    watch: {
      value () {
        this.visible = this.value
      }
    },
    created () {
      // this.getIndiatiors()
      this.indicatorslList = this.storageIndicators
    },
  
    methods: {
      reset () {
        this.params = {
          name: ''
        }
      },
      evaluationTyper (val) {
        return findDictLabel(evaluationTypeDict, val)
      },
      evaluationMethoder (val) {
        return findDictLabel(evaluationMethodDict, val)
      },
      closeDialog () {
        this.$emit('input', false)
      },
      handleSelectionChange (val) {
        val.forEach((val, index) => {
          val.isLocal = true
        })
        this.multiSelection = val
      },
      getIndiatiors () {
        req('indicatorslList', {...this.params, pageIndex: this.pageIndex, pageSize: this.pageSize}).then(({data, total}) => {
          console.log(data)
          if (Array.isArray(data)) {
            this.indicatorslList = data
            this.indicatorsLength = total
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 当分页器页码变动时调用
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageIndex = this.currentPage
        req('indicatorslList', {...this.params, pageIndex: this.pageIndex, pageSize: this.pageSize}).then(({data, total}) => {
          if (Array.isArray(data)) {
            this.indicatorslList = data
            this.indicatorsLength = total
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 新增
      addNewindicator () {
        this.form = {
          name: '',
          evaluationDirection: '',
          indicatorType: '',
          evaluationType: '',
          evaluationMethod: '',
          standardId: '',
          unit: '',
          standard: '',
          description: '',
          status: 1
        }
        this.dialogFormVisible = true
      },
      // 新增成功后添加到当前列表
//      indicatorDialogVisible (val, formData) {
//        this.dialogFormVisible = val
//        this.choose(formData)
//      },
//      schemeDialogGetVisible (val) {
//        this.dialogFormGetVisible = val
//      },

      choose (indicatior) {
        indicatior.isLocal = true
        this.save([indicatior])
      },
      ensure (formName) {
//        this.$emit('indicatorDialogVisible', false, this.multiSelection)
        this.save(this.multiSelection)
      },
      // 取消按钮
      handleCancel (done) {
        done()
      },
      handleSave (done) {
        // done()
        this.$refs.indicatorEdit.save().then(res => {
          if (res) {
            done()
            this.choose(res)
          }
        })
      },
      save (indicatior) {
        return new Promise(resolve => {
          if (indicatior) {
            this.$emit('indicatorDialogVisible', false, indicatior)
          } else {
            if (this.multiSelection.length) {
              resolve(this.multiSelection)
            } else {
              this.$message({
                message: '请至少选择一个指标',
                type: 'warning'
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
