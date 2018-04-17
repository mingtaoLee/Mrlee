<template>
  <div class="progress">
    <p class="title">待办类</p>
    <ul class="progress-list">
      <li
        v-for="(item, index) in pendingList"
        :key="index"
        :class="{bgActive: isActive == index}"
        @mousemove="isActive = index"
        >
        <router-link
          v-if="item.contents.size !== 0
            && (item.itemCode === '3'
            || item.itemCode === '4')"
          :to="item.itemCode === '3'
            ? '/performance/todo/collect'
            : '/performance/todo/check'">
          <a target="_blank">
            {{ item.itemCode | itemCodeFilter}}
          </a>
        </router-link>
        <a v-else @click="goPlanDetail(item)">
          {{ item.itemCode | itemCodeFilter}}
        </a>
        <span class="active circle" v-if="item.contents.size">{{item.contents.size}}</span>
      </li>
    </ul>
    <hr>
    <div class="record-group">
      <p class="title">记录类</p>
      <p>
        <router-link to="/performance/history/performance">绩效计划记录</router-link>
      </p>
      <p>
        <router-link to="/performance/history/indicator">指标数据记录</router-link>
      </p>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      size="large">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'choose',
    props: {
      pendingList: {
        type: Array,
        default: [{
          label: 'test',
          value: 0
        }]
      }
    },
    filters: {
      itemCodeFilter (status) {
        const itemCodeMap = {
          1: '待制定绩效计划',
          2: '待审核绩效计划',
          3: '待收集绩效指标',
          4: '待审核指标数据',
          5: '待自评绩效',
          6: '待复评绩效',
          7: '待确认评分'
        }
        return itemCodeMap[status]
      }
    },
    data () {
      return {
        nowIndex: 0,
        dialogVisible: false,
        isActive: ''
      }
    },
    methods: {
      goPlanDetail (item) {
        if (item.contents.size === 1) {
          // item.itemCode === '3' || item.itemCode === '4'
          //   ? item.itemCode === '3'
          //     ? this.$router.push('/performance/todo/collect')
          //     : this.$router.push('/performance/todo/check')
          //   :
          window.open(this.$router.resolve(`performance/${item.contents.planId}/plan_detail`).href, '_blank')
        } else if (item.contents.size > 1) {
          switch (item.itemCode) {
            case '1': {
              window.open(this.$router.resolve('/performance/todo/make').href, '_blank')
              break
            }
            case '2':
              window.open(this.$router.resolve('/performance/todo/audit').href, '_blank')
              break
            // case '3':
            //   this.$router.push('/performance/todo/collect')
            //   break
            // case '4':
            //   this.$router.push('/performance/todo/check')
            //   break
            case '5':
              window.open(this.$router.resolve('/performance/todo/selfrating').href, '_blank')
              break
            case '6':
              window.open(this.$router.resolve('/performance/todo/review').href, '_blank')
              break
            case '7':
              window.open(this.$router.resolve('/performance/todo/confirm').href, '_blank')
              break
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .progress {
    padding-top: 26px;
    padding-left: 15px;
    .title {
      margin-bottom: 22px;
      font-size: 14px
    }
    .bgActive {
      line-height: 36px;
      height: 36px;
      background-color: #F1F3F6;
      color: #3DA5FE;
      cursor: pointer;
    }
    hr {
      background-color: #E8E8E8;
      height: 1px;
      border: #E8E8E8;
      margin-top: 15px
    }
    li {
      padding-left: 21px;
      // margin-top: -15px;
      font-size: 14px;
      line-height: 36px;
      height: 36px;
      + li {
        // margin-top: 18px;
      }
      span {
        display: inline-block;
        vertical-align: middle;
      }
      .circle {
        text-align: center;
        color: #FFFFFF;
        line-height: 19px;
        font-size: 10px;
        width: 19px;
        height: 19px;
        border-radius: 50%;
        margin-right: 5px;
        margin-top: -15px
      }
    }
    .active {
      background-color: #FF6464;
    }
    .record-group {
      margin-top: 30px;
      font-size: 14px;
      color: #4D4D4D;
      p + p {
        margin-top: 13px;
        margin-left: 15px;
      }
    }
  }
</style>
