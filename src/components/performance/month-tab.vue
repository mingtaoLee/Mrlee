<template>

  <div :class="[{
    'font-size-mini': size === 'mini',
    'font-size-small': size === 'small',
    'font-size-medium': size === 'medium',
    'font-size-large': size === 'large'},
    'tab']">

    <span class="tab--prev" @click="goPrev" ref="go-prev">
      <i class="icon iconfont icon-goback"></i>
    </span>

    <ul class="tab--content" ref="tab">
      <li
        v-for="(period, index) in slicedPeriods"
        :key="index"
        :class="[{ active: index === selectedIndex }, 'period']"
        @click="selectPeriod(index)">
        {{ period.period | periodFormat }}
        <i
          :class="[
            period.isEnd === 'Y'
            ? ['icon-checked', 'icon-green']
            : ['icon-uncheck', 'icon-red'], 'icon', 'iconfont']">
        </i>
      </li>
    </ul>

    <span class="tab--next disabled" @click="goNext" ref="go-next">
      <i class="icon iconfont icon-linear-arrow-right"></i>
    </span>

  </div>

</template>

<script>
import { periodDict } from '@/config/dict'

export default {
  name: 'monthTab',

  props: {

    periods: {
      required: true,
      type: Array
    },

    size: {
      type: String,
      default: 'small'
    },

    currentPeriod: {
      required: true,
      type: String
    }

  },

  data () {
    return {
      slicedPeriods: [],
      selectedIndex: -1,
      findedIndex: -1
    }
  },

  mounted () {
    this.findedIndex = this.periods.findIndex((val, index, arr) => {
      return val.period === this.currentPeriod
    })
    if (this.periods.length > 3) {
      if (this.findedIndex === this.periods.length - 1) {
        this.slicedPeriods =
          this.periods.slice(-3, this.periods.length)
      } else {
        if (this.findedIndex <= 2) {
          this.slicedPeriods = this.periods.slice(0, 3)
          this.$$classList('go-prev').add('disabled')
          this.$$classList('go-next').remove('disabled')
        } else {
          this.slicedPeriods =
            this.periods.slice(this.findedIndex - 2, this.findedIndex + 1)
          this.$$classList('go-next').remove('disabled')
        }
      }
    } else {
      this.$$classList('go-prev').add('disabled')
      this.slicedPeriods = this.periods
    }
    this.selectedIndex = this.findedIndex > 2
      ? 2
      : this.findedIndex % 3
  },

  filters: {
    periodFormat (val) {
      for (let dict of periodDict) {
        if (dict['value'] === val) {
          return dict['label']
        }
      }
      return '未发现'
    }
  },

  methods: {
    // 利用 ref 获取 classList
    $$classList (ref) {
      if (this.$refs[ref]) {
        return this.$refs[ref].classList
      }
      return null
    },

    // 礼让一小步
    goPrev () {
      if (this.$$classList('go-prev').contains('disabled')) {
        return
      }
      let index = this.periods.findIndex((val, idx, arr) => {
        return val === this.slicedPeriods[0]
      })
      if (index > 0) {
        this.$$classList('go-next').contains('disabled')
        ? this.$$classList('go-next').remove('disabled')
        : null
        if (index === 1) {
          this.$$classList('go-prev').add('disabled')
          this.slicedPeriods = this.periods.slice(0, 3)
        } else {
          this.slicedPeriods = this.periods.slice(index - 1, index + 2)
        }
      } else {
        if (index === 0) {
          this.$$classList('go-prev').add('disabled')
        }
      }
      this.selectedIndex =
        this.slicedPeriods.includes(this.periods[this.findedIndex])
          ? this.selectedIndex === -1
            ? 0
            : this.selectedIndex + 1
          : -1
    },

    // 文明一大步
    goNext () {
      if (this.$$classList('go-next').contains('disabled')) {
        return
      }
      let index = this.periods.findIndex((val, idx, arr) => {
        return val === this.slicedPeriods[this.slicedPeriods.length - 1]
      })
      if (index > 0) {
        this.$$classList('go-prev').contains('disabled')
        ? this.$$classList('go-prev').remove('disabled')
        : null
        if (index === this.periods.length - 2) {
          this.$$classList('go-next').add('disabled')
          this.slicedPeriods = this.periods.slice(-3, this.periods.length)
        } else {
          this.slicedPeriods = this.periods.slice(index - 1, index + 2)
        }
      }
      this.selectedIndex =
        this.slicedPeriods.includes(this.periods[this.findedIndex])
          ? this.selectedIndex === -1
            ? 2
            : this.selectedIndex - 1
          : -1
    },

    selectPeriod (index) {
      this.selectedIndex = index
      this.$emit('toggled', this.slicedPeriods[this.selectedIndex])
    }
  }
}
</script>

<style lang="scss" scoped>
.tab {
  user-select: none;

  .iconfont {
    font-weight: bold;
  }

  .tab--prev:hover, .tab--next:hover {
    color: #3da5fe;
    cursor: pointer;
  }

  .disabled {
    color: #e4e4e4;
    background: inherit;
    cursor: not-allowed;

    &:hover {
      cursor: not-allowed;
      color: #e4e4e4;
      background: inherit;
    }

  }

  .tab--content {
    list-style: none;
    padding: 0;
    vertical-align: top;
    display: inline-block;
    margin: 0;

    li {
      background: inherit;
      font-size: 1em;
      text-align: center;
      display: inline-block;
      width: 7em;
      cursor: pointer;
      padding-bottom: 5px;
      position: relative;
      border-bottom: 2px solid transparent;

      .icon-green {
        color: forestgreen;
      }

      .icon-red {
        color: red;
      }

      &::before {
        content: '';
        position: absolute;
        bottom: -3px;
        width: 50%;
        height: 2px;
        transform: translateX(10%) scaleX(0);
        background: #3da5fe;
        transition: 250ms;
      }

      &:hover::before {
        transform: translateX(10%) scaleX(1);
      }

      &.active {
        position: relative;
        color: #3da5fe;
        border-image: linear-gradient(to right,
          transparent 25%,
          #3da5fe 0,
          #3da5fe 75%,
          transparent 0) 2;
      }

      &.active:hover::before {
        transform: scaleX(0);
      }
    }
  }
}
</style>
