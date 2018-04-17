<template>
  <div>
    <span class="ml10"></span>
      <el-tag
        v-for="tag in formData.publicTags"
        :key="tag"
        disable-transitions>{{tag.name}}</el-tag>
      <template>
        <span
          class="el-tag"
          v-for="tag in formData.myPublicTages"
          :key="tag">
          {{tag.name}}
          <i
            class="share el-icon-d-arrow-right right"
            v-if="!editable"
            @click="disShareTags(tag)"></i>
          <i
            class="el-tag__close el-icon-close"
            v-if="!editable"
            @click="myPublicClose(tag)"></i>
        </span>
      </template>
      <span
        v-for="tag in formData.myTags"
        :key="tag"
        class="el-tag el-tag--info">
        {{tag.name}}
        <i
          class="share el-icon-d-arrow-left"
          v-if="!editable"
          @click="shareTags(tag)"></i>
        <i
          class="el-tag__close el-icon-close"
          v-if="!editable"
          @click="handleClose(tag)"></i>
      </span>
        <el-button
          v-popover:popover5
          v-if="!editable"
          class="button-new-tag"
          size="small"
          @click="newTab">新建标签</el-button>
      <p class="ml10" v-if="!editable">
        提示：点击<i class="share el-icon-d-arrow-left mr10"></i>可以把标签设为公共标签，点击<i class="share el-icon-d-arrow-right mr10"></i>可以把标签设为私有标签
      </p>

      <!-- 新增标签 -->
      <add-tags
        :isShow="isShowAddTags"
        @confirm="addTagsConfirm"
        @cancel="addTagsCancel"></add-tags>
  </div>
</template>
<script>
import AddTags from './add-tags'
import { TagType } from 'views/admin/pages/recruit/config'
export default {
  name: 'Tags',
  components: {
    AddTags
  },
  props: {
    // 服务器传来的所有标签
    totalTags: {
      type: Array,
      default: []
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 是否显示新增标签弹窗
      isShowAddTags: false,
      // 所有标签数据
      formData: {
        // -----显示使用------
        publicTags: [],     // 公共标签
        myPublicTages: [],  // 私有要共享的标签
        myTags: [],          // 私有标签
        // ------数据管理-----
        addNewTags: [],      // 新增标签数组
        deleteTags: [],      // 删除标签数组
        updateTags: [],      // 更新标签数组
        // ------服务器初始数据-----
        serverPrivateTags: []   // 服务器传来的私有标签
      }
    }
  },
  watch: {
    // 全部数据
    totalTags () {
      this.toFormDataTags()
    }
  },
  methods: {
    // 重置
    reset () {
      this.formData = {
        publicTags: [],
        myPublicTages: [],
        myTags: [],
        addNewTags: [],
        deleteTags: [],
        updateTags: [],
        serverPrivateTags: []
      }
    },
    // 设置标签
    toFormDataTags () {
      this.reset()
      let len = this.totalTags.length
      let item
      this.formData.publicTags = []
      this.formData.myTags = []

      while (len--) {
        item = this.totalTags[len]
        if (item.labelType === TagType.PUBLIC) {
          this.formData.publicTags.push(item)
        } else if (item.labelType === TagType.MYPUBLIC) {
          this.formData.myPublicTages.push(item)
          this.formData.serverPrivateTags.push(item)
        } else {
          this.formData.myTags.push(item)
          this.formData.serverPrivateTags.push(item)
        }
      }
    },
    // 获取增量标签
    getAddLabels () {
      return this.formData.addNewTags
    },
    // 获取删除标签
    getDeleteLabels () {
      return this.formData.deleteTags
    },
    // 获取更新标签
    getUpdateLabels () {
      return this.formData.updateTags
    },
    // 关闭弹窗
    addTagsCancel () {
      this.isShowAddTags = false
    },
    // 删除个人标签
    handleClose (tag) {
      this.formData.myTags.splice(this.formData.myTags.indexOf(tag), 1)
      this.deleteNewTags(tag)
      if (!this.addDeleteTagsWithUpdateTags(tag)) {
        this.addDeleteTags(tag)
      }
    },
    // 删除个人设置的公共标签
    myPublicClose (tag) {
      this.formData.myPublicTages.splice(this.formData.myPublicTages.indexOf(tag), 1)
      this.deleteNewTags(tag)
      if (!this.addDeleteTagsWithUpdateTags(tag)) {
        this.addDeleteTags(tag)
      }
    },
    // 删除新建标签里面的标签
    deleteNewTags (tag) {
      // console.log('删除：', tag.name)
      let len = this.formData.addNewTags.length
      let label = null
      let flag = false
      if (len === 0) {
        return
      } else {
        while (len--) {
          label = this.formData.addNewTags[len]
          if (label.labelId === tag.labelId) {
            flag = true
            break
          }
        }

        if (flag) {
          this.formData.addNewTags.splice(this.formData.addNewTags.indexOf(tag), 1)
        }
      }
    },
    // 添加删除标签数组
    addDeleteTags (tag) {
      let len = this.formData.serverPrivateTags.length
      let label = null
      if (len === 0) {
        return
      } else {
        while (len--) {
          label = this.formData.serverPrivateTags[len]
          if (label.labelId === tag.labelId) {
            this.formData.deleteTags.push(tag)
            break
          }
        }
      }
    },
    // 删除更新标签数组，添加删除数组
    addDeleteTagsWithUpdateTags (tag) {
      let len = this.formData.updateTags.length
      let label = null
      let flag = false
      if (len !== 0) {
        while (len--) {
          label = this.formData.updateTags[len]
          if (label.labelId === tag.labelId) {
            this.formData.updateTags.splice(this.formData.updateTags.indexOf(label), 1)
            this.formData.deleteTags.push(tag)
            flag = true
            break
          }
        }
      }

      return flag
    },
    // 设置为公共标签
    shareTags (tag) {
      this.formData.myTags.splice(this.formData.myTags.indexOf(tag), 1)
      this.formData.myPublicTages.push(tag)
      this.shareNewTags(tag)
      if (!this.addUpdateTagsWithUpdateTags(tag)) {
        this.addUpdateTags(tag, TagType.MYPUBLIC)
      }
    },
    // 把新增标签数组的标签设为公共标签
    shareNewTags (tag) {
      let len = this.formData.addNewTags.length
      let label = null
      if (len === 0) {
        return
      } else {
        while (len--) {
          label = this.formData.addNewTags[len]
          if (label.labelId === tag.labelId) {
            label.labelType = TagType.MYPUBLIC
            break
          }
        }
      }
    },
    // 添加更新标签数组
    addUpdateTags (tag, type) {
      let len = this.formData.serverPrivateTags.length
      let label = null
      if (len === 0) {
        return
      } else {
        while (len--) {
          label = this.formData.serverPrivateTags[len]
          if (label.labelId === tag.labelId) {
            if (type === TagType.MYPUBLIC) {
              tag.labelType = TagType.MYPUBLIC
            } else {
              tag.labelType = TagType.MY
            }
            this.formData.updateTags.push(tag)
            break
          }
        }
      }
    },
    // 删除更新标签数组
    addUpdateTagsWithUpdateTags (tag) {
      let len = this.formData.updateTags.length
      let label = null
      let flag = false
      if (len !== 0) {
        while (len--) {
          label = this.formData.updateTags[len]
          if (label.labelId === tag.labelId) {
            this.formData.updateTags.splice(this.formData.updateTags.indexOf(label), 1)
            flag = true
            break
          }
        }
      }

      return flag
    },
    // 设置为私有标签
    disShareTags (tag) {
      this.formData.myPublicTages.splice(this.formData.myPublicTages.indexOf(tag), 1)
      this.formData.myTags.push(tag)
      this.disShareNewTags(tag)
      if (!this.addUpdateTagsWithUpdateTags(tag)) {
        this.addUpdateTags(tag, TagType.MY)
      }
    },
    // 把新增标签数组的标签设为私有标签
    disShareNewTags (tag) {
      let len = this.formData.addNewTags.length
      let label = null
      if (len === 0) {
        return
      } else {
        while (len--) {
          label = this.formData.addNewTags[len]
          if (label.labelId === tag.labelId) {
            label.labelType = TagType.MY
            break
          }
        }
      }
    },
    // 添加标签
    newTab () {
      this.isShowAddTags = true
    },
    // 过滤数组
    filterArray (list, label) {
      let len = list.length
      let tag
      if (len !== 0) {
        while (len--) {
          tag = list[len]
          if (tag.labelId === label.labelId) {
            return true
          }
        }
      }
      return false
    },
    // 过滤重复标签
    filterRepeatedTags (list) {
      let len = list.length
      let label, flag
      let newList = []

      if (len !== 0) {
        while (len--) {
          label = list[len]
          flag = this.filterArray(this.formData.publicTags, label)
          if (!flag) {
            flag = this.filterArray(this.formData.myPublicTages, label)
          }
          if (!flag) {
            flag = this.filterArray(this.formData.myTags, label)
          }

          if (!flag) {
            newList.push(label)
          }
        }
      }

      return newList
    },
    // 添加标签确认
    addTagsConfirm (list) {
      if (list && list.length > 0) {
        let newList = this.filterRepeatedTags(list)
        newList.forEach(element => {
          // 添加到界面
          this.formData.myTags.push(element)

          // 添加到新增标签
          this.addNewTagsList(element)
        })
      }
      this.isShowAddTags = false
    },
    // 添加到新增标签数组
    addNewTagsList (tag) {
      let len = this.formData.addNewTags.length
      let label = null
      let flag = false
      if (len === 0) {
        this.formData.addNewTags.push(tag)
      } else {
        while (len--) {
          label = this.formData.addNewTags[len]
          if (label.labelId === tag.labelId) {
            flag = true
            break
          }
        }

        if (!flag) {
          this.formData.addNewTags.push(tag)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.share {
  color: #878d99;
  border-radius: 50%;
  text-align: center;
  position: relative;
  cursor: pointer;
  font-size: 12px;
  height: 16px;
  width: 16px;
  line-height: 16px;
  vertical-align: middle;
  top: -1px;
  right: -5px;
}
.share:hover {
  background-color: #878d99;
  color: #fff;
}
.right {
  color: #409EFF;
}
</style>
