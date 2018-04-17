<template>
  <section class="emp-basic-conversion content-follow">
    <h2 class="info-title">基本信息</h2>

    <el-form
      :model="conversionInfo"
      label-width="120px"
      class="form-main clearfix"
      :rules="rules">
      <el-row>
        <!-- <el-col :span="6">
          <el-form-item label="创建时间" prop="createDate">
            <el-date-picker type="date" :disabled="true" v-model="conversionInfo.createDate" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="转正人员" prop="fullName" v-if="showMap.fullName" class="box1">
            <!-- <el-input v-model="conversionInfo.fullName" @blur='test()'></el-input> -->
           <!-- 人员组织选择器 -->
            <el-input class="input-box" v-model="conversionInfo.fullName" :disabled="disabledMap.fullName || !isFlowCenter" readonly>
                <i  v-if="showMap.fullName" slot="suffix" class="el-icon-menu" @click="handleIconClick" ></i>
            </el-input>
          <i-show-personnelInfo 
              v-if="showMap.fullName" 
              :id="conversionInfo.empEmployeeId" 
              class="btn1" 
              v-show="conversionInfo.fullName"
             
          ></i-show-personnelInfo> 
            <i-personnel-select
             :isShow.sync="isShow"
             :modal='true'
             :disabled="disabledMap.fullName" 
             @confirm="handleConfirm"
             :multiple="false"
             :hasGrant="false"
              filterType="personnelGroup"
             >
            </i-personnel-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="入职日期" prop="hireDate" v-if="showMap.hireDate">
            <el-date-picker
              type="date"
              :disabled="disabledMap.hireDate"
              v-model="conversionInfo.hireDate"
              style="width: 100%;"
              :placeholder="disabledMap.hireDate && ''"
              >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="组织" prop="orgUnitName" v-if="showMap.orgUnitName">
            <el-input
              v-model="conversionInfo.orgUnitName"
              :disabled="disabledMap.orgUnitName"
              :placeholder="disabledMap.orgUnitName && ''"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="职位" prop="posPositionName" v-if="showMap.posPositionName">
            <el-input
              v-model="conversionInfo.posPositionName"
              :disabled="disabledMap.posPositionName"
              :placeholder="disabledMap.posPositionName && ''"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="标准职位" prop="posStandardJobName" v-if="showMap.posStandardJobName">
            <el-input
              v-model="conversionInfo.posStandardJobName"
              :disabled="disabledMap.posStandardJobName"
              :placeholder="disabledMap.posStandardJobName && ''"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="成本中心" prop="costCenter">
            <el-input v-model="conversionInfo.costCenter" :disabled=""></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="人事范围" prop="personnelGroupName" v-if="showMap.personnelGroupName">
            <el-input
              v-model="conversionInfo.personnelGroupName"
              :disabled="disabledMap.personnelGroupName"
              :placeholder="disabledMap.personnelGroupName && ''"></el-input>
          </el-form-item>
        </el-col>
        
      </el-row>

      <el-row>
        <el-form-item label="转正自评" prop="selfContent" class="col-wider" v-if="showMap.selfContent && isShowContent">
          <el-col :span="20">
            <el-input
              type="textarea"
              :rows="3"
              maxlength="200"
              v-model="conversionInfo.selfContent"
              :disabled="disabledMap.selfContent"
              :placeholder="disabledMap.selfContent && ''"
              >
            </el-input>
          </el-col>
        </el-form-item>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="附件" class="uploaderForm" v-if="showMap.fileList">
            <i-upload
              :previewMode="disabledMap.fileList"
              :fileList="conversionInfo.fileList"
              @onRemove="onFileRemove"
              @onSuccess="onFileSuccess"
              @onError="onFileError"
            >
            </i-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
<script>
  // import req from 'api/employee/personal'
  import ISelect from 'components/common/i-select/i-select'
  import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import req from 'api/employee/personal'
  import IUpload from 'components/common/upload/uploader'
  import IShowPersonnelInfo from 'components/common/i-show-personnelInfo'
  export default {
    components: {
      ISelect,
      iPersonnelSelect,
      IUpload,
      IShowPersonnelInfo
    },
    props: {
      putConversionInfo: Object,
      conversionInfo: Object
    },
    created () {
      console.log(this.isShowContent)
    },
    data () {
      return {
        isPreviewMode: false,
        rules: {
          selfContent: [
            { required: true, message: '请填写转正自评', trigger: 'blur' }
          ],
          fullName: [
            { required: true, message: '请选择转正人员', trigger: 'change' }
          ]
        },
        isShow: false,
        isFlowCenter: this.$route.query.isFlowCenter
      }
    },
    computed: {
      isShowContent () {
        return this.$store.state.user.info.empEmployeeId === this.conversionInfo.empEmployeeId
      }
    },
    methods: {
      // 人员选择器选中人员
      handleConfirm (selected) {
        //  选中的人员数组
        if (selected.length !== 0) {
          this.conversionInfo.fullName = selected[0].employeeName
          this.conversionInfo.empEmployeeId = selected[0].employeeId
          // 发送请求数据
          req('getConversionInfo', { empEmployeeId: selected[0].employeeId }).then(async res => {
            await this.getStardardJobName(res.posPositionId)
            Object.assign(this.conversionInfo, res)
            this.conversionInfo.regularizationType = '1'
            this.conversionInfo.regularSalary = this.conversionInfo.expectedRegularSalary
            this.conversionInfo.regularSalaryType = res.expectedRegularSalaryType
          })
        } else {
          Object.keys(this.conversionInfo).map(item => {
            this.conversionInfo[item] = ''
          })
        }
      },

       // 获取标准职位
      getStardardJobName (posPositionId) {
        posPositionId && req('getPositions', {posPositionId})
        .then(data => (this.conversionInfo.posStandardJobName = data.posStandardJobName))
      },

       // 控制人呢元选择器弹框显示隐藏
      handleIconClick () {
        // 在发起流程第一阶段才可以选人，其他阶段不可以选人
        this.isFlowCenter ? this.isShow = !this.isShow : this.isShow = false
      },
  
       // 文件成功上传
      onFileSuccess (response, file, fileList) {
        this.$message.success('文件上传成功！')
        this.conversionInfo.fileList.push(response)
      },
  
       // 文件失败上传
      onFileError (err, file, fileList) {
        console.log('err', err, file, fileList)
      },

       // 文件列表移除文件时
      onFileRemove (file, fileList) {
        this.conversionInfo.fileList.map(id => {
          id === file.response && this.conversionInfo.fileList.splice(this.conversionInfo.fileList.indexOf(id), 1)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .emp-basic-conversion {
    .form-main {
     .box1 {
       position: relative;
       .btn1 {
          position: absolute;
           left:5px;
          top:0px;
      }
    }
      .el-form-item {
        width: 280px;
      }
      .uploaderForm {
        width: 800px;
      }
    }
  }

  .col-wider {
    width: 690px !important;
  }
</style>
<style  lang="scss">
    .input-box {
      .el-input__inner {
        text-indent: 10px;
      }
    }
</style>




