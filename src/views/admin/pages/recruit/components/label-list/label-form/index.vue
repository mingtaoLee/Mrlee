<template>
  <i-form @reset="reset" @search="search">
    <el-form-item label="标签名称">
      <el-input v-model.trim="param.name"></el-input>
    </el-form-item>
    <el-form-item label="状态" v-if="type !== 'dialog'">
       <i-select v-model="param.status" clearable parameter="IS_VALID" placeholder="请选择"></i-select>
    </el-form-item>
  </i-form>
</template>
<script>
import IForm from 'components/common/i-form/i-form.vue'
import { statusDict } from 'config/dict'
export default {
  name: 'LabelForm',
  components: {
    IForm
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      param: {
        name: '',
        status: ''
      },
      statusDict: statusDict
    }
  },
  mounted () {
    this.reset()
    if (this.type === 'dialog') {
      this.param.status = '1'
    }
  },
  methods: {
    // 重置
    reset () {
      if (this.type === 'dialog') {
        this.param.name = ''
      } else {
        this.param = {
          name: '',
          status: ''
        }
      }
    },
    // 查询
    search () {
      this.$store.commit('MODIFY_LABELFORM', this.param)
    }
  }
}
</script>
