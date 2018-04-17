<template>
  <div class="param-management">
    <!-- <section class="user-management"> -->
    <i-layout>
    <!-- 用户查询 -->
      <div slot="header" v-if="accessMap.sysParamConfigGet">
        <i-form @reset="reset" @search="search">
          <el-form-item label="参数代码">
            <el-input v-model="listParams.paramKey"></el-input>
          </el-form-item>
          <el-form-item label="参数名称">
            <el-input v-model="listParams.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="创建人">
            <el-input v-model="listParams.createBy" ></el-input>
          </el-form-item> -->
        </i-form>
      </div>
   <!-- 参数管理表格 -->  
      <div slot="section">
        <i-table :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table 
            :data="tableScope.clone"
            border tooltip-effect="dark"
            style="width: 100%" align="center"
            @selection-change="handleSelectionChange"
            v-loading="loading"
            :element-loading-text="$loadingText">
              <el-table-column type="selection" width="55" />
                <el-table-column v-for="(item, idx) in table.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  :formatter="tableScope.formatter"
                  align="center"
                />
                <!-- <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope"> -->
                  <i-table-operator :table="tableScope" />
                <!-- </template>
               </el-table-column> -->
              </el-table>
            </template>
        </i-table>
      </div>
      </i-layout>

     <!-- 新增模态框 -->
    <i-dialog :title="title" v-model="paramDialogVisible" :toolbar="toolbar">
      <!-- 上表单 -->
      <el-form :model="form" :rules="rules" ref='form'>
        <el-form-item label="参数代码" :label-width="formLabelWidth" prop="paramKey">
          <el-input v-model="form.paramKey" style='width:500px' maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="参数值" :label-width="formLabelWidth" prop="value">
          <el-input v-model="form.value" style='width:500px' maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="参数名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" style='width:500px' maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="参数类型" :label-width="formLabelWidth" prop="type">
          <el-input v-model="form.type" style='width:500px' maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="note">
          <el-input v-model="form.note" style='width:500px' maxlength="100"></el-input>
        </el-form-item>
      </el-form>
    </i-dialog>
    <!-- </section> -->
  </div>
</template>

<script>
import req from 'api/system/params-management'
import ISelect from 'components/common/i-select/i-select'
import ITable from 'components/common/i-table'
import IForm from 'components/common/i-form/i-form'
import ILayout from 'components/common/i-layout'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import ITableOperator from 'components/common/i-table-operator'
import {formatDate} from 'utils/organization'
import access from 'mixins/access'
export default {
  components: {
    ISelect,
    ITable,
    IForm,
    IDialog,
    ILayout,
    ITableOperator
  },
  mixins: [access],
  data () {
    let checkType = (rule, value, cb) => {
      let typeTest = /^\d{1,1}$/
      !value && cb(new Error('请输入参数类型'))
      setTimeout(function () {
        !typeTest.test(value) ? cb(new Error('参数类型仅能是一位的数字格式')) : cb()
      }, 0)
    }
    return {
      loading: true,
      listParams: {
        paramKey: '',
        name: ''
        // createBy: ''
      },
      toolbar: [{
        text: '取消',
        type: 'default',
        func: () => this.goBack()
      }, {
        text: '确定',
        type: 'primary',
        func: () => this.submitRoleData('form')
      }],
      table: {
        columns: [
          { prop: 'paramKey', label: '参数代码' },
          { prop: 'name', label: '参数名称' },
          { prop: 'value', label: '参数值' },
          { prop: 'type', label: '参数类型' },
          // { prop: 'createBy', label: '创建人' },
          { prop: 'createDate1', label: '创建时间' },
          { prop: 'note', label: '描述' }
        ],
        setting: {
          toolbar: [{
            text: '新增',
            type: 'primary',
            key: 'sysParamConfigPost',
            func: () => this.insertParam()
          }, {
            text: '删除',
            type: 'danger',
            key: 'sysParamConfigDelete',
            func: () => this.deleteParam()
          }],
          operator: [{
            text: '修改',
            key: 'sysParamConfigPut',
            func: this.getJurisdictionList
          }]
        },
        data: null,
        showPagebar: true,
        search: null,
        info: null,
        total: 0
        // editRoleData: {}
      },

      // 模态框
      paramDialogVisible: false,
      formLabelWidth: '120px',
       // 表单
      form: {
        paramKey: '',
        value: '',
        name: '',
        type: '',
        note: ''
      },
      // 检验规则
      rules: {
        paramKey: [
          { required: true, message: '请输入参数代码', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入参数值', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ],
        type: [
          { required: true, validator: checkType, trigger: 'blur' }
        ],
        note: [
          { required: true, message: '请输入参数描述', trigger: 'blur' }
        ]
      },
       // 记录选择的条数
      multipleSelection: [],
      title: '',
      // 判断是新增还是编辑
      addOReditor: 0,
      // 是否存在有校验失败情况
      checkMark: false
    }
  },

  methods: {
    // 编辑
    getJurisdictionList (row) {
      // 清空上一次的校验结果
      this.checkMark && this.$refs['form'].resetFields()
      Object.keys(this.form).map(item => {
        this.form[item] = ''
      })
      this.title = '修改参数'
      // 显示模态框
      this.paramDialogVisible = true
      // 编辑状态标记
      this.addOReditor = 2
      // 给form赋值
      Object.keys(row).map(
        key => (this.form[key] = row[key])
      )
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
      this.table.search = { ...this.listParams }
    },
     // 监听 pageIndex 和 pageSize 的变动
    handleSizeChange (options) {
      this.table.info = options
      this.loading = true
      this.getParamsList(options)
    },
    handleCurrentChange (options) {
      this.table.info = options
      this.loading = true
      this.getParamsList(options)
    },
     // 获取参数列表
    getParamsList  (listParams) {
      req('getParamsList', listParams)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(
          key => (this.table[key] = res[key])
        )
        this.table.data.forEach((val, index) => {
          this.table.data[index].createDate1 = formatDate(val.createDate).substring(0, 10)
        })
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
    },
    // 新增按钮方法
    insertParam () {
      if (this.multipleSelection.length < 1) {
        // 先把form清空,以防上一次有影响
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
        delete this.form.id
        delete this.form._id
        delete this.form.createDate
        // delete this.form.createBy
        delete this.form.status
        delete this.form.createDate1
        this.title = '新增参数'
        // 显示模态框
        this.paramDialogVisible = true
        this.addOReditor = 1
        this.checkMark = false
      } else {
        this.$message('新增用户，不能选择人员')
      }
    },
    // 提交信息
    submitRoleData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        // 根据状态选择是发送新增请求还是修改的请求
          if (this.addOReditor === 1) {
            //  新增请求
            // this.form.id = null
            req('createParams', this.form)
              .then(res => {
                // this.$message('新增成功')
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.loading = true
                this.getParamsList(this.table.info)
                // 隐藏模态框
                this.paramDialogVisible = false
              })
          } else if (this.addOReditor === 2) {
            // 修改请求
            req('updateUser', this.form)
              .then(res => {
                this.loading = true
                this.getParamsList(this.table.info)
                // this.$message('修改成功')
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                // 隐藏模态框
                this.paramDialogVisible = false
              })
          }
        } else {
          this.$message.error('请先按要求输入')
          this.checkMark = true
          return false
        }
      })
    },
    // 选中某一项的时候
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 删除
    deleteParam () {
      if (this.multipleSelection.length < 1) {
        this.$message('请选择需要删除的角色')
      } else {
        //  获取数据，发送请求删除
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let ids = []
          this.multipleSelection.map(item => ids.push(item.id))
          req('deleteParams', {ids: ids.join(',')})
          .then(res => {
            // this.$message('删除成功')
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.loading = true
            this.getParamsList(this.table.info)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
       //  返回
    goBack () {
      // 先把内容全部置空
      Object.keys(this.form).map(item => {
        this.form[item] = ''
      })
      // 隐藏模态框
      this.paramDialogVisible = false
    }
  },

  created () {},

  mounted () {
    this.table.search = { ...this.listParams }
  }
}
</script>

<style lang="scss" scoped>

</style>
