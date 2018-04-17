<template>
  <div class="yyq-compile-dialog">
    <i-dialog
      :title="title"
      v-model="dialogVisible"
      :toolbar="toolbar"
      destroyedWhenClose
      size="large"
      :before-close="handleClose"
      >
      <div class="content" ref="panel">
        <slot></slot>
      </div>
    </i-dialog>
  </div>
</template>

<script>
/**
 * @prop {String} title 弹框的标题
 * @prop {String} text 完成按钮的文本
 */
import reqTp from 'api/compile/template'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
export default {
  name: 'CompileDialog',
  components: {
    IDialog
  },
  props: {
    title: {
      type: String,
      default: '新建编制模板'
    },
    text: {
      type: String,
      default: '保存模板'
    }
  },
  data () {
    return {
      // 弹框的显隐
      dialogVisible: false,
      // 保存孩子
      children: [],
      // 当前index
      currentIndex: 0,
      // 弹框按钮配置
      toolbar: [{
        text: '上一步',
        type: 'plain',
        hide: true,
        func: (done) => {
          this.before()
        }
      }, {
        text: '下一步',
        type: 'plain',
        hide: true,
        func: (done) => {
          this.next()
        }
      }, {
        text: '保存',
        type: 'primary',
        hide: true,
        func: (done) => {
          this.submit(done)
        }
      }]
    }
  },
  methods: {
    // 关闭弹框前的操作
    handleClose (done) {
      this.$emit('handleClose', done)
    },
    // 改变按钮的状态
    changeBtnsStatus (name, status) {
      var btns = this.toolbar.filter(btn => btn.text === name)
      btns.forEach(btn => {
        btn.hide = status
      })
    },
    // 显示某个index的面板
    openTarget (index, isDestroy) {
      this.children.forEach((ele, idx) => {
        if (idx < index) {
          // 隐藏之前所有页面
          ele.hiddenItem(true)
        } else if (idx === index) {
          // 显示当前页面
          ele.destroyItem(false)
          ele.hiddenItem(false)
        } else if (isDestroy && idx > index) {
          // 销毁后面所有页面
          ele.destroyItem(true)
          ele.hiddenItem(true)
        } else {
          return
        }
      })
    },
    // 点击下一步，切换到下一个页面
    next () {
      const warningInfo = str => this.$message.warning(str)
      // 跳转下一步页面
      const goNext = () => {
        this.changeBtnsStatus('上一步', false)
        this.currentIndex++
        // 如果已经是最后一页，则隐藏下一步按钮,显示保存按钮
        if ((this.children.length - 1) === this.currentIndex) {
          this.changeBtnsStatus('下一步', true)
          this.changeBtnsStatus('保存', false)
        }
        this.openTarget(this.currentIndex, false)
      }
      // 验证是否为永辉模板
      const checkIsYongHui = () => {
        return reqTp('checkIsYongHui')
      }
      // 验证是否存在建议树
      const checkHasSuggest = () => {
        let params = {
          orgUnitId: this.$parent.model.orgs,
          dimensionCode: this.$parent.model.dimensionCode
        }
        return reqTp('checkHasSuggest', params)
      }
      // 执行流程，先校验数据，再判断是否存在建议数，最后跳到下一步页面
      this.validateAll()
      .then(res => {
        if (!res) {
          warningInfo('信息填写不完整或不符合要求，请检查')
        } else {
          checkIsYongHui()
          .then(res => {
            if (res.modSuiteCode === 'YONGHUI') {
              checkHasSuggest()
              .then(res => {
                this.$parent.model.havingProposal = res
                goNext()
              })
            } else {
              this.$parent.model.havingProposal = false
              goNext()
            }
          })
        }
      })
    },
    // 点击上一步，切换到上一个页面
    before () {
      // 显示下一步按钮
      this.changeBtnsStatus('下一步', false)
      // 隐藏保存按钮
      this.changeBtnsStatus('保存', true)
      this.currentIndex--
      // 如果已经是第一页，则隐藏上一步按钮
      if (this.currentIndex === 0) {
        this.changeBtnsStatus('上一步', true)
      }
      this.openTarget(this.currentIndex, true)
    },
    // 提交数据
    submit (done) {
      const warningInfo = str => this.$message.warning(str)
      // 先校验数据
      this.validateAll()
      .then(res => {
        res ? this.$emit('submit', done) : warningInfo('信息填写不完整或不符合要求，请检查')
      })
    },
    // 捕捉到所有需要验证的组件
    getValidateParts (node) {
      var arr = []
      node.forEach(ele => {
        if (ele.validate && ele.$options._componentTag === 'el-form') {
          arr.push(ele)
        }
        ele.$children && (arr = arr.concat(this.getValidateParts(ele.$children)))
      })
      return arr
    },
    // 验证所有规则
    validateAll () {
      const validateForm = form => new Promise(resolve => {
        form.validate(valid => {
          resolve(valid)
        })
      })
      return new Promise(resolve => {
        var arr = this.getValidateParts([this.children[this.currentIndex]])
        console.log('捕捉到所有需要验证的组件', arr)
        Promise.all(arr.map(form => validateForm(form)))
        .then(res => {
          console.log('验证结果为: ', res)
          resolve(res.every(valid => valid))
        })
        .catch(() => {
          console.log('验证出错 ')
          resolve(false)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
