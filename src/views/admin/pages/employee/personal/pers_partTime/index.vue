<template>
  <!-- 人员借调 -->
  <section class="pers-partTime">
    <i-layout>
      <i-form
      @reset="reset"
      @search="search"
      v-if="accessMap.empConcurrentsJobGet"
      slot="header"
      >
        <el-form-item label="姓名">
          <el-input
          v-model="listParams.fullName"
          :maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="工号">
          <el-input
          v-model="listParams.employeeCode"
          :maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="组织">
          <i-select-tree
           dataKey="org"
           nodeKey="orgUnitId"
           :rootId="rootId"
           v-model="listParams.orgUnitId"
            @input="handleChange"
            size="large"
            treeMaxHeight="200"
            :accordion="true"
            :hasGrant="false"
            ></i-select-tree>
        </el-form-item>

        <el-form-item label="兼职组织" :maxlength="20">
          <i-select-tree
          dataKey="org"
          nodeKey="orgUnitId"
          :rootId="rootId"
          v-model="listParams.concurrentOrgUnitId"
          @input="handleChange"
          size="large"
          treeMaxHeight="200"
          :accordion="true"
          :hasGrant="false"
          ></i-select-tree>
        </el-form-item>

        <el-form-item label="开始时间">
          <el-date-picker
          v-model="listParams.startTimeMin"
          type="date"
          :editable="false"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions0">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="至">
          <el-date-picker
          v-model="listParams.startTimeMax"
          type="date"
          :editable="false"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>

        <el-form-item
        label="人事范围"
        prop="personnelGroupName"
        >
          <el-select
          v-model="listParams.personnelGroup" clearable filterable >
            <el-option
              v-for="(item,ids) in personnelGroupList"
              :key="ids"
              :label="item.label"
              :value="item.value"
            ></el-option>
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
            :data="table.data"
            style="width: 100%"
            @selection-change="selectionChangeHandler(tableScope, $event)"
             v-loading="partTimeLoading"
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

            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>

    <i-dialog
    title="新建员工兼职信息"
    v-model="newTemplate"
    v-if="newTemplate"
    :size="small"
    :close-on-click-modal="false"
    :toolbar="toolbar">
      <el-form :model="form" class="formMsg" rules="rule">
        <el-form-item
        label="选择员工"
        prop="fullName"
        label-width="200px"
        required>
          <el-input
          v-model="form.fullName"
          icon="menu"
          :on-icon-click="handleIconClick"
          readonly>
            <i slot="suffix" class="el-icon-menu" @click="handleIconClick"></i>
          </el-input>
          <i-personnel-select
            :isShow.sync="isShow"
            @confirm="handleConfirm"
            :multiple="false"
            filterType="personnelGroup"
            :hasGrant="false"
          >
          </i-personnel-select>
        </el-form-item>

        <el-form-item
        label="开始时间"
        prop="startTime"
        label-width="200px"
        required>
          <el-date-picker
          v-model="form.startTime"
          type="date"
          :editable="false"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions4">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime" label-width="200px">
          <el-date-picker
          v-model="form.endTime"
          type="date"
          :editable="false"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions5">
          </el-date-picker>
        </el-form-item>

        <el-form-item
        label="兼职组织"
        prop="orgUnitId"
        label-width="200px"
        clearable
        required>
          <i-select-tree
          v-model="form.orgUnitId"
          dataKey="org"
          nodeKey="orgUnitId"
          :lazy="true"
          @delete="deleteOrgUnitId"
          @node-click='nodeClick'
          :hasGrant="false"
          />
        </el-form-item>

        <el-form-item
        label="兼职职位"
        prop="posPostionId"
        label-width="200px"
        >
          <el-select v-model="form.posPostionId" clearable>
            <el-option
            v-for="(item,ids) in posList"
            :key="ids"
            :label="item.name"
            :value="item.posPositionId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" label-width="200px">
          <el-input
          type="textarea"
          :rows="5"
          v-model="form.description">
          </el-input>
        </el-form-item>
      </el-form>
    </i-dialog>

    <i-dialog
    title="结束兼职"
    v-model="showEndTimeDialog"
    :size="small"
    :close-on-click-modal="false"
    :toolbar="endToolbar">
      <el-form :model="endForm" class="formMsg" :rules="rules">
        <el-form-item label="兼职员工" prop="fullName" label-width="200px">
          <el-input v-model="endForm.fullName" :disabled="true" placeholder=""> </el-input>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime" label-width="200px">
          <el-date-picker
          v-model="endForm.endTime"
          type="date"
          clearable
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions6">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="兼职组织" prop="concurrentOrgUnitName" label-width="200px">
          <el-input v-model="endForm.concurrentOrgUnitName" :disabled="true"> </el-input>
        </el-form-item>

        <el-form-item label="兼职职位" prop="concurrentPosPostionName" label-width="200px">
          <el-input v-model="endForm.concurrentPosPostionName" :disabled="true"> </el-input>
        </el-form-item>
      </el-form>
    </i-dialog>

  </section>
</template>
<script>
  import req, { config } from 'api/employee/personal'
  import access from 'mixins/access'
  export default {
    mixins: [access],
    data () {
      return {
        partTimeLoading: false,
        endForm: {
          fullName: '',
          startTime: '',
          empConcurrentJobId: '',
          endTime: '',
          concurrentOrgUnitName: '',
          concurrentPosPostionName: ''
        },
        rules: {
          endTime: [
            { required: true, message: '请选择结束时间', trigger: 'change' }
          ]
        },
        endNewForm: {
          empConcurrentJobId: '',
          endTime: ''
        },
        pickerOptions6: {
          disabledDate: (time) => {
            return time.getTime() < this.endForm.startTime
          }
        },
        endToolbar: [{
          text: '确定',
          type: 'primary',
          func: (done) => {
            this.endNewForm = {
              empConcurrentJobId: this.endForm.empConcurrentJobId,
              endTime: this.endForm.endTime
            }
            this.stopEmployeePartTime()
            // done()
          }
        }, {
          text: '取消',
          type: 'text',
          func: (done) => {
            Object.keys(this.endForm).map(key => { this.endForm[key] = '' })
            done()
          }
        }],
        showEndTimeDialog: false,
        personnelGroupList: [],
        posList: [],
        endTimeList: [],
        isShow: false,
        form: {
          empEmployeeId: '',
          fullName: '',
          startTime: '',
          endTime: '',
          orgUnitId: '',
          concurrentOrgUnitName: '',
          posPostionId: '',
          concurrentPosPostionName: '',
          description: ''
        },
        selectedOrgNode: {},
        newForm: {},
        pickerOptions4: {
          disabledDate: (time) => {
            let endTimeVal = this.form.endTime
            if (endTimeVal) {
              return time.getTime() > new Date(endTimeVal)
            }
          }
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
        toolbar: [{
          text: '确定',
          type: 'primary',
          func: (done) => {
            this.newForm = {
              description: this.form.description,
              empEmployeeId: this.form.empEmployeeId,
              endTime: new Date(`${this.form.endTime} 00:00:00`).getTime(),
              orgUnitId: this.form.orgUnitId,
              posPostionId: this.form.posPostionId,
              startTime: new Date(`${this.form.startTime} 00:00:00`).getTime()
            }
            if (this.newForm.startTime !== '' && this.newForm.empEmployeeId !== '' && this.newForm.orgUnitId !== '') {
              req('newEmployeePartTime', this.newForm)
            .then(res => {
              if (res) {
                this.getConcurrentOrgUnitList()
                Object.keys(this.form).map(key => { this.form[key] = '' })
                setTimeout(() => {
                  done()
                }, 300)
              } else {
                this.$message({ type: 'error', message: '该员工已兼职该职位，且时间冲突，添加失败！' })
              }
            })
            } else {
              this.$message({ type: 'warning', message: '信息填写不完整，请重新填写！' })
            }
          }
        }, {
          text: '取消',
          type: 'text',
          func: (done) => {
            Object.keys(this.form).map(key => { this.form[key] = '' })
            done()
          }
        }],
        rule: {
          empEmployeeId: [{ required: true, message: '请选择兼职员工', trigger: 'change' }],
          startTime: [{ required: true, message: '开始时间不能为空', trigger: 'change' }],
          personnelGroupCode: [{ required: true, message: '兼职公司或组织不能为空', trigger: 'change' }],
          concurrentPosPostionName: [{ required: true, message: '兼职职位不能为空', trigger: 'change' }]
        },
        listParams: {
          // 姓名
          fullName: '',
          // 人事范围名称
          personnelGroup: '',
          // 员工组织
          orgUnitId: '',
          // 工号
          employeeCode: '',
          // 兼职组织名称
          concurrentOrgUnitId: '',
          // pageSize: '',
          // pageIndex: '',
          startTimeMax: '',
          startTimeMin: ''
        },
        pickerOptions0: {
          disabledDate: (time) => {
            let endTimeVal = this.listParams.startTimeMax
            if (endTimeVal) {
              return time.getTime() > new Date(endTimeVal)
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            let startTimeVal = this.listParams.startTimeMin
            if (startTimeVal) {
              return time.getTime() < new Date(startTimeVal)
            }
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let endTimeVal = this.listParams.endTimeMax
            if (endTimeVal) {
              return time.getTime() > new Date(endTimeVal)
            }
          }
        },
        pickerOptions3: {
          disabledDate: (time) => {
            let startTimeVal = this.listParams.endTimeMin
            if (startTimeVal) {
              return time.getTime() < new Date(startTimeVal)
            }
          }
        },
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', width: 100, align: 'center', fixed: 'left' },
            { prop: 'fullName', label: '姓名', width: 100, align: 'center', fixed: 'left' },
            { prop: 'personnelGroupCode', label: '人事范围代码', width: 120, align: 'center' },
            { prop: 'personnelGroupName', label: '人事范围', width: 150, align: 'left' },
            { prop: 'orgUnitName', label: '所属组织', width: 150, align: 'center' },
            { prop: 'orgPathName', label: '组织全称', width: 300, align: 'left' },
            { prop: 'posPostionName', label: '职位名称', width: 100, align: 'center' },
            { prop: 'concurrentOrgUnitName', label: '兼职组织', width: 120, align: 'left' },
            { prop: 'concurrentJobOrgPathName', label: '兼职组织全称', width: 300, align: 'left' },
            { prop: 'concurrentPosPostionName', label: '兼职职位', width: 120, align: 'left' },
            { prop: 'startTime', label: '开始时间', width: 150, align: 'center', display: { date: '' } },
            { prop: 'endTime', label: '结束时间', width: 150, align: 'center', display: { date: '' } }
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
                fileName: '兼职信息',
                sync: {
                  page: true,
                  select: true,
                  all: false
                }
              },
              key: 'empConcurrentsJobExport',
              req: config.getConcurrentOrgUnitList
            },
            import: {
              key: 'empConcurrentsJobImport',
              business: 'emp-concurrentjob'
            },
            toolbar: [{
              text: '新增兼职',
              key: 'empConcurrentsJobPost',
              func: this.newEmployeePartTime
            }, {
              text: '结束兼职',
              key: 'empConcurrentsJobDelete',
              type: 'warning',
              func: () => {
                if (this.endTimeList.length === 0) {
                  this.$message({ type: 'error', message: '请选择数据！' })
                } else if (this.endTimeList.length > 1) {
                  this.$message({ type: 'error', message: '每次只能结束一个职位, 请重新选择！' })
                } else {
                  if (this.endTimeList.every(this.endTimeCheck)) {
                    this.showEndTimeDialog = true
                  } else {
                    this.$message({ type: 'error', message: '选中的所有数据结束时间必须在当前时间之后, 请重新选中数据！' })
                  }
                }
              }
            }]
          }
        },
        options: [
          { value: false, label: '否' },
          { value: true, label: '是' }
        ]
      }
    },
    created () {
      this.getPersonnelGroup()
    },
    watch: {
      'form.orgUnitId': {
        handler: function (newVal, oldVal) {
          if (newVal === '') {
            this.posList = []
          }
          if (newVal) {
            req('getPosList', {orgUnitId: newVal, status: '1'})
              .then(res => {
                console.log('res', res)
                this.$set(this, 'posList', res)
              })
          }
        },
        deep: true
      },
      'form.posPostionId': {
        handler: function (newVal, oldVal) {
          if (newVal) {
            req('getPositions', {posPositionId: newVal, status: '1'})
              .then(res => {
              })
          }
        },
        deep: true
      }
    },
    mounted () {
      this.search()
    },
    methods: {
      // 当组织变化时，需要将职位置空，因为不同的组织职位不同，需要重新选择
      nodeClick () {
        this.form.posPostionId = ''
        Object.keys(this.form.concurrentPosPostionName).map(key => {
          this.form.concurrentPosPostionName[key] = ''
        })
      },
       // 删除组织id
      deleteOrgUnitId () {
        // 组织id删除的时候，要删除该组织下面的职位
        this.form.posPostionId = ''
      },
      handleConfirm (selected) {
        this.form.fullName = selected[0].employeeName
        this.form.empEmployeeId = selected[0].employeeId
      },
      handleIconClick () {
        this.isShow = !this.isShow
      },
      // 获取人事范围
      getPersonnelGroup () {
        req('getPersonnelGroup')
         .then(res => {
           if (!res) {
             return false
           }
           res.map(item => {
             let group = {}
             group.label = item.personnelGroupName
             group.value = item.personnelGroupCode
             this.personnelGroupList.push(group)
           })
         })
      },
      // 打开弹出框新增数据
      newEmployeePartTime () {
        this.newTemplate = true
      },
      // 检测结束时间是否小于当前时间，如果小于当前时间，则无法结束兼职
      endTimeCheck (endTime) {
        return endTime >= Date.parse(new Date())
      },
      // 结束兼职
      stopEmployeePartTime () {
        if (this.endNewForm.endTime === '') {
          this.$message({ type: 'warning', message: '请选择结束时间' })
        } else {
          console.log('endNewForm', this.endNewForm)
          req('stopEmployeePartTime', this.endNewForm)
          .then(data => {
            this.getConcurrentOrgUnitList()
            Object.keys(this.endForm).map(key => { this.endForm[key] = '' })
            this.$message({ type: 'success', message: '操作成功！' })
            this.showEndTimeDialog = false
          })
          .catch(err => {
            console.log(err)
          })
        }
      },

      // 改变页数页码，获取对应的列表
      handleSizeChange (options) {
        this.getConcurrentOrgUnitList(options)
      },

       // 改变页数页码，获取对应的列表
      handleCurrentChange (options) {
        this.getConcurrentOrgUnitList(options)
      },

      // 获取兼职人员的列表
      getConcurrentOrgUnitList (listParams) {
        this.partTimeLoading = true
        req('getConcurrentOrgUnitList', listParams, true, false)
        .then(data => {
          Object.keys(data).map(key => (this.table[key] = data[key]))
          this.partTimeLoading = false
        })
        .catch(err => {
          this.$message(err)
          this.partTimeLoading = false
        })
      },
      // 监听多选
      selectionChangeHandler ({ selectionChangeHandler }, selection) {
        selectionChangeHandler(selection)
        // console.log('selection', selection)
        if (selection.length === 1) {
          this.endForm.fullName = selection[0].fullName
          this.endForm.empConcurrentJobId = selection[0].empConcurrentJobId
          this.endForm.startTime = selection[0].startTime
          this.endForm.concurrentOrgUnitName = selection[0].concurrentOrgUnitName
          this.endForm.concurrentPosPostionName = selection[0].concurrentPosPostionName
        }
        // console.log('endForm', this.endForm)
        this.endTimeList = selection.map(el => (el.endTime))
        this.empConcurrentJobIds = selection.map(el => (el.empConcurrentJobId)).join(',')
        // console.log('endTimeList', this.endTimeList)
      },
       // 查询
      search () {
        this.table.search = { ...this.listParams }
      },
       // 重置
      reset () {
        Object.keys(this.listParams).map(key => { this.listParams[key] = '' })
      }
    }
  }
  </script>

  <style lang="scss" scoped>
    .formMsg {
      margin-right:100px;
    }
  </style>
