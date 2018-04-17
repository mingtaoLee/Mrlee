<template>
  <div>
    <i-table :table="table" ref="table">
      <template slot-scope="tableScope" slot="table">
        <el-table :data="tableScope.clone">
          <el-table-column
            v-for="(col, index) in table.columns"
            :key="index"
            :label="col.label"
            :prop="col.prop"
          ></el-table-column>
          <i-table-operator :table="tableScope"></i-table-operator>
        </el-table>
      </template>
    </i-table>

    <i-dialog 
      :toolbar="toolbar" 
      v-model="showDetail" 
      destroyedWhenClose 
      title="关键事件卡详情"
    >
      <key-event
        :keyEvent="keyEvent"
        ref="keyEventEdit"
        :eventType="status || isCheckOnly"
        @getPhotoId="getPhotoId"
        @removePhotoId="removePhotoId"
      ></key-event>
     </i-dialog>
  </div>


</template>

<script>
  import req from 'api/performance/grape-complaint'

  import keyEvent from './key-event.vue'

  export default {

    components: {
      keyEvent
    },

    props: {
      // 状态: true待处理申诉（带修改），false已处理申诉
      status: {
        type: Boolean
      },

      // 关键事件数据
      formData: {
        type: Array
      }
    },

    data () {
      return {
        showDetail: false, // 事件卡详情对话框,
        isCheckOnly: false, // 时间卡控制 false为可编辑，true为查看
        keyEvent: null, // 当前事件对象
        originalData: null, // 保存每行数据修改前的值
        table: {
          data: null,
          columns: [
            {prop: 'writeDate', label: '事件日期'},
            {prop: 'isPositive', label: '事件属性'},
            {prop: 'isCancel', label: '是否作废'}
          ],
          setting: {
            operator: [
              {
                text: '查看',
                func: row => this.showKeyEvent(row, true)
              },
              {
                text: '修改',
                func: row => {
                  this.cloneOriginalData(row)
                  row.updateType = '2'
                  this.showKeyEvent(row, false)
                },
                show: () => this.modifyOperatorControll
              },
              {
                text: '作废',
                func: row => {
                  row.updateType = '2'
                  row.isCancel = 'Y'
                  // this.cancel()
                },
                show: (row) => {
                  if (this.status || row.isCancel === 'Y') return {empty: true}
                }
              },
              {
                text: '启用',
                func: row => {
                  row.isCancel = 'N'
                  // this.cancel()
                },
                show: (row) => {
                  if (this.status || row.isCancel === 'N') return {empty: true}
                }
              }
            ]
          }
        }
        // toolbar: [
        //   {
        //     text: '作废',
        //     func: done => {
        //       this.handleCancel(done)
        //     }
        //   },
        //   {
        //     text: '取消',
        //     func: done => {
        //       this.keyEvent = this.originalData
        //       done()
        //     }
        //   },
        //   {
        //     text: '确定',
        //     func: done => {
        //       this.handleSave(done)
        //     }
        //   }
        // ]
      }
    },

    computed: {
      modifyOperatorControll () {
        if (this.status) return {empty: true}
      }
    },

    watch: {
      'formData': {
        handler: function (newVal) {
          this.table.data = newVal.keyEvents
        },
        deep: true
      }
    },
    methods: {
      getPhotoId (res) {
        this.keyEvent.photos.push({
          photoId: res,
          updateType: 1
        })
      },

      removePhotoId (removeId) {
        this.formData.keyEvents.delPhotos.push(removeId)
      },

      /* 数据校验 */
      validate () {
        return new Promise((resolve, reject) => {
          this.$refs.form.validate(res => {
            if (res) {
              let reqData = {
                evaluationId: this.formData.evaluationId,
                color: this.formData.color,
                score: this.formData.score,
                description: this.formData.description,
                keyEvents: this.formData.keyEvents
              }
              resolve(reqData)
            } else {
              reject()
            }
          })
        })
      },

      // 确认按钮
      save () {
        return new Promise((resolve, reject) => {
          this.validate().then(res => {
            if (res) {
              res.isReject = 'N'
              console.log({...res, evaluationId: this.evaluationId})
              req('staffComplaint', {...res, evaluationId: this.evaluationId}).then((data) => {
                this.$message({
                  message: '恭喜你，确认成功',
                  type: 'success'
                })
                resolve(res)
              })
            } else {
              reject()
            }
          })
        })
      },

    // 事件卡详情对话框取消按钮
      cancel () {
        return new Promise((resolve, reject) => {
          this.validate().then(res => {
            if (res) {
              res.isReject = 'Y'
              console.log({...res, evaluationId: this.evaluationId})
              req('staffComplaint', {...res, evaluationId: this.evaluationId}).then((data) => {
                this.$message({
                  message: '驳回成功',
                  type: 'success'
                })
                resolve(res)
              })
            } else {
              reject()
            }
          })
        })
      },

      changeScore (value) {
        this.formData.score = value.score
        this.formData.color = value.color
      },

      showKeyEvent (row, isCheckOnly) {
        this.isCheckOnly = isCheckOnly
        this.keyEvent = row
        this.showDetail = true
      },

       // 保存未修改的数据，取消的时候赋给keyEvent
      cloneOriginalData (row) {
        this.originalData = row
      },

      handleCancel (done) {
        this.$refs.keyEventEdit.cancel().then(res => {
          if (res) {
            console.log(res)
            this.formData.keyEvents = this.$refs.table.clone
            done && done()
          }
        })
      },

      handleSave (done) {
        this.$refs.keyEventEdit.save().then(res => {
          if (res) {
            // console.log(res.uploadComponent)
            this.formData.keyEvents = this.$refs.table.clone
            done()
          }
        })
      }
    }
}
</script>
<style lang="scss" scoped>

</style>
