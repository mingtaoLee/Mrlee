<template>
  <div class="course">
     <section class="course">
    <!-- 课程查询 -->
    <!-- <div class="form-card card"> -->
    <i-layout>
      <i-form  @reset="reset" @search="search" slot="header">
        <el-form-item label="模板名称">
          <el-input v-model="listParams.name"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <i-select v-model="listParams.status" parameter="STATUS"></i-select>
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
        <el-form-item label="模板名称" :label-width="formLabelWidth"  prop="name">
          <el-input v-model="form.name" style='width:400px' :disabled='lookOnly'></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" style='width:400px' :disabled='lookOnly' type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="适用范围" :label-width="formLabelWidth"  prop="orgData">
          <!-- <el-input v-model="form.orgData" style='width:400px' :disabled='lookOnly'></el-input> -->
           <i-select-tree
             nodeKey="orgUnitId"
             dataKey="org"
             v-model="selectedIds"
             :lazy="true"
             :multiple="true"
             :disabled='lookOnly'
             :readonly='lookOnly'
             @change="handleSelectedNodeChange"
             style='width:400px'
          ></i-select-tree>
        </el-form-item>
        <el-form-item label='计划方案' :label-width="formLabelWidth" prop="intro">
          <el-input v-model="form.contentData" style='width:400px' type="textarea" :disabled='lookOnly'></el-input>
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
import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'

export default {
  components: {
    ISelect,
    ITable,
    IForm,
    ITableOperator,
    ILayout,
    ISelectTree
  },
  data () {
    return {
      selectedIds: '',
      listParams: {
        name: '',
        status: ''
      },
      // 表格
      table: {
        columns: [
          { prop: 'name', label: '模板名称', width: 150 },
          { prop: 'orgName', label: '适用范围', width: 150 },
          { prop: 'description', label: '描述', width: 200, align: 'center' },
          { prop: 'status', label: '状态', width: 100, display: {dict: 'STATUS'}, align: 'center' }
        ],
        setting: {
          // 按钮
          toolbar: [
            {
              text: '新增',
              type: 'primary',
              func: () => this.insertStaffTemplate()
            }, {
              text: '删除',
              type: 'danger',
              func: () => this.delStaffTemplate()
            }, {
              text: '启用',
              func: () => this.upStaffTenplate()
            }, {
              text: '禁用',
              func: () => this.disabledStaffTmeplate()
            }
          ],
          operator: [{
            text: '查看',
            func: this.handleTableClick
          }, {
            text: '修改',
            func: this.editorStaffTemplate     // 与 toolbar 类似，在 func 绑定相应的方法
          }, {
            text: '删除',
            func: this.delStaffTemplate
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
        name: '',
        description: '',
        orgData: [],
        contentData: []
      },
      // 检验规则
      rules: {
        name: [
            { required: true, message: '请填写模板名称', trigger: 'blur' }
        ],
        description: [
            { required: true, message: '请填写模板介绍', trigger: 'blur' }
        ],
        orgData: [
            { type: 'array', required: true, message: '选择适用范围', trigger: 'change' }
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
      this.getStaffDevelopmentTemplateList(options)
    },
    handleCurrentChange (options) {
      this.getStaffDevelopmentTemplateList(options)
    },
    handleSelectedNodeChange (selected) {
      this.form.orgData = selected
    },
    // ---------------------------------人员列表----------------------------------------
    // 获取课程列表
    getStaffDevelopmentTemplateList (listParams) {
      req('getStaffDevelopmentTemplateList', listParams)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(
          key => (this.table[key] = res[key])
        )
          // 适用范围
        this.table.data.map(item => {
          item.orgName = ''
          item.orgData.map(sel => {
            item.orgName += sel.orgUnitName + '、'
          })
          item.orgName = item.orgName.slice(0, -1)
        })
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
    insertStaffTemplate () {
      if (this.multipleSelection.length < 1) {
        // 先把form清空,以防上一次有影响
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
        this.selectedIds = ''
        this.form.orgData = []
        this.form.contentData = []
        this.title = '新增计划模板'
        this.addOReditor = 1
        // 显示模态框
        this.lookOnly = false
        this.userDialogVisible = true
      } else {
        this.$message('新增计划模板，不能选择人员')
      }
    },
    // 编辑课程方法
    editorStaffTemplate (row) {
      this.title = '编辑课程'
      this.addOReditor = 2
      req('findStaffTemplate', {planTemplateId: row.impPlanTemplateId})
          .then(res => {
            Object.keys(res).map(item => {
              this.form[item] = res[item]
            })
            this.selectedIds = this.from.orgData.map(item => {
              return item.orgUnitId
            }).toString()
            this.form.impPlanTemplateId = res.impPlanTemplateId
            console.log(this.form)
          })
      this.lookOnly = false
      this.userDialogVisible = true
    },
       // 查看按钮
    handleTableClick (row) {
      this.title = '查看课程'
      this.addOReditor = 3
      req('findStaffTemplate', {planTemplateId: row.impPlanTemplateId})
          .then(res => {
            console.log(res)
            Object.keys(res).map(item => {
              this.form[item] = res[item]
            })
          })
      this.userDialogVisible = true
      this.lookOnly = true
    },
// -------------------------新增&编辑里面的方法------------------------

    // ------------------------------删除&启用&禁用-------------------------------
    // 删除
    delStaffTemplate (row) {
      let ids = ''
      if (!row && this.multipleSelection.length < 1) {
        this.$message('请选择人员')
        return false
      } else if (!row && this.multipleSelection.length >= 1) {
        this.multipleSelection.map(item => {
          ids += item.planTemplateId + ','
        })
        ids = ids.slice(0, -1)
      } else {
        ids = row.planTemplateId
      }
          //  获取数据，发送请求删除
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        req('delStaffTemplate', {templateIds: ids})
            .then(res => {
              if (res) {
                this.$message('删除成功')
                this.getStaffDevelopmentTemplateList()
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
    upStaffTenplate (row) {
      if (this.multipleSelection.length >= 1) {
        this.$confirm('确认启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          this.multipleSelection.map(item => {
            ids.push(item.impCourseId)
          })
          // ids.push(row.impCoachLibId)
          req('upStaffTenplate', ids)
            .then(res => {
              if (res) {
                this.$message('启用成功')
                this.getStaffDevelopmentTemplateList()
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
    disabledStaffTmeplate (row) {
      if (this.multipleSelection.length >= 1) {
        this.$confirm('确认禁用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          this.multipleSelection.map(item => {
            ids.push(item.impCourseId)
          })
          req('disabledStaffTmeplate', ids)
            .then(res => {
              if (res) {
                this.$message('禁用成功')
                this.getStaffDevelopmentTemplateList()
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
            console.log(this.form)
            req('createStaffTemplate', this.form)
            .then(res => {
              this.$message('新增成功')
              this.getStaffDevelopmentTemplateList({})
            })
           .catch(err => console.log(err))
          } else if (this.addOReditor === 2) {
            console.log(this.form)
            req('updateStaffTemplate', this.form)
            .then(res => {
              this.$message('修改成功')
              this.getStaffDevelopmentTemplateList({})
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
    this.getStaffDevelopmentTemplateList({})
  }
}
</script>

<style lang="scss" scoped>

</style>
