<template>
  <div>
    <i-layout :borderWidth="0" :padding="0" :margin="0" headerKey="cpsEmpGroupPertranGet">
      <template slot="header">
        <i-form @search="search" @reset="reset">
          <el-form-item label="工号">
            <el-input v-model="searchParam.employeeCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchParam.fullName"></el-input>
          </el-form-item>
          <el-form-item label="组织名称">
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
          <el-form-item label="当前状态">
            <i-select v-model="searchParam.transferStatus" parameter="TRANSFER_STATUS"></i-select>
          </el-form-item>
          <el-form-item label="生效开始日期">
            <el-date-picker
              v-model="searchParam.effectiveDateStart"
              type="date"
              :picker-options="effectStartOptions"
              @change="handleEffectiveDateStartChange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="生效结束日期">
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
          ref="table"
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
                :formatter="tableScope.formatter"
              >
              </el-table-column>
            </el-table>
          </template>
        </i-table>
      </template>
    </i-layout>
  </div>
</template>

<script>
  import ILayout from 'components/common/i-layout'
  import req, { config } from 'api/compensation/employee-info/salary-distribute'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'

  export default {
    components: {
      ILayout
    },
    mixins: [PaginationMixin, SearchDateMixin],
    data () {
      return {
        isShowDialog: false,

        /* table */
        table: {
          columns: [
            { prop: 'employeeCode', label: '工号', align: 'center', width: '120', fixed: 'left' },
            { prop: 'fullName', label: '姓名', align: 'left', width: '120', fixed: 'left' },
            { prop: 'orgUnitName', label: '组织名称', align: 'left', width: '120' },
            { prop: 'transferinGroup', label: '调入薪资组', width: '120', align: 'left' },
            { prop: 'transferoutGroup', label: '调出薪资组', width: '120', align: 'left' },
            { prop: 'name', label: '职位', align: 'left', width: '120' },
            { prop: 'employeeStatus', label: '在职状态', align: 'left', width: '120', display: {dict: 'EMPLOYEE_STATUS'} },
            { prop: 'transferStatus', label: '当前状态', align: 'left', width: '100', display: {dict: 'TRANSFER_STATUS'} },
            { prop: 'transferoutDate', label: '生效日期', align: 'left', width: '120', display: { date: '' } }
          ],
          setting: {
            export: {
              config: {
                fileName: '已调出薪资组人员'
              },
              key: 'cpsEmpGroupPertranExport',
              req: config.getTuneOutEmps
            }
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {
          name: '',
          fullName: '',
          employeeCode: '',
          orgUnitId: '',
          employeeStatus: '',
          transferStatus: '',
          effectiveDateEnd: '',
          effectiveDateStart: ''
        }
      }
    },
    methods: {
      /** 获取调出人员数据 */
      fetch (options = {}) {
        this.load()
        req('getTuneOutEmps', options).then(res => {
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
