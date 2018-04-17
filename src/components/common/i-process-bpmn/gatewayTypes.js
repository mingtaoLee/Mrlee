/* 网关类型清单 */

export default {
  parallelGateway: () => {
    const parallelGateway = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    parallelGateway.setAttribute('d', 'M19,19 L19,12 L21,12 L21,19 L28,19 L28,21 L21,21 L21,28 L19,28 L19,21 L12,21 L12,19 L19,19 Z')
    parallelGateway.classList.add('bpmn-icon')
    return parallelGateway
  },
  exclusiveGateway: () => {
    const exclusiveGateway = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    exclusiveGateway.setAttribute('d', 'M18.875,18.875 L18.875,11 L21.125,11 L21.125,18.875 L29,18.875 L29,21.125 L21.125,21.125 L21.125,29 L18.875,29 L18.875,21.125 L11,21.125 L11,18.875 L18.875,18.875 Z')
    exclusiveGateway.setAttribute('transform', 'translate(20.000000, 20.000000) rotate(45.000000) translate(-20.000000, -20.000000) ')
    exclusiveGateway.classList.add('bpmn-icon')
    return exclusiveGateway
  },
  inclusiveGateway: () => {
    const inclusiveGateway = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    inclusiveGateway.setAttribute('d', 'M20,28 C24.418278,28 28,24.418278 28,20 C28,15.581722 24.418278,12 20,12 C15.581722,12 12,15.581722 12,20 C12,24.418278 15.581722,28 20,28 Z M20,30 C14.4771525,30 10,25.5228475 10,20 C10,14.4771525 14.4771525,10 20,10 C25.5228475,10 30,14.4771525 30,20 C30,25.5228475 25.5228475,30 20,30 Z')
    inclusiveGateway.classList.add('bpmn-icon')
    return inclusiveGateway
  },
  eventGateway: () => {
    const eventGateway = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    eventGateway.setAttribute('d', 'M20,28 C24.418278,28 28,24.418278 28,20 C28,15.581722 24.418278,12 20,12 C15.581722,12 12,15.581722 12,20 C12,24.418278 15.581722,28 20,28 Z M20,30 C14.4771525,30 10,25.5228475 10,20 C10,14.4771525 14.4771525,10 20,10 C25.5228475,10 30,14.4771525 30,20 C30,25.5228475 25.5228475,30 20,30 Z M20,26 C23.3137085,26 26,23.3137085 26,20 C26,16.6862915 23.3137085,14 20,14 C16.6862915,14 14,16.6862915 14,20 C14,23.3137085 16.6862915,26 20,26 Z M20,27 C16.1340068,27 13,23.8659932 13,20 C13,16.1340068 16.1340068,13 20,13 C23.8659932,13 27,16.1340068 27,20 C27,23.8659932 23.8659932,27 20,27 Z M20,16 L23.8042261,18.763932 L22.351141,23.236068 L17.648859,23.236068 L16.1957739,18.763932 L20,16 Z')
    eventGateway.classList.add('bpmn-icon')
    return eventGateway
  }
}
