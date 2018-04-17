<template>
  <div class="wrap">
    <div style="style" v-if="type==='section'">
      <el-tooltip class="item" effect="dark" :content="info" placement="top" :disabled="status!=='2' || info===''">
        <span :class="[{blue:status==='2'},{cur:status==='2'}]" @click="getFrozenInfo">
          {{label}}<slot name="label"></slot>
        </span>
      </el-tooltip>
    </div>
    <div v-if="type==='table'">
      <el-tooltip class="item" effect="dark" :content="info" placement="top" :disabled="scope.row.status!=='2' || info===''">
        <a :class="[{blue:scope.row.status==='2'},{cur:scope.row.status==='2'}]" @click="getFrozenInfo">{{tableScope.formatter(scope.row,{property:'status'},scope.row.status)}}</a>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import req from 'api/position/occupation'

export default {
  name: 'StatusControll',
  props: {
    // 配置的类型，默认table，片段是section
    type: {
      type: String,
      default: 'table'
    },
    // 如果是section的话，则可以通过label来设置字体
    label: {
      type: String
    },
    // 如果是section的话，则传status
    status: {
      type: String
    },
    // 如果是section的话，需要传id
    id: {
      type: String,
      required: true
    },
    scope: {
      type: Object
    },
    tableScope: {
      type: Object
    },
    bussinessKey: {
      type: String,
      required: true
    },
    // 如果是纯粹span内容的话，则抛出style
    style: {
      type: Object
    }
  },
  data () {
    return {
      info: ''
    }
  },

  methods: {
    getFrozenInfo () {
      if (this.info) {
        return
      }
      let status = this.type === 'section' ? this.status : this.scope.row.status
      if (status !== '2') {
        return
      }
      let bussinessKey = this.type === 'section' ? this.id : this.scope.row[this.bussinessKey]
      req('getFrozenInfo', { bussinessKey }).then(data => {
        this.info = data
      })
    }
  },

  created () {

  }
}
</script>

<style lang="scss" scoped>
.cur{
  cursor: pointer;
}
</style>
