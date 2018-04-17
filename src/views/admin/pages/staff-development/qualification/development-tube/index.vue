<template>
  <div class="ability">
     <section class="ability">
    <!-- 能力项查询 -->
    <!-- <div class="form-card card"> -->
    <i-layout>
      <i-form  @reset="reset" @search="search" slot="header">
        <el-form-item label="职种">
          <el-input v-model="listParams.jobClassId"></el-input>
        </el-form-item>
        <el-form-item label="通道类型">
          <el-input v-model="listParams.pathType"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <i-select v-model="listParams.status" parameter="STATUS"></i-select>
        </el-form-item>
      </i-form>
    <!-- </div> -->
    <!-- 通道表格 -->
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

                <!-- <el-table-column label="能力项类别" prop="abilityCategoryId" width="100"  fixed="left">
                  <template slot-scope="scope">
                    <el-button @click="getAbility(scope.row)" type="text">{{ scope.row.abilityCategoryId }}</el-button>
                  </template>
                </el-table-column>-->

                <el-table-column label="学习课程" prop="courseName" width="100"  fixed="left">
                  <template slot-scope="scope">
                    <el-button @click="getCourse(scope.row)" type="text">学习课程</el-button>
                  </template>
                </el-table-column>

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
      <el-form :model="form" :rules="rules" ref='form'>
        <el-form-item label="能力项类别" :label-width="formLabelWidth"  prop="abilityCategoryId">
          <el-input v-model="form.abilityCategoryId" style='width:400px' :disabled='lookOnly'></el-input>
        </el-form-item>
        <el-form-item label="能力项" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" style='width:400px' :disabled='lookOnly' ></el-input>
        </el-form-item>
        <el-form-item label="任职资格" :label-width="formLabelWidth"  prop="description">
          <el-input v-model="form.description" style='width:400px' :disabled='lookOnly' type="textarea"></el-input>
        </el-form-item>
        <el-form-item label='适用范围' :label-width="formLabelWidth" prop="orgScope">
          <i-select-tree
             v-model='orgScope'
             nodeKey="orgUnitId"
             dataKey="org"
             @change="handleSelectedNodeChange"
             :lazy="true"
             :multiple="true"
             :disabled='lookOnly'
             :readonly='lookOnly'
          ></i-select-tree>
        </el-form-item>
         <el-form-item label='学习课程' :label-width="formLabelWidth">
           <!-- 表格 -->
               <i-table :table="addCourseTable">
                  <template slot="table" slot-scope="tableScope">
                    <el-table
                      :data="tableScope.clone"
                     >
                    <el-table-column v-for="(item, idx) in addCourseTable.columns"
                     :key="idx"
                     :prop="item.prop"
                     :label="item.label"
                     :formatter="tableScope.formatter"
                     :align="item.align"
                     />
                      <!-- 操作按钮 -->
                 <el-table-column
                 min-width="50"
                 fixed="right"
                  label="操作"
                  v-if="showAdd"
                  >
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
          <!-- <el-input v-model="form.courses" style='width:400px' :disabled='lookOnly'></el-input> -->
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="goBack" v-if="addOReditor !== 3">返 回</el-button>
        <el-button type="primary" @click="submitUserData('form')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看课程弹框 -->
    <el-dialog title="查看学习课程" :visible.sync="courseDialogVisible">
      <i-layout>
      <div slot="section">
        <i-table :table="courseTable">
          <template slot="table" slot-scope="tableScope">
            <el-table
              :data="tableScope.clone"


              >
                <el-table-column v-for="(item, idx) in courseTable.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :formatter="tableScope.formatter"
                  :align="item.align"
                />
              </el-table>
            </template>
        </i-table>
      </div>
    </i-layout>
    </el-dialog>

    <!-- 课程表格模态框 -->
     <el-dialog title="查看学习课程" :visible.sync="courseListDialogVisible">
       <div class="form-card card">
      <i-form  @reset="reset1" @search="search1">
        <el-form-item label="课程类别">
          <el-input v-model="listParams1.courseCategoryId"></el-input>
        </el-form-item>
      </i-form>
    </div>
      <i-layout>
      <div slot="section">
        <i-table :table="courseAllTable"  @pageSizeChange="handleSizeChange1" @pageIndexChange="handleCurrentChange1">
          <template slot="table" slot-scope="tableScope">
            <el-table
               ref="multipleTable"
              :data="tableScope.clone"


              @selection-change="handleSelectionChange1"
              >
                <el-table-column type="selection" width="55"/>
                <el-table-column v-for="(item, idx) in courseAllTable.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :formatter="tableScope.formatter"
                  :align="item.align"
                />
              </el-table>
            </template>
        </i-table>
      </div>
    </i-layout>
     <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="courseListDialogVisible = false">返 回</el-button>
        <el-button type="primary" @click="submitCourse()">确 定</el-button>
      </div>
    </el-dialog>
  </section>
  </div>
</template>

<script>
import req from 'api/staff-development/qualification'
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
    // let check = (rule, value, cb) => {
    //   console.log(value.length === 0)
    //   if (value.length === 0) {
    //     return cb(new Error('使用范围不能为空'))
    //   } else {
    //     return cb()
    //   }
    // }
    return {
      listParams: {
        jobClassId: '',
        pathType: '',
        status: ''
      },
      listParams1: {
        courseCategoryId: ''
      },
      // 列表表格
      table: {
        columns: [
          { prop: 'jobFamilyName', label: '职群', width: 150 },
          { prop: 'jobClassName', label: '职种', width: 200, align: 'center', display: {dict: ''} },
          { prop: 'pathType', label: '通道类型', width: 200, align: 'center' },
          { prop: 'pathLevelName', label: '通道', width: 100, align: 'center' },
          { prop: 'status', label: '状态', width: 100, display: {dict: 'STATUS'}, align: 'center' },
          { prop: 'createBy', label: '操作人', width: 100, align: 'center' }
        ],
        setting: {
          // 按钮
          toolbar: [
            {
              text: '新增',
              type: 'primary',
              func: () => this.insertDevelopmentTube()
            }, {
              text: '删除',
              type: 'danger',
              func: () => this.delDevelopmentTube()
            }, {
              text: '启用',
              func: () => this.upDevelopmentTube()
            }, {
              text: '禁用',
              func: () => this.disableDevelopmentTube()
            }
          ],
          operator: [{
            text: '查看',
            func: this.getDevelopmentTube
          }, {
            text: '修改',
            func: this.editorDevelopmentTube     // 与 toolbar 类似，在 func 绑定相应的方法
          }, {
            text: '删除',
            func: this.delDevelopmentTube
          }]
        },
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },
      // 查看课程表格
      courseTable: {
        columns: [
          { prop: 'courseCode', label: '课程编号', width: 150 },
          { prop: 'courseCategoryId', label: '课程类型', width: 150 },
          { prop: 'courseName', label: '课程名称', width: 150 },
          // { prop: 'intro', label: '课程说明', width: 200, align: 'center' },
          { prop: 'period', label: '课时/h', width: 100, align: 'center' }
        ],
        data: null
      },
      // 新增和编辑的表格{}
      addCourseTable: {
        columns: [
          { prop: 'courseName', label: '课程名称', width: 150 }
        ],
        data: null,
        setting: {
          toolbar: [
            {
              text: '新增',
              type: 'primary',
              func: () => this.insertCourse(),
              show: () => {
                return { empty: !this.showAdd }
              }
            }
          ],
          operator: [{
            text: '删除',
            func: this.delAddAbility
          }]
        }
      },
      //  显示全部课表表格
      // 查看课程表格
      courseAllTable: {
        columns: [
          { prop: 'abilityCategoryId', label: '课程类型', width: 150 },
          { prop: 'courseName', label: '课程名称', width: 150 },
          { prop: 'intro', label: '课程说明', width: 200, align: 'center' }
        ],
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
      courseDialogVisible: false,
      courseListDialogVisible: false,
      // 表单
      form: {
        abilityCategoryId: '',
        name: '',
        description: '',
        orgScope: [],
        courses: []
        // impAbilityId: null
      },
      // 检验规则
      rules: {
        abilityCategoryId: [
            { required: true, message: '请选择能力类别', trigger: 'blur' }
        ],
        name: [
            { required: true, message: '请输入能力项', trigger: 'blur' }
        ],
        description: [
            { required: true, message: '请填写任职资格', trigger: 'blur' }
        ],
        orgScope: [
            { type: 'array', required: true, message: '适用范围不能为空', trigger: 'change' }
        ]
        // validator: check  message: '适用范围不能为空' type: 'array'
        // courses: [
        //     { required: true, message: '请输入学习课程', trigger: 'blur' }
        // ]
      },
       // 记录选择的条数
      multipleSelection: [],
      courseSelection: [],
      orgScope: '',
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
    },
    showAdd () {
      return !(this.addOReditor === 3)
    }
  },
  methods: {
     // 监听 pageIndex 和 pageSize 的变动
    handleSizeChange (options) {
      this.getDevelopmentTubeList(options)
    },
    handleCurrentChange (options) {
      this.getDevelopmentTubeList(options)
    },
      // 监听 pageIndex 和 pageSize 的变动
    handleSizeChange1 (options) {
      this.getCourseList(options)
    },
    handleCurrentChange1 (options) {
      this.getCourseList(options)
    },
    /** 监听树节点选择改变 */
    handleSelectedNodeChange (selected) {
      this.form.orgScope = selected
    },
    // ---------------------------------能力项列表&查询----------------------------------------
    // 获取列表
    getDevelopmentTubeList (listParams) {
      req('getDevelopmentTubeList', listParams)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(
          key => (this.table[key] = res[key])
        )
        // 查看通道
        this.table.data.map(item => {
          item.pathLevelName = ''
          item.impPathLevel.map(sel => {
            item.pathLevelName += sel.name + '-->'
          })
          item.pathLevelName = item.pathLevelName.slice(0, -3)
        })
        // console.log(this.table)
      })
      .catch(err => console.log(err))
    },
      // 获取课程列表
    getCourseList (listParams1) {
      req('getCourseList', listParams1)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(
          key => (this.courseAllTable[key] = res[key])
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
      // 查询
    search1 () {
      this.courseAllTable.search = { ...this.listParams1 }
    },
    // 重置
    reset1 () {
      //  新添加方法重置
      Object.keys(this.listParams1).map(item => {
        this.listParams1[item] = ''
      })
    },
    // ---------------------------------新增和编辑------------------------------------------
    //  新增课程方法
    insertDevelopmentTube () {
      if (this.multipleSelection.length < 1) {
        // 先把form清空,以防上一次有影响
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
        this.form.orgScope = []
        this.form.courses = []
        this.$set(this.addCourseTable, 'data', null)
        this.title = '新增能力项'
        this.addOReditor = 1
        // 显示模态框
        this.lookOnly = false
        this.userDialogVisible = true
      } else {
        this.$message('新增能力项，不能选择人员')
      }
    },
    // 编辑能力项方法
    editorDevelopmentTube (row) {
      this.title = '编辑能力项'
      this.addOReditor = 2
      console.log(row)
      req('findAbility', {impAbilityId: row.impAbilityId})
          .then(res => {
            Object.keys(res).map(item => {
              this.form[item] = res[item]
            })
            // 把获取的课程信息给表格的data
            this.form.courses = res.courses
            this.$set(this.addCourseTable, 'data', this.form.courses)
            console.log(this.form)
          })
      this.lookOnly = false
      this.userDialogVisible = true
    },
       // 查看能力项类别按钮
    getDevelopmentTube (row) {
      this.title = '查看职业发展通道'
      this.addOReditor = 3
      req('findDevelopmentTube', {impPathId: row.impPathId})
          .then(res => {
            Object.keys(res).map(item => {
              this.form[item] = res[item]
            })
            // 把获取的课程信息给表格的data
            this.$set(this.addCourseTable, 'data', res.courses)
          })
      this.userDialogVisible = true
      this.lookOnly = true
    },
    // 查看学习课程列表
    getCourse (row) {
      this.$set(this.courseTable, 'data', row)
      this.courseDialogVisible = true
    },
    //  -------------------------------------------新增删除里面的操作---------------------------------------------------
      // 选中某一项的时候
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSelectionChange1 (val) {
      this.courseSelection = val
    },
    //  --------------使用范围-------------------
    // ---------------------学习课程------------------
    // 新增或者修改的模态框的课程的删除
    delAddAbility (row) {
      // console.log(row)
      // 找到对应项并且删除
      let index = this.form.courses.findIndex(item => {
        return item.orgId === row.orgId
      })
      this.form.courses.splice(index, 1)
      this.addCourseTable.data = this.form.courses
    },
    // 新增或者修改的模态框的课程的添加，显示课程表格以供选择
    insertCourse () {
      // 获取课程表格全部内容
      this.getCourseList({
        ...this.listParams1,
        pageIndex: 1,
        pageSize: 10
      })
      // 课程表格显示
      this.courseListDialogVisible = true
    },
    // 新增课程条数
    submitCourse () {
      if (this.courseSelection.length <= 0) {
        return false
      } else {
        this.form.courses = this.courseSelection.concat(this.form.courses)
        this.addCourseTable.data = this.form.courses
      }
      this.courseListDialogVisible = false
    },
  // 提交新增或者编辑的数据
    submitUserData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 根据状态选择是发送新增请求还是修改的请求
          if (this.addOReditor === 1) {
            this.form.impAbilityId = null
            req('createDevelopmentTube', this.form)
            .then(res => {
              this.$message('新增成功')
              this.getDevelopmentTubeList()
            })
           .catch(err => console.log(err))
          } else if (this.addOReditor === 2) {
            req('updateDevelopmentTube', this.form)
            .then(res => {
              this.$message('修改成功')
              this.getDevelopmentTubeList()
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

    // --------------------------------------大表格的删除&启用&禁用------------------------------------------------------
    // 删除
    delDevelopmentTube (row) {
      let ids = ''
      if (!row && this.multipleSelection.length < 1) {
        this.$message('请选择人员')
        return false
      } else if (!row && this.multipleSelection.length >= 1) {
        this.multipleSelection.map(item => {
          ids += item.impPathId + ','
        })
        ids = ids.slice(0, -1)
      } else {
        ids = row.impPathId
      }
          //  获取数据，发送请求删除
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        req('delDevelopmentTube', {impPathIds: ids})
            .then(res => {
              if (res) {
                this.$message('删除成功')
                this.getDevelopmentTubeList()
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
    upDevelopmentTube (row) {
      if (this.multipleSelection.length >= 1) {
        this.$confirm('确认启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          this.multipleSelection.map(item => {
            ids.push(item.impPathId)
          })
          // ids.push(row.impCoachLibId)
          req('upDevelopmentTube', ids)
            .then(res => {
              if (res) {
                this.$message('启用成功')
                this.getDevelopmentTubeList()
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
    disableDevelopmentTube (row) {
      if (this.multipleSelection.length >= 1) {
        this.$confirm('确认启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          this.multipleSelection.map(item => {
            ids.push(item.impPathId)
          })
          // ids.push(row.impCoachLibId)
          req('disableDevelopmentTube', ids)
            .then(res => {
              if (res) {
                this.$message('启用成功')
                this.getDevelopmentTubeList()
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
    this.getDevelopmentTubeList()
  }
}
</script>

<style lang="scss" scoped>

</style>
