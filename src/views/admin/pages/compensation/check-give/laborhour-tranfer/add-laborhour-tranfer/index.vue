<template>
  <el-form ref="form" class="laborhour-tranfer-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <p class="title">员工信息</p>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="姓名" prop="employeeName">
          <el-input v-model="form.employeeName" readonly @click.native="handlePersonnelClick">
            <i slot="suffix" class="el-input__icon iconfont icon-hr"></i>
          </el-input>
          <i-personnel-select
            :isShow.sync="isShowPersonnel"
            :multiple="false" 
            :defaultSelectedPersonnel="selectedPersonnel" 
            @confirm="handlePersonnelDialogConfirm"
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
        <el-form-item label="划出组织" prop="transferOutPunitName">
          <el-input v-model="form.transferOutPunitName" disabled></el-input>
        </el-form-item>
        <el-form-item label="划出小店" prop="transferOutUnitName">
          <el-input v-model="form.transferOutUnitName" disabled></el-input>
        </el-form-item>
      </li>
      <li class="item">              
        <el-form-item label="划出门店" prop="transferOutgroupName">
          <el-input v-model="form.transferOutgroupName" disabled></el-input>
        </el-form-item>
        <el-form-item label="店编" prop="transferOutPunitCode">
          <el-input v-model="form.transferOutPunitCode" disabled></el-input>
        </el-form-item>
      </li>
    </ul>
    <p class="title">划入方</p>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="划入组织" prop="transferInUnitId">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="form.transferInUnitId"
            lazy
            size="small"
          ></i-select-tree>
        </el-form-item>
        <el-form-item label="划入人事范围:">
          <i-select 
            v-model="form.transferOutPersonnelName"
            :props="personalAreaProps"
            dataKey="personalArea"
            filterable
          ></i-select>
        </el-form-item>
        <el-form-item label="划入小店" prop="transferInUnitId">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="form.transferInUnitId"
            lazy
            size="small"
          ></i-select-tree>
        </el-form-item>             
      </li>
      <li class="item">
        <el-form-item label="划入门店" prop="transferInPunitId">
          <i-select-tree
            @node-click="handleChange"
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            v-model="form.transferInPunitId"
            lazy
            size="small"
          ></i-select-tree>                    
        </el-form-item>
        <el-form-item label="店编" prop="transferInPunitCode">
          <el-input v-model="form.transferInPunitCode" disabled></el-input>
        </el-form-item>
      </li>
    </ul>
    <p class="title">划拨信息</p>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="划拨工时" prop="transferOutHours">
          <el-input 
            type="number" 
            v-model.number="form.transferOutHours"
            min='0'
          ></el-input>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="划拨月份" prop="transferMonth">
          <el-date-picker
            v-model="form.transferMonth"
            type="month"
            placeholder="请选择"
          ></el-date-picker>
        </el-form-item>
      </li>
    </ul>
    <p class="title">划拨原因(选择其它时可手动输入)</p>
    <el-form-item  label="划拨原因" prop="transferReason">
        <i-select 
        v-if="isShow" 
        v-model="form.transferReason"
          parameter="LABORHOUR_TRANSFER_REASON"
          @change="changeData"
          placeholder="请选择"></i-select>
        <el-input 
        v-if="!isShow" 
        v-model="form.transferReason" 
        type="textarea"
        maxlength="100" 
        placeholder="请输入划拨原因"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
  import ISelect from 'components/common/i-select/i-select.vue'
  import iPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import req from 'api/compensation/check-give/laborhour-tranfer'
  import { BaseEditor } from './base-editor'
  import { getRule, checkNum } from 'utils/index'

  const RULES = {
    employeeName: getRule('请选择员工', 'change'),
    employeeCode: getRule('请输入工号', 'change'),
    transferOutPunitName: getRule('请选择划出的门店', 'change'),
    transferOutUnitName: getRule('请选择划出的小店', 'change'),
    transferOutPunitCode: getRule('请输入划出店编', 'change'),
    transferOutHours: { validator: checkNum('请输入划出工时'), trigger: 'change' },
    transferOutgroupName: getRule('请选择划出薪资组', 'change'),
    transferMonth: getRule('请选择划拨月份', 'change', 'date'),
    transferInPunitId: getRule('请选择划入的门店', 'change'),
    transferInUnitId: getRule('请选择划入小店', 'change'),
    transferInPunitCode: getRule('请输入划入店编', 'change'),
    transferInHours: getRule('请输入划入工时', 'change', 'number'),
    transferIngroupId: getRule('请选择划入薪资组', 'change')
  }
  export default {
    name: 'AddLaborhour',
    components: {
      ISelect,
      iPersonnelSelect
    },
    props: {
      type: {
        type: String,
        default: 'edit'
      },
      accountId: String
    },
    computed: {
    },
    data () {
      return {
        instance: null,
        form: {
          employeeId: '',
          employeeName: '',
          employeeCode: '',
          transferOutPunitName: '',
          transferOutPunitId: '',
          transferOutPunitCode: '',
          transferOutgroupName: '',
          transferOutgroupId: '',
          transferOutUnitName: '',
          transferOutUnitId: '',
          transferOutHours: '',
          transferMonth: '',
          transferInPunitName: '',
          transferInPunitId: '',
          transferInPunitCode: '',
          transferIngroupName: '',
          transferIngroupId: '',
          transferInUnitName: '',
          transferInUnitId: '',
          transferInHours: '',
          transferReason: ''
        },
        rules: RULES,
        isShowPersonnel: false,
        groupProps: {
          value: 'groupId',
          label: 'groupName'
        },
        isShow: true,
         // 人事范围下拉配置
        personalAreaProps: {
          value: 'personnelGroupCode',
          label: 'personnelGroupName'
        }
      }
    },
    created () {
      this.init()
    },
    methods: {
      /** 初始化 */
      init () {
        this.initInstance()
      },

      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = new BaseEditor(opts)
      },

      /** 数据保存 */
      save () {
        return new Promise(resolve => {
          this.validate().then(res => {
            if (res) {
              this.instance.save().then(res => {
                resolve(res)
              })
            } else {
              resolve(false)
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
      handlePersonnelDialogConfirm (selected) {
        this.form.employeeName = selected.map(item => { return item.employeeName }).toString()
        var employeeId = selected.map(item => { return item.employeeId }).toString()
        this.form.employeeId = employeeId
        req('searchByemployeeCode', { employeeId: employeeId }).then(res => {
          this.form.employeeCode = res.employeeCode
          this.form.transferOutPunitName = res.transferOutPunitName
          this.form.transferOutPunitId = res.transferOutPunitId
          this.form.transferOutPunitCode = res.transferOutPunitCode
          this.form.transferOutgroupName = res.transferOutgroupName
          this.form.transferOutgroupId = res.transferOutgroupId
          this.form.transferOutUnitName = res.transferOutUnitName
          this.form.transferOutUnitId = res.transferOutUnitId
        })
      },
      /** 划入门店带出店编 */
      handleChange (a) {
        req('getunitCodeByunit', { transferInPunitId: a.orgUnitId }).then(res => {
          this.form.transferInPunitCode = res.transferInPunitCode
        })
      },
      /** 根据下拉选择切换输入方式 */
      changeData (a) {
        if (a === '05') {
          this.form.transferReason = ''
          this.isShow = false
        }
      }
    },
    watch: {
      /** 划入和划出工时自动对应 */
      'form.transferOutHours' (a) {
        this.form.transferInHours = a
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
      // text-align:center;
      // border-bottom:1px solid #dfe6ec;
      margin-bottom:20px;
  }
</style>



