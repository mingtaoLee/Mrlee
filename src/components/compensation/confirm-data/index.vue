<template>
  <div>
    {{confirmLabel}}
    <i-select v-model="selected" :async="false" :options="confirmOptions" @change="handleChange"></i-select>
  </div>
</template>
<script>
  export default {
    name: 'ConfirmData',
    props: {
      isConfirm: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      confirmLabel (value) {
        console.log(this.isConfirm)
        return this.isConfirm ? '确认无误：' : '取消确认：'
      }
    },
    data () {
      return {
        selected: 'Y',
        confirmOptions: [
          { label: '已选数据', value: 'N' },
          { label: '查询数据', value: 'Y' }
        ]
      }
    },
    created () {
      this.$eventBus.$on('setCancelConfirmSelected', (selected) => {
        this.selected = selected
      })
    },
    methods: {
      handleChange (value) {
        this.$eventBus.$emit('cancelConfirmChange', value)
      }
    }
  }
</script>
<style></style>
