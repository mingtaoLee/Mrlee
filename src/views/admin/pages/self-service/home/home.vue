<template>
  <div class="self-service">
    <self-header :waiting-for-handle-info-number="waitingForHandleInfoNumber"></self-header>

    <main class="self-main container">
      <header>
        <user-card :user="user"/>
        <gallery-card :gallery="gallery"/>
      </header>

      <icon-list></icon-list>
      <mine-list></mine-list>

      <aside>
        <task-list :task="task"/>
        <notice-list :notice="notice"/>
      </aside>
    </main>

    <i-footer></i-footer>
  </div>
</template>

<script>
const data = require('./mock-data')

import SelfHeader from 'components/common/i-header/i-header'
import UserCard from './user-card'
import GalleryCard from './gallery-card'
import IconList from './icon-list'
import MineList from './mine-list'
import TaskList from './task-list'
import NoticeList from './notice-list'
import IFooter from 'components/common/i-footer/i-footer'
import req from 'api/common/home'

export default {
  data () {
    return {
      ...data,
      // 代办消息条数
      waitingForHandleInfoNumber: ''
    }
  },
  components: {
    SelfHeader,
    UserCard,
    GalleryCard,
    IconList,
    MineList,
    TaskList,
    NoticeList,
    IFooter
  },
  methods: {
    // 获取代办消息条数
    getCountUserTodo () {
      req('getCountUserTodo')
      .then(res => {
        this.waitingForHandleInfoNumber = res
      })
    }
  },
  created () {
    this.getCountUserTodo()
  }
}
</script>

<style lang="scss" scoped>
$self-header-height: 70px;

.self-service {
  background: #F8F8F8;

  .self-main {
    margin-top: $self-header-height;
    aside, header {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    header {
      padding-top: 20px;
    }
  }
}
</style>
