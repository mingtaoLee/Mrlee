<template>
  <div>
    <el-autocomplete
      v-model="selectValue"
      placeholder="请选择内容"
      @select="select"
      value="costCenterCode"
      :fetch-suggestions="querySearch">

      <template slot-scope="props">
        <div @click="handleOptionClick(props.item)" class="name">{{ props.item.costCenterCode + '：' + props.item.costCenterName }}</div>
      </template>

      <i slot="suffix" @click="clearSelect" class="close-icon el-icon-close"></i>
    </el-autocomplete>
  </div>
</template>

<script>
  import req from 'api/org/setting'
  export default {
    name: 'OrgCostCenter',
    props: {
      value: String
    },
    data () {
      return {
        selectValue: this.value,
        // 仅供展示code+name的变量
        readOnlyValue: ''
      }
    },
    watch: {
      value () {
        this.selectValue = this.readOnlyValue
      }
    },
    methods: {
      // 模糊搜索
      querySearch (queryString, callback) {
        req('costCentral', {codeOrName: queryString}).then(data => {
          callback(data)
        })
      },

      // 选择
      select (item) {
        let value = item.costCenterCode
        this.readOnlyValue = item.costCenterCode + ':' + item.costCenterName
        this.$emit('input', value)
      },

      // 点击下拉菜单元素
      handleOptionClick (item) {
        this.$emit('option-click', item)
        req('valiDateCostCentral', {costCenterCode: item.costCenterCode}).then(data => {
          if (data === true) {
            this.$message({
              type: 'info',
              message: '成本中心' + item.costCenterCode + '已被其他组织使用'
            })
          }
        }).catch(() => {
          console.log('成本中心不能为空')
        })
      },

      // 点击×号
      clearSelect () {
        this.$emit('clear-select')
      }
    }
  }
</script>
<style lang="scss" scoped>
.el-input {
  .close-icon {
    display: none;
    cursor: pointer;
  }
  &:hover {
    .close-icon {
      display: inline-block;
    }
  }
}

</style>
