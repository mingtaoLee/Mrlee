<template>
  <section class="emp-dimission content-follow">
    <h2 class="info-title">基本信息</h2>
    <el-form
      :model="dimissionInfo"
      label-width="120px"
      :rules="rules"
      class="form-main clearfix">

      <!-- TODO:离职人需要用到人员选择组件 -->
      <div class="flex">
      <el-form-item label="离职人" prop="employeeName" v-if="showMap.employeeName" class="box1">
        <el-input  class="input-box" v-model="dimissionInfo.employeeName" :disabled="disabledMap.employeeName || !isFlowCenter" readonly>
            <i v-if="!disabledMap.employeeName" slot="suffix" class="el-icon-menu" @click="handleIconClick" ></i>
        </el-input>
         <i-show-personnelInfo 
            v-if="showMap.employeeName" 
            :id="dimissionInfo.empEmployeeId" 
            class="btn1" 
            v-show="dimissionInfo.employeeName"
         ></i-show-personnelInfo> 
        <i-personnel-select
          :isShow.sync="isShow"
          @confirm="handleConfirm"
          :disabled="disabledMap.employeeName"
          :multiple="false"
          :hasGrant="false"
           filterType="personnelGroup"
          ></i-personnel-select>
      </el-form-item>

      <el-form-item label="入职日期" prop="hireDate" v-if="showMap.hireDate">
        <el-date-picker
          type="date"
          @change="getHTime"
          v-model="dimissionInfo.hireDate"
          style="width: 100%;"
          :disabled="disabledMap.hireDate || true"
          :placeholder="disabledMap.hireDate && ''"
          >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="职位" prop="posPositionName" v-if="showMap.posPositionName">
        <el-input v-model="dimissionInfo.posPositionName" disabled="false" :placeholder="disabledMap.posPositionName && ''"></el-input>
      </el-form-item>

      <el-form-item label="人事范围" prop="personnelGroupName" v-if="showMap.personnelGroupName">
        <el-input v-model="dimissionInfo.personnelGroupName"  disabled="false" :placeholder="disabledMap.personnelGroupName && ''"></el-input>
      </el-form-item>

      <el-form-item label="薪资" prop="salary" v-if="showMap.salary">
           <el-input v-model.number="dimissionInfo.salary" class="input-with-select" disabled :placeholder="disabledMap.salary && ''">
                 <el-select v-model="dimissionInfo.salaryType" slot="append"  disabled>
                  <el-option label="元/时" value="2"></el-option>
                  <el-option label="元/月" value="1"></el-option>
                </el-select>
            </el-input>
      </el-form-item>

        <el-form-item label="薪资组" prop="groupName" v-if="showMap.groupName">
          <el-input v-model="dimissionInfo.groupName"  disabled="false" :placeholder="disabledMap.groupName && ''"></el-input>
        </el-form-item>

        <el-form-item label="期望离职日期" prop="expectDate" v-if="showMap.expectDate">
          <el-date-picker 
            type="date" 
            v-model="dimissionInfo.expectDate" 
            style="width: 100%;" 
            @change="getSTime"
            :disabled="disabledMap.expectDate"
            :picker-options="pickerOptions"
            :editable='false'
            >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="离职类型" prop="terminationType" v-if="showMap.terminationType">
          <i-select
            :disabled="disabledMap.terminationType"
            v-model="dimissionInfo.terminationType"
            parameter='TERMINATION_TYPE' >
          </i-select>
        </el-form-item>
      </div>
     <el-row>
        <el-col :span="6">
          <el-form-item label="离职原因" prop="terminationReason" v-if="showMap.terminationReason">
            <el-select v-model="dimissionInfo.terminationReason" :disabled="disabledMap.terminationReason">
              <el-option
                v-for="item in dimissionInfo.terminationReasonList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
              </el-option>
            </el-select>
          <!-- <i-select v-model="dimissionInfo.terminationReason"  parameter='TERMINATION_REASON' :disabled="editable" > -->
          <!-- </i-select> -->
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="离职原因详述"  prop="terminationReasonDetail" v-if="showMap.terminationReasonDetail">
              <el-input type="textarea"  v-model="dimissionInfo.terminationReasonDetail" :disabled="disabledMap.terminationReasonDetail" resize="both"/>
            </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="0" v-if="showMap.dimissionForm">
            <el-button type="primary" @click="printForm()">离职确认单</el-button>              
          </el-form-item>
        </el-col>
     </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="附件" class="uploaderForm" v-if="showMap.fileList">
            <i-upload
              :previewMode="disabledMap.fileList"
              :fileList="dimissionInfo.fileList"
              @onRemove="onFileRemove"
              @onSuccess="onFileSuccess"
              @onError="onFileError">
            </i-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
       <!-- 打印 -->
      <i-dialog title="离职确认单打印" v-model="dialogTableVisible">
        <editor
          :defaultMsg="content"
          :fill="false"
          :config="print"
          editorId="printDimission"
          @templateContent="dialogTableVisible = false"
          @cancel="dialogTableVisible = false"
          :btn="false">
        </editor>
      </i-dialog>
  </section>
</template>
<script>
  import req from 'api/employee/personal'
  import ISelect from 'components/common/i-select/i-select'
  import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import IUpload from 'components/common/upload/uploader'
  import moment from 'moment'
  import template from './template.js'
  import Editor from 'components/employee/editor'
  import IShowPersonnelInfo from 'components/common/i-show-personnelInfo'

  // import flow from 'mixins/flow'
  export default {
    components: {
      ISelect,
      IPersonnelSelect,
      IUpload,
      Editor,
      IShowPersonnelInfo
    },
    props: {
      dimissionInfo: Object,
      editable: {
        type: Boolean,
        default: false
      }
    },
    // mixins: [flow],
    data () {
      let date = (rule, value, cb) => {
        !value ? cb(new Error('请选择离职日期')) : cb()
      }
      return {
        ...template, // 引入打印的模板内容
        content: {}, // 保存打印的内容
        newTemplate: {},  // 一直放着模板
        dialogTableVisible: false, // 模态框
        print: {
          initialFrameWidth: 700,
          initialFrameHeight: 800,
          toolbars: [['print']]
        },
        attachmentIdList: [],
        rules: {
          employeeName: [
            { required: true, message: '请选择离职人员', trigger: 'change' }
          ],
          expectDate: [
            { required: true, validator: date, trigger: 'change' }
          ],
          terminationType: [
            { required: true, message: '请选择离职类型', trigger: 'change' }
          ],
          terminationReason: [
            { required: true, message: '请填写离职原因', trigger: 'change' }
          ],
          terminationReasonDetail: [
            { required: true, message: '请填写离职原因详述', trigger: 'blur' }
          ]
          // drafterMobile: [
          //   { required: true, validator: checkPhone, trigger: 'blur' }
          // ]
        },
        isShow: false,
        isPreviewMode: false,
        // isBlack: false,
        // isShowBlackList: true,
        terminationReasonList: [],
        pickerOptions: {
          disabledDate: (time) => {
            let day = new Date()
            day = day.setFullYear(day.getFullYear(), day.getMonth(), 0)
            if (this.dimissionInfo.hireDate) {
              // 实际离职时间不能小于入职日期并且不能早于当月
              return time.getTime() < new Date(this.dimissionInfo.hireDate) || time.getTime() < new Date(day).getTime()
            }
          }
  
        },
        isFlowCenter: this.$route.query.isFlowCenter,
        obj: {}
      }
    },
    created () {
      // 先复制一份模板内容
      this.newTemplate = this.templateContent
    },
    computed: {
      username () {
        return this.$store.state.user.info.fullName
      },
      id () {
        return this.$store.state.user.info.empEmployeeId
      }
    },
    watch: {
      'dimissionInfo': {
        handler: function (newVal, oldVal) {
          if (newVal) {
            Object.assign(this.obj, newVal)
          }
        },
        deep: true
      },
      'id' (newVal, oldVal) {
        newVal && this.getPintInfo(newVal)
      }
    },
    methods: {
      // 文件上传前的校验
      handleFileBeforeUpload (file) {
        const isLt10M = file.size / 1024 / 2014 < 10
        if (!isLt10M) {
          this.$message.error('上传文件大小不能超过10M')
        }
      },
      // 获取离职打印单的起草信息
      getPintInfo (id) {
        if (this.dimissionInfo.applicantId) {
          return false
        }
        id && req('getBaseInfo', {employeeId: id}, true, false)
        // 获取申请人的基本信息
        .then(res => {
          this.dimissionInfo.applicantId = res.empEmployeeId
          this.dimissionInfo.applicantCode = res.employeeCode
          this.dimissionInfo.applicantPhone = res.mobile
          this.dimissionInfo.applicantName = res.fullName
        })
      },
      // 离职确认单打印
      printForm () {
         // 循环基本信息，把符合的模板内容进行替换
        Object.keys(this.obj).map(key => {
          let reg = new RegExp('{' + key + '}', 'g')
          !this.obj[key] && (this.obj[key] = '')
          // 日期转换格式
          if (key.includes('Date') && this.obj[key]) {
            this.obj[key] = (typeof (this.obj[key]) !== 'string' || this.obj[key].includes('-') ? moment(new Date(this.obj[key])).format('YYYY年MM月DD日') : this.obj[key])
          }
          // 是否字典替换
          let bl = /^[is]/
          if (bl.test(key)) {
            this.obj[key] === 'Y' && (this.obj[key] = '是')
            this.obj[key] === 'N' && (this.obj[key] = '否')
          }
          this.templateContent = this.templateContent.replace(reg, this.obj[key])
        })
        this.content.templateContent = this.templateContent
        this.dialogTableVisible = true
        // 重新给填充模板内容
        this.templateContent = this.newTemplate
      },
       // 期望离职日期选择器的赋值
      getSTime (val) {
        val ? this.dimissionInfo.expectDate = moment(val).format('YYYY-MM-DD') : this.dimissionInfo.expectDate = ''
      },

      // 入职日期选择器的赋值
      getHTime (val) {
        val ? this.dimissionInfo.hireDate = moment(val).format('YYYY-MM-DD') : this.dimissionInfo.hireDate = ''
      },
  
       // 人员选择器选择人员
      handleConfirm (selected) {
        //  选中的人员数组
        if (selected.length !== 0) {
          this.dimissionInfo.employeeName = selected[0].employeeName
          // 发送请求数据
          req('getDimissionInfo', { empEmployeeId: selected[0].employeeId }).then(res => {
            Object.assign(this.dimissionInfo, res)
            this.dimissionInfo.idNumber = res.employeeIdNumber
            this.dimissionInfo.dismissionNO = 'LZJJ' + moment(new Date()).format('YYYYMMDD') + this.dimissionInfo.employeeCode
          })
                          // 获取资产列表
          req('getFinancilList', {empEmployeeId: selected[0].employeeId})
          .then(res => {
            // console.log(res)
            let flag = false
            res.body && res.body.data && res.body.data.map(item => {
              for (let key in item) {
                if (item[key]) {
                  flag = true
                  break
                }
              }
            })
            flag ? this.dimissionInfo.assetList = res.body.data : this.dimissionInfo.assetList = []
            this.dimissionInfo.assetList && this.dimissionInfo.assetList.map(res => {
              this.$set(res, 'receptEmpolyeeName', '')
              this.$set(res, 'receptEmpolyeeId', '')
              this.$set(res, 'isAccord', 'Y')
            })
          })
           .catch(err => {
             err && (this.dimissionInfo.rpcIsFailed = true)
           })
        } else {
          // this.dimissionInfo.employeeName = ''
          Object.keys(this.dimissionInfo).map(item => {
            this.dimissionInfo[item] = ''
          })
        }
      },

       // 控制人员选择器的显示隐藏
      handleIconClick () {
        // 不是从流程中心进来的一直不显示人员选择
        this.isFlowCenter ? this.isShow = !this.isShow : this.isShow = false
      },

       // 文件上传成功
      onFileSuccess (response, file, fileList) {
        this.$message.success('文件上传成功！')
        !Array.isArray(this.dimissionInfo.fileList) && (this.dimissionInfo.fileList = [])
        this.dimissionInfo.fileList.push(response)
      },

       // 文件上传失败
      onFileError (err, file, fileList) {
        console.log('err', err, file, fileList)
      },
  
       // 移除文件
      onFileRemove (file, fileList) {
        this.dimissionInfo.fileList.map(id => {
          id === file.response && this.dimissionInfo.fileList.splice(this.dimissionInfo.fileList.indexOf(id), 1)
        })
      }
      // getReasonList (newVal) {
      //   // 每一次变化先把离职原因列表清空
      //   this.terminationReasonList = []
      //   // 没有新值就用现有的离职原因值
      //   let a = newVal || this.dimissionInfo.terminationType
      //   req('getDistCode', {dictCode: 'TERMINATION_REASON'})
      //        .then(res => {
      //       // 如果没有选择就显示全部
      //          res.forEach((item, i) => {
      //            if (item.value.substring(0, 1) === a) {
      //              this.terminationReasonList.push(item)
      //            }
      //          })
      //        })
      // }
    }
}
</script>
<style lang="scss" scoped>
  .emp-dimission {
    .flex {
      .box1 {
       position: relative;
       .btn1 {
          position: absolute;
          left:5px;
          top:0px;
      }
    }
      display: flex;
      flex-wrap: wrap;
      & > * {
        flex-basis: 25%;
      }
    }
    .form-main {
      .el-form-item {
        width: 280px;
        // width: 100%;
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
<style lang="scss">
    .input-box {
      .el-input__inner {
        text-indent: 10px;
      }
    }
.emp-dimission{
   .input-with-select .el-input-group__append {
    padding: 0px;
   }
   .el-input-group__append {
     .el-input {
       width:80px;
       height: 26px;
     }
   }
   .el-input-group__append .el-select, .el-input-group__append .el-button, .el-input-group__prepend .el-select, .el-input-group__prepend .el-button{
     margin:0px;
   }
}
</style>




