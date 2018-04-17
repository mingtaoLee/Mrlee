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
      <section class="content-follow" slot="storeInfoList">
        <!--基本信息-->
        <bonus-package :data="bonusData.storeInfoList"></bonus-package>
      </section>
      <section class="content-follow" slot="newStoreProfitBonusDetail">
        <!-- 半年核算类-->
        <half-year-detail v-if="bonusData.newStoreProfitBonusHalfDtoList" :baseInfo="bonusData.storeInfoList[0]"  :data="bonusData.newStoreProfitBonusHalfDtoList"></half-year-detail>
        <!--季度核算类触发-->
        <quarter-detail v-if="bonusData.newStoreProfitBonusQuarterDtoList" ref="quarterDetail" :baseInfo="bonusData.storeInfoList[0]"  :data="bonusData.newStoreProfitBonusQuarterDtoList"></quarter-detail>
      </section>
    </i-process-flow>
  </div>
</template>
<script>
  import HalfYearDetail from './half-year-detail'
  import BonusPackage from './bonus-package'
  import QuarterDetail from './quarter-detail'
  import req from 'api/compensation/flow'
  import IProcessFlow from 'components/common/i-process-flow'
  export default {
    components: {
      IProcessFlow,
      QuarterDetail,
      HalfYearDetail,
      BonusPackage
    },
    data () {
      return {
        loading: true,
        // 利润分红数据
        bonusData: {
          storeInfoList: [],
          newStoreProfitBonusHalfDtoList: [],
          newStoreProfitBonusQuarterDtoList: []
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
      isQuarter (value) {
        return !!this.bonusData.newStoreProfitBonusQuarterDtoList
      }
    },

    created () {
      this.taskId || this.fetch()
    },

    methods: {
      /** 获取新店利润分红数据 */
      fetch () {
        req('getNewStoreBonus', this.id.split(',')).then(res => {
          if (res) {
            // 如果是季度核算类，则将数据转为多行合并数据
            if (res.newStoreProfitBonusQuarterDtoList) {
              res.newStoreProfitBonusQuarterDtoList = this.transformToRowsCombineData(res.newStoreProfitBonusQuarterDtoList)
            }
            this.bonusData = res
          }
          this.loading = false
        })
      },

      /** 转换为合并行数据结构 */
      transformToRowsCombineData (data) {
        let arr = []

        data.forEach((item, index) => {
          item.storeRatio = ''
          item.storeBonus = ''

          arr = arr.concat(item.employeeList.map((employeeInfo, index) => {
            if (index === 0) {
              employeeInfo.isCombine = true
              employeeInfo.combineNum = item.employeeList.length
            }

            return Object.assign({}, item, employeeInfo)
          }))
        })

        return arr
      },

      /** 还原数据结构 */
      resetRowsCombineData (data) {
        let arr = []

        data.forEach((item, index) => {
          if (item.isCombine) {
            const obj = {}
            const keys = ['orgId', 'orgUnitName', 'partnerNumber']

            keys.forEach(key => {
              obj[key] = item[key]
            })

            obj.employeeList = data.slice(index, index + item.combineNum)

            obj.employeeList = obj.employeeList.map(item => {
              delete item.employeeList
              return item
            })

            arr.push(obj)
          }
        })

        return arr
      },

      /** 提交数据格式转换 */
      transformSubmitData (data) {
        const submitData = {}
        const clone = JSON.parse(JSON.stringify(data))

        if (this.isQuarter) {
          clone.newStoreProfitBonusQuarterDtoList = this.resetRowsCombineData(clone.newStoreProfitBonusQuarterDtoList)
        }

        submitData.newStoreBonus = clone
        submitData.processType = this.processType

        return submitData
      },

      postFlow () {
        const bonusData = JSON.parse(JSON.stringify(this.bonusData))
        if (this.isQuarter) bonusData.newStoreProfitBonusQuarterDtoList = this.$refs.quarterDetail.getClone()
        return this.transformSubmitData(bonusData)
      },

      fillIn (data) {
        const bonusData = data.newStoreBonus
        // 如果是季度核算类，则将数据转为多行合并数据
        if (bonusData.newStoreProfitBonusQuarterDtoList) {
          bonusData.newStoreProfitBonusQuarterDtoList = this.transformToRowsCombineData(bonusData.newStoreProfitBonusQuarterDtoList)
        }
        this.bonusData = bonusData
      },

      /** 人员选择事件监听 */
      handlePersonnelClick ({ row }) {
        this.$set(row, 'isShowPersonnel', true)
      },

      /** 人员选择确认事件 */
      handlePersonnelDialogConfirm (selected, {row}) {
        const selectedData = selected[0]

        row.employeeName = selectedData.employeeName
        row.employeeCode = selectedData.employeeCode
        row.empEmployeeId = selectedData.employeeId
        row.orgName = selectedData.unitName

        this.getDetailInfo(row.empEmployeeId, row)
      },

      /** 根据人员id获取详细信息 */
      getDetailInfo (employeeId, row) {
        req('getEmpBankInfo', { empEmployeeId: employeeId }).then(res => {
          if (res) {
            row.groupName = res.groupName
            row.account = res.account
            row.areaId = res.areaId
            row.areaName = res.areaName
            row.cardType = res.cardType
            row.bankCode = res.bankCode
            row.bankName = res.bankName
          }
        })
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
