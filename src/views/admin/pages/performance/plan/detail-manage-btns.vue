<template>
  <main>
    <el-button type="primary" @click="mainBtnClick" v-if="showMainBtn">{{btnText}}</el-button>
    <el-button type="primary" v-if="status === '0' || status === '1' || status === '2'" @click="addTargetClick">设置考核对象</el-button>
    <el-button type="primary" v-if="(status === '1' || status === '2')" @click="addAssement">设置考核关系</el-button>
    <el-button type="primary" v-if="status === '1' || status === '2'">发送消息提醒</el-button>
    <el-button type="primary" v-if="Number(status) > 1">导出</el-button>
    <el-dropdown split-button type="primary" class="more" v-if="status === '1'" @command="handleCommand">
      更多
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="0">导入</el-dropdown-item>
        <el-dropdown-item :command="1">导出</el-dropdown-item>
        <el-dropdown-item :command="2">删除</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </main>
</template>

<script>
import {btnTextDict} from '@/config/dict'
export default {
  name: 'detailManageBtns',
  props: {
    status: {
      required: true
    },
    isCalculateByChildren: String
  },
  data () {
    return {
      btnText: '',
      clickStatus: ''
    }
  },
  methods: {
    mainBtnClick () {
      let status = Number(this.status)
      // if (status < 6) status += 1
      // this.$emit('update:status', String(status))
      this.$emit('statusChange', status)
    },
    handleCommand (val) {
      this.$emit('moreClick', val)
    },
    addTargetClick () {
      this.$emit('addTarget')
    },
    addAssement () {
      this.$emit('addAssement')
    }
  },
  created () {
    this.btnText = btnTextDict[this.status]
  },
  computed: {
    showMainBtn () {
      if (Number(this.status > 5)) {
        return false
      } else if (this.status === '1' || this.status === '2') {
        if (this.isCalculateByChildren === 'Y') {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    }
  },
  watch: {
    status (val) {
      this.btnText = btnTextDict[val]
      this.clickStatus = Number(this.status)
    }
  }
}
</script>
<style lang="scss" scoped>
// main {
//   margin-left: 40px;
// }
// .more {
//   margin-left: 10px;
// }
</style>
