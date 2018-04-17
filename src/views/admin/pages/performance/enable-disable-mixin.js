export default {
  methods: {
    startMuti ({row}, req, idName, reqName) {
      let arr = [row[idName]]
      this.$confirm('确定启用吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (row.status === '1' || row.status === 1) {
          this.$message.warning('已经为启用状态')
          return
        }
        req(reqName, arr).then((data) => {
          // filterId(levelIdArr, this.table.data, 'levelId', 'enable')
          this.search()
          this.$message({
            message: '恭喜你，启用成功',
            type: 'success'
          })
          this.search()
        }).catch(err => this.$message.error(err.message))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消启用'
        })
      })
    },

    forbidMuti ({row}, req, idName, reqName) {
      let arr = [row[idName]]
      this.$confirm('确定禁用吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (row.status === '0' || row.status === 0) {
          this.$message.warning('已经为禁用状态')
          return
        }
        req(reqName, arr).then((data) => {
          this.search()
          this.$message({
            message: '恭喜你，禁用成功',
            type: 'success'
          })
            // this.getLevelList()
          this.search()
        }).catch(err => this.$message.error(err.message))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消禁用'
        })
      })
    }
  }
}
