<template>
  <div>
    <div v-for="item in list" :key="item">
      <div class="flex mt10">
        <div class="title mr10 bold" @click="showChild(item)">
          <span class="el-tree-node__expand-icon el-icon-caret-right" :class="{expanded: item.isShow}"></span>
          <span>{{item.fieldName}}</span>
        </div>
        <el-select
          v-model="item.jurisdiction"
          class="select"
          @change="val => changeParentsPermission(item, val)"
          size="mini">
          <el-option
            v-for="status in jurisdictionList"
            :key="status"
            :label="status.label"
            :value="status.value">
          </el-option>
        </el-select>
      </div>
      <template v-if="item.isShow">
        <div
          v-for="(child, idx) in item.formFieldList"
          :key="child">
          <div
            class="flex el-tree-node__children child"
            @mouseenter="!activeFlag ? hoverIdx = idx : null"
            @mouseleave="!activeFlag ? hoverIdx = -1 : null">
            <div class="title mr10">
              {{child.fieldName}}
            </div>

            <transition name="fade">
              <i-select
                v-show="hoverIdx === idx || child.wfRelevance"
                clearable
                class="select"
                placeholder="请选择"
                parameter="WP_FORM_DIMESION"
                v-model="child.wfRelevance"
                @click.native="activeFlag = true"
                @change="activeFlag = false">
              </i-select>
            </transition>

            <el-select v-model="child.jurisdiction" class="select" size="mini">
              <el-option
                v-for="childStatus in childListWithParents(item.jurisdiction)"
                :key="childStatus.value"
                :label="childStatus.label"
                :value="childStatus.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ConfigList',
  props: {
    // 树的数据
    list: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      // 权限状态
      jurisdictionList: [
        {
          label: '不显示',
          value: '1'
        },
        {
          label: '显示不可编辑',
          value: '2'
        },
        {
          label: '显示可编辑',
          value: '3'
        }
      ],
      // hover index
      hoverIdx: -1,
      activeFlag: false
    }
  },
  methods: {
    // 显示子选择列表
    childListWithParents (jurisdiction) {
      let list = [].concat(this.jurisdictionList)
      if (jurisdiction) {
        let index = parseInt(jurisdiction)
        list = list.filter(item => {
          return parseInt(item.value) <= index
        })
      }
      return list
    },
    // 设置子节点权限不能大于父节点
    changeParentsPermission (item, val) {
      let len = item.formFieldList.length
      let child
      if (len !== 0) {
        while (len--) {
          child = item.formFieldList[len]
          // if (!child.jurisdiction || child.jurisdiction > val) {
          child.jurisdiction = val
          // }
        }
      }
    },
    // 显示子节点
    showChild (item) {
      let len = this.list.length
      let vo
      if (!item.isShow) {
        this.hideAllChild()
      }
      let newList = []
      for (let i = 0; i < len; i++) {
        vo = this.list[i]
        if (vo === item) {
          vo.isShow = !item.isShow
        }
        newList.push(vo)
      }
      this.list = newList
    },
    // 隐藏全部子节点
    hideAllChild () {
      let len = this.list.length
      let item
      let newList = []
      for (let i = 0; i < len; i++) {
        item = this.list[i]
        let newItem = item
        newItem.isShow = false
        newList.push(newItem)
      }
      this.list = newList
    }
  }
}
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: space-between;

  .title {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    cursor: default;
    flex-basis: 30%;
  }
}
.flex:hover {
  background-color: rgba(232,237,250,.6);
  box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.6);
}
.child {
  margin: 10px 0 0 20px;
}
.select {
  width: 120px;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
