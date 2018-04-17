<template>
  <div class="coachStaffManagement">
     <section class="coachStaffManagement">
    <!-- 课程查询 -->
    <!-- <div class="form-card card"> -->
    <i-layout>      
      <i-form  @reset="reset" @search="search" slot="header">
        <el-form-item label="教练库名称">
          <el-input v-model="listParams.coachlibName"></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="listParams.positionName"></el-input>
        </el-form-item>
        <el-form-item label="员工号">
          <el-input v-model="listParams.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="员工名称">
          <el-input v-model="listParams.employeeName"></el-input>
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
          <el-form-item label="名字" prop="employeeName" :label-width="formLabelWidth">
            <el-input v-model="form.employeeName"readonly :disabled="!isSelect" style='width:400px'>
               <i slot="suffix" class="el-icon-menu" @click="handleIconClick" ></i>                            
            </el-input>
            <i-personnel-select :isShow.sync="isShow" @confirm="handleConfirm":multiple="false" :modal="false" size='small'></i-personnel-select>
          </el-form-item>
          <el-form-item label="职位" :label-width="formLabelWidth">
             <el-input v-model="form.positionName" style='width:400px' :disabled='true'></el-input>
          </el-form-item>
          <el-form-item label="归属团队" :label-width="formLabelWidth" >
            <el-input v-model="form.orgUnitName" style='width:400px' :disabled='true'></el-input>
          </el-form-item>
          <el-form-item label='教练库' :label-width="formLabelWidth">
            <el-select v-model="form.coachlibId" placeholder="请选择" v-if='isSelect' style='width:400px'>
              <el-option
                v-for="item in coachNameList"
                :key="item.impCoachLibId"
                :label="item.name"
                :value="item.impCoachLibId">
              </el-option>
             </el-select>
          <el-input v-model="form.coachlibName" style='width:400px' v-else :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label='入库时间' :label-width="formLabelWidth" prop="inLibDate">
            <el-date-picker
               v-model="form.inLibDate"
               type="date"
               placeholder="选择日期"
               @input ="getTime"
               style='width:400px'
              >
            </el-date-picker>
          </el-form-item>
         <el-form-item label='入库鉴定结果' :label-width="formLabelWidth" prop="changeDescription">
          <el-input v-model="form.changeDescription" type="textarea"style='width:400px'></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="goBack">返 回</el-button>
        <el-button type="primary" @click="submitUserData('form')">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 出库模态框 -->
    <el-dialog :visible.sync="outputDialogVisible">
      <el-form :model="outputParams" :rules="outputFormRules" ref='outputForm'>
        <el-form-item label="出库日期" prop="outLibDate" :label-width="formLabelWidth">
           <el-date-picker
               v-model="outputParams.outLibDate"
               type="date"
               placeholder="选择日期"
               @change="getoutTime"
               >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="出库原因" prop="changeDescription" :label-width="formLabelWidth">
          <el-input v-model="outputParams.changeDescription" type="textarea"></el-input>
        </el-form-item>
      </el-form>
         <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="outputDialogVisible = false">返 回</el-button>
        <el-button type="primary" @click="submitOutputData('outputForm')">确 定</el-button>
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
import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import moment from 'moment'
export default {
  components: {
    ISelect,
    ITable,
    IForm,
    ITableOperator,
    ILayout,
    iPersonnelSelect
  },
  data () {
    return {
      listParams: {
        courseCategoryId: '',
        courseName: '',
        status: ''
      },
      // 表格
      table: {
        columns: [
          { prop: 'employeeCode', label: '工号', width: 150 },
          { prop: 'employeeName', label: '姓名', width: 150 },
          { prop: 'positionName', label: '职位', width: 200, align: 'center' },
          { prop: 'orgUnitName', label: '所属团队', width: 100, align: 'center' },
          { prop: 'coachlibName', label: '教练库', width: 100, align: 'center' },
          { prop: 'inLibDate', label: '入库时间', width: 150, align: 'center', display: { date: '' } },
          { prop: 'status', label: '状态', width: 100, align: 'center' }
        ],
        setting: {
          // 按钮
          toolbar: [
            {
              text: '入库',
              type: 'primary',
              func: () => this.inPut(),
              show: () => { return { empty: this.flag } }
            }
            // {
            //   text: '重新入库',
            //   type: 'primary',
            //   func: () => this.inPut(),
            //   show: () => { return { empty: !this.flag } }
            // }, {
            //   text: '已出库人员',
            //   type: 'primary',
            //   func: () => this.hadOutPut(),
            //   show: () => { return { empty: this.flag } }
            // }, {
            //   text: '已入库人员',
            //   type: 'primary',
            //   func: () => this.hadInput(),
            //   show: () => { return { empty: !this.flag } }
            // }
          ],
          operator: [{
            text: '修改',
            func: this.editorCoach,     // 与 toolbar 类似，在 func 绑定相应的方法
            show: () => { return { empty: this.flag } }
          }, {
            text: '出库',
            func: this.outPut,
            show: () => { return { empty: this.flag } }
          }
          // {
          //   text: '重新入库',
          //   func: this.inPutAgain,
          //   show: () => { return { empty: !this.flag } }
          // }, {
          //   text: '历史记录',
          //   func: this.history,
          //   show: () => { return { empty: !this.flag } }
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
      // 记录是出库还是入库 1---入库  2---出库
      inOrput: 2,
      isShow: false,
         // 模态框
      userDialogVisible: false,
      formLabelWidth: '120px',
      // 表单
      form: {
        employeeId: '',
        employeeName: '',
        positionName: '',
        orgUnitName: '',
        coachlibId: '',
        coachlibName: '',
        inLibDate: '',
        changeDescription: ''
      },
      // 检验规则
      rules: {
        employeeName: [
            { required: true, message: '请填写名字', trigger: 'change' }
        ],
        changeDescription: [
            { required: true, message: '请填写入库鉴定结果', trigger: 'blur' }
        ],
        inLibDate: [
            { required: true, message: '请选择入库时间', trigger: 'change' }
        ]
      },
      outputFormRules: {
        changeDescription: [
            { required: true, message: '请填写出库原因', trigger: 'blur' }
        ],
        outLibDate: [
            { required: true, message: '请选择出库时间', trigger: 'change' }
        ]
      },
       // 记录选择的条数
      multipleSelection: [],
      // 保存标题名
      title: '',
      // 保存当前状态(新增还是编辑)
      addOReditor: 0,
      // 人员选择器是否还可以选择
      isSelect: true,
      // 可以选择的教练库列表
      coachNameList: [],
      // 出库模态框
      outputDialogVisible: false,
      // 出库数据
      outputParams: {
        coachLibEmployeeId: '',
        outLibDate: '',
        changeDescription: ''
      }
    }
  },
  computed: {
    userName () {
      return this.$store.state.user.info.fullName
    },
    flag () {
      return this.inOrput === 1
    }
  },
  methods: {
     // 监听 pageIndex 和 pageSize 的变动
    handleSizeChange (options) {
      this.getCoachStaffList(options)
    },
    handleCurrentChange (options) {
      this.getCoachStaffList(options)
    },
    // ---------------------------------人员列表----------------------------------------
    // 获取列表
    getCoachStaffList (listParams) {
      req('getCoachStaffList', listParams)
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
    // ---------------------------------表头按钮方法------------------------------------------
    // 选中某一项的时候
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    //  入库方法
    inPut () {
      if (this.multipleSelection.length < 1) {
        // 先把form清空,以防上一次有影响
        Object.keys(this.form).map(item => {
          this.form[item] = ''
        })
        this.title = '教练入库'
        this.addOReditor = 1
        // 获取可选教练库名称列表
        this.getCoachName()
        // 显示模态框
        this.isSelect = true
        this.userDialogVisible = true
      } else {
        this.$message('教练入库，不能选择人员')
      }
    },
    // // hadOutPut已出库人员
    // hadOutPut () {
    //   // 先加出库时间
    //   this.table.columns.splice(this.table.columns.length - 1, 0, {prop: 'outLibDate', label: '出库时间', width: 100, align: 'center'})
    //   this.getCoachStaffList({status: 'N'})
    //   this.inOrput = 1
    // },
    // // 已入库人员
    // hadInput () {
    //   // 移除入库时间
    //   this.table.columns.splice(this.table.columns.length - 2, 1)
    //   this.getCoachStaffList({status: 'Y'})
    //   this.inOrput = 2
    // },
    // -------------------------操作栏方法------------------------------
    // 修改方法
    editorCoach (row) {
      this.title = '修改教练入库信息'
      this.addOReditor = 2
      console.log(row)
      req('findCoachlibEmployee', {coachlibEmployeeId: row.coachLibEmployeeId})
          .then(res => {
            console.log(res)
            Object.keys(res).map(item => {
              this.form[item] = res[item]
            })
            this.form.inLibDate = moment(this.form.inLibDate).format('YYYY-MM-DD')
            // console.log(this.form)
          })
           // 获取可选教练库名称列表
      this.getCoachName()
      this.isSelect = false
      this.userDialogVisible = true
    },
    //  出库
    outPut (row) {
      // console.log('1111')
      this.outputDialogVisible = true
      this.outputParams.coachLibEmployeeId = row.coachLibEmployeeId
    },
    // // 重新入库
    // inPutAgain () {

    // },
    // // 历史
    // history () {

    // },
    // --------------------人员选择的时候----------------
    handleIconClick () {
      if (this.isSelect) {
        this.isShow = !this.isShow
      } else {
        this.isShow = false
      }
    },
    handleConfirm (sel) {
      console.log(sel)
      Object.keys(sel[0]).map(item => {
        this.form[item] = sel[0][item]
      })
      this.form.orgUnitName = sel[0].unitName
    },
    // --------------获取可以选择的教练库名称---------------------
    getCoachName () {
      req('getCoachList', {status: '1'})
      .then(res => {
        console.log(res)
        this.coachNameList = res.data
      })
    },
    //  --------------------------------------------------------------------------------
      // 提交新增或者编辑的数据
    submitUserData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 根据状态选择是发送新增请求还是修改的请求
          if (this.addOReditor === 1) {
            req('insertCoach', this.form)
            .then(res => {
              this.$message('新增成功')
              this.getCoachStaffList({status: 'Y'})
            })
           .catch(err => console.log(err))
          } else if (this.addOReditor === 2) {
            console.log(this.form)
            req('updateCoachEmployee', this.form)
            .then(res => {
              this.$message('修改成功')
              this.getCoachStaffList({status: 'Y'})
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
    // 提交出库信息
    submitOutputData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 发送出库请求
          req('output', this.outputParams)
          .then(res => {
            if (res) {
              this.$message('出库成功')
              this.getCoachStaffList({status: 'Y'})
            }
          })
        .catch(err => console.log(err))
          this.outputDialogVisible = false
        } else {
          this.$message('请先按要求输入')
        }
      })
    },
    // -------------------------------------
    getTime (val) {
      console.log(val)
      this.form.inLibDate = moment(val).format('YYYY-MM-DD')
    },
    getoutTime (val) {
      this.outputParams.outLibDate = val
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
    this.getCoachStaffList({status: 'Y'})
  }
}
</script>

<style lang="scss" scoped>

</style>
