<template>
  <section class="contract-new ">
    <!-- <div class="card form-card"> -->
    <i-layout>
      <i-form
       @reset="reset"
       @search="search"
       slot="header"
       v-if="accessMap.empContNewSignSearch">
        <el-form-item label="姓名">
          <el-input v-model="listParams.employeeName" :maxlength="20"/>
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="listParams.employeeCode" :maxlength="20"/>
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input v-model="listParams.employeeIdNumber" :maxlength="18"/>
        </el-form-item>
        <el-form-item label="用工类型">
          <i-select parameter="EMPLOYEE_TYPE" v-model="listParams.employeeType" :hideKeys="['7', '8']"/>
        </el-form-item>
        <el-form-item label="所属组织">
            <i-select-tree :hasGrant="false" v-model="listParams.orgUnitId" dataKey="org" nodeKey="orgUnitId" />
        </el-form-item>
        <el-form-item label="人事范围名称">
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

      <div slot="section">
        <i-table
          :table="table"
          @pageSizeChange="handleSizeChange"
          @pageIndexChange="handleCurrentChange"
          >
          <template slot="table" slot-scope="tableScope">
            <el-table
             :data="tableScope.clone"
             tooltip-effect="dark"
             style="width: 100%"
             v-loading="contractLoading"
            :element-loading-text="$loadingText"
          >
                <el-table-column type="selection" width="55" />
                <el-table-column
                 sortable v-for="(item, idx) in table.columns"
                 :key="idx"
                 :prop="item.prop"
                 :label="item.label"
                 :min-width="item.width"
                 :formatter="tableScope.formatter"
                 :fixed="item.fixed"
                 :align="item.align"/>
                <i-table-operator :table="tableScope"></i-table-operator>
            </el-table>
          </template>
        </i-table>
      </div>
    </i-layout>

  </section>
</template>

<script>
  import req, {config} from 'api/employee/contract'
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
          employeeName: '',
          employeeIdNumber: '',
          employeeCode: '',
          employeeType: '',
          orgUnitId: '',
          personnelGroupCode: ''
        },
        table: {
          columns: [
            // {prop: 'employeeName', width: 120, label: '姓名'},
            {prop: 'employeeCode', label: '工号', width: 100, align: 'center', fixed: 'left'},
            {prop: 'employeeName', label: '姓名', width: 100, align: 'center', fixed: 'left'},
            { prop: 'personnelGroupCode', label: '人事范围编码', width: 140, align: 'center' },
            { prop: 'personnelGroupName', label: '人事范围名称', width: 240 },
            {prop: 'orgUnitName', label: '所属组织', width: 200},
            {prop: 'orgPathName', label: '组织全称', width: 300},
            {prop: 'employeeIdNumber', label: '证件号码', width: 200, align: 'center'},
            {prop: 'employeeType', label: '用工类型', display: {dict: 'EMPLOYEE_TYPE'}, width: 150},
            {prop: 'employeeStatus', label: '员工状态', display: {dict: 'EMPLOYEE_STATUS'}, width: 150},
            {prop: 'positionName', label: '职位', width: 200},
            {prop: 'hireDate', label: '入职时间', width: 200, align: 'center', display: {date: ''}}
            // {prop: '', label: '结束时间'}
          ],
          showPagebar: true,
          data: null,
          search: null,
          info: null,
          total: 0,
          setting: {
            export: {
              config: {
                fileName: '新签信息',
                sync: {
                  page: true,
                  select: true,
                  all: false
                }
              },
              req: config.getContractsSignList,
              key: 'empContNewSignExport'
            },
            import: {
              key: 'empContNewSignImport',  // 权限暂时和导出一致
              business: 'contract-sign'
            },
            operator: [{
              text: '新签',
              key: 'empContNewSignWf',
              func: (row) => this.newContract('empNewContractProcess', 'empNewContractProcess', row.empEmployeeId)
            }]
          }
        },
        contractLoading: false,
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
    //   this.listParams.pageIndex = 1
    //   this.listParams.pageSize = 10
    //   this.getContractsSignList(this.listParams)
    // },

    mounted () {
      this.search()
    },
    methods: {
      // 获取合同新签列表
      getContractsSignList (listParams) {
        this.contractLoading = true
        req('getContractsSignList', listParams)
        .then(data => {
          Object.keys(data).map(key => (this.table[key] = data[key]))
          this.contractLoading = false
        })
        .catch(err => {
          console.log(err)
          this.contractLoading = false
        })
      },

      handleSizeChange (options) {
        this.getContractsSignList(options)
      },

      handleCurrentChange (options) {
        this.getContractsSignList(options)
      },

      search () {
        this.table.search = { ...this.listParams }
      },

      reset () {
        // let arr = ['pageIndex', 'pageSize']
        Object.keys(this.listParams).map((item) => (this.listParams[item] = ''))
      },

      // 跳转到新签流程
      newContract (type, urlStr, id) {
        this.$store.commit('SET_FLOW_ACTION', { processType: type, employeeId: id })
        this.$store.commit('FLOW_WINDOW_OPEN', '/flow.html#/flow/' + urlStr)
      }
    }
  }
</script>
<style>

</style>
