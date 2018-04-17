# ihr

> ihr

## 约定与规范

### 样式

* 使用sass预处理
* vue文件下的样式统一加上`scoped`作用域
* 需要覆盖全局的样式写在styles文件夹下, 并在index.scss中引入（如：element.scss覆盖element-ui的样式）
* 可以使用flex

### js规范

使用standard标准， 建议在编辑器中安装eslint插件
如果有特殊情况要使用第三方的js，可允许添加上 /* eslint-disable */

### 异步流

使用`Promise`处理异步流

### GIT工作流

> 每个模块单独建一个分支， 开发者将代码提交到自己所负责的模块分支下， 之后模块负责人在每天的约定时间提交对 `dev分支`的merge request，在检查过代码并处理好代码冲突之后将大家当天的代码合并到`dev分支`，每开发出一个稳定版本后提交到`master分支`并发布上线。

### 公共资源

每个开发人员修改过公共资源（包括公共样式、公共函数、公共组件）后，需要第一时间在群上通知其他人，公共函数与公共组件需要写上注释。

### 联调

与后端人员联调时，由于每人连的IP都不一样，为了避免频繁的冲突，~~每个人都需要在本地新建/config/proxy.js文件~~,proxy.js文件不受版本控制，请不要提交该文件到远程仓库上，如果发现该文件受到git版本控制，运行git rm --cached config/proxy.js,proxy里的格式示例：

```
var proxyTable = {
  '/api': {
    target: 'http://10.73.15.72:8080',
    changeOrigin: true,
    pathRewrite: {
      '/api': '/'
    }
  }
}

module.exports = proxyTable

```

## 目录结构
```shell
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   │   ├── common             // 通用组件
│   │   ├── employee           // 人事模块组件
│   │   ├── flow               // 流程模块组件
│   │   ├── org                // 组织模块组件
│   │   ├── performance        // 绩效模块组件
│   │   ├── position           // 职位模块组件
│   ├── directives             // 全局指令
│   ├── filters                // 全局filter
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── views                  // 入口文件夹
│   │   ├── admin              // 后台管理
│   │   │   ├── pages          // 页面
│   │   │   ├── router         // 路由
│   │   │   ├── store          // 状态
│   │   ├── flow               // 流程中心
```

## 公共样式说明
```shell
├── styles                     // 样式文件
│   ├── commom.scss            // 主题相关公共样式
│   ├── element.scss           // 改写elementUI组件样式
│   ├── index.scss             // 样式入口文件
│   ├── mixin.scss             // 混合样式@minxin
│   ├── public.scss            // 公共样式
│   ├── reset.scss             // css初始化文件
│   ├── vars.scss              // 主题变量文件
```

## Build Setup

``` bash
# clone
git clone git@10.16.85.142:iHR/iHR-YongHui.git

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
