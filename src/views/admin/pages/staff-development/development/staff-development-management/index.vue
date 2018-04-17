<template>
  <div class="course">
     <section class="course">
    <!-- 课程查询 -->
    <!-- <div class="form-card card"> -->
    <i-layout>      
      <i-form  @reset="reset" @search="search" slot="header">
        <el-form-item label="员工编码">
          <el-input v-model="listParams.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="员工名称">
          <el-input v-model="listParams.employeeName"></el-input>
        </el-form-item>
      </i-form>
    <!-- </div> -->
    <!-- 课程表格 -->
      <div slot="section">
        <i-table :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table
              ref="multipleTable"
              :data="tableScope.clone"
              border tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"/>

                <!-- <el-table-column label="课程名称" prop="courseName" width="150"  fixed="left">
                  <template slot-scope="scope">
                    <el-button @click="handleTableClick(scope.row)" type="text">{{ scope.row.courseName }}</el-button>
                  </template>
                </el-table-column> -->

                <el-table-column v-for="(item, idx) in table.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :formatter="tableScope.formatter"
                  :align="item.align"
                />
                <!-- 操作按钮 -->
                 <el-table-column
                 min-width="180"
                 fixed="right"
                  label="操作">
                  <template slot-scope="scope">
                    <i-table-operator
                      :table="tableScope"
                      :row="scope.row"
                      />
                  </template>
                 </el-table-column>
              </el-table>
            </template>
        </i-table>
      </div>
    </i-layout>

    <!-- 新增&修改&查看模态框 -->
    <el-dialog :title="title" :visible.sync="userDialogVisible">
      <!-- 上表单 -->
      <!-- TODO：字段未修改 -->
      <el-form :model="form" :rules="rules" ref='form'>
        <el-form-item label="工号" :label-width="formLabelWidth"  prop="employeeCode">
          <el-input v-model="form.employeeCode" style='width:400px' :disabled='lookOnly'></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.employeeName" style='width:400px' :disabled='lookOnly'></el-input>
        </el-form-item>
        <el-form-item label="职位" :label-width="formLabelWidth" >
          <el-input v-model="form.positionName" style='width:400px' :disabled='lookOnly'></el-input>
        </el-form-item>
        <el-form-item label='归属团队' :label-width="formLabelWidth">
          <el-input v-model="form.orgName" style='width:400px' type="textarea" :disabled='lookOnly'></el-input>
        </el-form-item>
         <el-form-item label='员工发展通道' :label-width="formLabelWidth" prop="period">
          <el-input v-model="form.period" style='width:400px' :disabled='lookOnly'></el-input>
        </el-form-item>
         <el-form-item label='通道层级' :label-width="formLabelWidth" prop="period">
          <el-input v-model="form.period" style='width:400px' :disabled='lookOnly'></el-input>
        </el-form-item>
         <el-form-item label='员工发展计划模板' :label-width="formLabelWidth" prop="period">
          <el-input v-model="form.planTemplateId" style='width:400px' :disabled='lookOnly'></el-input>
        </el-form-item>
         <el-form-item label='贴身教练' :label-width="formLabelWidth" prop="period">
          <el-input v-model="form.coachId" style='width:400px' :disabled='lookOnly'></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="goBack" v-if="addOReditor !== 3">返 回</el-button>
        <el-button type="primary" @click="submitUserData('form')">确 定</el-button>
      </div>
    </el-dialog>
  </section>
  </div>
</template>

<script>
import req from 'api/staff-development/development'
import ISelect from 'components/common/i-select/i-select'
import ITable from 'components/common/i-table'
import IForm from 'components/common/i-form/i-form'
import ITableOperator from 'components/common/i-table-operator'
import ILayout from 'components/common/i-layout'
export default {
  components: {
    ISelect,
    ITable,
    IForm,
    ITableOperator,
    ILayout
  },
  data () {
    let checkNumber = (rule, value, cb) => {
      // let number = /^[0-9]+(.[0-9]{0,2})$/
      let number = /^([0-9]+\.\d{0,1}|\d+)$/
      !value && cb(new Error('课时不能为空'))
      setTimeout(function () {
        !number.test(value) ? cb(new Error('请输入数字格式')) : cb()
      }, 0)
    }
    return {
      listParams: {
        employeeCode: '',
        employeeName: ''
      },
      // 表格
      table: {
        columns: [
          { prop: 'employeeCode', label: '工号', width: 150 },
          { prop: 'employeeName', label: '姓名', width: 150 },
          { prop: 'positionName', label: '职位', width: 200, align: 'center' },
          { prop: 'orgName', label: '归属团队', width: 100, align: 'center' },
          { prop: 'coachName', label: '贴身教练', width: 100, display: {dict: 'STATUS'}, align: 'center' },
          { prop: 'contentName', label: '培训进度', width: 100, align: 'center' },
          { prop: 'contentOperator', label: '执行人', width: 100, align: 'center' },
          { prop: 'status', label: '状态', width: 100, align: 'center' }
        ],
        setting: {
          // 按钮
          toolbar: [
            {
              text: '新增',
              type: 'primary',
              func: () => this.insertCourse()
            }, {
              text: '删除',
              type: 'danger',
              func: () => this.delStaffManagement()
            }, {
              text: '启用',
              func: () => this.upStaffManagement()
            }, {
              text: '禁用',
              func: () => this.disabledStaffManagement()
            }
          ],
          operator: [{
            text: '查看',
            func: this.handleTableClick
          }, {
            text: '修改',
            func: this.editorCourse
          }, {
            text: '删除',
            func: this.delStaffManagement
          }]
        },
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },
         // 模态框
      userDialogVisible: false,
      formLabelWidth: '120px',
      // 表单
      form: {
        employeeCode: '',
        employeeName: '',
        positionName: '',
        orgName: '',
        period: ''
        // impPlanId: null
      },
      // 检验规则
      rules: {
        courseCategoryId: [
            { required: true, message: '请选择课程类别', trigger: 'blur' }
        ],
        // courseCode: [
        //     { required: true, message: '请输入账号', trigger: 'blur' }
        // ],
        courseName: [
            { required: true, message: '请填写课程名称', trigger: 'blur' }
        ],
        intro: [
            { required: true, message: '请填写课程介绍', trigger: 'blur' }
        ],
        period: [
            { required: true, validator: checkNumber, trigger: 'blur' }
        ]
      },
       // 记录选择的条数
      multipleSelection: [],
      // 保存标题名
      title: '',
      // 保存当前状态(新增还是编辑)
      addOReditor: 0,
      // 查看的时候模态框的内容不可编辑
      lookOnly: false
    }
  },
  computed: {
    userName () {
      return this.$store.state.user.info.fullName
    }
  },
  methods: {
     // 监听 pageIndex 和 pageSize 的变动
    handleSizeChange (options) {
      this.getStaffManagementList(options)
    },
    handleCurrentChange (options) {
      this.getStaffManagementList(options)
    },
    // ---------------------------------人员列表----------------------------------------
    // 获取课程列表
    getStaffManagementList (listParams) {
      req('getStaffManagementList', listParams)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(
          key => (this.table[key] = res[key])
        )
      })
      .catch(err => console.log(err))
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
    // 选中某一项的时候
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    //  新增课程方法
    insertCourse () {
      if (this.multipleSelection.length < 1) {
        // 先把form清空,以防上一次有影响
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
        this.title = '新增课程'
        this.addOReditor = 1
        // 显示模态框
        this.lookOnly = false
        this.userDialogVisible = true
      } else {
        this.$message('新增课程，不能选择人员')
      }
    },
    // 编辑课程方法
    editorCourse (row) {
      this.title = '编辑课程'
      this.addOReditor = 2
      req('findCourse', {impPlanId: row.impPlanId})
          .then(res => {
            Object.keys(res).map(item => {
              this.form[item] = res[item]
            })
            console.log(this.form)
          })
      this.lookOnly = false
      this.userDialogVisible = true
    },
       // 查看按钮
    handleTableClick (row) {
      this.title = '查看课程'
      this.addOReditor = 3
      req('findCourse', {impPlanId: row.impPlanId})
          .then(res => {
            Object.keys(res).map(item => {
              this.form[item] = res[item]
            })
          })
      this.userDialogVisible = true
      this.lookOnly = true
    },
    // 删除
    delStaffManagement (row) {
      let ids = ''
      if (!row && this.multipleSelection.length < 1) {
        this.$message('请选择人员')
        return false
      } else if (!row && this.multipleSelection.length >= 1) {
        this.multipleSelection.map(item => {
          ids += item.impPlanId + ','
        })
        ids = ids.slice(0, -1)
      } else {
        ids = row.impPlanId
      }
          //  获取数据，发送请求删除
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        req('delStaffManagement', {planIds: ids})
            .then(res => {
              if (res) {
                this.$message('删除成功')
                this.getStaffManagementList()
              }
            })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 启用
    upStaffManagement (row) {
      if (this.multipleSelection.length >= 1) {
        this.$confirm('确认启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          this.multipleSelection.map(item => {
            ids.push(item.impPlanId)
          })
          // ids.push(row.impCoachLibId)
          req('upStaffManagement', ids)
            .then(res => {
              if (res) {
                this.$message('启用成功')
                this.getStaffManagementList()
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else {
        this.$message('请选择人员')
      }
    },
    // 禁用
    disabledStaffManagement (row) {
      if (this.multipleSelection.length >= 1) {
        this.$confirm('确认禁用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          this.multipleSelection.map(item => {
            ids.push(item.impPlanId)
          })
          req('disabledStaffManagement', ids)
            .then(res => {
              if (res) {
                this.$message('禁用成功')
                this.getStaffManagementList()
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else {
        this.$message('请选择人员')
      }
    },
      // 提交新增或者编辑的数据
    submitUserData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 根据状态选择是发送新增请求还是修改的请求
          if (this.addOReditor === 1) {
            req('createCourse', this.form)
            .then(res => {
              this.$message('新增成功')
              this.getStaffManagementList()
            })
           .catch(err => console.log(err))
          } else if (this.addOReditor === 2) {
            console.log(this.form)
            req('updateCourse', this.form)
            .then(res => {
              this.$message('修改成功')
              this.getStaffManagementList()
            })
            .catch(err => console.log(err))
          }
       // 隐藏模态框
          this.userDialogVisible = false
        } else {
          this.$message('请先按要求输入')
          return false
        }
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
    }
  },
  created () {
    // 若需要默认 page 信息，自行传入，请勿直接挂载到 listParams 上
    this.getStaffManagementList({})
  }
}
</script>

<style lang="scss" scoped>

</style>
