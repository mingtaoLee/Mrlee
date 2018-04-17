<template>
  <table class="table" v-if="record">
    <tbody>
      <tr v-for="(obj, index) in record" :key="index">
        <p>
          {{ obj.description ? obj.description : obj}}
        </p>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'ApprovalTable',
  props: ['record']
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  border: 1px solid #DFE6EC;
  tbody {
    tr{
      &:nth-of-type(2n) {
        background: #eee;
      }
      p {
        margin-left: 10px;
        line-height: 40px;
        padding-right: 10px;
      }
    }
  }
}
</style>
