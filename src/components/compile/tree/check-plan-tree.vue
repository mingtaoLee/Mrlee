<template>
  <org-tree showFilter @node-click="chooseNode" :rootNodes="rootNodes"></org-tree>
</template>

<script>
/**
 * @prop {Array} rootNodes 虚拟根节点集合
 */
import OrgTree from 'components/org/public/org-tree'
export default {
  name: 'CheckPlanTree',
  components: {
    OrgTree
  },
  props: {
    rootNodes: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    chooseNode (node) {
      this.$emit('nodeClick', node)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
