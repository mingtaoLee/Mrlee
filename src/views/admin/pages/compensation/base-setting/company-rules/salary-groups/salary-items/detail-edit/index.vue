<template>
  <el-form v-loading="loading" :element-loading-text="$loadingText" ref="form" class="zzf-security-policy-detail-edit" labelWidth="120px" :model="form" :rules="rules" v-cloak>
    <ul class="i-dialog-form">
      <li class="item">
        <el-form-item label="工资套" prop="componentListId">
          <remote-select
            v-model="form.componentListId"
            dataKey="payComponent"
            @option-click="handleOptionClick"
            :disabled="isDisabled"
            :defaultOptions="componentList"
            :props="remoteProps"
          ></remote-select>
        </el-form-item>
        <el-form-item label="工资条" prop="payslipId">
          <i-select
            v-model="form.payslipId"
            :async="false"
            :disabled="!form.componentListId"
            :options="payslipList"
            :props="payslipListProps"
          ></i-select>
        </el-form-item>
        <el-form-item label="报盘项目">
          <i-select
            v-model="form.componentId"
            dataKey="salaryItem"
            :props="payComponentListProps"
          ></i-select>
        </el-form-item>
      </li>
      <li class="item">
        <el-form-item label="工资套类型">
          <i-select
            v-model="form.componentListType"
            parameter="COMPONENT_LIST_TYPE"
            disabled
          ></i-select>
        </el-form-item>
        <el-form-item label="默认工资套">
          <el-switch
            v-model="form.isDefault"
            active-text="是"
            inactive-text="否"
            active-value="Y"
            inactive-value="N"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
      </li>
    </ul>
  </el-form>
</template>
<script>
  import RemoteSelect from 'components/compensation/remote-select'
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { NewEditor } from './new-editor'
  import { getRule } from 'utils/index'
  import req from 'api/compensation'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  const RULES = {
    componentListId: getRule('请选择工资套', 'change'),
    payslipId: getRule('请选择工资条', 'change')
  }
  export default {
    mixins: [EditorMixin],
    components: {
      RemoteSelect
    },
    props: {
      groupId: String,
      groupListId: String
    },
    computed: {
    },
    data: function () {
      return {
        // 工资套默认选项
        componentList: [],
        // 报盘模板选项
        payComponentList: [],
        // 工资条选项
        payslipList: [],
        // 工资套远程搜索显示配置项
        remoteProps: {
          label: 'keyword',
          value: 'componentListId'
        },
        // 工资套远程搜索api配置项
        apiConfig: {
          req: req,
          name: 'getComponentListName'
        },
        // 工资条下拉选框配置项
        payslipListProps: {
          value: 'payslipId',
          label: 'payslipName'
        },
        // 报盘模板下拉选框配置
        payComponentListProps: {
          value: 'componentId',
          label: 'componentName'
        },
        instance: null,
        form: {
          isDefault: 'Y',
          componentListId: '',
          payslipId: '',
          componentId: '8a90d50861300c400161337c12de2c14',
          componentListType: ''
        },
        rules: RULES
      }
    },
    methods: {
      /** 初始化实例 */
      initInstance () {
        const opts = {
          vm: this
        }
        this.instance = this.getInstance(this.editorStatus, opts)
      },

      /** 获取对应实例 */
      getInstance (editorStatus, opts) {
        switch (editorStatus) {
          case '1':
            return new BaseEditor(opts)
          case '2':
            return new NewEditor(opts)
          default:
            return new Modifier(opts)
        }
      },

      /** 选项点击事件监听 */
      handleOptionClick (item) {
        this.payComponentList = item.searchPayComponentList
        this.payslipList = item.searchPayslipList
        this.form.componentListType = item.componentListType
        // this.form.componentId = ''
        this.form.payslipId = ''
      },

      /** 初始化数据 */
      initData () {
        this.instance.initData(this.groupListId)
      }
    }
  }
</script>
<style lang="scss">
  .zzf-security-policy-detail-edit {
    .el-date-editor.el-input {
      width: 100%;
    }
  }
</style>
