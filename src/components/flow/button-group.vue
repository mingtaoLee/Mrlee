<template>
  <div class="submitButton">
    <el-form :model="model" @submit.native.prevent>
      <div class="button">
        <el-button type="primary" size="small" @click="submit" :loading="submitLoading">提交</el-button>
      </div>
      <div class="button">
        <el-button size="small" @click="save" :loading="saveLoading">暂存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
/**
 * 流程需求按钮组组件
 * @param submitLoading(提交按钮loading属性)
 * @param saveLoading(暂存按钮loading属性)
 * @event submit(提交)
 * @event save(暂存)
 */
export default {
  name: 'OcButton',
  props: [
    'model',
    'submitLoading',
    'saveLoading'
  ],
  data () {
    return {
    }
  },

  methods: {
    submit () {
      this.$emit('submit', this.catchChildren(this.$parent.$children))
    },
    save () {
      this.$emit('save', this.catchChildren(this.$parent.$children))
    },
    catchChildren (node) {
      var submit = true
      var childSub = true
      node.forEach(ele => {
        if (ele.validate) {
          ele.validate(valid => {
            if (!valid) {
              submit = false
            }
          })
        }
        if (ele.$children.length !== 0) {
          childSub = this.catchChildren(ele.$children) && childSub
        }
      })
      return submit && childSub
    }
  },

  created () {

  }
}
</script>

<style lang="scss" scoped>
.submitButton {
  float: right;
  margin-right: 20px;
  .button {
    display: inline-block;
    margin: 0px 15px 20px 0px;
  }
}
</style>
