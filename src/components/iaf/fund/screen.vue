<template>
  <el-dialog
    title="筛选表格"
    :visible.sync="visible"
    @close="closeDialog"
    @open="openDialog">
    <el-checkbox v-model="checkAll" @change="checkAllChange">全选</el-checkbox>
    <div style="margin: 5px 0;"></div>
    <div class="checked">
      <slot name="checked"></slot>
    </div>
    <el-checkbox-group v-model="checkGroup" @change="checkGroupChange">
      <el-checkbox
        v-for="(key, idx) in columns"
        :key="key.prop"
        :label="key"
        border="true"
        size="mini"
        checked>{{key.label}}</el-checkbox>
    </el-checkbox-group>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    props: {
      value: Boolean,
      columns: Array
    },
    data () {
      return {
        checkGroup: [],
        isIndeterminate: false,
        checkAll: true,
        visible: false
      }
    },
    methods: {
      openDialog () {
      },
      closeDialog () {
        this.$emit('input', false)
      },
      checkAllChange (val) {
        this.isIndeterminate = !this.isIndeterminate
        this.checkAll = !this.isIndeterminate
        this.checkGroup = this.checkAll ? this.columns : []
      },
      checkGroupChange (val) {
        let checkedCount = val.length
        this.checkAll = checkedCount === this.columns.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.columns.length
      },
      confirm () {
        for (let i = 0; i < this.columns.length; i++) {
          if (this.checkGroup.map(el => { return el.prop }).indexOf(this.columns[i].prop) < 0) {
            console.log('111')
            this.columns[i].show = false
          } else {
            this.columns[i].show = true
          }
        }
        this.$emit('receiveColumns', this.columns)
        this.closeDialog()
      },
      cancel () {
        this.closeDialog()
      }
    },
    watch: {
      value () {
        this.visible = this.value
      }
    }
  }
</script>
<style scoped lang="scss">
  .el-checkbox-group{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    line-height: 5px;
    .el-checkbox{
      width: 25%;
    }
  }
  .el-checkbox+.el-checkbox{
    margin-left: 0px;
  }
  .checked{
    display: flex;
    justify-content: flex-start;
    .el-checkbox{
      margin-left: -10px;
    }
  }
</style>
