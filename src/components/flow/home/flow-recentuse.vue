<template>
  <div class="flow-recentuse ">
    <header  class="header">
      <h3 >最近使用</h3>
    </header>
    <nav>
      <ul>

        <li   v-if="lates && lates.length"
         v-for="(item,idx) in lates"
         :key="idx"
         class="cell"
         @click="toFlow(item)">
          <span>{{ employeeTransfer.includes(item.processType) ? item.name : `${item.name} （暂未开放）`}}</span>
        </li>
        <li class="no" v-if="!lates || lates && !lates.length">
          <span>暂无数据</span>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
  import req from 'api/employee/flow'
  export default {
    data () {
      return {
        lates: null,

        // HACK: 除员工异动流程外，其他流程需禁用
        employeeTransfer: ['employeeHireProcess', 'employeeRegularProcess', 'employeeTransferProcess', 'employeeDimissionProcess', 'empChangeSuretyProcess', 'rctRequirementProcess4comp', 'rctRequirementProcess4platform', 'rctRequirementProcess4shop', 'hireAuditProcess', 'postSalaryAdjustmentWorkflow']
      }
    },

    methods: {
      getLately () {
        req('getLately')
        .then(data => (this.lates = data))
      },
      // HACK: 除异动流程外，其他流程需做特殊处理
      toFlow (row) {
        if (this.employeeTransfer.includes(row.processType)) {
          this.submitFlow(row.processType, row.url, row.taskId)
        } else {
          this.$message({
            type: 'warning',
            message: '此流程暂未开放'
          })
        }
      },
      submitFlow (type, url, taskId) {
        // console.log(arguments)
        this.$store.commit('SET_FLOW_ACTION', { processType: type, taskId: taskId, isFlowCenter: 'Y' })
        this.$store.commit('FLOW_WINDOW_OPEN', '/flow.html#' + url)
      }
    },

    created () {
      this.getLately()
    }
  }
</script>

<style lang="scss" scoped>
  .flow-recentuse {
    background: white;
    border: 1px solid #dfe6ec;
    .no {
        padding: 10px 20px;
        font-size: 14px;
      }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      border-bottom: 1px solid #e5e5e5;
      background: #FAFAFA;
      h3 {
        color: #000000;
        font-size: 14px;
        font-weight: 800;
        font-family: 'PingFangSC Medium';
      }
    }
    .cell {
      display: flex;
      width: 100%;
      justify-content: space-between;
      line-height: 36px;
      height: 36px;
      padding: 0 15px;
      box-sizing: border-box;
      cursor: pointer;
      &:nth-child(even) {
        background: #FAFAFA;
      }
      &:hover {
        background: #eef1f6;
      };
    }
  }
</style>
