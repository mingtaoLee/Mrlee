<template>
  <div class="cjy-guarantor">
    <i-process-flow 
      :processType="processType" 
      :model="changeResult"
      :createName="changeResult.employeeName"
      >
      <!-- @beforeApprove='beforeApprove' -->
      <div slot="base">
        <el-form :model="changeResult" label-width="150px" :rules="rules">
          <el-form-item label="被联保人" prop="employeeName" v-if="showMap.employeeName"  class="box1">
            <el-col :span="10">
              <el-input
                class="input-box"
                v-model="changeResult.employeeName"
               :placeholder="changeResult.employeeName ? changeResult.employeeName : '请选择'"
                :disabled="disabledMap.employeeName || !isFlowCenter"
                readonly>
                <i v-if="!disabledMap.employeeName" slot="suffix" class="el-icon-menu" @click="handleIconClick" ></i>
              </el-input>
               <i-show-personnelInfo :id="changeResult.empEmployeeId" class="btn1" v-show="changeResult.employeeName"></i-show-personnelInfo> 
              <i-personnel-select
                :disabled="disabledMap.employeeName"
                :isShow.sync="isShow"
                @confirm="handleConfirm"
                :modal='false'
                :multiple="false"
                filterType="surety"
                :hasGrant="false"
                />
            </el-col>
          </el-form-item>

          <el-form-item label="原联保人1" v-if="showMap.oldCosuretyName1"  class="box1">
            <i-show-personnelInfo :id="changeResult.oldCosuretyId1" class="btn1" v-if="changeResult.oldCosuretyId1"></i-show-personnelInfo>
            <p class="surty" :disabled="disabledMap.oldCosuretyName1">{{changeResult.oldCosuretyName1 ? changeResult.oldCosuretyName1 : '无'}} </p>
          </el-form-item>

          <el-form-item label="原联保人2" v-if="showMap.oldCosuretyName2" class="box1">
            <i-show-personnelInfo :id="changeResult.oldCosuretyId2" class="btn1" v-if="changeResult.oldCosuretyId2"></i-show-personnelInfo>
            <p class="surty" :disabled="disabledMap.oldCosuretyName2">{{changeResult.oldCosuretyName2 ? changeResult.oldCosuretyName2 : '无'}}</p>
          </el-form-item>
          <el-form-item label="新联保人1" prop="newCosuretyId1" v-if="showMap.newCosuretyName1" class="box1">
           <el-col :span="10">
               <i-show-personnelInfo 
                v-if="showMap.newCosuretyName1" 
                :id="changeResult.newCosuretyId1" 
                class="btn1" 
                v-show="changeResult.newCosuretyName1"
              ></i-show-personnelInfo> 
               <i-select
                  class="input-box"
                  v-model="changeResult.newCosuretyId1"
                  :options="Array.from(cosuretyList)"
                  :async="false"
                  :props="cosuretyProps"
                  :disabled="disabledMap.newCosuretyName1 || EssentialList.length>=1"
                  @option-click="handleOptionClick1"
                ></i-select>
             </el-col>
          </el-form-item>
          <el-form-item label="新联保人2" prop="newCosuretyId2" v-if="showMap.newCosuretyName2" class="box1">
           <el-col :span="10">
               <i-show-personnelInfo 
                v-if="showMap.newCosuretyName2" 
                v-show="changeResult.newCosuretyName2"
                :id="changeResult.newCosuretyId2" 
                class="btn1" 
              ></i-show-personnelInfo> 
               <i-select
                  class="input-box"
                  v-model="changeResult.newCosuretyId2"
                  :options="Array.from(cosuretyList)"
                  :async="false"
                  :props="cosuretyProps"
                  :disabled="disabledMap.newCosuretyName2 || EssentialList.length>=2"
                  @option-click="handleOptionClick2"
                ></i-select>
            </el-col>
          </el-form-item>
          <el-form-item label="生效时间" prop="startDate" v-if="showMap.startDate">
           <el-col :span="10">
            <el-date-picker
            v-model="changeResult.startDate"
            @change="change"
            :disabled="disabledMap.startDate"
             :picker-options="pickerOptions2"
            ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="变更原因" v-if="showMap.text">
          <el-col :span="10">
            <el-input
            type="textarea"
            :rows="2"
            maxlength="100"
            v-model="changeResult.text"
            :disabled="disabledMap.text"
            :placeholder="disabledMap.text && ''"
            >
            </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="已上传附件" v-if="showMap.fileList">
            <down></down>
          </el-form-item>
          <el-form-item label="附件" class="uploaderForm" v-if="showMap.fileList">
            <i-upload
              :previewMode="previewMode"
              :fileList="changeResult.fileList"
              @onRemove="onFileRemove"
              @onSuccess="onFileSuccess"
              @onError="onFileError"
             :disabled="disabledMap.fileList">
            </i-upload>
          </el-form-item>

        </el-form>
      </div>
    </i-process-flow>
  </div>
</template>

<script>
import ButtonGroup from 'components/flow/button-group'
import BasicInfo from 'components/flow/basic-info'
import ISelect from 'components/common/i-select/i-select'
import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
import ISelectTree from 'components/common/i-select-tree/i-select-tree'
import IProcessFlow from 'components/common/i-process-flow/index'
import req from 'api/employee/guarantor'
import reqPer from 'api/employee/personal'
import IUpload from 'components/common/upload/uploader'
import Down from 'components/employee/download'
import IShowPersonnelInfo from 'components/common/i-show-personnelInfo'
import moment from 'moment'

export default {
  components: {
    ButtonGroup,
    BasicInfo,
    ISelect,
    IPersonnelSelect,
    ISelectTree,
    IProcessFlow,
    IUpload,
    Down,
    IShowPersonnelInfo
  },
  data () {
    let checkCosurety1 = (rule, value, cb) => {
      // console.log(22233, rule, value)
      !value && cb(new Error('联保人不能为空'))
      value === this.changeResult.newCosuretyId2 ? cb(new Error('不能选择相同的联保人')) : cb()
    }
    let checkCosurety2 = (rule, value, cb) => {
      // console.log(22244, rule, value)
      !value && cb(new Error('联保人不能为空'))
      this.changeResult.newCosuretyId1 === value ? cb(new Error('不能选择相同的联保人')) : cb()
    }
    let checkNewCosurety = (rule, value, cb) => {
      if (!value) {
        cb(new Error('被联保人不能为空'))
      } else {
        this.getSurInfo()
        cb()
      }
    }
    return {
      cosuretyList: [],
      cosuretyProps: {
        label: 'name',
        value: 'id'
      },
      flag: false,
      disabledCheck: false,
      pickerOptions2: {
        disabledDate: (time) => {
          if (this.changeResult.beginTime) {
            return time <= this.changeResult.beginTime || time === this.changeResult.beginTime
          }
        }
      },
      // 必选联保人存放列表
      EssentialList: [],
      previewMode: false,
      ischeck: false,
         // 修改联保人提交参数
      rules: {
        employeeName: [{ required: true, validator: checkNewCosurety, trigger: 'change' }],
        newCosuretyId1: [{ required: true, validator: checkCosurety1, trigger: 'change' }],
        newCosuretyId2: [{ required: true, validator: checkCosurety2, trigger: 'change' }],
        startDate: [{ required: true, message: '生效时间不能为空', trigger: 'change' }]
      },
      changeResult: {
        empEmployeeId: '',
        employeeName: '',
        oldEmpSuretyId1: '',
        oldCosuretyId1: '',
        oldCosuretyName1: '',
        oldEmpSuretyId2: '',
        oldCosuretyId2: '',
        oldCosuretyName2: '',
        newCosuretyId1: '',
        newCosuretyName1: '',
        newCosuretyId2: '',
        newCosuretyName2: '',
        startDate: '',
        beginTime: '', // 上一次开始时间
        text: '',
        fileList: []
      },
      // 人员选择
      isShow: false,
      toolbar: [{
        text: '确定',
        type: 'primary',
        func: (done) => {
          done()
        }
      }, {
        text: '取消',
        type: 'text',
        func: (done) => {
          done()
        }
      }],
     // 保存路由带来的信息
      isFlowCenter: this.$route.query.isFlowCenter,
      empEmployeeId: this.$route.query.employeeId,
      processStatus: this.$route.query.processStatus,
      taskId: this.$route.query.taskId,
      // taskKey: this.$route.query.taskKey,
      processType: this.$route.query.processType,
      slotArr: ['empFillIn', 'signProtocol', 'systemTask', 'usrtask1']
    }
  },
  watch: {
    'disabledMap': {
      handler: function (newVal, oldVal) {
        this.cosuretyList = []
        if (!(newVal.newCosuretyName1 && newVal.newCosuretyName2)) {
          this.disabledCheck = true
          this.changeResult.employeeName && this.getSurInfo()
        } else {
          // console.log(111, this.changeResult.newCosuretyId1, this.changeResult.newCosuretyName1)
          let value1 = {'name': this.changeResult.newCosuretyName1, 'id': this.changeResult.newCosuretyId1}
          this.cosuretyList.push(value1)
          let value2 = {'name': this.changeResult.newCosuretyName2, 'id': this.changeResult.newCosuretyId2}
          this.cosuretyList.push(value2)
        }
      },
      deep: true
    },
    'changeResult.empEmployeeId': {
      handler: function (newVal, oldVal) {
        if (newVal && oldVal) {
          this.$set(this.changeResult, 'newCosuretyId1', '')
          this.$set(this.changeResult, 'newCosuretyName1', '')
          this.$set(this.changeResult, 'newCosuretyId2', '')
          this.$set(this.changeResult, 'newCosuretyName2', '')
        }
      },
      deep: true
    }
  },
  mounted () {
    !this.disabledCheck && this.getCosuretyByRoute()
  },
  computed: {
    id () {
      return this.$store.state.user.info.empEmployeeId
    }
  },
  methods: {
    // beforeApprove (done) {
    //   if (this.$route.query.taskId && (this.id === this.changeResult.newCosuretyId1 || this.id === this.changeResult.newCosuretyId2)) {
    //     this.$confirm('我已阅读联保书相关内容，并明确联保责任内容!', '提示', {
    //       confirmButtonText: '同意',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       done()
    //     }).catch(() => {})
    //   } else {
    //     done()
    //   }
    // },
    // 获取人员信息
    handleOptionClick1 (item) {
      this.$set(this.changeResult, 'newCosuretyId1', item.id)
      this.$set(this.changeResult, 'newCosuretyName1', item.name)
    },
    handleOptionClick2 (item) {
      this.$set(this.changeResult, 'newCosuretyId2', item.id)
      this.$set(this.changeResult, 'newCosuretyName2', item.name)
    },
    // 请求联保人数据
    getSurInfo () {
      if (this.disabledCheck) {
        this.EssentialList = []
        this.cosuretyList = []
        reqPer('getEmployeebaseInfo', {empEmployeeId: this.changeResult.empEmployeeId}, true, false)
        .then(res => {
          let aa = {
            empEmployeeId: res.empEmployeeId,
            employeeUnitId: res.orgUnitId
          }
          this.getEssentialCosurety(aa)
          this.getNewCosurety(aa)
        })
        .catch(err => {
          console.log(err)
        })
      }
    },
    // 获取必选联保人
    getEssentialCosurety (info) {
      req('getEssentialCosurety', info)
      .then(data => {
        data.map(item => {
          let val = {
            suretyName: item.suretyName,
            suretyEmployeeId: item.suretyEmployeeId
          }
          this.EssentialList.push(val)
          if (this.EssentialList.length === 1) {
            this.changeResult.newCosuretyId1 = this.EssentialList[0].suretyEmployeeId
            this.changeResult.newCosuretyName1 = this.EssentialList[0].suretyName
          } else {
            this.changeResult.newCosuretyId1 = this.EssentialList[0].suretyEmployeeId
            this.changeResult.newCosuretyName1 = this.EssentialList[0].suretyName
            this.changeResult.newCosuretyId2 = this.EssentialList[1].suretyEmployeeId
            this.changeResult.newCosuretyName2 = this.EssentialList[1].suretyName
          }
        })
        // console.log('EssentialList', this.EssentialList)
      })
    },
    // 获取可选联保人
    getNewCosurety (info) {
      return req('getOptionalCosurety', info)
        .then(data => {
          // console.log('data111111', data)
          data.map(item => {
            let value = {'name': item.suretyName, 'id': item.suretyEmployeeId}
            this.cosuretyList.push(value)
          })
           // 防止获取的联保人数量超过100个且必选联保人不在其中
          this.EssentialList.map(val => {
            this.cosuretyList.map(keyId => {
              if (keyId.id === val.suretyEmployeeId) {
                this.flag = true
                // console.log(111, keyId)
              }
            })
            // console.log('222222', this.cosuretyList, this.flag)
            if (!this.flag) {
              let valueEss = {'name': val.suretyName, 'id': val.suretyEmployeeId}
              this.cosuretyList.push(valueEss)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
     // 日期选择器改变时，赋值
    change (val) {
      this.changeResult.startDate = moment(val).format('YYYY-MM-DD')
    },
     // 根据路由的id获取对应联保人信息
    getCosuretyByRoute (id) {
      if (!id && !this.empEmployeeId) {
        return false
      }
      // this.changeResult.map(item => {
      //   console.log('item', item)
      // })
      req('getCosurety', {employeeId: id || this.empEmployeeId})
       .then(data => {
        //  console.log('data', data)
        //  console.log('Object.keys(data)', Object.keys(data))
         Object.keys(data).map(key => {
          //  console.log('key', key)
           if (data[key]) {
             this.changeResult[key] = data[key]
           }
         })
         this.changeResult.fileList = [] // 拼凑的字段，用于保存文件
       })
      // console.log('this.changeResult', this.changeResult)
    },

    // 被联保人人员选择器的显选中人员
    handleConfirm (selected) {
      let sel = Array.from(selected)
      this.getCosuretyByRoute(sel[0].employeeId)
    },
    // 被联保人人员选择器的显示隐藏
    handleIconClick () {
      this.isFlowCenter ? this.isShow = !this.isShow : false
    },

    // 文件成功上传
    onFileSuccess (response, file, fileList) {
      this.$message.success('文件上传成功！')
      this.changeResult.fileList.push(response)
    },

      // 文件失败上传
    onFileError (err, file, fileList) {
      console.log('err', err, file, fileList)
    },

    // 文件列表移除文件时
    onFileRemove (file, fileList) {
      this.changeResult.fileList.map(id => {
        id === file.response && this.changeResult.fileList.splice(this.changeResult.fileList.indexOf(id), 1)
      })
    }
  }
}
</script>

<style lang="scss">
  .cjy-guarantor {
    .box1 {
       position: relative;
       .btn1 {
         z-index: 1;
          position: absolute;
          left:6px;
          top:0;
       }
    }
    .input-box{
      .el-input__inner{
        text-indent: 16px;
      }
    }
    .uploaderForm {
      .uploader {
        width: 800px;
      }
    }

    .surty {
      display: inline-block;
      padding-left: 30px;
    }
  }

</style>
<style scoped>
    .el-autocomplete {
    width: 100% !important
  }
</style>
