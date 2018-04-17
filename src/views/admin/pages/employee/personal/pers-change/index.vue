<template>
  <section class="pers-change table-card">
    <i-layout>
      <i-form @reset="reset" @search="search" slot="header" v-if="accessMap.empEmployeesGet">

        <el-form-item label="姓名" prop="fullName">
          <el-input v-model="listParams.fullName"  :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="工号" prop="employeeCode">
          <el-input v-model="listParams.employeeCode" :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="组织">
          <!-- 下拉树 -->
          <i-select-tree
            v-model="listParams.orgUnitId"
            dataKey="org"
            nodeKey="orgUnitId"
            :lazy="true"
            :hasGrant="false"
            >
          </i-select-tree>
        </el-form-item>

        <el-form-item label="用工类型">
          <i-select v-model="listParams.employeeType" parameter="EMPLOYEE_TYPE"></i-select>
        </el-form-item>

        <!-- 登记时间 -->
        <el-form-item label="登记日期">
          <el-date-picker
            v-model="listParams.createDateMin"
            type="date"
            :editable="false"
            @change="dataChange($event, 'createDateMin')"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

         <el-form-item label="至">
          <el-date-picker
            v-model="listParams.createDateMax"
            type="date"
            :editable="false"
            @change="dataChange($event, 'createDateMax')"
            :picker-options="pickerOptions1"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="员工状态">
          <!-- TODO:iselect不支持多选 -->
          <i-select v-model="listParams.employeeStatus" parameter="EMPLOYEE_STATUS"></i-select>
          <!-- <i-select multiple  collapse-tags v-model="semployeeStatusList" parameter="EMPLOYEE_STATUS"></i-select> -->
        </el-form-item>

         <el-form-item label="人事范围名称">
          <remote-select
              v-model="listParams.groupCode"
              clearable
              dataKey="personnelGroup"
              :extraParams="extraParams"
              :props="personnelProps"
              :hasPower="Y"
            >
            </remote-select>
        </el-form-item>

      </i-form>

      <div slot="section">
        <i-table
          :table="table"
          @pageSizeChange="handleSizeChange"
          @pageIndexChange="handleCurrentChange"
          >
          <template slot-scope="tableScope" slot="table">
            <el-table
              ref="multipleTable"
              :data="tableScope.clone"
              tooltip-effect="dark"
              style="width: 100%"
              :border="$$.table.border"
              :stripe="$$.table.stripe"
              @selection-change="handleSelectionChange"
              v-loading="changeLoading"
              :element-loading-text="$loadingText"
              >

              <el-table-column type="selection" width="55" />

              <el-table-column
                prop="employeeCode"
                label="工号"
                fixed="left"
                width="100" >
                <template slot-scope="scope">
                  {{scope.row.employeeCode}}
                </template>
              </el-table-column>

              <el-table-column
                prop="fullName"
                label="姓名"
                fixed="left"
                width="100" >
                <template slot-scope="scope">
                  <el-button type="text" @click="toRecord(scope.row)" size="mini">{{scope.row.fullName}}</el-button>
                </template>
              </el-table-column>

              <el-table-column
                v-for="(item, index) in table.columns"
                :prop="item.prop"
                :label="item.label"
                :key="index"
                :formatter="tableScope.formatter"
                :min-width="item.width"
                :align="item.align"
                sortable>
              </el-table-column>
              <i-table-operator :table="tableScope" width="150"></i-table-operator>

            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>
    <!-- 导入弹出 -->
    <dlog-upload v-model="dialogUploadVisible" @successImport="successImport"></dlog-upload>
  </section>
</template>

<script>
  import req, { config } from 'api/employee/personal'
  import dlogUpload from 'components/employee/upload'
  import moment from 'moment'
  import access from 'mixins/access'
  import RemoteSelect from 'components/compensation/remote-select'

  export default {
    components: {
      dlogUpload,
      RemoteSelect
    },
    mixins: [access],
    data () {
      let checkFullName = (rule, value, cb) => {
        setTimeout(() => {
          value.length > 20 ? cb(new Error('输入的字数不能大于20')) : cb()
        }, 0)
      }
      let checkEmployeeCode = (rule, value, cb) => {
        setTimeout(() => {
          value.length > 10 ? cb(new Error('输入的字数不能大于10')) : cb()
        }, 0)
      }
      return {
        changeLoading: false,
        rules: {
          fullName: [
            {validator: checkFullName, trigger: 'blur'}
          ],
          employeeCode: [
            {validator: checkEmployeeCode, trigger: 'blur'}
          ]
        },
        idNumber: '',
        empEmployeeId: '',
        employeeStatus: '',
        employeeStatusList: [],
        employeeIdList: [],
        dialogUploadVisible: false,
        table: {
          columns: [
            // { prop: 'employeeCode', label: '员工工号', width: 150, align: 'center' },
            { prop: 'idNumber', label: '证件号码', width: 200, align: 'center' },
            { prop: 'groupCode', label: '人事范围编码', width: 140, align: 'center' },
            { prop: 'groupName', label: '人事范围名称', width: 200, align: 'left' },
            { prop: 'orgName', label: '所属组织', width: 200, align: 'center' },
            { prop: 'orgPathName', label: '组织全称', width: 300, align: 'center' },
            { prop: 'posPositionName', label: '职位', width: 150, align: 'left' },
            { prop: 'createDate', label: '登记日期', width: 200, align: 'center', display: { date: '' } },
            { prop: 'employeeType', label: '用工类型', display: { dict: 'EMPLOYEE_TYPE' }, width: 200, align: 'center' },
            { prop: 'employeeStatus', label: '员工状态', display: { dict: 'EMPLOYEE_STATUS' }, width: 180, align: 'left' }
          ],
          showPagebar: true,
          search: null,
          data: null,
          info: null,
          total: 0,
          setting: {
            export: {
              config: {
                fileName: '员工信息',
                sync: {
                  page: true,
                  select: true,
                  all: false
                }
              },
              req: config.getEmpStaffRecord,    // 必填
              key: 'empEmployeesExport',
              elTable: null
            },
            // 导入按钮
            import: {
              key: 'empEmployeesImport',
              business: 'employee-info'
            },
            toolbar: [
              {
                text: '批量调动',
                type: 'primary',
                key: 'empEmployeesTransfersPut',
                func: () => this.submitMulti(4, '', this.employeeStatusList, this.employeeIdList)
              }
              // {
              //   text: '导入',
              //   type: 'success',
              //   key: 'empEmployeesImport',
              //   func: () => (this.dialogUploadVisible = true)
              // }

            ],
            operator: [{
              text: '入职',
              key: 'empEmployeesHireSubmissionPut',
              func: (row) => {
                this.submitAction('employeeHireProcess', row)
              },
              show (row) {
                // 只有待入职才能入职
                if (row.employeeStatus !== '0') {
                  return { empty: true }
                } else if (row.inBlackList === 'Y') {
                  return { disable: true }
                }
              }
            }, {
              text: '返聘',
              key: 'empEmployeesHireSubmissionPut',
              func: (row) => {
                this.submitAction('employeeHireProcess', row)
              },
              show (row) {
                // 只有退休、离职才能返聘
                if (row.employeeStatus !== '3' && row.employeeStatus !== '8') {
                  return { empty: true }
                } else if (row.inBlackList === 'Y') {
                  return { disable: true }
                }
              }
            }, {
              text: '转正',
              key: 'empEmployeesRegularSubmitPut',
              func: (row) => this.submitAction('employeeRegularProcess', row),
              show (row) {
                // 只有试用期员工才能转正
                if (row.employeeStatus !== '1') {
                  return { empty: true }
                }
              }
            }, {
              text: '调动',
              key: 'empEmployeesTransferPut',
              func: (row) => this.submitAction('employeeTransferProcess', row),
              show (row) {
                // 只有试用期、正式、实习中、派遣中员工可以调动
                if (row.employeeStatus !== '1' && row.employeeStatus !== '2' && row.employeeStatus !== '5' && row.employeeStatus !== '6') {
                  return { empty: true }
                }
              }
            }, {
              text: '离职',
              key: 'empEmployeesDimissionPut',
              func: (row) => this.submitAction('employeeDimissionProcess', row),
              show (row) {
                if (row.employeeStatus !== '1' && row.employeeStatus !== '2' && row.employeeStatus !== '5' && row.employeeStatus !== '6') {
                  return { empty: true }
                }
              }
            }]
          }
        },
        // semployeeStatusList: [],
        listParams: {
          // pageSize: 10,
          // pageIndex: 1,
          fullName: '',
          employeeStatus: '',
          employeeType: '',
          orgUnitId: '',
          employeeCode: '',
          createDateMax: '',
          createDateMin: '',
          groupCode: ''
        },
        extraParams: {
          hasPower: 'Y'
        },
        personnelProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        },
        multipleSelection: [],
        pickerOptions: {
          disabledDate: (time) => {
            let endDateVal = this.listParams.createDateMax
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal)
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            let beginDateVal = this.listParams.createDateMin
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal)
            }
          }
        }
      }
    },

    mounted () {
      this.table.setting.export.elTable = this.$refs.multipleTable
      // this.search()
      this.table.search = this.listParams
    },
    methods: {
      goCheckin () {
        this.$router.push({ path: '/employee/employee/pers_checkin' })
      },
      // 获取人员异动列表
      getEmpStaffRecord (listParams = {}) {
        this.changeLoading = true
        req('getEmpStaffRecord', listParams).then(res => {
          Object.keys(res).map(key => (this.table[key] = res[key]))
          this.changeList = res
          this.changeLoading = false
        })
      },
      // 跳转到履历表
      toRecord (item) {
        // 履历表改成可以编辑
        // this.$store.commit('SET_TO_RECORD', true)
        this.$store.toRecord = false
        this.$router.push('pers_record/' + item.empEmployeeId)
      },

       // 日期选择器赋值
      dataChange ($event, param) {
        $event ? this.listParams[param] = moment($event).format('YYYY-MM-DD') : this.listParams[param] = ''
      },

      // 重置搜索条件
      reset () {
        Object.keys(this.listParams).map(item => {
          this.listParams[item] = ''
        })
        // this.semployeeStatusList = []
      },

      // 执行搜索方法
      search () {
        // this.getEmpStaffRecord(this.listParams)
        // this.listParams.employeeStatus = this.semployeeStatusList.join(',')
        this.table.search = { ...this.listParams }
      },
      // submitMultiTransfer (type, employeeStatusList, employeeIdList, taskKey) {
      //   // 如果选中有人，就将那些人的信息带过去
      //   // 如果没有选中人，就直接打开调动的界面
      //   if (this.multipleSelection.length >= 1) {
      //     var isMulti = employeeStatusList.every(item => item === '1' || item === '2' || item === '5' || item === '6')
      //     if (isMulti) {
      //       // 跳转的时候，需要将employeeIdList带进去，写死参数
      //       let statusStr = JSON.stringify(this.employeeIdList)
      //       window.open(`/flow.html#/flow/${type}?processType=${type}&empEmployeeId=${statusStr}&taskKey=${taskKey}`)
      //     } else {
      //       this.$message.warning('只有试用期、正式、实习中、派遣中员工可以批量调动')
      //       return false
      //     }
      //     this.clearSelection()
      //     return false
      //   } else {
      //     window.open(`/flow.html#/flow/${type}?processType=${type}&taskKey=${taskKey}`)
      //   }
      // },

     // 入职，调动，转正，离职流程的跳转
      submitAction (type, row) {
        if (type === 0) {
          this.submitRegister(type, 'register')
          this.clearSelection()
          return false
        }
        // 如果type===0,就是人员登记，可以直接进入页面
        // 如果type!==0，则为其他条件
        // if (type === 0) {
        //   this.submitRegister(type, urlStr)
        //   this.clearSelection()
        // } else {
          // // 如果没有选中的话，就直接进入相应功能页
          // if (this.multipleSelection.length <= 0) {
          //   this.submitRegister(type, urlStr)
          // } else {
          //   // 如果有选中的话，批量调动执行特有的submitMulti方法，执行完后清除选中
          //   if (this.multipleSelection.length >= 1 && type === 4) {
          //     this.submitMulti(type, urlStr, this.employeeStatusList, this.employeeIdList)
          //     this.clearSelection()
          //     return false
          //   } else {
          //     if (this.multipleSelection.length > 1) {
          //       this.$message.warning('此操作只能选取一个人')
          //       return false
          //     }
          //     this.idNumber = this.multipleSelection[0].idNumber
          //     this.empEmployeeId = this.multipleSelection[0].empEmployeeId
          //     this.employeeStatus = this.multipleSelection[0].employeeStatus
          //     // 剩余的都执行submitSome方法，执行完后清除选中
          //     this.submitSome(type, urlStr, this.employeeStatus)
          //     this.clearSelection()
          //   }
          // }
        // console.log(233, type)
        let taskKey = ''
        switch (type) {
          case 'employeeHireProcess':
            taskKey = 'applicantFillIn'
            break
          default:
            taskKey = 'empFillIn'
            break
        }
        let isInFlow = {
          type: type,
          employeeId: row.empEmployeeId
        }
        if (type === 'employeeHireProcess') {
          let isInHireProcess = {
            type: type,
            idNumber: row.idNumber
          }
          req('getFlowStatus', isInHireProcess)
          .then(data => {
            this.$store.commit('SET_FLOW_ACTION', { processType: type, idNumber: row.idNumber, employeeId: row.empEmployeeId, taskKey: taskKey })
            this.$store.commit('FLOW_WINDOW_OPEN', `/flow.html#/flow/${type}/`)
          })
          .catch(err => {
            console.log(err)
          })
        } else {
          // console.log('row', row)
          req('getFlowStatus', isInFlow)
          .then(data => {
            this.$store.commit('SET_FLOW_ACTION', { processType: type, idNumber: row.idNumber, employeeId: row.empEmployeeId, taskKey: taskKey })
            this.$store.commit('FLOW_WINDOW_OPEN', `/flow.html#/flow/${type}/`)
          })
          .catch(err => {
            console.log(err)
          })
        }
        // }
      },

      // 人员登记的页面跳转
      // submitRegister (type, urlStr, taskKey = 'empFillIn') {
      //   // this.$store.commit('EMP_SET_ACTION', { processType: type, idNumber: '-1', empEmployeeId: '-1', taskKey: taskKey })
      //   // this.$store.commit('EMP_WINDOW_OPEN', '/#/employee/employee/pers_checkin')
      //   window.open('/#/employee/employee/pers_checkin')
      //   // this.$router.push('pers_checkin/')
      // },

      // 批量调动跳转
      submitMulti (type, urlStr, employeeStatusList, employeeIdList) {
        // 判断employeeStatusList中是否有1， 2， 5， 6，如果有才执行跳转，如果没有就不让跳转
        var isMulti = employeeStatusList.every(item => item === '1' || item === '2' || item === '5' || item === '6')
        if (isMulti) {
          // 跳转的时候，需要将employeeIdList带进去，写死参数
          let statusStr = JSON.stringify(this.employeeIdList)
          // this.$router.push({path: '/employee/employee/pers_multi_movement', query: {empEmployeeId: statusStr}})
          window.open(`/flow.html#/flow/new_employee_multi_movement?processType=4&empEmployeeId=${statusStr}`)
          this.clearSelection()
        } else {
          this.$message.warning('只有试用期、正式、实习中、派遣中员工可以批量调动')
          this.clearSelection()
          return false
        }
      },

      // 重置选中的部分条件
      resetSelection () {
        this.idNumber = ''
        this.empEmployeeId = ''
        this.employeeType = ''
      },

      // 改变页码重新获取对应页码的列表
      handleCurrentChange (val) {
        this.getEmpStaffRecord(val)
      },

      // 改变页码重新获取对应页数的列表
      handleSizeChange (val) {
        this.getEmpStaffRecord(val)
      },

      // 清除表单选中的状态
      clearSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
          this.resetSelection()
          this.employeeStatusList.length = 0
          this.employeeIdList.length = 0
        }
      },

      // 选择某一条数据时，初始化一些信息
      handleSelectionChange (val) {
        this.multipleSelection = val
        this.employeeStatusList.length = 0
        this.employeeIdList.length = 0
        this.multipleSelection.map(selection => {
          this.employeeStatusList.push(selection.employeeStatus)
          this.employeeIdList.push(selection.empEmployeeId)
        })
      },
      // 导入成功回调
      successImport (message) {
        let a = Object.keys(message)
        // console.log(a)
        if (!a.length) {
          this.search()
          this.$message('导入成功!')
        } else {
          this.$message({
            type: 'error',
            message: '导入失败！'
          })
        }
        // 刷新表格
      }
    }
  }
</script>

<style lang="scss" scoped>
  .i-layout .table {
    padding: 0 0;
  }
</style>
