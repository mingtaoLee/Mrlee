<template>
  <div>
    <i-form 
      ref="iform" 
      @reset="resetInputs" 
      @search="search" 
      :access-key="accessKey"
      labelWidth="huge" 
    >
      <el-form-item label="姓名:">
        <el-input v-model="params.fullName" clearable ></el-input>
      </el-form-item>
      <el-form-item label="身份证号:">
        <el-input v-model="params.idNumber" clearable ></el-input>
      </el-form-item>
      <el-form-item label="人事范围名称:">
        <el-input v-model="params.personnelGroupName" clearable ></el-input>
      </el-form-item>
      <el-form-item label="人事范围代码:">
        <el-input v-model="params.personnelGroupCode" clearable ></el-input>
      </el-form-item>
      <slot></slot>
    </i-form>
  </div>
</template>

<script>
  export default {
    name: 'IafSearch',
    components: {
    },
    computed: {
      _params () {
        return Object.assign({}, this.params, this.additions)
      }
    },
    data () {
      return {
        checkStatusType: '',
        params: {
          fullName: '',
          orgUnitName: '',
          employeeStatus: '',
          idNumber: '',
          personnelGroupName: ''
        }
      }
    },
    props: {
      additions: Object,
      accessKey: String
    },
    methods: {
      search () {
        this.$emit('search', this._params)
      },
      resetInputs () {
        this.$emit('resetInputs')
      },
      initLayout () {
        this.$refs.iform.initLayout()
      },
      resetForm () {
        for (var key in this.params) {
          this.params[key] = ''
        }
        // this.hireDate = ''
      }
    },
    watch: {

    }
  }
</script>

<style scoped>

</style>
