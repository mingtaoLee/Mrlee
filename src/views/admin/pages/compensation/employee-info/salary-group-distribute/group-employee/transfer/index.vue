<template>
  <i-table
    v-loading="loading"
    :element-loading-text="$loadingText"
    ref="iTable"
    class="table mb20"
    :table="table"
    @pageSizeChange="handleSizeChange"
    @pageIndexChange="handleCurrentChange"
  >
    <template slot="table" slot-scope="tableScope">
      <el-table
        ref="elTable"
        :data="tableScope.clone"
        border
        @selection-change="selectionChangeHandler(tableScope, $event)">
        <el-table-column :formatter="selectionFormatter" type="selection">
        </el-table-column>
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
<script>
  import req from 'api/compensation/employee-info/salary-distribute'
  import { showMessage } from 'utils/index'
  import PaginationMixin from 'mixins/compensation/pagination-mixin'
  import SearchDateMixin from 'mixins/compensation/search-date-mixin'
  export default {
    mixins: [PaginationMixin, SearchDateMixin],
    data: function () {
      return {
        instance: null,
        // table
        table: {
          columns: [
            { prop: 'transferinGroup', sortable: true, label: '调入薪资组', width: '120', align: 'left' },
            { prop: 'transferoutGroup', label: '调出薪资组', width: '120', align: 'left' },
            { prop: 'employeeCode', label: '工号', align: 'center', width: '120' },
            { prop: 'fullName', label: '姓名', align: 'left', width: '120' },
            { prop: 'orgUnitName', label: '组织名称', align: 'left', width: '160' },
            { prop: 'name', label: '职位', align: 'left', width: '120' },
            { prop: 'effectiveDate', label: '生效日期', align: 'center', width: '120', display: {date: 'default'} }

          ],
          setting: {
            toolbar: [{
              text: '全部调入',
              key: 'cpsEmpGroupTransferinAllPut',
              func: this.transferAll
            }, {
              text: '调入已选人员',
              key: 'cpsEmpGroupTransferinPut',
              func: this.transfer
            }]
          },
          data: [],
          info: null,
          total: 0,
          search: null,
          showPagebar: true
        },
        searchParam: {}
      }
    },
    methods: {
      /** 初始化默认选择项 */
      initSelected (iTable) {
        this.$nextTick(() => {
          iTable.clone.forEach(item => {
            this.$refs.elTable.toggleRowSelection(item)
          })
        })
      },
      fetch (options = {}) {
        this.load()
        req('getTransferinEmps', options).then(res => {
          Object.keys(res).map(key => {
            this.table[key] = res[key]
          })
          this.loaded()
        })
      },

      /** 全部调入 */
      transferAll () {
        if (this.table.data.length === 0) {
          showMessage('warning', '已全部调出！')
          return
        }
        this.submitData('putAllTransferinEmps').then(res => {
          if (res) {
            showMessage('success', '全部调入成功！')
            this.$root.$emit('closeTransferDialog')
            this.$root.$emit('fetch')
          }
        })
      },

      /** 调入已选选项 */
      transfer () {
        this.selected = this.$refs['iTable'].getMultipleSelection()
        if (this.selected.length === 0) {
          showMessage('info', '请选择要调入的人员！')
        } else {
          this.submitData('putTransferinEmps', this.selected).then(res => {
            if (res) {
              showMessage('success', '调入成功！')
              this.fetch(this.allParam)
            }
          })
        }
      },

      /** 关闭弹窗 */
      closeDialog () {
        this.$parent.isTransfer = false
      },

      /** 提交数据 */
      submitData (funcName, selected) {
        const submitData = this.selected ? this.transformSubmitData(selected) : {}
        return new Promise(resolve => {
          req(funcName, submitData).then(res => {
            resolve(res)
          })
        })
      },

      /** 提交数据转换 */
      transformSubmitData (selected) {
        return selected.map(item => {
          return item.groupTransferId
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
