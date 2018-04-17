<template>
  <div class="item">
    {{value}}
  </div>
</template>
<script>
import req from 'api/employee/personal'
export default {
  name: 'ItemTemplate',
  props: {
    item: Object
  },
  data () {
    return {
      value: ''
    }
  },
  mounted () {
    if (this.item.value) {
      if (this.item.dict) {
        if (this.item.dict === 'APPLYORG') {
          req('getOrgUnitName', {orgUnitIds: this.item.value})
          .then(res => {
            this.value = res[0].orgUnitName
          })
        } else {
          this.$d(this.item.dict, this.item.value).then(rs => {
            this.value = rs
          })
        }
      } else {
        this.value = this.item.value
      }
    } else {
      this.value = this.item.value === null ? '无' : this.item.value
    }
  }
}
</script>
<style lang="scss" scoped>
.item {
  color: #000;
}
</style>
