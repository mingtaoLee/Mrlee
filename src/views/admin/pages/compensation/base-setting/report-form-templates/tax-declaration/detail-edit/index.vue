<template>
  <el-form
    v-loading="loading"
    :element-loading-text="$loadingText"
    :model="form" 
    :rules="rules" 
    ref="tax-tpl-modify" 
    label-width="80px"
  >
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item prop="iitTemplateName" label="模板名称">
          <el-input v-model="form.iitTemplateName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="companyCode" label="报税主体">
          <!--<i-select-->
            <!--v-model="form.companyCode"-->
            <!--dataKey="company"-->
            <!--filterable-->
            <!--:props="companyProps"-->
          <!--&gt;</i-select>-->
          <template v-if="previewMode || !!form.iitTemplateId">
            <el-input v-model="form.companyCode" disabled></el-input>
          </template>
          <remote-select
            v-else
            v-model="form.companyCode"
            dataKey="company"
            :props="remoteProps"
          ></remote-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <!--<el-col :span="12">-->
        <!--<el-form-item prop="areaId" label="省市区">-->
          <!--<i-select-area-->
            <!--v-model="form.areaId"-->
            <!--:disabled="previewMode || form.iitTemplateId"-->
            <!--search-->
            <!--return-node-->
          <!--&gt;</i-select-area>-->
        <!--</el-form-item>-->
      <!--</el-col>-->
      <el-col :span="12">
        <el-form-item prop="effectiveDate" label="生效日期">
          <el-date-picker
            v-model="form.effectiveDate"
            type="month"
            :disabled="isDateDisabled"
            :picker-options="effectOptions"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="uneffectiveDate" label="失效日期">
          <el-date-picker
            v-model="form.uneffectiveDate"
            type="month"
            :disabled="isDateDisabled"
            :picker-options="uneffectOptions"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="!previewMode">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <slot name="tab"></slot>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import { BaseEditor } from './base-editor'
  import { Modifier } from './modifier'
  import { NewEditor } from './new-editor'
  import { getRule } from 'utils/index'
  import companyReq from 'api/compensation'
  import RemoteSelect from 'components/compensation/remote-select'
  import EditorMixin from 'mixins/compensation/editor-mixin'
  // import BankTaxMixin from 'mixins/compensation/bank-tax-mixin'
//  import { showMessage, confirmPopover } from 'utils/index'
  const RULES = {
    iitTemplateName: [
      getRule('请填写模板名称', 'change'),
      { min: 0, max: 50, message: '只能输入50个字', trigger: 'change' }
    ],
    companyCode: getRule('请输入报税主体', 'change'),
    effectiveDate: getRule('请选择生效日期', 'change', 'date'),
    remark: { min: 0, max: 200, message: '只能输入200个字', trigger: 'change' }
  }
  export default {
    mixins: [EditorMixin],
    data () {
      return {
        companyApiConfig: {
          req: companyReq,
          name: 'getCompanies'
        },
        remoteProps: {
          value: 'companyCode',
          label: 'companyCode'
        },
        companyProps: {
          value: 'companyName',
          label: 'companyName'
        },
        form: {
          iitTemplateId: null,
          iitTemplateName: '',
          areaId: '',
          companyName: '',
          companyCode: '',
          effectiveDate: '',
          uneffectiveDate: new Date('9999-12-31 00:00:00'),
          remark: ''
        },
        instance: null,
        rules: RULES
      }
    },
    created () {
      // this.form.effectiveDate && (this.form.effectiveDate = new Date(this.form.effectiveDate))
      // this.form.uneffectiveDate = new Date(this.form.uneffectiveDate)
    },
    props: {
      id: String,
      // form: {
      //   type: Object,
      //   default: () => {
      //     return {
      //       iitTemplateId: null,
      //       iitTemplateName: '',
      //       areaId: '',
      //       effectiveDate: '',
      //       uneffectiveDate: '',
      //       remark: ''
      //     }
      //   }
      // },
      previewMode: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      initData () {
        this.instance.initData(this.id)
        // if (this.data.calculateRuleId) {
        // } else {
        // }
        // getDict('ATTENDANCE_ITEM').then(res => {
          // if (res) {
            // this.attendanceOptions = this.transformAttendanceOptions(res)
            // this.instance.initData(this.id)
          // }
        // })
      },
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
      }
    },
    components: {
      RemoteSelect
    }
  }
</script>
