<template>
  <div class="structure">
    <el-dialog :visible.sync="visible" @close="closeDialog" size="tiny">
      <!--<div class="orgTree">-->
      <!--<el-autocomplete-->
      <!--v-model="keyword"-->
      <!--class="search"-->
      <!--placeholder="输入组织名称"-->
      <!--:fetch-suggestions="getSearchResult"-->
      <!--:props="defaultProps"-->
      <!--:trigger-on-focus="false"-->
      <!--@select="handleSelect"-->
      <!--&gt;</el-autocomplete>-->
      <!--</div>-->
      <!--<div class="filter">-->
      <!--<el-input placeholder="搜索" icon="search">-->
      <!--</el-input>-->
      <!--</div>-->
      <el-form labelWidth="100px">
        <el-form-item label="组织选择：">
          <i-select-tree
            :multiple="false"
            dataKey="org"
            nodeKey="orgUnitId"
            :defaultNode="defaultNode"
            :rootId="rootId"
            v-model="nodeValue"
            :lazy="true"
            @input="handleNodeClick"
            :readonly="true"
            size="large"
            treeMaxHeight="180"
            :accordion="true"
          ></i-select-tree>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'

  export default {
    data () {
      return {
        visible: false,
        keyword: '',
        nodeValue: ''
      }
    },
    components: {
      ISelectTree
    },
    props: ['value'],
    watch: {
      value () {
        this.visible = this.value
      }
    },
    methods: {
      handleNodeClick (data) {
        console.log(data)
        this.$emit('orgName', data)
      },
      closeDialog () {
        this.$emit('input', false)
      },
      handleSelect (data) {
        this.treeData = [data]
      },
      getSearchResult (queryString, resolve) {

      }
    }
  }
</script>

<style scoped lang="scss">
  .structure {
    display: flex;
    .orgTree {
      padding-top: 14px;
      text-align: center;
      .search {
        margin-bottom: 10px;
      }
      .tree {
        text-align: left;
        border: none;
      }
    }
  }
</style>
