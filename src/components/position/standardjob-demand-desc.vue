<template>
  <div class="content-follow">
    <h2 class="info-title">需求描述</h2>
    <div class="info-content">
      <el-form :model="model" :rules="rules" label-width="140px" label-position="right" @submit.native.prevent>
        <el-form-item label="维护功能">
          <span class="bold">标准职位{{model.operationType | convertAction}}</span>
        </el-form-item>
        <el-form-item label="申请时间" v-if="model.operationType === 0">
          <span>{{ model.applicationDate }}</span>
        </el-form-item>
        <el-form-item label="维护描述" prop="desc">
          <el-col :span="8">
            <el-input type="textarea" v-model.trim="model.desc"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="附件">
          <el-col :span="12">
            <Uploader />
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Uploader from 'components/common/upload/uploader'
  export default {
    name: 'StandardjobDemandDesc',
    props: ['model'],
    data () {
      return {
        rules: {
          effectiveDate: [
          { type: 'date', required: true, message: '请输入撤销日期', trigger: 'blur' }
          ],
          desc: [{ max: 512, message: '长度不能超过512个字符', trigger: 'blur' }]
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        }
      }
    },
    filters: {
      convertAction (val) {
        let action = ''
        switch (val) {
          case 0:
            action = '新增'
            break
          case 1:
            action = '修改'
            break
          case 2:
            action = '撤销'
            break
        }
        return action
      }
    },
    methods: {
    },
    components: {
      Uploader
    }
  }
</script>

<style lang="scss" scoped>

</style>
