<template>
  <el-form ref="form" v-loading="detailLoading" :element-loading-text="$loadingText" class="zzf-security-policy-detail-edit" labelWidth="120px" v-cloak>
      <el-table
        :data="detailData"
      >
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          label="项目"
          prop="label"
        ></el-table-column>
        <el-table-column
          label="单价"
          prop="price"
          align="right"
        ></el-table-column>
      </el-table>
  </el-form>
</template>
<script>
  import req from 'api/compensation/data-collection/cashier-performance'
  import moment from 'moment'
  export default {
    props: {
      detailData: {
        type: Array,
        default () {
          return []
        }
      },
      row: {
        type: Object,
        default: ''
      }
    },
    data () {
      return {detailLoading: true}
    },
    created () {
      this.getCashierDetails(this.row)
    },
    methods: {
      getCashierDetails (row) {
        const checkMonthDetails = moment(row.checkMonth).format('YYYYMM')
        req('getCashierDetails', { empEmployeeId: row.empEmployeeId, employeeCode: row.employeeCode, checkMonth: checkMonthDetails }).then(res => {
          if (res) {
            this.detailData = res
            this.detailLoading = false
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
</style>
