<template>
  <div class="wrap p20 lx-per">
    <el-form ref="form" :model="model" :rules="rules" class="parentFormItem">
      <el-form-item label="组织权限" label-width="120px" prop="orgs" class="per">
        <el-checkbox 
          v-model="unitHasAllForm.unitHasAll"
          @change="unitHasAllChange"
          class="orgSelectChild"
          border
          size="mini"
        >
          全选
        </el-checkbox>
        <i-select-tree
          placeholder=""
          :lazy="true"
          sizeAuto
          :multiple="true"
          dataKey="org"
          nodeKey="orgUnitId"
          v-model="model.orgs"
          :props="orgProps"
          :disabled="unitHasAllForm.unitHasAll"
          :search="false"
        ></i-select-tree>
      </el-form-item>
    </el-form> 
  </div>
</template>

<script>
/**
 * @prop {Object} model 传进来的数据
 * @prop {Boolean} ifMotify 确认是否为修改操作
 */
// import reqTp from 'api/compile/template'
import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
import ISelect from 'components/common/i-select/i-select.vue'
export default {
  name: 'NewTemplate1',
  components: {
    ISelectTree,
    ISelect
  },
  props: {
    model: {
      type: Object,
      default () {
        return {}
      }
    },
    // 接受组织权限是否全选的值
    unitHasAllForm: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      // 表单的验证规则
      rules: {
        // orgs: [
        //   { required: true, message: '请选择适用范围', trigger: 'blur' }
        // ]
      },
      // 组织下拉树的配置
      orgProps: {
        children: 'children',
        label: 'orgUnitName'
      },
      // 下拉列表的数据
      data: null
      // 维度,阻塞数据第一次带入引起的变化
      // once: false,
      // 监听编制维度下面的选择,阻塞空值引起的变化
      // banOnceChange: true
    }
  },
  // watch: {
  //   'model.orgs' (val) {
  //     // console.log(val)
  //     // console.log(this.model.orgs)
  //   }
  // },
  methods: {
    // 全选的时候清空组织权限树木的选择
    unitHasAllChange (val) {
      if (val) {
        // 这里一定要滞空成空字符串，公共组件要求如此
        this.model.orgs = ''
      }
    }
  }
}
</script>

<style lang="scss">
.lx-per {
  .per {
    .el-form-item__content {
      display: flex;
      align-items: center;
      .orgSelectChild {
        margin-right: 5px;
        vertical-align: middle;
        // margin-top: -1px;
        line-height: 20px;
      }
    }
  }
}
</style>