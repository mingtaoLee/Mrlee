## PositionSelection(职位选择弹窗)组件使用说明

### Attributes

参数 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | --- |
v-model | 弹窗显示控制 | Boolean | - | false
type | 弹窗类型 | String | mini | normal
loaded | 是否初始加载数据 | Boolean | - | false

### Events

事件名称 | 说明 | 回调参数
---|--- | --- |
change | 选中职位确定时候的值 | 选中的项

### 使用示例
```vue
<template>
  <div>
    <div @click="choosePosition">点击</div>
    <position-selection v-model="isShow" @change="change" type="mini"></position-selection>
  </div>
</template>

<script>
  import PositionSelection from 'components/common/position/position-selection'

  export default {
    name: 'Example',
    data () {
      return {
        isShow: false
      }
    },
    components: {
      PositionSelection
    },
    methods: {
      choosePosition:{
        this.isShow = true
      },
      change(chosen){
        console.log(chosen)
        this.isShow = false
      }
    }
  }
</script>

```
