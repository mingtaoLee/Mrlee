<template>
  <div :class="{'content-follow': showTitle}">
    <h2 class="info-title" v-if="showTitle">关键职责</h2>
    <div class="info-content">
      <el-form :model="model" :rules="rules" label-width="150px" label-position="right" @submit.native.prevent>
        <el-form-item label="关键职责" prop="keyResponsibilities" v-if="showMap.keyResponsibilities">
          <el-col :span="8">
            <el-input type="textarea" v-model.trim="model.keyResponsibilities" :disabled="disabledMap.keyResponsibilities"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StandardjobkeyResponsibilities',
    props: {
      model: {
        type: Object
      },
      showTitle: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        superOcGroup: '',
        superOcKind: '',
        warning: false,
        rules: {
          keyResponsibilities: [{ max: 1024, message: '长度不能超过1024个字符', trigger: 'blur' }]
        }
      }
    },
    created () {
    }
  }
</script>

<style lang="scss" scoped>

</style>
