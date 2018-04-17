<template>
  <el-card>
    <div slot="header">{{ editable ? '修改后' : '修改前' }}</div>
    <el-form labelWidth="80px">
      <el-form-item label="成本中心">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="发薪主体">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="报税主体">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="生效日期">
        <el-input></el-input>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
//  import ButtonGroup from 'components/flow/button-group'
//  import BasicInfo from 'components/flow/basic-info'
//  import ISelect from 'components/common/i-select/i-select'
//  import req from 'api/employee/contract'
//  import Editor from 'components/employee/editor'
//  import IProcessFlow from 'components/common/i-process-flow'
//  import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select'
//  import IDialog from 'components/common/i-dialog/i-dialog'
//  import IUpload from 'components/common/upload/uploader'
//  import ITable from 'components/common/i-table'
//  import ITableCell from 'components/common/i-table-cell'
  //  import {formatTableDate} from 'utils/employee.js'

  export default {
    data () {
      return {
        form: {}
      }
    },
    props: {
      editable: {
        type: Boolean,
        default: false
      }
    },

    methods: {
    },

    created () {
    },

    computed: {
    },

    components: {
    }
  }
</script>
<style lang="scss">

</style>
