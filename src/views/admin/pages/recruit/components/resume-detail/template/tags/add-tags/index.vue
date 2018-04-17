<template>
  <div>
    <i-dialog
      title="添加标签"
      size="large"
      v-model="visible"
      :toolbar="toolbar"
      :close-on-click-modal="false"
      :before-close="onCancelHandler"
      :destroyedWhenClose="true">
      <div class="content">
        <label-form :type="'dialog'"></label-form>
        <label-table :type="'dialog'" ref="labelTable"></label-table>
      </div>
    </i-dialog>
  </div>
</template>
<script>
import LabelForm from 'views/admin/pages/recruit/components/label-list/label-form'
import LabelTable from 'views/admin/pages/recruit/components/label-list/label-table'
import { TagType } from 'views/admin/pages/recruit/config'
export default {
  name: 'AddTags',
  components: {
    LabelForm,
    LabelTable
  },
  props: {
    // 是否显示
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 是否显示
      visible: false,
      // 底部两个按钮
      toolbar: [
        {
          text: '取消',
          type: 'defalut',
          func: (done) => {
            this.onCancelHandler()
            done()
          }
        }, {
          text: '确定',
          type: 'primary',
          func: (done) => {
            this.onConfirmHandler()
            done()
          }
        }
      ]
    }
  },
  watch: {
    // 是否显示
    isShow (val) {
      this.visible = val
    }
  },
  methods: {
    // 取消
    onCancelHandler () {
      this.$emit('cancel')
    },
    // 确定
    onConfirmHandler () {
      let list = this.$refs.labelTable.getMultiSelection()
      let len = list.length
      let label = null
      let tag = null
      let newList = []
      if (len === 0) {
        this.$emit('confirm', [])
      } else {
        while (len--) {
          label = list[len]
          tag = {
            'labelId': label.labelId,
            'name': label.name,
            'labelType': TagType.MY
          }
          newList.push(tag)
        }
        this.$emit('confirm', newList)
      }
    }
  }
}
</script>
