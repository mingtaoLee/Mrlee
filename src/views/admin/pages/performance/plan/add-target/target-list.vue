<template>
  <div class="target-list-container">
    <el-table :data="listData" height="250" @selection-change="handleTableSelected">
      <el-table-column type="selection" v-if="multiple"></el-table-column>
      <el-table-column label="姓名" prop="employeeName" show-overflow-tooltip ></el-table-column>
      <el-table-column label="状态"></el-table-column>
      <el-table-column label="操作" align="center" v-if="!multiple">
        <template slot-scope="scope">
          <i class="el-icon-close performance-add-target-icon" @click="selectedChange($index)"></i>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
    :total="total"
    @current-page="pageChange"
    layout="total,prev,pager,next"
    :page-size="pageSize"
    class="pagination"
    small></el-pagination>
  </div>
</template>
<script>
// import {clone} from 'utils/index'
export default {
  name: 'add-target-list',
  props: {
    listData: Array, // 列表数据
    multiple: Boolean, // 是否显示多选框
    domId: String,
    selectAll: Boolean,
    total: {
      default: 0,
      type: Number
    },
    pageSize: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
      renderData: [],
      checkAll: false
    }
  },
  methods: {
    selectedChange (index, e) {
      this.$emit('selectedChange', {
        index,
        checked: false
      })
    },
    pageChange (index) {
      this.$emit('load', {
        pageSize: this.pageSize,
        pageIndex: index
      })
    },
    // handleListScroll () {
    //   let container = document.getElementById(this.domId)
    //   if (container.scrollHeight - container.clientHeight - container.scrollTop < 15) {
    //     // this.listData = this.listData.concat(this.listData)
    //     // 处理分页参数，转菊花
    //     this.$emit('scrollToBottom')
    //   }
    //   // console.log(listWrapper.getElementsByClassName('target-list-item')[0].getBoundingClientRect(), container.scrollTop)
    //   // console.log(container.scrollHeight, container.clientHeight)
    // },
    handleTableSelected (selection) {
      this.$emit('tableSelect', selection)
    },
    selfClone (obj) {
      let cloneObj = function (obj) {
        let [str, newobj] = obj.constructor === Array ? [] : {}
        if (typeof obj !== 'object') {
          return
        } else if (window.JSON) {
          str = JSON.stringify(obj) // 系列化对象
          newobj = JSON.parse(str) // 还原
        } else {
          for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object'
            ? cloneObj(obj[i]) : obj[i]
          }
        }
        return newobj
      }
      return cloneObj(obj)
    }
  },
  watch: {
    listData (newValue, oldValue) {
      if (this.selectAll) {
        newValue.forEach(element => {
          if (element.checked === undefined) element.checked = true
        })
      }
      this.renderData = this.selfClone(newValue)
    }
  }
}
</script>
<style lang="scss" scoped>
  .target-list-container {
    header {
      .header-table {
        width: 100%;
      }
      .header-table-row {
        width: 100%;
        display: flex;
        box-sizing: border-box;
        .header-table-col {
          width: 33%;
          text-align: center;
          align-items: center;
          box-sizing: border-box;
          border-top: none;
          border-bottom: none;
          border-left:none;
        }
        .header-table-col:nth-child(3) {
          text-align: right;
          border-right: none;
          padding-right: 10px;
        }
      }
    }
    .target-list-area-wrapper {
      height: 200px;
      box-sizing: border-box;
      overflow: auto;
    }
    .target-list-area {

    }
    .target-list-item {
      height: 30px;
      box-sizing: border-box;
      .target-list-item-select {
        text-align: right;
      }
      .target-list-item-name {
        text-align: left;
      }
    }
  }
  .pagination {
    text-align: right;
  }
</style>
<style lang="scss">
.performance-add-target-icon {
  font-size: 5px;
  cursor: pointer;
}
</style>
