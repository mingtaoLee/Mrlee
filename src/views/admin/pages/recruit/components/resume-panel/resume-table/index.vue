<template>
  <div class="table">
    <i-table
      :table="table"
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange">
      <template slot="table" slot-scope="tableScope">
        <el-table
          :data="table.data"
          v-loading="loading"
          :element-loading-text="$loadingText"
          @selection-change="handleSelectionChange">

          <el-table-column
            v-if="checkFlag"
            type="selection"
            fixed="left"
            width="40">
          </el-table-column>

          <el-table-column
            v-for="(col, idx) in table.columns || []"
            :key="idx"
            :prop="col.prop"
            :label="col.label"
            :align="col.align"
            :width="col.width"
            :min-width="col.minWidth"
            :fixed="col.fixed"
            :formatter="tableScope.formatter"
            :sortable="col.sortable">
          </el-table-column>
          <el-table-column
            prop="recommendMan"
            label="推荐人"
            align="center"
            v-if="checkIsRecommend()"
            show-overflow-tooltip>
          </el-table-column>
          <i-table-operator :table="tableScope" width="210"/>
          <!-- <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="200"
            v-if="operatorColumn">
            <template slot-scope="scope">
              <i-table-operator @accessControl="accessControl" :table="tableScope" :row="scope.row"></i-table-operator>
              <el-button
                type="text"
                v-if="checkCollection(scope.row)"
                @click="onCollection(scope.row)">收藏</el-button>
              <el-button
                type="text"
                v-if="checkCancelCollection(scope.row)"
                @click="onCancelCollection(scope.row)">取消收藏</el-button>
              <el-button type="text" @click="onViewResume(scope.row,scope.$index)">查看</el-button>
              <el-button
                type="text"
                v-if="!checkIsSelfEnter()"
                @click="updateResumeStatus(scope.row,scope.$index)">修改</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </template>
    </i-table>

    <!-- 导入 -->
    <i-upload-dialog
      :upload-api="`/recruit/resumes/import`"
      sample-url="/recruit/recruitTemplate/download"
      :can-visit.sync="isShowUploadDialog">
    </i-upload-dialog>

    <!-- 修改简历状态 -->
    <modify-status-dialog
      :isShow="isShowDialog"
      :value="dialogForm"
      @cancel="onCancelHandler"
      @confirm="onConfirmHandler">
    </modify-status-dialog>

    <!-- 发通知 -->
    <notification-dialog
      v-if="notificationDialogFlag"
      slot="section"
      notificationType="1"
      :showMe.sync="notificationDialogFlag"
      :notifyWho="notifyWho">
    </notification-dialog>
  </div>
</template>
<script>
import access from 'mixins/access'
import IUploadDialog from 'components/common/i-upload-dialog'
// import { showMessage } from 'utils/index'
import { ResumePageSource } from 'views/admin/pages/recruit/config'
import ModifyStatusDialog from '../modify-status-dialog'
import NotificationDialog from 'views/admin/pages/recruit/components/notification-dialog'
import req from 'api/recruit/index'
export default {
  name: 'ResumeTable',
  components: {
    IUploadDialog,
    ModifyStatusDialog,
    NotificationDialog
  },
  mixins: [access],
  props: {
    // 简历来源
    pageSource: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      checkFlag: false,
      // loading
      loading: false,
      // 是否显示导入弹窗
      isShowUploadDialog: false,
      // 是否显示修改简历弹窗
      isShowDialog: false,
      // 修改简历弹窗表单数据
      dialogForm: {
        resumeId: '',
        name: '',
        mobile: '',
        education: '',
        resumeStatus: ''
      },

      // 表格行选择数组
      selectList: [],
      // table
      table: {
        data: [],
        columns: [
          { prop: 'name', label: '姓名', fixed: 'left' },
          { prop: 'gender', label: '性别', display: { dict: 'GENDER' } },
          { prop: 'age', label: '年龄' },
          { prop: 'education', label: '学历', display: { dict: 'EDUCATIONAL_BACKGROUND' } },
          { prop: 'mobile', label: '手机号' },
          { prop: 'positionName', label: '最近应聘职位', width: 140 },
          { prop: 'resumeSource', label: '来源', display: { dict: 'RESUME_SOURCE' }, sortable: true },
          { prop: 'createDate', label: '创建时间', width: 140, display: { date: '' }, sortable: true },
          { prop: 'updateDate', label: '更新时间', width: 140, display: { date: '' }, sortable: true },
          { prop: 'resumeStatus', label: '状态', display: { dict: 'RESUME_STATUS' }, sortable: true }
        ],
        setting: {
          toolbar: [],
          operator: [{
            text: '收藏',
            key: 'rctResumeCollectPost',
            show: (row) => {
              if (!this.checkCollection(row)) {
                return {
                  empty: true
                }
              }
            },
            func: this.onCollection
          }, {
            text: '取消收藏',
            key: 'rctResumeCollectCancelPost',
            show: (row) => {
              if (!this.checkCancelCollection(row)) {
                return {
                  empty: true
                }
              }
            },
            func: this.onCancelCollection
          }, {
            text: '查看',
            key: 'rctResumeSelectGet',
            func: this.onViewResume
          }, {
            text: '修改简历状态',
            key: 'rctResumeUpdatePut',
            show: (row) => {
              if (this.checkIsSelfEnter(row)) {
                return {
                  empty: true
                }
              }
            },
            func: this.updateResumeStatus
          }]
        },
        info: {},
        search: null,
        total: 0, //  后台获取到的total个数
        showPagebar: true
      },
      // 是否显示发送通知弹窗
      notificationDialogFlag: false,
      // 发送通知对象
      notifyWho: null
    }
  },
  computed: {
    // 高级查询条件
    searchParam () {
      return this.$store.state.recruit.resumeSearchParam
    }
  },
  watch: {
    // 查询条件
    searchParam () {
      this.table.search = {...this.searchParam}
    },
    // 页面来源
    pageSource (val) {
      this.resetTotalData(parseInt(this.pageSource))
      this.table.search = {...this.searchParam}
    }
  },
  created () {
    // console.log(this.$route)
    if (this.$route.name === '简历库') {
      this.checkFlag = true
    } else {
      this.checkFlag = false
    }
    this.resetTotalData(parseInt(this.pageSource))
  },
  mounted () {
    this.table.search = {...this.searchParam}
    // this.getListHandler()
  },
  methods: {
    // 获取列表数据
    getListHandler (opt) {
      // console.log(this.searchParam)
      req('getResumeList', {
        ...opt,
        inType: this.pageSource
      }).then((res) => {
        this.table = Object.assign(this.table, res)
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    // 检查是否有推荐人
    checkIsRecommend () {
      return parseInt(this.pageSource) === ResumePageSource.RECOMMEND
    },
    // 发通知
    toOffer () {
      if (this.selectList.length === 0) {
        this.$message.error('请选择简历！')
      } else if (this.selectList.length === 1) {
        this.notifyWho = this.selectList[0]
        if (this.notifyWho.resumeStatus === '08') {
          this.$message.error('面试中,不能再发送邀约面试通知哦')
        } else if (this.notifyWho.resumeStatus === '14') {
          this.$message.error('录用中,不能再发送邀约面试通知哦')
        } else if (this.notifyWho.resumeStatus === '24') {
          this.$message.error('已报道,不能再发送邀约面试通知哦')
        } else {
          this.notificationDialogFlag = true
        }
      } else {
        this.$message.error('只能选择一份简历！')
      }
    },
    // 导入
    import () {
      this.isShowUploadDialog = true
    },
    // 修改简历状态
    updateResumeStatus (row, index) {
      this.dialogForm = {
        resumeId: row.resumeId,
        name: row.name,
        mobile: row.mobile,
        education: row.education ? row.education.toString() : '',
        resumeStatus: row.resumeStatus
      }
      this.isShowDialog = true
    },
    // 收藏
    onCollection (row) {
      let resumeId = row.resumeId

      this.$confirm('确定收藏该简历？').then(() => {
        req('collectResume', {resumeId}).then((res) => {
          this.$message({
            type: 'success',
            message: '收藏成功'
          })
          // this.getListHandler(this.table.info)
          this.table.search = {...this.searchParam}
        }).catch(err => console.log(err))
      }).catch(() => {})
    },
    // 取消收藏
    onCancelCollection (row) {
      let resumeId = row.resumeId

      this.$confirm('确定取消收藏该简历？').then(() => {
        req('cancelCollectResume', {resumeId}).then((res) => {
          this.$message({
            type: 'success',
            message: '取消收藏成功'
          })
          // this.getListHandler()
          this.table.search = {...this.searchParam}
        }).catch(err => console.log(err))
      }).catch(() => {})
    },
    // 查看简历
    onViewResume (row, index) {
      this.$store.commit('REMUSEDETAIL_WINDOW_OPEN', {source: this.pageSource, resumeId: row.resumeId})
    },
    // 检查是否收藏
    checkCollection (row) {
      if (parseInt(this.pageSource) === ResumePageSource.TOTAL || parseInt(this.pageSource) === ResumePageSource.CHANNEL || parseInt(this.pageSource) === ResumePageSource.DEMANDRELEASE) {
        if (row.isCollect === 'N') {
          return true
        }
      }

      return false
    },
    // 检查是否取消收藏
    checkCancelCollection (row) {
      if (parseInt(this.pageSource) === ResumePageSource.TOTAL || parseInt(this.pageSource) === ResumePageSource.COLLECTION || parseInt(this.pageSource) === ResumePageSource.CHANNEL || parseInt(this.pageSource) === ResumePageSource.DEMANDRELEASE) {
        if (row.isCollect === 'Y') {
          return true
        }
      }

      return false
    },
    // 页数改变
    handleSizeChange (opts) {
      // this.table.info.pageSize = opts.pageSize
      this.loading = true
      this.getListHandler(opts)
    },
    // 页码改变
    handleCurrentChange (opts) {
      // this.table.info.pageIndex = opts.pageIndex
      this.loading = true
      this.getListHandler(opts)
    },
    // 表格选择行
    handleSelectionChange (list) {
      this.selectList = list || []
    },
    // 取消
    onCancelHandler () {
      this.isShowDialog = false
    },
    // 确定
    onConfirmHandler (resumeId, status) {
      req('changeResumeStatus', {resumeId, status}).then((res) => {
        this.$message({
          type: 'success',
          message: '修改简历状态成功'
        })
        // this.getListHandler()
        this.table.search = {...this.searchParam}
        this.isShowDialog = false
      }).catch(err => console.log(err))
    },
    // 切换tab时重置
    resetTotalData (val) {
      // console.log(val)
      if (val === ResumePageSource.TOTAL || val === ResumePageSource.CHANNEL || val === ResumePageSource.DEMANDRELEASE) {
        this.table.setting.toolbar = [
          {
            text: '发通知',
            type: 'primary',
            key: 'rctNotificationPost',
            func: () => this.toOffer()
          },
          {
            text: '导入',
            type: 'success',
            key: 'rctResumeImport',
            func: () => this.import()
          }
        ]
      } else if (val === ResumePageSource.COLLECTION || val === ResumePageSource.RECOMMEND) {
        this.table.setting.toolbar = [
          {
            text: '发通知',
            type: 'primary',
            key: 'rctNotificationPost',
            func: () => this.toOffer()
          }
        ]
      } else {
        this.table.setting.toolbar = []
      }
    },
    // 检查是否是自助端进入
    checkIsSelfEnter () {
      let source = parseInt(this.pageSource)
      if (source === ResumePageSource.TOTAL ||
         source === ResumePageSource.COLLECTION ||
         source === ResumePageSource.RECOMMEND ||
         source === ResumePageSource.CHANNEL ||
         source === ResumePageSource.DEMANDRELEASE) {
        return false
      }
      return true
    }
  }
}
</script>
