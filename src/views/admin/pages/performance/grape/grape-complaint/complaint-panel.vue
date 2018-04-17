<template>
  <el-tabs v-model="paneName"  @tab-click="handleClick">
    <el-tab-pane label="待处理">
      <grapeComplaint v-if="complaint">
      </grapeComplaint>
    </el-tab-pane>
    <el-tab-pane label="已处理">
      <!-- <grapeComplained v-if="complained"> -->
      <grapeComplained v-if="!complaint">
      </grapeComplained>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import grapeComplaint from './grape-complaint'
  import grapeComplained from './grape-complained'

  export default {
    name: 'complaint-panel',
    components: {
      grapeComplaint,
      grapeComplained
    },
    data () {
      return {
        complained: false,
        complaint: true,
        paneName: ''
      }
    },
    methods: {
      handleClick (tab) {
        if (this.paneName === '1') {
          this.complaint = false
        } else {
          this.complaint = true
        }
      }
    }
  }
</script>

<style scoped>

</style>
