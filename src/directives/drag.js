export default {
  bind: (el, binding) => {
    // todo这个指令针对element的dialog窗口的，需要修改其中的style
    el.style.overflow = 'visible'
    let dialog = el.getElementsByClassName('el-dialog')[0]
    if (dialog) {
      dialog.style.margin = '0px'
    } else {
      return
    }

    // 判断不是窗口头部或尾部则不移动
    let moveClassName = [
      'el-dialog__header',
      'el-dialog__title',
      'dialog-footer'
    ]
    moveClassName.forEach(ele => {
      let move = dialog.getElementsByClassName(ele)[0]
      if (move) {
        move.style.cursor = 'move'
      } else {
        return
      }
    })

    dialog.onmousedown = function (e) {
      if (!moveClassName.includes(e.target.className)) return
      let offsetY = e.offsetY
     // 鼠标按下，计算当前元素距离可视区的距离
      let mouseBeforeX = e.clientX
      let mouseBeforeY = e.clientY
      // 去除px字符且转换为数字
      let targetBeforeX = Number(dialog.style.left.substring(0, dialog.style.left.length - 2))
      let targetBeforeY = Number(dialog.style.top.substring(0, dialog.style.top.length - 2))
      document.onmousemove = function (e) {
        // fixbug：解决弹窗拉出上面和下面不能回拉问题,方法一：函数执行时间长，有卡顿感
        // let y = e.target.getBoundingClientRect().top
        // if (e.target.className === 'el-dialog__title') {
        //   if (y <= 15) return
        // } else {
        //   if (y <= 0) return
        // }
        // 禁止文字被选中
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
        // 通过事件委托，计算移动的距离
        let distanceX = e.clientX - mouseBeforeX
        let distanceY = e.clientY - mouseBeforeY
        // 移动当前元素
        dialog.style.left = targetBeforeX + distanceX + 'px'
        dialog.style.top = targetBeforeY + distanceY + 'px'
      }
      document.onmouseup = function (e) {
        // fixbug：解决弹窗拉出上面和下面不能回拉问题,方法二：模仿有道软件的上拉过度回弹最高位置
        if (e.clientY <= 0) {
          let before = Number(dialog.style.top.substring(0, dialog.style.top.length - 2))
          dialog.style.top = before + offsetY - e.clientY + 'px'
        }
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
