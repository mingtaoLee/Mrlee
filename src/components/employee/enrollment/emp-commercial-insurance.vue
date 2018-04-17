<template>
  <section>
    <el-form class="emp-commercial-insurance" :model="hireInfo.empPosition" :rules="rules">
      <el-row>
        <el-col :span="20">
          <el-form-item
            label="是否购买商业保险"
            prop="hasCommercialInsurance"
            class="col-166"
            v-if="showMap.hasCommercialInsurance"
            >
            <!--  :disabled="hireInfo.empEmployeeEmpContacts.hasInsurance==='N'" -->
            <el-radio-group v-model="hireInfo.empPosition.hasCommercialInsurance" :disabled="disabledMap.hasCommercialInsurance || hireInfo.tip">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
<script>
  export default {
    props: {
      hireInfo: Object
      // isShow: Boolean
    },
    data () {
      return {
        // rules: {
        //   hasCommercialInsurance: [{ required: true, message: '商业保险不能为空', trigger: 'change' }]
        // }
      }
    },
    created () {
      // console.log(this.hireInfo.tip)
      this.hireInfo.tip ? this.hireInfo.empPosition.hasCommercialInsurance = 'N' : ''
    },
    watch: {
      'hireInfo.tip': {
        handler: function (newVal, oldVal) {
          // console.log(newVal)
          newVal ? this.hireInfo.empPosition.hasCommercialInsurance = 'N' : ''
        },
        deep: true
      }
    },
    methods: {
    }
  }
</script>
<style lang="scss">
  .emp-commercial-insurance {
    margin-left: 20px;
    .el-radio + .el-radio {
      margin-left: 20px;
    }
    .col-166 {
      width: 400px;
      .el-form-item__label {
        width: 166px !important;
        margin-right: 50px;
      }
      .el-form-item__content {
        width: 400px !important;
      }
    }
  }
</style>



