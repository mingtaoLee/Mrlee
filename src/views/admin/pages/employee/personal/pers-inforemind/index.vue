<template>
  <!-- 到期信息提醒 -->
  <section class="pers-dimission table-card">
           <!-- v-if="accessMap.empEmployeesReminderGet" -->
    <i-layout>
      <i-form
       @reset="reset"
       @search="search"
       slot="header"
       >
        <el-form-item label="任务编号">
          <el-input  :maxlength="20" v-model="listParams.reminderCode"></el-input>
        </el-form-item>

          <el-form-item label="任务名称">
            <el-input  :maxlength="20" v-model="listParams.reminderName"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <i-select v-model="listParams.reminderStatus" parameter="REMINDERSTATUS"></i-select>
        </el-form-item>

        <el-form-item label="执行周期">
          <i-select v-model="listParams.reminderCycleType" parameter="REMINDERCYCLETYPE"></i-select>
        </el-form-item>

        <el-form-item label="提醒对象">
            <i-select v-model="listParams.reminderType" parameter="REMINDERTYPE"></i-select>
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
                v-loading="inforemindLoading"
                :element-loading-text="$loadingText"
                @selection-change="selectionChangeHandler(tableScope, $event)">
            >
              <el-table-column type="selection" width="55" />
                          <!-- { prop: 'reminderCode', label: '任务编号', width: 100, fixed: 'left' }, -->
              <el-table-column label="任务编号" width="100" fixed="left" prop="reminderCode">
                  <template slot-scope="scope">
                    <div>
                        <el-button type="text" @click="showResult(scope.row, '1')" v-if="accessMap.empReminderEmpGet">{{scope.row.reminderCode}}</el-button>
                        <span v-if="!accessMap.empReminderEmpGet">{{scope.row.reminderCode}}</span>
                    </div>
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
              >
              </el-table-column>
              <i-table-operator :table="tableScope" width="280" align="left"></i-table-operator>
            </el-table>
          </template>
        </i-table>
      </div>

    </i-layout>

        <i-dialog
          title="提醒范围人事表"
          v-model="showInforeDialog"
          size="large"
          :close-on-click-modal="false">
          <i-table
            :table="resTable"
            @pageSizeChange="handleSizeChangeRes"
            @pageIndexChange="handleCurrentChangeRes"
            v-loading="inforemindDetailLoading"
            :element-loading-text="$loadingText"
            >
            <template slot="table" slot-scope="resTableScope">
              <el-table
                :data="resTableScope.clone"
                tooltip-effect="dark"
                style="width: 100%">
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


        <i-dialog
          title="执行情况"
          v-model="showInstanceDialog"
          size="large"
          :close-on-click-modal="false">
          <i-table
            :table="resTable2"
            @pageSizeChange="handleSizeChangeRes2"
            @pageIndexChange="handleCurrentChangeRes2"
            v-loading="inforemindDetailLoading2"
            :element-loading-text="$loadingText"
            >
            <template slot="table" slot-scope="resTableScope">
              <el-table
                :data="resTableScope.clone"
                tooltip-effect="dark"
                style="width: 100%">
                  <el-table-column
                    v-for="(item, idx) in resTable2.columns"
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
  </section>
</template>

<script>
  import req, { config } from 'api/employee/personal_dis'
  import access from 'mixins/access'
  import { getDict } from 'utils/index'

export default {
    mixins: [access],
    data () {
      return {
        inforemindLoading: false,
        inforemindDetailLoading: false,
        inforemindDetailLoading2: false,
        table: {
          columns: [
            { prop: 'reminderName', label: '任务名称', width: 150, fixed: 'left' },
            { prop: 'newCycle', label: '执行周期', width: 100 },
            { prop: 'reminderStatus', label: '状态', width: 80, align: 'left', display: {dict: 'REMINDERSTATUS'} },
            { prop: 'lastDate', label: '上一次执行时间', width: 150, display: { date: 'yyyy-MM-dd HH:mm:ss' } },
            { prop: 'nextDate', label: '预计下一次执行时间', width: 180, display: { date: 'yyyy-MM-dd HH:mm:ss' } },
            { prop: 'executeStatus', label: '上次任务执行情况', width: 150, align: 'left', display: {dict: 'REMINDERLASTSTATUS'} },
            { prop: 'reminderTypeString', label: '提醒对象', width: 200, align: 'left' }
          ],
          data: null,
          search: null,
          info: null,
          total: 0,
          showPagebar: true,
          setting: {
            export: {
              config: {
                fileName: '到期提醒',
                sync: {
                  page: true,
                  select: true,
                  all: false
                }
              },
              req: config.getReminderList,
              key: 'empEmployeesReminderExport',
              elTable: null
            },
            toolbar: [{
              text: '新增提醒任务',
              type: 'primary',
              key: 'empReminderCreate',
              func: () => this.addInforemind(true)
            }
            // {
            //   text: '批量删除',
            //   type: 'danger',
            //   key: 'empReminderDelete',
            //   func: () => {
            //     this.deleteReminder(this.selectionReminder)
            //   }
            // }],
            ],
            operator: [
              {
                text: '启用',
                key: 'empReminderEnable',
                func: this.putRemindEnable,
                show (row) {
                  if (row.reminderStatus === '02' && row.executeStatus !== '01') {
                    return { empty: false }
                  } else {
                    return { empty: true }
                  }
                }
              },
              {
                text: '禁用',
                key: 'empReminderDisable',
                type: 'danger',
                func: this.putRemindDisable,
                show (row) {
                  if (row.reminderStatus === '01' && row.executeStatus !== '01') {
                    return { empty: false }
                  } else {
                    return { empty: true }
                  }
                }
              },
              {
                text: '查看执行历史',
                key: 'empReminderGetJobInstance',
                func: (row) => {
                  this.showResult(row, '2')
                },
                show (row) {
                  if (row.reminderStatus === '00' && row.executeStatus !== '01') {
                    return { empty: true }
                  } else {
                    return { empty: false }
                  }
                }
              },
              {
                text: '修改',
                key: 'empReminderModify',
                func: (row) => {
                  this.addInforemind(false, row.empReminderId)
                },
                show (row) {
                  if ((row.reminderStatus === '01' || row.reminderStatus === '02') && row.executeStatus !== '01') {
                    return { empty: false }
                  } else {
                    return { empty: true }
                  }
                }
              },
              {
                text: '删除',
                key: 'empReminderDelete',
                type: 'danger',
                func: (row) => {
                  this.selectionReminder = []
                  this.selectionReminder.push(row.empReminderId)
                  this.deleteReminder()
                },
                show (row) {
                  if (row.reminderStatus === '03' || row.executeStatus === '01') {
                    return { empty: true }
                  }
                }
              },
              {
                text: '一键提醒',
                key: 'empEmployeesRemindOneKey',
                func: (row) => this.oneKeyReminder(row.empReminderId),
                show (row) {
                  if (row.reminderStatus === '03' || row.executeStatus === '01') {
                    return { empty: true }
                  }
                }
              }
            ]
          }
        },
        resTable: {
          columns: [
            { prop: 'employeeCode', label: '工号', width: 120, align: 'center' },
            { prop: 'employeeName', label: '姓名', width: 150, align: 'center' },
            { prop: 'orgUnitName', label: '归属组织', width: 150, align: 'center' },
            { prop: 'orgPathName', label: '组织全称', width: 150, align: 'center' },
            { prop: 'personnelGroupCode', label: '人事范围编号', width: 150, align: 'center' },
            { prop: 'personnelGroupName', label: '人事范围名称', width: 120, align: 'center' },
            { prop: 'posPositionName', label: '职位', width: 120, align: 'center' },
            { prop: 'posTitleName', label: '职务', width: 120, align: 'center' },
            { prop: 'expireTime', label: '到期日', width: 120, align: 'center', display: { date: 'yyyy-MM-dd HH:mm:ss' } }
          ],
          showPagebar: true,
          info: null,
          total: 0,
          setting: {
            export: {
              config: {
                fileName: '提醒范围人事表',
                sync: {
                  page: true,
                  select: true,
                  all: false
                }
              },
              req: config.loadReminderList,
              key: 'empReminderEmpExport',
              param: () => ({empReminderId: this.resListParams.empReminderId})
            }
          },
          data: null
        },
        resTable2: {
          columns: [
            { prop: 'startTime', label: '开始时间', width: 150, align: 'center', display: { date: 'yyyy-MM-dd HH:mm:ss' } },
            { prop: 'endTime', label: '结束时间', width: 150, align: 'center', display: { date: 'yyyy-MM-dd HH:mm:ss' } },
            { prop: 'result', label: '结束', width: 150, align: 'center' },
            { prop: 'executeType', label: '触发方式', width: 150, align: 'center' },
            { prop: 'message', label: '异常信息', align: 'center' }
          ],
          showPagebar: true,
          info: null,
          total: 0,
          data: null
        },
        resListParams: {
          empReminderId: ''
        },
        listParams: {
          reminderCode: '',
          reminderName: '',
          reminderStatus: '',
          reminderCycleType: '',
          reminderType: ''
        },
        reminderTypeList: [],
        reminderList: null,
        date: '',
        pickerOptions: {
          disabledDate: (time) => {
            let endDateVal = this.listParams.reminderDateEnd
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal)
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            let beginDateVal = this.listParams.reminderDateBegin
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal)
            }
          }
        },
        extraParams: {
          hasPower: 'Y'
        },
        personnelProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        },
        selectionReminder: [],
        showInforeDialog: false,
        showInstanceDialog: false,
        oneKeyDisable: false
      }
    },
    created () {
    },
    mounted () {
      this.table.setting.export.elTable = this.$refs.multipleTable  // 挂载
      this.search()
      getDict('REMINDERTYPE').then(data => {
        this.reminderTypeList = data
      })
    },
    methods: {
      handleSizeChangeRes (options) {
        options.empReminderId = this.resListParams.empReminderId
        this.getAssessRes(options)
      },
      handleCurrentChangeRes (options) {
        options.empReminderId = this.resListParams.empReminderId
        this.getAssessRes(options)
      },
      getAssessRes (resListParams) {
        const _this = this
        _this.inforemindDetailLoading = true
        req('loadReminderList', {...resListParams})
        .then(data => {
          Object.assign(this.resTable, data)
          this.inforemindDetailLoading = false
        })
        .catch(err => {
          this.$message({type: 'error', message: err.message})
          this.inforemindDetailLoading = false
        })
      },
      handleSizeChangeRes2 (options) {
        options.empReminderId = this.resListParams.empReminderId
        this.getAssessRes2(options)
      },
      handleCurrentChangeRes2 (options) {
        options.empReminderId = this.resListParams.empReminderId
        this.getAssessRes2(options)
      },
      getAssessRes2 (resListParams) {
        const _this = this
        _this.inforemindDetailLoading2 = true
        req('reminderInStanceList', {...resListParams})
        .then(data => {
          Object.assign(this.resTable2, data)
          this.inforemindDetailLoading2 = false
        })
        .catch(err => {
          this.$message({type: 'error', message: err.message})
          this.inforemindDetailLoading2 = false
        })
      },
      // 监听多选
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
        const _this = this
        _this.selectionReminder = []
        selection.map((item) => {
          _this.selectionReminder.push(item.empReminderId)
        })
      },
      // 新增提醒
      addInforemind (isNew, id) {
        this.$router.push({
          path: 'pers_inforemind_edit',
          query: {
            empReminderId: isNew ? 'edit' : id
          }
        })
      },
      // 改变页数页码，获取对应的列表
      handleSizeChange (options) {
        this.getReminderList(options)
      },
      // 改变页数页码，获取对应的列表
      handleCurrentChange (options) {
        this.getReminderList(options)
      },
       // 获取到期信息的列表
      getReminderList (listParams) {
        const _this = this
        _this.inforemindLoading = true
        req('getReminderList', listParams)
        .then(data => {
          _this.inforemindLoading = false
          Object.keys(data).map(key => {
            this.table[key] = data[key]
          })
        })
        .catch((err) => {
          _this.inforemindLoading = false
          _this.$message({type: 'error', message: err.message})
        })
      },
       // 查询
      search () {
        this.table.search = { ...this.listParams }
      },
       // 重置
      reset () {
        this.date = ''
        let propertys = Object.keys(this.listParams)
        propertys.forEach((item, idx) => {
          if (item !== 'pageIndex' && item !== 'pageSize') {
            this.listParams[item] = ''
          }
        })
      },
      deleteReminder () {
        const _this = this
        let obj = {
          empReminderIds: this.selectionReminder.join(',')
        }
        _this.$confirm('确定要删除该提醒吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.inforemindLoading = true
          req('deleteReminder', obj)
            .then(data => {
              _this.$message({ type: 'success', message: '删除成功！' })
              _this.inforemindLoading = false
              _this.getReminderList(this.listParams)
            })
            .catch((err) => {
              _this.$message({type: 'error', message: err.message})
              _this.inforemindLoading = false
            })
        })
      },
      showResult ({empReminderId}, type) {
        const _this = this
        _this.resListParams.empReminderId = empReminderId
        if (type === '1') {
          _this.showInforeDialog = true
          _this.getAssessRes(this.resListParams)
        } else {
          _this.showInstanceDialog = true
          _this.getAssessRes2(this.resListParams)
        }
      },
      putRemindEnable ({empReminderId}) {
        this.disableOrEnable(empReminderId, '启用', 'enableReminder')
      },
      putRemindDisable ({empReminderId}) {
        this.disableOrEnable(empReminderId, '禁用', 'disableReminder')
      },
      disableOrEnable (empReminderId, title, url) {
        this.$confirm(`确定${title}该条消息提醒吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          req(url, {empReminderId})
          .then(data => {
            this.$message.success(`${title}成功`)
            this.getReminderList(this.listParams)
          })
          .catch((err) => {
            this.$message({type: 'error', message: err.message})
          })
        })
      },
      // 一键提醒
      oneKeyReminder (empReminderId) {
        const _this = this
        _this.$confirm('确定要一键提醒吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$message({type: 'warning', message: '该提醒任务正在执行中,请稍后'})
          _this.oneKeyDisable = true
          req('reminderAll', {empReminderId})
          .then(data => {
            _this.oneKeyDisable = false
            _this.$message.success(`一键提醒成功！`)
            _this.getReminderList(this.listParams)
          })
          .catch((err) => {
            _this.oneKeyDisable = false
            _this.$message({type: 'error', message: err.message})
          })
        })
      }
    }
  }

</script>

