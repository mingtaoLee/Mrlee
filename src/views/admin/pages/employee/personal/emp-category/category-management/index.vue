<template>
  <!-- 人员借调 -->
  <section class="pers-partTime">
    <i-layout>
      <i-form
      @reset="reset"
      @search="search"
      slot="header"
      >
      <!-- v-if="accessMap.empConcurrentsJobGet" -->
        <el-form-item label="姓名">
          <el-input v-model="listParams.employeeName" :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="工号">
          <el-input v-model="listParams.employeeCode" :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="组织" :maxlength="20">
          <i-select-tree
          dataKey="org"
          nodeKey="orgUnitId"
          v-model="listParams.unitId"
          size="large"
          treeMaxHeight="200"
          :accordion="true"
          :hasGrant="false"
          ></i-select-tree>
        </el-form-item>

        <el-form-item label="人事范围编码">
            <remote-select
                v-model="listParams.personnelGroupCode"
                dataKey="personnelGroup"
                :props="personnelProps"
                :displayKeys="personnelGroupLabel"
                :extraParams="params"
              ></remote-select>
        </el-form-item>

        <el-form-item label="人事范围">
            <remote-select
                v-model="listParams.personnelGroupName"
                dataKey="personnelGroup"
                :props="personnelPropsName"
                :displayKeys="personnelGroupNameLabel"
                :extraParams="params"
              ></remote-select>
        </el-form-item>

        <el-form-item>
           <remote-select
            v-model="listParams.categoryId"
            dataKey="category"
            :props="categoryProps"
            :extraParams="params"
          ></remote-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="listParams.startDate"
            type="date"
            :editable="false"
            :picker-options="pickerOptions0">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="至">
          <el-date-picker
            v-model="listParams.endDate"
            type="date"
            :editable="false"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>

      
      </i-form>

      <div slot="section" v-if="table">
        <i-table
          :table="table"
          @pageSizeChange="handleSizeChange"
          @pageIndexChange="handleCurrentChange"
        >
          <template slot="table" slot-scope="tableScope">
            <el-table
            :data="table.data"
            style="width: 100%"
            @selection-change="selectionChangeHandler(tableScope, $event)"
             v-loading="CategoryLoading"
            :element-loading-text="$loadingText"
          >
              <el-table-column type="selection"></el-table-column>

              <el-table-column
              sortable v-for="(item, idx) of table.columns"
              :key="idx"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :formatter="tableScope.formatter"
              :fixed="item.fixed"
              :align="item.align">
              </el-table-column>
              <!-- <i-table-operator :table="tableScope" width="150"></i-table-operator> -->
            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>

      <!-- 新增弹框 -->
    <i-dialog
      :title="title"
      v-model="newTemplate"
      v-if="newTemplate"
      :size="small"
      :close-on-click-modal="false"
      :toolbar="creatToolbar">
       <el-form :model="form" :rules="rules" ref='ruleForm'>
         <el-form-item label="员工" prop="employeeName" label-width="80px">
            <el-input  v-model="form.employeeName"  v-if="!editable"><i  slot="suffix" class="el-icon-menu" @click="handleIconClick" ></i></el-input>
            <el-input v-model="form.employeeName" :disabled="editable" v-else></el-input>
            <i-personnel-select
             :isShow.sync="isShow"
             :modal='true'
             :multiple="false"
             :hasGrant="false"
              filterType="personnelGroup"
              @confirm="handleConfirm"
             >
            </i-personnel-select>
         </el-form-item>

         <create-dialog-table ref="createTable" :form='form' :read="editable" v-if="!editable"></create-dialog-table>

         <el-form-item label="品类" label-width="80px"  v-if="editable">
           <el-input :row='5' v-model="form.categoryName" maxlength="341" :disabled="editable"></el-input>
         </el-form-item>

         <el-form-item label="开始时间" label-width="80px" v-if="editable">
           <el-date-picker type="date" v-model="form.startDate":disabled="editable"></el-date-picker>
         </el-form-item>

         <el-form-item label="结束时间" label-width="80px" v-if="editable" prop="endDate">
           <el-date-picker type="date" v-model="form.endDate" @change="getTime" :picker-options="pickerOptions5"></el-date-picker>
         </el-form-item>

         <el-form-item label="备注内容" label-width="80px">
           <el-input type="textarea" :row='5' v-model="form.remark" maxlength="341"></el-input>
         </el-form-item>
       </el-form>
    </i-dialog>
  </section>
</template>
<script>
  import req, { config } from 'api/employee/personal'
  import access from 'mixins/access'
  import RemoteSelect from 'components/compensation/remote-select'
  import CreateDialogTable from './category-createTable'
  import moment from 'moment'

  export default {
    mixins: [access],
    components: {
      RemoteSelect,
      CreateDialogTable,
      moment
    },
    data () {
      return {
        // 表格
        table: {
          columns: [
            { prop: 'area', label: '所在区域', width: 100, align: 'center', fixed: 'left' },
            { prop: 'personnelGroupCode', label: '人事范围代码', width: 150, align: 'center' },
            { prop: 'personnelGroupName', label: '人事范围名称', width: 150, align: 'center' },
            { prop: 'businessStatus', label: '业态', width: 150, align: 'left' },
            { prop: 'unitFullName', label: '组织全称', width: 300, align: 'center' },
            { prop: 'unitName', label: '组织', width: 150, align: 'left' },
            { prop: 'employeeCode', label: '工号', width: 100, align: 'center' },
            { prop: 'employeeName', label: '姓名', width: 100, align: 'left' },
            { prop: 'positionName', label: '职位', width: 150, align: 'left' },
            { prop: 'hireDate', label: '入职日期', width: 120, align: 'left' },
            { prop: 'comAge', label: '司龄', width: 100, align: 'center' },
            { prop: 'age', label: '年龄', width: 100, align: 'center' },
            { prop: 'employeeStatus', label: '雇佣状态', width: 100, align: 'center', display: { dict: 'EMPLOYEE_STATUS' } },
            { prop: 'categoryName', label: '品类教练名称', width: 150, align: 'center' },
            { prop: 'mounth', label: '担任月数', width: 150, align: 'center' },
            { prop: 'startDate', label: '开始日期', width: 150, align: 'center', display: { date: '' } },
            { prop: 'endDate', label: '结束日期', width: 150, align: 'center', display: { date: '' } },
            { prop: 'lastUpdateBy', label: '操作人', width: 150, align: 'center' },
            { prop: 'lastUpdateDate', label: '操作时间', width: 150, align: 'center', display: { date: '' } }
          ],
          data: null,
          search: null,
          info: null,
          empConcurrentJobIds: [],
          total: 0,
          showPagebar: true,
          setting: {
            export: {
              config: {
                fileName: '品类管理',
                sync: {
                  page: true,
                  select: true,
                  all: false
                }
              },
              // key: 'empConcurrentsJobExport',
              req: config.getCategorytList
            },
            import: {
              // key: 'empConcurrentsJobImport',
              business: 'emp-concurrentjob'
            },
            toolbar: [{
              text: '新增',
              // key: 'empConcurrentsJobPost',
              func: this.newCategory
            }, {
              text: '结束管理',
              // key: 'empConcurrentsJobDelete',
              type: 'warning',
              func: () => {
                this.editCategory()
              }
            }]
          }
        },
        // 查询条件
        listParams: {
          unitId: '',
          personnelGroupCode: '',
          personnelGroupName: '',
          employeeCode: '',
          employeeName: '',
          categoryName: '',
          categoryId: '',
          startDate: '',
          endDate: ''
        },
        categoryProps: {value: 'posCategoryId', label: 'posCategoryName'},

        // 人事范围选择器配置
        personnelGroupLabel: ['personnelGroupCode'],
        personnelGroupNameLabel: ['personnelGroupName'],
        personnelProps: {value: 'personnelGroupCode', label: 'personnelGroupCode'},
        personnelPropsName: {value: 'personnelGroupCode', label: 'personnelGroupCode'},
        params: {'hasPower': 'Y', 'usable': 'Y'},
        // 查询条件时间限制
        pickerOptions0: {
          disabledDate: (time) => {
            let endTimeVal = this.listParams.endDate
            if (endTimeVal) {
              return time.getTime() > new Date(endTimeVal)
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            let startTimeVal = this.listParams.endDate
            if (startTimeVal) {
              return time.getTime() < new Date(startTimeVal)
            }
          }
        },
        // 新增
        form: {
          employeeId: '',
          employeeName: '',
          createDtoList: [],
          remark: ''
        },
        rules: {
          employeeName: [{ required: true, message: '请选择人员', trigger: 'change' }],
          endDate: [{ required: true, message: '请选择时间', trigger: 'change' }]
        },
        pickerOptions5: {
          disabledDate: (time) => {
            let startTimeVal = this.form.startTime
            if (startTimeVal) {
              return time.getTime() < new Date(startTimeVal)
            }
          }
        },
        newTemplate: false,
        isShow: false,
        title: '',
        creatToolbar: [{
          text: '确定',
          type: 'primary',
          func: (done) => {
            this.submitCreateInfo()
          }
        }, {
          text: '取消',
          type: 'text',
          func: (done) => {
            Object.keys(this.form).map(key => { this.form[key] = '' })
            done()
          }
        }],
        sectionList: '',
        editable: false
      }
    },
    mounted () {
      this.search()
    },
    methods: {
      // 改变页数页码，获取对应的列表
      handleSizeChange (options) {
        this.getCategorytList(options)
      },

       // 改变页数页码，获取对应的列表
      handleCurrentChange (options) {
        this.getCategorytList(options)
      },

      // 获取品类列表的列表
      getCategorytList (listParams) {
        this.CategoryLoading = true
        req('getCategorytList', listParams, true, false)
        .then(data => {
          Object.keys(data).map(key => (this.table[key] = data[key]))
          this.CategoryLoading = false
        })
        .catch(err => {
          this.$message(err)
          this.CategoryLoading = false
        })
      },
       // 查询
      search () {
        this.table.search = { ...this.listParams }
      },
       // 重置
      reset () {
        Object.keys(this.listParams).map(key => { this.listParams[key] = '' })
      },
      // 新增品类
      newCategory () {
        this.title = '新建品类信息'
        this.editable = false
        this.newTemplate = true
      },
      editCategory (row) {
        if (this.sectionList.length < 1) {
          this.$message.warning('请选择需要结束的数据')
        } else if (this.sectionList.length > 1) {
          this.$message.warning('只能选择一条数据')
        } else {
          this.title = '结束品类信息'
          // 请求选中的信息
          this.form = this.sectionList[0]
          this.editable = true
          this.newTemplate = true
        }
      },
      // 人员选择器
      handleIconClick () {
        this.isShow = !this.isShow
      },
      // 人员选择器选中人
      handleConfirm (selected) {
        this.form.employeeId = selected[0].employeeId
        this.form.employeeName = selected[0].employeeName
      },
      // 选中表格数据
      selectionChangeHandler (table, section) {
        this.sectionList = section
      },
      // 提交新增数据
      submitCreateInfo () {
        if (!this.editable) {
          let dialogTable = this.$refs['createTable'].$refs['cell'].filter(el => !el.validate())
          if (dialogTable.length > 0) {
            this.$message.warning('请先按照要求填写内容！')
          } else {
            this.$refs['ruleForm'].validate(valid => {
              if (valid) {
                this.form.createDtoList = this.$refs['createTable'].$refs.table.clone
                req('createCategory', this.form).then(res => {
                  if (res) {
                    this.$message.success('新增成功！')
                    this.newTemplate = false
                    this.search()
                  } else {
                    this.$message.warning('新增失败！')
                    this.newTemplate = false
                  }
                }).catch(err => { console.log(err) })
              } else {
                this.$message.warning('请选择人员！')
              }
            })
          }
        } else {
          this.$refs['ruleForm'].validate(valid => {
            if (valid) {
              req('stopCategory', this.form)
              .then(res => {
                if (res) {
                  this.search()
                  this.$message.success('结束成功！')
                  this.newTemplate = false
                } else {
                  this.$message.success('结束失败！')
                  this.newTemplate = false
                }
              })
              .catch(err => { console.log(err) })
            }
          })
        }
      },
      getTime (val) {
        this.form.endDate = moment(val).format('YYYY-MM-DD')
      }
    }
  }
  </script>

  <style lang="scss" scoped>
  </style>
