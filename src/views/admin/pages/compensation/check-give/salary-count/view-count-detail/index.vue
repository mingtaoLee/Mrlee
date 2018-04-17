<template>
  <section class="salary-confirm-datail">
    <!-- 工资计算明细 -->
      <i-layout v-loading="loading" :element-loading-text="$loadingText"
      headerKey="payGroupcalculateGroupCalculateIdRecordsPost">
        <span slot="section-title">
          <template>
            <el-row>
              <el-col :span="3">
                <div class="item">
                  <span class="key">核算月份：</span>
                  <span class="value">{{listParams.payMonth || '无'}}</span>
                </div>
              </el-col>

             <el-col :span="4">
              <div class="item salary">
                <span class="key">薪资组：</span>
                <span class="value">{{listParams.groupName || '无'}}</span>
              </div>
            </el-col>

            <el-col :span="3">
              <div class="item salary">
                <span class="key">薪资组代码：</span>
                <span class="value">{{listParams.groupCode || '无'}}</span>
              </div>
            </el-col>

            <el-col :span="4">
              <div class="item">
                <span class="key">工资类型：</span>
                <span class="value">{{listParams.componentListType || '无'}}</span>
              </div>
            </el-col>

           <el-col :span="3">
             <div class="item">
               <span class="key">状态：</span>
               <span class="value">{{listParams.calculateStatus || '无'}}</span>
             </div>
           </el-col>

            <el-col :span="3">
              <div class="item">
                <span class="key">人数：</span>
                <span class="value">{{listParams.totalNumber || '无'}}</span>
              </div>
            </el-col>

            <el-col :span="3">
              <div class="item">
                <span class="key">实发总额：</span>
                <span class="value">{{listParams.finalPayingAmount || '无'}}</span>
              </div>
            </el-col>
          </el-row>
        </template>
      </span>

      <div slot="section" >
        <div class="form">
          <i-form @reset="reset" @search="search">
            <el-form-item label="工号:">
              <el-input v-model="form.employeeCode" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="姓名:">
              <el-input v-model="form.fullName" placeholder="请输入"></el-input>
            </el-form-item>
          </i-form>
        </div>
        <template ref='template'>
          <i-table
            class="table"
            :table="table"
            ref="table"
            v-loading="pageLoading" :element-loading-text="$loadingText"
            @pageSizeChange="handleSizeChange"
            @pageIndexChange="handleCurrentChange"
            >
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="tableScope.clone"
                border
                >
                <!-- 动态、多级表头需要使用 tableScope.columns -->
                <el-table-column type="selection">
                </el-table-column>

                <el-table-column
                  v-for="col of tableScope.columns"
                  :key="col.prop"
                  :prop="col.prop"
                  :label="col.label"
                  :width="col.width"
                  :align="col.align"
                  :sortable="col.sortable"
                  :fixed="col.fixed"
                  :formatter="tableScope.formatter"
                  >
                  <el-table-column
                    v-for="son of col.children"
                    :key="son.prop"
                    :prop="son.prop"
                    :label="son.label"
                    :width="son.width"
                    :align="son.align"
                    :formatter="tableScope.formatter"
                    >
                   </el-table-column>
                 </el-table-column>
               </el-table>
             </template>
           </i-table>
          <!-- 用于提示正在重算 -->
          <i-dialog
            v-model="isShowAlert"
            title="提示"
            size="small"
            ref="mask"
            :showClose="false"
          >
            <div id="mask">
              <i class="el-icon-loading"></i>
              <span>正在校验计算入队中,请等待...</span>
            </div>     
          </i-dialog>  
         </template>
       </div>
    </i-layout>
  </section>
</template>

<script>
import req, { config } from 'api/compensation/check-give/salary-count'
import ITable from 'components/common/i-table'
import IForm from 'components/common/i-form/i-form'
import ITableOperator from 'components/common/i-table-operator'
import ILayout from 'components/common/i-layout'
import Editor from 'components/employee/editor'
import IDialog from 'components/common/i-dialog/i-dialog'
import { showMessage, confirmPopover, getDict } from 'utils/index'

export default {
  components: {
    ITable,
    IForm,
    ILayout,
    ITableOperator,
    Editor,
    IDialog
  },
  data () {
    return {
      listParams: {},
      selectedOb: {},
      //  字典数据
      calculateStatusDict: [],
      componentListTypeDict: [],
      isShowAlert: false,
      // 表格
      table: {
        columns: [
        ],
        setting: {
          export: {
            req: config.getSalaryDetail,
            key: 'payCalculateRecordsExport',
            config: {
              fileName: '工资计算成功明细表',
              sync: false
            },
            param: () => ({
              groupCalculateId: this.groupCalculateId
            })
          },
          // 按钮
          toolbar: [
            {
              text: '重新计算',
              func: this.applyRecount,
              key: 'payCalculateSuccessRecomputePut',
              show: () => {
                return { disable: this.buttonIsDisabled() }
              }
            },
            {
              text: '返回',
              type: 'plain',
              func: this.back
            }
          ]
        },
        data: null,
        // 注册 page 相关信息
        showPagebar: true,
        search: null,
        info: null,
        renderColumns: true,
        multiple: true,
        total: 0
      },
      loading: true,
      pageLoading: false,
      groupCalculateId: '',
      calculateStatus: '',
      recountStatusSelected: '',
      form: {
        employeeCode: '',
        fullName: ''
      }
    }
  },
  created () {
    this.groupCalculateId = this.$route.query.id
    this.calculateStatus = this.$route.query.status
    this.getStatus(this.calculateStatus)
    this.init()
  },
  mounted () {
    this.table.search = {...this.form, groupCalculateId: this.groupCalculateId}
  },
  methods: {
    init () {
      this.fetchNav({groupCalculateId: this.groupCalculateId})
      this.fetchHead({groupCalculateId: this.groupCalculateId})
    },
            // 获得数据状态
    getStatus (calculateStatus) {
      this.recountStatusSelected = '01'
      if (calculateStatus !== '03' && calculateStatus !== '10' && calculateStatus !== '01' && calculateStatus !== '02') {
        this.recountStatusSelected = '02'
      }
    },
    // 按钮状态控制，01为开启，02为关闭
    buttonIsDisabled () {
      if (this.recountStatusSelected === '02') {
        return true
      } else {
        return false
      }
    },
         // 监听 pageIndex 和 pageSize 的变动
    handleSizeChange (options) {
      this.fetch(options)
    },
    handleCurrentChange (options) {
      this.pageLoading = true
      this.fetch(options)
    },
        // ---------------------------------工资细节列表----------------------------------------
    // 获取工资细节列表
    fetch (options = {}) {
      req('getSalaryDetail', options)
      .then(res => {
        // 此处将返回数据一一挂载到 table 上
        Object.keys(res).map(key => {
          this.selectedOb.groupCalculateId = this.groupCalculateId
          this.table[key] = res[key]
        })
        this.loading = false
        this.pageLoading = false
      })
    },
      // 获取工资细节头部
    fetchNav (options = {}) {
      req('getSalaryDetailNav', options)
      .then(res => {
        this.listParams = res
        this.getComponentListType()
        this.getCalculateStatus()
      })
    },
    // 获得字典数据
    getComponentListType () {
      getDict('COMPONENT_LIST_TYPE').then(res => {
        let ListType = this.listParams.componentListType
        this.componentListTypeDict = res.filter(function (key) {
          return key.value === ListType
        })
        this.listParams.componentListType = this.componentListTypeDict[0].label
      })
    },
    getCalculateStatus () {
      getDict('CALCULATE_STATUS').then(res => {
        let statusType = this.listParams.calculateStatus
        this.calculateStatusDict = res.filter(function (key) {
          return key.value === statusType
        })
        this.listParams.calculateStatus = this.calculateStatusDict[0].label
      })
    },
      // 获取工资细节表头配置
    fetchHead (options = {}) {
      req('getSalaryConfirmHead', options)
      .then(res => {
        // 添加排序功能和列固定
        for (let i = 0; i < 5; i++) {
          res.columns[i].sortable = true
          res.columns[i].width = '100'
          if (i < 2) {
            res.columns[i].fixed = true
          }
        }
        res.columns[8].sortable = true
        res.columns[8].width = '100'
        for (let key in res.columns) {
          if (res.columns[key].prop === 'calculateStatus') {
            res.columns[key].display = {dict: 'CALCULATE_STATUS'}
          }
        }
        this.table.columns = res.columns
      })
    },
    // ---------------------------------------------------------------------------------------------------
    // 申请工资重新计算
    applyRecount (vm) {
      const employeeList = vm.getMultipleSelection().map(item => {
        return item.empEmployeeId
      })
      if (!employeeList.length) {
        return showMessage('info', '请选择至少一项！')
      }
      this.selectedOb.employeeList = employeeList
      confirmPopover('warning', '确定要申请重算吗？', () => {
        this.isShowAlert = true
        this.statusRecount(this.selectedOb)
      })
    },
    // 重算
    statusRecount (Arr = {}) {
      return req('successSalaryRecompute', Arr).then(res => {
        if (res) {
          this.isShowAlert = false
          showMessage('success', '申请成功!')
          this.fetchNav({groupCalculateId: this.groupCalculateId})
          this.fetchHead({groupCalculateId: this.groupCalculateId})
          this.table.search = {groupCalculateId: this.groupCalculateId}
        } else {
          this.isShowAlert = false
          showMessage('error', '申请失败!')
        }
      }).catch(err => {
        if (err) {
          this.isShowAlert = false
          showMessage('error', '申请失败!')
        }
      })
    },
    // 返回
    back () {
      this.$router.back()
    },
    search () {
      this.pageLoading = true
      this.fetch({ ...this.form, groupCalculateId: this.groupCalculateId })
    },
    reset () {
      Object.keys(this.form).forEach(item => {
        this.form[item] = ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.key,
.value {
    height: 15px;
    line-height:15px;
    float:left;
    font-family: 微软雅黑;
    font-weight: 410;
    font-style: normal;
    font-size: 12px;
    color: rgb(153, 153, 153);
  }
.salary {
    margin-right: 30px;
}
#mask{
  text-align: center
}
.form{
  padding-bottom: 10px;
}
</style>
