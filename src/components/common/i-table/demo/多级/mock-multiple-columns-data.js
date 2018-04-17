// 模拟

export default {
  // 👇 命名以自身业务为准
  tableData: {
    data: [
      {
        name: 'Rick',
        age: 233,
        level: '6',
        partner: {
          name: 'Mary',
          age: 666,
          status: '2',
          entry: 1512912616951
        }
      },
      {
        name: 'Morty',
        age: 17,
        level: 'a',
        partner: {
          name: 'Tommy',
          age: 18,
          status: '1',
          entry: 1505957346215
        }
      }
    ],
    info: null,
    total: null,
    additions: null
  },
  columns: [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄' },

    {
      prop: 'partner',
      label: '配偶',
      children: [
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄' },
        { prop: 'entry', label: '入职时间' },
        { prop: 'status', label: '员工状态' } // 字典尽量由后端提供，display: { dict: 'EMPLOYEE_STATUS' }
      ]
    }
  ]
}
