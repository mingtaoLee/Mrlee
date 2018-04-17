<template>
  <section class="task-list list-card card lx-list-card">
    <header>
      <h3>便签</h3>
      <span class="edit" @click.stop="editorTask()" v-if="taskShowStatu === 'looking'">
        编辑
      </span>
      <div v-if="taskShowStatu === 'editor'">
        <span class="cancel" @click.stop="cancelTask">
          取消
        </span>
        <span class="save" @click.stop="saveTask">
          完成
        </span>
      </div>
    </header>

    <article class="task-content">
      <!-- <p v-for="(item, index) of task" :key="index">{{ item || '\b' }}</p> -->
      <pre class="taskFollow" v-if="taskShowStatu === 'looking'">{{task}}</pre>
      <el-input
        ref="eidtorArea"
        class="editorInput"
        v-if="taskShowStatu === 'editor'"
        :autosize="{ minRows: 8, maxRows: 20}"
        type="textarea"
        clearable
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>

    </article>

  </section>
</template>

<script>
import req from 'api/common/home'
export default {
  props: ['task'],

  data () {
    return {
      taskShowStatu: 'looking',
      textarea: ''
    }
  },

  methods: {
    editorTask () {
      this.taskShowStatu = 'editor'
      this.textarea = this.task
    },
    cancelTask () {
      this.taskShowStatu = 'looking'
      this.textarea = ''
    },
    async saveTask () {
      const str = this.$refs.eidtorArea.$el.children[0].value
      const postStatu = await this.saveTaskData(str)
      postStatu && (this.taskShowStatu = 'looking')
      this.task = ''
      this.textarea = ''
      this.getTaskFollowData()
    },
    saveTaskData (data) {
      return req('postTaskFollowData', {content: data})
      .then(res => {
        return res
      })
    },
    // 获取任务跟踪消息
    getTaskFollowData () {
      req('getTaskFollowData')
      .then(res => {
        this.task = res.content
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.task-list {
  width: 30%;
  .cancel {
    margin-right: 5px;
  }
  .taskFollow {
    font-family: HelveticaNeue Regular, PingFangSC-Regular, Helvetica, Arial, sans-serif;
    white-space: pre-wrap;
    font-size: 12px;
    color: #333
    ;
  }
}
</style>

<style lang="scss">
.lx-list-card {
  display: flex;
  flex-direction: column;
  .task-content {
    // height: 100%;
    flex: 1;
    .editorInput {
      height: 100%;
      textarea {
        height: 100%!important;
        font-size: 12px;
        color: #333;
      }
    }
  }
}
</style>


