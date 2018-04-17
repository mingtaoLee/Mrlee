/* 多实例图标 */

export default {
  // 1 平行多实例
  '1': (width, height) => {
    const parallel = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    parallel.setAttribute('d', `m${width / 2 - 5},${height - 15} m 3,2 l 0,10 m 3,-10 l 0,10 m 3,-10 l 0,10`)
    parallel.setAttribute('style', 'stroke-width: 2px;')

    return parallel
  },

  // 2 顺序多实例
  '2': (width, height) => {
    const sequential = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    sequential.setAttribute('d', `m${width / 2 - 5},${height - 15} m 0,3 l 10,0 m -10,3 l 10,0 m -10,3 l 10,0`)
    sequential.setAttribute('style', 'stroke-width: 2px;')

    return sequential
  }
}
