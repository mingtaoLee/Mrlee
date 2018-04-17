  <template>
  <div>
    <el-form class="box" :model="data" :inline="true">
      <el-form-item label="险种" class="title-label"></el-form-item>
      <el-form-item label="个人" class="title-label"></el-form-item>
      <el-form-item label="公司" class="title-label"></el-form-item>
      <!-- 养老保险 -->
      <el-form-item class="content-row">
        <el-form-item class="content-label">
          <el-input :readonly="true" v-model="tableNames.endowmentRecordName"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input v-model="data.endowmentEmpPayValue" type="number"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input v-model="data.endowmentCompPayValue" type="number"></el-input>
        </el-form-item>
      </el-form-item>
      <!-- 医疗保险 -->
      <el-form-item class="content-row">
        <el-form-item class="content-label">
          <el-input  :readonly="true" v-model="tableNames.medicareRecordName"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input  v-model="data.medicareEmpPayValue" type="number"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input  v-model="data.medicareCompPayValue" type="number"></el-input>
        </el-form-item>
      </el-form-item>
      <!-- 失业保险 -->
      <el-form-item class="content-row">
        <el-form-item class="content-label">
          <el-input :readonly="true"  v-model="tableNames.unemploymentRecordName"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input  v-model="data.unemploymentEmpPayValue" type="number"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input  v-model="data.unemploymentCompPayValue" type="number"></el-input>
        </el-form-item>
      </el-form-item>
      <!-- 工伤保险 -->
      <el-form-item class="content-row">
        <el-form-item class="content-label">
          <el-input :readonly="true"  v-model="tableNames.employmentInjuryRecordName"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input  v-model="data.employmentInjuryEmpPayValue" type="number"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input  v-model="data.employmentInjuryCompPayValue" type="number"></el-input>
        </el-form-item>
      </el-form-item>
      <!-- 生育保险 -->
      <el-form-item class="content-row">
        <el-form-item class="content-label">
          <el-input :readonly="true" v-model="tableNames.maternityRecordName"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input  v-model="data.maternityEmpPayValue" type="number"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input  v-model="data.maternityCompPayValue" type="number"></el-input>
        </el-form-item>
      </el-form-item>
      <!-- 公积金 -->
      <el-form-item class="content-row">
        <el-form-item class="content-label">
          <el-input :readonly="true" v-model="tableNames.hpfundRecordName"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input  v-model="data.hpfundEmpPayValue" type="number"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input  v-model="data.hpfundCompPayValue" type="number"></el-input>
        </el-form-item>
      </el-form-item>
      <!-- 滞纳金 -->
      <el-form-item class="content-row">
        <el-form-item class="content-label">
          <el-input :readonly="true" v-model="tableNames.lateFeeRecordName"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input  v-model="data.lateFeeEmpPayValue" type="number"></el-input>
        </el-form-item>
        <el-form-item class="content-label">
          <el-input  v-model="data.lateFeeCompPayValue" type="number"></el-input>
        </el-form-item>
      </el-form-item>
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

      }
    },
    methods: {
      computerTotal () {

      }
    }
  }
  </script>
  <style lang="scss" scoped>
    .content-row{
      width:100%;
    }
    .title-label{
      width:30%;
      margin:0;
      text-align:center;
    }
    .content-label{
      width:30%;
      margin:0;
    }
    .box{
      padding-left:20px;
      padding-bottom:10px;
      border:1px solid #aaa;
      border-radius:5px;
      box-sizing:border-box;
    }
    .el-dialog--small{

    }
  </style>
