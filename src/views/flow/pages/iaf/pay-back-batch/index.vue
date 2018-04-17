<template>
  <div>
    <!-- 社保批量补缴 -->
    <i-process-flow
      @fillin="fillIn"
      processType="iafTransferMemberFlow"
      :taskI="taskId"
      :taskKey="taskKey"
    >
      <div slot="details">
        <div class="module">
          <h2>五险一金补缴/预缴明细</h2>
          <i-table
            :table="table"
            @pageSizeChange="handleSizeChange"
            @pageIndexChange="handleCurrentChange"
          >
            <template slot="table" slot-scope="tableScope">
              <el-table
                :data="tableScope.clone"
                :stripe="$$.table.stripe"
                :border="$$.table.border">
                <el-table-column
                  v-for="(col, idx) of table.columns"
                  :key="idx"
                  :prop="col.prop"
                  :label="col.label"
                  :width="col.width"
                  align="center"
                >
                  <el-table-column
                    v-for="(item, index) in col.children"
                    :prop="item.prop"
                    :label="item.label"
                    :key="index"
                    :width="item.width"
                    align="center"
                  >
                  </el-table-column>
                </el-table-column>
              </el-table>
            </template>
          </i-table>
        </div>
      </div>
    </i-process-flow>
  </div>
</template>
<script>
import IProcessFlow from 'components/common/i-process-flow'
import ITable from 'components/common/i-table'
export default {
  components: {
    IProcessFlow,
    ITable
  },
  data () {
    return {
      table: {
        columns: [
          { prop: 'test', label: '工号', width: '100' },
          { prop: 'test', label: '姓名', width: '100' },
          { prop: 'test', label: '身份证号', width: '100' },
          { prop: 'test', label: '户口性质', width: '100' },
          { prop: 'test', label: '缴费年月', width: '100' },
          {
            label: '养老险',
            children: [
              {prop: 'test', label: '户头代码', width: '100'},
              {prop: 'test', label: '单位', width: '100'},
              {prop: 'test', label: '个人', width: '100'}
            ]
          },
          {
            label: '失业险',
            children: [
              {prop: 'test', label: '户头代码', width: '100'},
              {prop: 'test', label: '单位', width: '100'},
              {prop: 'test', label: '个人', width: '100'}
            ]
          },
          {
            label: '工伤险',
            children: [
              {prop: 'test', label: '户头代码', width: '100'},
              {prop: 'test', label: '单位', width: '100'},
              {prop: 'test', label: '个人', width: '100'}
            ]
          },
          {
            label: '医疗险',
            children: [
              {prop: 'test', label: '户头代码', width: '100'},
              {prop: 'test', label: '单位', width: '100'},
              {prop: 'test', label: '个人', width: '100'}
            ]
          },
          {
            label: '生育险',
            children: [
              {prop: 'test', label: '户头代码', width: '100'},
              {prop: 'test', label: '单位', width: '100'},
              {prop: 'test', label: '个人', width: '100'}
            ]
          },
          {
            label: '公积金',
            children: [
              {prop: 'test', label: '户头代码', width: '100'},
              {prop: 'test', label: '单位', width: '100'},
              {prop: 'test', label: '个人', width: '100'}
            ]
          },
          {
            label: '滞纳金',
            children: [
              {prop: 'test', label: '单位', width: '100'},
              {prop: 'test', label: '个人', width: '100'}
            ]
          },
          {
            label: '合计',
            children: [
              {prop: 'test', label: '单位', width: '100'},
              {prop: 'test', label: '个人', width: '100'}
            ]
          }
        ],
        setting: {
          import: {
            business: 'iaf-handicappedAddSuccessful',
            show: () => ({empty: false})
          }
        },
        info: {
          pageSize: 1,
          pageIndex: 1
        },
        total: 0,
        data: null,
        showPagebar: true
      },
      flowData: {
        creator: '12345',
        isHasOfficialDocument: 'N',
        processDefinitionId: '',
        partnerId: '8a8ea06a5faf744d015faf7dc1f90010',
        financeId: '8a8ea06a5faf744d015faf7dc1f90010',
        hrEmpId: '8a8ea06a5faf744d015faf7dc1f90010',
        operateType: '4'
      }
    }
  },
  methods: {
    fetch (options = {}) {
      // req('postRoster', options).then(
      //   res => (this.table = Object.assign(this.table, res))
      // )
    },
    postFlow () {
      return Object.assign({}, {orgUnitMaintains: this.basicData}, this.flowData)
    },
    fillIn (data) {

    },
    handleSizeChange (options) {
      this.fetch(options)
    },
    handleCurrentChange (options) {
      this.fetch(options)
    }
  }
}
</script>
<style lang="scss" scoped>
  .module{
    min-width: 850px;
    border-bottom: 1px solid #e5e5e5;
    margin: 20px;
    h2{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: bold;
      color: #000000;
      letter-spacing: 0;
      margin-bottom: 20px;
    }
  }
</style>

