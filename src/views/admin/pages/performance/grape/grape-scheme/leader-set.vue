<template>
  <div>
    <div class="leader-name mb20" >
      <span>直接上级:</span><span v-if="leader">{{leader.employeeName}}</span><i 
      class="iconfont icon-username" 
      @click="selectPerson" 
      style="cursor: pointer"></i>
    </div>
    <el-table :data="tableData">
      <el-table-column v-for="(col, index) in tableConfig" :label="col.label" :key="index" :prop="col.prop"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'leader-set',

  props: ['tableData', 'leader'],

  data () {
    return {
      tableConfig: [
        {label: '姓名', prop: 'staffName'},
        {label: '工号', prop: 'staffCode'},
        {label: '上级姓名', prop: 'leaderName'},
        {label: '上级工号', prop: 'leaderCode'}
      ]
    }
  },

  methods: {

    selectPerson () {
      this.$emit('selectPerson')
    }

  }
}
</script>
<style lang="scss" scoped>
</style>
