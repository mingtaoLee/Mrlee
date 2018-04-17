## iLayout组件使用说明
### 适用场景
- 窗口内总体布局，包含header、aside、section三部分的各自组合

### props
参数 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | --- |
height | 直接定义的高度 | Number | - | 0
eliminateHeight | 剔除导航栏、面包屑等高度 | Number | - | 92
toggleAside | 显示左侧aside的切换按钮 | Boolean | - | true
asideWidth | 左侧aside的宽度 | Number | - | 273
besideWidth | 右侧beside的宽度 | Number | - | 0
asideHeight | 左侧aside的高度，不传则默认自适应高度 | Number | - | -
fixAside | fix左侧aside，宽高不在变化 | Boolean | false | -
panelMinWidth | 整个面板的最小宽度 | Number | - | 600
besideMinWidth | 右侧区块的最小宽度 | Number | - | 600
margin | 不同区块之间的margin | Number | - | 15
titlePadding | 区块上标题的padding | Number | - | 10
padding | 区块内的padding | Number | - | 10
asideKey | aside的keyg | String | - | ''
asidePadding | aside的padding,可覆盖padding | Number | - | -1
headerKey | header内的key | String | - | ''
headerPadding | header内的padding,可覆盖padding | Number | - | -1
sectionKey | section内的key | String | - | ''
sectionPadding | section内的padding,可覆盖padding | Number | - | -1
borderWidth | border的宽度 | Number | - | 1
borderColor | border的颜色 | String | - | #e0e0e0
backgroundColor | 背景颜色 | String | - | #fff

### 使用示例
##### 一、左侧aside（如树形图）、右侧上header（如高级搜索）、右侧下section（如展示表格）
```html
<template>
  <i-layout>
    <my-component-one slot="aside"/>
    <my-component-two slot="header" />
    <my-component-three  slot="section" />
  </i-layout>
</template>
```
##### 二、左侧aside（如树形图）、右侧section（如展示表格）
```html
<template>
  <i-layout>
    <my-component-one slot="aside"/>
    <my-component-three  slot="section" />
  </i-layout>
</template>
```
##### 三、上侧header（如高级搜索）、下侧section（如展示表格）
```html
<template>
  <i-layout>
    <my-component-two slot="header" />
    <my-component-three  slot="section" />
  </i-layout>
</template>
```
##### 四、整个面板section（如展示表格）
```html
<template>
  <i-layout>
    <my-component-three  slot="section" />
  </i-layout>
</template>
```
##### 四、如果有标题内容的话
```html
<template>
  <i-layout>
    <span slot="aside-title">这是aside的title</span>
    <my-component-one slot="aside"/>

    <span slot="header-title">这是header的title</span>
    <my-component-two slot="header" />

    <span slot="section-title">这是section的title</span>
    <my-component-three  slot="section" />
  </i-layout>
</template>
```
