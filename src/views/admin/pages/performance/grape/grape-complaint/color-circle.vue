<template>
  <div>
      <span 
        class="color-circle pointer" 
        v-for="(item,index) in colorArray"
        :key="index"
        :style="{backgroundColor:item.color}" 
        :class="{active:item.isChose === 'Y' || index === nowIndex}"
        @click="chosenSelection(index)"
      >
      {{item.score}}
    </span>
  </div>
</template>

<script>
  export default {
    name: 'color-circle',
    props: ['colorArray'],
    data () {
      return {
        nowIndex: -1
      }
    },
    mounted () {
    },
    watch: {
      colorArray: function () {
        this.colorArray.forEach((val, index) => {
          if (val.isChose === 'Y') {
            this.$emit('onChange', this.colorArray[index])
          }
        })
      }
    },
    methods: {
      chosenSelection (index) {
        this.colorArray.forEach((val) => {
          val.isChose = 'N'
        })
        this.nowIndex = index
        this.colorArray[index].isChose = 'Y'
        this.$emit('onChange', this.colorArray[index])
      }
    }
  }
</script>

<style scoped lang="scss">
  .color-circle {
    float: left;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 15px;
    line-height: 30px;
    font-size: 20px;
    text-align: center;
    border: 1px solid gray;
  }

  .pointer {
    cursor: pointer;
  }

  .active {
    box-shadow: 0px 0px 10px 5px gold;
  }
</style>
