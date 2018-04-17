<template>
  <section class="emp-basic mb0 content-follow">
    <h2 class="info-title">员工基本信息
      <span @click.stop="connect()" v-if="showMap.getBaseInfo && getBaseInfoBtn">读取信息</span>
    </h2>
    <object id="CertCtl" type="application/cert-reader" width="0" height="0">
      <!-- <p style="color:#FF0000;">控件不可用，可能未正确安装控件及驱动，或者控件未启用。</p> -->
    </object>
    <el-form
      :model="hireInfo.empEmployeeEmpContacts"
      label-width="124px"
      class="form-main clearfix"
      :rules="rules"
      ref="ruleForm">
      <div class="base">
        <el-form-item label="证件类型" prop="idType" v-if="showMap.idType">
          <i-select v-model="hireInfo.empEmployeeEmpContacts.idType"  parameter="ID_TYPE" :disabled="disabledMap.idType"></i-select>
        </el-form-item>

        <!-- <el-form
          ref="idNumberPass"
          label-width="124px"
          class="content"
          :model="hireInfo.empEmployeeEmpContacts"
          :rules="idRules">
          <el-form-item  label="证件号码" prop="idNumber" v-if="showMap.idNumber">
            <el-input v-model="hireInfo.empEmployeeEmpContacts.idNumber"  :disabled="disabledMap.idNumber"></el-input>
          </el-form-item>
        </el-form> -->

        <el-form-item
          v-if="showMap.idNumber"
          label="证件号码"
          prop="idNumber">
          <el-input v-model="hireInfo.empEmployeeEmpContacts.idNumber" @blur="getBase($event)" :disabled="disabledMap.idNumber" maxlength="30"></el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="fullName" v-if="showMap.fullName">
          <el-input v-model="hireInfo.empEmployeeEmpContacts.fullName" @blur="filterSpace" :disabled="disabledMap.fullName" ></el-input>
        </el-form-item>
       

        <el-form-item label="证件签发机构" prop="idAddress" v-if="showMap.idAddress">
          <el-input  v-model="hireInfo.empEmployeeEmpContacts.idAddress" :disabled="disabledMap.idAddress" maxlength="30"></el-input>
        </el-form-item>

        <el-form-item label="证件有效期" prop="idStartTime" v-if="showMap.idStartTime">
            <el-date-picker
              type="date"
              v-model="hireInfo.empEmployeeEmpContacts.idStartTime"
              style="width: 100%;"
              :picker-options="beginOptions"
              @change="change($event, 'idStartTime')"
              :editable="false"
              :disabled="disabledMap.idStartTime || sameStatu"
            />
        </el-form-item>

        <el-form-item label="至" prop="idEndTime" v-if="showMap.idEndTime">
            <el-date-picker
            type="date"
            v-model="hireInfo.empEmployeeEmpContacts.idEndTime"
            style="width: 100%;"
            :picker-options="endOptions"
            @change="change($event, 'idEndTime')"
            :editable="false"
            :disabled="disabledMap.idEndTime || endOptionsIsDisabled"
            />
        </el-form-item>

         <el-form-item label="户口性质" prop="domicileType" v-if="showMap.domicileType">
          <i-select
          parameter="DOMICILE_TYPE"
          v-model="hireInfo.empEmployeeEmpContacts.domicileType"
          :disabled="disabledMap.domicileType"></i-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="mobile" v-if="showMap.mobile">
          <el-input v-model="hireInfo.empEmployeeEmpContacts.mobile" :disabled="disabledMap.mobile" ></el-input>
        </el-form-item>

        <el-form-item
        label="邮箱"
        prop="email"
        v-if="showMap.email"
        class="box">
          <el-input v-model="hireInfo.empEmployeeEmpContacts.email" :disabled="disabledMap.email" :placeholder="disabledMap.email && ''"></el-input>
           <!-- 添加下拉列表，只有当改变的时候才显示 -->
          <el-card class="box-card" v-if="isShowEmailList" >
              <div v-for="(item,id) in showList" :key="id" @click="chooseName(item)" >
                <p class="text txt">{{item}}</p>
              </div>
          </el-card> 
        </el-form-item>
        

        <el-form-item label="性别" prop="gender" v-if="showMap.gender">
          <el-radio-group v-model="hireInfo.empEmployeeEmpContacts.gender" :disabled="disabledMap.gender || hireInfo.empEmployeeEmpContacts.idType==='1'">
            <el-radio label="M">男</el-radio>
            <el-radio label="F">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="出生日期" prop="birthDate" v-if="showMap.birthDate">
          <el-date-picker
            type="date"
            v-model="hireInfo.empEmployeeEmpContacts.birthDate"
            style="width: 100%;"
            :picker-options="timeOptions"
            @change="change($event, 'birthDate')"
            :disabled="disabledMap.birthDate || hireInfo.empEmployeeEmpContacts.idType==='1' || sameStatu"
            :editable="false"
            />
        </el-form-item>

        <el-form-item label="婚姻状况" prop="maritalStatus" v-if="showMap.maritalStatus">
          <i-select v-model="hireInfo.empEmployeeEmpContacts.maritalStatus" parameter="MARITAL_STATUS" :disabled="disabledMap.maritalStatus">
          </i-select>
        </el-form-item>

        <el-form-item label=" 国籍/地区" prop="areaCitizenship" v-if="showMap.areaCitizenship">
          <i-select filterable v-model="hireInfo.empEmployeeEmpContacts.areaCitizenship" parameter="COUNTRY" :disabled="disabledMap.areaCitizenship"></i-select>
          <!-- <i-select :id="hireInfo.empEmployeeEmpContacts.areaCitizenship" @change="change"></i-select> -->
          <!-- <i-select-area search @change="change"></i-select-area> -->
        </el-form-item>

        <el-form-item label="籍贯" prop="domicilePlace" v-if="showMap.domicilePlace">
          <el-input v-model="hireInfo.empEmployeeEmpContacts.domicilePlace" :disabled="disabledMap.domicilePlace" ></el-input>
            <!-- <i-select :id="hireInfo.empEmployeeEmpContacts.domicilePlace" @change="changeDomicilePlace"></i-select> -->
            <!-- <i-select-area search @change="changeDomicilePlace"  :id="hireInfo.empEmployeeEmpContacts.domicilePlace"></i-select-area> -->
        </el-form-item>

        <el-form-item label="民族" prop="nation" v-if="showMap.nation">
          <i-select filterable v-model="hireInfo.empEmployeeEmpContacts.nation" parameter="NATION" :disabled="disabledMap.nation">
          </i-select>
        </el-form-item>

        <el-form-item label="政治面貌" prop="politicsStatus" v-if="showMap.politicsStatus">
          <i-select
          v-model="hireInfo.empEmployeeEmpContacts.politicsStatus"
          parameter="POLITICS_STATUS"
          :disabled="disabledMap.politicsStatus"></i-select>
        </el-form-item>

        <el-form 
        :model="hireInfo.empPosition" 
        :rules="position" 
        label-width="124px" 
        class="form-main clearfix content"
        v-if="showMap.beginWorkDate">
          <el-form-item label="参加工作时间" prop="beginWorkDate" v-if="$route.query.processType === '0'">
            <el-date-picker
              type="date"
              v-model="hireInfo.empPosition.beginWorkDate"
              style="width: 100%;"
              :editable="false"
              :picker-options="birthOptions"
              @change="getSTime"
              :disabled="disabledMap.beginWorkDate">
            </el-date-picker>
          </el-form-item>
        <el-form-item label="参加工作时间" prop="beginWorkDate" v-else>
          <el-date-picker
            type="date"
            v-model="hireInfo.empPosition.beginWorkDate"
            style="width: 100%;"
            @change="getSTime"
            :editable="false"
            :picker-options="birthOptions"
            :disabled="disabledMap.beginWorkDate">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <el-row v-if="showMap.idRegisteredAddress">
      <el-col :span="14">
        <el-form-item label="证件地址" prop="idRegisteredAddress" class="wider">
          <el-input v-model="hireInfo.empEmployeeEmpContacts.idRegisteredAddress" :disabled="disabledMap.idRegisteredAddress" ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="showMap.homeAddress">
      <el-col :span="14">
        <el-form-item label="现居地址" prop="homeAddress" class="wider">
          <el-input v-model="hireInfo.empEmployeeEmpContacts.homeAddress" :disabled="disabledMap.homeAddress" ></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row v-if="showMap.hasInsurance && $route.query.processType!=='0'">
      <el-col :span="14">
        <el-form-item label="五险（养老、医疗、工伤、生育、失业）是否需参保" prop="hasInsurance" class="wider-label-insurance">
          <el-radio-group
          v-model="hireInfo.empEmployeeEmpContacts.hasInsurance"
          @change="controlInsuranceChange"
          :disabled="disabledMap.hasInsurance || tip">
            <el-radio label="Y">是</el-radio>
            <el-radio label="N">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="10" v-if="showMap.hasInsurance && hireInfo.isShowHouseFund">
        <el-form-item label="住房公积金是否需参保" prop="hasHouseFund" class="wider-label-fund">
          <el-radio-group v-model="hireInfo.empEmployeeEmpContacts.hasHouseFund" :disabled="disabledMap.hasInsurance || tip">
            <el-radio label="Y">是</el-radio>
            <el-radio label="N">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <div v-if="showMap.fileList">
      <el-form-item label="附件（可以上传入职登记表，人才决议表，银行卡复印件等）" class="emp-basic-uploaderForm" >
        <i-upload
          :previewMode="disabledMap.fileList"
          :fileList="hireInfo.fileList"
          @onRemove="onFileRemove"
          @onSuccess="onFileSuccess"
          @onError="onFileError">
        </i-upload>
      </el-form-item>
    </div>

    <el-upload
      class="avatar-uploader"
      :action="`${$$.BASE_URL}/system/attachments/image`"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      ref="deletePhoto"
      v-if="showMap.photoPath"
      :disabled="disabledMap.photoPath">
      <img v-if="hireInfo.empEmployeeEmpContacts.photoPath" :src="`${$$.BASE_URL}/system/attachments/image/${hireInfo.empEmployeeEmpContacts.photoPath}`" class="avatar">
      <i v-if="hireInfo.empEmployeeEmpContacts.photoPath" v-show="!disabledMap.photoPath"  @click.stop="deletePhoto" class="el-icon-close" > </i>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    </el-form>
    <!-- 工号 -->
    <div class="cardId" v-if="employeeCode">
      工号: <label type="text" >{{employeeCode}}</label>
    </div>
  </section>
</template>
<script>
  import req from 'api/employee/personal'
  import ISelect from 'components/common/i-select/i-select'
  import moment from 'moment'
  import IUpload from 'components/common/upload/uploader'
  import ISelectArea from 'components/common/i-select-area'
  // import flow from 'mixins/flow'

export default {
    props: {
      hireInfo: Object
    },
  
    components: {
      ISelect,
      IUpload,
      ISelectArea
    },
    // mixins: [flow],
    data () {
      /* eslint-disable */
      let that = this
      let checkEmail = (rule, value, cb) => {
        let myreg =/^[a-zA-Z0-9_-]+[\.]*[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        
         let wordTest =/^[^\s]+$/
        value && setTimeout(function() {
          !wordTest.test(value) && cb(new Error("首尾不能含空格"))
          !myreg.test(value) && cb(new Error("请输入正确的邮箱格式"))
          cb()
        }, 100);
        !value && cb()
      }

      let checkIdNumber = (rule, value, cb) => {
        let city = {
          11: "北京",
          12: "天津",
          13: "河北",
          14: "山西",
          15: "内蒙古",
          21: "辽宁",
          22: "吉林",
          23: "黑龙江 ",
          31: "上海",
          32: "江苏",
          33: "浙江",
          34: "安徽",
          35: "福建",
          36: "江西",
          37: "山东",
          41: "河南",
          42: "湖北 ",
          43: "湖南",
          44: "广东",
          45: "广西",
          46: "海南",
          50: "重庆",
          51: "四川",
          52: "贵州",
          53: "云南",
          54: "西藏 ",
          61: "陕西",
          62: "甘肃",
          63: "青海",
          64: "宁夏",
          65: "新疆",
          71: "台湾",
          81: "香港",
          82: "澳门",
          91: "国外 "
        }

        let temp = value.replace(/\s+/g,'')
        // console.log(value)
        !temp && !this.$route.query.idNumber && cb(new Error('证件号码不能为空'))
        let processType = that.$route.query.processType
        let pass = true
        let isId = this.hireInfo.empEmployeeEmpContacts.idType === '1'
        if (temp) {
          if (!value || !/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value) && isId) {
            pass = false
            cb(new Error("证件号码格式错误"))
          } else if (!city[value.substr(0, 2)] && isId) {
            pass = false
            cb(new Error("地址编码错误"))
          } else if (value.length == 18 && isId) {
            const idNumber = value
            value = value.split('')
            let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
            let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
            let sum = 0
            let ai = 0
            let wi = 0
            for (let i = 0; i < 17; i++) {
              ai = value[i]
              wi = factor[i]
              sum += ai * wi
            }
            let last = parity[sum % 11]
            if (parity[sum % 11] != value[17]) {
              pass = false
              // console.log(value, parity[sum % 11], value[17])
              value[17] === 'x' ? cb(new Error("校验位x必须要大写")) : cb(new Error("校验位错误"))
            }
          }
          pass && !this.disabledMap.idNumber && req('getEmpInfoByCard', {idNumber: temp}, true, false).then(res => {
            if (res) {
              // processType === '0' && cb(new Error('该员工已存在，请勿重复登记'))
              if (res.inBlackList) {
                cb(new Error('该员工在黑名单中，不能入职'))
              } else {
                isId && this.getInfoBase()
                // this.$emit('fillBase', res)
                this.count++
                cb()
                return
              }
            } else {
              isId && this.getInfoBase()
              // this.$emit('fillBase', res)
               cb()
               return
            }
          }).catch(err => {
            console.log(err)
            err && cb(new Error('该员工为在职员工！'))
            return
          })
          // console.log(this.disabledMap.idNumber)
         pass && this.disabledMap.idNumber && cb()
        }
      }
      let checkPhone = (rule, value, cb) => {
        let phoneTest = /^1[34578]\d{9}$/;
        !value && cb(new Error('电话号码不能为空'))
        let arr = []
        this.hireInfo.familyData && this.hireInfo.familyData.map(key => {
          arr.push(key.primaryPhone)
        })

        arr.filter(mo => { return mo === value }).length && cb(new Error('电话号码不能和联系人号码一致'))

        setTimeout(function() {
          !phoneTest.test(value) ? cb(new Error("请输入正确的电话号码格式")) : cb();
        }, 0);
      };
      let checkContact = (rule, value, cb) => {
        let phoneTest = /^1[34578]\d{9}$/;
        !value && cb(new Error('联系方式不能为空'))
        setTimeout(function() {
          !phoneTest.test(value) ? cb(new Error("请输入正确的电话号码格式")) : cb();
        }, 0);
      };
      let ContactPhone = (rule, value, cb) => {
        let phoneTest = /^1[34578]\d{9}$/;
        !value && cb()
        setTimeout(function() {
          !phoneTest.test(value) ? cb(new Error("请输入正确的电话号码格式")) : cb();
        }, 0);
      }
      let validateAddress = (rule, value, cb) => {
        !value && cb(new Error("地址不能为空"))
        value.length > 50 && cb(new Error('地址长度不能超过50个字符'))
         let wordTest = /^[^\s]+$/
         !wordTest.test(value) ? cb(new Error("首尾不能含空格")) : cb();
      }
      let checkName = (rule, value, cb) => {
        // let name =  /^[\u4E00-\u9FA5]+$/
        // let name_en =  /^[A-Za-z]+((·| )[A-Za-z]+)*$/
        // !value && cb(new Error("姓名不能为空"))
        // setTimeout(() => {
        //   let isEn = false
        //   name.test(value) && (isEn = 1)
        //   name_en.test(value) && (isEn = 2)

        //   !isEn && cb(new Error('姓名格式错误'))
        //   isEn === 1 && value.length > 20 ? cb(new Error('中文名不得超过20字')) : cb()
        //   isEn === 2 && value.length > 160 ? cb(new Error('英文名不得超过160字')) : cb()
        // }, 0) 
        !value && cb(new Error('姓名不能为空'))
        value.length > 30 && cb(new Error('姓名长度不能超过30个字符'))

        let wordTest = /^[^\s]+$/
        !wordTest.test(value) ? cb(new Error('名字首尾不能含空格')) : cb()

      }
      let checkDomicilePlace = (rule, value, cb) => {
        !value && cb(new Error("籍贯不能为空"))
        value.length > 50 && cb(new Error('籍贯长度不能超过50个字符'))
        let wordTest =/^[^\s]+$/
         !wordTest.test(value) ? cb(new Error("首尾不能含空格")) : cb();

      }
      let checkWord = (rule, value, cb) => {
        !value && cb(new Error("证件签发机构不能为空"))
        value.length > 50 && cb(new Error('证件签发机构长度不能超过50个字符'))
        let wordTest = /^[^\s]+$/
         !wordTest.test(value) ? cb(new Error("首尾不能含空格")) : cb();
      }
      let checkDate = (rule, value, cb) => {
        !value && cb(new Error('请选择日期'))
        let birth = new Date(this.hireInfo.empEmployeeEmpContacts.birthDate || 0)
        new Date(value).getTime() < birth.getTime() && cb(new Error('不得早于出生日期'))
        cb()
      }
      let checkBirthDate = (rule, value, cb) => {
        !value && cb(new Error('请选择日期'))
        let birth = new Date(value).getTime()
        new Date(new Date().setFullYear(new Date().getFullYear() - 16)).getTime() <= birth && cb(new Error('抱歉，您未满16岁不能入职'))
        if (!this.hireInfo.empEmployeeEmpContacts.employeeStatus) {
            this.hireInfo.empEmployeeEmpContacts.gender === 'F' && new Date(new Date().setFullYear(new Date().getFullYear() - 50)).getTime() >= birth && cb(new Error ('抱歉，您已达到退休年龄无法入职'))
            this.hireInfo.empEmployeeEmpContacts.gender === 'M' && new Date(new Date().setFullYear(new Date().getFullYear() - 60)).getTime() >= birth && cb(new Error ('抱歉，您已达到退休年龄无法入职'))
        }
        cb()
      }
      return {
        // 是否显示读取身份证按钮
        getBaseInfoBtn: false,
        // 日期选择器赋值bug
        sameStatu: true,
        // 控件bug标识符
        signCount: 0,
        // employeeCode: '',
        count: 0,
        tip: false,
        type: '',
        previewMode: false,
        processType: this.$route.query.processType,
        timeOptions: {
          // 禁止使用比今天还要后的时间
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          },
        },

        birthOptions: {
          disabledDate: (time) => {
            let birth = this.hireInfo.empEmployeeEmpContacts.birthDate || 0
            return time.getTime() < new Date(birth).getTime() || time.getTime() > new Date().getTime()
          }
        },
           // 邮箱列表是否显示
        isShowEmailList: false,
        // 选择的邮箱后缀
        lastName: true,
        // 显示的列表
        showList: [],
        startTim: false,
        a: '',
        // 邮箱列表后缀
        emailsorce: ["@sina.com", "@163.com", "@qq.com", "@126.com", "@vip.sina.com","@sina.cn", "@hotmail.com", "@gmail.com", "@sohu.com", "@yahoo.cn", "@139.com","@wo.com.cn", "@189.cn"],
        // 新增标识符-->输入证件有效期之后才能选址证件失效期
        // endOptionsIsDisabled: true,
        endOptions: {
          disabledDate: (time) => {
            let begin = this.hireInfo.empEmployeeEmpContacts.idStartTime || 0
            let birth = this.hireInfo.empEmployeeEmpContacts.birthDate || 0
            return time.getTime() < new Date(begin).getTime() || time.getTime() < new Date(birth).getTime() || time.getTime() < new Date().getTime()
          }
        },
        beginOptions: {
          disabledDate: (time) => {
            let end = this.hireInfo.empEmployeeEmpContacts.idEndTime || 0
            let birth = this.hireInfo.empEmployeeEmpContacts.birthDate || 0

            if (end) return time.getTime() > new Date(end).getTime() || time.getTime() < new Date(birth).getTime() || time.getTime() > new Date().getTime()
            return time.getTime() < new Date(birth).getTime() || time.getTime() > new Date().getTime()
          }
        },
        idRules: {
          idNumber: [
            { required: true, validator: checkIdNumber, trigger: "blur" }
          ]
        },
        position: {
          beginWorkDate: [
            { required: true, validator: checkDate, trigger: "change" }
          ]
        },
        rules: {
          idNumber: [{ required: true, validator: checkIdNumber, trigger: "blur" }],
          idType: [{ required: true, message: "证件类型不能为空", trigger: "change" }],
          fullName: [{ required: true, validator: checkName, trigger: "blur" }],
          mobile: [{ required: true, validator: checkPhone, trigger: "blur" }],
          email: [{ validator: checkEmail, trigger: "change" }],
          gender: [{ required: true, message: "性别不能为空", trigger: "change" }],
          birthDate: [{ required: true, validator: checkBirthDate, trigger: "change" }],
          maritalStatus: [{ required: true, message: "婚姻状况不能为空", trigger: "change" }],
          areaCitizenship: [{ required: true, message: " 国籍/地区不能为空", trigger: "change" }],
          domicilePlace: [{ required: true, validator: checkDomicilePlace, trigger: "change" }],
          nation: [{ required: true, message: "民族不能为空", trigger: "change" }],
          politicsStatus: [{ required: true, message: "政治面貌不能为空", trigger: "change" }],
          idRegisteredAddress: [{ required: true, validator: validateAddress, trigger: "blur" }],
          homeAddress: [{ required: true, validator: validateAddress, trigger: "blur" }],
          hasInsurance: [{ required: true, message: "该字段不能为空", trigger: "change" }],
          hasHouseFund: [{ required: true, message: "该字段不能为空", trigger: "change" }],
          idStartTime: [{ required: true, validator: checkDate, trigger: "change" }],
          idEndTime: [{ required: true, validator: checkDate, trigger: "change" }],
          idAddress: [{ required: true, validator: checkWord, trigger: "blur" }],
          domicileType: [{ required: true, message: "户口性质不能为空", trigger: "change" }]
        }
      };
    },
    methods: {
      // 连接身份证读卡器
      connect () {
        let userAgent = navigator.userAgent
        let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (!isIE11) {
          this.$alert('如需使用读取信息功能，请您安装"IE11"浏览器打开该流程！！！ (￣▽￣)~*', '温馨提示', {
            confirmButtonText: '确定'
          })
          return
        }
        let CertCtl = document.getElementById("CertCtl")
        if (!CertCtl.connect) {
          this.$alert('请确认您的读卡器控件是否安装成功 (╥╯^╰╥),安装成功请您重启浏览器', '温馨提示', {
            confirmButtonText: '确定'
          })
          return
        }
        try 
          {
            this.clearData()
            let result = JSON.parse(CertCtl.connect())
            if (result.resultFlag === 0) {
              this.readIdCard(CertCtl)
            } else {
              this.$message.error(`请确保您的读卡器USB连接通畅`)
            }
          }
        catch (e) 
          {
            this.$message.error('请您重新连接读卡器')
          }
      },
      // 读取身份证信息后转化时间格式
      handlerTime (data) {
        return `${data.substring(0, 4)}-${data.substring(4, 6)}-${data.substring(6)}`
      },
      // 读取身份证信息
      readIdCard (domObj) {
        try
          {
            let str = CertCtl.readCert()
            let result2 = eval('('+str+')')
            if (result2.resultFlag === 0) {
              this.hireInfo.empEmployeeEmpContacts.idNumber = result2.resultContent.certNumber
              this.hireInfo.empEmployeeEmpContacts.fullName = result2.resultContent.partyName
              this.hireInfo.empEmployeeEmpContacts.idAddress = result2.resultContent.certOrg
              this.hireInfo.empEmployeeEmpContacts.idStartTime = new Date(this.handlerTime(result2.resultContent.effDate)).getTime()
              this.hireInfo.empEmployeeEmpContacts.idEndTime = new Date(this.handlerTime(result2.resultContent.expDate)).getTime()
              this.hireInfo.empEmployeeEmpContacts.gender = result2.resultContent.gender === 1 ? 'M' : 'F' 
              this.hireInfo.empEmployeeEmpContacts.birthDate = new Date(this.handlerTime(result2.resultContent.bornDay)).getTime()
              this.hireInfo.empEmployeeEmpContacts.nation = result2.resultContent.nation
              this.hireInfo.empEmployeeEmpContacts.idRegisteredAddress = result2.resultContent.certAddress
              this.$message.success('信息读取成功')
            }
            else {
              this.$message.error(`请您将身份证放入`)
            }
          }
        catch (e)
          {
            this.$message.error('读卡失败，请重新读卡')
          }
      },
      // 再次读卡清空数据
      clearData () {
        this.hireInfo.empEmployeeEmpContacts.idNumber = ''
        this.hireInfo.empEmployeeEmpContacts.fullName = ''
        this.hireInfo.empEmployeeEmpContacts.idAddress = ''
        this.hireInfo.empEmployeeEmpContacts.idStartTime = ''
        this.hireInfo.empEmployeeEmpContacts.idEndTime = ''
        this.hireInfo.empEmployeeEmpContacts.gender = ''
        this.hireInfo.empEmployeeEmpContacts.birthDate = ''
        this.hireInfo.empEmployeeEmpContacts.nation = ''
      },
      filterSpace ($event) {
        this.hireInfo.empEmployeeEmpContacts.fullName = $event.target.value.replace(/^\s*/g,'')
      },
       // 删除照片
      deletePhoto () {
        this.hireInfo.empEmployeeEmpContacts.photoPath = ''
      },

       // 日期选择器的赋值
      change ($event, prop) {
        $event ? this.hireInfo.empEmployeeEmpContacts[prop] = moment(new Date($event)).format('YYYY-MM-DD') : this.hireInfo.empEmployeeEmpContacts[prop] = ''
        this.handlerIdStartTime($event, prop)
        // prop === 'beginWorkDate' && (this.hireInfo.empEmployeeEmpContacts.beginWorkDate = $event)
      },
      // 输入证件有效期之后才能选址证件失效期
      handlerIdStartTime (data, prop) {
        let obj = {
          shortcuts: [{
            text: '五年后',
            onClick(picker) {
              picker.$emit('pick', moment(data).add(5, 'years'))
            }
          }, {
            text: '十年后',
            onClick(picker) {
              picker.$emit('pick', moment(data).add(10, 'years'));
            }
          }, {
            text: '二十年后',
            onClick(picker) {
              picker.$emit('pick', moment(data).add(20, 'years'))
            }
          }, {
            text: '永久',
            onClick(picker) {
              picker.$emit('pick', moment('9999-12-31'))
            }
          }]
        }
        if (prop === 'idStartTime' && data) {
          this.$set(this.endOptions, 'shortcuts', obj.shortcuts)
          // this.endOptionsIsDisabled = false
        }
        if (prop === 'idStartTime' && !data) {
          // this.endOptionsIsDisabled = true
          this.endOptions.shortcuts = null
        }
      },
       // 参加工作时间日期选择器赋值
      getSTime (time) {
        this.hireInfo.empPosition.beginWorkDate = time
        this.hireInfo.empEmployeeEmpContacts.beginWorkDate = time
      },

      getInfoBase () {
        let sex = parseInt(this.hireInfo.empEmployeeEmpContacts.idNumber.substr(16, 1)) % 2 === 0 ? 'F' : 'M'
        let date = this.hireInfo.empEmployeeEmpContacts.idNumber.substr(6, 8)

        this.hireInfo.empEmployeeEmpContacts.gender = sex
        this.hireInfo.empEmployeeEmpContacts.birthDate = moment(date).format("YYYY-MM-DD")
        this.$refs.ruleForm.validateField('birthDate', res => {console.log(res)})

        let now = new Date()
        let birth = new Date(this.hireInfo.empEmployeeEmpContacts.birthDate).getTime()
        sex === 'F' && new Date(now.setFullYear(now.getFullYear() - 50)).getTime() >= birth && (this.tip = true)
        sex === 'M' && new Date(now.setFullYear(now.getFullYear() - 60)).getTime() >= birth && (this.tip = true)
      },
       // 超过法定年龄默认为否
      isOld () {
        let now = new Date()
        let birth = new Date(this.hireInfo.empEmployeeEmpContacts.birthDate).getTime()
        let sex = this.hireInfo.empEmployeeEmpContacts.gender
        ;(sex === 'F' && new Date(now.setFullYear(now.getFullYear() - 50)).getTime() >= birth) ? this.tip = true : this.tip = false
        if (!this.tip) {
          ;(sex === 'M' && new Date(now.setFullYear(now.getFullYear() - 60)).getTime() >= birth) ? this.tip = true : this.tip = false
        }
        this.tip ? this.hireInfo.empEmployeeEmpContacts.hasHouseFund = 'N' : ''
        this.tip ? this.hireInfo.empEmployeeEmpContacts.hasInsurance = 'N' : ''
        this.hireInfo.tip = this.tip
      },
       // 获取基本信息
      // getBase () {
      //   req('getEmpInfoByCard', { idNumber: this.hireInfo.empEmployeeEmpContacts.idNumber }).then(res => {
      //     !res ? setTimeOut(() => { !this.tip && this.$message.success('该员工未曾就职，可以入职') }, 50)
      //     : (this.hireInfo.inBlackList ? this.$message.warning('该员工在公司黑名单中') : Object.assign(this.hireInfo, res))
      //   })
      // },

       // 出生日期赋值
      formatBirth(time) {
        this.hireInfo.empEmployeeEmpContacts.birthDate = time
      },

       // 上传头像成功
      handleAvatarSuccess(res, file) {
        this.$message.success('图片上传成功！')
        this.hireInfo.empEmployeeEmpContacts.photoPath = file.response
      },

       // 头像上传前校验
      beforeAvatarUpload(file) {
        const isJPG = file.type === "image/jpeg";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error("上传头像图片只能是 JPG 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 2MB!");
        }
        return isJPG && isLt2M;
      },

       // 文件成功上传
      onFileSuccess (response, file, fileList) {
        this.$message.success('文件上传成功！')
        this.hireInfo.fileList.push(response)
      },

       // 文件失败上传
      onFileError (err, file, fileList) {
        console.log('err', err, file, fileList)
      },

       // 文件列表移除文件时
      onFileRemove (file, fileList) {
        // console.log(file.response)
        this.hireInfo.fileList.map(id => {
          id === file.response && this.hireInfo.fileList.splice(this.hireInfo.fileList.indexOf(id), 1)
        })
      },
      
       // 控制联保人改变
      controlInsuranceChange(v){
         //如果五险选择否，则下面所有险都选择否，则禁用
         return  this.$emit('noneInsurance',v==='N')
      },

       //选择邮箱后缀，拼接
      chooseName (name) {
        if(name){
          let cc = name.split('@')
          if (this.hireInfo.empEmployeeEmpContacts.email.indexOf('@') !== -1) {
          // 如果有@把后面的内容代替为选择的
            this.hireInfo.empEmployeeEmpContacts.email = this.hireInfo.empEmployeeEmpContacts.email.substring(0, this.hireInfo.empEmployeeEmpContacts.email.indexOf('@'))
            // console.log( this.hireInfo.empEmployeeEmpContacts.email)
            this.hireInfo.empEmployeeEmpContacts.email += '@'+cc[1]
        } else {
          this.hireInfo.empEmployeeEmpContacts.email += '@'+cc[1]
        }
        // console.log(this.hireInfo.empEmployeeEmpContacts.email)
        this.isShowEmailList = false
        this.showList = []
        this.lastName = false 
        }else{
          this.isShowEmailList = false
        }

      },

      // 籍贯
      changeDomicilePlace (val) {
        this.hireInfo.empEmployeeEmpContacts.domicilePlace = val
      },
      getBase ($event) {
        let idNumber = $event.target.value
        idNumber && req('getEmpInfoByCard', { idNumber }, true, false).then(res => {
            this.$emit('fillBase', res)
        })
      }
    },
    computed: {
      employeeCode () {
        return this.hireInfo.employeeCode
      },
      endOptionsIsDisabled () {
        let statu = true
        if (this.hireInfo.empEmployeeEmpContacts.idStartTime && this.hireInfo.empEmployeeEmpContacts.idStartTime !== '') {
          statu = false
        } else {
          statu = true
        }
        return statu
      }
    },
    watch: {
       // 邮箱后缀自动显示
      'hireInfo.empEmployeeEmpContacts.email': {
        handler: function (newVal, oldVal) {
          // console.log(111,newVal,oldVal)
          if (newVal !== oldVal && this.lastName && this.startTim) {
            // console.log(newVal)
            // 选择符合条件的显示
            // 有@匹配符合的
            if (newVal.indexOf('@') != -1) {
              // 截取@后面的内容和邮箱列表的进行对比
                this.a = newVal.slice(newVal.indexOf('@'))
                // console.log(a)
                this.showList = []
                this.emailsorce.forEach(item => {
                  if (item.includes(this.a)) {
                    let b = newVal.split('@')
                    this.$set(this.showList, this.showList.length, b[0]+item)
                  }
                })
            } else {
              // 没有@显示全部
              this.showList = []
              this.emailsorce.forEach(item=>{
                this.$set(this.showList, this.showList.length, newVal+item)
              })
              // this.showList = this.emailsorce
            }
            // 如果输完了就隐藏列表或者没有匹配的也隐藏
            if (this.a.includes('.com') || this.showList.length === 0 || newVal.length === 0) {
                  this.isShowEmailList = false
             } else {
                  this.isShowEmailList = true
             }
            // this.isShowEmailList = true
          } else {
            this.isShowEmailList = false
            this.lastName = true
            this.startTim = true
          }
        }
      },
      'hireInfo.empEmployeeEmpContacts.gender': {
        handler: function (newVal, oldVal) {
          // console.log(newVal)
          newVal ? this.isOld() : ''
        },
        deep: true
      },
      'hireInfo.empEmployeeEmpContacts.birthDate': {
        handler: function (newVal, oldVal) {
          newVal ? this.isOld() : ''
            let birth = new Date(newVal).getTime()
          new Date(new Date().setFullYear(new Date().getFullYear() - 16)).getTime() >= birth && new Date(new Date().setFullYear(new Date().getFullYear() - 18)).getTime() <= birth && this.$message({type: 'warning',message: '该人员满16岁不满18周岁，请谨慎用工！'})
        },
        deep: true
      },
      'hireInfo.empEmployeeEmpContacts.idType': {
        handler: function (newVal, oldVal) {
          newVal === '1' ? (this.getBaseInfoBtn = true):(this.getBaseInfoBtn = false)
          if (newVal === '1' && this.hireInfo.empEmployeeEmpContacts.idNumber) {
            
             this.$refs.ruleForm.validateField('idNumber', (err) => {
               if (!err) {
                     let sex = parseInt(this.hireInfo.empEmployeeEmpContacts.idNumber.substr(16, 1)) % 2 === 0 ? 'F' : 'M'
                     let date = this.hireInfo.empEmployeeEmpContacts.idNumber.substr(6, 8)
                    this.hireInfo.empEmployeeEmpContacts.gender = sex
                    this.hireInfo.empEmployeeEmpContacts.birthDate = moment(date).format("YYYY-MM-DD")
               }
             })
          } else if (newVal !== '1' && this.hireInfo.empEmployeeEmpContacts.idNumber) {
             this.$refs.ruleForm.validateField('idNumber')
          }
          newVal !== '1' && (this.tip = false)
        },
        deep: true
      }
    },
    created () {
      // if(!!this.hireInfo.employeeCode){
      //   this.employeeCode = this.hireInfo.employeeCode
      // }
      if (!this.hireInfo.fileList) {
        this.hireInfo.fileList = []
      }
      if (this.hireInfo.empEmployeeEmpContacts.birthDate) {
        this.hireInfo.empEmployeeEmpContacts.birthDate = moment(this.hireInfo.empEmployeeEmpContacts.birthDate).format('YYYY-MM-DD')
      }
      if (this.hireInfo.empPosition.beginWorkDate) {
        this.hireInfo.empPosition.beginWorkDate = moment(this.hireInfo.empPosition.beginWorkDate).format('YYYY-MM-DD')
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.sameStatu = false
      })
    }
  };
</script>
<style lang="scss" scoped>
  .mb0 {
    margin-bottom: 0;
  }
  .uploaderForm {
    display: flex;
    flex-direction: column;
    label {
      width: 500px !important;
    }
  }
  .base {
    display: flex;
    flex-wrap: wrap;
    width: 75%;
    .content > * {
      width: 100%;
    }
    & > * {
      flex-basis: 33%;
    }
  }
  .emp-basic {
    position: relative;
    .info-title {
      span {
        margin-left: 15px;
        font-size: 14px;
        color: #606266;
        font-weight: 500;
        text-decoration: underline;
        cursor: pointer;
        &:hover {
          color: blue;
        }
      }
    }
     /*上传头像位置设置*/
    .avatar-uploader {
      position: absolute;
      top: 40px;
      right: 0;
      font-size: 0;
      &:hover {
        font-size: 16px
      }
    }
    .cardId{
       position: absolute;
      top: 300px;
      right: 24px;
      font-size: 18px;
    }
    .my-avatar {
      width: 168px;
      height: 235px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .box {
      position: relative;
      &:hover {
        .box-card {
          display: block;
        }
      }
    }
    .box-card {
      display:none;
      position: absolute;
      top: 37px;
      width: 100%;
      z-index: 999;
      max-height: 274px;
      overflow: scroll;
      div {
        width: 100%;
        cursor: pointer;
        &:hover {
          background-color: #e4e8f1
        }
      }
      .text {
       font-size: 14px;
      }
      .txt {
        width:80%;
        height: 30px;
        line-height: 30px;
        margin: 0px,20px,20px;
        padding-left: 20px;
      }
    }
  }
</style>

<style lang="scss">
.emp-basic {
  .wider-label-insurance .el-form-item__label {
    width: 354px !important;
  }
  .wider-label-insurance .el-form-item__content {
    margin-left: 354px !important;
  }
  .emp-basic-uploaderForm {
    display: flex;
    flex-direction: column;
    .el-form-item__label {
      width: 500px !important;
      text-align: left;
      margin-left: 65px;
    }
  }
  .wider-label-fund .el-form-item__label {
    width: 162px !important;
  }

  .wider-label-fund .el-form-item__content {
    margin-left: 162px !important;
  }
    /*头像样式设置*/
  .avatar-uploader .el-upload {
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: block;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 168px;
    height: 235px;
    line-height: 235px;
    text-align: center;
  }

  .avatar {
    width: 168px;
    height: 235px;
    display: block;
  }

  // .el-icon-close {
  //   position: absolute;
  //   top: 10px;
  //   right: 10px;
  //   /* z-index:888 */
  // }
}
  .emp-basic .el-col-6 .el-form-item
  ,.add .el-form-item {
    width: 100% !important;
  }
  .emp-basic {
    .el-card__body {
      padding: 0px
    }
  }
</style>

