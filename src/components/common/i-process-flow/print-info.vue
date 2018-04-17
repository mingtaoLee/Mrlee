<template>
  <i-dialog
    v-model="readyToPrint"
    destroyedWhenClose
    :toolbar="toolbar"
    title="选择打印栏目"
    size="mini"
  >
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <div class="print-info">
      <el-checkbox-group v-model="printList" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="list in filterRepetition" :label="list.name" :key="list.name">{{list.name}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </i-dialog>
</template>

<script>

export default {
  name: 'PrintInfo',
  props: {
    listOptions: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      readyToPrint: false,
      printList: [],

      // 多选框参数
      isIndeterminate: true,
      checkAll: true,

      toolbar: [ {
        text: '取消',
        type: 'default',
        func: (done) => {
          done()
        }
      }, {
        text: '确定',
        type: 'primary',
        func: (done) => {
          done()
          this.$nextTick(() => {
            this.emitPrintList()
          })
        }
      }]
    }
  },
  computed: {
    filterRepetition () {
      let hash = {}
      let filterResult = this.listOptions.reduce((item, next) => {
        hash[next.name] ? '' : (hash[next.name] = true) && item.push(next)
        return item
      }, [])
      return filterResult
    }
  },
  methods: {
    openDialog () {
      this.chooseAll()
      this.readyToPrint = true
    },
    chooseAll () {
      this.cancelAll()
      this.listOptions.map(ele => {
        if (!this.printList.includes(ele.name)) {
          this.printList.push(ele.name)
        }
      })
    },
    cancelAll () {
      this.printList = []
    },
    handleCheckAllChange (val) {
      this.checkAll = val
      if (val) {
        this.chooseAll()
      } else {
        this.cancelAll()
      }
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.listOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listOptions.length
    },
    emitPrintList () {
      let emitData = []
      this.listOptions.map(ele => {
        if (this.printList.includes(ele.name)) {
          emitData.push(ele)
        }
      })
      this.$emit('confirm', emitData)
    }
  }
}
</script>

<style lang="scss">
.print-info{
  .el-checkbox, .el-checkbox + .el-checkbox{
    margin-left: 0px;
    margin-right: 30px;
  }
}
</style>
