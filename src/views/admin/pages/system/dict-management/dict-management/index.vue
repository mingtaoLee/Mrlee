<template>
  <div class="dict-management">
    <i-layout>

      <!-- 字典查询 -->
      <div slot="header" v-if="accessMap.sysDictsListGet">
        <i-form  @reset="reset" @search="search" >
          <el-form-item label="字典编号">
            <el-input v-model="listParams.dictCode" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="字典名称">
            <el-input v-model="listParams.dictName" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="语言">
            <i-select v-model="listParams.language" parameter="LANGUAGE" ></i-select>
          </el-form-item>
        </i-form>
      </div>

      <!-- 字典表格 -->
      <div slot="section">
        <i-table :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table
              :data="tableScope.clone"
              ref="multipleTable"
              border tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              v-loading="loading"
              :element-loading-text="$loadingText"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column v-for="(item, idx) in table.columns"
                :key="idx"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :formatter="tableScope.formatter"
                :align="item.align"
                class='title'
              ></el-table-column>
              <i-table-operator :table="tableScope"></i-table-operator>
            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>

    <!-- 新增&编辑模态框 -->
    <i-dialog 
      :title="title"
      :toolbar="toolbar"
      v-model="dictDialogVisible"
      class="dict-dialog"
      size="standard"
    >
      <el-form :model="form" :rules="rules" ref='form'>
        <el-form-item label="字典编号" :label-width="formLabelWidth"  prop="dictCode">
          <el-input v-model="form.dictCode" style='width:500px' maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="字典名称" :label-width="formLabelWidth"  prop="dictName">
          <el-input v-model="form.dictName" style='width:500px' maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="语言" :label-width="formLabelWidth"  prop="language">
          <i-select v-model="form.language" parameter="LANGUAGE" style='width:500px' ></i-select>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" style='width:500px' maxlength="100"></el-input>
        </el-form-item>
        <dict-dialog-table ref="dictTable" :form='form' @dialogTable='getDialogTable'></dict-dialog-table>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import req from 'api/system/dict-managerment'
import DictDialogTable from '../dict-dialog-table'
import { showMessage } from 'utils/index'
import access from 'mixins/access'

export default {
  components: {
    DictDialogTable
  },
  mixins: [access],
  data () {
    // /* eslint-disable */
    let checkOrder = (rule, value, cb) => {
      // console.log(1, value)
      // let myReg = /^[0-9]*[1-9][0-9]*$/
      let myReg = /^\d+$/

      for (let i = 0; i < value.length; i++) {
        !value[i].orderNo && cb(new Error('顺序号不能为空'))
      }
      value.map((item, i) => {
        !myReg.test(Number(value[i].orderNo)) ? cb(this.$message('检测到有顺序号不为整数')) : cb()
      })
    }
    return {
      loading: false,
      listParams: {
        language: '',
        dictCode: '',
        dictName: ''
      },
      toolbar: [{
        text: '取消',
        type: 'default',
        func: () => this.goBack()
      }, {
        text: '确定',
        type: 'primary',
        func: () => this.submitDictData('form')
      }],
      table: {
        columns: [
          { prop: 'dictCode', label: '字典编号', width: 252 },
          { prop: 'dictName', label: '字典名称', width: 252 },
          { prop: 'language', label: '语言', width: 252, align: 'center' },
          { prop: 'description', label: '描述' }
        ],
        setting: {
          // 按钮
          toolbar: [
            {
              text: '新增',
              type: 'primary',
              key: 'sysDictsCreateDictPost',
              func: () => this.insertDict()
            },
            // {
            //   text: '编辑',
            //   type: 'primary',
            //   func: () => this.editorDict()
            // },
            {
              text: '删除',
              type: 'danger',
              key: 'sysDictsDeleteDictDelete',
              func: () => this.deleteDict()
            },
            {
              text: '刷新缓存',
              type: 'primary',
              func: () => this.updateCache()
            }
          ],
          operator: [{
            text: '修改',
            key: 'sysDictsUpdateDictPost',
            func: this.editorDict     // 与 toolbar 类似，在 func 绑定相应的方法
          }]
        },
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },
        // 新增模态框
      dictDialogVisible: false,
      formLabelWidth: '120px',
      // 表单
      form: {
        language: '',
        dictCode: '',
        dictName: '',
        description: '',
        dictItemList: [
          {
            orderNo: '',
            dictItemValue: '',
            dictItemName: '',
            remark: ''
          }
        ]
      },
      // 检验规则
      rules: {
        dictName: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        dictCode: [
          { required: true, message: '请输入字典编号', trigger: 'blur' }
        ],
        language: [
          { required: true, message: '请选择语言', trigger: 'change' }
        ],
        dictItemList: [
          { required: true, validator: checkOrder, trigger: 'blur' }
        ]
      },
      // 记录选择的条数
      multipleSelection: [],
      //  保存标题
      title: '',
       // 保存当前状态(新增还是编辑)
      addOReditor: 0
    }
  },

  mounted () {
    this.table.search = {}
  },

  methods: {
    // 监听 pageIndex 和 pageSize 的变动
    handleSizeChange (options) {
      this.table.info = options
      this.loading = true
      this.getDictList(options)
    },
    handleCurrentChange (options) {
      this.table.info = options
      this.loading = true
      this.getDictList(options)
    },
    // -------------------------------------表层的列表渲染和查询----------------------------------------
    // 获取字典列表
    getDictList (listParams) {
      req('getDictList', listParams)
      .then(res => {
        // console.log(res.data)
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(
          key => (this.table[key] = res[key])
        )
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
    },
    // 查询
    search () {
      this.table.search = { ...this.listParams }
    },
    // 重置
    reset () {
      //  新添加方法重置
      Object.keys(this.listParams).map(item => {
        this.listParams[item] = ''
      })
    },
    // --------------------------------------模态框的基本设置--------------------------------------
    //  返回
    goBack () {
      // 先把内容全部置空
      Object.keys(this.form).map(item => {
        this.form[item] = ''
      })
      this.form.dictItemList = [
        {
          orderNo: '',
          dictItemValue: '',
          dictItemName: '',
          remark: ''
        }
      ]
      // 隐藏模态框
      this.dictDialogVisible = false
    },
    // --------------------------------新增&编辑的方法------------------------------------------
    // 选中某一项的时候
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 新增字典方法，
    insertDict () {
      // 清空上一次校验结果
      // this.$refs['form'].resetFields()
      // TODO:字典条目是否可以不写
      if (this.multipleSelection.length < 1) {
        this.title = '新增系统字典'
        this.addOReditor = 1
        // 把模态框的内容全部清空
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
        this.form.dictItemList = [
          {
            orderNo: '',
            dictItemValue: '',
            dictItemName: '',
            remark: ''
          }
        ]
        this.dictDialogVisible = true
      } else {
        this.$message.error('新增功能，不能选择字典')
      }
    },
    // 编辑字典方法，获取对应的数据
    editorDict (row) {
      // if (this.multipleSelection.length === 1) {
      this.title = '编辑系统字典'
      this.addOReditor = 2
      // 清空上一次校验结果
      // this.$refs['form'].resetFields()
        // 获取对应的字典列表
      req('getDictOne', {id: row.dictId})
        .then(res => {
          Object.keys(res).map(item => {
            this.form[item] = res[item]
          })
        })
      // console.log(this.form)
        // 如果下表单是空就要重置
        // TODO:字典条目没有显示
      if (this.form.dictItemList.length === 1 && this.form.dictItemList[0].dictItemName === '' && this.form.dictItemList[0].dictItemValue === '' && this.form.dictItemList[0].orderNo === '' && this.form.dictItemList[0].remark === '') {
        this.form.dictItemList = [
          {
            orderNo: '',
            dictItemValue: '',
            dictItemName: '',
            remark: ''
          }
        ]
      }
      this.dictDialogVisible = true
      // }
      //  else if (this.multipleSelection.length < 1) {
      //   this.$message('请选择需要编辑的字典')
      // } else {
      //   this.$message('只能选择一条字典')
      // }
    },
     // 提交新增&编辑的数据
     // TODO:字典条目是否可以不写
    submitDictData (formName) {
      let dialogTable = this.$refs['dictTable'].$refs['cell'].filter(el => !el.validate())
      if (dialogTable.length > 0) {
        showMessage('error', '顺序号、字典名称、字段值不能存在空值！')
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // console.log(this.form)
            // 根据状态选择是发送新增请求还是修改的请求
            if (this.addOReditor === 1) {
              req('createDict', this.form)
                .then(res => {
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  this.loading = true
                  this.getDictList()
                  this.reset()
                  // 隐藏模态框
                  this.dictDialogVisible = false
                })
            } else if (this.addOReditor === 2) {
            // console.log(form)
              req('updateDict', this.form)
                .then(res => {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.loading = true
                  this.getDictList(this.table.info)
                  this.reset()
                  // 隐藏模态框
                  this.dictDialogVisible = false
                })
            }
          } else {
            this.$message.error('请先按要求输入')
            return false
          }
        })
      }
    },
    // 删除字典的方法
    deleteDict () {
      if (this.multipleSelection.length < 1) {
        this.$message('请选择需要删除的字典')
      } else {
        //  获取数据，发送请求删除
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dictIds = []
          this.multipleSelection.map(item => {
            dictIds.push(item.dictId)
          })
          req('deleteDict', {dictIds: dictIds})
            .then(res => {
              if (res) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.loading = true
                this.getDictList()
                this.reset()
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 刷新缓存
    updateCache () {
      req('updateCache')
        .then(res => {
          if (res) {
            this.$message({
              message: '刷新缓存成功',
              type: 'success'
            })
            this.loading = true
            this.getDictList()
          }
        })
      for (let key in window.sessionStorage) {
        /\/public-access\/dicts\/.*\/items/.test(key) && sessionStorage.removeItem(key)
      }
    },
    // 得到dialog的table数据
    getDialogTable (data) {
      this.form.dictItemList = data
    }
  }
}
</script>
<style lang="scss">
  .dict-management {
    // 字典的表格对齐改成左对齐
    .el-table tbody tr td:not(:first-child) .cell{
      // text-align:left;
      // margin-left:20px;
    }
  }
  .dict-dialog {
    .el-form-item__content {
      margin-right: 15px;
    }
  }
</style>
