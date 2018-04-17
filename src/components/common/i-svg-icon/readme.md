# SVG 彩色圖標說明

### Attr
参数 | 说明 | 类型 | 默认值
--- | --- | --- | --- |
iconName | 图标名称(详见Notice) | string | -
styleName | 可覆盖svg的style样式 | object | -

### Notice
> 图标制作和命名在阿里`iconfont`站点维护，并与原单色字体图标分开，请找岑杰豪加入群组
> http://www.iconfont.cn/

### 目前iconName列表
> 注意不用输入icon-前缀

![img](./iconNameList.png)

### Demo

```
<template>
  <div class="wrap">
    <ISvgIcon iconName="contract" :styleName="{ width: '20px' }"/>
  </div>
</template>
<script>
  import ISvgIcon from 'components/common/i-svg-icon'
  export default {
    components: {
      ISvgIcon
    }
  }
</script>

```
