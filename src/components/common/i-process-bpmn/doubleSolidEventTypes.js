/* 双圈实心图标 */

export default {
  signal: () => {
    const signal = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    signal.setAttribute('points', '15 6 22 20 8 20')
    signal.classList.add('bpmn-icon')
    return signal
  },
  compensate: () => {
    const compensate = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    compensate.setAttribute('d', 'M14,14 L20,8 L20,22 L14,16 L14,22 L7,15 L14,8 L14,14 Z')
    compensate.classList.add('bpmn-icon')
    return compensate
  }
}
