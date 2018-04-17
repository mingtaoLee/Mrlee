<template>
  <el-form
    v-loading="loading"
    :element-loading-text="$loadingText"
    class="zzf-security-policy-detail-edit"
    labelWidth="120px"
    :model="data"
    :rules="rules"
    v-cloak
  >
      <el-table
        :data="table.data"
      >
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="60">
        </el-table-column>
        <el-table-column
          label="方案名称"
          align="center"
          prop="planName"
        >
        </el-table-column>
        <el-table-column
          label="金额"
          prop="planValue"
          align="center"
        >
        </el-table-column>
      </el-table>
  </el-form>
</template>
<script>
  import req from 'api/compensation/data-collection/short-term-incentive'
  export default {
    props: {
      data: {
        type: Object,
        default: () => {}
      },
      id: {
        type: String
      }
    },
    data: () => {
      return {
        loading: true,
        table: {
//          columns: [
//            { prop: 'planName', label: '方案', align: 'center', width: '140' },
//            { prop: 'planValue', label: '金额', align: 'center', width: '140' }
//          ],
//          setting: {
//          },
          data: [
          ],
          info: null,
          total: 0,
          showPagebar: false
        }
      }
    },
    created () {
      this.getBestirsById(this.id)
    },
    methods: {
      getBestirsById (id) {
        return req('getBestirsById', { id }).then(res => {
          if (res) {
            this.table.data = res.bestirInfoDto
            this.loading = false
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      /*width: 100%;*/
    }
  }
</style>
