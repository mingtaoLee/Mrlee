> orgchart.jquery.js 文档：
> https://github.com/dabeng/OrgChart.js

### 简介
- 简单封装了orgchart-jquery版本插件
- 由于官方疏于维护，本组件定制化较高，后期考虑更改部分源码
- 具体API请参照官方
- 由于插件高度耦合JQ，故项目JQuery为全局引入,以使插件可用。若有更佳方案后期尽量模块化引入


---
```
//点击某个节点使视图以其为中心, 只在缩放比为1时候生效
$node.on('click', function (event) {
  if (!$(event.target).is('.edge, .toggleBtn')) {
    var $this = $(this)
    locateNode($this)
  }
})

//定位该元素为中心,只在缩放比1时可用，暂时取消
let locateNode = ($this) => {
  var $chart = $this.closest('.orgchart')
  $chart.css('transform', 'matrix(1, 0, 0, 1, 0,0)')
  var newX = window.parseInt(($chart.outerWidth(true) / 2) - ($this.offset().left - $chart.offset().left) - ($this.outerWidth(true) / 2))
  var newY = window.parseInt(($chart.outerHeight(true) / 2) - ($this.offset().top - $chart.offset().top) - ($this.outerHeight(true) / 2))
  $chart.css('transform', 'matrix(1, 0, 0, 1, ' + newX + ', ' + newY + ')')
  setTimeout(() => {
    $chart.css('transform', 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + newX + ', ' + newY + ', 0, 1) rotate(180deg) scale(1,1)')
  }, 200)
}
```