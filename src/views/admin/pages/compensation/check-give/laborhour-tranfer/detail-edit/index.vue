<template>
  <el-form ref="form" class="laborhour-tranfer-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <p v-if="accountId ? false : true" class="title">员工信息</p>
    <ul v-if="accountId ? false : true" class="i-dialog-form">
      <li class="item">
        <el-form-item label="姓名" prop="employeeName">
          <el-input 
            v-model="form.employeeName" 
            readonly
            placeholder="请选择" 
            @click.native="handlePersonnelClick"
          >
            <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
          </el-input>
          <i-personnel-select
            :isShow.sync="isShowPersonnel" 
            :multiple="false"
            :defaultSelectedPersonnel="selectedPersonnel" 
            @confirm="dialogConfirm"
          ></i-personnel-select>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="工号" prop="employeeCode">
          <el-input v-model="form.employeeCode" disabled></el-input>
        </el-form-item>
      </li>
    </ul>
    <p class="title">划出方</p>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="划出组织" prop="transferOutUnitName">
          <el-input v-model="form.transferOutUnitName" disabled></el-input>
        </el-form-item>
        <el-form-item label="划出小店" prop="transferOutStoreName">
          <el-input v-model="form.transferOutStoreName" disabled></el-input>
        </el-form-item>
      </li>
      <li class="item">              
        <el-form-item label="划出门店" prop="transferOutPunitName">
          <el-input v-model="form.transferOutPunitName" disabled></el-input>
        </el-form-item>
        <el-form-item label="店编" prop="transferOutPunitCode">
          <el-input v-model="form.transferOutPunitCode" disabled></el-input>
        </el-form-item>
      </li>
    </ul>
    <p class="title">划拨信息</p>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="划拨工时" prop="transferHours">
          <el-input 
            type="number" 
            v-model.number="form.transferHours"
            min='0'
          ></el-input>
        </el-form-item>
        <el-form-item  label="划拨原因" prop="transferReason">
          <i-select 
            v-model="form.transferReason"
            parameter="LABORHOUR_TRANSFER_REASON"
            placeholder="请选择"
            @change="changeData"
          ></i-select>
          <!-- <el-input 
          v-if="!isShow" 
          v-model="form.transferReason" 
          type="textarea"
          maxlength="100" 
          placeholder="请输入划拨原因"></el-input> -->
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="划拨月份" prop="transferMonth">
          <el-date-picker
            v-model="form.transferMonth"
            type="month"
            value-format="yyyy-MM"
            placeholder="请选择"
            :picker-options="pickerOption"
          ></el-date-picker>
        </el-form-item>
      </li>
    </ul>
    <p class="title">划入方</p>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="划入组织" prop="transferInUnit">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            @node-click="getTransferInInfor"
            v-model="form.transferInUnit"
            lazy
            size="small"
            :disabled="isDisabled"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="划入人事范围:" prop="transferInPersonnelCode">
          <remote-select
            v-model="form.transferInPersonnelCode"
            :props="personalAreaProps"
            dataKey="personnelGroup"
            filterable
            :disabled="isDisabled"
          ></remote-select>
        </el-form-item>
        <el-form-item label="划入小店" prop="transferInStoreName">
          <el-input v-model="form.transferInStoreName" disabled></el-input>
        </el-form-item>             
      </li>
      <li class="item">
        <el-form-item label="划入门店" prop="transferInPunitName">
           <el-input v-model="form.transferInPunitName" disabled></el-input>                   
        </el-form-item>
        <el-form-item label="店编" prop="transferInPunitCode">
          <el-input v-model="form.transferInPunitCode" disabled></el-input>
        </el-form-item>
      </li>
    </ul>
    <p class="title">备注</p>
    <el-form-item label-width="50px" prop="remark">
      <el-input
        v-model="form.remark"
        type="textarea"
        placeholder="请输入"
      ></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select.vue'
  import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import req from 'api/compensation/check-give/laborhour-tranfer'
  import { Modifier } from './modifier'
  import { BaseEditor } from './base-editor'
  import { getRule, checkNum } from 'utils/index'
  import RemoteSelect from 'components/compensation/remote-select/index'

  const RULES = {
    employeeName: getRule('请选择员工', 'change'),
    // transferInUnit: getRule('请选择划入组织', 'change'),
    transferInUnit: { required: true,
      validator: (rule, value, cb) => {
        !value && cb(new Error('请选择划入组织')) || cb()
      }
    },
    // transferInPersonnelCode: getRule('请选择划入人事范围', 'change'),
    transferInPersonnelCode: { required: true,
      validator: (rule, value, cb) => {
        !value && cb(new Error('请选择划入人事范围')) || cb()
      }
    },
    transferHours: { validator: checkNum('请输入划拨工时'), trigger: 'change', required: true },
    transferMonth: getRule('请选择划拨月份', 'change'),
    transferReason: getRule('请输入划拨原因', 'change'),
    remark: {
      validator: (rule, value, cb) => {
        value && value.length > 99 && cb(new Error('备注不能超过100个字')) || cb()
      },
      required: false
    }
  }
  export default {
    name: 'AddLaborhourDetail',
    components: {
      ISelect,
      iPersonnelSelect,
      RemoteSelect
    },
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      accountId: String,
      slectedReason: String
    },
    data: function () {
      return {
        instance: null,
        form: {
          employeeId: '',
          employeeName: '',
          employeeCode: '',
          transferOutUnit: '', // 划出组织
          transferOutUnitName: '',
          transferOutUnitCode: '',
          transferOutPunit: '', // 划出门店
          transferOutPunitName: '',
          transferOutPunitCode: '',
          transferOutStore: '', // 划出小店
          transferOutStoreName: '',
          transferOutStoreCode: '',
          transferInUnitName: '', // 划出组织
          transferInUnitCode: '',
          transferInUnit: '',
          transferInPunit: '', // 划出门店
          transferInPunitName: '',
          transferInPunitCode: '',
          transferInStore: '', // 划出小店
          transferInStoreName: '',
          transferInStoreCode: '',
          transferInPersonnelName: '', // 划入人事范围
          transferInPersonnelCode: '',
          transferHours: '',
          transferMonth: '',
          transferReason: ''
        },
        rules: RULES,
        defaultNodeOut: {},
        defaultNodeIn: {},
        isShowPersonnel: false,
        isShow: true,
         // 人事范围下拉配置
        personalAreaProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        },
        pickerOption: {
          disabledDate: (time) => {
            let days = new Date()
            if (days.getDate() > 3) {
              return time.getTime() < days - days.getDate() * 24 * 3600 * 1000
            } else {
              return time.getTime() < days.setMonth(days.getMonth() - 1)
            }
          }
        },
        isDisabled: false
      }
    },
    created () {
      this.init()
    },
    methods: {
      /** 初始化 */
      init () {
        this.initInstance()
        this.initData()
      },

      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.accountId ? new Modifier(opts) : new BaseEditor(opts)
        if (this.slectedReason === '04') {
          this.isDisabled = true
          this.rules.transferInPersonnelCode = null
          this.rules.transferInUnit = null
        }
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.accountId)
      },

      /** 数据保存 */
      save () {
        return new Promise(resolve => {
          this.validate().then(res => {
            if (res) {
              this.instance.save().then(res => {
                resolve(res)
              })
            }
          })
        })
      },

      /** 数据校验 */
      validate () {
        return new Promise(resolve => {
          this.$refs.form.validate(res => {
            if (res) {
              resolve(this.form)
            } else {
              resolve(false)
            }
          })
        })
      },
      /** 人员下拉函数 */
      handlePersonnelClick () {
        this.isShowPersonnel = !this.isShowPersonnel
      },
      /** 根据员工Id带出相关信息 */
      dialogConfirm (selected) {
        this.form.employeeName = selected.map(item => { return item.employeeName }).toString()
        this.form.employeeCode = selected.map(item => { return item.employeeCode }).toString()
        var employeeId = selected.map(item => { return item.employeeId }).toString()
        this.form.employeeId = employeeId
        req('getInfoByemployeeId', { employeeId: employeeId }).then(res => {
          this.form.transferOutUnit = res.transferOutUnit // 划出组织
          this.form.transferOutUnitName = res.transferOutUnitName
          this.form.transferOutUnitCode = res.transferOutUnitCode
          this.form.transferOutPunit = res.transferOutPunit // 划出门店
          this.form.transferOutPunitName = res.transferOutPunitName
          this.form.transferOutPunitCode = res.transferOutPunitCode
          this.form.transferOutStore = res.transferOutStore // 划出小店
          this.form.transferOutStoreName = res.transferOutStoreName
          this.form.transferOutStoreCode = res.transferOutStoreCode
        })
      },
      /** 根据划入组织Id,带出相关划入信息 */
      getTransferInInfor (val) {
        const orgUnitId = val.orgUnitId
        req('getTransferInInfor', { transferInUnitId: orgUnitId }).then(res => {
          this.form.transferInUnitCode = res.transferInUnitCode // 划入组织
          this.form.transferInUnitName = res.transferInUnitName
          this.form.transferInPunit = res.transferInPunit // 划入门店
          this.form.transferInPunitName = res.transferInPunitName
          this.form.transferInPunitCode = res.transferInPunitCode
          this.form.transferInStore = res.transferInStore // 划入小店
          this.form.transferInStoreName = res.transferInStoreName
          this.form.transferInStoreCode = res.transferInStoreCode
        })
      },
      /** 根据下拉选择控制输入权限 */
      changeData (a) {
        if (a === '04') {
          this.form.transferInUnit = ''
          this.form.transferInUnitCode = ''
          this.form.transferInUnitName = ''
          this.form.transferInPersonnelCode = ''
          this.isDisabled = true
          this.rules.transferInPersonnelCode = null
          this.rules.transferInUnit = null
        } else {
          this.isDisabled = false
          this.rules.transferInPersonnelCode = { required: true,
            validator: (rule, value, cb) => {
              !value && cb(new Error('请选择划入组织')) || cb()
            }
          }
          this.rules.transferInUnit = { required: true,
            validator: (rule, value, cb) => {
              !value && cb(new Error('请选择划入组织')) || cb()
            }
          }
        }
      }
    }
  }
</script>
<style lang="scss">
  .laborhour-tranfer-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
  .title{
      line-height:30px;
      font-weight:bold;
      padding-left:10px;
  }
</style>



