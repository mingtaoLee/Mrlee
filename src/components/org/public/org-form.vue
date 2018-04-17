<template>
  <el-form
  ref="orgForm"
  :rules="rules"
  :model="formData"
  label-width="100px"
  label-position="right">
    <el-form-item label="组织代码" v-if="!newOrgFlow">
      <el-input v-model="formData.orgUnitCode" readonly></el-input>
    </el-form-item>
    <el-form-item label="标准组织库" v-if="newOrgFlow">
      <el-input v-model="formData.lib" readonly>
        <el-button slot="append" icon="menu" @click="showSelectLib"></el-button>
      </el-input>
    </el-form-item>
    <el-form-item label="组织名称" prop="orgUnitName">
      <el-input v-model="formData.orgUnitName" readonly></el-input>
    </el-form-item>
    <el-form-item label="组织类别" prop="orgType">
      <org-type-select></org-type-select>
    </el-form-item>
    <el-form-item label="业态">
      <el-select v-model="formData.businessType" :disabled="isDisabled('businessType')"></el-select>
    </el-form-item>
    <el-form-item label="所在区域">
      <el-select v-model="formData.belongArea" :disabled="isDisabled('location')">

      </el-select>
    </el-form-item>
    <el-form-item label="管理分区">
      <el-select v-model="formData.managedArea" :disabled="isDisabled('area')">

      </el-select>
    </el-form-item>
    <el-form-item label="生效日期">
      <span>{{formData.effectiveDate}}</span>
    </el-form-item>
    <el-form-item label="上级组织">
      <el-input v-model="formData.parentUnitName" readonly></el-input>
    </el-form-item>
    <el-form-item label="部门负责人">
      <el-input v-model="formData.orgLeader" readonly></el-input>
    </el-form-item>
    <el-form-item label="是否虚拟组织">
      <el-radio-group v-model="formData.isVirtualOrg">
        <el-radio label="是"></el-radio>
        <el-radio label="否"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="关键职责">
      <el-input v-model="formData.orgResponsibility" type="textarea"></el-input>
    </el-form-item>
    <el-form-item label="同时设置职位">
      <el-radio-group v-model="formData.isSalaryUnit" v-if="!newOrgFlow">
        <el-radio label="是"></el-radio>
        <el-radio label="否"></el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
import reqLib from 'api/org/lib'
import OrgType from './org-type-select'
export default {
  data () {
    return {
      orgType: [],
      rules: {
        orgUnitName: [
          { required: true }
        ],
        orgType: [
          { required: true, trigger: 'change' }
        ],
        businessType: [
          { required: true }
        ],
        location: [
          { required: true }
        ],
        area: [
          { required: true }
        ],
        parent: [
          { required: true }
        ]
      },
      enableOptionsMap: {}
    }
  },
  components: {
    OrgType
  },
  props: {
    formData: Object,
    newOrgFlow: Boolean,
    enableOptions: {
      type: Array,
      default: () => []
    },
    type: String
  },
  methods: {
    getOrgType () {
      reqLib('orgType').then(data => {
        this.orgType = data.map((item, index) => {
          return {
            value: item.orgTypeId,
            label: item.orgTypeName
          }
        })
      })
    },
    isDisabled (key) {
      return !(this.enableOptions.indexOf(key) > -1)
    },
    showSelectLib () {
      this.$emit('showSelectLib')
    },
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs.orgForm.validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
    }
  },
  mounted () {
    this.getOrgType()
    if (this.type === 'check') {
      this.rules = {}
    }
    this.enableOptions.forEach(item => {
      this.enableOptionsMap[item] = true
    })
  }
}
</script>

<style lang="scss" scoped>
.el-form-item{
  margin-bottom:10px;
}
</style>
