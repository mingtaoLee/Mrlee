<template>
  <div class="add-tags">
    <el-input v-model="searchTagName"   class="input item"   @keyup.native.enter="searchTag">
        <i slot="suffix" class="el-icon-search" @click="searchTag" ></i>
    </el-input>

    <div class="total-tags mt20">
      <h2 class="info-title">所有标签</h2>
        <div class="all-tag">
            <div v-for="tag in totalTags" :key="tag">
              <div v-if="isContainTotalList(tag)" class="tag-name mr10 mb10">
                {{tag.name}}
              </div>
              <div v-else class="tag-name no-has mr10 mb10" @click="onConfirmHandler(tag)">
                {{tag.name}}
              </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import { TagType } from 'views/admin/pages/recruit/config'
import req from 'api/recruit/index'
export default {
  name: 'AddTags',
  props: {
    list: {
      type: Array,
      default: []
    },
    limit10: {
      type: Number
    }
  },
  data () {
    return {
      searchTagName: '',
      totalTags: [],
      totalList: this.list
    }
  },
  watch: {
    list (val) {
      // if (val.length > 9) {
      //   this.$message.error('标签的最大数量为10个')
      //   this.limit10 = true
      // }
      this.totalList = this.list
      return val
    }
  },
  mounted () {
    // console.log(this.list)
    this.searchTag()
  },
  methods: {
    searchTag () {
      req('searchAllLabelStarted', {
        name: this.searchTagName
      }).then((res) => {
        // console.log(res)
        this.totalTags = res
      }).catch((err) => {
        console.log(err)
      })
    },
    // 是否包含在全部标签
    isContainTotalList (tag) {
      let len = this.totalList.length
      if (len > 0) {
        let flag = false
        let item
        while (len--) {
          item = this.totalList[len]
          if (tag.labelId === item.labelId) {
            flag = true
            break
          }
        }
        return flag
      } else {
        return false
      }
    },
    // 确定
    onConfirmHandler (tag) {
      let newTag = {
        'labelId': tag.labelId,
        'name': tag.name,
        'labelType': TagType.MY
      }
      if (this.limit10 > 9) {
        this.$message.error('标签的最大数量为10个')
        return
      }
      this.$emit('confirm', [newTag])
    }
  }
}
</script>
<style lang="scss" scoped>
.total-tags {
  display: block;
  max-height: 200px;
  border: 1px solid #ccc;
  border-radius: 3px;
  overflow:auto;
  .info-title {
    margin: 20px 0;
    padding-left: 20px;
    line-height: 14px;
    color: #000000;
    letter-spacing: 0;
    font-weight: bold;
  }
}
.all-tag {
  display: flex;
  padding: 0 10px;
  align-content: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  .tag-name {
    display: block;
    padding: 0 10px;
    width: auto;
    max-width: 100px;
    height: 25px;
    line-height: 25px;
    border-radius: 3px;
    background: #6b9cfa;
    color: #fff;
    border: 1px solid #6b9cfa;
    cursor: pointer;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .no-has {
    background: #fff;
    color: #6b9cfa;
  }
}
</style>
