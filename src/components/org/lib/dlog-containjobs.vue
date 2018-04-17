<template>
  <i-dialog 
  title="包含标准职位"
  v-model="visible"
  class="i-dialog-width-700"
  :toolbar="dialogToolbar"
  @close="closeDialog"
  >
    <i-table :table="table" @save="getTableData">
      <template slot="table" slot-scope="tableScope">
        <el-table
          border
          :data="tableScope.clone"
          highlight-current-row
          @selection-change="selectionChangeHandler(tableScope, $event)"
          @current-change="handleCurrentChange"
          @row-click="rowClickHandler(tableScope, $event)">
          <el-table-column
            v-for="(col, idx) of table.columns || []"
            :key="idx"
            :prop="col.prop"
            :formatter="tableScope.formatter"
            :label="col.label"
            :width="col.width"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </template>
    </i-table>

      <!-- <el-pagination
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="5"
        class="center"
        @current-change="pageChange">
      </el-pagination> -->
    </i-dialog>
</template>

<script>
import req from 'api/org/lib'
import ITable from 'components/common/i-table'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
export default{
  name: 'DlogContainJobs',
  components: {
    ITable,
    IDialog
  },
  props: {
    value: Boolean,
    containJobsId: String
  },
  data () {
    return {
      table: {
        title: '',     // 标题【可选】
        columns: [         // 表头【必填】
          {
            prop: 'name',
            label: '标准职位名称',
            width: '120'
          },
          {
            prop: 'posJobFamilyName',
            label: '所属职群',
            width: '120'
          },
          {
            prop: 'jobClassName',
            label: '所属职种',
            width: '120'
          },
          {
            prop: 'subJobClassName',
            label: '所属子职种',
            width: '120'
          },
          {
            prop: 'posTitleName',
            label: '职务',
            width: '120'
          },
          {
            prop: 'categoryName',
            label: '品类',
            width: '120'
          }
        ],
        info: {},
        showPagebar: true,
        data: null   // 占位符，用于挂载数据【必填】
      },
      dialogToolbar: [
        {
          text: '返回',
          type: 'defalut',
          func: done => {
            this.cancel(done)
          }
        }
      ],
      containJobs: [],
      formLabelWidth: '120',
      visible: false
      // total: 1,
      // currentPage: 1,
      // pageSize: 5
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.getContainOrg(this.currentPage)
      }
      this.visible = this.value
    }
  },
  methods: {
    closeDialog () {
      this.$emit('input', false)
      this.$emit('addClose')
    },
    cancel (done) {
      done()
      this.closeDialog()
    },
    getTableData (data) {
      const shouldPost = !!Object.keys(data).find(
        method => data[method].length !== 0
      )

      this.postList = shouldPost ? data : {}
    },
    getContainOrg (currentPage) {
      req('containJobs', {id: this.containJobsId, pageIndex: currentPage, pageSize: this.pageSize}).then(data => {
        Object.assign(this.table, data)
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '获取失败'
        })
      })
    },
    pageChange (currentPage) {
      this.currentPage = currentPage
      this.getContainOrg(currentPage)
    }
  }
}
</script>
