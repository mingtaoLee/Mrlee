/**
 * 修改npm包源码bug的脚本文件
 */
const fs = require('fs')
const path = require('path')

// 修改element的动态列变化空白的地方
function fixEleTable () {
  const relativePath = path.join('node_modules', 'element-ui', 'lib', 'element-ui.common.js')
  const absolutePath = path.resolve(__dirname, relativePath)
  try {
    let content = fs.readFileSync(absolutePath, { encoding: 'utf8' })
    const testContent = /if \(_columns\) \{/g
    const fixedData = content.replace(testContent, 'if (_columns.indexOf(column) != -1) {')
    fs.writeFileSync(absolutePath, fixedData)
    console.log('修改element表格可变列成功')
  } catch (e) {
    console.error('修改element表格可变列失败')
  }
}

fixEleTable()

