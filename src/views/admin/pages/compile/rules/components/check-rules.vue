<template>
  <i-dialog v-model="ifShow" title="查看规则信息">
    <div class="top-basic-info">
      <div class="top-basic-info-left">
        <p class="mb10">规则名称&nbsp;:{{row.ruleName}}</p>
        <p class="mb10">状态&nbsp;:{{row.ruleStatus}}</p>
        <p class="mb10">所属集群&nbsp;:{{row.clusterCode}}</p>
        <p class="mb10">业态&nbsp;:{{row.businessType}}</p>
        <p class="mb10">标准小店编码&nbsp;:{{row.orgStandardCode}}</p>
        <p class="mb10">标准小店名称&nbsp;:{{row.orgStandardName}}</p>
      </div>
      <div class="top-basic-info-right">
        <p class="mb10">职务名称&nbsp;:{{row.posTitleName}}</p>
        <p class="mb10">日均销售额范围（万）&nbsp;:{{row.saleLimit}}</p>
        <p class="mb10">编制下限&nbsp;:{{row.saleLowerLimit}}</p>
        <p class="mb10">编制上限&nbsp;:{{row.saleUpperLimit}}</p>
        <p class="mb10">初始化&nbsp;:{{row.isInit}}</p>
      </div>
    </div>
  </i-dialog>
</template>

<script>

export default {
  name: 'CheckRules',
  components: {

  },
  props: {
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      ifShow: false
    }
  },

  created () {

  },

  methods: {
    openDialog () {
      this.ifShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .top-basic-info {
    width:100%;
    display: flex;
    overflow-y:auto;
    flex-direction: row;
    .top-basic-info-left {
      margin-right: 20px;
      width: calc(50% - 20px);
    }
    .top-basic-info-right{
      width: 50%;
    }
  }
</style>
