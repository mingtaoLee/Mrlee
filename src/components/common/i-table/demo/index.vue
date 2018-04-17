<!-- http://10.16.85.135/#/i-table-demo -->

<template>
  <div class="i-table-demo">
    <h1>I Table Demo
      <span class="number">{{ version }}</span>
    </h1>

    <section class="card">
      <!-- <h2>0. 快速入门清单
        <small>其实看了也入不了门，踏踏实实从1-1开始吧</small>
      </h2>
      <article class="api-list">
        <div class="api">
          <h3>0-1 i-table 属性</h3>
          <ul>
            <li><code>title</code> 表格标题</li>
            <li><code>columns</code> 表头信息</li>
            <li><code>data</code> 表格数据</li>
            <li><code>info</code> 分页信息</li>
            <li><code>total</code> 数据总量</li>
            <li><code>showPagebar</code> 分页条</li>
            <li><code>editable</code> 编辑模式</li>
            <li><code>disable</code> 不可编辑</li>
            <li><code>search</code> 搜索条件</li>
            <br>
            <li><code>setting.toolbar</code> 工具栏</li>
            <li><code>setting.operator</code> 侧边栏</li>
            <li><code>setting.editor</code> 编辑表格</li>
            <li><code>setting.export</code> 导出</li>
            <li><code>setting.import</code> 导入</li>
            <br>
            <li><code>columnsExt</code> 表头拓展</li>
            <li><code>renderColumns</code> 动态表头</li>
            <li><code>multiple</code> 多级表头</li>
            <li><code>header</code> 根据 data 逆推 columns</li>
            <br>
            <li><code>dev</code> 开发者模式</li>
          </ul>
        </div>

        <div class="api">
          <h3>0-2 i-table 方法/事件</h3>
          <ul>
            <li><code>createData</code> 新增一行数据</li>
            <li><code>deleteData</code> 删除一行数据</li>
            <li><code>saveData</code> 保存数据，检查异常，触发 @save 和 @clone</li>
            <br>
            <li><code>toggleEditable</code> 切换编辑状态</li>
            <li><code>getMultipleSelection</code> 获取选中的行对象集合</li>
            <li><code>checkError</code> 检查校验结果，返回异常数量</li>
            <br>
            <li><code>@save</code> 返回增删改集合</li>
            <li><code>@clone</code> 返回渲染层数据</li>
            <li><code>@loaded</code> 初始化完毕之后返回 i-table 实例</li>
            <br>
            <li><code>@pageSizeChange</code> 监听分页信息 pageSize 的变化</li>
            <li><code>@pageIndexChange</code> 监听分页信息 parseIndex 的变化</li>
          </ul>
        </div>

        <div class="api">
          <h3>0-3 tableScope 属性/方法</h3>
          <ul>
            <li><code>clone</code> 用于视图渲染</li>
            <li><code>columns</code> 在多级表头模式下使用</li>
            <li><code>loading</code> 加载情况</li>
            <br>
            <li><code>formatter</code> 数据转换</li>
            <li><code>rowClickHandler</code> 行点击事件</li>
            <li><code>selectionChangeHandler</code> 选择事件</li>
          </ul>
        </div>

        <div class="api">
          <h3>0-4 i-table-cell 相关</h3>
          <ul>
            <li><code>@change</code> 数据变动时触发，返回行对象 row、行属性 col、属性值 val</li>
            <li><code>validate</code> 执行校验，返回 true 表示校验通过</li>
          </ul>
        </div>
      </article> -->

      <span>截至目前，共 <b class="number keystone">{{ count }}</b> 个 DEM☹ 。gitlab 文档已停止维护，以该页文档为准</span>
    </section>

    <section
      v-for="(demos, i) of demoList"
      :key="i"
      class="card">
      <h2>{{ +i+1 }}. {{ descList[i].h2 }}
        <small>{{ descList[i].small }}</small>
      </h2>
      <ul class="demo-list">
        <li
          v-for="(demo, key, j) of demos"
          :key="key"
          :class="['demo', 'demo-' + (+i+1), 'demo-' + (+i+1) + '-' + (+j+1)]">
          <component :is="key"/>
          <article>
            <p>{{ descList[i].demo[j].p }}
              <ul v-for="(li, t) of descList[i].demo[j].li" :key="li">
                <li>{{ +t+1 }}. {{ li }}</li>
              </ul>
            </p>
            <el-button type="text" @click.native="linkToDemo(i, j)">源码</el-button>
          </article>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import Demo1 from './入门'
import Demo2 from './工具'
import Demo3 from './转换'
import Demo4 from './分页'
import Demo5 from './操作'
import Demo6 from './编辑'
import Demo7 from './导出'
import Demo8 from './导入'
import Demo9 from './多级'
import Demo10 from './其他'

const demoList = [
  Demo1,
  Demo2,
  Demo3,
  Demo4,
  Demo5,
  Demo6,
  Demo7,
  Demo8,
  Demo9,
  Demo10
]

export default {
  data () {
    return {
      version: 'v1.9.17',
      route: ['入门', '工具', '转换', '分页', '操作', '编辑', '导出', '导入', '多级', '其他'],
      demoList,
      descList: [{
        h2: '入门',
        small: '纯展示表格，便于统一样式以及规范',
        demo: [
          {
            p: '若无特殊需求，推荐使用 v-for + table.columns',
            li: [ '通过 $$ 应用常量' ]
          },
          { p: '若由于业务需要，或者个人偏好而未使用 v-for 渲染表格列，完全可以自己逐行编写，i-table 提供了向下兼容方案，请放心食用' },
          { p: '当然，也支持上述两种的混合写法' },
          { p: 'i-table 支持同步或者异步挂载，但是需要注意的是，在配置 table 时，请务必加上 data 参数，异步场景下 data: null 即可。以便于 i-table 监听到 data 的变化从而渲染视图层' },
          {
            p: '需要在 el-table 上绑定其提供的 @selection-change 事件，并且通过回调和传入 tableScope 的方式，让 i-table 能够监听 el-table 上的选择事件',
            li: [ 'ps：可通过 getMultipleSelection 获取选中的行对象' ]
          },
          { p: '需要在 el-table 上绑定其提供的 @row-click 事件，同上原理，让 i-table 能够监听 el-table 上的点击事件' },
          { p: '需要在 el-table 上绑定其提供的 @current-change 事件，同上原理，让 i-table 能够监听 el-table 上的单选事件' },
          { p: '只需要监听 loaded 事件，就能在回调中拿到 i-table 的实例，做任何事情' }
        ]
      }, {
        h2: '工具',
        small: '提供了统一的工具栏配置入口，方便绑定自定义函数或者调用 i-table 内部方法',
        demo: [
          { p: '通过调用 i-table 实例的 createData 方法，创建数据' },
          { p: '通过调用 i-table 实例的 deleteData 方法，删除数据' },
          { p: '通过调用 i-table 实例的 getMultipleSelection 方法，获取选中的数据' },
          { p: '随意组合或自定义方法' },
          {
            p: '工具栏分为三种状态',
            li: [
              '可见可用（默认）',
              '不可见（源码中可见🌝）',
              '不可用'
            ]
          },
          { p: '添加 icon 配置' },
          { p: '' },
          { p: '' }
        ]
      }, {
        h2: '转换',
        small: '需定义对应的字段规则，并挂载 formatter 方法，即可实现字典、时间转换',
        demo: [
          {
            p: '',
            li: [
              '配置字段规则',
              '每一列需要调用 :formatter 实现视图上的字典转换'
            ]
          },
          { p: '若未使用 v-for 渲染，使用方法也是类似的，在 columns 配置转换规则 + 在 el-table-column 上逐列挂载 :formatter 即可' },
          {
            p: '只需符合 yyyy MM dd hh mm ss SSS 规范即可，对应“年、月、日、时、分、秒、毫秒”',
            li: [
              `默认为 ${this.$$.format.date.default}`,
              '不改变返回的时间戳本身，仅在渲染层做转换'
            ]
          },
          {
            p: '自定义混合有时候会迟到，但一定不会缺席',
            li: [
              'display.mixin = (row, col) => row[col]'
            ]
          }
        ]
      }, {
        h2: '分页',
        small: '不必维护分页相关的变量，仅需自行编写请求函数，并挂载返回的数据即可',
        demo: [
          {
            p: '所见即所得。通过简单的配置，熟悉的分页栏即所现。',
            li: [
              '配置结构与返回的后端数据一致，即 { data, info, total }',
              '分别可初始化为 null, null, 0',
              '令分页栏可见 showPagebar: true'
            ]
          },
          {
            p: '在 info 下设置自己喜欢的参数，便能如愿，如本例 { pageIndex: 2, pageSize: 5 }',
            li: [
              '那么如果 pageSize: 3 而此处的下拉选项只有 [1, 5, 8, 10] 呢？i-table 会自动将 3 纳入到选项中，默默的帮你处理一些麻烦的事',
              '无容错机制，因此使用时，请注意实际规范，感谢'
            ]
          },
          {
            p: '不可见也可得。i-table 隐藏了分页操作的部分细节，若有搜索需求，仅需将搜索条件挂载到 table.search 即可，i-table 便能监听到搜索请求，从而通过事件，隐式调用外层方法，触发请求函数。',
            li: [
              '原因：若挂载的请求条件 search 已被双向数据绑定，vue 的监听将会影响 i-table 内部判定',
              '解决：通过解构的方式，实现浅拷贝，如： table.search = { ...search }'
            ]
          }
        ]
      }, {
        h2: '操作',
        small: '主要用于查看数据详情、前后端交互',
        demo: [
          {
            p: '简单操作',
            li: [
              '搭配 i-table-operator 食用味道更佳'
            ]
          },
          {
            p: '行操作分为四个状态',
            li: [
              '可用（默认）',
              'disable：灰色字体呈现',
              'hidden：占据文档流但不显示',
              'empty：不占据文档流'
            ]
          },
          { p: '在 show() 中返回对应的 message' },
          { p: '配置 icon' },
          { p: '不同语义不同类型' }
        ]
      }, {
        h2: '编辑',
        small: '从“可编辑表格”出发，到“通用表格”为止',
        demo: [
          {
            p: '由页面级控制表格编辑状态：',
            li: [
              'editor 中配置相应的表单',
              'editable: true 让表格默认为编辑模式',
              '绑定 el-table 提供的 @row-click'
            ]
          },
          { p: '可自定义下拉选项的值，或由后端返回，至于字典转换，会由 i-table 内部完成' },
          { p: '可通过 options 配置可选时间' },
          { p: '混合写法' },
          { p: '提供根级 disable 禁用表格编辑' },
          { p: '提供列级 disable 禁用单列编辑' },
          {
            p: '该栗则通过自定义工具栏按钮控制（以上其他栗子由 editable 全局默认进入编辑状态）',
            li: [
              '开启 dev: true 后，可通过控制面板看到表格内的数据变动',
              '点击“完成”获取表格内的数据'
            ]
          },
          {
            p: '由页面级的按钮触发 i-table 抛出数据',
            li: [
              '通过 ref 的方式，由父触发子内部的 saveData 方法，从而抛出内部数据（或者参照1-8在 loaded 中拿到 i-table 实例',
              '监听 @save 抛出的数据为「增删改」集合',
              '监听 @clone 抛出的数据为内部所有集合'
            ]
          },
          {
            p: '注册 @change 监听单元格数据的变动（可在控制面板中查看）',
            li: [
              '返回的对象为 { row, col, val }，其中 row 为行对象，col 为列的 prop 属性，val 为 row[col]',
              '若需要绑定自定义事件，可以在 options 中设置 change: () => fn'
            ]
          },
          {
            p: '不只是可编辑单元格',
            li: [
              'type: \'button\' 设置为文本按钮',
              'func: (row, col) => fn 设置点击事件，默认返回行对象 row，列属性 col',
              '文本按钮的列，不进入编辑模式'
            ]
          },
          {
            p: '千呼万唤始出来的表单校验',
            li: [
              'i-table-cell 通过 validate 进行单元格校验',
              'i-table 执行 checkError 返回未通过校验的单元格数量，为 0 则表示无错误'
            ]
          },
          { p: '使用技巧' }
        ]
      }, {
        h2: '导出',
        small: '',
        demo: [
          {
            p: '详见源码',
            li: [
              '需要引入 req 相应的路由信息',
              '需要挂载 el-table 的实例'
            ]
          },
          {
            p: '当 url 中带有参数变量的时候使用',
            li: [
              '在 param 函数中，返回带有参数信息的对象'
            ]
          }
        ]
      }, {
        h2: '导入',
        small: '',
        demo: [
          { p: '测试中' }
        ]
      }, {
        h2: '多级',
        small: '',
        demo: [
          {
            p: 'multiple: ture 开启多级模式',
            li: [
              '表头的渲染需要对 tableScope.columns 进行 v-for 遍历',
              'columns 下的 parent 配置，对应的是 data 数据中，动态表头的挂载点，用于告知 i-table 在何处取表头数据，进行不定列数的表格展示',
              'label 可通过 {param} 设置为变量，i-table 在上述的遍历过程中，会将 data 中的标题载入'
            ]
          },
          {
            p: '参考第 6 章'
          },
          {
            p: '参考 6-11'
          },
          {
            p: '之所以需要反扁平化处理，是由于渲染时，需要对数据进行扁平化字段拼接才能让 el-table 理解每一个唯一 property 对应的数据',
            li: [
              '当需要从表格中取回数据时，i-table 会依照 table.multiple 判定是否需要做反扁平化处理',
              '返回的数据为 clone 的层级拷贝，因此无法通过操作返回值来修改 clone'
            ]
          },
          {
            p: 'columns 由后端返回',
            li: [
              '通过配置 columnsExt 对 columns 进行补充，比如样式、转换格式等'
            ]
          }
        ]
      }, {
        h2: '其他',
        small: '',
        demo: [
          { p: '筛选' },
          { p: '搜索' }
        ]
      }]
    }
  },

  methods: {
    linkToDev () {
      window.open('http://localhost:8000/#/i-table-demo', '_blank')
    },

    linkToDemo (i, j) {
      window.open(
        'http://10.16.85.142/iHR/iHR-YongHui/blob/dev/src/components/common/i-table/demo/' +
          this.route[i] +
          '/' + ++j +
          '.vue',
        '_blank'
      )
    }
  },

  computed: {
    count () {
      return demoList.reduce((list, demos) => list.concat(
        Object.keys(demos).map(key => key)
      ), []).length
    }
  },

  components: {
    ...Demo1,
    ...Demo2,
    ...Demo3,
    ...Demo4,
    ...Demo5,
    ...Demo6,
    ...Demo7,
    ...Demo8,
    ...Demo9,
    ...Demo10
  }
}
</script>

<style lang="scss" scoped>
$color: #4688f1;

@mixin full-width {
  width: 100% !important;
}

.i-table-demo {
  padding: 0 20px;
  box-sizing: border-box;

  h1, h2, h3 {
    padding: 10px 0;
  }
  h1 {
    padding: 40px 0;
    font: {
      size: 2rem;
      weight: 600;
    }
  }
  h2 {
    font: {
      size: 1.4rem;
      weight: 600;
    }
  }
  h3 {
    font: {
      size: 1rem;
      weight: 500;
    }
  }

  code {
    padding: 2px 6px;
    border-radius: 4px;
    background-color: #f9fafc;
    border: 1px solid #eaeefb;
  }

  .number {
    color: $color;
  }
  .keystone {
    font-size: 30px;
  }
  .link {
    cursor: pointer;
    text-decoration: underline wavy $color;
  }

  section {
    padding: 10px;
    > h2 {
      border-bottom: 2px dashed #eee;
      small {
        color: #5e6d82;
        font: {
          weight: 500;
          size: .8rem;
        }
      }
    }

    .api-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 0 -10px 10px;
      .api {
        width: 25%;
        padding: 10px;
        border-right: 1px solid #eee;
        box-sizing: border-box;
        @media screen and (max-width: 1000px) {
          width: 50%;
          &:nth-child(2n) {
            border: none;
          }
        }
      }
      .api:last-child {
        border: none;
      }
      li {
        line-height: 24px;
      }
    }

    .demo-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .demo {
        margin: 20px 0;
        width: 49%;
        @media screen and (max-width: 768px) {
          width: 100%;
        }
        article {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 10px;
          p {
            color: #5e6d82;
            flex: 0 0 90%;
            border-right: 1px solid #eee;
            padding-right: 8px;
            box-sizing: border-box;
            font-weight: 400;
          }
          > button {
            padding: 0;
          }
        }
      }
    }

    .demo-6-11 {
      @include full-width;
    }
    .demo-9 {
      @include full-width;
    }
  }
}
</style>
