<template>
  <div class="sift-pane">
    <aside>
      <h2 slot="aside-title" class="title">自定义</h2>

      <div class="list">
        <!-- <el-checkbox
          v-model="checkAllSiftList"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange">
          全选
        </el-checkbox> -->
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-checkbox
            class="lx-check-all"
            v-model="checkAllSiftList"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="checkedSiftList"
            @change="handleCheckedSiftListChange">
            <el-collapse-item
              class="lx-el-collapse-item"
              v-for="(item, idx) of classify"
              :key="item"
              :title="item.title"
              :name="idx">
              <el-checkbox
                v-for="(sift, idx) of item.optionsArr"
                :key="idx"
                :label="sift.prop">
                {{ sift.label }}
              </el-checkbox>
            </el-collapse-item>
          </el-checkbox-group>
        </el-collapse>
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
            <span class="lx-sift-pane-delete" @click.stop="handlerDelete(idx)">&nbsp;x</span>
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
      // 将字段信息分类
      classify: [
        {
          title: '合同信息',
          optionsArr: this.doClassify('contractInfo', '1')
        },
        {
          title: '基本信息',
          optionsArr: this.doClassify('basicInfo', '2')
        },
        {
          title: '家庭成员及联系人信息',
          optionsArr: this.doClassify('familyInfo', '3')
        },
        {
          title: '教育信息',
          optionsArr: this.doClassify('educationInfo', '4')
        },
        {
          title: '其他信息',
          optionsArr: this.doClassify('otherInfo', '5')
        },
        {
          title: '薪资信息',
          optionsArr: this.doClassify('payInfo', '6')
        },
        {
          title: '职位信息',
          optionsArr: this.doClassify('jobInfo', '7')
        },
        {
          title: '组织信息',
          optionsArr: this.doClassify('organizationInfo', '8')
        }
      ],
      // 合同信息
      // contractInfo: this.doClassify('contractInfo', '1'),
      // 基本信息
      // basicInfo: this.doClassify('basicInfo', '2'),
      // 家庭成员及联系人信息
      // familyInfo: this.doClassify('familyInfo', '3'),
      // 教育信息
      // educationInfo: this.doClassify('educationInfo', '4'),
      // 其他信息
      // otherInfo: this.doClassify('otherInfo', '5'),
      // 薪资信息
      // payInfo: this.doClassify('payInfo', '6'),
      // 职位信息
      // jobInfo: this.doClassify('jobInfo', '7'),
      // 组织信息
      // organizationInfo: this.doClassify('organizationInfo', '8'),
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
      // console.log(val, old)
    },

    'activeSift.empRosterTemplateId' () {
      this.initSiftList()
    }
  },

  created () {
    this.initSiftList()
  },

  methods: {
    doClassify (type, typeVal) {
      if (type === 'contractInfo') return this.handlerClassify(type, typeVal)
      if (type === 'basicInfo') return this.handlerClassify(type, typeVal)
      if (type === 'familyInfo') return this.handlerClassify(type, typeVal)
      if (type === 'educationInfo') return this.handlerClassify(type, typeVal)
      if (type === 'otherInfo') return this.handlerClassify(type, typeVal)
      if (type === 'payInfo') return this.handlerClassify(type, typeVal)
      if (type === 'jobInfo') return this.handlerClassify(type, typeVal)
      if (type === 'organizationInfo') return this.handlerClassify(type, typeVal)
    },
    handlerClassify (type, typeVal) {
      let arr = []
      this.columns.map(val => {
        val.lxValue === typeVal && arr.push({
          prop: val.prop,
          label: val.label
        })
      })
      return arr
    },
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
    },

    handlerDelete (idx) {
      this.checkedSiftList.splice(idx, 1)
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
        // &:nth-child(odd) {
        //   background: #fafafa;
        // }
        &:hover {
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
          overflow: visible;
          margin: 0 10px 10px 0;
          border: 1px solid #e5e5e5;
          border-radius: 2px;
          position: relative;
          &.dragging-sift {
            opacity: 0;
            
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.lx-sift-pane-delete {
  cursor: pointer;
  z-index: 999;
  color: #909399;
  &:hover{
    color: red;
  }
}
.lx-check-all {
  .el-checkbox__label {
    font-size: 14px;
    color: #2d2f33;
    font-weight: 500;
  }
}
.lx-el-collapse-item {
  .el-collapse-item__header {
    padding-left: 24px;
    border-bottom: none;
    .el-collapse-item__arrow {
      margin-right: 21px;
    }
    &:hover {
      background: #f5f7fa;
    }
  }
  .el-collapse-item__content {
    padding: 0px;
    padding-bottom: 10px;
  }
  &:nth-of-type(odd) {
    .el-collapse-item__header {
      background: #fafafa;
    }
  }
  .el-collapse-item__wrap {
    border-top: 1px solid #e6ebf5;
  }
}
.lx-el-collapse-item.is-active {
  .el-collapse-item__header {
    // background: #fafafa;
  }
}
</style>

