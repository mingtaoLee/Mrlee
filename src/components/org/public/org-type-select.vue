<template>
  <div>
    <el-select v-model="temp" @change="sendToOrgTest">
      <el-option v-for="item in orgType" :key="item.value" :value="item.value" :label="item.label">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import reqLib from 'api/org/lib'
export default {
  data () {
    return {
      temp: this.value,
      orgType: []
    }
  },
  props: {
    value: {default: ''}
  },
  methods: {
    getOrgType () {
      reqLib('orgType').then(data => {
        this.orgType = data.map((item, index) => {
          return {
            value: item.orgTypeValue,
            label: item.orgTypeName
          }
        })
      })
    },
    sendToOrgTest (data) {
      this.$emit('input', this.temp)
    }
  },
  watch: {
    value () {
      this.temp = this.value
    }
  },
  created () {
    this.getOrgType()
  }
}
</script>
