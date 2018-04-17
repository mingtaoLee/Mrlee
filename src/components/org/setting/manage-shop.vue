<template>
  <div>
    <el-select
      v-model="shopList"
      value-key="orgShopId"
      multiple
      filterable
      reserve-keyword
      @change="selectChange"
      placeholder="请输入关键词">
      <el-option
        v-for="item in shopListOptions"
        :key="item"
        :label="item.orgShopName"
        :value="item">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import req from 'api/org/combinestore'

export default {
  props: {
    value: Array
  },
  data () {
    return {
      shopList: [],
      shopListOptions: []
    }
  },
  methods: {
    selectChange () {
      let orgShopIdList = this.shopList.map(item => {
        return {orgUnitId: item.orgShopId, orgUnitName: item.orgShopName}
      })
      this.$emit('input', orgShopIdList)
    }
  },
  created () {
    req('querySearch', {codeOrName: this.shopList}).then(data => {
      this.shopListOptions = data
    })
  },
  watch: {
    value () {
      if (this.value && this.value.length) {
        let list = []
        req('querySearch', {codeOrName: []}).then(data => {
          this.value.forEach(valueItem => {
            data.forEach(dataItem => {
              if (valueItem.orgUnitId === dataItem.orgShopId) {
                list.push(dataItem)
              }
            })
          })
          this.shopList = list
        })
      }
    }
  }
}
</script>
