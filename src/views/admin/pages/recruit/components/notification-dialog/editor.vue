<template>
  <div>
    <script
      :id="editorId"
      type="text/plain"
      style="margin-bottom: 20px;">
    </script>
  </div>
</template>

<script>
import 'static/ueditor/ueditor.config.js'
import 'static/ueditor/ueditor.all.min.js'
import 'static/ueditor/lang/zh-cn/zh-cn.js'
import 'static/ueditor/ueditor.parse.min.js'

export default {
  name: 'NotificationEditor',

  props: {
    editorId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      editor: null,
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 200
      }
    }
  },

  mounted () {
    this.editor = window.UE.getEditor(this.editorId, this.config)
    this.editor.ready(() => {
      this.$emit('ready')
    })
  },

  destroyed () {
    this.editor.destroy()
  },

  methods: {
    getUEContent () {
      return this.editor.getContentTxt()
    },

    setUEContent (content) {
      this.editor.setContent(content)
    }
  }
}
</script>
