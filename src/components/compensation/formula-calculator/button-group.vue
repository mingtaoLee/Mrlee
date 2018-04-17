<template>
  <div>
    <el-row class="cal-btn-area">
      <el-col :span="12" class="cal-btn-left">
        <el-row :gutter="5" class="cal-line">
          <el-col :span="8">
            <el-button class="cal-btn" @click="handleClick('if')">if</el-button>
          </el-col>
          <el-col :span="8">
            <el-button class="cal-btn" @click="handleClick('then')">then</el-button>
          </el-col>
          <el-col :span="8">
            <el-button class="cal-btn" @click="handleClick('else')">else</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="5" class="cal-line">
          <el-col :span="8">
            <el-button class="cal-btn" @click="handleClick('and')">and</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('or')">or</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('not')">not</el-button>
          </el-col>
          <el-col :span="8">
            <el-button class="cal-btn" type="primary" @click="handleEnter">回车</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="5" class="cal-line">
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('<')">&lt;</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('>')">&gt;</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('≤')">≤</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('≥')">≥</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('!=')">!=</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClean" type="danger">ce</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="5" class="cal-line">
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('7')">7</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('8')">8</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('9')">9</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('+')">+</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('-')">-</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('(')">(</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="5" class="cal-line">
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('4')">4</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('5')">5</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('6')">6</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('*')">*</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('/')">/</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick(')')">)</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="5" class="cal-line">
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('1')">1</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('2')">2</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('3')">3</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('0')">0</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('.')">.</el-button>
          </el-col>
          <el-col :span="4">
            <el-button class="cal-btn" @click="handleClick('=')">=</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  //  import { showMessage, confirmPopover } from 'utils/index'
  import calMap from './cal-map'

  export default {
    components: {
    },
    data () {
      return {
        map: calMap.button
      }
    },
    props: {
      data: {
        type: Object,
        default: () => {}
      }
    },
    created () {
      this.initData()
    },
    methods: {
      initData () {
      },
      handleEnter () {
        this.$emit('enterClick')
      },
      handleClean () {
        this.$emit('cleanClick')
      },
      handleClick (id) {
        this.$emit('buttonClick', this.map[id])
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cal-btn-area {
    padding: 0 5px;
  }
  .cal-line{
    margin-bottom: 5px;
  }
  .cal-btn-left {
    padding-right: 5px;
  }
  .cal-btn{
    width:100%;
    padding-left: 0;
    padding-right: 0;
  }
</style>
