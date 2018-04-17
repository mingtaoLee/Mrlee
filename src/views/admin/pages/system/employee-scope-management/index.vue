<template>
  <div class="user-management">
     <!-- <section class="user-management"> -->
    <i-layout>
      <!-- 用户查询 -->
      <div slot="header" v-if="accessMap.comPersonnelGroupGet">
        <i-form  @reset="reset" @search="search">
          <el-form-item label="人事范围编号">
            <el-input v-model="listParams.personnelGroupCode" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="人事范围名称">
            <el-input v-model="listParams.personnelGroupName" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="所属公司编号">
            <el-input v-model="listParams.companyCode" maxlength="100"></el-input>
          </el-form-item>
        </i-form>
      </div>
      <!-- 字典表格 -->
      <div slot="section">
        <i-table :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table
              ref="multipleTable"
              :data="tableScope.clone"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              v-loading="loading"
              :element-loading-text="$loadingText"
              >
                <!-- <el-table-column type="selection" width="55" /> -->
                <el-table-column v-for="(item, idx) in table.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :formatter="tableScope.formatter"
                  :align="item.align"
                />

                <!-- 编辑按钮 -->
                 <!-- <el-table-column
                  fixed="right"
                  label="操作"
                  align="center"
                  width="100px"
                  >
                  <template slot-scope="scope"> -->
                    <i-table-operator :table="tableScope"/>
                  <!-- </template>
                 </el-table-column> -->
              </el-table>
            </template>
        </i-table>
      </div>
    </i-layout>

    <!-- 新增模态框 -->
    <i-dialog :title="title" v-model="userDialogVisible" :toolbar="toolbar" size="600">
      <!-- 上表单 -->
      <el-form :model="form" :rules="rules" ref='form'>
        <el-form-item label="人事范围编号" :label-width="formLabelWidth"  prop="personnelGroupCode">
          <el-input v-model="form.personnelGroupCode" style='width:500px' :disabled="addOReditor === 2" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="人事范围名称" :label-width="formLabelWidth"  prop="personnelGroupName">
          <el-input v-model="form.personnelGroupName" style='width:500px' maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label='所属公司名称' :label-width="formLabelWidth" prop="companyCode">
          <el-select v-model="form.companyCode" style='width:500px' filterable>
            <el-option v-for="item in companyList" :key='item.companyCode' :value="item.companyCode" :label="item.companyName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='所属区域' :label-width="formLabelWidth" prop="belongArea" required>
          <i-select-area search @change="changeArea" v-model="form.belongArea" style='width:500px'></i-select-area>
        </el-form-item>
        <el-form-item label='生效时间' :label-width="formLabelWidth" prop="startDate" required>
          <el-date-picker
            v-model="form.startDate"
            style='width:500px'
            placeholder="选择日期"
            type="date"
            :editable="false"
            :format="yyyy-MM-dd"
            :value-format="timestamp"
            :picker-options="pickerOption1"
            >
            </el-date-picker>
        </el-form-item>
        <el-form-item label='失效时间' :label-width="formLabelWidth" prop="endDate" required>
          <el-date-picker
            disabled
            v-model="form.endDate"
            type="date"
            :editable="false"
            :format="yyyy-MM-dd"
            :value-format="timestamp"
            style='width:500px'
            :picker-options="pickerOption2"
            placeholder="选择日期"
            >
            </el-date-picker>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="goBack">返 回</el-button>
        <el-button type="primary" @click="submitUserData('form')">提 交</el-button>
      </div> -->
    </i-dialog>
  <!-- </section> -->
  </div>
</template>

<script>
import req from 'api/system/employee-scope-management'
import ISelect from 'components/common/i-select/i-select'
import ITable from 'components/common/i-table'
import IForm from 'components/common/i-form/i-form'
import ITableOperator from 'components/common/i-table-operator'
import ILayout from 'components/common/i-layout'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import ISelectArea from 'components/common/i-select-area'
// import moment from 'moment'
import access from 'mixins/access'
export default {
  components: {
    ISelect,
    ITable,
    IForm,
    ITableOperator,
    ILayout,
    IDialog,
    ISelectArea
  },
  mixins: [access],
  data () {
    let checkCode = (rule, value, cb) => {
      let text = /^\w+$/
      !value && cb(new Error('请输入人事范围编号'))
      setTimeout(() => {
        !text.test(value) ? cb(new Error('只能输入数字字母下划线')) : cb()
      }, 0)
    }
    return {
      loading: true,
      listParams: {
        personnelGroupCode: '',
        personnelGroupName: '',
        companyCode: ''
      },
      toolbar: [{
        text: '取消',
        type: 'default',
        func: () => this.goBack()
      }, {
        text: '确定',
        type: 'primary',
        func: () => this.submitUserData('form')
      }],
      // 表格
      table: {
        columns: [
          // TODO:字段未修改
          { prop: 'personnelGroupCode', label: '人事范围编号', width: 100, align: 'center' },
          { prop: 'personnelGroupName', label: '人事范围名称', width: 200, align: 'center' },
          { prop: 'companyCode', label: '所属公司编号', width: 150, align: 'center' },
          { prop: 'companyName', label: '所属公司名称', width: 200, align: 'center' },
          { prop: 'startDate', label: '生效时间', width: 150, display: {date: ''}, align: 'center' },
          { prop: 'endDate', label: '失效时间', width: 150, display: {date: ''}, align: 'center' }
        ],
        setting: {
          // 按钮
          toolbar: [
            {
              text: '新增',
              type: 'primary',
              key: 'comPersonnelGroupPost',
              func: () => this.insertEmployeeScope()
            }
          ],
          operator: [{
            text: '修改',
            key: 'comPersonnelGroupPut',
            func: this.editorSystemUser     // 与 toolbar 类似，在 func 绑定相应的方法
          }, {
            text: '失效',
            key: 'comPersonnelGroupDisablePost',
            func: (row) => {
              this.loseEfficacy(row)
            },
            show (row) {
                // 只有有失效时间才显示
              if (row.endDate <= new Date()) {
                return { empty: true }
              }
            }
          }
          // {
          //   text: '删除',
          //   key: 'comPersonnelGroupDelete',
          //   func: (row) => {
          //     this.delEmployeeScope(row)
          //   },
          //   show (row) {
          //       // 只有有失效时间才显示
          //     if (row.endDate >= new Date()) {
          //       return { empty: true }
          //     }
          //   }
          // }
          ]
        },
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },
         // 新增模态框
      userDialogVisible: false,
      formLabelWidth: '120px',
      // 表单
      form: {
        personnelGroupCode: '',
        personnelGroupName: '',
        companyCode: '',
        // companyName: '',
        endDate: '',
        startDate: '',
        belongArea: ''
      },
      pickerOption1: {
        disabledDate: (time) => {
          let startTimeVal = this.form.endDate
          if (startTimeVal) {
            // return time.getTime() > new Date(startTimeVal)
            return time > startTimeVal
          }
        }
      },
      pickerOption2: {
        disabledDate: (time) => {
          let endTimeVal = this.form.startDate
          if (endTimeVal) {
            // return time.getTime() < new Date(endTimeVal)
            return time < endTimeVal
          }
        }
      },
      // 检验规则
      rules: {
        personnelGroupCode: [
          { required: true, validator: checkCode, trigger: 'blur' }
        ],
        personnelGroupName: [
          { required: true, message: '请输入人事范围名称', trigger: 'blur' }
        ],
        companyCode: [
          { required: true, message: '请输入所属公司名称', trigger: 'change' }
        ]
        // belongArea: [
        //   { required: true, message: '请选择所属区域', trigger: 'change' }
        // ]
        // endDate: [
        //   {required: true, message: '请输入结束时间', tigger: 'change'}
        // ],
        // startDate: [
        //   {required: true, message: '请输入开始时间', tigger: 'change'}
        // ]
      },
       // 记录选择的条数
      // multipleSelection: [],
      // 保存标题名
      title: '',
      // 保存当前状态(新增还是编辑)
      addOReditor: 0,
      // 公司下拉列表
      companyList: [],
      // 是否存在有校验失败情况
      checkMark: false
    }
  },

  methods: {
     // 监听 pageIndex 和 pageSize 的变动
    handleSizeChange (options) {
      this.loading = true
      this.getEmployeeScopeManagementList(options)
    },
    handleCurrentChange (options) {
      this.loading = true
      this.getEmployeeScopeManagementList(options)
    },
    // ---------------------------------人员列表----------------------------------------
    // 获取人员列表
    getEmployeeScopeManagementList (listParams) {
      req('getEmployeeScopeManagementList', listParams)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(
          key => (this.table[key] = res[key])
        )
        this.loading = false
      })
      .catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    // 获取公司名称列表
    getCompanyList () {
      req('getCompanyList')
      .then(res => {
        this.companyList = res
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
    // ---------------------------------新增和编辑------------------------------------------
    //  新增系统用户方法
    insertEmployeeScope () {
        // 先把form清空,以防上一次有影响
      Object.keys(this.form).map(item => {
        this.form[item] = ''
      })
      this.title = '新增人事范围'
      this.addOReditor = 1
        // 显示模态框
      this.userDialogVisible = true
      this.checkMark = false
      this.form['endDate'] = new Date('9999-12-31')
    },
    // 编辑系统用户方法
    editorSystemUser (row) {
      // 清空上一次的校验结果
      this.checkMark && this.$refs['form'].resetFields()
      this.title = '编辑人事范围'
      this.addOReditor = 2
      req('getEmployeeScope', {personnelGroupCode: row.personnelGroupCode})
        .then(res => {
          console.log(res)
          Object.keys(res).map(item => {
            this.form[item] = res[item]
          })
          this.form['endDate'] = new Date('9999-12-31')
        })
      this.userDialogVisible = true
    },
      // 提交新增或者编辑的数据
    submitUserData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.form.endDate && this.form.startDate && this.form.belongArea) {
          // 根据状态选择是发送新增请求还是修改的请求
          if (this.addOReditor === 1) {
            req('createEmployeeScope', this.form)
            .then(res => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              Object.keys(this.form).map(key => { this.form[key] = '' })
              this.loading = true
              this.getEmployeeScopeManagementList()
              // 隐藏模态框
              this.userDialogVisible = false
            })
          } else if (this.addOReditor === 2) {
            req('updateEmployeeScope', this.form)
            .then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              Object.keys(this.form).map(key => { this.form[key] = '' })
              this.loading = true
              this.getEmployeeScopeManagementList()
              // 隐藏模态框
              this.userDialogVisible = false
            })
          }
        } else {
          this.$message.error('请先按要求输入')
          this.checkMark = true
          return false
        }
      })
    },
    // ---------------------------------实现&删除-----------------------------------------------
    // 失效
    loseEfficacy (row) {
      this.$confirm('确认把该人事范围置为失效?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        req('loseEfficacy', {personnelGroupCode: row.personnelGroupCode})
          .then(res => {
            if (res) {
              this.$message({
                message: '设置成功',
                type: 'success'
              })
              this.loading = true
              this.getEmployeeScopeManagementList()
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    //  删除
    delEmployeeScope (row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        req('delEmployeeScope', {personnelGroupCode: row.personnelGroupCode})
          .then(res => {
            if (res) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.loading = true
              this.getEmployeeScopeManagementList()
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
     //  返回
    goBack () {
      // 先把内容全部置空
      Object.keys(this.form).map(item => {
        this.form[item] = ''
      })
      // 隐藏模态框
      this.userDialogVisible = false
    },

    changeArea (val) {
      // console.log(this.form.area)
      console.log(val)
    }
  },
  watch: {
      // 调薪生效日期
    'form.startDate': {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          newVal = newVal.getTime()
        }
      },
      deep: true
    },
    'form.endDate': {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          newVal = newVal.getTime()
        }
      },
      deep: true
    }
  },

  created () {
    this.getCompanyList()
  },

  mounted () {
    this.table.search = { ...this.listParams }
  }
}
</script>

<style lang="scss" scoped>

</style>
