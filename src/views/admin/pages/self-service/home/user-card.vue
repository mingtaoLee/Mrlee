<template>
  <section class="card user-card">
    <figure v-if="user">
      <div class="picture">
        <img :src="user.picture" alt="">
      </div>
      <figcaption>
        <h4 class="name">{{ user.name }}</h4>
        <p class="job">{{ user.job }}</p>
        <ul class="info">
          <li>
            <p>司龄：<span>{{ user.age }}年</span></p>
          </li>
          <li>
            <p>生日：<span>{{ user.birth | birthFormat }}</span></p>
          </li>
        </ul>
        <p class="birth">
          公司里还有 <span>{{ user.sameBirthday }}</span> 位亲跟我同一天生日
          <i class="iconfont icon-linear-arrow-right"></i>
        </p>
      </figcaption>
    </figure>
  </section>
</template>

<script>
export default {
  props: ['user'],
  filters: {
    birthFormat (val) {
      return val.replace(/-/, '月') + '日'
    }
  }
}
</script>

<style lang="scss" scoped>
$icon-size: 12px;

.user-card {
  width: 480px;
  height: 389px;
  text-align: center;

  figure {
    margin: 0;
  }

  .picture {
    width: 130px;
    height: 130px;
    margin: 33px auto 25px;
    overflow: hidden;
    border-radius: 50%;
    img {
      width: 100%;
    }
  }

  figcaption {
    font-family: 'PingFangSC Regular';

    .name {
      color: #000000;
      line-height: 24px;
      font: {
        family: 'Microsoft YaHei';
        size: 18px;
        weight: 800;
      }
    }
    .job {
      margin-top: 12px;
      color: #333333;
      font-size: 14px;
    }
    .info {
      margin-top: 22px;
      color: #989898;
      font-size: 16px;
      li {
        display: inline-block;
        span {
          color: #000000;
        }
      }
      li + li {
        margin-left: 19px;
      }
    }
    .birth {
      margin-top: 43px;
      font-size: 12px;
      color: #989898;
      span {
        color: #56AFFB;
      }

      .iconfont {
        font-size: 12px;
      }
    }
  }
}
</style>
