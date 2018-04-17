<template>
  <div class="choose">
    <ul class="chooser-list">
      <li
        v-for="(item, index) in selections"
        :key="index"
        @click="chosenSelection(index)"
        :title="item.label"
        :class="{active:index === nowIndex}" v-show="index < 7 || showmoreItem "
      >{{ item.label }}
      </li>
    </ul>
    <span v-if="selections.length > 6" class="tips" @click="showmore">全部 V</span>
  </div>
</template>

<script>
  export default {
    name: 'choose',
    props: {
      selections: {
        type: Array,
        default: [{
          label: 'test',
          value: 0
        }]
      }
    },
    data () {
      return {
        nowIndex: 0,
        showmoreItem: false
      }
    },
    methods: {
      chosenSelection (index) {
        this.nowIndex = index
        console.log(this.selections[index])
        this.$emit('onChange', this.selections[index])
      },
      showmore () {
        this.showmoreItem = !this.showmoreItem
      }
    }
  }
</script>

<style scoped lang="scss">
  .choose {
    position: relative;
    display: inline-block;
    vertical-align: top;
    width: 700px;
    li {
      display: inline-block;
      width: 100px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      &.active {
        border-color: #B3D2F1;
        background: #B3D2F1;
        color: black;
      }
    }
    .tips {
      position: absolute;
      top: 16px;
      right: -80px;
    }
  }


</style>
