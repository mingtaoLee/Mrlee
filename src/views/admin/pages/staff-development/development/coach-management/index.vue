<template>
  <div class="course">
     <section class="course">
    <!-- <!-教练库表格 -->
    <i-layout>
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

                <!-- <el-table-column label="教练库名称" prop="name" width="150"  fixed="left">
                  <template slot-scope="scope">
                    <el-button @click="handleTableClick(scope.row)" type="text">{{ scope.row.name }}</el-button>
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
        <el-form-item label="教练库名称" :label-width="formLabelWidth"  prop="name">
          <el-input v-model="form.name" style='width:400px' :disabled='lookOnly'></el-input>
        </el-form-item>
        <el-form-item label="适用范围" :label-width="formLabelWidth" prop='libScopes'>
           <!-- <el-form-item label='适用范围' :label-width="formLabelWidth" prop="orgScope"> -->
           <i-select-tree
             nodeKey="orgUnitId"
             dataKey="org"
             v-model="selectedLibIds"
             :lazy="true"
             :multiple="true"
             :disabled='lookOnly'
             @change="handleSelectedLibScopesChange"
             style='width:400px'
           ></i-select-tree>
        </el-form-item>
        <el-form-item label="入库要求" :label-width="formLabelWidth"  prop="abilitys">
          <!-- 表格 -->
               <i-table :table="addCoachTable">
                  <template slot="table" slot-scope="tableScope">
                    <el-table
                      :data="tableScope.clone"
                     >
                   <el-table-column label="能力项" min-width="100">
                  <template slot-scope="scope">
                    <el-button @click="getAbilityInfo(scope.row)" type="text">{{ scope.row.name }}</el-button>
                  </template>
                </el-table-column>
                      <!-- 操作按钮 -->
                 <el-table-column
                 width="100"
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
          <!-- <el-input v-model="form.abilitys" style='width:400px' :disabled='lookOnly'></el-input> -->
        </el-form-item>
        <el-form-item label='补充说明' :label-width="formLabelWidth">
          <el-input v-model="form.description" style='width:400px' type="textarea" :disabled='lookOnly'></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="goBack" v-if="addOReditor !== 3">返 回</el-button>
        <el-button type="primary" @click="submitUserData('form')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增能力项的所有列表模态框 -->
    <el-dialog :visible.sync="abilityDialogVisible">
        <!-- 能力项查询 -->
    <div class="form-card card">
      <i-form  @reset="reset" @search="search">
        <el-form-item label="能力项类别">
          <el-input v-model="abilityParams.abilityCategoryId"></el-input>
        </el-form-item>
        <el-form-item label="能力项名称">
          <el-input v-model="abilityParams.name"></el-input>
        </el-form-item>
      </i-form>
    </div>
    <!-- 能力项表格 -->
    <i-layout >
      <div slot="section">
        <i-table :table="abilityTable" @pageSizeChange="handleSizeChange1" @pageIndexChange="handleCurrentChange1">
          <template slot="table" slot-scope="tableScope">
            <el-table
              ref="multipleTable"
              :data="tableScope.clone"
              border tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange1"
              >
                <el-table-column type="selection" width="55"/>
                <el-table-column v-for="(item, idx) in abilityTable.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
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
        <el-button @click="abilityDialogVisible = false">返 回</el-button>
        <el-button type="primary" @click="addAbilityToForm()">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 查看单个能力项信息的模态框 -->
    <el-dialog :title="title" :visible.sync="abilityInfoVisible">
      <!-- 上表单 -->
      <el-form :model="abilityForm" :rules="rules" ref='abilityForm'>
        <el-form-item label="能力项类别" :label-width="formLabelWidth">
          <el-input v-model="abilityForm.abilityCategoryId" style='width:400px' :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="能力项" :label-width="formLabelWidth">
          <el-input v-model="abilityForm.name" style='width:400px' :disabled='true' ></el-input>
        </el-form-item>
        <el-form-item label="任职资格" :label-width="formLabelWidth" >
          <el-input v-model="abilityForm.description" style='width:400px' :disabled='true' type="textarea"></el-input>
        </el-form-item>
        <el-form-item label='适用范围' :label-width="formLabelWidth">
          <i-select-tree
             nodeKey="orgUnitId"
             dataKey="org"
             v-model="selectedOrgIds"
             :selectedNode.sync="abilityForm.orgScope"
             :lazy="true"
             :multiple="true"
             :disabled='true'
             @change="handleSelectedOrgScopeChange"
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
                  </el-table>
                 </template>
              </i-table>
          <!-- <el-input v-model="form.courses" style='width:400px' :disabled='lookOnly'></el-input> -->
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="abilityInfoVisible =false">返 回</el-button>
        <el-button type="primary" @click="abilityInfoVisible =false">确 定</el-button>
      </div>
    </el-dialog>
  </section>
  </div>
</template>

<script>
import req from 'api/staff-development/development'
import reqAbility from 'api/staff-development/qualification'
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
      selectedOrgIds: '',
      selectedLibIds: '',
      listParams: {
        courseCategoryId: '',
        courseName: '',
        status: ''
      },
      // 表格
      table: {
        columns: [
          { prop: 'name', label: '教练库名称', width: 150 },
          { prop: 'scope', label: '适用范围', width: 150 },
          { prop: 'ability', label: '入库要求', width: 200, align: 'center' },
          { prop: 'status', label: '状态', width: 100, display: {dict: 'STATUS'}, align: 'center' }
        ],
        setting: {
          // 按钮
          toolbar: [
            {
              text: '新增',
              type: 'primary',
              func: () => this.insertCoach()
            }, {
              text: '删除',
              type: 'danger',
              func: () => this.delCoach()
            }, {
              text: '启用',
              func: () => this.upCoach()
            }, {
              text: '禁用',
              func: () => this.disableCoach()
            }
          ],
          operator: [{
            text: '进入',
            func: this.toRecode
          }, {
            text: '查看',
            func: this.handleTableClick
          }, {
            text: '修改',
            func: this.editorCoach     // 与 toolbar 类似，在 func 绑定相应的方法
          }, {
            text: '删除',
            func: this.delCoach
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
        libScopes: [],
        abilitys: [],
        description: ''
      },
      // 单个能力项表单
      abilityForm: {
        abilityCategoryId: '',
        name: '',
        description: '',
        orgScope: [],
        courses: []
        // impAbilityId: null
      },
      // 当个能力项
      addCourseTable: {
        columns: [
          { prop: 'courseName', label: '课程名称', width: 150 }
        ]
      },
      // 检验规则
      rules: {
        name: [
            { required: true, message: '请填写教练库名', trigger: 'blur' }
        ],
        libScopes: [
            { type: 'array', required: true, message: '请填写使用范围', trigger: 'blur' }
        ],
        abilitys: [
            { type: 'array', required: true, message: '请填写入库要求', trigger: 'blur' }
        ]
      },
       // 记录选择的条数
      multipleSelection: [],
      multipleSelection1: [],
      // 保存标题名
      title: '',
      // 保存当前状态(新增还是编辑)
      addOReditor: 0,
      // 查看的时候模态框的内容不可编辑
      lookOnly: false,
      // 能力项列表模态框
      abilityDialogVisible: false,
      // 单个能力表模态框
      abilityInfoVisible: false,
       // 新增和编辑的表格{}
      addCoachTable: {
        data: null,
        setting: {
          toolbar: [
            {
              text: '新增',
              type: 'primary',
              func: () => this.addAbility(),
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
      abilityTable: {
        columns: [
          { prop: 'name', label: '能力项', width: 150 },
          { prop: 'abilityCategoryId', label: '能力项类别', width: 150 }
        ],
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },
      abilityParams: {
        name: '',
        abilityCategoryId: ''
      }
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
      this.getCoachList(options)
    },
    handleCurrentChange (options) {
      this.getCoachList(options)
    },
    // 能力项表格
    handleSizeChange1 (options) {
      this.getAbility(options)
    },
    handleCurrentChange1 (options) {
      this.getAbility(options)
    },
    handleSelectedLibScopesChange (selected) {
      this.form.libScopes = selected
    },
    handleSelectedOrgScopeChange (selected) {
      this.abilityForm.orgScope = selected
    },
    // ---------------------------------列表----------------------------------------
    // 获取列表
    getCoachList (listParams) {
      req('getCoachList', listParams)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(
          key => (this.table[key] = res[key])
        )
        // 使用范围，入库要求
        this.table.data.map(item => {
          item.ability = ''
          item.scope = ''
          item.libScopes.map(sel => {
            item.scope += sel.orgUnitName + '、'
          })
          item.abilitys.map(sel => {
            item.ability += sel.name + '、'
          })
          item.scope = item.scope.slice(0, -1)
          item.ability = item.ability.slice(0, -1)
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
    // 能力项表格选中
      // 选中某一项的时候
    handleSelectionChange1 (val) {
      this.multipleSelection1 = val
    },
    // 新增 教练库方法
    insertCoach () {
      if (this.multipleSelection.length < 1) {
        // 先把form清空,以防上一次有影响
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
        this.selectedLibIds = ''
        this.form.abilitys = []
        this.form.libScopes = []
        this.$set(this.addCoachTable, 'data', this.form.abilitys)
        this.title = '新增教练库'
        this.addOReditor = 1
        // 显示模态框
        this.lookOnly = false
        this.userDialogVisible = true
      } else {
        this.$message('新增教练库，不能选择人员')
      }
    },
    // 修改教练库方法
    editorCoach (row) {
      this.title = '修改教练库'
      this.addOReditor = 2
      req('findCoach', {coachlibId: row.impCoachLibId})
          .then(res => {
            Object.keys(res).map(item => {
              this.form[item] = res[item]
            })
            this.selectedLibIds = this.form.libScopes.map(item => {
              return item.orgUnitId
            }).toString()
            this.form.abilitys = res.abilitys
            this.$set(this.addCoachTable, 'data', this.form.abilitys)
            console.log(this.form)
          })
      this.lookOnly = false
      this.userDialogVisible = true
    },
       // 查看按钮
    handleTableClick (row) {
      this.title = '查看教练库'
      this.addOReditor = 3
      req('findCoach', {coachlibId: row.impCoachLibId})
          .then(res => {
            Object.keys(res).map(item => {
              this.form[item] = res[item]
            })
            console.log(res)
            this.form.abilitys = res.abilitys
            this.$set(this.addCoachTable, 'data', this.form.abilitys)
          })
      this.userDialogVisible = true
      this.lookOnly = true
    },
    // ---------------------------------新增编辑弹框能力项的方法--------------------------------------
    // 点击能力项名字获取对应的能力项内容
    //  能力项表格的新增,获取全部的能力项表格
    addAbility () {
      this.getAbility()
      this.abilityDialogVisible = true
    },
    // 获取能力项的列表
    getAbility (abilityParams) {
      // 获取能力项的数据
      reqAbility('getAbilityList', abilityParams)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(
          key => (this.abilityTable[key] = res[key])
        )
      })
    },
    //  点击能力项表格的确定按钮，把数据给form和addCoachTable
    addAbilityToForm () {
      console.log(this.form.abilitys)
      // 把选择的能力项拼接到列表上
      if (this.multipleSelection1.length <= 0) {
        return false
      } else {
        this.form.abilitys = this.multipleSelection1.concat(this.form.abilitys)
        this.addCoachTable.data = this.form.abilitys
        console.log(this.form.abilitys)
      }
      this.abilityDialogVisible = false
    },
    // 删除能力项，删除对应的列表能力项
    delAddAbility (row) {
      console.log(row)
            // 找到对应项并且删除
      let index = this.form.abilitys.findIndex(item => {
        return item.impAbilityId === row.impAbilityId
      })
      this.form.abilitys.splice(index, 1)
      this.addCoachTable.data = this.form.abilitys
    },
    // 点击能力项名称，获取对应的能力的信息
    getAbilityInfo (row) {
      this.title = '查看能力项'
      this.addOReditor = 3
      reqAbility('findAbility', {impAbilityId: row.impAbilityId})
          .then(res => {
            Object.keys(res).map(item => {
              this.abilityForm[item] = res[item]
            })
            this.selectedOrgIds = this.abilityForm.orgScope.map(item => {
              return item.orgUnitId
            }).toString()
            // 把获取的课程信息给表格的data
            this.$set(this.addCourseTable, 'data', res.courses)
          })
      this.abilityInfoVisible = true
    },
// ---------------------提交新增或者编辑的数据----------------------------------------
    submitUserData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 根据状态选择是发送新增请求还是修改的请求
          if (this.addOReditor === 1) {
            req('createCoach', this.form)
            .then(res => {
              this.$message('新增成功')
              this.getCoachList()
            })
           .catch(err => console.log(err))
          } else if (this.addOReditor === 2) {
            // console.log(this.form)
            req('updateCoach', this.form)
            .then(res => {
              this.$message('修改成功')
              this.getCoachList()
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
    // ---------------------------进入&删除&禁用&启用--------------------------
    // 进入
    toRecode () {
      this.$router.push('coach_staff_management')
    },
    // 删除
    delCoach (row) {
          //  获取数据，发送请求删除
      console.log(row)
      let ids = ''
      if (!row && this.multipleSelection.length < 1) {
        this.$message('请选择人员')
        return false
      } else if (!row && this.multipleSelection.length >= 1) {
        this.multipleSelection.map(item => {
          ids += item.impCoachLibId + ','
        })
        ids = ids.slice(0, -1)
      } else {
        ids = row.impCoachLibId
      }
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        req('delCoach', {coachlibId: ids})
            .then(res => {
              if (res) {
                this.$message('删除成功')
                this.getCoachList()
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
    upCoach (row) {
                //  获取数据，发送请求删除
      if (this.multipleSelection.length >= 1) {
        this.$confirm('确认启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          this.multipleSelection.map(item => {
            ids.push(item.impCoachLibId)
          })
          // ids.push(row.impCoachLibId)
          req('upCoach', ids)
            .then(res => {
              if (res) {
                this.$message('启用成功')
                this.getCoachList()
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
    disableCoach (row) {
      if (this.multipleSelection.length >= 1) {
        this.$confirm('确认启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          this.multipleSelection.map(item => {
            ids.push(item.impCoachLibId)
          })
          req('disableCoach', ids)
            .then(res => {
              if (res) {
                this.$message('禁用成功')
                this.getCoachList()
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
    this.getCoachList({
      // ...this.listParams,
      // pageIndex: 1,
      // pageSize: 10
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
