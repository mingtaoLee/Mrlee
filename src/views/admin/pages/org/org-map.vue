<template>
  <div class="org-map">
    <i-layout fix-aside :aside-padding="0">
      <div slot="aside">
        <org-tree 
        :showFilter="showFilter"
        :treeStyle="treeStyle"
        class="tree"
        @node-click="nodeClick" />
      </div>
      <div slot="section" ref="main">
        <org-chart :root-id="currrentRootId" slider direction="b2t" :ajaxUrls="ajaxUrls"></org-chart>
      </div>
    </i-layout>
  </div>
</template>

<script>
import orgChart from 'components/common/orgchart/index'
import orgTree from 'components/org/public/org-tree'
import ILayout from 'components/common/i-layout'
import calculateAsideHeight from 'mixins/layout/calculate-aside-height'
import { BASE_URL } from '@/config/api'
export default {
  name: 'org-map',
  components: {
    orgTree,
    orgChart,
    ILayout
  },
  mixins: [calculateAsideHeight],
  data () {
    return {
      showFilter: true,
      currrentRootId: '1',
      ajaxUrls: {
        children: `${BASE_URL}/org/atlas/children/`,
        root: 'atlasData',
        detail: 'orgDetail'
      }
    }
  },
  computed: {
    treeStyle () {
      return `height:${this.elHeight}`
    }
  },
  mounted () {
    this.controlHeightWithoutHeader(134)
  },
  methods: {
    nodeClick (data) {
      this.currrentRootId = data.orgUnitId
    }
  }
}
</script>
<style lang="scss" scoped>
.tree{
  margin-top: 15px;
}
</style>
