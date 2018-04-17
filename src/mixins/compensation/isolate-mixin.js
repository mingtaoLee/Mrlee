/**
 * 抽数按钮mixin
 */
// import moment from 'moment'
import { showMessage } from 'utils/index'
export default {
  data () {
    return {
      isolateEditToolbar: [
        {
          text: '取消',
          type: 'plain',
          func: done => {
            this.handleCancel(done)
          }
        },
        {
          text: '确定',
          disabled: false,
          func: done => {
            this.handleIsolateSave(done)
          }
        }
      ],
      isShowIsolate: false
    }
  },
  beforeDestroy () {
    this.$eventBus.$off('isolateDisabled', this.setIsolateDisabled)
  },
  methods: {
    /** 设置确认按钮是否禁用 */
    setIsolateDisabled (bool) {
      this.isolateEditToolbar[1].disabled = bool
    },
    /** 设置抽数状态 */
    setIsolateLoading (bool) {
      this.$refs.isolateEdit.loading = bool
    },
    /** 确认抽数 */
    handleIsolateSave (done) {
      this.$refs.isolateEdit.$refs.form.validate(res => {
        if (res) {
          const form = this.$refs.isolateEdit.form
          this.$eventBus.$on('isolateDisabled', this.setIsolateDisabled)
          this.setIsolateDisabled(true)
          this.setIsolateLoading(true)
          this.extraData(form).then(res => {
            if (res) {
              this.table.search = { pageSize: this.pageInfo.pageSize, pageIndex: 1 }
              done()
            }
          })
        }
      })
    },
    /** 抽数 */
    extraData (form) {
      const config = this.isolateConfig
      return new Promise(resolve => {
        config.req(config.name, { ...form }).then(res => {
          this.setIsolateLoading(false)
          this.showReqMessage(res)
          resolve(true)
        })
      })
    },
    showReqMessage (res, successText = `共${res}条数据抽数成功`) {
      showMessage('success', successText)
    },
    isolatePolicy () {
      this.openIsolateDialog()
    },
    openIsolateDialog () {
      this.isShowIsolate = true
    }
  }
}
