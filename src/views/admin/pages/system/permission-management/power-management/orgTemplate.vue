<template>
  <div class="wrap p20">
    <i-select-tree
      placeholder=""
      :lazy="true"
      sizeAuto
      :multiple="true"
      dataKey="org"
      nodeKey="orgUnitId"
      v-model="orgUnit.orgs"
      :selectedNode.sync="orgUnit.orgNodes"
      :props="orgProps"
    ></i-select-tree>
  </div>
</template>

<script>
/**
 * @prop {Object} orgUnit 传进来的数据
 */
import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
export default {
  name: 'OrgTemplate',
  components: {
    ISelectTree
  },
  props: {
    orgUnit: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      orgProps: {                                        // 组织下拉树的配置
        children: 'children',
        label: 'orgUnitName'
      },
      data: null,                                        // 下拉列表的数据
      once: false,                                       // 维度, 阻塞数据第一次带入引起的变化
      banOnceChange: true                                // 监听编制维度下面的选择, 阻塞空值引起的变化
    }
  },
  watch: {
    'orgUnit.orgs' (val) {
      this.once && this.handleOrgsChange()
    }
  },
  methods: {
    // 根据不同维度，展示不同下拉树/表
    handleCodeChange (index) {
      // 阻塞第一次代入数据的时候触发这函数
      if (!this.once) {
        this.once = true
        return
      } else {
        this.once = true
      }
      // 若为空和职群职种，则推出，则退出
      if (!index || index === '02') return
      // 在不是职群职种下，判断是否存在适用范围，如果没有，则返回
      if (!this.orgUnit.orgs && index !== '02' && index !== null) {
        this.$message.warning('请先选择适用范围')
        return
      }
    },
    // 重新选择适用范围，重置下面选择
    handleOrgsChange () {
      this.orgUnit.dimensionCode = null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>