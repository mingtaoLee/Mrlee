<template>
  <i-layout>

    <i-form
      slot="header"
      @reset="reset"
      @search="search">
      <el-form-item label="员工姓名">
        <el-input v-model="keyword"></el-input>
      </el-form-item>
    </i-form>

    <i-table
      slot="section"
      :table="table"
      ref="table"
      class="pfmCollectPending"
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange"
    >
      <template
        slot-scope="tableScope"
        slot="table"
      >
        <el-table height="300" :data="tableScope.clone">
          <el-table-column
            type="selection"
            width="50"
            header-align="center"
            fixed>
          </el-table-column>
          <el-table-column
            v-for="(col, index) in table.columns"
            :key="index"
            :label="col.label"
            :prop="col.prop"
            :width="col.width"
            :fixed="col.fixed"
            :formatter="tableScope.formatter"
          >
            <template slot-scope="scope">
              <i-table-cell
                :row="scope.row"
                :col="col.prop"
                :table="tableScope"
                ref="cell"
              >
              </i-table-cell>
            </template>
          </el-table-column>

          <el-table-column label="目标值" prop="target">
            <template slot-scope="scope">
              {{scope.row.target}}{{scope.row.unit | unitFormat}}
            </template>
          </el-table-column>

           <!-- <el-table-column label="达成值" prop="collecterValue">
            <template slot-scope="scope">
              {{scope.row.target}}{{scope.row.unit | unitFormat}}
            </template>
          </el-table-column> -->
        </el-table>
      </template>
    </i-table>
  </i-layout>
</template>

<script>
  import req, {config} from 'api/performance/todo-list'
  // import req from 'api/performance/todo-list'
  import todoMixin from './todo-mixin'
  import { unitDict } from '@/config/dict'

  export default {

    mixins: [todoMixin],

    data () {
      let targetCheck = (rule, val, cb) => {
        if (!(typeof val === 'number')) cb('请输入数字')
        if (val < 0) cb('完成值不能小于0')
      }
      let isCollectPage = this.$route.path.includes('collect')
      return {
        selfApi: 'postCollectPendingIndicator',
        rowSelected: [],
        keyword: '', // 查询参数：员工姓名
        table: {
          data: null,
          total: 0,
          search: null,
          editable: true,
          info: null,
          showPagebar: true,
          columns: [
            {prop: 'employeeCode', label: '工号', width: '120', 'header-align': 'center', sortable: true, fixed: true},
            {prop: 'employeeName', label: '姓名', width: '120', 'header-align': 'center'},
            {prop: 'schemeName', label: '方案名称', width: '120', 'header-align': 'center'},
            {prop: 'year', label: '年份', width: '120', 'header-align': 'center'},
            {prop: 'period', label: '阶段', width: '120', display: {dict: 'PERIOD'}, 'header-align': 'center'},
            {prop: 'indicatorName', label: '指标名称', width: '120', 'header-align': 'center'},
            // {prop: 'target', label: '目标值', width: '120', 'header-align': 'center'},
            {
              prop: 'indicatorCollectionStatus',
              label: '收集状态',
              width: '120',
              display: {dict: 'INDICATOR_COLLECTION_STATUS'},
              'header-align': 'center'
            },
            {prop: 'managerName', label: '审核人', width: '120', 'header-align': 'center'},
            {prop: 'planId', label: '计划ID'},
            {prop: 'collectionId', label: '收集ID'},
            {prop: 'indicatorId', label: '指标ID'},
            {prop: 'collecterValue', label: '达成值', width: '120', 'header-align': 'center', fixed: 'right'},
            {prop: 'collecterDescription', label: '达成值说明', width: '160', 'header-align': 'center', fixed: 'right'},
            {prop: 'managerOpinion', label: '驳回意见', 'header-align': 'center', fixed: 'right'}
          ],
          setting: {
            export: {
              text: '导出数据收集',                // 不合规范，以自身业务为准【可选】
              show: () => ({empty: false}),  // 是否显示【可选】
              config: {                        // 【可选】
                fileName: '绩效数据收集'              // 默认文件名
                // version: '',                // 默认后缀
                // range: '',                  // 默认范围
                // sync: true                  // 默认方式（同步/异步）
              },
              req: config.postCollectPendingIndicator
            },
            import: {
              business: 'pfm-paln-indicator',
              hideDownloadTemplate: true
              // show: () => ({ empty: true }) // 隐藏
            },
            toolbar: [{
              text: '提交',
              func: vm => this.submitData(vm)
            }],
            editor: {
              employeeCode: {disable: true},
              employeeName: {disable: true},
              schemeName: {disable: true},
              year: {disable: true},
              period: {disable: true},
              indicatorName: {disable: true},
              target: {disable: true},
              collecterScore: {disable: true},
              indicatorCollectionStatus: {disable: true},
              managerName: {disable: true},
              planId: {disable: true},
              collectionId: {disable: true},
              indicatorId: {disable: true},
              collecterValue: {
                type: 'number',
                rules: [
                  {type: 'number', required: true, message: '请输入达成值', trigger: 'focus, blur'},
                  {validator: targetCheck, trigger: 'change'}
                ]
              },
              collecterDescription: {
                type: 'textarea',
                rules: {required: true, message: '请输入达成说明', trigger: ' blur', max: 150}
              },
              managerOpinion: {
                type: 'textarea',
                rules: isCollectPage ? undefined : {required: true, message: '请输入驳回意见', trigger: 'focus, blur'},
                disable: isCollectPage
              }
            }
          }
        }
      }
    },

    methods: {
      // 修改数据的请求
      postData (postData) {
        req('postCollectIndicator', postData)
          .then((response) => {
            this.$message.success('提交成功')
            this.getData(this.table.info)
          })
      },

      // 点击提交按钮提交对数据收集或者审核
      submitData (vm) {
        console.log(this.$refs.table.getMultipleSelection())
        if (this.$refs.table.getMultipleSelection().length > 0) {
          for (let i of this.$refs.table.getMultipleSelection()) {
            if (!i.collecterValue) {
              this.$message.warning('请规范填写达成值')
              return
            }
            // if (i.collecterValue > i.target) {
            //   this.$message.error('达成值不能大于目标值')
            //   return
            // }
            if (!i.collecterDescription) {
              this.$message.warning('请规范填写达成值说明')
              return
            }
          }
          this.$confirm('确定提交指标数据吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.postData(
                this.generatePostData()
              )
          }).catch((err) => {
            console.log(err)
          })
              // if (vm.saveData()) {
              //   console.log(this.checkCollecterValue())

              //   this.$confirm('确定提交指标数据吗？', {
              //     confirmButtonText: '确定',
              //     cancelButtonText: '取消'
              //   }).then(() => {
              //     this.postData(
              //   this.generatePostData()
              // )
              //   }).catch((err) => {
              //     console.log(err)
              //   })
              // }
            // } else {
            //   this.$message({
            //     message: '达成值不能大于目标值',
            //     type: 'error'
            //   })
            // }
          // })
        } else {
          this.$message.warning('请勾选后再提交！')
        }
      },

      myValidate () {
        this.$refs.table.getMultipleSelection().map(item => {
          // })
          if (item.collecterValue < item.target) {
            if (!item.collecterValue || !item.collecterDescription) {
              this.$message({
                message: '达成值和达成值说明不能为空',
                type: 'error'
              })
              return
            }
          } else {
            this.$message({
              message: '达成值不能大于目标值',
              type: 'error'
            })
          }
        })
      },
      // 生成需要提交的数据
      generatePostData () {
        return this.$refs.table.getMultipleSelection().map((selection) => {
          return {
            'planId': selection.planId,
            'indicatorId': selection.indicatorId,
            'collectionId': selection.collectionId,
            'target': selection.target,
            'collecterScore': selection.collecterValue,
            'collecterDescription': selection.collecterDescription,
            'managerOpinion': selection.managerOpinion
          }
        })
      },

      // 校验达成值不能大于目标值
      checkCollecterValue () {
        let data = this.generatePostData()
        for (let i of data) {
          if (i.collecterValue > i.target) {
            this.$message({
              message: '达成值不能大于目标值',
              type: 'error'
            })
            return false
          }
        }
        return true
      },

      gradeFormat (row, column) {
        let count = row.collecterValue / row.target
        row.collecterScore =
          (count * 100) === Math.floor((count * 100)) ? (count * 100) : (count * 100).toFixed(1)
        return row.collecterScore
      }
    },

    filters: {
      unitFormat (val) {
        if (!val) {
          return '元'
        }
        let flag = -1
        for (let i of unitDict) {
          if (i.value === val) {
            flag = i
            break
          }
        }
        if (flag === -1) {
          return '元'
        } else {
          return flag.label
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ellipsis-text {
    text-overflow: ellipsis;
  }


</style>
<style lang="scss">
  /* .el-table_1_column_10 .el-tooltip span span:last-child,
  .el-table_1_column_11 .el-tooltip span span:last-child,
  .el-table_1_column_13 .el-tooltip span span:last-child {
    display: block!important;
  } */
  /*.pfmCollectPending {*/
    /**/
  /*}*/
  /*.i-table-import-excel {*/
    /*.download {*/
      /*display: none;*/
    /*}*/
  /*}*/
</style>


