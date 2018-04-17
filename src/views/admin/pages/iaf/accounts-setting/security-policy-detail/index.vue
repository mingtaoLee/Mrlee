<template>
  <i-layout header-key="cpsAccountAreaPolicySelectGet">
    <template slot="section">
      <i-table
        class="table"
        :table="table"
        ref="table"
        @save="getTableData"
        @pageSizeChange="handleSizeChange"
        @pageIndexChange="handleCurrentChange"
        v-loading="loading"
        :element-loading-text="$loadingText"
      >
        <template slot="table" slot-scope="tableScope">
          <el-table
            border
            :data="tableScope.clone"
            @selection-change="selectionChangeHandler(tableScope, $event)"
            v-loading="tableLoading"
            :element-loading-text="$loadingText"
          >
            <el-table-column
              label="保险类型"
              sortable
              prop="insuranceType"
              align="center"
              width="100"
              :formatter="tableScope.formatter"
            ></el-table-column>
            <el-table-column
              label="省份"
              sortable
              prop="provinceName"
              align="center"
              width="140"
            ></el-table-column>
            
            <el-table-column
              label="城市"
              sortable
              prop="cityName"
              align="center"
              width="140"
            ></el-table-column>
            <el-table-column
              label="区/县"
              sortable
              prop="countryName"
              align="center"
              width="140"
            ></el-table-column>
            <el-table-column
              label="户口性质"
              align="center"
              width="100"
              prop="householdCode"
              :formatter="tableScope.formatter"
            ></el-table-column>
            <el-table-column label="个人缴纳" align="center">
              <el-table-column
                label="基数上限"
                width="100"
                align="center"
                prop="empPayBaseLimit"
              ></el-table-column>
              <el-table-column
                label="基数下限"
                align="center"
                width="100"
                prop="empPayBaseLower"
              ></el-table-column>
              <el-table-column
                label="缴纳比例上限(%)"
                align="center"
                width="100"
                prop="empPayRatio"
              ></el-table-column>
              <el-table-column
                label="缴纳比例下限(%)"
                align="center"
                width="100"
                prop="empPayRatioMin"
              ></el-table-column>
              <el-table-column
                label="固定金额"
                align="center"
                width="100"
                prop="empPayFixedAmount"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column label="公司缴纳" align="center">
              <el-table-column
                label="基数上限"
                align="center"
                width="100"
                prop="compPayBaseLimit"
              ></el-table-column>
              <el-table-column
                align="center"
                width="100"
                label="基数下限"
                prop="compPayBaseLower"
              ></el-table-column>
              <el-table-column
                label="缴纳比例上限(%)"
                align="center"
                width="100"
                prop="compPayRatio"
              ></el-table-column>
              <el-table-column
                label="缴纳比例下限(%)"
                align="center"
                width="100"
                prop="compPayRatioMin"
              ></el-table-column>
              <el-table-column
                label="固定金额"
                align="center"
                width="100"
                prop="compPayFixedAmount"
                :formatter="tableScope.formatter"
              ></el-table-column>
            </el-table-column>
            <el-table-column
              label="生效日期"
              align="center"
              width="120"
              prop="effectiveDate"
              :formatter="tableScope.formatter"
            ></el-table-column>
            <el-table-column
              label="失效日期"
              align="center"
              width="120"
              prop="uneffectiveDate"
              :formatter="tableScope.formatter"
              :disabled="true"
            ></el-table-column>
          </el-table>
        </template>
      </i-table>
    </template>
  </i-layout>
</template>

<script>
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import req from 'api/iaf/company-rules'
  import ILayout from 'components/common/i-layout'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'

  export default {
    mixins: [PaginationMixin, SearchDateMixin],
    components: {
      ITable,
      ITableCell,
      ILayout
    },
    props: {
      areaId: String,
      effectiveDate: String,
      uneffectiveDate: new Date('9999-12-31')
    },
    data () {
      return {
        /* table */
        table: {
          columns: [
            {prop: 'insuranceType', display: { dict: 'INSURANCE_TYPE' }},
            {prop: 'householdCode', display: {dict: 'IAF_ACCOUNT_TYPE'}},
            {prop: 'effectiveDate', display: { date: '' }},
            {prop: 'empPayFixedAmount', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'compPayFixedAmount', display: { mixin: (row, col) => this.currencyFormat(row[col]) }},
            {prop: 'uneffectiveDate', display: { date: '' }}
          ],
          setting: {
            toolbar: [{
              text: '返回',
              type: 'plain',
              func: this.back
            }]
          },
          data: [],
          info: null,
          tableLoading: true,
          total: 0,
          search: null,
          showPagebar: true
        }
//        searchParam: {
//          insuranceType: '',
//          fullName: '',
//          householdCode: '',
//          areaId: '',
//          effectiveDate: null,
//          uneffectiveDate: null
//        }
      }
    },
    mounted () {
      this.table.search = { effectiveDate: this.effectiveDate }
    },
    methods: {
      fetch (options = {}) {
        this.tableLoading = true
        req('getSecurityPolicyDetail', Object.assign(options, {areaId: this.areaId})).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.tableLoading = false
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.tableLoading = false
          this.loading = false
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
