<template>
  <footer class="i-footer">
    <div class="content">
      <nav>
        <a class="link-item"
          v-for="(item, index) of list"
          :key="index"
          :href="item.href"
          target="_blank"
        >
          {{ item.title }}
        </a>
      </nav>
      <p class="copyright">{{ copyright }}</p>
    </div>
  </footer>
</template>

<script>
export default {
  data () {
    return {
      list: [
        // { title: '永辉简介', href: '/self_service' },
        // { title: '永辉文化', href: '/self_service' },
        // { title: '永辉历程', href: '/self_service' },
        { title: '掌上永辉下载地址', href: 'https://zsyh.yonghui.cn/download/pcv4.html' }
        // { title: '法律声明', href: '/self_service' }
      ],
      copyright: 'Copyright © 深圳美云智数科技有限公司 版权所有'
    }
  }
}
</script>

<style lang="scss" scoped>
.i-footer {
  width: 100%;
  height: 80px;
  background: #efefef;
  display: flex;
  // margin-top: 60px;
  justify-content: center;
  align-items: center;

  .content {
    color: #333;
    text-align: center;
    font: {
      font-family: Microsoft YaHei;
      font-size: 12px;
      color: #333333;
      letter-spacing: -0.29px;
    }
    nav {
      margin-bottom: 10px;
      padding: 0 7px;
      a + a {
        &:before {
          content: ' | '
        }
      }
    }
    .copyright{
      opacity: 0.4;
      font-family: Microsoft YaHei;
      font-size: 12px;
      color: #333333;
    }
  }
}

.link-item {
  cursor: pointer;
  &+.link-item {
    // &:before {
    //   content: '|'
    // }
  }
}
</style>
