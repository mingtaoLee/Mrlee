<template>
  <!-- 人员借调 -->
  <section class="pers-second">
    <!-- <div class="form-card card"> -->
    <i-layout>
      <i-form
       @reset="reset"
       @search="search"
       slot="header"
       v-if="accessMap.empSecondmentsGet">
        <el-form-item label="姓名">
          <el-input v-model="listParams.fullName" :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="工号">
          <el-input v-model="listParams.employeeCode" :maxlength="20"></el-input>
        </el-form-item>

        <el-form-item label="证件号码">
          <el-input v-model="listParams.idNumber" :maxlength="18"></el-input>
        </el-form-item>

        <el-form-item label="借出组织">
            <i-select-tree  v-model="listParams.fromOrgUnitId"
              dataKey="org"
              nodeKey="orgUnitId"
              :rootId="root"
              :lazy="true"
              size="small"
              :hasGrant="false"
              />
          </el-form-item>

        <el-form-item label="借调开始时间">
          <el-date-picker v-model="listParams.beginDateMin"
          type="date"
          :editable="false"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions0"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="至">
          <el-date-picker v-model="listParams.beginDateMax"
          type="date"
          :editable="false"
          value-format="yyyy-MM-dd"
           :picker-options="pickerOptions1"
           >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="借调结束时间">
          <el-date-picker v-model="listParams.endDateMin"
          type="date"
          :editable="false"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions2"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="至">
          <el-date-picker v-model="listParams.endDateMax"
          type="date"
          :editable="false"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions3"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="借入组织">
            <i-select-tree  v-model="listParams.toOrgUnitId"
              dataKey="org"
              nodeKey="orgUnitId"
              :rootId="root"
              :lazy="true"
              size="small"
              :hasGrant="false"
              />
          </el-form-item>

        <el-form-item label="人事范围">
          <remote-select 
              v-model="listParams.personnelGroupCode" 
              clearable 
              dataKey="personnelGroup"
              :extraParams="extraParams"
              :props="personnelProps"
              :hasPower="Y"
            >
            </remote-select>
        </el-form-item>
      </i-form>
    <!-- </div> -->
      <div slot="section" v-if="table">
        <i-table :table="table" @pageSizeChange="handleSizeChange" @pageIndexChange="handleCurrentChange">
          <template slot="table" slot-scope="tableScope">
            <el-table
               :data="table.data"
               style="width: 100%"
               v-loading="contractLoading"
              :element-loading-text="$loadingText">
              <el-table-column type="selection"></el-table-column>

              <el-table-column
                sortable
                v-for="(item, idx) of table.columns"
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

      <!-- <footer v-if="secondmentList">
        <div class="right tools">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listParams.pageIndex"
            :page-size="listParams.pageSize" layout="total, prev, pager, next, jumper" :total="secondmentList.total">
          </el-pagination>
        </div>
      </footer> -->
    </i-layout>
  </section>
</template>

<script>
  import req, { config } from 'api/employee/personal_dis'
  import access from 'mixins/access'
  import RemoteSelect from 'components/compensation/remote-select'
  export default {
    components: {
      RemoteSelect
    },
    mixins: [access],
    data () {
      return {
        listParams: {
          // pageSize: 10,
          // pageIndex: 1,
          fullName: '',
          employeeCode: '',
          idNumber: '',
          fromOrgUnitId: '',
          toOrgUnitId: '',
          beginDateMin: '',
          beginDateMax: '',
          endDateMin: '',
          endDateMax: '',
          personnelGroupCode: ''
        },
        pickerOptions0: {
          disabledDate: (time) => {
            let endDateVal = this.listParams.beginDateMax
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal)
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            let beginDateVal = this.listParams.beginDateMin
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal)
            }
          }
        },
        pickerOptions2: {
          disabledDate: (time) => {
            let endDateVal = this.listParams.endDateMax
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal)
            }
          }
        },
        pickerOptions3: {
          disabledDate: (time) => {
            let beginDateVal = this.listParams.endDateMin
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal)
            }
          }
        },
        date: {
          fromStart: '',
          toStart: '',
          fromEnd: '',
          toEnd: ''
        },
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', width: 100, align: 'center', fixed: 'left' },
            { prop: 'fullName', label: '姓名', width: 100, fixed: 'left' },
            { prop: 'personnelGroupName', label: '人事范围', width: 180 },
            { prop: 'idNumber', label: '证件号码', width: 200, align: 'center' },
            { prop: 'curOrgUnitName', label: '现组织', width: 150 },
            { prop: 'orgPathName', label: '组织全称', width: 300, align: 'center' },
            { prop: 'toOrgUnitName', label: '借入组织', width: 150 },
            { prop: 'fromOrgUnitName', label: '借出组织', width: 150 },
            { prop: 'beginDate', label: '开始时间', width: 150, align: 'center', display: { date: '' } },
            { prop: 'endDate', label: '结束时间', width: 150, align: 'center', display: { date: '' } },
            { prop: 'manHour', label: '借调工时', width: 150 },
            { prop: 'salary', label: '借调费用', width: 150 },
            { prop: 'salaryType', label: '借出类型', display: {dict: 'SECONDMENT_TYPE'}, width: 150 }
          ],
          data: null,
          search: null,
          info: null,
          total: 0,
          showPagebar: true,
          setting: {
            export: {
              req: config.getSecondmentList,
              key: 'empSecondmentsExport',
              config: {
                sync: {
                  page: true,
                  select: true,
                  all: false
                }
              }
            },
            toolbar: [{
              text: '新增',
              key: 'empSecondmentsPost',
              type: 'primary',
              func: () => this.submitAction('employeeSecondmentProcess', 'debtorFillIn')
            }]
          }
        },
        options: [
          { value: false, label: '否' },
          { value: true, label: '是' }
        ],
        secondmentList: null,
        // table.data: null,
        id: '8a80dbef600e26c8016010a14e2701cd',
        extraParams: {
          hasPower: 'Y'
        },
        personnelProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        }
      }
    },
    // created () {
    //   this.getSecondmentList(this.listParams)
    // },
    mounted () {
      this.search()
    },
    methods: {
      // 改变页数页码，获取对应的列表
      handleSizeChange (options) {
        this.getSecondmentList(options)
      },

       // 改变页数页码，获取对应的列表
      handleCurrentChange (options) {
        this.getSecondmentList(options)
      },

       // 日期选择器改变赋值
      dataChange ($event, param) {
        this.listParams[param] = $event
      },

      // 获取借调人员的列表
      getSecondmentList (listParams) {
        // listParams.pageSize = 10
        req('getSecondmentList', listParams)
        .then(data => {
          Object.keys(data).map(key => (this.table[key] = data[key]))
        })
        .catch(err => {
          this.$message(err)
        })
      },

      /** 新增一个借调人员 */
      // newSecond (newParams) {
      //   req('newSecond', newParams)
      //   .then(data => {
      //     console.log(data)
      //     this.visible.newSecond = false
      //     this.reset()
      //     this.getSecondmentList(this.listParams)
      //   })
      //   .catch(err => console.log(err))
      // },

       // 查询
      search () {
        this.table.search = { ...this.listParams }
      },

       // 重置
      reset () {
        this.props(this.date)
        let arr = ['pageIndex', 'pageSize']
        this.props(this.listParams, arr)
        // 组织重置
        this.toOrgUnit = ''
        // console.log(this.listParams)
      },

       // 重置搜索条件
      props (obj, arr) {
        let props = Object.keys(obj)
        props.forEach((item) => {
          if (!arr || (arr && arr.indexOf(item) === -1)) {
            obj[item] = ''
          }
        })
      },

       // 新增，跳转到借调流程
      submitAction (type, taskKey) {
        this.$store.commit('SET_FLOW_ACTION', {processType: type, taskKey: taskKey})
        this.$store.commit('FLOW_WINDOW_OPEN', '/flow.html#/flow/employeeSecondmentProcess')
      }
    }
  }
  </script>

  <style lang="scss" scoped>
     .header {
      margin-bottom: -60px;
    }
    .btn{
      position: absolute;
      left:320px;
      top:100px;
    }
  </style>
