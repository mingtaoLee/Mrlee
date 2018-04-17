<template>
 <i-dialog
    title="标准职位列表"
    v-model="visible"
    :toolbar="dialogToolbar"
    size="large"
    class="i-dialog-width-900"
    @close="closeDialog">
    <i-form
      @reset="resetSearcher" 
      @search="submitSearcher()" 
      ref="iForm">
      <el-form-item>
        <span slot="label">标准职位</span>
        <el-input v-model="search.standardJobName" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label">状态</span>
        <i-select
          v-model="search.status"
          parameter="POSITION_STATUS"
          clearable/>
      </el-form-item>
      <el-form-item>
        <span slot="label">所属职群</span>
        <el-input v-model="search.posJobFamilyName" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item>
        <span slot="label">所属职种</span>
        <el-input v-model="search.jobClassName" maxlength="20"></el-input>
      </el-form-item>
    </i-form>
    <i-table
      ref="iTable"
      :table="table"
      @pageSizeChange="pageChange"
      @pageIndexChange="pageChange"
      @save="getTableData">
        <template slot="table" slot-scope="tableScope">
          <el-table
            :data="tableData"
            highlight-current-row
            ref="multipleTable"
            max-height="250"
            @select="select"
            @select-all="selectAll">
            <el-table-column
              type="selection"
              v-model="multipleSelection"
              fixed="left"/>
            <el-table-column
              v-for="(col, idx) of table.columns || []"
              :key="idx"
              :prop="col.prop"
              :align="col.align"
              :formatter="tableScope.formatter"
              :label="col.label"
              :width="col.width"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </template>
    </i-table>

    <el-tag
      class="tags"
      :key="tag.posStandardJobId"
      type="info"
      v-for="tag in jobArray"
      :closable="true"
      :close-transition="false"
      @close="handleCloseJobs(tag)"
    >
    {{tag.name}}
    </el-tag>
  </i-dialog>
</template>

<script>
import req from 'api/org/lib'
import ITable from 'components/common/i-table'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
import IForm from 'components/common/i-form/i-form'
import ISelect from 'components/common/i-select/i-select'
import {clone} from 'utils/index'
import { windowOpen } from 'utils'
export default {
  name: 'DlogJobs',
  props: {
    value: Boolean,
    jobArray: Array
  },
  components: {
    ITable,
    IDialog,
    IForm,
    ISelect
  },
  data () {
    return {
      tableData: [],
      table: {
        columns: [
          {
            prop: 'name',
            label: '标准组织名称'
          },
          {
            prop: 'posJobFamilyName',
            label: '所属职群',
            align: 'center'
          },
          {
            prop: 'jobClassName',
            label: '所属职种',
            align: 'center'
          },
          {
            prop: 'status',
            label: '状态',
            align: 'center',
            display: {dict: 'POSITION_STATUS'}
          },
          {
            prop: 'remark',
            label: '备注'
          }
        ],
        setting: {        // 可编辑表格的相关设置【可选】
          toolbar: [
            {
              text: '新增标准职位',
              func: this.addPosStandardJob
            }
          ]     // 工具栏【可选】
        },
        data: null,   // 占位符，用于挂载数据【必填】
        info: {},
        showPagebar: true
      },
      dialogToolbar: [
        {
          text: '取消',
          type: 'defalut',
          func: done => {
            this.cancel(done)
          }
        },
        {
          text: '确定',
          func: done => {
            this.confirm(done)
          }
        }
      ],
      multipleSelection: [],
      search: {
        standardJobName: '',
        status: '',
        posJobFamilyName: '',
        jobClassName: ''
      },
      visible: false
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.init()
      }
      this.visible = this.value
    }
  },
  methods: {
    isContained () {
      console.log(this)
      this.$nextTick(() => {
        this.jobArray.forEach(job => {
          this.tableData.forEach(data => {
            if (job.posStandardJobId === data.posStandardJobId) {
              this.$refs.multipleTable.toggleRowSelection(data)
            }
          })
        })
      })
    },
    closeDialog () {
      this.$emit('input', false)
    },
    confirm () {
      this.$emit('receiveCodes', this.jobArray)
      this.closeDialog()
    },
    cancel () {
      this.jobArray = this.cacheJobArray
      this.confirm()
    },
    init () {
      this.cacheJobArray = clone(this.jobArray)
      this.$nextTick(() => {
        this.$refs.iTable.pageIndexChangeHandler(1)
        this.$refs.iForm.initLayout()
      })
    },
    addPosStandardJob () {
      windowOpen('/#/org/position/standard_oc')
      window.formConfirm = function (bool) {
        if (bool) {
          this.getJobsList(1)
        }
      }
    },
    submitSearcher () {
      this.getJobsList(1)
    },
    resetSearcher () {
      this.search = {standardJobName: '', status: ''}
    },
    handleCloseJobs (tag) {
      this.jobArray.splice(this.jobArray.indexOf(tag), 1)
      this.getJobsList(this.currentPage)
    },
    getJobsList (option = {}) {
      req('jobs', Object.assign(option, {standardJobName: this.search.standardJobName, status: this.search.status, posJobFamilyName: this.search.posJobFamilyName, jobClassName: this.search.jobClassName})).then(data => {
        this.tableData = data.data
        Object.assign(this.table, data)
        this.isContained()
      }).catch(() => {
        this.$message.warning('获取失败')
      })
    },
    select (selection, row) {
      let len = this.jobArray.length
      while (len--) {
        if (this.jobArray[len].posStandardJobId === row.posStandardJobId) {
          this.jobArray.splice(len, 1)
          return
        }
      }
      this.jobArray.push({posStandardJobId: row.posStandardJobId, name: row.name})
    },
    selectAll (selection) {
      if (selection.length) {
        selection.forEach(select => {
          let flag = true
          let len = this.jobArray.length
          while (len--) {
            if (this.jobArray[len].posStandardJobId === select.posStandardJobId) {
              flag = false
              break
            }
          }
          if (flag === true) {
            this.jobArray.push({posStandardJobId: select.posStandardJobId, name: select.name})
          }
        })
        return
      }
      this.tableData.forEach(data => {
        this.jobArray.forEach((job, index) => {
          if (job.posStandardJobId === data.posStandardJobId) {
            this.jobArray.splice(index, 1)
          }
        })
      })
    },
    pageChange (page) {
      this.getJobsList(page)
    }
  }
}
</script>
<style lang="scss" scoped>
  .tags {
    margin-top: 10px;
  }
</style>
