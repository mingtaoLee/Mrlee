/* 单圈实心图标 */

export default {
  cancel: () => {
    const cancel = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    cancel.setAttribute('d', 'M15.0714286,15.0714286 L15.0714286,9 L19.9285714,9 L19.9285714,15.0714286 L26,15.0714286 L26,19.9285714 L19.9285714,19.9285714 L19.9285714,26 L15.0714286,26 L15.0714286,19.9285714 L9,19.9285714 L9,15.0714286 L15.0714286,15.0714286 Z')
    cancel.setAttribute('transform', 'translate(17.500000, 17.500000) rotate(45.000000) translate(-17.500000, -17.500000)')
    cancel.classList.add('bpmn-icon')
    return cancel
  },
  error: () => {
    const error = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    error.setAttribute('points', '21 8 9 18 14 18 14 26 26 16 21 16')
    error.classList.add('bpmn-icon')
    return error
  },
  terminate: () => {
    const terminate = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    terminate.setAttribute('cx', '17.5')
    terminate.setAttribute('cx', '17.5')
    terminate.setAttribute('r', '8.5')
    terminate.classList.add('bpmn-icon')
    return terminate
  }
}
