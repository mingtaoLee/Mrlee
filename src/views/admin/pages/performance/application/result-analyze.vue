<template>
  <div class="level">
    <i-layout headerKey="pfmResultAnalysisListGet">
      <div slot="header">
        <i-form @reset="reset" @search="search">
          <el-form-item label="名称">
            <el-input v-model="param.keyword"></el-input>
          </el-form-item>
          <el-form-item label="方案跨度">
            <el-select v-model="param.period" placeholder="请选择" clearable>
              <el-option
                v-for="item in periodDict"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </i-form>
      </div>
      <div slot="section">
        <div class="table">
          <i-table
          :table="table"
          @pageSizeChange="handleSizeChange"
          @pageIndexChange="handleCurrentChange"
          >
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="tableScope.clone"
                style="width: 100%"
                ref="multipleTable">
                <!-- @selection-change="handleSelectionChange" -->
                <!-- <el-table-column
                  type="selection"
                  width="40">
                </el-table-column> -->
                <el-table-column prop="name" label="方案名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" sortable>
                  <template slot-scope="scope">
                    {{scope.row.status | statusFilter}}
                  </template>
                </el-table-column>
                <el-table-column prop="year" label="年份" align="center" sortable>
                </el-table-column>
                <el-table-column prop="period" label="阶段" align="center" sortable>
                  <template slot-scope="scope">
                    {{periodTyper(scope.row.period)}}
                  </template>
                </el-table-column>
                <el-table-column prop="orgName" label="适用范围" align="center" sortable show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
                <i-table-operator :table="tableScope"></i-table-operator>
              </el-table>
            </template>
          </i-table>
        </div>
      </div>
    </i-layout>
    <i-dialog
      v-model="dialogFormGetVisible"
      title="结果分析"
      width="800px"
      :toolbar="dialogToolbar"
      destroyedWhenClose
      size="large"
    >
      <read-result-analyze :schemeId="schemeId" :period="period"></read-result-analyze>
    </i-dialog>
  </div>
</template>
<script>
 import req from 'api/performance/analyze'
 import ILayout from 'components/common/i-layout'
  // 查询组件
 import IForm from 'components/common/i-form/i-form.vue'
 import ITable from 'components/common/i-table'
 import { periodDict } from 'config/dict'
 import IDialog from 'components/common/i-dialog/i-dialog.vue'
 import readResultAnalyze from './read-result-analyze.vue'
 import { findDictLabel } from 'utils/index'

 export default {
   name: 'level',
   data () {
     return {
       table: {
         data: null,
         total: 0,
         info: null,
         search: null,
         showPagebar: true,
         setting: {
           export: {
             elTable: null
           },
           operator: [
             {
               text: '结果分析',
               key: 'pfmResultAnalysisGet',
               func: (row) => this.oneLevelGetDetail(row)
             }
           ]
         }
       },
       periodDict: periodDict, // 搜索状态
       multiSelection: [], // 多选
       type: 0, // 区分当前弹出框是增加还是修改0是增加，1是修改
       dialogFormGetVisible: false, // 不可以填写的弹出框
       form: { // 弹出框的表单
         name: '',
         detail: [],
         status: '',
         levelType: '',
         description: ''
       },
       schemeId: '', // 保存当前打开修改面板的等级id
       period: '',
        // 查询条件
       param: {
         keyword: '',
         period: ''
       },
       dialogToolbar: [
         {
           text: '返回',
           func: done => {
             this.handleCancel(done)
           }
         }
       ],
       title: ''
     }
   },
   components: {
     IForm,
     ITable,
     ILayout,
     IDialog,
     readResultAnalyze
   },
   mounted () {
    //  this.getSchemesList()
     this.search()
   },

   filters: {
     statusFilter (status) {
       const statusMap = {
         0: '关闭',
         1: '启用'
       }
       return statusMap[status]
     }
   },
   methods: {
     reset () {
        // 在这里写重置逻辑
       this.param = {
         keyword: '',
         period: ''
       }
//        this.getSchemesList()
     },
      // 搜索按钮
     search () {
       this.table.search = {...this.param}
     },
      // 多选赋值操作
      // handleSelectionChange (val) {
      //   this.multiSelection = val
      // },
      // 当分页器页码变动时调用
     handleCurrentChange (opts) {
      //  this.table.info = opts
       this.getSchemesList(opts)
     },
      // 分页器每页显示几个
     handleSizeChange (opts) {
      //  this.table.info = opts
       this.getSchemesList(opts)
     },
      // 字典转换
     periodTyper (val) {
       return findDictLabel(periodDict, val)
     },
      // 获取绩效等级列表
     getSchemesList (opts) {
       req('schemesList', opts).then((res) => {
         Object.assign(this.table, res)
       }).catch((err) => {
         console.log(err)
       })
     },
      // 查看结果分析
     oneLevelGetDetail ({schemeId, period}) {
       if (schemeId) {
         this.schemeId = schemeId
         this.period = period
         this.dialogFormGetVisible = true
       }
     },
     handleCancel (done) {
       done()
     }
   }
 }
</script>

<style scoped lang="scss">
  .level {
    .pointer {
      cursor: pointer;
    }
  }
</style>

