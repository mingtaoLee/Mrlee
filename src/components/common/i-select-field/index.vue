<template>
  <div class="sift-pane">
    <aside>
      <h2 slot="aside-title" class="title">待选字段</h2>

      <div class="list">

        <el-input></el-input>

        <el-checkbox
          v-model="checkAllSiftList"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange">
          全选
        </el-checkbox>

        <el-checkbox-group
          v-model="checkedSiftList"
          @change="handleCheckedSiftListChange">
          <el-checkbox
            v-for="(sift, idx) of checkboxSiftList"
            :key="idx"
            :label="sift.prop">
            {{ sift.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </aside>

    <main>
      <h2 slot="section-title" class="title">已选字段</h2>

      <div class="content">
        <p class="desc">按住鼠标，可拖动自定义字段顺序</p>

        <draggable
          v-model="checkedSiftList"
          :options="{ animation: 150 }"
          @start="moveStart"
          @end="moveEnd"
          class="drag-pane">
          <span
            v-for="(sift, idx) of checkedSiftList"
            :key="idx"
            :class="{ 'dragging-sift': dragging && draggingIdx === idx }"
            class="chunk">
            {{ labelFormatter(sift) }}
          </span>
        </draggable>
      </div>
    </main>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  props: {
    activeSift: {
      default: {}
    },
    columns: {
      default: []
    }
  },

  data () {
    return {
      checkboxSiftList: Object.keys(this.columns).map(key => ({
        prop: this.columns[key].prop,
        label: this.columns[key].label
      })),

      columnsMap: new Map(
        Object.keys(this.columns).map(key => [
          this.columns[key].prop, this.columns[key].label
        ])
      ),

      isIndeterminate: false,
      checkAllSiftList: false,
      checkedSiftList: [],
      dragging: false,
      draggingIdx: 0
    }
  },

  watch: {
    checkedSiftList (val, old) {
      this.$emit('change', val)
    },

    'activeSift.empRosterTemplateId' () {
      this.initSiftList()
    }
  },

  created () {
    this.initSiftList()
  },

  methods: {
    initSiftList () {
      this.isIndeterminate = false
      this.checkAllSiftList = false

      this.checkedSiftList = this.activeSift.searchFiled
        ? this.activeSift.searchFiled.split(',')
        : []

      this.handleCheckedSiftListChange(this.checkedSiftList)
    },

    /** ---------------- Checkbox ---------------- */

    /** 监听搜索条件的全选状态 */
    handleCheckAllChange (val) {
      this.checkedSiftList = val ? this.checkboxSiftList.map(el => el.prop) : []
      this.isIndeterminate = false
    },

    /** 监听搜索条件的选中状态 */
    handleCheckedSiftListChange (value) {
      let checkedCount = value.length

      this.checkAllSiftList = checkedCount === this.checkboxSiftList.length
      this.isIndeterminate = (checkedCount > 0) && (checkedCount < this.checkboxSiftList.length)
    },

    labelFormatter (prop) {
      return this.columnsMap.has(prop) ? this.columnsMap.get(prop) : ''
    },

    randomSift () {
      this.checkedSiftList.sort((a, b) => Math.random() - 0.5)
    },

    moveStart (e) {
      this.draggingIdx = e.oldIndex
      this.dragging = true
    },

    moveEnd (e) {
      this.dragging = false
    }
  },

  components: {
    Draggable
  }
}
</script>

<style lang="scss" scoped>
.sift-pane {
  $title-height: 40px;
  $dialog-height: 450px;
  $aside-width: 220px;

  display: flex;
  justify-content: space-between;
  height: $dialog-height;
  overflow: hidden;
  .title {
    background: #f2f2f2;
    padding: 0 20px;
    line-height: $title-height;
    height: $title-height;
    font-size: 14px;
  }
  aside {
    box-sizing: border-box;
    width: $aside-width;
    margin-right: 20px;
    .list {
      height: calc(100% - #{$title-height});
      width: 100%;
      overflow-y: scroll;
      .el-checkbox {
        display: flex;
        justify-content: space-between;
        flex-direction: row-reverse;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        margin-left: 0;
        padding: 12px 20px;
        span {
          padding: 0 !important;
        }
        &:nth-child(odd) {
          background: #fafafa;
        }
      }
    }
  }
  main {
    flex: 1;
    .content {
      height: calc(100% - #{$title-height});
      overflow-y: scroll;
      .desc {
        padding: 20px;
        color: #a2a2a2;
      }
      .drag-pane {
        padding: 0 20px;
        .chunk {
          display: inline-block;
          padding: 5px 10px;
          cursor: move;

          margin: 0 10px 10px 0;
          border: 1px solid #e5e5e5;
          border-radius: 2px;
          &.dragging-sift {
            opacity: 0;
          }
        }
      }
    }
  }
}
</style>
