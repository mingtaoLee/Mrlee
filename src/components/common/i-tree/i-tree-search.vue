<template>
  <el-select
    @keydown.native.enter="searchTree"
    v-model="nodeId"
    filterable
    remote
    placeholder="请输入关键词"
    @change="handleChange"
    :remote-method="remoteMethod"
    :loading="loading">
    <el-option
      v-for="item in treeNode"
      :key="item.orgUnitId"
      :label="item.orgShortName"
      :value="item.orgUnitId">
    </el-option>
  </el-select>
</template>

<script>
  import reqOrgNode from 'api/org/setting'
  export default {
    data () {
      return {
        treeNode: [],
        nodeId: '',
        loading: false
      }
    },
    mounted () {
    },
    methods: {
      remoteMethod (keyword) {
        if (keyword !== '') {
          this.loading = true
          this.getNodeData(keyword).then(node => {
            this.treeNode = node
            this.loading = false
          })
        } else {
          this.treeNode = []
        }
      },
      getNodeData (keyword) {
        return reqOrgNode('searchData', {name: keyword})
      },
      searchTree () {
        this.emit('search', this.nodeId)
      },
      handleChange (value) {
      }
    }
  }
</script>
