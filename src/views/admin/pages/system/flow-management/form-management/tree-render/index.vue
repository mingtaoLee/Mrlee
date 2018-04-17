<template>
  <span class="tree-expand">
    <span class="tree-label">
        <span>{{DATA.label}}</span>
    </span>
    <span class="tree-btn">
      <i-select 
        :class="'select' + DATA.id" 
        :value="DATA.JurisdictionValue" 
        parameter="WORKFLOW_MENU_TYPE" 
        placeholder="请设置权限" 
        @change="nowChooseValue"
      ></i-select>
    </span>
  </span>
</template>

<script>
export default{
  props: ['NODE', 'DATA', 'STORE'],
  methods: {
    nowChooseValue (value) { // 下拉菜单选值变化
      this.$emit('nowChooseValue', value)
    },
    selectShowOrHidden (value) {
      this.$emit('selectShowOrHidden', value)
    }
  }
}
</script>

<style>

</style>
