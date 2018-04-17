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
      @pageSizeChange="handleSizeChange"
      @pageIndexChange="handleCurrentChange">
      <template
        slot-scope="tableScope"
        slot="table">
        <el-form
          :model="tableScope"
        >
          <el-table
            :data="tableScope.clone"
            height="300"
            @selection-change="handleSelect">
            <el-table-column
              type="selection"
              width="50"
              class-name="ac"
              fixed
              >
            </el-table-column>
            <el-table-column
              prop="employeeCode"
              label="工号"
              width="120"
              sortable
              header-align="center"
              >
            </el-table-column>
            <el-table-column
              prop="employeeName"
              label="姓名"
              width="100"
              sortable
              header-align="center"
              >
            </el-table-column>
            <el-table-column
              prop="schemeName"
              label="方案名称"
              width="150"
              header-align="center">
            </el-table-column>
            <el-table-column
              prop="year"
              label="年份"
              width="70"
              header-align="center"
              class-name="ac">
            </el-table-column>
            <el-table-column
              prop="period"
              label="阶段"
              width="100"
              :formatter="tableScope.formatter"
              header-align="center">
            </el-table-column>
            <el-table-column
              prop="indicatorName"
              label="指标名称"
              width="150"
              header-align="center">
            </el-table-column>
            <el-table-column
              prop="collecterName"
              label="收集人"
              width="100"
              header-align="center">
            </el-table-column>
            <el-table-column
              label="目标值"
              width="100"
              header-align="center">
              <template slot-scope="scope">
                {{ scope.row.target }} {{ scope.row.unit | unitFormat }}
              </template>
            </el-table-column>
            <el-table-column
              prop="collecterValue"
              label="达成值"
              width="100"
              header-align="center">
              <template slot-scope="scope">
                {{ scope.row.collecterValue }} {{ scope.row.unit | unitFormat }}
              </template>
            </el-table-column>
            <el-table-column
              prop="collecterDescription"
              label="达成值说明"
              width="100"
              header-align="center"
              :show-overflow-tooltip="true"
              tooltip-effect="dark">
            </el-table-column>
            <el-table-column
              label="审核值"
              width="180"
              header-align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="`clone[${scope.$index}].managerValue`"
                  :rules="ReturnNumberRule(scope.row)"
                  style="width:70%"
                  >
                  <el-input
                    v-model.number="scope.row.managerValue"
                    type="number"
                  >
                  </el-input>
                    {{ scope.row.unit | unitFormat }}
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="审核值说明"
              width="180"
              header-align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="`clone[${scope.$index}].managerDescription`"
                  :rules="textAreaRule">
                  <el-input
                    type="textarea"
                    v-model="scope.row.managerDescription"
                    :autosize="{minRows: 2, maxRows: 2}">
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="驳回意见"
              width="180"
              header-align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="`clone[${scope.$index}].managerOpinion`"
                  :rules="textAreaRule">
                  <el-input
                    type="textarea"
                    v-model="scope.row.managerOpinion"
                    :autosize="{minRows: 2, maxRows: 2}">
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalScore"
              label="分数"
              width="70"
              :formatter="gradeFormat"
              header-align="center"
              class-name="ac">
            </el-table-column>
          </el-table>
        </el-form>
      </template>
    </i-table>
  </i-layout>
</template>

<script>
import req from 'api/performance/todo-list'
import todoMixin from './todo-mixin'

export default {

  mixins: [todoMixin],

  data () {
    return {
      selfApi: 'getCheckPendingIndicator',
      rowSelected: [],
      table: {
        data: null,
        total: 0,
        search: null,
        columns: [
          {prop: 'period', display: {dict: 'PERIOD'}}
        ],
        info: {
          pageIndex: 1,
          pageSize: 10
        },
        showPagebar: true,
        setting: {
          export: {
          },
          toolbar: [{
            text: '通过',
            func: () => this.ensureData()
          }, {
            text: '驳回',
            type: 'plain',
            func: () => this.rejectData()
          }]
        }
      }
    }
  },

  methods: {
    rejectData () {
      if (this.rowSelected.length > 0) {
        for (let i of this.rowSelected) {
          if (!i.managerOpinion ||
            i.managerOpinion.length > 50 ||
            /\s+$/.test(i.managerOpinion)) {
            this.$message.warning('请规范填写驳回意见')
            return
          }
        }
        this.$confirm('确定驳回指标数据吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          req('postRejectIndicator',
          this.rowSelected.map((selection) => {
            return {
              'planId': selection.planId,
              'indicatorId': selection.indicatorId,
              'collectionId': selection.collectionId,
              'collecterId': selection.collecterId,
              'managerOpinion': selection.managerOpinion
            }
          })).then((response) => {
            this.$message.success('驳回成功')
            this.getData()
          })
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.$message.warning('请勾选后再驳回！')
      }
    },

    getData (opts) {
      req(this.selfApi, opts).then((res) => {
        for (let i of res.data) {
          i.managerValue = i.collecterValue
        }
        Object.assign(this.table, res)
      })
    },

    // 返回审核值的校验规则，最大值不能大于目标值
    ReturnNumberRule (row) {
      return {type: 'number', message: '请输入审核值', required: true, trigger: 'change'}
    },

    ensureData () {
      if (this.rowSelected.length > 0) {
        for (let i of this.rowSelected) {
          if (!i.managerValue) {
            this.$message.warning('请规范填写审核值')
            return
          }
          // if (i.managerValue > i.target) {
          //   this.$message.error('审核值不能大于目标值')
          //   return
          // }
          if (!i.managerDescription ||
            i.managerDescription.length > 50) {
            this.$message.warning('请规范填写审核值说明')
            return
          }
        }
        this.$confirm('确定通过指标数据吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          req('postCheckIndicator',
          this.rowSelected.map((selection) => {
            return {
              'planId': selection.planId,
              'indicatorId': selection.indicatorId,
              'collectionId': selection.collectionId,
              'managerValue': selection.managerValue,
              'managerDescription': selection.collecterDescription
            }
          })).then((response) => {
            this.$message.success('通过成功')
            this.getData()
          })
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.$message.warning('请勾选后再通过！')
      }
    },

    gradeFormat (row, column) {
      let count = row.managerValue / row.target
      row.collecterScore =
        (count * 100) === Math.floor((count * 100)) ? (count * 100) : (count * 100).toFixed(1)
      return row.collecterScore
    },

    rejectConfirm () {
      if (this.rowSelected.length > 0) {
        let flag = false
        for (let selection of this.rowSelected) {
          if (selection.managerOpinion && selection.managerOpinion !== '') {
            flag = true
          } else {
            flag = false
            break
          }
        }
        flag
          ? this.rejectData()
          : this.$message.warning('请填写驳回意见后再驳回！')
      } else {
        this.$message.warning('请勾选后再驳回！')
      }
    },

    handleSelect (selection) {
      this.rowSelected = selection
    }
  }
}
</script>
