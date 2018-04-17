<template>
  <section class="pers-changerecord">
    <!-- 异动记录 -->
    <i-layout>
      
      <i-form
        @reset="reset"
        @search="search"
        labelWidth="large"
        slot="header"
        v-if="accessMap.empEmployeesRecordGet">
        <el-form-item label="姓名">
          <el-input v-model="listParams.fullName" :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="工号">
          <el-input v-model="listParams.employeeCode" :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="证件号码">
          <el-input v-model="listParams.idNumber" :maxlength="18"></el-input>
        </el-form-item>

        <el-form-item label="异动类型">
          <i-select parameter="RECORD_TYPE" v-model="listParams.recordType" />
        </el-form-item>

        <el-form-item class="time" label="异动时间起">
            <el-date-picker
            v-model="listParams.recordTimeMin"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item class="time" label="至">
          <el-date-picker
            v-model="listParams.recordTimeMax"
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="异动前职位">
          <el-input v-model="listParams.oldJobName" :maxlength="50"></el-input>
        </el-form-item>

        <el-form-item label="异动后职位">
           <el-input v-model="listParams.newJobName" :maxlength="50"></el-input>
        </el-form-item>

        <el-form-item label="异动前组织">
           <el-input v-model="listParams.oldUnitName" :maxlength="10"></el-input>
        </el-form-item>

        <el-form-item label="异动后组织">
           <el-input v-model="listParams.newUnitName" :maxlength="10"></el-input>
        </el-form-item>

         <el-form-item label="异动前用工类型">
          <i-select v-model="listParams.oldEmployeeType" parameter="EMPLOYEE_TYPE" />
        </el-form-item>
        <el-form-item label="异动后用工类型">
          <i-select v-model="listParams.newEmployeeType" parameter="EMPLOYEE_TYPE" />
        </el-form-item>

        <el-form-item v-for="(item, idx) in formList" :key="idx" :label="item.label">
          <el-input v-model="listParams[item.model]"></el-input>
        </el-form-item>

        <el-form-item label="异动前人事范围编码">
           <el-input v-model="listParams.oldPersonnelGroupCode" :maxlength="4"></el-input>
         </el-form-item> 
        
         <el-form-item label="异动前人事范围名称">
           <el-input v-model="listParams.oldPersonnelGroupName" :maxlength="10"></el-input>
         </el-form-item>

         <el-form-item label="异动后人事范围编码">
           <el-input v-model="listParams.newPersonnelGroupCode" :maxlength="4"></el-input>
         </el-form-item> 
        
         <el-form-item label="异动后人事范围名称">
           <el-input v-model="listParams.newPersonnelGroupName" :maxlength="10"></el-input>
         </el-form-item>

      </i-form>

      <div slot="section">
        <i-table
          :table="table"
          @pageSizeChange="handleSizeChange"
          @pageIndexChange="handleCurrentChange"
          >
          <template slot="table" slot-scope="tableScope">
            <el-table 
            ref="multipleTable"
            :data="tableScope.clone"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="searchLoading"
            :element-loading-text="$loadingText"
            >
                <el-table-column type="selection" width="55" />
                
                <el-table-column
                prop="employeeCode"
                label="工号"
                fixed="left"
                width="100" >
                <template slot-scope="scope">
                  <el-button type="text" @click="getPerRecord(scope.row)" size="large">{{scope.row.employeeCode}}</el-button>
                </template>
              </el-table-column>

              <el-table-column
                prop="fullName"
                label="姓名"
                fixed="left"
                width="100" >
                <template slot-scope="scope">
                  {{scope.row.fullName}}
                </template>
              </el-table-column>

                <el-table-column v-for="(item, idx) in table.columns"
                  :key="idx"
                  :prop="item.prop"
                  :label="item.label"
                  :min-width="item.width"
                  :formatter="tableScope.formatter"
                  :fixed="item.fixed"
                  :align="item.align"
                  sortable
                />
              </el-table>
            </template>
        </i-table>
      </div>
    </i-layout>
    <div>
        <i-dialog title="查看异动记录" v-model="visible.res" size="large" :close-on-press-escape="closeOnPressEscape">
          <i-table :table="resTable" >
            <template slot="table" slot-scope="resTableScope">
              <el-table
                :data="resTableScope.clone"
                tooltip-effect="dark"
                style="width: 100%"
                v-loading="dialogSearchLoading"
                :element-loading-text="$loadingText"
                >

                  <el-table-column
                    v-for="(item, idx) in resTable.columns"
                    :label="item.label"
                    :prop="item.prop"
                    :key="idx"
                    :formatter="resTableScope.formatter"
                    :width="item.width"
                    :min-width="item.minWidth"
                    :align="item.align"
                  ></el-table-column>
                </el-table>
            </template>
          </i-table>
      </i-dialog>
    </div>
  </section>
</template>

<script>
import req, { config } from 'api/employee/personal_dis'
import access from 'mixins/access'

export default {
  mixins: [access],
  data () {
    return {

      visible: {res: false},
      resTable: {
        columns: [
          { prop: 'employeeCode', label: '工号', width: 100, align: 'center' },
          { prop: 'fullName', label: '异动人员', width: 100, align: 'center' },
          { prop: 'idNumber', label: '证件号码', width: 180, align: 'center' },
          { prop: 'recordType', label: '异动类型', width: 120, display: { dict: 'RECORD_TYPE' }, align: 'left' },
          { prop: 'recordTime', label: '异动时间', width: 170, align: 'center', display: { date: '' } },
          { prop: 'oldPersonnelGroupCode', label: '异动前人事范围编码', width: 140, align: 'center' },
          { prop: 'oldPersonnelGroupName', label: '异动前人事范围名称', width: 200 },
          { prop: 'newPersonnelGroupCode', label: '异动后人事范围编码', width: 140, align: 'center' },
          { prop: 'newPersonnelGroupName', label: '异动后人事范围名称', width: 200 },
          { prop: 'oldUnitName', label: '异动前组织', width: 200, align: 'left' },
          { prop: 'oldJobName', label: '异动前职位', width: 200, align: 'left' },
          { prop: 'newUnitName', label: '异动后组织', width: 200, align: 'left' },
          { prop: 'newJobName', label: '异动后职位', width: 200, align: 'left' },
          { label: '异动前职群', prop: 'oldJobFamilyName', width: 200, align: 'left' },
          { label: '异动后职群', prop: 'newJobFamilyName', width: 200, align: 'left' },
          { label: '异动前职种', prop: 'oldJobClassName', width: 200, align: 'left' },
          { label: '异动后职种', prop: 'newJobClassName', width: 200, align: 'left' },
          { label: '异动前标准职位', prop: 'oldJobStandardJobName', width: 200, align: 'left' },
          { label: '异动后标准职位', prop: 'newJobStandardJobName', width: 200, align: 'left' },
          { label: '异动前职务', prop: 'oldPosTileName', width: 200, align: 'left' },
          { label: '异动后职务', prop: 'newPosTileName', width: 200, align: 'left' },
          { prop: 'oldEmployeeType', label: '异动前用工类型', width: 160, display: { dict: 'EMPLOYEE_TYPE' }, align: 'left' },
          { prop: 'newEmployeeType', label: '异动后用工类型', width: 160, display: { dict: 'EMPLOYEE_TYPE' }, align: 'left' },
          { prop: 'oldEmpStatus', label: '异动前状态', width: 200, display: { dict: 'EMPLOYEE_STATUS' }, align: 'left' },
          { prop: 'newEmpStatus', label: '异动后状态', width: 200, display: { dict: 'EMPLOYEE_STATUS' }, align: 'left' }
        ],
        // showPagebar: true,
        // info: null,
        // total: 0,
        data: null
      },
      recordList: null,
      pickerOptions: {
        disabledDate: (time) => {
          let endDateVal = this.listParams.recordTimeMax
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal)
          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          let beginDateVal = this.listParams.recordTimeMin
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal)
          }
        }
      },
      oldUnitId: '',
      newUnitId: '',
      listParams: {
        idNumber: '',
        employeeCode: '',
        fullName: '',
        recordTime: '',
        recordTimeMin: '',
        recordTimeMax: '',
        recordType: '',
        oldUnitId: '',
        oldUnitName: '',
        newUnitId: '',
        newUnitName: '',
        oldEmployeeType: '',
        newEmployeeType: '',
        oldJobName: '',
        newJobName: '',
        reason: '',
        oldEmpStatus: '',
        newEmpStatus: '',
        oldJobFamilyName: '',
        newJobFamilyName: '',
        newJobClassName: '',
        oldJobClassName: '',
        newJobStandardJobName: '',
        oldJobStandardJobName: '',
        newPosTileName: '',
        oldPosTileName: '',
        oldPersonnelGroupCode: '',
        oldPersonnelGroupName: '',
        newPersonnelGroupCode: '',
        newPersonnelGroupName: ''
      },
      formList: [
        { label: '异动前职群', model: 'oldJobFamilyName' },
        { label: '异动后职群', model: 'newJobFamilyName' },
        { label: '异动前职种', model: 'oldJobClassName' },
        { label: '异动后职种', model: 'newJobClassName' },
        { label: '异动前标准职位', model: 'oldJobStandardJobName' },
        { label: '异动后标准职位', model: 'newJobStandardJobName' },
        { label: '异动前职务', model: 'oldPosTileName' },
        { label: '异动后职务', model: 'newPosTileName' }
      ],
      date: {
        min: '',
        max: ''
      },
      empStaffRecordTypeValue: '',
      card: '',
      flagValue: '',
      organizeValue: '',
      l_organizeValue: '',
      startTime: '',
      endTime: '',
      empStaffRecordL_organizeValue: '',
      empStaffRecordOrganizeValue: '',
      table: {
        columns: [
          // { prop: 'employeeCode', label: '工号', width: 100, fixed: 'left' },
          // { prop: 'fullName', label: '姓名', width: 100, fixed: 'left' },
          { prop: 'idNumber', label: '证件号码', width: 180, align: 'center' },
          { prop: 'recordType', label: '异动类型', width: 120, display: { dict: 'RECORD_TYPE' }, align: 'left' },
          { prop: 'reason', label: '异动原因', width: 120, align: 'left' },
          { prop: 'recordTime', label: '异动时间', width: 170, align: 'center', display: { date: '' } },
          { prop: 'oldPersonnelGroupCode', label: '异动前人事范围编码', width: 160, align: 'center' },
          { prop: 'oldPersonnelGroupName', label: '异动前人事范围名称', width: 200 },
          { prop: 'newPersonnelGroupCode', label: '异动后人事范围编码', width: 160, align: 'center' },
          { prop: 'newPersonnelGroupName', label: '异动后人事范围名称', width: 200 },
          { prop: 'oldUnitName', label: '异动前组织', width: 200, align: 'left' },
          { prop: 'oldJobName', label: '异动前职位', width: 200, align: 'left' },
          { prop: 'newUnitName', label: '异动后组织', width: 200, align: 'left' },
          { prop: 'newJobName', label: '异动后职位', width: 200, align: 'left' },
          { label: '异动前职群', prop: 'oldJobFamilyName', width: 200, align: 'left' },
          { label: '异动后职群', prop: 'newJobFamilyName', width: 200, align: 'left' },
          { label: '异动前职种', prop: 'oldJobClassName', width: 200, align: 'left' },
          { label: '异动后职种', prop: 'newJobClassName', width: 200, align: 'left' },
          { label: '异动前标准职位', prop: 'oldJobStandardJobName', width: 200, align: 'left' },
          { label: '异动后标准职位', prop: 'newJobStandardJobName', width: 200, align: 'left' },
          { label: '异动前职务', prop: 'oldPosTileName', width: 200, align: 'left' },
          { label: '异动后职务', prop: 'newPosTileName', width: 200, align: 'left' },
          { prop: 'oldEmployeeType', label: '异动前用工类型', width: 160, display: { dict: 'EMPLOYEE_TYPE' }, align: 'left' },
          { prop: 'newEmployeeType', label: '异动后用工类型', width: 160, display: { dict: 'EMPLOYEE_TYPE' }, align: 'left' },
          { prop: 'oldEmpStatus', label: '异动前状态', width: 200, display: { dict: 'EMPLOYEE_STATUS' }, align: 'left' },
          { prop: 'newEmpStatus', label: '异动后状态', width: 200, display: { dict: 'EMPLOYEE_STATUS' }, align: 'left' }
        ],
        setting: {
          export: {
            config: {
              fileName: '异动记录',
              sync: {
                page: true,
                select: true,
                all: false
              }
            },
            req: config.postRecord,
            key: 'empEmployeesRecordExport',
            elTable: null
          }
        },
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        total: 0
      },
      searchLoading: false,
      dialogSearchLoading: false
    }
  },
  mounted () {
    this.table.setting.export.elTable = this.$refs.multipleTable  // 挂载
    this.search()
  },
  methods: {
    // 获取个人异动记录
    getPerRecord (item) {
      this.dialogSearchLoading = true
      req('getPerRecord', {employeeCode: item.employeeCode})
      .then(data => {
        this.resTable.data = data
        this.dialogSearchLoading = false
      })
      .catch(err => {
        console.log(err)
        this.$message({type: 'error', message: '数据请求失败'})
        this.dialogSearchLoading = false
      })
      setTimeout(() => {
        this.visible.res = true
      }, 300)
    },

    // 改变页数，页码
    handleSizeChange (options) {
      this.getRecordList(options)
    },

    // 改变页数，页码
    handleCurrentChange (options) {
      this.getRecordList(options)
    },

    // 日期选择器的赋值
    dataChange ($event, param) {
      this.listParams[param] = $event
    },

    // 获取异动记录的列表
    getRecordList (listParams) {
      this.searchLoading = true
      this.oldUnitId && (listParams.oldUnitId = this.oldUnitId.orgUnitId)
      this.newUnitId && (listParams.newUnitId = this.newUnitId.orgUnitId)
      req('postRecord', listParams)
      .then(res => {
        this.recordList = res
        Object.keys(res).map(
          key => (this.table[key] = res[key])
        )
        this.searchLoading = false
        // console.log(this.table.data)
      })
      .catch(err => console.log(err))
    },

    // 执行搜索方法
    search () {
      this.table.search = { ...this.listParams }
    },

    // 重置搜索条件
    reset () {
      // this.props(this.oldUnitId)
      // this.props(this.newUnitId)
      this.props(this.date)
      //  新添加方法重置
      Object.keys(this.listParams).map(item => {
        this.listParams[item] = ''
      })
      // console.log(this.listParams, this.oldUnitId)
    },

   // 重置搜索条件
    props (obj, arr) {
      let props = Object.keys(obj)
      props.forEach((item) => {
        if (!arr || (arr && arr.indexOf(item) === -1)) {
          obj[item] = ''
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .header {
    margin-bottom: -60px;
  }
</style>
