<template>
  <div class="wrap" v-loading="loading" :element-loading-text="$loadingText">
    <i-table :table="table"
    @pageSizeChange="handleChange"
    @pageIndexChange="handleChange">
      <template slot="table" slot-scope="tableScope">
        <el-table :data="tableScope.clone"
        @selection-change="selectionChangeHandler">
          <el-table-column type="selection" v-if="editable"/>
          <el-table-column
            prop="scaPlanName"
            label="编制计划名称"
            align="center"
            min-width="120"
            show-overflow-tooltip>
            <a slot-scope="scope" class="checkPlan"  @click="checkPlan(scope.row)">{{scope.row.scaPlanName}}</a>
          </el-table-column>
          <el-table-column
            prop="modName"
            label="编制模板"
            align="center"
            min-width="120"
            show-overflow-tooltip>
            <a  slot-scope="scope" class="checkPlan"  @click="checkTemp(scope.row)">{{scope.row.modName}}</a>
          </el-table-column>
          <el-table-column
            prop="orgUnitNames"
            label="适用范围"
            align="center"
            show-overflow-tooltip>
            <span  slot-scope="scope">{{getRange(scope.row.orgs)}}</span>
          </el-table-column>
          <el-table-column
            prop="planStatus"
            label="状态"
            :formatter="tableScope.formatter"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="year" label="年度" align="center" show-overflow-tooltip />
          <el-table-column
            v-if="tableScope.operator"
            label="操作"
            align="center"
            fixed="right"
            width="200"
            show-overflow-tooltip>
              <i-table-operator
                slot-scope="scope"
                :table="tableScope"
                :row="scope.row"
              />
          </el-table-column>
        </el-table>
      </template>
    </i-table>
  </div>
</template>

<script>
import reqPl from 'api/compile/plan'
import moment from 'moment'
import ITable from 'components/common/i-table'
import ITableOperator from 'components/common/i-table-operator'
import {PlanStatusDict} from 'config/dict'

export default {
  name: 'PlanHomeTable',
  components: {
    ITable,
    ITableOperator
  },
  props: {
    editable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 模板管理主页的表格内容配置项
      table: {
        columns: [
            { prop: 'planStatus', display: { dict: 'SCALE_PLAN_STATUS' } }
        ],
        setting: {
          operator: [
            {
              text: '编制管理',
              func: this.managePlan,
              show: row => {
                let status = row.planStatus === PlanStatusDict['NOT_PUBLISH']
                return { empty: status }
              }
            },
            {
              text: '修改',
              func: this.modify,
              show: row => {
                let status = row.planStatus !== PlanStatusDict['NOT_PUBLISH']
                return this.editable
                ? status ? {
                  disable: status,
                  message: '未发布计划才能修改'
                } : {
                  disable: status
                }
                : {
                  empty: true
                }
              }
            },
            {
              text: '发布',
              func: this.publish,
              type: 'success',
              show: row => {
                let status = row.planStatus === PlanStatusDict['NOT_PUBLISH']
                return { empty: !this.editable || !status }
              }
            },
            {
              text: '结束',
              func: this.end,
              type: 'danger',
              show: row => {
                let status = row.planStatus === PlanStatusDict['USING']
                return { empty: !this.editable || !status }
              }
            }
          ],
          toolbar: [{
            text: '新增',
            func: this.newPlan,
            show: () => {
              return { empty: !this.editable }
            }
          }, {
            text: '删除',
            func: this.deletePlan,
            type: 'danger',
            show: () => {
              return { empty: !this.editable }
            }
          }]
        },
        data: null,
        info: null,
        total: 0,
        search: null,
        showPagebar: true
      },
      // 保存列表被选择的项
      selection: [],
      // loading
      loading: false
    }
  },

  methods: {
    // 展示计划列表，searcher为搜索内容
    showPlanList (searcher) {
      this.loading = true
      this.table.search = {...searcher}
    },
    // 获取表格内容
    fetch (params = {}) {
      reqPl('getPlanList', params).then(data => {
        this.loading = false
        this.table.data = this.convertData(data.data)
        this.table.total = data.total
        this.table.info = data.info
      }).catch(e => {
        this.loading = false
      })
    },
    // 列表被选择的行
    selectionChangeHandler (selection) {
      this.selection = selection
    },
    // 转化适用范围的格式
    getRange (orgs) {
      let range = []
      orgs && orgs.map(ele => {
        if (ele && !range.includes(ele.orgUnitName)) {
          range.push(ele.orgUnitName)
        }
      })
      return range.join('，')
    },
    // 转化数据
    convertData (data) {
      data.map(ele => {
        ele.year = moment(ele.year).format('YYYY')
      })
      return data
    },
    // 新建按钮触发
    newPlan () {
      this.$emit('new')
    },
    // 删除按钮触发
    deletePlan () {
      // 执行删除操作
      const execDelete = arr => {
        return () => {
          let params = {
            scaPlanIds: arr.join(',')
          }
          reqPl('deletePlan', params).then(res => {
            if (res) {
              this.$message.success('删除成功')
              this.showPlanList()
            }
          })
        }
      }
      // 从删除数据中，返回删除id数组
      const getDeleteIdArr = () => {
        return this.selection.map(ele => ele.scaPlanId)
      }
      // 是否确认删除， callback是确认删除执行的操作
      const comfirmDelete = (fn) => {
        this.$confirm('是否确认删除该模板', '模板删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => fn())
        .catch(() => this.$message.info('取消删除'))
      }
      // 流程判定
      if (Array.isArray(this.selection) && this.selection.length === 0) {
        return this.$message.warning('请先选择计划')
      } else {
        let arr = getDeleteIdArr()
        arr && comfirmDelete(execDelete(arr))
      }
    },
    // 查看编制计划
    checkPlan (row) {
      this.$emit('checkPlan', row)
    },
    // 查看编制模板
    checkTemp (row) {
      this.$emit('checkTemp', row)
    },
    // 修改列表触发
    modify (row) {
      this.$emit('modify', row)
    },
    // 管理编制计划
    managePlan (row) {
      this.$emit('managePlan', row)
    },
    // 发布计划
    publish (row) {
      let that = this
      let params = {
        scaPlanId: row.scaPlanId
      }
      reqPl('publishPlan', params).then(data => {
        if (data) {
          that.$message({
            message: '发布成功',
            type: 'success'
          })
          return that.showPlanList()
        }
      })
    },
    // 结束计划
    end (row) {
      let that = this
      let params = {
        scaPlanId: row.scaPlanId
      }
      reqPl('endPlan', params).then(data => {
        if (data) {
          that.$message({
            message: '结束成功',
            type: 'success'
          })
          return that.showPlanList()
        }
      })
    },
    // 页量改变/页码改变
    handleChange (info) {
      this.fetch(info)
    }
  },

  created () {

  }
}
</script>

<style lang="scss" scoped>
.checkPlan{
  color:#3da5fe;
  cursor: pointer;
}
</style>
