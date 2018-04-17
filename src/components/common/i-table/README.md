# \<i-table/> 和 \<i-table-cell/> 组件使用文档

「一天实现，五天解耦，为通用而生」

![i-table](http://7xshvl.com1.z0.glb.clouddn.com/i-table)

## 1. 简介

😑 一句话概括：可增删改的表格控件。

1. `<i-table/>` 作为处理数据层，通过作用域插槽将处理后的数据传递到 ElementUI 的组件 `<el-table/>`
1. `<i-table-cell/>` 集成了表单的单元格组件。用于数据展示、修改，使用双向数据绑定将修改后的值传递到 `<i-table/>` 进行加工

结构：

```html
<i-table>
  <el-table>
    <el-table-column>
      <i-table-cell/>
    </el-table-column>
  </el-table>
</i-table>
```

### 1.1 以前都用 el-table 写好了，在升级迁移中会带来什么问题？

答：仅需要在已写的 el-table 外再嵌套一层 i-table，el-table-column 内部嵌套 i-table-cell 并按照如下配置即可。原则上并不需要修改已编写的代码。

### 1.2 只想让表格可操作，不想要编辑功能怎么办？

答：不引入 i-table-cell，忽略如下配置中的 setting.editor 即可。

### 1.3 是否开源？

答：仅供 iPeople 内部使用。

### 1.4 看完以下教程还是不会用？

答：[@yijj](http://10.16.85.142/yijj)

### 1.5 对组件的运行机制和设计理念感兴趣？

答：[@luxc1](http://10.16.85.142/luxc1)

## 2. 功能

### 2.1 核心功能

内部维护一个对象，用于存储「增删改」集合

```bash
1.增：可自定义数据数量的上限
2.删：友好的提示
3.改：单行编辑、批量编辑、自定义表单类型
```

### 2.2 周边功能

做了点微小工作

```bash
1.低耦合：el-table 可根据自己的需求使用，i-table 不会屏蔽任何属性或方法
2.高内聚：仅在传入的原始数据基础上做备份处理，并不会改变传入数据本身，有且仅进行数据处理，不进行其他业务逻辑
3.自定制：可通过传参，自定义工具栏按钮，以及按钮对应功能，i-table 暴露了其内部的核心功能和属性供外部使用
4.高性能：数据变动的监听，通过内部维护的标识符判断，抛弃了高消耗的深层次 watch 方式
5.易用性：从「不可编辑表格」到「可编辑表格」仅需一个包裹组件 i-table 和一个内嵌组件 i-table-cell
```

## 3. DEMO

[DEMO](http://localhost:8000/?#/i-table-demo)

## 4. 配置参数

参数 | 说明 | 类型 | 默认值
--- | --- | --- | --- |
title | 表格标题 | String | ''
data | 展示数据 | Array | —
columns | 表头信息 | Array | —
setting | 编辑状态下的表单（editor）和 工具栏按钮对应的功能（toolbar）| Object | —
dev | 开发者模式，为“看不到数据流动就浑身难受”的强迫症患者而设计 | Boolean | false
editable | 决定表格的初始状态是否可编辑 | Boolean | false
showPagebar | 是否现实分页栏 | Boolean | false
info | 配合分页使用 | Object | -
total | 配合分页使用 | Number | -
search | 配合分页以及搜索使用 | Object | -

### 4.1 标题

```js
title: '标题信息'
```

### 4.2 数据

必填，默认为 null 即可

在组件外，通过异步方式拿取数据后，传入组件内进行处理

```js
data: null
```

### 4.3 表格列头

```js
columns: [
  { prop: 'prop0', label: '标题0' },
  { prop: 'prop1', label: '标题1' },
  { prop: 'prop2', label: '标题2' }
]
```

### 4.4 单元格表单

```js
setting: {
  editor: {
    prop0: { type: 'date' },             // 日期选择器
    prop2: {
      type: 'date',
      options: {                         // 附加参数
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    },
    prop6: {
      type: 'select',                    // 下拉选择器
      options: [
        { value: 'value0', label: 'label0' },
        { value: 'value1', label: 'label1' }
      ]
    },
    prop7: {                             // 计数器
      type: 'number',
      options: { min: 1, max: 5 }        // 设置上下限
    },
    prop4: {
      type: 'textarea'                   // 多行文本
    }
}
```

### 4.5 工具栏

```js
setting: {
  toolbar: [{
    text: '添加',                          // 文本
    type: 'success',                      // 样式
    func: vm => vm.createData()           // 增
  }, {
    text: '删除',
    type: 'danger',                       // 样式
    func: vm => vm.deleteData()           // 删
  }, {
    text: '发放',
    func: vm => vm.changeData({           // 改
      data: {
        prop2: 'Midea'
      }
    })
  }, {
    text: '编辑',
    next: '完成',                          // 点击后文本
    func: vm => vm.toggleEditable()       // 切换编辑状态
  }, {
    text: '查看选中的集合',
    func: vm => vm.getMultipleSelection() // 查看选中的行
  }]
}
```

## 5. 数据判定规则

### 5.1 删除已在「后端」中的数据

判定为 delete

![5.1](http://7xshvl.com1.z0.glb.clouddn.com/i-table-1.gif)

### 5.2 修改已在「后端」中的数据

判定为 update

![5.2](http://7xshvl.com1.z0.glb.clouddn.com/i-table-2.gif)

### 5.3 修改已在「后端」中的数据，并最终改为原值

不做任何处理，若已进入 update 队列，则移除

![5.3](http://7xshvl.com1.z0.glb.clouddn.com/i-table-3.gif)

### 5.4 在「前端」创建的数据

判定为 create

![5.4](http://7xshvl.com1.z0.glb.clouddn.com/i-table-4.gif)

### 5.5 在「前端」创建并修改的数据

判定为 create

![5.5](http://7xshvl.com1.z0.glb.clouddn.com/i-table-5.gif)

### 5.6 在「前端」创建并删除的数据

不做任何处理，若已进入 create 队列，则移除

![5.6](http://7xshvl.com1.z0.glb.clouddn.com/i-table-6.gif)

## 6. 需求清单

### 6.1 单元格

- [x] 解耦内嵌表单单元格 i-table-cell
- [x] 下拉菜单字典 [#4](http://10.16.85.142/iHR/iHR-YongHui/issues/4)
- [x] 表单字典  [#4](http://10.16.85.142/iHR/iHR-YongHui/issues/4)
- [x] 时间戳格式转换
- [x] 单选
- [ ] 表单校验 @el-form-item

### 6.2 数据获取/处理

- [x] 解耦 el-table，数据通过作用域插槽让 el-table 展示
- [x] 内部数据以「增删改」集合形式抛出
- [x] 由 toolbar 中的保存决定是否向外抛出数据
- [x] 开放 i-table-cell 插槽，可自定义内部表单
- [x] 由外部组件决定是否向外抛出数据

### 6.3 编辑状态

- [x] 表格处于可编辑时，默认第一行进入编辑状态
- [x] 增加数据时，新增的行进入编辑状态 [#1](http://10.16.85.142/iHR/iHR-YongHui/issues/1)
- [x] 鼠标移出，取消编辑状态
- [x] 表格不可编辑配置
- [x] 某列不可编辑配置
- [ ] 某行不可编辑配置

### 6.4 工具集

- [x] pagination/info 分页/底部信息 [#5](http://10.16.85.142/iHR/iHR-YongHui/issues/5)
- [x] pagesize 分页配置
- [ ] toolbar 自定义配置【升级中】[#6](http://10.16.85.142/iHR/iHR-YongHui/issues/6)
- [ ] operator 右侧操作栏【跟进中】[#3](i-table 表格操作列添加)

### 6.5 开发体验

- [x] 添加 dev 配置，便于使用者在开发阶段查看数据更改。当然，也可直接使用 vue 开发插件
- [x] 字典解耦
- [x] 向下兼容

### 6.6 参数及数据结构调整

- [x] list -> columns [#7](http://10.16.85.142/iHR/iHR-YongHui/issues/7)
- [x] 字典参数、数字、日期及其他拓展统一归类为 display 级 [#7](http://10.16.85.142/iHR/iHR-YongHui/issues/7)

### 6.7 未进入时间表

- [ ] role 权限
- [ ] 动态挂载 i-table-cell
- [ ] 在编辑状态下，点击 tab 在单元格中切换，若在最后一行的最后一列，则自动创建新行
- [ ] 数字格式转换
- [ ] 时间验证 [#8](http://10.16.85.142/iHR/iHR-YongHui/issues/8)

### 6.8 得不到的永远在骚动

1. <del>鼠标失焦边向外抛出数据</del>

---

还有需求？👇

<img src="http://7xshvl.com1.z0.glb.clouddn.com/wechat_pay" alt="提需求" width="250">

## 7. 最后

感谢抽出时间提供技术支持的大佬们，感谢帮我赶业务进度的小伙伴们。

关于组件，若有疑问或需求请 [@ww522413622](http://10.16.85.142/ww522413622)
