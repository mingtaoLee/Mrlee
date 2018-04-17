<template>
  <div class="grape-complained-dialog">
    <el-form ref="form" :model="formData" :loading="loading" labelWidth="120px" :rules="rules">
      <ul class="i-dialog-form">
        <li class="item">
          <el-form-item label="员工姓名:">
            {{formData.staffName}}
          </el-form-item>
          <el-form-item label="员工职位:">
            {{formData.staffPosition}}
          </el-form-item>
          <el-form-item label="评估人姓名:">
            {{formData.leaderName}}
          </el-form-item>
          <el-form-item label="评估人职位:">
            {{formData.leaderPosition}}
          </el-form-item>
          <el-form-item label="评估时间:">
            {{new Date(formData.evaluateDate).toLocaleString()}}
          </el-form-item>
        </li>
        <li class="item">
          <el-form-item label="员工工号:">
            {{formData.staffCode}}
          </el-form-item>
          <el-form-item label="员工部门:">
            {{formData.staffOrgName}}
          </el-form-item>
          <el-form-item label="评估人工号:">
            {{formData.leaderCode}}
          </el-form-item>
          <el-form-item label="评估人部门:">
            {{formData.leaderOrgName}}
          </el-form-item>
          <el-form-item label="得分:">
            {{formData.score}}
          </el-form-item>
        </li>
      </ul>
      <!-- <el-form-item label="关键事件卡:">
        <span class="pointer event" @click='showKeyEvent'>事件详情</span>
      </el-form-item> -->
      <el-collapse class="mb10">
        <el-collapse-item title="关键事件">
          <events-card :status="type" :formData="formData"></events-card>
        </el-collapse-item>
      </el-collapse>
      <el-form-item label="申诉说明:">
        <el-input
          disabled
          type="textarea"
          :rows="4"
          v-model="formData.complainDesc">
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="处理结果:">
        {{formData.handleRes}}
      </el-form-item> -->
      <el-form-item label="得分:">
        <color-circle :color-array="formData.standards" @onChange="changeScore"></color-circle>
      </el-form-item>
      <el-form-item label="处理意见:">
        <el-input
          type="textarea"
          :rows="4"
          placeholder=""
          v-model="formData.handleDesc"
          :disabled="type">
        </el-input>
      </el-form-item>
     <el-collapse accordion>
        <el-collapse-item title="审批记录">
          <table class="el-table">
            <tr v-for="(item,index) in formData.operationRecords" :key="index">
              <td :class="{dobble:index%2===0}">
                {{item.operation}}
                </td>
            </tr>
          </table>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <!-- <i-dialog
      v-model="dialogFormVisible"
      :title="'关键事件卡'"
      width="800px"
      :toolbar="dialogToolbar"
      :modal="false"
    >
      <key-event :keyEvent="formData.keyEvent" ref="keyEventEdit" :eventType="type" @getPhotoId="getPhotoId"></key-event>
    </i-dialog> -->
  </div>
</template>

<script>
  import req from 'api/performance/grape-complaint'
  import colorCircle from './color-circle'
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import keyEvent from './key-event'
  import eventsCard from './event-card.vue'

  export default {
    name: 'grape-complained-dialog',

    props: ['evaluationId', 'type', 'extraObj'],

    components: {
      colorCircle,
      IDialog,
      keyEvent,
      eventsCard
    },

    data () {
      return {
        dialogFormVisible: false,
        formData: {},
        keyEventData: {},
        rules: {
          description: [
            {min: 1, max: 255, message: '长度最大为255个字符', trigger: 'change'}
          ]
        },
        dialogToolbar: [
          {
            text: '作废',
            func: done => {
              this.handleCancel(done)
            }
          },
          {
            text: '确定',
            func: done => {
              this.handleSave(done)
            }
          }
        ]
      }
    },

    created () {
      this.initData()
    },
  
    methods: {
      initData () {
        if (this.evaluationId) {
          req('complainedDetail', {evaluationId: this.evaluationId}).then((data) => {
            this.formData = data
            // this.formData.complainDesc = this.extraObj.complainDesc
            // this.formData.handleDesc = this.extraObj.handleDesc
            // this.formData.handleRes = this.extraObj.handleRes
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      dateFormat (cellValue) {
        return new Date(cellValue).toLocaleString()
      },
      getPhotoId (totalId) {
        this.formData.keyEvent.addPhotos = totalId
      },
      /* 数据校验 */
      validate () {
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.formData)
            } else {
              resolve(false)
            }
          })
        })
      },
      // 确认按钮
      save () {
        return new Promise(resolve => {
          resolve(true)
        })
      },
      changeScore (score) {
        // this.formData.score = score.score
      },
      showKeyEvent () {
        if (this.formData.keyEvent) {
          this.dialogFormVisible = true
        }
      },
      handleCancel (done) {
        this.$refs.keyEventEdit.cancel().then(res => {
          if (res) {
            console.log(res)
            this.formData.keyEvent = res
            done()
          }
        })
      },
      handleSave (done) {
        this.$refs.keyEventEdit.save().then(res => {
          if (res) {
            console.log(res.uploadComponent)
            this.formData.keyEvents = res
            done()
          }
        })
      }
    }
  }

</script>
<style lang="scss">
  .grape-complained-dialog {
    /*.el-table .cell, .el-table__footer-wrapper, .el-table__header-wrapper {*/
    /*overflow: auto;*/
    /*}*/
    .pointer {
      cursor: pointer;
    }
    .event {
      color: blue;
    }
    .el-table {
      border: 0;
      td {
        padding-left: 5px;
        border: 1px solid #dfe6ec;
        text-align: left;
      }
    }
    .dobble {
      background-color: #F6F7F9;
    }
  }

</style>
