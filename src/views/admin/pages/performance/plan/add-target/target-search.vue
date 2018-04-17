<template>
  <el-select
  v-model="result"
  filterable
  multiple
  remote
  :loading="loading"
  :remote-method="handleRemoteMethod"
  @change="returnSearchData"
  placeholder="输入查找人姓名">
    <el-option v-for="(option, index) in options" 
    :key="index"
    @click.native="handleOptionClick(option)"
    >
      {{option.employeeName}}
    </el-option>
  </el-select>
</template>
<script>
import req from 'api/performance/plan-manage'
let timers = []
export default {
  name: 'target-search',
  props: {
    hasSelectedPeople: Array
  },
  data () {
    return {
      result: [],
      options: [],
      timer: 0,
      loading: false
    }
  },
  methods: {
    getOptions (query, cb) {
      req('searchPerson', { userName: query }).then(res => {
        this.loading = false
        this.dealSearchData(res)
        // cb(res)
        this.options = res
      })
    },
    hasSelected (ele) {
      if (this.hasSelectedPeople.length > 0) {
        this.hasSelectedPeople.forEach(element => {
          if (ele.employeeId === element.employeeId) return true
        })
      }
    },
    dealSearchData (data) {
      if (data.length > 0) {
        data.forEach(element => {
          this.hasSelected(element) ? element.checked = true : element.checked = false
          if (this.hasSelected(element)) this.result.push(element)
        })
      }
    },
    handleRemoteMethod (query, cb) {
      clearTimeout(this.timer)
      if (query !== '') {
        this.timer = setTimeout(() => {
          this.loading = true
          this.getOptions(query, cb)
        }, 300)
      }
    },
    handleOptionClick (option) {
      let obj = {}
      option.checked ? obj = { type: 'del', value: option } : obj = { type: 'add', value: option }
      option.checked = !option.checked
      this.$emit('searchPerson', obj)
    },
    doOneClick (option) {
      const timer = setTimeout(() => {
        let obj = {}
        option.checked ? obj = { type: 'add', value: option } : obj = { type: 'del', value: option }
        this.$emit('searchPerson', obj)
        option.checked = !option.checked
        timers.map(item => clearTimeout(item))
      }, 0)
      timers.push(timer)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
