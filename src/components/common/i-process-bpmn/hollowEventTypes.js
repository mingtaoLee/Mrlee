/* 单圈空心图标 */

export default {
  error: () => {
    const error = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    error.setAttribute('d', 'M20.5,9.06752081 L10.381025,17.5 L14.5,17.5 L14.5,24.9324792 L24.618975,16.5 L20.5,16.5 L20.5,9.06752081 Z')
    error.classList.add('bpmn-icon')
    return error
  },
  message: () => {
    const message = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    message.setAttribute('d', 'M11,15 C10.9569973,14.9038679 10.9243917,14.4845659 11,14 C11.38087,13.9685019 11.8047427,13.9362479 12,14 L17.5015218,19 L23,14 C23.184094,13.9362479 23.6079667,13.9362479 24,14 C24.064445,14.5168199 24.064445,14.9038679 24,15 L17.5015218,21 L11,15 Z M11,11 C10.28125,11 10,11.2925 10,12 L10,23 C10,23.7075 10.28125,24 11,24 L24,24 C24.71875,24 25,23.7075 25,23 L25,12 C25,11.2925 24.71875,11 24,11 L11,11 Z M11,25 C9.81964286,25 9,24.15625 9,23 L9,12 C9,10.8437695 9.81964286,10 11,10 L24,10 C25.1803571,10 26,10.8437695 26,12 L26,23 C26,24.15625 25.1803571,25 24,25 L11,25 Z')
    message.classList.add('bpmn-icon')
    return message
  },
  signal: () => {
    const signal = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    signal.setAttribute('d', 'M17.5,9.11803399 L10.809017,22.5 L24.190983,22.5 L17.5,9.11803399 Z')
    signal.classList.add('bpmn-icon')
    return signal
  },
  timer: () => {
    const timer = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    timer.setAttribute('d', 'M17.5,17.2485132 L17.5,12.6428571 L16.2857143,12.6428571 L16.2857143,17.1011956 L15.9605687,17.4263412 L19.3950874,20.8608599 L20.253717,20.0022302 L17.5,17.2485132 Z M17.5,26 C12.8055796,26 9,22.1944204 9,17.5 C9,12.8055796 12.8055796,9 17.5,9 C22.1944204,9 26,12.8055796 26,17.5 C26,22.1944204 22.1944204,26 17.5,26 Z')
    timer.classList.add('bpmn-icon')
    return timer
  }
}
