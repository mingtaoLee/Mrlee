<template>
  <!-- 联保人信息管理 -->
  <section class="pers-dimission">
    <!-- <div class="form-card card"> -->
    <i-layout>      
      <i-form
       @reset="reset"
       @search="search"
       slot="header"
       v-if="accessMap.empSuretysGet">
        <el-form-item v-for="(item, idx) in formList" :key="idx" :label="item.label">
          <el-input v-if="!item.selectOrg&&!item.selectPer" v-model="listParams[item.model]" :maxlength="20"></el-input>
          <i-select-tree
            v-if="item.selectOrg"
            v-model="listParams[item.model]"
            dataKey="org"
            nodeKey="orgUnitId"
            :hasGrant="false"
          >
          </i-select-tree>
          <remote-select 
            v-if="item.selectPer"
            v-model="listParams[item.model]" 
            clearable 
            dataKey="personnelGroup"
            :extraParams="extraParams"
            :props="personnelProps"
            :hasPower="Y"
          >
          </remote-select>
        </el-form-item>
        
        <el-form-item label="有效时间">
          <el-date-picker
            v-model="listParams.beginTime"
            type="date"
            :editable="false"
            @change="dataChange($event, 'beginTime')"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
         <el-form-item label="至">
          <el-date-picker
            v-model="listParams.endTime"
            type="date"
            :editable="false"
            @change="dataChange($event, 'endTime')"
            :picker-options="pickerOptions3"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="是否有效">
            <el-select v-model="listParams.status" clearable>
              <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item,idx) in templateList"
              :key="idx">
              </el-option>
            </el-select>
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
             ref="multipleTable"
             v-loading="gurantorListLoading"
             :element-loading-text="$loadingText"
             :data="tableScope.clone"
             tooltip-effect="dark"
             style="width: 100%"
             @selection-change="handleChange">
              <el-table-column type="selection" width="55" />
              <el-table-column label="被保人工号" width="100" fixed="left" prop="employeeCode">
                  <template slot-scope="scope">
                    {{scope.row.employeeCode}}
                </template>
              </el-table-column>
              <el-table-column label="被联保人姓名" min-width="150" fixed="left" prop="employeeName">
                <template slot-scope="scope">
                  <el-button type="text" @click="showResult(scope.row)" >{{scope.row.employeeName}}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, idx) in table.columns"
                :key="idx"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :formatter="tableScope.formatter"
                :align="item.align"
                sortable/>
            </el-table>
          </template>
        </i-table>
      </div>
   </i-layout>
    <div>
        <i-dialog title="查看结果" v-model="visible.res" size="large" :close-on-press-escape="closeOnPressEscape">
          <i-table
            :table="resTable"
            @pageSizeChange="handleSizeChangeRes"
            @pageIndexChange="handleCurrentChangeRes"
            >
            <template slot="table" slot-scope="resTableScope">
              <el-table
                :data="resTableScope.clone"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleChangeRes"
                v-loading="gurantorResLoading"
               :element-loading-text="$loadingText">
                <el-table-column type="selection" width="55" />
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
import req, { config } from 'api/employee/guarantor'
import access from 'mixins/access'
import moment from 'moment'
import RemoteSelect from 'components/compensation/remote-select'

export default {
  name: 'GuarantorInfo',
  // name: 'remoteSelect',
  components: {
    RemoteSelect
  },
  mixins: [access],
  // created () {
  //   this.getGuarantorList(this.listParams)
  //   console.log(this.listParams)
  // },

  data () {
    return {
      gurantorListLoading: false,
      gurantorResLoading: false,
      templateList: [
        {
          label: '有效',
          value: '1'
        },
        {
          label: '失效',
          value: '2'
        }
      ],
      extraParams: {
        hasPower: 'Y'
      },
      personnelProps: {
        value: 'personnelGroupCode',
        label: 'personnelGroupName'
      },
      // 人事范围
      // personnelGroupList: [],
      changeResult: {
        empEmployeeId: '',
        employeeName: '',
        oldEmpSuretyId1: '',
        oldCosuretyId1: '',
        oldCosuretyName1: '',
        oldEmpSuretyId2: '',
        oldCosuretyId2: '',
        oldCosuretyName2: '',
        newCosuretyId1: '',
        newCosuretyName1: '',
        newCosuretyId2: '',
        newCosuretyName2: ''
      },
      listParams: {
        employeeName: '',
        employeeCode: '',
        cosuretyName: '',
        personnelGroup: '',
        cosuretyCode: '',
        employeeUnitId: '',
        cosuretyUnitId: '',
        status: '1',
        endDate: '',
        startDate: ''
      },
      pickerOptions2: {
        disabledDate: (time) => {
          let endDateVal = this.listParams.endTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal)
          }
        }
      },
      pickerOptions3: {
        disabledDate: (time) => {
          let beginDateVal = this.listParams.beginTime
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal)
          }
        }
      },
      formList: [
        {label: '被联保人姓名', model: 'employeeName'},
        {label: '被联保人工号', model: 'employeeCode'},
        {label: '人事范围名称', model: 'personnelGroup', selectPer: true},
        {label: '被联保人组织', model: 'employeeUnitId', selectOrg: true},
        {label: '联保人姓名', model: 'cosuretyName'},
        {label: '联保人工号', model: 'cosuretyCode'},
        {label: '联保人组织', model: 'cosuretyUnitId', selectOrg: true}
      ],
      table: {
        columns: [
          // { prop: 'employeeCode', label: '被联保人工号', width: 150, align: 'center' },
          { prop: 'employeeUnitName', label: '所属组织', width: 150 },
          { prop: 'orgPathName', label: '组织全称', width: 300 },
          { prop: 'personnelGroupCode', label: '人事范围编码', width: 140, align: 'center' },
          { prop: 'personnelGroup', label: '人事范围名称', width: 200 },
          // { prop: 'employeePostion', label: '被联保人职位', width: 150 },
          { prop: 'cosuretyCode', label: '联保人工号', width: 150, align: 'center' },
          { prop: 'cosuretyName', label: '联保人姓名', width: 140 },
          { prop: 'cosuretyUnitName', label: '联保人组织', width: 200 },
          { prop: 'cosuretyStatus', label: '联保人状态', width: 150, display: { dict: 'EMPLOYEE_STATUS' } },
          { prop: 'beginTime', label: '开始日期', width: 150, align: 'center', display: { date: '' } },
          { prop: 'endTime', label: '结束日期', width: 150, align: 'center', display: { date: '' } },
          { prop: 'status', label: '是否有效', width: 120, display: { dict: 'SURETY_STATUS' }, align: 'center' }
        ],
        data: null,
        showPagebar: true,
        info: null,
        total: 0,
        search: null,
        setting: {
          toolbar: [{
            text: '联保人变更',
            key: 'empSuretysPut',
            type: 'primary',
            func: () => this.guarantorChange()
          }],
          export: {
            config: {
              fileName: '联保人',
              sync: {
                page: true,
                select: true,
                all: false
              }
            },
            key: 'empSuretysExport',
            req: config.gaurantorList
          }

        }
      },
      gradeRes: {},
      visible: {res: false},

      resTable: {
        columns: [
          { prop: 'evaluationName', label: '问卷名称', width: 120, align: 'center' },
          { prop: 'employeeCode', label: '被联保人工号', width: 150, align: 'center' },
          { prop: 'employeeName', label: '被联保人姓名', width: 150, align: 'center' },
          { prop: 'employeeUnitName', label: '被联保人组织', width: 150, align: 'center' },
          { prop: 'employeePostion', label: '被联保人职位', width: 150, align: 'center' },
          { prop: 'cosuretyCode', label: '联保人工号', width: 120, align: 'center' },
          { prop: 'cosuretyName', label: '联保人姓名', width: 120, align: 'center' },
          { prop: 'cosuretyUnitName', label: '联保人组织', width: 120, align: 'center' },
          { prop: 'cosuretyPostion', label: '联保人职位', width: 120, align: 'center' },
          { prop: 'beginDate', label: '开始日期', width: 120, align: 'center', display: { date: 'default' } },
          { prop: 'endDate', label: '结束日期', width: 120, align: 'center', display: { date: 'default' } },
          { prop: 'status', label: '状态', width: 120, display: {dict: 'EVALUATION_STATUS'}, align: 'center' },
          { prop: 'score', label: '得分', width: 80, align: 'center' }
        ],
        showPagebar: true,
        info: null,
        total: 0,
        setting: {
          export: {
            config: {
              fileName: '问卷结果',
              sync: {
                page: true,
                select: true,
                all: false
              }
            },
            req: config.getAssessmentResult,
            param: () => ({empEmployeeId: this.resListParams.empEmployeeId})
          }
        },
        data: null
      },

      date: {
        beginDate: '',
        endDate: ''
      },
      thisSelect: [],
      cosurety: {},
      pickerOptions: {
        disabledDate: (time) => {
          let endDate = this.date.endDate
          if (endDate) {
            return time.getTime() > endDate
          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          let beginDateVal = this.date.beginDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      resListParams: {
        empEmployeeId: ''
      }
    }
  },
  // created () {
  //   // this.getPersonnelGroup()
  // },
  mounted () {
    this.table.setting.export.elTable = this.$refs.multipleTable
    this.search()
  },
  updated () {
    this.resTable.setting.export.elTable = this.$refs.resTable
  },
  methods: {
    handleSizeChangeRes (options) {
      options.empEmployeeId = this.resListParams.empEmployeeId
      this.getAssessRes(options)
    },
    handleCurrentChangeRes (options) {
      options.empEmployeeId = this.resListParams.empEmployeeId
      this.getAssessRes(options)
    },

    showResult (item) {
      // console.log('item', item)
      this.resListParams.empEmployeeId = item.empEmployeeId
      this.getAssessRes(this.resListParams)
    },

    // 获取联保人问卷结果
    getAssessRes (resListParams) {
      // console.log('employeeId', resListParams.empEmployeeId)
      this.gurantorResLoading = true
      req('getAssessmentResult', {...resListParams})
      .then(data => {
        // console.log(data)
        Object.assign(this.resTable, data)
        this.gurantorResLoading = false
      })
      .catch(err => {
        console.log(err)
        this.$message({type: 'error', message: '数据请求失败'})
        this.gurantorResLoading = false
      })
      this.$nextTick(() => {
        this.resTable.setting.export.elTable = this.$refs.resTable
      })
      // console.log('resTable', this.resTable)
      setTimeout(() => {
        this.visible.res = true
      }, 300)
    },

    handleSizeChange (options) {
      options['status'] = this.listParams.status
      this.getGuarantorList(options)
    },

    handleCurrentChange (options) {
      options['status'] = this.listParams.status
      this.getGuarantorList(options)
    },

    handleChange (val) {
      this.thisSelect = val
    },
    handleChangeRes (val) {
      console.log(val)
    },
    change ($event, prop) {
      this.listParams[prop] = $event
    },
    getGuarantorList (listParams) {
      this.gurantorListLoading = true
      req('gaurantorList', listParams)
        .then(data => {
          Object.keys(data).map(key => (this.table[key] = data[key]))
          this.gurantorListLoading = false
        })
    },

    guarantorChange () {
      if (this.thisSelect.length > 1) {
        this.$message('只能选择一个联保人进行变更，请重新选择')
        return
      } else if (this.thisSelect.length === 0) {
        this.$message('请选择需要变更的联保人')
        return
      } else {
        let employeeId = this.thisSelect.length === 1 ? this.thisSelect[0].empEmployeeId : ''
        this.submitAction('empChangeSuretyProcess', 'empFillIn', employeeId)
      }
    },

    // // 获取人事范围
    // getPersonnelGroup () {
    //   req('getPersonnelGroup')
    //      .then(res => {
    //        if (!res) {
    //          return false
    //        }
    //        res.map(item => {
    //          let group = {}
    //          group.label = item.personnelGroupName
    //          group.value = item.personnelGroupCode
    //          this.personnelGroupList.push(group)
    //        })
    //        console.log(this.personnelGroupList)
    //      })
    // },

    // 新增流程的部分
    submitAction (type, taskKey, employeeId) {
      this.$store.commit('SET_FLOW_ACTION', {processType: type, taskKey: taskKey, employeeId: employeeId})
      this.$store.commit('FLOW_WINDOW_OPEN', '/flow.html#/flow/empChangeSuretyProcess')
    },
    // finishChange () {
    //   let property = Object.keys(this.changeResult)

    //   property.forEach(val => {
    //     (this.changeResult[val] === '') && (this.changeResult[val] = this.cosurety[val])
    //   })

    //   req('changeCosurety', this.changeResult).then(data => {
    //     this.getGuarantorList()
    //     this.visible.guarantorChange = false
    //     this.toNull(this.changeResult)
    //   })
    // },

    toNull (obj, param) {
      Object.keys(obj).map(item => {
        (item !== param) && (obj[item] = '')
      })
    },
       // 日期选择器赋值
    dataChange ($event, param) {
      $event ? this.listParams[param] = moment($event).format('YYYY-MM-DD') : this.listParams[param] = ''
    },
    search () {
      this.table.search = { ...this.listParams }
    },

    reset () {
      let propertys = Object.keys(this.listParams)

      propertys.map(item => (this.listParams[item] = ''))

      Object.keys(this.date).map(key => (this.date[key] = ''))
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
