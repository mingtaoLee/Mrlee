## 编制部分前端文件结构

### 一、接口部分
```shell
├──api                                // 接口文件夹
│   ├──compile                        // 编制部分总文件夹
│   │   ├──index.js                   // 通用接口文件，引用名称req
│   │   ├──template.js                // 模板接口文件，引用名称reqTp
│   │   ├──plan.js                    // 计划接口文件，引用名称reqPl，包括计划管理和计划监控
```
### 二、方法部分
```shell
├──utils                             // 方法类
│   ├──compile.js                    // 编制部分方法

```
### 三、组件部分
```shell
├──components                                  // 组件文件夹
│   ├──compile                                 // 编制部分总文件夹
│   │   ├──button                              // 按钮组件类文件夹
│   │   │   ├──new-del-btn.vue                 // 模板管理页面按钮组件，配置写入组件内
│   │   ├──search                              // 搜索组件类文件夹
│   │   │   ├──template-manage-search.vue      // 模板管理页面高级搜索组件
│   │   │   ├──plan-manage-search.vue          // 计划管理页面高级搜索组件
│   │   │   ├──plan-monitor-search.vue         // 计划监控页面高级搜索组件
│   │   ├──table                               // 表格组件类文件夹，如果又lebel属性的表格，抛出属性
│   │   │   ├──template-manage-home-table.vue  // 模板管理页面表格组件
│   │   │   ├──plan-manage-home-table.vue      // 计划管理页面表格组件
│   │   │   ├──plan-monitor-home-table.vue     // 计划监控页面表格组件
│   │   ├──dialog                              // 弹窗组件类文件夹，放不同类型弹窗的外框组件，不包含内容
│   │   ├──tree                                // 树形图组件类文件夹
│   │   ├──form                                // 可重复表单组件类文件夹
```
### 四、页面部分
```shell
├──admin                                       // 个人管理应用
│   ├──pages                                   // 页面
│   │   ├──compile                             // 编制部分总文件夹
│   │   │   ├──template-manage-home.vue        // 模板管理主页组件
│   │   │   ├──plan-manage-home.vue            // 计划管理主页组件
│   │   │   ├──plan-monitor-home.vue           // 计划监控主页组件
│   │   │   ├──new-template.vue                // 新建模板弹窗页面组件
│   │   │   ├──new-plan.vue                    // 新建计划弹窗页面组件
│   │   │   ├──check-template.vue              // 查看模板弹窗页面组件
│   │   │   ├──edite-template.vue              // 编辑模板弹窗页面组件
│   │   │   ├──check-plan.vue                  // 查看计划页面组件
│   │   │   ├──edite-plan.vue                  // 编辑计划弹窗页面组件
│   │   │   ├──normal-plan-details.vue         // 常规计划详细情况弹窗页面组件（查看和编辑）
│   │   │   ├──new-shop-plan-details.vue       // 新小店计划详细情况弹窗页面组件（查看和编辑）
│   │   │   ├──abnormal-plan-details.vue       // 非定制计划详细情况弹窗页面组件（查看和编辑）
│   │   │   ├──plan-details-likeness.vue       // 其他相似小店计划详细情况弹窗页面组件
```

### 五、补充
1. 如果是根据外部传值控制显示隐藏的，组件内用if，外部用 is前缀， 默认为false
2. 网络请求参数统一使用这样的格式：  let params = {} req('urlName', params)
3. 对于新建，修改，撤销，删除的方法名字统一用： newForm, motifyForm, cancelForm，deleteForm
4. 高级搜索统一封装一个函数，例如search（params）过滤高级搜索的数据
5. data、method的参数全部都要加上备注，对于控制div的状态参数统一写一起，不要分开写
6. 高级搜索的选项都保存在searchBox对象中