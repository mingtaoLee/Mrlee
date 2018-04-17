var path = require('path')

function resolve (dir) {
  return path.join(__dirname, '../src/views', dir)
}

var views = {
  'flow': {
    name: 'flow',
    title: '流程中心'
  },
  'admin': {
    name: 'index',
    title: '后台管理'
  },
  'self': {
    name: 'self',
    title: '员工自助'
  }
}

var entries = {}
var pages = {}

for (var view in views) {
  entries[views[view].name] = resolve(`${view}/main.js`)
}
for (var view in views) {
  pages[views[view].name] = resolve(`${view}/index.html`)
}
exports.entries = entries
exports.pages = pages