/* 双圈空心图标 */

export default {
  timer: () => {
    const timer = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    timer.setAttribute('d', 'M15,14.7928932 L15,11 L14,11 L14,14.6715729 L13.732233,14.9393398 L16.5606602,17.767767 L17.267767,17.0606602 L15,14.7928932 Z M15,22 C11.1340068,22 8,18.8659932 8,15 C8,11.1340068 11.1340068,8 15,8 C18.8659932,8 22,11.1340068 22,15 C22,18.8659932 18.8659932,22 15,22 Z')
    timer.classList.add('bpmn-icon')
    return timer
  },
  error: () => {
    const error = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    error.setAttribute('d', 'M17.5,8.04031242 L9.42539053,14.5 L12.5,14.5 L12.5,20.9596876 L20.5746095,14.5 L17.5,14.5 L17.5,8.04031242 Z')
    error.setAttribute('fill', 'none')
    error.setAttribute('stroke', 'black')
    error.classList.add('bpmn-icon')
    return error
  },
  signal: () => {
    const signal = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    signal.setAttribute('d', 'M15,8.23606798 L9.61803399,19 L20.381966,19 L15,8.23606798 Z M15,6 L22,20 L8,20 L15,6 Z')
    signal.setAttribute('fill', 'none')
    signal.setAttribute('stroke', 'black')
    signal.classList.add('bpmn-icon')
    return signal
  },
  message: () => {
    const message = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    message.setAttribute('d', 'M15,16.4142804 C14.7,16.4142804 14.3785714,16.3071375 14.1428571,16.0928518 L10.8642857,13.1785661 C10.6928571,13.0285661 10.6714286,12.7499946 10.8214286,12.5785795 C10.9714286,12.4071375 11.25,12.3857089 11.4214286,12.5357089 L14.7,15.4499946 C14.8714286,15.5999946 15.1071429,15.5999946 15.2785714,15.4499946 L18.5571429,12.5357089 C18.7285714,12.3857089 19.0071429,12.3857089 19.1571429,12.5785795 C19.3071429,12.7714232 19.3071429,13.0285661 19.1142857,13.1785661 L15.8571429,16.0928518 C15.6,16.3071375 15.3,16.4142804 15,16.4142804 Z M10.2857143,10.7142804 C10.05,10.7142804 9.85714286,10.9071375 9.85714286,11.1428518 L9.85714286,18.8571375 C9.85714286,19.0928518 10.05,19.2857089 10.2857143,19.2857089 L19.7142857,19.2857089 C19.95,19.2857089 20.1428571,19.0928518 20.1428571,18.8571375 L20.1428571,11.1428518 C20.1428571,10.9071375 19.95,10.7142804 19.7142857,10.7142804 L10.2857143,10.7142804 Z M19.7142857,20.1428518 L10.2857143,20.1428518 C9.57857143,20.1428518 9,19.5642804 9,18.8571375 L9,11.1428518 C9,10.4357223 9.57857143,9.8571375 10.2857143,9.8571375 L19.7142857,9.8571375 C20.4214286,9.8571375 21,10.4357223 21,11.1428518 L21,18.8571375 C21,19.5642804 20.4214286,20.1428518 19.7142857,20.1428518 Z')
    message.setAttribute('fill', 'none')
    message.setAttribute('stroke', 'black')
    message.classList.add('bpmn-icon')
    return message
  },
  cancel: () => {
    const cancel = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    cancel.setAttribute('d', 'M8.5,13.5 L8.5,16.5 L13.5,16.5 L13.5,21.5 L16.5,21.5 L16.5,16.5 L21.5,16.5 L21.5,13.5 L16.5,13.5 L16.5,8.5 L13.5,8.5 L13.5,13.5 L8.5,13.5 Z')
    cancel.setAttribute('transform', 'translate(15.000000, 15.000000) rotate(45.000000) translate(-15.000000, -15.000000) ')
    cancel.setAttribute('fill', 'none')
    cancel.setAttribute('stroke', 'black')
    cancel.classList.add('bpmn-icon')
    return cancel
  },
  compensate: () => {
    const compensate = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    compensate.setAttribute('d', 'M13.5,20.7928932 L13.5,9.20710678 L7.70710678,15 L13.5,20.7928932 Z M13.7071068,15 L19.5,20.7928932 L19.5,9.20710678 L13.7071068,15 Z')
    compensate.setAttribute('fill', 'none')
    compensate.setAttribute('stroke', 'black')
    compensate.classList.add('bpmn-icon')
    return compensate
  }
}
