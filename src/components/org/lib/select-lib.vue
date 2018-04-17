<template>
  <div class="wrap">
    <el-row>
      <el-col :span="8">
        <div class="orgTree">
          <orgtype-tree :treeData="treeData" @tableReceive="tableReceive"></orgtype-tree>
        </div>
      </el-col>
      <el-col :span="16">
        <orgtype-table :orgType="orgType" @tableRowChange="tableRowChange"></orgtype-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import req from 'api/org/lib'
import orgtypeTree from '../public/orgtype-tree.vue'
import orgtypeTable from '../public/orgtype-table.vue'

export default {
  name: 'select-lib',
  components: {
    orgtypeTree,
    orgtypeTable
  },
  props: {
    value: Object
  },
  data () {
    return {
      treeData: [{
        id: -1,
        label: '生态支撑',
        children: []
      }, {
        id: -1,
        label: '共享服务',
        children: []
      }, {
        id: -1,
        label: '专业服务',
        children: []
      }, {
        id: -1,
        label: '客户经营',
        children: []
      }],
      orgType: {}
    }
  },
  mounted () {
    this.getTreeData()
  },
  methods: {
    tableRowChange (row) {
      this.$emit('input', row)
    },
    tableReceive (someData) {
      this.orgType = someData
    },
    // 初始化标准组织树
    getTreeData () {
      req('orgType').then((orgType) => {
        if (Array.isArray(orgType)) {
          for (let i = 0, len = orgType.length; i < len; i++) {
            let obj = {}
            obj.label = orgType[i].orgTypeName
            obj.id = orgType[i].orgTypeValue
            let parent = this.treeData[ Math.floor(i / 2) ] || this.treeData[this.treeData.length - 1]
            parent.children.push(obj)
          }
          // this.$store.commit('org/SET_ORGTYPE', treeData)
        } else {
          this.formatJson(orgType)
        }
      })
      // .catch(() => {
      //   this.treeData = []
      // })
    },
    formatJson (orgType) {
      let treedata = this.treeData
      for (let key in orgType) {
        let obj = {}
        obj.label = orgType[key]
        treedata.push(obj)
      }
    }
  }
}
</script>
