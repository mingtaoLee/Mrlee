<template>
  <el-dropdown
    :hide-on-click="false"
    trigger="click">
    <el-button>
      筛选<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </el-dropdown-item>
      <el-checkbox-group v-model="checkList" @change="handleCheckedListChange">
        <el-dropdown-item
          v-for="(col, idx) of columns.filter(col => !exclude.includes(col.prop))"
          :key="col.label + '-' + col.idx">
          <el-checkbox :label="col.label"></el-checkbox>
        </el-dropdown-item>
      </el-checkbox-group>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      require: true,
      default: []
    },
    config: {
      type: Object,
      default: {}
    }
  },

  data () {
    return {
      checkList: [],
      exclude: this.config.exclude || [],
      checkAll: true,
      isIndeterminate: false
    }
  },

  watch: {
    columns (list) {
      this.checkList = list.map(col => col.label)
    },

    checkList (newList, oldList) {
      this.sift()
    }
  },

  methods: {
    sift () {
      this.$emit('sift',
        this.columns.filter(col => this.checkList.includes(col.label))
      )
    },
    handleCheckAllChange (val) {
      this.checkList = val ? this.columns.map(col => col.label) : this.columns.filter(col => this.exclude.includes(col.prop)).map(col => col.label)
      this.isIndeterminate = false
    },
    handleCheckedListChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.columns.length
      this.isIndeterminate = checkedCount > this.columns.filter(col => this.exclude.includes(col.prop)).length && checkedCount < this.columns.length
    },
    _ () {
      // if (newList.length > oldList.length) {
      //   console.log('新增', newList[newList.length - 1])
      // } else {
      //   console.log('删除', oldList.find(label => !newList.includes(label)))
      // }
    }
  }
}
</script>
