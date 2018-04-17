<template>
  <i-dialog
    title="合规检查"
    v-model='ShowMeComplicedFalg'
    size='standard'
    :toolbar="toolbar"
    :appendToBody="false"
    :destroyedWhenClose="true"
    @close="handleClose">
    <div class='content'>
       <el-form class='dialogFormCompliced'
        :model='dialogFormCompliced'
        :rules='rules'
        ref='dialogFormCompliced'
        :inline='true'
        style='width: 100%'
        label-width="100px">
        <el-row type="flex" justify="space-around">
          <el-col :span="12">
            <el-form-item label='应试人姓名'>
              <span>{{dialogFormCompliced.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label='应试人手机'>
            <span>{{dialogFormCompliced.mobile}}</span>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="12">
            <el-form-item label="应试人邮箱">
              <span>{{dialogFormCompliced.email}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label='应聘部门'>
            <span>{{dialogFormCompliced.applyOrgName}}</span>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="12">
            <el-form-item label="面试安排人">
              <span>{{dialogFormCompliced.arrangerName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label='合规检查结果' prop='qualifyStatus' required>
              <i-select
                v-model='dialogFormCompliced.qualifyStatus'
                parameter='QUALIFY_STATUS'
                placeholder='请选择'>
              </i-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-around">
           <el-col :span="12">
           <el-form-item label="证件类型" prop="idType" required>
            <i-select
             v-model="dialogFormCompliced.idType"
             parameter="ID_TYPE"
             placeholder='请选择'>
            </i-select>
           </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码" prop="idNumber" required>
              <el-input placeholder="请输入证件号" v-model="dialogFormCompliced.idNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </i-dialog>
</template>
<script>
import req from 'api/recruit/interview'
export default {
  name: 'dialogFormCompliced',
  props: {
    ShowMeComplicedFalg: {
      type: Boolean,
      default: false,
      required: true
    },
    dialogFormCompliced: {
      type: Object,
      default: {}
    }
  },
  data () {
    const idTypeValidator = (rule, val, cb) => {
      if (!val) {
        cb(new Error('请输入证件类型'))
      } else {
        cb()
      }
    }

    let checkIdNumber = (rule, value, cb) => {
      let city = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外'
      }

      let temp = value.replace(/\s+/g, '')
      // console.log(value)
      temp.length > 30 && cb(new Error('证件号码长度最大为30个字符'))
      !temp && !this.$route.query.idNumber && cb(new Error('证件号码不能为空'))
      let isId = this.dialogFormCompliced.idType === '1'
      if (temp) {
        if (!value || !/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value) && isId) {
          cb(new Error('证件号码格式错误'))
        } else if (!city[value.substr(0, 2)] && isId) {
          cb(new Error('地址编码错误'))
        } else if (value.length === 18 && isId) {
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
          if (parity[sum % 11] !== value[17]) {
            // console.log(value, parity[sum % 11], value[17])
            value[17] === 'x' ? cb(new Error('校验位x必须要大写')) : cb()
          }
        } else {
          cb()
        }
      }
    }
    return {
      dialogFormCompliced: {
        name: '', // 面试人的姓名
        mobile: '', // 面试人的手机号
        email: null, // 邮件
        arrangerName: '',
        applyOrgName: '', // 应聘部门
        applyPosition: '', // 申请职位
        qualifyStatus: '', // 合规检查
        idType: '', // 证件类型
        idNumber: '', // 证件号码
        resumeId: '',
        interviewId: ''
      },

      // i-dialog
      toolbar: [{
        text: '取消',
        type: 'text',
        func: (done) => {
          done()
        }
      }, {
        text: '确定',
        loading: false,
        type: 'primary',
        func: (done) => {
          this.$refs.dialogFormCompliced.validate(valid => {
            if (valid) {
              this.onConfirmHandler()
              // done()
            }
          })
        }
      }],
      rules: {
        qualifyStatus: {required: true, message: '请选择合规检查', trigger: 'change'},
        idNumber: [{validator: checkIdNumber, trigger: 'change'}], // 证件号的校验
        idType: [{validator: idTypeValidator, trigger: 'change'}] // 证件类型的校验
      }
    }
  },

  methods: {
    onConfirmHandler () {
      let params = {
        resumeId: this.dialogFormCompliced.resumeId,
        interviewId: this.dialogFormCompliced.interviewId,
        idType: this.dialogFormCompliced.idType,
        idNumber: this.dialogFormCompliced.idNumber,
        qualifyStatus: this.dialogFormCompliced.qualifyStatus
      }
      this.toolbar[1].loading = true
      req('compliced', params).then((res) => {
        this.$emit('getComplicedData')
        this.toolbar[1].loading = false
        this.$message.success('合规检查成功')
        this.handleClose()
      }).catch((err) => {
        this.toolbar[1].loading = false
        console.log(err)
      })
    },
    handleClose () {
      this.ShowMeComplicedFalg = false
      this.$emit('update:ShowMeComplicedFalg', false)
    }
  }
}
</script>
<style>

</style>


