<template>
  <div class="zzf-salary-sheet-preview">
    <h2>工资条预览</h2>
    <div class="content">
      <template v-for="sort of data.payslipItemInfoDtos">
        <div class="item mb10">
          <div class="item-title">
            <h3>{{sort.payslipItemType}}</h3>
            <div>
              <span class="item-title__total">+0.00</span>
              <el-button :class="['collapse-icon', {'icon-rotate': sort.isShow}]" type="text" icon="arrow-down" @click="handleCollapse(sort)"></el-button>
            </div>
          </div>
          <el-collapse-transition>
            <ul class="item-content" v-show="sort.isShow">
              <template v-for="item of sort.payPayslipItemCategoryInfoDtos">
                <li class="item-content__item">
                  <span>{{item.displayName || item.componentName}}</span>
                  <span class="item-content__item-total">+0.00</span>
                </li>
              </template>
            </ul>
          </el-collapse-transition>
        </div>
      </template>
      <div class="line"></div>
      <div class="item mt10">
        <div class="item-title mr50">
          <h3>实发合计</h3>
          <span class="item-title__total theme">+0.00</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: '',
    props: {
      data: Object
    },
    components: {},
    data: function () {
      return {
        isShow: false
      }
    },
    watch: {
      'data.payslipItemInfoDtos': {
        handler (value) {
          if (value) this.transformData(value)
        }
      }
    },
    created () {
      this.transformData(this.data.payslipItemInfoDtos)
    },
    methods: {
      handleCollapse (sort) {
        sort.isShow = !sort.isShow
      },
      /** 处理数据结构，新增isShow属性 */
      transformData (value) {
        value.map(item => {
          this.$set(item, 'isShow', true)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  %space-between {
    display: flex;
    justify-content: space-between;
  }

  .mr50 {
    margin-right: 34px;
  }

  .content {
    padding: 20px;
    background: white;
  }

  .item {
  }

  .collapse-icon {
    width: 30px;
    text-align: right;
  }

  .item-title {
    line-height: 30px;
    @extend %space-between
  }

  .item-title__total {
    font-size: 14px;
    font-weight: 600;
  }

  h2 {
    line-height: 50px;
    font-size: 14px;
    font-weight: 600;
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
  }

  .item-content {
    padding-left: 20px;
  }

  .item-content__item {
    padding-right: 34px;
    line-height: 24px;
    @extend %space-between
  }

  .item-content__item-total {
    display: inline-block;
  }
</style>
<style lang="scss">
  .zzf-salary-sheet-preview {
    .icon-rotate {
      transition: 0.3s;
      .el-icon-arrow-down {
        transform: rotate(180deg);
      }
    }
  }
  .line {
    height: 1px;
    background-color: black;
  }
</style>
