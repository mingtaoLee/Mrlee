<template>
   <el-tree
     class="tree"
     :data="treeData"
     @node-click="treeNodeClick"
     default-expand-all
     :highlight-current="highlightCurrent"
    ></el-tree>
</template>

<script>
export default {
  name: 'orgType-tree',
  data () {
    return {
      highlightCurrent: true
    }
  },
  methods: {
    treeNodeClick (data, node) {
      this.$emit('tableReceive', data)
    }
  },
  props: ['treeData']
}
</script>