<template>
    <div>
      <el-form>
        <el-form-item label="查询并选择薪资组:" label-width="120px">
          <remote-select
            v-model="salaryGroupId"
            :props="groupProps"
            dataKey="salaryGroup"
            :multiple="true"
            :displayKeys="displayKeys"
            :collapseTags="false"
            filterable
          ></remote-select>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import req from 'api/compensation/check-give/salary-give'
  import RemoteSelect from 'components/compensation/remote-select/index'

  export default {
    name: 'SalaryGiveCreate',
    components: {
      RemoteSelect
    },
    data () {
      return {
        salaryGroupId: [],
        groupProps: {
          label: 'groupName',
          value: 'groupId'
        },
        displayKeys: ['groupCode', 'groupName']
      }
    },
    methods: {
      getSalaryGroup () {
        return new Promise(resolve => {
          const salaryGroupId = this.salaryGroupId
          req('postSalaryGroupById', salaryGroupId).then(res => {
            resolve(res)
          })
        })
      }
    }
  }
</script>


