<template>
  <section class="pers-list">
    <i-layout>
      <aside slot="aside" class="sidebar">
        <header class="header-flex">
          <div>
            <template>
              <i-control-layout :btnCol="3" :toolbar="buttonControl"></i-control-layout>
            </template>
          </div>
        </header>

        <draggable
          v-model="siftTemplate"
          v-loading="siftLoading"
          :element-loading-text="$loadingText"
          v-if="siftTemplate.length"
          :move="siftTemplateMove"
          :options="{ animation: 50 }"
          @start="siftTemplateMoveStart"
          @end="siftTemplateMoveEnd"
          element="ul"
          class="sift-list">
          <li
            v-for="(siftItem, idx) of siftTemplate"
            :key="idx"
            @click="handleSiftTemplateClick(idx)"
            :class="{ 'active-sift': activeSiftIdx === idx, 'dragging-sift': dragging && draggingSiftIdx === idx }"
            class="sift-item">
            {{ siftItem.empRosterName }}
          </li>
        </draggable>
      </aside>

      <div slot="section">
        <i-table
          :table="table"
          @pageSizeChange="handleSizeChange"
          @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table
              v-loading="searchLoading"
              :element-loading-text="$loadingText"
              :data="tableScope.clone"
              :row-class-name="tableRowClassName">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column label="姓名" prop="fullName" width="auto" sortable>
                <template slot-scope="scope">
                  <el-button @click="handleTableClick(scope.row)" type="text" size="mini">{{ scope.row.fullName }}</el-button>
                </template>
              </el-table-column>

              <el-table-column
                v-for="(col, idx) of columnsAfterSift"
                :key="col.prop + '-' + idx"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :align="col.align"
                :formatter="tableScope.formatter"
                sortable/>
            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>

    <i-dialog title="新增花名册" v-model="siftDialogVisible.create" :toolbar="siftDialogToolbar" size="large">
      <sift-pane ref="createSiftPane" :columns="table.columns"/>
    </i-dialog>

    <i-dialog title="修改显示字段" v-model="siftDialogVisible.update" :toolbar="siftDialogToolbar" size="large">
      <sift-pane :activeSift="activeSift" ref="updateSiftPane" :columns="table.columns"/>
    </i-dialog>

    <i-dialog title="条件查询" v-model="searchDialogVisible" :toolbar="searchDialogToolbar" size="large" class="pers-search-Dialog">
      <i-layout>
        <aside slot="aside">
          <header class="search-header-flex">
            <template>
              <i-control-layout :btnCol="2" :toolbar="searchButtonControl"></i-control-layout>
            </template>
            <!-- <h3 class="search-title">查询模板</h3> -->
          </header>
          <div class="search-list">
            <ul>
              <li
                v-for="(searchItem, idx) in searchTemplateList"
                :key='idx'
                :class="{ 'active-search': activeSearchIdx === idx }"
                class="search-item"
                @click="handleSearchTemplateClick(searchItem, idx)"
              >
                {{searchItem.empSearchTemplateName}}
              </li>
            </ul>
          </div>
        </aside>
        <div slot="section">
          <i-search-conditions
            ref="ISearchConditions"
            :async="false"
            :columns="table.columns"
            :editor="editor"
            :data="customListEmp"
            height="600">
          </i-search-conditions>
        </div>
      </i-layout>
      <!-- <i-search-conditions ref="ISearchConditions" :async="false" :columns="table.columns" :editor="editor" :data="customListEmp"/> -->
    </i-dialog>
  </section>
</template>

<script>
import req, { config } from 'api/employee/personal'
import IForm from 'components/common/i-form/i-form.vue'
import ILayout from 'components/common/i-layout'
import IDialog from 'components/common/i-dialog/i-dialog'
import ISearchConditions from 'components/common/i-search-conditions'
import SiftPane from './sift-pane'
import Draggable from 'vuedraggable'
import iControlLayout from 'components/common/i-control-layout/i-control-layout'
// import {formatDate} from 'utils/organization'

export default {
  data () {
    return {
      // TODO: mock 测试
      // customListEmp,

      buttonControl: [
        {
          text: '新增',
          type: 'primary',
          disabled: false,
          key: 'empEmployeesRosterTemplatePost',
          func: () => {
            this.siftDialogVisible.create = true
          }
        },
        {
          text: '重命名',
          key: 'empEmployeesRosterTemplateRenamePut',
          disabled: false,
          // disabled: !this.activeSift.empRosterName,
          func: () => {
            this.updateSiftTemplateName()
          }
        },
        {
          text: '删除',
          type: 'danger',
          key: 'empEmployeesRosterTemplateDelete',
          disabled: false,
          // disabled: !this.activeSift.empRosterName,
          func: () => {
            this.deleteSiftTemplate()
          }
        }
      ],
      table: {
        columns: [
          { prop: 'employeeCode', label: '工号', width: 200, align: 'center', tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'gender', label: '性别', width: 100, display: { dict: 'GENDER' }, align: 'center', tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'nation', label: '民族', width: 140, align: 'center', display: { dict: 'NATION' }, tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'areaCitizenship', label: ' 国籍/地区', width: 160, align: 'center', display: { dict: 'COUNTRY' }, tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'birthDate', label: '出生日期', value: '', width: 200, display: { date: '' }, align: 'center', tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'age', label: '年龄', width: 100, align: 'center', tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'compAge', label: '司龄', width: 100, align: 'center', tableName: 'pos', classification: '基本信息', lxValue: '2' },
          { prop: 'maritalStatus', label: '婚姻状态', width: 120, align: 'center', display: { dict: 'MARITAL_STATUS' }, tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'politicsStatus', label: '政治面貌', width: 250, align: 'center', display: { dict: 'POLITICS_STATUS' }, tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'email', label: '电子邮箱', width: 250, tableName: 'ec', classification: '基本信息', lxValue: '2' },
          { prop: 'mobile', label: '联系电话', width: 180, align: 'center', tableName: 'ec', classification: '基本信息', lxValue: '2' },
          { prop: 'domicilePlace', label: '籍贯', width: 180, tableName: 'ec', classification: '基本信息', lxValue: '2' },
          { prop: 'domicileType', label: '户籍性质', width: 180, align: 'center', display: { dict: 'DOMICILE_TYPE' }, tableName: 'ec', classification: '基本信息', lxValue: '2' },
          { prop: 'homeAddress', label: '现居住地址', width: 220, tableName: 'ec', classification: '基本信息', lxValue: '2' },
          // { prop: 'idRegisteredAddress', label: '证件详细地址', width: 280, tableName: 'con' },
          { prop: 'idBeginDate', label: '证件生效时间', value: '', width: 200, display: { date: '' }, align: 'center', tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'idEndDate', label: '证件失效时间', value: '', width: 200, display: { date: '' }, align: 'center', tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'emergencyName', label: '紧急联系人', width: 180, align: 'center', tableName: 'fm', classification: '家庭成员及联系人信息', lxValue: '3' },
          { prop: 'primaryPhone', label: '紧急联系人电话', width: 180, align: 'center', tableName: 'fm', classification: '家庭成员及联系人信息', lxValue: '3' },
          { prop: 'orgUnitId', label: '归属组织', width: 200, tableName: 'uni', classification: '组织信息', lxValue: '8' },
          { prop: 'orgPathName', label: '组织全称', width: 180, tableName: 'uni', classification: '组织信息', lxValue: '8' },
          // { prop: 'costCentralId', label: '成本中心', width: 140, tableName: 'om' },
          // { prop: 'parentEmployeeName', label: '直属领导', width: 160, tableName: 'e1' },
          // { prop: 'positionName', label: '职位', width: 250, tableName: 'pos' },
          { prop: 'posTitleName', label: '职务', width: 180, tableName: 'post', classification: '职位信息', lxValue: '7' },
          { prop: 'employeeType', label: '用工类型', align: 'center', width: 150, display: { dict: 'EMPLOYEE_TYPE' }, tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'employeeStatus', label: '员工状态', align: 'center', width: 120, display: { dict: 'EMPLOYEE_STATUS' }, tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'isTransfer', label: '是否借调', width: 150, display: { dict: 'WHETHER_TYPE' }, align: 'center', tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'employeeSource', label: '招聘来源', width: 150, align: 'center', display: { dict: 'EMPLOYEE_SOURCE' }, tableName: 'pos', classification: '基本信息', lxValue: '2' },
          { prop: 'artisanLevel', label: '技工等级', width: 180, align: 'center', display: { dict: 'ARTISAN_LEVEL' }, tableName: 'pos', classification: '薪资信息', lxValue: '6' },
          { prop: 'revenueType', label: '税收类型', width: 180, align: 'center', display: { dict: 'REVENUE_TYPE' }, tableName: 'pos', classification: '薪资信息', lxValue: '6' },
          { prop: 'workSystem', label: '工作制', width: 180, align: 'center', display: { dict: 'WORK_SYSTEM' }, tableName: 'pos', classification: '薪资信息', lxValue: '6' },

          { prop: 'beginWorkDate', label: '开始工作日期', width: 180, display: { date: '' }, align: 'center', tableName: 'pos', classification: '基本信息', lxValue: '2' },
          { prop: 'hireDate', label: '入职日期', width: 180, display: { date: '' }, align: 'center', tableName: 'pos', classification: '基本信息', lxValue: '2' },

          { prop: 'probationType', label: '试用期期限类型', width: 180, align: 'center', tableName: 'pos', classification: '合同信息', lxValue: '1' },
          // { prop: 'probationSalary', label: '试用期薪资', width: 150, align: 'right', tableName: 'pos' },
          // { prop: 'regularSalary', label: '转正薪资', width: 150, align: 'right', tableName: 'pos' },

          { prop: 'institution', label: '最高学历学校', width: 180, tableName: 'edu', classification: '教育信息', lxValue: '4' },
          { prop: 'major', label: '最高学历专业', width: 180, align: 'center', tableName: 'edu', classification: '教育信息', lxValue: '4' },
          { prop: 'graduationDate', label: '毕业时间', width: 180, display: { date: '' }, align: 'center', tableName: 'edu', classification: '教育信息', lxValue: '4' },
          { prop: 'degree', label: '最高学历', width: 180, align: 'center', display: { dict: 'EDUCATIONAL_BACKGROUND' }, tableName: 'edu', classification: '教育信息', lxValue: '4' },
          { prop: 'isVeteran', label: '是否退伍军人', width: 150, display: { dict: 'WHETHER_TYPE' }, align: 'center', tableName: 'oth', classification: '其他信息', lxValue: '5' },

          { prop: 'isHandicapped', label: '是否残疾人', width: 120, display: { dict: 'WHETHER_TYPE' }, align: 'center', tableName: 'oth', classification: '其他信息', lxValue: '5' },
          { prop: 'handicappedGroup', label: '伤残组', width: 180, align: 'center', display: { dict: 'HANDICAPPED_GROUP' }, tableName: 'oth', classification: '其他信息', lxValue: '5' },
          { prop: 'healthyCondition', label: '身体状况', width: 180, tableName: 'oth', display: { dict: 'WHETHER_TYPE' }, classification: '其他信息', lxValue: '5' },
          { prop: 'hadInfectious', label: '有无传染病史', width: 160, display: { dict: 'HAVE_OR_NOT' }, align: 'center', tableName: 'oth', classification: '其他信息', lxValue: '5' },
          { prop: 'hadSeriousDisease', label: '有无重大疾病', width: 160, display: { dict: 'HAVE_OR_NOT' }, align: 'center', tableName: 'oth', classification: '其他信息', lxValue: '5' },
          { prop: 'handicappedType', label: '伤残类型', width: 180, align: 'center', display: { dict: 'DISABILITY_GRADE' }, tableName: 'oth', classification: '其他信息', lxValue: '5' },

          { prop: 'idType', label: '证件类型', width: 150, align: 'center', display: { dict: 'DOCUMENT_TYPE' }, tableName: 'e', classification: '基本信息', lxValue: '2' },
          { prop: 'idNumber', label: '证件号码', width: 200, align: 'center', tableName: 'e', classification: '基本信息', lxValue: '2' },
          // { prop: 'degree', label: '学位证书', width: 180, display: { dict: 'DEGREE' }, tableName: 'edu' },
          // TODO: 业务需要合并为“转正日期” probation
          // { prop: 'probationDateBegin', label: '转正日期', width: 180, display: { date: '' } },
          // { prop: 'probationDateEnd', label: '转正日期', width: 180, display: { date: '' } },
          // ----
          { prop: 'personnelGroupCode', label: '人事范围编号', width: 180, tableName: 'e', classification: '组织信息', lxValue: '8' },
          { prop: 'personnelGroupName', label: '人事范围名称', width: 180, tableName: 'spg', classification: '组织信息', lxValue: '8' },
          { prop: 'name', label: '职位名称', width: 180, tableName: 'pp', classification: '职位信息', lxValue: '7' },
          { prop: 'effectiveDate', label: '离职日期', width: 180, tableName: 'ed', display: { date: '' }, classification: '基本信息', lxValue: '2' },
          { prop: 'startDate', label: '合同开始时间', width: 180, tableName: 'con', display: { date: '' }, classification: '合同信息', lxValue: '1' },
          { prop: 'endDate', label: '合同结束时间', width: 180, tableName: 'con', display: { date: '' }, classification: '合同信息', lxValue: '1' },
          { prop: 'contractType', label: '合同类型', width: 180, tableName: 'con', display: { dict: 'CONTRACT_TYPE' }, classification: '合同信息', lxValue: '1' },
          { prop: 'idRegisteredAddress', label: '证件地址', width: 180, tableName: 'ec', classification: '基本信息', lxValue: '2' },
          { prop: 'relationship', label: '紧急联系人关系', display: {dict: 'FAMILY_RELATIONSHIP'}, width: 180, tableName: 'fm', classification: '基本信息', lxValue: '2' },
          { prop: 'costCentralId', label: '成本中心代码', width: 140, tableName: 'om', classification: '组织信息', lxValue: '8' },
          { prop: 'costCenterName', label: '成本中心文本', width: 180, tableName: 'scc', classification: '组织信息', lxValue: '8' }
        ],
        setting: {
          toolbar: [{
            key: 'empEmployeesRosterCriteriaQuery',
            text: '条件查询',
            func: () => {
              this.searchDialogVisible = true
              this.getSearchTemplate(this.activeSift.empRosterTemplateId)
            }
          }, {
            key: 'empEmployeesRosterTemplateGet',
            text: '查询全部',
            func: () => {
              this.groupsData = []
              this.pageData.pageIndex = 1
              // 调用监听分页函数发送请求，避免因页码改变而发送两次请求
              this.handleCurrentChange(this.pageData)
              // this.getRosterData(this.pageData)
            }
          }, {
            key: 'empEmployeesRosterField',
            text: '增减字段',
            func: () => (this.siftDialogVisible.update = true),
            show: () => {
              if (!this.activeSift.empRosterName) {
                return {
                  empty: true
                }
              }
            }
          }],
          export: {
            key: 'empEmployeesRosterFileGet',
            config: {
              fileName: '花名册',
              sync: {
                page: true,
                select: true,
                all: false
              }
            }, // 可选
            req: config.postSearchTemplateData,        // 必填
            conditions: () => {
              return {
                params: {
                  'empRosterTemplateId': this.exportId,
                  'groups': this.groupsData
                }
              }
            }
          }
        },
        showPagebar: true,
        search: null,
        data: null,
        info: null,
        total: 0
      },

      editor: {
        orgUnitId: {
          type: 'org'
        }
      },

      dragging: false,
      // 筛选方案集合
      siftTemplate: [],
      activeSiftIdx: 0,
      draggingSiftIdx: 0,
      // 查询模板选中的下标
      activeSearchIdx: 0,
      inputPattern: /^(\w|[\u4e00-\u9fa5]){1,7}$/,

      siftDialogToolbar: [{
        text: '取消',
        type: 'default',
        func: done => {
          done()
        }
      }, {
        text: '确定',
        func: done => {
          this.handleSiftPaneConfirm()
          done()
        }
      }],

      searchDialogToolbar: [{
        text: '取消',
        type: 'default',
        func: done => {
          this.customListEmp = {groups: []}
          this.activeSearchIdx = 0
          done()
        }
      }, {
        text: '查询',
        func: done => {
          // 执行查询
          this.submitSearchConditions()
        }
      }, {
        text: '保存',
        func: add => {
          this.submitSaveSearch()
        }
      }],
      searchButtonControl: [
        {
          text: '新增模板',
          type: 'primary',
          func: () => {
            this.createSearch()
          }
        },
        {
          text: '删除模板',
          type: 'danger',
          func: () => {
            this.deleteSearch()
          }
        }
      ],
      searchTemplateList: [],
      rosterData: null,
      siftLoading: false,

      siftDialogVisible: {
        create: false,
        update: false
      },
      // 条件查询模态框
      searchDialogVisible: false,
      // 条件查询模板数据
      customListEmp: {'groups': []},
      // 条件查询新增与保存标记
      searchFlag: 2,
      // 第一次进来的标记
      firstFlag: true,
      // 保存页码数据
      pageData: {},
      // 条件查询获取的数据
      groupsData: [],
      searchLoading: true,
      exportId: ''
    }
  },

  created () {
    // this.getRosterData()
    this.getRosterTemplate()
    // this.getSearchTemplate()
  },

  watch: {
    'siftDialogVisible.create' (val) {
      if (val === true) {
        this.clearSiftPane('createSiftPane')
      }
    },
    'siftDialogVisible.update' (val) {
      if (val && this.$refs.updateSiftPane) {
        this.$refs.updateSiftPane.initSiftList()
      }
    },
    'activeSift.empRosterTemplateId' (val) {
      if (this.firstFlag) {
        this.searchLoading = true
        this.pageData.params = JSON.stringify({
          'empRosterTemplateId': this.activeSift.empRosterTemplateId,
          'groups': this.groupsData
        })
        // 修改请求方式
        this.table.search = {...this.pageData}
        // this.postSearchTemplateData(this.pageData)
        this.firstFlag = false
        this.exportId = this.activeSift.empRosterTemplateId
        // console.log(this.expo)
        return
      }
      this.pageData.pageIndex = 1
      this.groupsData = []
      // 修改请求方式
      this.table.search = {...this.pageData}
      // this.getRosterData(this.pageData)
    },
    // 监听花名册模板列表，当长度为0的时候禁用主页面上除了新增末班之外的其他按钮
    siftTemplate (val) {
      this.handlerButsShowStatus(val)
    }
  },

  mounted () {
    // this.search()
    // this.table.search = {}
  },

  computed: {
    activeSift () {
      return this.siftTemplate[this.activeSiftIdx] || {}
    },

    columnsAfterSift () {
      let { searchFiled } = this.activeSift
      searchFiled || (searchFiled = '')

      const list = searchFiled.split(',')
      const ret = []

      list.map(
        sift => this.table.columns.map(col => sift === col.prop && ret.push(col))
      )
      return ret
    }
  },

  methods: {
    /** ---------------- Table ---------------- */

    /** 改变翻页的索引 */
    tableRowClassName (row, index) {
      // 把每一行的索引放进row
      row.index = index
    },

    /** 监听分页 */
    handleSizeChange (options) {
      this.pageData = options
      this.searchLoading = true
      this.getRosterData(options)
    },
    handleCurrentChange (options) {
      this.pageData = options
      this.searchLoading = true
      if (this.firstFlag) {
        this.postSearchTemplateData(options)
      } else {
        this.getRosterData(options)
      }
    },

    /** 提供点击表格姓名后的页面跳转 */
    handleTableClick (row) {
      this.$store.toRecord = true
      // this.$store.commit('SET_TO_RECORD', true)
      this.$router.push('pers_record/' + row.empEmployeeId)
    },

    /** ---------------- Request ---------------- */

    /** 获取花名册列表 */
    getRosterData (options) {
      if (this.activeSift.empRosterTemplateId) {
        options.params = JSON.stringify({
          'empRosterTemplateId': this.activeSift.empRosterTemplateId,
          'groups': this.groupsData
        })
        this.postSearchTemplateData(options)
      }
    },
    // 计算年龄和司龄
    getAge (num) {
      let now = new Date()
      let birthday = new Date(num)
      return parseInt((now - birthday) / 1000 / 31536000)
    },
    // 将世界时间转化为本地时间
    UtcToGmt (time) {
      const milliseconds = Date.parse(time)
      const d = new Date(milliseconds)
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const date = d.getDate()
      return `${year}-${month}-${date} 00:00:00`
    },
    // 获取花名册表格数据
    postSearchTemplateData (options) {
      // 修改提交的时期时间格式开始
      let obj = JSON.parse(options.params)
      obj.groups.length && obj.groups.map(groupsObj => {
        groupsObj.conditions.map(conditionsObj => {
          let statu = (conditionsObj.infColumnId === 'idBeginDate') ||
          (conditionsObj.infColumnId === 'idEndDate') ||
          (conditionsObj.infColumnId === 'beginWorkDate') ||
          (conditionsObj.infColumnId === 'hireDate') ||
          (conditionsObj.infColumnId === 'graduationDate') ||
          (conditionsObj.infColumnId === 'birthDate') ||
          (conditionsObj.infColumnId === 'effectiveDate') ||
          (conditionsObj.infColumnId === 'startDate') ||
          (conditionsObj.infColumnId === 'endDate')
          if (conditionsObj.columnValue && statu) {
            conditionsObj.columnValue = this.UtcToGmt(conditionsObj.columnValue)
          }
          // conditionsObj.infColumnId === 'birthDate' && conditionsObj.columnValue && (conditionsObj.columnValue = this.UtcToGmt(conditionsObj.columnValue))
        })
      })
      options.params = JSON.stringify(obj)
      // 修改提交的时期时间格式开始
      req('postSearchTemplateData', options)
          .then(res => {
            // 后台优化查询速度，第一次查询的时候才会传回total
            res.total ? localStorage.setItem('searchPage', JSON.stringify({total: res.total, totalPage: res.info.totalPage}))
            : (res.total = JSON.parse(localStorage.getItem('searchPage')).total,
                res.info.totalPage = JSON.parse(localStorage.getItem('searchPage')).totalPage)
            Object.keys(res).map(key => (this.table[key] = res[key]))
            // this.table.data.map((val) => {
            //   val.hasOwnProperty('age') ? val.age = this.getAge(val.age) : ''
            //   val.hasOwnProperty('compAge') ? val.compAge = this.getAge(val.compAge) : ''
            // })
          })
        .finally(() => {
          this.searchLoading = false
        })
    },
    // 搜索方案的增删改查
    getSearchTemplate (templateId) {
      return req('getOneSearchTemplate', {templateId})
        .then(data => {
          this.searchTemplateList = data
          data[0] ? this.customListEmp = data[0] : this.customListEmp = this.defultSearchData()
          data[0] ? this.searchFlag = 2 : this.searchFlag = 1
        })
    },
    // 新增查询模板信息
    postSearchTemplate (options) {
      return req('postSearchTemplate', options)
    },
    // 更新查询模板信息
    putSearchTemplate (options) {
      return req('putSearchTemplate', options)
    },
    // 删除查询模板
    deleteSearchTemplate (options) {
      return req('deleteSearchTemplate', options)
    },

    // 来自后端的筛选方案，字符串拼接形式
    getRosterTemplate () {
      this.siftLoading = true

      return req('getRosterTemplate')
        .then(data => {
          this.siftTemplate = data
          // this.siftLoading = false
        })
        .catch(err => {
          throw new Error(err)
        })
        .finally(() => {
          this.siftLoading = false
          this.searchLoading = false
        })
    },
    postSiftTemplate (options) {
      return req('postRosterTemplate', options)
    },
    putSiftTemplate (options) {
      return req('putRosterTemplate', options)
    },
    moveSiftTemplate (options) {
      return req('putRosterTemplateOrder', options)
    },
    putRosterTemplateRename (options) {
      return req('putRosterTemplateRename', options)
    },
    /** ---------------- Sift ---------------- */

    handleSiftTemplateClick (idx) {
      this.activeSiftIdx = +idx
      this.groupsData = []
      this.exportId = this.activeSift.empRosterTemplateId
    },

    async handleSiftPaneConfirm () {
      const pane = this.$refs.updateSiftPane || this.$refs.createSiftPane
      const reqData = {
        searchFiled: pane.checkedSiftList.join(','),
        empEployeeId: this.$store.state.user.info.empEmployeeId,
        empRosterName: this.activeSift.empRosterName,
        isPrivate: 'N'
      }
      // console.log(pane.checkedSiftList)
      // 拼接后端需要的格式如:e.employeeCode
      let searchArr = []
      pane.checkedSiftList.map((val) => {
        this.table.columns.map((val1) => {
          if (val === val1.prop) {
            val = val1.tableName + '.' + val
            searchArr.push(val)
          }
        })
      })
      const isCreate = this.siftDialogVisible.create
      // console.log(11, searchArr)
      if (isCreate) {
        await this.$prompt('保存花名册', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: this.inputPattern,
          inputErrorMessage: '请输入 1-7 个字符'
        }).then(({ value }) => {
          reqData.empRosterName = value
          reqData.searchFiled = searchArr.join(',')
          this.clearSiftPane('createSiftPane')
        })
      } else {
        reqData.searchFiled = searchArr.join(',')
      }
      // console.log(22, reqData.searchFiled)
      try {
        isCreate
          ? await this.postSiftTemplate({
            ...reqData,
            orderNo: this.activeSiftIdx
          })
          : await this.putSiftTemplate({
            ...reqData,
            empRosterTemplateId: this.activeSift.empRosterTemplateId
          })

        await this.getRosterTemplate()
        this.pageData.pageIndex = 1
        // 修改请求方式
        this.table.search = {...this.pageData}
        // this.getRosterData(this.pageData)
        // this.activeSiftIdx = isCreate
        //   ? this.siftTemplate.length - 1
        //   : this.activeSiftIdx

        this.handleSuccess('保存成功')
      } catch (err) {
        throw new Error(err)
      }
    },

    clearSiftPane (pane) {
      const ref = this.$refs[pane]

      if (ref) {
        ref.checkedSiftList = ''
        ref.checkAllSiftList = false
        ref.isIndeterminate = false
        ref.checkedSiftList = []
      }
    },

    siftTemplateMoveStart (e) {
      this.draggingSiftIdx = e.oldIndex
      this.dragging = true
    },

    siftTemplateMoveEnd (e) {
      this.activeSiftIdx = e.newIndex
      this.dragging = false
      // this.siftLoading = true

      this.moveSiftTemplate(this.siftTemplate.map((sift, idx) => ({
        empRosterTemplateId: sift.empRosterTemplateId,
        orderNo: idx
      })))
      // .then(() => this.getRosterTemplate())
    },

    updateSiftTemplateName () {
      this.$prompt('重命名花名册', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.activeSift.empRosterName,
        inputPattern: this.inputPattern,
        inputErrorMessage: '请输入 1-7 个字符'
      }).then(({ value }) => {
        this.putRosterTemplateRename({
          empRosterTemplateId: this.activeSift.empRosterTemplateId,
          empRosterName: value || this.activeSift.empRosterName
        }).then(() => {
          this.getRosterTemplate().then(() => this.handleSuccess('重命名成功'))
        })
      })
    },

    deleteSiftTemplate () {
      this.$confirm(`删除花名册`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        req('deleteRosterTemplate', {
          templateId: this.activeSift.empRosterTemplateId
        }).then(() => {
          this.getRosterTemplate()
            .then(() => this.handleSuccess('删除成功'))
            .then(() => (this.activeSiftIdx = 0))
            .then(() => {
              // 当左侧花名册都被删除了，右侧表格数据也要初始化
              if (this.siftTemplate.length === 0) {
                // this.table.info.pageIndex = 1
                // this.table.search = {}
                this.table.data = []
              }
            })
        })
      })
    },

    /** ---------------- Search ---------------- */
    // 新增模板
    createSearch () {
      this.customListEmp = this.defultSearchData()
      this.searchFlag = 1
    },

    // 删除模板
    deleteSearch () {
      let id = this.searchTemplateList[this.activeSearchIdx].empSearchTemplateId
      this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteSearchTemplate({ templateId: id })
          .then(() => {
            this.getSearchTemplate(this.activeSift.empRosterTemplateId)
            this.activeSearchIdx = 0
          })
      })
    },

    // 判断是否有空值提交
    judegNull () {
      let data = this.$refs['ISearchConditions'].getData().groups
      console.log(data)
      let nullFlag = true
      data.map((val1) => {
        val1.conditions.map((val2) => {
          if ((val2.columnValue === '' && val2.operator !== 'is null' && val2.operator !== 'is not null') || val2.infColumnId === '' || val2.operate === '') {
            nullFlag = false
          }
          // 增加空格校验
          if (/^\s$/.test(val2.columnValue) || /^\s$/.test(val2.infColumnId) || /^\s$/.test(val2.operate)) {
            nullFlag = false
          }
        })
      })
      return nullFlag
    },

    // 提交修改和新增模板
    submitSaveSearch () {
      if (this.judegNull()) {
        // 新增条件查询模板
        if (this.searchFlag === 1) {
          this.$prompt('新增查询模板', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: this.inputPattern,
            inputErrorMessage: '请输入 1-7 个字符'
          }).then(({ value }) => {
            this.postSearchTemplate({
              groups: this.$refs['ISearchConditions'].getData().groups,
              empRosterTemplateId: this.activeSift.empRosterTemplateId,
              empSearchTemplateName: value,
              empEployeeId: this.$store.state.user.info.empEmployeeId
            }).then(() => {
              this.$message({
                message: '新增查询模板成功',
                type: 'success'
              })
              this.searchFlag = 2
              this.activeSearchIdx = 0
              this.getSearchTemplate(this.activeSift.empRosterTemplateId)
            })
          })
        } else if (this.searchFlag === 2) {
          // 更新模板
          this.putSearchTemplate(this.$refs['ISearchConditions'].getData())
            .then(() => {
              this.$message({
                message: '更新模板成功',
                type: 'success'
              })
              this.getSearchTemplate(this.activeSift.empRosterTemplateId)
              this.activeSearchIdx = 0
            })
        }
      } else {
        this.$message.error('查询条件不能有空值')
      }
    },

    // 提交查询条件数据
    submitSearchConditions () {
      if (this.judegNull()) {
        this.groupsData = this.$refs['ISearchConditions'].getData().groups
        this.groupsData.map((groups) => {
          groups.conditions.map((conditions) => {
            this.table.columns.map((columns) => {
              if (columns.prop === conditions.infColumnId) {
                conditions.tableName = columns.tableName
              }
            })
          })
        })
        this.searchDialogVisible = false
        this.searchLoading = true
        this.pageData.pageIndex = 1
        this.activeSearchIdx = 0
        // 修改请求方式
        this.table.search = {...this.pageData}
        // this.getRosterData(this.pageData)
      } else {
        this.$message.error('查询条件不能有空值')
      }
    },

    // 条件查询模板列表
    handleSearchTemplateClick (searchItem, idx) {
      this.activeSearchIdx = +idx
      this.customListEmp = searchItem
      this.searchFlag = 2
    },
    // 一条空数据模板
    defultSearchData () {
      return {groups: [
        {
          'groupAndOr': null,
          'conditions': [
            {
              'conditionLogic': null,
              'infColumnId': '',
              'operator': '',
              'columnValue': ''
            }
          ]
        }
      ]}
    },
    /** 搜索花名册信息 */
    // searchRosterData () {
    //   const search = {}

    //   Object.keys(this.searchList).map(
    //     key => (search[key] = this.searchList[key].value)
    //   )

    //   this.table.search = search
    // },

    // getSearch () {
    //   let ref = this.$refs[this.activeTab]
    //   ref = Array.isArray(ref) ? ref[0] : ref

    //   return {
    //     searchFiled: ref.getSearch(),
    //     id: ref.id || '',
    //     name: ref.name
    //   }
    // },

    /** 保存或更改搜索条件 */
    // saveSearch () {
    //   let { searchFiled, id = '', name } = this.getSearch()

    //   searchFiled = searchFiled.join(',')

    //   if (this.activeTab === 'diy') {
    //     this.$prompt('请输入方案名称', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消'
    //     }).then(({ value }) => {
    //       this.postSearchTemplate({
    //         empSearchTemplateName: value,
    //         searchFiled
    //       }).then(() => this.getSearchTemplate())
    //     })
    //   } else {
    //     this.$prompt('请输入方案名称', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       inputValue: name
    //     }).then(({ value }) => {
    //       this.putSearchTemplate({
    //         empSearchTemplateId: id,
    //         empSearchTemplateName: value,
    //         searchFiled
    //       })
    //       .then(() => this.getSearchTemplate())
    //       .then(() => (this.activeTab = value))
    //     })
    //   }
    // },

    /** 删除搜索条件 */
    // deleteSearch () {
    //   let { id = '' } = this.getSearch()

    //   this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.deleteSearchTemplate({ templateId: id })
    //       .then(() => this.getSearchTemplate())
    //       .then(() => (this.activeTab = 'diy'))
    //   })
    // },

    /** 重置表单 */
    // resetForm () {
    //   Object.keys(this.searchList).map(
    //     key => (this.searchList[key].value = '')
    //   )
    // }

    handleSuccess (message) {
      this.$message({
        type: 'success',
        message
      })
    },
    // 头部操作按钮——>禁用或者解除禁用
    handlerButsShowStatus (val) {
      if (!val.length) {
        this.table.setting.toolbar.map(val => {
          val.show = () => {
            return {
              disable: true
            }
          }
        })
        this.buttonControl.map(val => {
          val.text !== '新增' && (val.disabled = true)
        })
      } else {
        this.table.setting.toolbar.map(val => {
          val.show = () => {
            return {
              disable: false
            }
          }
        })
        this.buttonControl.map(val => {
          val.text !== '新增' && (val.disabled = false)
        })
      }
    }
  },

  components: {
    IForm,
    ILayout,
    IDialog,
    SiftPane,
    ISearchConditions,
    Draggable,
    iControlLayout
  }
}
</script>

<style lang="scss">
.pers-list {
  aside.sidebar {
    > header {
      font-size: 0;
      height: 40px;
    }
    .sift-list {
      margin-top: 10px;
      border: 1px solid #E5E5E5;
      .sift-item {
        display: block;
        padding: 10px 20px;
        cursor: move;
        transition: all .2s;
        box-sizing: border-box;
        background: #fff;
        &.active-sift {
          color: #3da5fe;
          background: #F1F3F6;
        }
        &.dragging-sift {
          color: transparent;
          background: transparent;
          &:after {
            display: block;
            content: '';
            width: 100%;
            border-bottom: 1px dashed #3da5fe;
          }
        }
      }
    }
  }
  .header-flex{
    display:flex;
    justify-content: center;
    div:nth-child(2){
      // padding-left:10px;
    }
  }
  .el-loading-mask {
    z-index: 3;
  }
}
.pers-search-Dialog {
  .i-layout-aside {
    min-width: 240px !important;
    .search-header-flex {
      display:flex;
      justify-content: center;
      background-color: #FAFAFA;
      height: 50px;
      line-height: 50px;
      .search-title {
        // background-color: #666;

      }
    }
    .search-list {
      margin-top: 10px;
      border: 1px solid #E5E5E5;
      .search-item {
        display: block;
        padding: 10px 20px;
        cursor: move;
        transition: all .2s;
        box-sizing: border-box;
        background: #fff;
        &.active-search {
          color: #3da5fe;
          background: #F1F3F6;
        }
        // &.dragging-sift {
        //   color: transparent;
        //   background: transparent;
        //   &:after {
        //     display: block;
        //     content: '';
        //     width: 100%;
        //     border-bottom: 1px dashed #3da5fe;
        //   }
        // }
      }
    }
  }
  // .i-search-conditions[data-v-37f1d1e4] {
  //   display:flex;
  //   justify-content: center;
  // }
}
</style>
