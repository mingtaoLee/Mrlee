<template>
  <div class="progress-bar mt10 pl20">
    <el-steps
      class="steps__progress-bar"
      ref="progress-steps"
      :space="130"
      :active="planStatus - 1"
      :align-center="true"
      finish-status="success">
      <el-step
        v-for="(title, index) in titles"
        :key="index"
        :title="title">
      </el-step>
      <section class="patterns font-size-small">
        <span class="pattern">
          <i class="icon iconfont icon-hr me"></i>
          员工本人
        </span>
        <span class="pattern">
          <i class="icon iconfont icon-hr boss"></i>
          上级
        </span>
        <span class="pattern">
          <i class="icon iconfont icon-hr indirect-boss"></i>
          非直接上级
        </span>
        <!-- <i class="icon iconfont icon-hr me"></i>
        员工本人&nbsp;&nbsp;
        <i class="icon iconfont icon-hr boss"></i>
        上级&nbsp;&nbsp;
        <i class="icon iconfont icon-hr indirect-boss"></i>
        非直接上级&nbsp;&nbsp; -->
      </section>
    </el-steps>
    <transition name="fade">
      <div
        v-show="show"
        ref="progressTip"
        class="tooltip font-size-small">
        <p v-for="(person, index) in dealPerson" :key="index">
          <i
            :class = "[ person.isFinished === 'Y'
            ? 'icon-checked'
            : 'icon-uncheck',
            'icon',
            'iconfont',
            'fr']">
          </i>
          <i
            :class = "[
              { 'me': person.dealPersonRole === '1' },
              { 'boss': person.dealPersonRole === '2' },
              { 'indirect-boss': person.dealPersonRole === '3' },
              'icon',
              'iconfont',
              'icon-hr' ]">
          </i>
          {{ person.dealPersonName }}&nbsp;&nbsp;
        </p>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',

  props: {
    planStatus: {
      required: true,
      type: String
    },
    allStatus: {
      required: true,
      type: Array
    }
  },

  data () {
    return {
      titles: ['制定', '审核', '自评', '复评', '评分确定', '结束'],       // 进度条标题数组
      show: false,                                                    // 提示框显示标志
      dealPerson: null                                               // 当前处理人字段
    }
  },

  mounted () {
    this.attachEvents()
  },

  methods: {
    over (offset, index) {
      this.$refs.progressTip.style.left = `${offset}px`
      this.initStatus(index)
      if (this.dealPerson) this.show = true
    },
    attachEvents () {
      for (let [index, element] of this.$refs['progress-steps'].$children.entries()) {
        element.$el.childNodes[0].childNodes[1].addEventListener('mouseenter', (evnet) => {
          this.over(event.target.getBoundingClientRect().left, index)
        })
        element.$el.childNodes[0].childNodes[1].addEventListener('mouseleave', () => {
          this.show = false
        })
      }
    },
    initStatus (index) {
      if (this.allStatus) {
        for (let status of this.allStatus) {
          if ((Number(index) + 1) === status.planProgressStatus) {
            this.dealPerson = status.dealPerson
            break
          } else {
            this.dealPerson = null
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .progress-bar {
    padding: 10px 20px 0;

    .tooltip {
      position: absolute;
      z-index: 666;
      background: #fff;
      color: #000;
      line-height: 1.2;
      border: 1px solid #d8d8d8;
      border-radius: 4px;
      padding: 10px;
      min-width: 20px;

      &::before {
        content: '';
        position: absolute;
        left: 10px;
        top: -5px;
        background: inherit;
        padding: 4px;
        border: inherit;
        border-right: 0;
        border-bottom: 0;
        transform: rotate(45deg);
      }
    }

    .fade-enter, .fade-leave-to {
      opacity: 0;
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity .2s ease-in-out;
    }

    .patterns {
      display: inline-block;
      line-height: 30px;
      vertical-align: top;

      .icon-hr {
        font-size: 15px;
      }

      .pattern {
        display: inline-block;
        box-sizing: border-box;
        margin-right: 30px;

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .me {
      color: #3DA5FE;
    }

    .boss {
      color: #F27B8C;
    }

    .indirect-boss {
      color: #BC86E9;
    }

    .icon-checked {
      color: #6CC60A;
    }

    .icon-uncheck {
      color: #D1D1D1;
    }
  }
</style>

<style lang="scss">
.steps__progress-bar {
  .el-step:last-of-type {
    .el-step__line {
      display: none;
    }
  }

  .el-step__icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
}
</style>
