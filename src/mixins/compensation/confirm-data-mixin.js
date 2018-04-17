/**
 * 确认无误按钮mixin
 */
// import moment from 'moment'
import { showMessage } from 'utils/index'
import CancelData from 'components/compensation/confirm-data'
export default {
  data () {
    return {
      // 选中状态，查询数据为'Y'，已选数据为'N'
      selectedStatus: 'Y'
    }
  },
  created () {
    this.$eventBus.$on('cancelConfirmChange', this.addCancelConfirmListener)
  },
  beforeDestroy () {
    this.$eventBus.$emit('setCancelConfirmSelected', 'Y')
    this.$eventBus.$off('cancelConfirmChange', this.addCancelConfirmListener)
  },
  methods: {
    addCancelConfirmListener (selectedStatus) {
      this.selectedStatus = selectedStatus
    },
    confirmDataButtonIsDisabled: (time = new Date()) => {
      // 当天日期
      // let curDate = moment().date()

      // 当月的天数
      // let curMonthDays = new Date(time.getFullYear(), (time.getMonth() + 1), 0).getDate()

      // return curMonthDays - curDate >= 2
      return false
    },
    /**
     * 确认数据（取消或确认）
     * @param vm {Object}：iTable实例
     * @param isConfirm {String}: 确认无误或是取消确认
     */
    confirmAction (vm, isConfirm) {
      const config = this.dataConfirmConfig
      const searchParam = this.transformParam(this.allParam)
      let selected = JSON.parse(JSON.stringify(vm.getMultipleSelection().map(item => {
        return item[this.idKey]
      })))

      const confirmMessage = this.$createElement(CancelData, {
        props: {
          isConfirm: isConfirm === 'Y'
        }
      })
      const successMessage = isConfirm === 'Y' ? '条数据确认成功' : '条数据取消确认'

      config.params.confirmStatus = isConfirm

      this.$confirm(confirmMessage, '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (this.selectedStatus === 'Y') {
              selected = []
            } else if (!selected.length) {
              return showMessage('info', '当前选项为空！')
            }
          }
          done()
        }
      }).then(() => {
        config.req(config.name, {...searchParam, ...config.params, selected}).then(res => {
          showMessage('success', `共${res}` + successMessage)
          this.fetch(this.allParam)
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    /** 转换搜索选项，去除pageInfo属性 */
    transformParam (allParam) {
      const searchParam = JSON.parse(JSON.stringify(allParam))
      delete searchParam.pageSize
      delete searchParam.pageIndex
      return searchParam
    }
  }
}
