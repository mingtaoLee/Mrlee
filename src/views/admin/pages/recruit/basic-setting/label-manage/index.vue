<template>
  <div class="label">
     <i-layout headerKey="rctLabelsListGet">
        <div slot="header">
          <label-form></label-form>
        </div>
        <div slot="section">
          <label-table></label-table>
        </div>
     </i-layout>
  </div>
</template>
<script>
  // 公共组件
  import ILayout from 'components/common/i-layout'
  import LabelForm from '../../components/label-list/label-form'
  import LabelTable from '../../components/label-list/label-table'
  export default {
    name: 'LabelManage',
    components: {
      ILayout,
      LabelForm,
      LabelTable
    }
  }
</script>
