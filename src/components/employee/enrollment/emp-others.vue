<template>
  <section class="emp-others content-follow">
    <h2 class="info-title">其他信息</h2>

    <el-form :model="hireInfo.empOthers" label-width="124px" class="form-main clearfix" :rules="rules">
      <el-row>
        <el-col :span="6">
          <el-form-item label="是否残疾人" prop="isHandicapped" v-if="showMap.isHandicapped">
            <i-select
            v-model="hireInfo.empOthers.isHandicapped"
            parameter="WHETHER_TYPE"
            :disabled="disabledMap.isHandicapped"
            ></i-select>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="hireInfo.empOthers.isHandicapped==='Y'">
          <el-form-item label="伤残组" prop="handicappedGroup" v-if="showMap.handicappedGroup">
            <i-select
            v-model="hireInfo.empOthers.handicappedGroup"
            parameter="HANDICAPPED_GROUP"
            :disabled="disabledMap.handicappedGroup"
            ></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="hireInfo.empOthers.isHandicapped==='Y'">
          <el-form-item label="伤残类型" prop="handicappedType" v-if="showMap.handicappedType">
            <i-select
            v-model="hireInfo.empOthers.handicappedType"
            parameter="DISABILITY_GRADE"
            :disabled="disabledMap.handicappedType"></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否退伍军人" prop="isVeteran" v-if="showMap.isVeteran">
            <i-select
            v-model="hireInfo.empOthers.isVeteran"
            parameter="WHETHER_TYPE"
            :disabled="disabledMap.isVeteran"></i-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="健康状况" prop="healthyCondition" v-if="showMap.healthyCondition">
            <i-select
            v-model="hireInfo.empOthers.healthyCondition"
            :maxlength="20"
            parameter="WHETHER_TYPE"
            :disabled="disabledMap.healthyCondition"></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- style="width: 319px;" -->
          <el-form-item label="有无传染病史" prop="hadInfectious" v-if="showMap.hadInfectious">
            <i-select
            v-model="hireInfo.empOthers.hadInfectious"
            parameter="HAVE_OR_NOT"
            :disabled="disabledMap.hadInfectious"></i-select>
          </el-form-item>
        </el-col>
         <!-- <el-col :span="24" v-if="hireInfo.empOthers.hadInfectious === 'Y'">
          <el-form-item label="传染病史详述" prop="infectious" style="width: 400px;">
            <el-input type="textarea" v-model="hireInfo.empOthers.infectious"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="有无重大疾病史" prop="hadSeriousDisease" v-if="showMap.hadSeriousDisease">
            <i-select
            v-model="hireInfo.empOthers.hadSeriousDisease"
            parameter="HAVE_OR_NOT"
            :disabled="disabledMap.hadSeriousDisease"></i-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24"  v-if="hireInfo.empOthers.hadSeriousDisease === 'Y'">
          <el-form-item label="重大疾病史详述" prop="seriousDisease" style="width: 400px;">
            <el-input type="textarea" v-model="hireInfo.empOthers.seriousDisease" ></el-input>
          </el-form-item>
        </el-col> -->
        <!-- TODO:上岗证书待确认 -->
        <!-- <el-col :span="6">
          <el-form-item label="上岗证书" >
            <i-select v-model="hireInfo.empCredential.credentialType" parameter="JOB_CERTIFICATE"></i-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="hireInfo.empCredential.credentialType">
          <el-form :model="hireInfo.empCredential" label-width="124px" :rules="dateRules">
            <el-col :span="12">
          <el-form-item label="证书有效期" prop="beginDate" required  >
            <el-date-picker type="date" placeholder="选择日期" v-model="hireInfo.empCredential.beginDate" style="width: 100%;" @change="change($event, 'beginDate')" :picker-options="begin" />
          </el-form-item></el-col> -->
        <!-- </el-col>
        <el-col :span="6" v-if="hireInfo.empCredential.credentialType"> -->
            <!-- <el-col :span="12">
          <el-form-item label="至"  prop="endDate" required >
            <el-date-picker type="date" placeholder="选择日期" v-model="hireInfo.empCredential.endDate" style="width: 100%;" @change="change($event, 'endDate')" :picker-options="hireInfo.empCredential.credentialType !== '3' ? end : healthyEnd" />
          </el-form-item></el-col> -->
        <!-- </el-form> -->
        <!-- </el-col> -->
      </el-row>

    </el-form>
  </section>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select'
  export default {
    components: {
      ISelect
    },
    props: {
      hireInfo: Object
    },
    data () {
      let checkDate = (rule, value, cb) => {
        !value && cb(new Error('请选择日期'))
        cb()
      }

      return {
        begin: {
          disabledDate: (time) => {
            let end = this.hireInfo.empCredential.endDate || 0
            let birth = this.hireInfo.empEmployeeEmpContacts.birthDate
            if (end) return time.getTime() > new Date(end).getTime() || time.getTime() < new Date(birth).getTime()
            return time.getTime() < new Date(birth).getTime()
          }
        },
        end: {
          disabledDate: (time) => {
            let begin = this.hireInfo.empCredential.beginDate || 0
            let birth = this.hireInfo.empEmployeeEmpContacts.birthDate
            return time.getTime() < new Date(begin).getTime() || time.getTime() < new Date(birth).getTime()
          }
        },
        healthyEnd: {
          disabledDate: (time) => {
            let begin = this.hireInfo.empCredential.beginDate || 0
            let birth = this.hireInfo.empEmployeeEmpContacts.birthDate
            return time.getTime() < new Date(begin).getTime() || time.getTime() < new Date(birth).getTime() || time.getTime() > new Date(begin).setFullYear(new Date(begin).getFullYear() + 1)
          }
        },
        rules: {
          isHandicapped: [
            { required: true, message: '请选择是否为残疾人', trigger: 'change' }
          ],
          handicappedGroup: [
            { required: true, message: '请选择是否为退伍军人', trigger: 'change' }
          ],
          handicappedType: [
            { required: true, message: '请选择伤残组', trigger: 'change' }
          ],
          isVeteran: [
            { required: true, message: '请选择伤残类型', trigger: 'change' }
          ],
          hadInfectious: [{ required: true, message: '请选择有无传染病史', trigger: 'change' }],
          infectious: [{ required: true, message: '请填写传染病史详述', trigger: 'change' }],
          healthyCondition: [{ required: true, message: '请填写健康状况', trigger: 'change' }],
          hadSeriousDisease: [{ required: true, message: '请选择有无重大疾病史', trigger: 'change' }],
          seriousDisease: [{ required: true, message: '请填写重大疾病史详述', trigger: 'change' }]
        },
        dateRules: {
          beginDate: [{ validator: checkDate, trigger: 'change' }],
          endDate: [{ validator: checkDate, trigger: 'change' }]
        }
      }
    },
    watch: {
      'hireInfo.empCredential.credentialType': {
        handler: function (newVal) {
          if (newVal === '3') {
            let begin = new Date(this.hireInfo.empCredential.beginDate || 0)
            let end = new Date(this.hireInfo.empCredential.endDate || 0)

            begin.setFullYear(begin.getFullYear() + 1) < end && (this.hireInfo.empCredential.endDate = '')
          }
        }
      }
    },

    methods: {
      // 日期选择器赋值
      change ($event, prop) {
        this.hireInfo.empCredential[prop] = $event
      }
    }
  
  }
</script>
<style lang="scss" scoped>
  .emp-others {
    .form-main {
      .el-form-item {
        width: 100%;
      }
    }
  }
</style>
<style lang="scss">
.emp-others {
  .dateBox {
    .el-col-2 {
      text-align: center;
    }
  }
}
</style>
