<template>
  <i-layout>
    <template slot="header">
      <i-form @search="search" @reset="reset">
        <el-form-item label="工号">
          <el-input v-model="searchParam.employeeCode"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchParam.fullName"></el-input>
        </el-form-item>
        <el-form-item label="薪资组">
          <remote-select
            v-model="searchParam.groupId"
            dataKey="salaryGroup"
            placeholder="请输入代码或名称搜索"
            :displayKeys="['groupCode', 'groupName']"
            :props="groupProps"
          ></remote-select>
        </el-form-item>
        <el-form-item label="组织名称">
          <i-select-tree
            v-model="searchParam.orgUnitId"
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            size="small"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="职种">
          <i-select-tree
            v-model="searchParam.posJobFamilyId"
            :multiple="false"
            dataKey="jobFamilys"
            nodeKey="posJobFamilyId"
            size="small"
            :props="jobFamilysProps"
            :lazy="false"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="searchParam.name"></el-input>
        </el-form-item>
        <el-form-item label="生效开始时间">
          <el-date-picker
            v-model="searchParam.effectiveDateStart"
            type="date"
            :picker-options="effectStartOptions"
            @change="handleEffectiveDateStartChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效结束时间">
          <el-date-picker
            v-model="searchParam.effectiveDateEnd"
            type="date"
            :picker-options="effectEndOptions"
            @change="handleEffectiveDateEndChange"
          >
          </el-date-picker>
        </el-form-item>
      </i-form>
    </template>
    <template slot="section">
      <i-table
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
            <el-table-column
              v-for="(col, idx) of table.columns"
              :key="idx"
              :prop="col.prop"
              :label="col.label"
              :minWidth="col.width"
              :align="col.align"
              :sortable="col.sortable"
              :formatter="tableScope.formatter"
            >
            </el-table-column>
          </el-table>
        </template>
      </i-table>
    </template>
  </i-layout>
</template>

<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import ILayout from 'components/common/i-layout'
  import req, { config } from 'api/compensation/employee-info/hours-salary'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin],
    components: {
      ILayout,
      RemoteSelect
    },
    data () {
      return {
        // 职种选项配置
        jobFamilysProps: {
          children: 'children',
          label: 'name'
        },
        // 薪资组选择器配置
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        isShowDialog: false,

        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', sortable: true, align: 'center', width: '120' },
            { prop: 'fullName', label: '姓名', width: '120', align: 'left' },
            { prop: 'groupName', label: '薪资组', width: '120', align: 'left' },
            { prop: 'orgUnitName', label: '组织名称', width: '160', align: 'left' },
            { prop: 'name', label: '职位', width: '160', align: 'left' },
            { prop: 'jobClassName', label: '职种', width: '140', align: 'left' },
            { prop: 'hourStandard', label: '时薪标准（元/小时）', align: 'right', width: '140', display: { mixin: (row, col) => this.currencyFormat(row[col]) } },
            { prop: 'extraHourstd', label: '额外时薪（元/小时）', align: 'right', width: '140' },
            { prop: 'subsidies', label: '补贴', width: '120', align: 'right' },
            { prop: 'effectiveDate', label: '生效日期', align: 'center', width: '120', display: { date: '' } },
            { prop: 'uneffectiveDate', label: '失效日期', align: 'center', width: '120', display: { date: '' } }
          ],
          setting: {
            export: {
              key: 'cpsEmpPayHourempExport',
              req: config.getHoursSalaryList
            },
            import: {
              key: 'cpsEmpPayHourempImport',
              business: 'import',
              show: () => ({ empty: false })
            },
            toolbar: [{
              text: '调薪历史查询',
              key: 'cpsEmpPayHourempHistoryGet',
              func: this.openHoursSalaryHistoryPage
            }]
          },
          data: [],
          info: null,
          search: null,
          total: 0,
          showPagebar: true
        },
        searchParam: {
          fullName: '',
          posJobFamilyId: '',
          employeeCode: '',
          name: '',
          groupName: '',
          groupId: '',
          orgUnitId: '',
          effectiveDateStart: '',
          effectiveDateEnd: ''
        }
      }
    },
    methods: {
      /** 获取小时工工资标准列表 */
      fetch (options = {}) {
        this.load()
        req('getHoursSalaryList', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
      },

      /** 打开小时工资标准历史页面 */
      openHoursSalaryHistoryPage () {
        this.$router.push({ path: '/compensation/employee-info/hours-salary-history' })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn {
    margin-top: 10px;
  }
</style>
