module.exports = {
  table: {
    Workflow: [
      {prop: 'dealTime', label: '处理时间'},
      {prop: 'nodeName', label: '节点名称'},
      {prop: 'assigneeId', label: '处理人ID'},
      {prop: 'assigneeName', label: '处理人'},
      {prop: 'handle', label: '操作'},
      {prop: 'message', label: '处理信息'}
    ],
    WorkflowLog: [
      {prop: 'time', label: '处理时间'},
      {prop: 'nodeName', label: '节点名称'},
      {prop: 'access', label: '操作者'},
      {prop: 'deal', label: '操作'}
    ],
    WorkflowComment: [
      {prop: 'time', label: '处理时间'},
      {prop: 'nodeName', label: '节点名称'},
      {prop: 'access', label: '操作者'},
      {prop: 'deal', label: '操作'},
      {prop: 'message', label: '处理意见'}
    ]
  }
}
