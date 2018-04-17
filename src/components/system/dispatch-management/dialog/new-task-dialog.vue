<template>
  <div class="wrap p20">
  <i-dialog
    :title="title"
    v-model="dialogVisible"
    :toolbar="toolbar"
    destroyedWhenClose
    size="large">
    <div class="content">
      <el-form :model="model" :rules="rules" ref="form" label-width="140px" label-position="right">
        <el-form-item label="任务名称" prop="taskName">
          <el-col :span="12">
            <el-input v-model.trim="model.taskName" :disabled="ifMotify" maxlength="50"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="RPC服务地址" prop="beanId">
          <el-col :span="12">
            <el-input v-model.trim="model.beanId" maxlength="128"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="RPC名称" prop="executor">
          <el-col :span="12">
            <el-input v-model.trim="model.executor" maxlength="50"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-col :span="12">
            <el-input v-model="model.description" type="textarea" maxlength="255" />
          </el-col>
        </el-form-item>
      </el-form>
      <div class="content-card padding20" v-if="show">
        <new-task-table ref="table" :taskID="taskID" @triggersChange="receiveTriggersChange" />
      </div>
    </div>
  </i-dialog>
  </div>
</template>

<script>
  import req from 'api/system/dispatch-management'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import NewTaskTable from 'components/system/dispatch-management/table/new-task-table'
  export default {
    name: 'NewTaskDialog',
    components: {
      IDialog,
      NewTaskTable
    },
    data () {
      return {
        title: '新建任务',
        dialogVisible: false,
        taskID: '',
        // 触发器列表显示与否
        show: false,
        // 是否收到new-task-table组件emit的列表变化
        isReceiveChange: false,
        triggerIds: null,
        triggerChangeID: {
          create: null,
          delete: null
        },
        // 绑定数据
        model: {
          taskName: '',
          beanId: '',
          executor: '',
          description: ''
        },
        // 判断是否为修改操作
        ifMotify: false,
        // 表单的验证规则
        rules: {
          taskName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          beanId: [{ required: true, message: '请输入RPC服务地址', trigger: 'blur' }],
          executor: [{ required: true, message: '请输入RPC名称', trigger: 'blur' }],
          description: [{ required: true, message: '请输入任务描述', trigger: 'blur' }]
        },
        // 弹框按钮配置
        toolbar: [
          {
            text: '取消',
            type: 'plain',
            hide: false,
            func: done => {
              done()
            }
          },
          {
            text: '保存',
            type: 'primary',
            hide: false,
            func: done => {
              this.submit(done)
            },
            disabled: null
          }
        ]
      }
    },
    methods: {
      // 打开弹框，如果存在id，则根据计划id获取计划明细信息
      openDialog (ifOpen, row) {
        // 打开之前先格式化表格
        this.initDialog()
        // 存在id，则为修改
        if (row) {
          this.title = '修改任务'
          this.taskID = row.id
          this.ifMotify = true
          this.initData()
          this.show = true
        } else {
          this.title = '新建任务'
          this.taskID = ''
          this.ifMotify = false
          this.show = false
        }
        this.dialogVisible = ifOpen
      },
      // 提交修改
      submit (done) {
        this.$refs['form'].validate(valid => {
          if (valid) {
            let params = this.formatData()
            this.show && this.$refs.table.$children[0].saveData()
            // 发送提交请求时禁用提交按钮
            this.toolbar[1].disabled = true
            req('addTask', params).then(() => {
              if (!this.ifMotify) {
                this.dialogVisible = false
                this.toolbar[1].disabled = false
                this.submitSuccess()
                this.$emit('addOver')
                return
              }
              if (this.isReceiveChange) {
                let params = this.triggerIds
                params.jobId = this.taskID
                req('bindTrigger', params).then((res) => {
                  this.dialogVisible = false
                  this.isReceiveChange = false
                  this.submitSuccess()
                  this.$emit('editorOver')
                  this.toolbar[1].disabled = false
                }).catch(() => {
                  this.toolbar[1].disabled = false
                })
              }
            }).catch(() => {
              this.toolbar[1].disabled = false
            })
          } else {
            this.$message.error('请先按要求输入')
            return false
          }
        })
      },
      receiveTriggersChange (data) {
        this.isReceiveChange = true
        this.triggerIds = data
      },
      // 初始化数据
      initData (data) {
        req('searchTask', { id: this.taskID }).then(data => {
          this.model.taskName = data.name
          this.model.beanId = data.beanId
          this.model.executor = data.executor
          this.model.description = data.description
        })
      },
      // 格式化数据，格式化后的数据用于提交
      formatData (data) {
        return {
          id: this.taskID || '',
          name: this.model.taskName,
          beanId: this.model.beanId,
          executor: this.model.executor,
          description: this.model.description
        }
      },
      // 初始化弹框的页面
      initDialog () {
        this.model = {
          taskName: '',
          beanId: '',
          executor: '',
          description: ''
        }
      },
      submitSuccess () {
        this.$emit('submit')
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.toolbar[1].disabled = false
        this.openDialog(false)
      }
      // 弹框关闭前操作
      // handleClose (done) {
      //   this.initDialog()
      //   done()
      // }
    }
  }
</script>

<style lang="scss" scoped>

</style>
