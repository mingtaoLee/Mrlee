<template>
  <div class="key-event">
    <el-form
      ref="form"
      :loading="loading"
      labelWidth="120px"
      :model="keyEvent"
      :rules="rules"
    >
      <el-form-item label="事件属性:">
        <el-radio-group :disabled="eventType" v-model="keyEvent.isPositive">
          <el-radio label="Y">正面</el-radio>
          <el-radio label="N">负面</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="记录日期:">
        {{keyEvent.writeDate === null ? '' : new Date(keyEvent.writeDate).toLocaleString()}}
      </el-form-item>
      <el-form-item label="事件行为:" required>
        <table class="el-table">
          <tr>
            <td>情境（Situation）</td>
            <td>
              <el-form-item prop="situation" :rules="length">
                <el-input :disabled="eventType" v-model="keyEvent.situation"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>目标（Target）</td>
            <td>
              <el-form-item prop="target" :rules="length">
                <el-input :disabled="eventType" v-model="keyEvent.target"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>行动（Action）</td>
            <td>
              <el-form-item prop="action" :rules="length">
                <el-input :disabled="eventType" v-model="keyEvent.action"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>结果（Result）</td>
            <td>
              <!--{{keyEvent.result}}-->
              <el-form-item prop="result" :rules="length">
                <el-input :disabled="eventType" v-model="keyEvent.result"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form-item>
      <el-form-item label="照片:">
        <el-upload
          ref="upload"
          :action="uploadUrl"
          :auto-upload="true"
          list-type="picture-card"
          :file-list="oldFiles"
          :on-success="handlePictureCardSuccess"
          :on-remove="handleRemove"
          v-if="!eventType"
        >
          <i v-if="photoPath"   @click.stop="deletePhoto" class="el-icon-close" > </i>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div  class="img-group" v-else>
          <img
            class="img-item"
            :src="`${uploadUrl}/${item.photoId}`"
            v-for="(item,index) in keyEvent.photos"
            :key="index"
            alt="截图"
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  // import { uploaderLinks } from 'api/common/upload'
  import { BASE_URL } from 'config/api'

  export default {
    name: 'grape-key-event',

    components: {},

    props: ['keyEvent', 'eventType'],

    created () {
      if (this.keyEvent.photos && this.keyEvent.photos.length) {
        if (!this.eventType) {
          this.oldFiles = this.keyEvent.photos.map(ele => ({ 'url': this.uploadUrl + '/' + ele.photoId }))
        }
      }
    },

    data () {
      return {
        oldFiles: [],
        uploadUrl: BASE_URL + '/system/attachments/image',
        fileList: [],
        rules: {
          length: [
            {min: 1, max: 127, message: '长度最大为127个字符', trigger: 'change'}
          ]
        },
        length: [
          {min: 1, max: 127, message: '长度最大为127个字符', trigger: 'change'}
        ],
        photoPath: ''
      }
    },

    computed: {
      // dealedPhotos () {
      //   let arr = []
      //   this.keyEvent.photos && this.keyEvent.photos.length && this.keyEvent.photos.map(ele => ({ 'url': this.uploadUrl + '/' + ele }))
      //   return arr
      // }
    },

    methods: {
      /* 数据校验 */
      validate () {
        return new Promise(resolve => {
          resolve(this.keyEvent)
        })
      },

      handlePictureCardSuccess (response, file, fileList) {
        let totalId = fileList.map((val, index) => {
          return val.response
        })
        this.photoPath = file.response
        console.log(totalId)
        this.oldFiles.push(file)
        // debugger
        this.$emit('getPhotoId', file.response)
      },

      handleRemove (file, fileList) {
        let photos = this.keyEvent.photos
        let flag = false
        photos.forEach((ele, index) => {
          if (ele.photoId === file.response) {
            ele.updateType === 1 && photos.splice(index, 1)
            flag = true
          }
        })
        if (!flag) {
          photos.push({
            photoId: file.response,
            updateType: 3
          })
        }
        // this.$emit('removePhotoId', file.response)
      },

      deletePhoto () {
        this.photoPath = ''
      },

      // 确认按钮
      save () {
        return new Promise(resolve => {
          this.validate().then(res => {
            res.isCancel = 'N'
            res.updateType = '2'
            resolve(res)
          })
        })
      },

      cancel () {
        return new Promise(resolve => {
          this.validate().then(res => {
            res.isCancel = 'Y'
            res.updateType = '2'
            resolve(res)
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  .key-event {
    .el-table {
      border: 0;
      td {
        border: 1px solid #dfe6ec;
        text-align: center;
      }
    }
    .img-group {
      padding: 24px;
      .img-item {
        float: left;
        width: 148px;
        height: 148px;
        margin-right: 10px;
      }
    }
  }
</style>
