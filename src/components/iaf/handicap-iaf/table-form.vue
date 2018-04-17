  <template>
  <div>
    <el-form class="box" ref="tableData" :model="data" :inline="true" :rules="rules">
      <el-row>
        <el-col label="险种" class="title-label">险种</el-col>
        <el-col label="户头" class="title-label">户头</el-col>
        <el-col label="个人" class="title-label">个人</el-col>
        <el-col label="公司" class="title-label">公司</el-col>
      </el-row>
      <!-- 养老保险 -->
      <el-row class="content-row">
        <el-form-item class="content-label">
          <el-input :readonly="true" v-model="tableNames.endowmentRecordName"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input v-model="data.endowmentAccountCode"></el-input>
        </el-form-item>
        <el-form-item class="content-label" prop="endowmentEmpPayValue">
          <el-input v-model="data.endowmentEmpPayValue" type="number"></el-input>
        </el-form-item>
        <el-form-item class="content-label" prop="endowmentCompPayValue">
          <el-input v-model="data.endowmentCompPayValue" type="number"></el-input>
        </el-form-item>
      </el-row>
      <!-- 医疗保险 -->
      <el-row class="content-row">
        <el-form-item class="content-label">
          <el-input  :readonly="true" v-model="tableNames.medicareRecordName"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input v-model="data.medicareAccountCode"></el-input>
        </el-form-item>
        <el-form-item class="content-label" prop="medicareEmpPayValue">
          <el-input  v-model="data.medicareEmpPayValue" type="number"></el-input>
        </el-form-item>
        <el-form-item class="content-label" prop="medicareCompPayValue">
          <el-input  v-model="data.medicareCompPayValue" type="number"></el-input>
        </el-form-item>
      </el-row>
      <!-- 失业保险 -->
      <el-row class="content-row">
        <el-form-item class="content-label">
          <el-input :readonly="true"  v-model="tableNames.unemploymentRecordName"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input v-model="data.unemploymentAccountCode"></el-input>
        </el-form-item>
        <el-form-item class="content-label" prop="unemploymentEmpPayValue">
          <el-input  v-model="data.unemploymentEmpPayValue" type="number"></el-input>
        </el-form-item>
        <el-form-item class="content-label" prop="unemploymentCompPayValue">
          <el-input  v-model="data.unemploymentCompPayValue" type="number"></el-input>
        </el-form-item>
      </el-row>
      <!-- 工伤保险 -->
      <el-row class="content-row">
        <el-form-item class="content-label">
          <el-input :readonly="true"  v-model="tableNames.employmentInjuryRecordName"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input v-model="data.employmentInjuryAccountCode"></el-input>
        </el-form-item>
        <el-form-item class="content-label" prop="employmentInjuryEmpPayValue">
          <el-input  v-model="data.employmentInjuryEmpPayValue" type="number"></el-input>
        </el-form-item>
        <el-form-item class="content-label" prop="employmentInjuryCompPayValue">
          <el-input  v-model="data.employmentInjuryCompPayValue" type="number"></el-input>
        </el-form-item>
      </el-row>
      <!-- 生育保险 -->
      <el-row class="content-row">
        <el-form-item class="content-label">
          <el-input :readonly="true" v-model="tableNames.maternityRecordName"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input v-model="data.maternityAccountCode"></el-input>
        </el-form-item>
        <el-form-item class="content-label" prop="maternityEmpPayValue">
          <el-input  v-model="data.maternityEmpPayValue" type="number"></el-input>
        </el-form-item>
        <el-form-item class="content-label" prop="maternityCompPayValue">
          <el-input  v-model="data.maternityCompPayValue" type="number"></el-input>
        </el-form-item>
      </el-row>
      <!-- 公积金 -->
      <el-row class="content-row">
        <el-form-item class="content-label">
          <el-input :readonly="true" v-model="tableNames.hpfundRecordName"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input v-model="data.hpfundAccountCode"></el-input>
        </el-form-item>
        <el-form-item class="content-label" prop="hpfundEmpPayValue">
          <el-input  v-model="data.hpfundEmpPayValue" type="number"></el-input>
        </el-form-item>
        <el-form-item class="content-label" prop="hpfundCompPayValue">
          <el-input  v-model="data.hpfundCompPayValue" type="number"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
  </template>
  <script>
  export default {
    props: {
      data: Object,
      tableNames: Object
    },
    data () {
      return {
        rules: {
          endowmentEmpPayValue: [
            {validator: this.checkAccountCode, trigger: 'change'}
          ],
          endowmentCompPayValue: [
            {validator: this.checkAccountCode, trigger: 'change'}
          ],
          medicareEmpPayValue: [
            {validator: this.checkAccountCode, trigger: 'change'}
          ],
          medicareCompPayValue: [
            {validator: this.checkAccountCode, trigger: 'change'}
          ],
          unemploymentEmpPayValue: [
            {validator: this.checkAccountCode, trigger: 'change'}
          ],
          unemploymentCompPayValue: [
            {validator: this.checkAccountCode, trigger: 'change'}
          ],
          employmentInjuryEmpPayValue: [
            {validator: this.checkAccountCode, trigger: 'change'}
          ],
          employmentInjuryCompPayValue: [
            {validator: this.checkAccountCode, trigger: 'change'}
          ],
          hpfundEmpPayValue: [
            {validator: this.checkAccountCode, trigger: 'change'}
          ],
          hpfundCompPayValue: [
            {validator: this.checkAccountCode, trigger: 'change'}
          ],
          maternityEmpPayValue: [
            {validator: this.checkAccountCode, trigger: 'change'}
          ],
          maternityCompPayValue: [
            {validator: this.checkAccountCode, trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      checkAccountCode (rule, value, cb) {
        if (Number.isNaN(Number(value))) {
          cb(new Error('请输入数字'))
        } else if (Number(value) < 0) {
          cb(new Error('请输入正数'))
        } else if (value) {
          const insuranceType = ['medicare', 'endowment', 'unemployment', 'employmentInjury', 'maternity', 'hpfund']
          insuranceType.forEach(item => {
            if (rule.fullField.includes(item)) {
              this.data[item + 'AccountCode'] !== '' ? cb() : cb(new Error('请输入对应户头代码'))
            }
          })
        }
      },
      validator () {
        return !document.querySelector('.el-form-item__error')
      }
    },
    watch: {
      'data.endowmentAccountCode' (newValue) {
        if (newValue === '') {
          this.data.endowmentEmpPayValue += ''
          this.data.endowmentCompPayValue += ''
        } else {
          this.data.endowmentEmpPayValue *= 1
          this.data.endowmentCompPayValue *= 1
        }
      },
      'data.medicareAccountCode' (newValue) {
        if (newValue === '') {
          this.data.medicareEmpPayValue += ''
          this.data.medicareCompPayValue += ''
        } else {
          this.data.medicareEmpPayValue *= 1
          this.data.medicareCompPayValue *= 1
        }
      },
      'data.unemploymentAccountCode' (newValue) {
        if (newValue === '') {
          this.data.unemploymentEmpPayValue += ''
          this.data.unemploymentCompPayValue += ''
        } else {
          this.data.unemploymentEmpPayValue *= 1
          this.data.unemploymentCompPayValue *= 1
        }
      },
      'data.employmentInjuryAccountCode' (newValue) {
        if (newValue === '') {
          this.data.employmentInjuryEmpPayValue += ''
          this.data.employmentInjuryCompPayValue += ''
        } else {
          this.data.employmentInjuryEmpPayValue *= 1
          this.data.employmentInjuryCompPayValue *= 1
        }
      },
      'data.maternityAccountCode' (newValue) {
        if (newValue === '') {
          this.data.maternityEmpPayValue += ''
          this.data.maternityCompPayValue += ''
        } else {
          this.data.maternityEmpPayValue *= 1
          this.data.maternityCompPayValue *= 1
        }
      },
      'data.hpfundAccountCode' (newValue) {
        if (newValue === '') {
          this.data.hpfundEmpPayValue += ''
          this.data.hpfundCompPayValue += ''
        } else {
          this.data.hpfundEmpPayValue *= 1
          this.data.hpfundCompPayValue *= 1
        }
      }
    }
  }
  </script>
  <style lang="scss" scoped>
    .content-row{
      width:100%;
      padding-bottom: 6px;
      /deep/ .el-form-item__error{
        top: 80%;
      }
    }
    .title-label{
      width:24%;
      margin:0;
      text-align:center;
    }
    .content-label{
      width:24%;
      margin:0;
    }
    .box{
      padding-left:15px;
      padding-bottom:10px;
      border:1px solid #aaa;
      border-radius:5px;
      box-sizing:border-box;
    }
  </style>
