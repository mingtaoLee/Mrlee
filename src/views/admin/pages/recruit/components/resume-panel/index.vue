<template>
  <div class="resumePanel">
    <!-- <i-layout headerKey="rctResumesListGet"> -->
    <i-layout>
      <div slot="header">
        <resume-form></resume-form>
      </div>
      <div slot="section">
        <resume-table :pageSource="tableSource"></resume-table>
      </div>
    </i-layout>
  </div>
</template>
<script>
import ILayout from 'components/common/i-layout'
import ResumeForm from './resume-form'
import ResumeTable from './resume-table'
export default {
  name: 'ResumePanel',
  components: {
    ILayout,
    ResumeForm,
    ResumeTable
  },
  props: {
    // 简历来源
    pageSource: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 简历来源
      tableSource: this.pageSource
    }
  },
  watch: {
    pageSource (val) {
      this.tableSource = this.pageSource
    }
  }
}
</script>
<style lang="scss">
  .resumePanel {
    .el-select__tags {
      height: 20px;
    }
    .el-select__tags {
      position: absolute;
      height: 22px;
      white-space: nowrap;
      overflow: hidden;
      line-height: normal;
      white-space: nowrap;
      z-index: 1;
      top: 18px;
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
    }
    .el-select {
      .el-tag {
        height: 20px;
        line-height: 20px;
        margin: 1px;
      }
    }
    .el-input__inner {
      height: 28px;
    }
    .el-input--mini {
      font-size: 14px;
    }
  }
</style>
