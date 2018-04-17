<template>
  <div>
    <i-layout :borderWidth="0" :padding="0" :margin="0" headerKey="cpsEmpGroupHistoricalGet">
      <template slot="header">
        <i-form ref="iForm" @search="search" @reset="reset">
          <el-form-item label="工号">
            <el-input v-model="searchParam.employeeCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchParam.fullName"></el-input>
          </el-form-item>
          <el-form-item label="薪资组">
            <remote-select
              v-model="searchParam.groupId"
              :props="groupProps"
              :displayKeys="['groupCode', 'groupName']"
              dataKey="salaryGroup"
              placeholder="请输入代码或名称搜索"
            ></remote-select>
          </el-form-item>
          <el-form-item label="组织">
            <i-select-tree
              v-model="searchParam.orgUnitId"
              :multiple="false"
              dataKey="org"
              nodeKey="orgUnitId"
              size="small"
              lazy
            ></i-select-tree>
          </el-form-item>
          <el-form-item label="职位">
            <el-input v-model="searchParam.name"></el-input>
          </el-form-item>
          <el-form-item label="在职状态">
            <i-select v-model="searchParam.employeeStatus" parameter="EMPLOYEE_STATUS"></i-select>
          </el-form-item>
          <el-form-item label="生效开始日期">
            <el-date-picker
              v-model="searchParam.effectiveDateStart"
              type="date"
              :picker-options="effectStartOptions"
              @change="handleEffectiveDateStartChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="失效结束日期">
            <el-date-picker
              v-model="searchParam.effectiveDateEnd"
              type="date"
              :picker-options="effectEndOptions"
              @change="handleEffectiveDateEndChange"
            ></el-date-picker>
          </el-form-item>
        </i-form>
      </template>
      <template slot="section">
        <i-table
          ref="iTable"
          class="table"
          :table="table"
          @pageSizeChange="handleSizeChange"
          @pageIndexChange="handleCurrentChange"
        >
          <template slot="table" slot-scope="tableScope">
            <el-table
              v-loading="loading"
              :element-loading-text="$loadingText"
              :data="tableScope.clone"
              border
            >
              <el-table-column type="selection" fixed="left"></el-table-column>
              <el-table-column
                v-for="(col, idx) of table.columns"
                :key="idx"
                :prop="col.prop"
                :label="col.label"
                :minWidth="col.width"
                :align="col.align"
                :fixed="col.fixed"
                :sortable="col.sortable"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table>
          </template>
        </i-table>
      </template>
    </i-layout>
  </div>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import req, { config } from 'api/compensation/employee-info/salary-distribute'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin],
    components: {
      RemoteSelect
    },
    data () {
      return {
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        isShowDialog: false,
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', sortable: true, align: 'left', width: '120', fixed: 'left' },
            { prop: 'fullName', label: '姓名', width: '120', align: 'left', fixed: 'left' },
            { prop: 'groupName', label: '薪资组', align: 'left', width: '120' },
            { prop: 'orgUnitName', label: '组织', align: 'left', width: '120' },
            { prop: 'name', label: '职位', align: 'left', width: '120' },
            { prop: 'employeeStatus', label: '在职状态', align: 'left', width: '120', display: {dict: 'EMPLOYEE_STATUS'} },
            // { prop: 'orgPathName', label: '组织全称', width: '120', align: 'left' },
            { prop: 'costCenter', label: '成本中心', align: 'left', width: '120' },
            { prop: 'payCompany', label: '发薪主体', align: 'left', width: '120' },
            { prop: 'effectiveDate', label: '生效日期', align: 'left', width: '120', display: { date: '' } },
            { prop: 'uneffectiveDate', label: '失效日期', align: 'left', width: '120', display: { date: '' } }
          ],
          setting: {
            export: {
              config: {
                fileName: '薪资组分配历史记录'
              },
              key: 'cpsEmpGroupHistoricalExport',
              req: config.getHistoryDistributeGroups
            }
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          fullName: '',
          employeeCode: '',
          groupName: '',
          groupId: '',
          orgUnitId: '',
          employeeStatus: '',
          costCenter: '',
          payCompany: '',
          effectiveDateEnd: '',
          effectiveDateStart: ''
        }
      }
    },
    created () {
      this.$eventBus.$on('initLayout2', this.initLayout)
    },
    beforeDestroy () {
      this.$eventBus.$off('initLayout2', this.initLayout)
    },
    methods: {
      initLayout () {
        this.$refs.iForm && this.$refs.iForm.initLayout()
      },
      /** 获取列表数据 */
      fetch (options = {}) {
        this.load()
        req('getHistoryDistributeGroups', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
