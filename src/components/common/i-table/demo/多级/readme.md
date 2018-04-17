# i-table 动态多级表头

## 1、二级

### 1.1 常规

后端返回数据：

```js
data: {
  parentProp: {
    childProp1: '',
    childProp2: ''
  }
}
```

前端表头结构：

```js
columns: [{
  prop: 'parentProp',
  label: '一级表头标题',
  children: [
    { prop: 'childProp1', label: '二级表头标题1' },
    { prop: 'childProp2', label: '二级表头标题2', display: { dict: '字典' } }
  ]
}],
```

### 1.2 多个相同结构的列

后端返回数据：

```js
data: {
  parentList: [{
    parentProp: '',
    parentLabel: '',
    childProp1: '',
    childProp2: ''
  }]
}
```

前端表头结构：

```js
columns: [{
  parent: 'parentList',   // 数据挂载点
  prop: 'parentProp',     // 一级表头 prop
  label: '{parentLabel}', // 一级表头 label
  children: [
    { prop: 'childProp1', label: '二级表头标题1' },
    { prop: 'childProp2', label: '二级表头标题2', display: { dict: '字典' } }
  ]
}]
```

### 1.3 例子

1. [DEMO 9+](http://10.16.85.135/#/i-table-demo)
1. [后端数据 data](http://10.16.85.142/iHR/iHR-YongHui/blob/itable/src/components/common/i-table/demo/%E5%A4%9A%E7%BA%A7/mock-multiple-data.js)

## 2、动态

1.[动态多级数据格式](http://10.16.85.142/iHR/iHR-YongHui/blob/itable/src/components/common/i-table/demo/%E5%A4%9A%E7%BA%A7/mock-multiple-columns-data.js)

由后端返回 columns

## 3、下个版本

1. 三级表头
1. 多级表头导出
