<template>
  <div class="wrap">
    <i-process-flow
      @fillin="fillIn"
      :taskI="taskId"
      :postFlow="postFlow"
      :processType="processType"
      :taskKey="taskKey"
      @jurConfig="handleJurConfig"
    >
      <section class="content-follow" slot="okrPackageList">
        <!--OKR团队分红-->
        <OKR-team-profit :data="bonusData.okrPackageList"></OKR-team-profit>
      </section>
      <section class="content-follow" slot="OKRTeamProfitPersonalDetail">
        <!--OKR团队分红个人明细-->
        <OKR-team-profit-personal v-if="bonusData.okrDetailsList" ref="okrDetail" :baseInfo="bonusData.okrPackageList[0]"  :data="bonusData.okrDetailsList"></OKR-team-profit-personal>
      </section>
    </i-process-flow>
  </div>
</template>
<script>
  import OKRTeamProfitPersonal from './OKR-team-profit-personal'
  import OKRTeamProfit from './OKR-team-profit'
  import req from 'api/compensation/flow'
  import { showMessage } from 'utils/index'
  import IProcessFlow from 'components/common/i-process-flow'
  export default {
    components: {
      IProcessFlow,
      OKRTeamProfitPersonal,
      OKRTeamProfit
    },
    data () {
      return {
        loading: true,
        // OKR团队分红数据
        bonusData: {
          okrPackageList: [],
          okrDetailsList: []
        },
        id: this.$route.query.id,
        // 提交时所需要转换的日期字段
        datesKey: ['checkMonth'],
        empEmployeeId: this.$route.query.empEmployeeId,
        taskId: this.$route.query.taskId,
        taskKey: this.$route.query.taskKey,
        processType: this.$route.query.processType,
        processInstanceId: this.$route.query.processInstanceId || ''
      }
    },

    computed: {
    },

    created () {
      this.taskId || this.fetch()
    },

    methods: {
      /** 获取新店利润分红数据 */
      fetch () {
        req('postWfPackageDetail', this.id.split(',')).then(res => {
          if (res) {
            this.bonusData = res
          }
          this.loading = false
        })
      },

      /** 提交数据格式转换 */
      transformSubmitData (data) {
        const submitData = {}
        const clone = JSON.parse(JSON.stringify(data))
        submitData.okrProfitBonus = clone
        submitData.processType = this.processType
        return submitData
      },

      postFlow () {
        const bonusData = JSON.parse(JSON.stringify(this.bonusData))
        this.getSummaries()
        return this.transformSubmitData(bonusData)
      },

      fillIn (data) {
        const bonusData = data.okrProfitBonus
        this.bonusData = bonusData
      },
      getSummaries () {
        // 定义一个OKR奖励分红额的总数
        let rewardBonusListSum
        // 获取OKR奖励分红额,封装成一个数组
        let rewardBonusList = this.bonusData.okrDetailsList.map(item => Number(item['rewardBonus']))
        // 判断是否为NaN,否则相加会报错
        if (!rewardBonusList.every(value => isNaN(value))) {
          // 遍历OKR奖励分红额的数组并且相加
          rewardBonusListSum = rewardBonusList.reduce((prev, curr) => {
            let value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        }
        // teamShouldBonus是应发团队分红额
        if (rewardBonusListSum !== this.bonusData.okrPackageList[0].teamShouldBonus) {
          // 弹框提示要相等
          showMessage('warning', 'OKR团队分红额相加没有等于应发团队分红')
        }
      },
      /** 选项点击事件监听 */
      handleItemClick (item, row) {
        row.itemKey = item.componentId
      }
    }
  }
</script>
<style lang="scss">
  .contract-new {
    .base {
      margin-left: 20px;
    }
    .rules {
      font-size: 12px;
      color: #ff4949;
      margin-left: 5px;
    }
    .info-content {
      .el-input {
        width: 300px;
      }
    }
    .uploaderForm {
      width: 800px;
    }
  }
</style>
