<template>
  <section class="person">
    <i-layout>
      <div slot="section" class="tree">
        <el-tree :data="roleData" :props="defaultProps" node-key="menuId" show-checkbox default-expand-all ref="roleTree" />
        <div class="footer">
            <el-button v-if="this.$route.params.edit === 'true'" type="primary" @click="submit" >保存</el-button>
            <el-button v-else type="primary" @click="back">返回</el-button>
          </div>
      </div>
     
    </i-layout>

  </section>
</template>

<script>
  import req from 'api/system/role-management'
  import {jsonTree} from 'utils/index'
  import ILayout from 'components/common/i-layout'

  export default {
    data () {
      return {
        roleData: null,
        dataList: {},
        defaultProps: {
          children: 'children',
          label: 'menuName'
        },
        checkedKeys: []
      }
    },
    methods: {
      postRoleResource (roleId) {
        req('getRoleResource', {roleId})
          .then(data => {
            this.dataList = data
            data.roleMenuList.map(key => key.isHadPower === 'Y' && this.checkedKeys.push(key.menuId))
            data.roleMenuList.map(key => { key.disabled = this.$route.params.edit === 'false' })
            this.roleData = jsonTree(data.roleMenuList, {id: 'menuId', pid: 'parentMenuId'})
          })
      },

      submit () {
        let list = this.$refs.roleTree.getCheckedKeys()

        this.dataList.roleMenuList.map(key => {
          list.indexOf(key.menuId) !== -1 ? key.isHadPower = 'Y' : key.isHadPower = 'N'
        })

        this.postSaveRoleResource(this.dataList)
      },

      postSaveRoleResource (listParams) {
        req('postSaveRoleResource', listParams)
        .then(res => {
          this.$message('保存成功')
          this.$router.back(-1)
        })
      },

      back () {
        this.$router.back(-1)
      }
    },

    created () {
      this.postRoleResource(this.$route.params.userId)
    },

    mounted () {
      this.$refs.roleTree.setCheckedKeys(this.checkedKeys, false)
    },
    components: {
      ILayout
    }
  }

</script>
<style lang="scss" scoped>
  .person {
    position: relative;
    .tree {
      width: 85%;
      margin: auto;
      padding: 10px 0;
      .footer {
        position: absolute;
        bottom: 20px;
        left: 48%;
      }
    }
  }
</style>