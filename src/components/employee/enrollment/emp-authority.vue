<template>
  <section class="content-follow">
    <h2 class="info-title">权限开通</h2>
    <el-row>
      <el-form
        :model="item"
        label-width="120px"
        class="form-main"
        v-for="(item, index) in authorityInfo"
        :key="index"
        :rules="rules"
        v-if="showMap[item.powerType]">
        <el-col :span="6">
          <el-form-item :label="getType(item.powerType)" prop="hasPower">
            <el-radio-group v-model="item.hasPower" :disabled="disabledMap[item.powerType]">
              <el-radio label="Y">开通</el-radio>
              <el-radio label="N">不开通</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

      </el-form>
    </el-row>
  </section>
</template>
<script>
  export default {
    props: {
      authorityInfo: Array
    },
    data () {
      return {
        rules: {
          hasPower: [
            { required: true, message: '请选择开通或者不开通', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
       // 获取类型
      getType (type) {
        switch (type) {
          case '1':
            return 'OA系统'
          case '2':
            return '人力管理'
          case '3':
            return '考勤系统'
          case '4':
            return '员工报销（新）'
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .emp-authority {
    .form-main {
      .el-form-item {
        width: 280px;
      }
    }
  }
</style>


