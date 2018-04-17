<template>
  <i-dialog 
  title="标准组织明细" 
  v-model="visible" 
  :toolbar="dialogToolbar"
  @close="closeDialog">
      <el-form>

        <el-form-item label="标准组织名称:" :label-width="formLabelWidth">
          <span>{{detailData.orgStandardName}}</span>
        </el-form-item>

        <el-form-item label="生效日期:" :label-width="formLabelWidth">
        <span>{{detailData.effectiveDate}}</span>
        </el-form-item>

        <el-form-item label="组织类别:" :label-width="formLabelWidth">
          <span>{{detailData.orgTypeName}}</span>
        </el-form-item>


        <el-form-item label="品类:" :label-width="formLabelWidth">
          <el-tag
            v-for="tag in detailData.categorys"
            :key="tag.posCategoryId">{{tag.posCategoryName}}</el-tag>
        </el-form-item>

         <el-form-item label="职责:" :label-width="formLabelWidth">
         <span>{{detailData.responsibility}}</span>
        </el-form-item>
      </el-form>
    </i-dialog>
</template>

<script>
import {formatDate} from 'utils/organization'
import IDialog from 'components/common/i-dialog/i-dialog.vue'
export default {
  name: 'DlogCheck',
  components: {
    IDialog
  },
  props: {
    value: Boolean,
    detailData: Object
  },
  data () {
    return {
      formLabelWidth: '120px',
      visible: false,
      dialogToolbar: [
        {
          text: '返回',
          type: 'defalut',
          func: done => {
            this.cancel(done)
          }
        }
      ]
    }
  },
  watch: {
    value () {
      if (this.value) {
        this.init()
      }
      this.visible = this.value
    }
  },
  methods: {
    closeDialog () {
      this.$emit('input', false)
    },
    cancel () {
      this.closeDialog()
    },
    init () {
      this.detailData.effectiveDate = formatDate(this.detailData.effectiveDate)
    }
  }
}
</script>
