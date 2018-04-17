<template>
<div>
  <i-layout headerKey="orgPosTitle">
    <i-form
      slot="header"
      @reset="reset"
      @search="search">
      <el-form-item label="职务名称">
        <el-input v-model="searchBox.name" maxlength="20" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="职务编码">
        <el-input v-model="searchBox.code" maxlength="20" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="职务类别">
        <i-select v-model="searchBox.titleType" parameter="TITLE_TYPE" clearable placeholder="请选择"></i-select>
      </el-form-item>
      <el-form-item>
        <span slot="label">职务状态</span>
        <i-select v-model="searchBox.status" parameter="POSITION_STATUS" clearable placeholder="请选择"></i-select>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="searchBox.startEffectiveDate"
          type="date"
          :editable="false"
          @change="monitor"
          ref="startEffectiveDate"
          placeholder="请选择"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="endDate"
          type="date"
          :editable="false"
          @change="addDate"
          ref="endEffectiveDate"
          placeholder="请选择"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
    </i-form>
    <i-table
      slot="section"
      :table="table"
      @pageIndexChange="handleCurrentChange"
      @pageSizeChange="handleSizeChange"
    >
      <template slot="table" slot-scope="tableScope">
        <el-table
          ref="multipleTable"
          :data="tableScope.clone"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="positionLoading"
          :element-loading-text="$loadingText">
          <el-table-column
            type="selection"
            fixed="left"
            show-overflow-tooltip
          />
          <el-table-column
            prop="name"
            label="职务名称"
            align="left"
            min-width="150"
            show-overflow-tooltip
          >
          <template slot-scope="scope">
            <i-table-cell
              :row="scope.row"
              col="name"
              :table="tableScope"
            />
          </template>
          </el-table-column>
          <el-table-column
            prop="code"
            label="职务编码"
            align="left"
            show-overflow-tooltip
          />
          <el-table-column
            :formatter="tableScope.formatter"
            prop="titleType"
            label="职务类别"
            align="left"
            show-overflow-tooltip
          />
          <el-table-column
            :formatter="tableScope.formatter"
            prop="effectiveDate"
            label="生效日期"
            align="left"
            show-overflow-tooltip
          />
          <el-table-column
            :formatter="tableScope.formatter"
            prop="uneffectiveDate"
            label="失效日期"
            align="left"
            show-overflow-tooltip
          />
          <el-table-column
            prop="status"
            label="状态"
            align="left"
            :formatter="tableScope.formatter"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <status-control :scope="scope" :tableScope="tableScope" bussinessKey="posTitleId"></status-control>
            </template>
          </el-table-column>
          <el-table-column
            prop="lastUpdateCode"
            label="操作人工号"
            align="left"
            show-overflow-tooltip
          />
          <el-table-column
            prop="lastUpdateBy"
            label="操作人姓名"
            align="left"
            show-overflow-tooltip
          />
          <el-table-column
            prop="lastUpdateDate"
            label="操作时间"
            :formatter="tableScope.formatter"
            align="left"
            show-overflow-tooltip
          />
          <i-table-operator :table="tableScope" scope/>
        </el-table>
      </template>
    </i-table>
  </i-layout>

  <check-job-title-details ref="checkDetails" name="职务" :column="column"></check-job-title-details>

</div>

</template>

<script>
  import IForm from 'components/common/i-form/i-form.vue'
  import ISelect from 'components/common/i-select/i-select.vue'
  import req, {config} from 'api/position/position-job'
  import moment from 'moment'
  import {windowOpen} from 'utils/index'
  import StatusControl from './status-control'
  import date from './mixins/date'
  import tableHadle from './mixins/table-handle'
  import access from 'mixins/access'
  import CheckJobTitleDetails from './components/check-job-title-details'

  export default {
    name: 'PositionJob',
    components: {
      IForm,
      ISelect,
      StatusControl,
      CheckJobTitleDetails
    },
    mixins: [date, tableHadle, access],
    data () {
      return {
        // 展示详情的信息
        showDialog: false,
        column: {},
        // 表格的loading
        positionLoading: false,
        // 保存已选择的职务
        selectedPosTitleIds: [],
        // 搜索组件的条件
        searchBox: {
          name: '',
          code: '',
          titleType: '',
          startEffectiveDate: '',
          status: '',
          endEffectiveDate: ''
        },
        // 表格的配置
        table: {
          columns: [
            { prop: 'titleType', display: { dict: 'TITLE_TYPE' } },
            { prop: 'status', display: { dict: 'POSITION_STATUS' } },
            { prop: 'effectiveDate', display: { date: '' } },
            { prop: 'uneffectiveDate', display: { date: '' } },
            { prop: 'lastUpdateDate', display: { date: '' } }
          ],
          data: null,
          showPagebar: true,
          total: 0,
          info: null,
          search: '',
          setting: {
            editor: {
              name: {
                type: 'button',
                func: (row, col) => this.showDetails(row)
              }
            },
            operator: [{
              text: '修改',
              key: 'orgPosTitleUpdate',
              func: scope => this.modify(scope)
            }, {
              text: '撤销',
              key: 'orgPosTitleRepeal',
              func: scope => this.cancel(scope)
            }],
            toolbar: [
              {
                text: '新增',
                key: 'orgPosTitleCreate',
                func: () => this.newOc()
              },
              {
                text: '删除',
                key: 'orgPosTitleDel',
                type: 'danger',
                func: () => this.deleteOc()
              }
            ],
            export: {
              text: '导出',              // 可选（不合规范，不推荐填写）
              key: 'orgPosTitleExport',
              config: {                      // 可选
                fileName: '职务列表'            // 默认文件名
              // version: '',              // 默认后缀
              // range: '',                // 默认范围
              // sync: true                // 默认方式（同步/异步）
              },
              req: config.getPosJobList,        // 必填
              elTable: null                  // 必填
            }
          }
        }
      }
    },
    methods: {
      // 保存选择的职务
      handleSelectionChange (c) {
        this.selectedPosTitleIds = []
        c.map(ele => {
          if (!this.selectedPosTitleIds.includes(ele.posTitleId)) {
            this.selectedPosTitleIds.push(ele.posTitleId)
          }
        })
      },
      // 跳转到新建页面
      newOc () {
        let url = '/flow.html#/flow/posTitleCreateProcess'
        let params = {
          operationType: 0,
          processType: 'posTitleCreateProcess'
        }
        this.pageJump(url, params)
      },
      // 删除职务
      deleteOc () {
        var that = this
        if (this.selectedPosTitleIds.length === 0) {
          return this.$message({
            message: '请先选择职务',
            type: 'warning'
          })
        }
        let params = {
          posTitleIds: that.selectedPosTitleIds.join(',')
        }
        req('checkDeleteTitle', params).then(res => {
          if (res) {
            this.$confirm('此操作将永久删除职务, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let params = {
                posTitleIds: that.selectedPosTitleIds.join(',')
              }
              req('deleteTitle', params).then(res => {
                if (res) {
                  that.$alert('删除成功！', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      that.fetch()
                    }
                  })
                }
              })
            }).catch(() => {
              that.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          }
        })
      },
      // 跳转到修改页面
      modify (scope) {
        const warnInfo = str => this.$message.warning(str)
        const isDisabled = Number(scope.row.status) === 0 || Number(scope.row.status) === 2
        let url = '/flow.html#/flow/posTitleUpdateProcess'
        let params = {
          operationType: 1,
          posTitleId: scope.row.posTitleId,
          processType: 'posTitleUpdateProcess'
        }
        isDisabled ? warnInfo('非启用状态下不允许修改职务') : this.pageJump(url, params)
      },
      // 跳转到撤销页面
      cancel (scope) {
        const warnInfo = str => this.$message.warning(str)
        const isDisabled = Number(scope.row.status) === 0 || Number(scope.row.status) === 2
        let url = '/flow.html#/flow/posTitleRepealProcess'
        let params = {
          operationType: 2,
          posTitleId: scope.row.posTitleId,
          processType: 'posTitleRepealProcess'
        }
        isDisabled ? warnInfo('非启用状态下不允许撤销职务') : this.pageJump(url, params)
      },
      // 页面跳转
      pageJump (url, params) {
        windowOpen(url, params)
      },
      // 高级搜索
      fetch (params = {}) {
        this.positionLoading = true
        req('getPosJobList', params).then(res => {
          res.data = res.data.map(item => {
            item.effectiveDate = moment(item.effectiveDate).format('YYYY-MM-DD')
            return item
          });
          ({ info: this.table.info, data: this.table.data, total: this.table.total } = { ...res })
          this.positionLoading = false
        })
      },
      // 展示职务详情
      showDetails (row) {
        let passRow = JSON.parse(JSON.stringify(row))
        this.$d('POSITION_STATUS', passRow.status).then(
          status => {
            passRow.status = status
            passRow.lastUpdateDate && (passRow.lastUpdateDate = moment(passRow.lastUpdateDate).format('YYYY-MM-DD'))
            this.column = passRow
            this.$refs.checkDetails.openDialog()
          }
        )
      }
    },
    mounted () {
      this.table.setting.export.elTable = this.$refs.multipleTable
      this.table.search = {}
    },
    created () {

    }
  }
</script>

<style lang="scss" scoped>
</style>
