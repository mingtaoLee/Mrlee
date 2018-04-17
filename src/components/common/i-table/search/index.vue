<template>
  <el-input
    class="i-table-search"
    suffix-icon="el-icon-search"
    v-model="searchParam"
    :placeholder="'搜索' + placeholder"
    size="medium"
    :maxLength="$$.input.normalMaxlength"
    @keyup.native.enter="handleSearch"
    @submit.native.prevent>
  </el-input>
</template>

<script>
export default {
  props: {
    search: {
      type: String,
      require: true,
      default: ''
    },

    columns: {
      type: Array,
      default: []
    }
  },

  data () {
    return {
      searchParam: '',
      placeholder: ''
    }
  },

  watch: {
    columns (list) {
      this.getLabel(list)
    },

    search (val) {
      this.getLabel(this.columns)
    }
  },

  created () {
    this.getLabel(this.columns)
  },

  methods: {
    handleSearch () {
      this.$emit('search', this.searchParam)
    },

    getLabel (columns = []) {
      const col = columns.find(col => col.prop === this.search)

      this.placeholder = col ? col.label : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.i-table-search {
  &.el-input {
    width: 100px;
  }
}
</style>
