<template>

    <i-process-flow
      :model="ocDetails"
      @fillin="fillIn"
      >
      <demand-desc slot="baseForm" :model="ocDetails" :action="'品类' + action" :limitTime="limitTime" :ifDesc="false" />
      <maintain slot="detailForm" :model="ocDetails" :action="'品类'" @changeCategory="getBaseInfo"/>
    </i-process-flow>

</template>

<script>
  import req from 'api/position/position-category'
  import DemandDesc from 'components/flow/demand-desc'
  import Maintain from 'components/position/positionjob-maintain'
  import IProcessFlow from 'components/common/i-process-flow'
  export default {
    data () {
      return {
        // 操作类型
        action: null,
        // 填写的信息
        ocDetails: {
          operationType: null,
          effectiveDate: null,
          reason: null,
          name: null,
          remark: null,
          posCategoryId: null
        },
        // 限制选择生效时间
        limitTime: 0,
        // 不同processType对应的operationType
        operationTypeMap: {
          'posCategoryCreateProcess': '0',
          'posCategoryUpdateProcess': '1',
          'posCategoryRepealProcess': '2'
        }
      }
    },
    components: {
      DemandDesc,
      Maintain,
      IProcessFlow
    },
    methods: {
      postFlow () {
        if (!this.ocDetails.name) {
          delete this.ocDetails.name
        }
        return this.ocDetails
      },
      fillIn () {
        this.ocDetails.effectiveDate = new Date(this.ocDetails.effectiveDate)
        this.action = this.identifyAction(this.ocDetails.operationType)
      },
      // 识别动作
      identifyAction (type) {
        return {
          '0': '新建',
          '1': '修改',
          '2': '撤销'
        }[type]
      },
      // 主页进入模式下的获取表单详情
      getBaseInfo () {
        req('getPosCategoryDetail', {
          posCategoryId: this.ocDetails.posCategoryId
        }).then(res => {
          this.limitTime = res.effectiveDate
          // this.ocDetails.name = res.name
          this.ocDetails.remark = res.remark
        })
      },
      // 初始化数据
      init () {
        // admin主页进入的模式下操作
        const routerMode = () => {
          this.getBaseInfo()
          this.action = this.identifyAction(this.ocDetails.operationType)
        }
        // 不同模式下的公共操作
        var operationType = this.$route.query.processType && this.operationTypeMap[this.$route.query.processType]
        var posCategoryId = this.$route.query.posCategoryId || this.ocDetails.posCategoryId
        this.ocDetails.operationType = operationType
        this.ocDetails.posCategoryId = posCategoryId
        // 特定模式下的操作
        this.ocDetails.operationType && routerMode()
      }
    },
    created () {
      this.init()
    }
  }
</script>

<style lang="scss" scoped></style>
