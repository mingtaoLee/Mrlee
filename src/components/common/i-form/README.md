## iForm组件使用说明

### Events

事件名称 | 说明 | 回调参数
---|--- | --- |
reset | 点击重置时触发 | —
search | 点击搜索时或按下回车键时触发 | —

### 使用试例
```html
<template>
  <div>
    <i-form @reset="reset" @search="search">
      <el-form-item label="审批人">
        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </i-form>
  </div>
</template>
<script>
  import IForm from 'components/common/i-form/i-form.vue'

  export default {
    name: 'i-form-instance',
    components: {
      IForm
    },
    data () {
      return {
        formInline: {
          user: '',
          region: ''
        }
      }
    },
    methods: {
      reset () {},
      search () {}
    }
  }
</script>

```
