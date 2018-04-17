<template>
  <div class="tag mr10">
    <div class="tag-name tag-label" :class="classObj">{{this.name}}</div>
    <div class="tag-name tag-name-two" v-if="isShare && this.labelType === 3">
      <span class="status" @click="share">共享</span>
    </div>
    <div class="tag-name tag-name-three" v-if="isCancelShare && this.labelType === 2">
      <span class="status" @click="cancelShare">取消共享</span>
    </div>
    <i class="el-icon-close ml10 close-btn" @click="deleteTag" v-if="this.labelType !== 1"></i>
  </div>
</template>
<script>
export default {
  name: 'Tag',
  props: {
    name: {
      type: String,
      default: ''
    },
    labelType: {
      type: Number,
      default: 1 // 1、公共标签不可修改，2、公共标签，可以修改，3、私有标签，可以修改
    }
  },
  data () {
    return {
      isShare: true,
      isCancelShare: true
    }
  },
  created () {
    console.log(this.labelType)
  },
  computed: {
    classObj: function () {
      return {
        'tag-name-two': this.labelType === 3,
        'tag-name-three': this.labelType === 2 || this.labelType === 1
      }
    }
  },
  methods: {
    // // 显示共享／取消共享
    // showStatus () {
    //   if (this.labelType === 1) {
    //     return
    //   } else if (this.labelType === 2) {
    //     this.isCancelShare = true
    //   } else {
    //     this.isShare = true
    //   }
    // },
    // // 隐藏共享／取消共享
    // hideStatus () {
    //   if (this.labelType === 1) {
    //     return
    //   } else if (this.labelType === 2) {
    //     this.isCancelShare = false
    //   } else {
    //     this.isShare = false
    //   }
    // },
    // 分享
    share () {
      this.$emit('share')
    },
    // 取消分享
    cancelShare () {
      this.$emit('cancelShare')
    },
    // 删除标签
    deleteTag () {
      this.$emit('delete')
    }
  }
}
</script>
<style lang="scss" scoped>
.tag {
  display: flex;
  padding: 0 10px;
  height: 25px;
  align-items: center;
  border-radius: 3px;
  background: #fff;
  .tag-name {
    box-sizing: border-box;
    line-height: 28px;
    font-size: 12px;
  }
  .tag-label {
    width: 62px;
    text-align: center;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .tag-name-two {
    border: 1px solid #3DA5FE;
    color: #3DA5FE;
    .status {
      display: inline-block;
      width: 40px;
      text-align: center;
      background: #3DA5FE;
      color: #fff;
      cursor: pointer;
    }
  }
  .tag-name-three {
    border: 1px solid #6CC60A;
    color: #6CC60A;
    .status {
      display: inline-block;
      width: 64px;
      text-align: center;
      background: #6CC60A;
      color: #fff;
      cursor: pointer;
    }
  }
  .close-btn {
    cursor: pointer;
  }
}
</style>
