const data = require('./mock-data')
import UserCard from './user-card'
import PendingTrialCard from './pending-trial-card'
import IconList from './icon-list'
import MineList from './mine-list'
import TaskList from './task-list'
import NoticeList from './notice-list'
import FeatureCard from './feature-card'
// import req from 'api/self/home'
export default {
  data () {
    return {
      ...data,
      // arrData: [],
      arrData: [{name: 'user', order: 0}, {name: 'pending', order: 1}, {name: 'notice'}, {name: 'task'}],
      arrId: []
    }
  },
  created () {
    this.moduleOrder()
  },
  render (h) {
    let arr = {
      user: <user-card user={this.user}></user-card>,
      pending: <pending-trial-card></pending-trial-card>,
      notice: <notice-list></notice-list>,
      task: <task-list task={this.task}/>
    }
    let arrs = this.arrData.map(item => {
      return arr[item.name]
    })
    let template =
                    <div class="self-service">
                      <main class="self-main">
                        <header class="header-first flex-space-between">
                            {arrs[0]}
                            {arrs[1]}
                        </header>
                          <feature-card></feature-card>
                        <aside class="flex-space-between">
                          {arrs[2]}
                          {arrs[3]}
                        </aside>
                      </main>
                    </div>
    return template
  },
  components: {
    UserCard,
    PendingTrialCard,
    IconList,
    MineList,
    TaskList,
    NoticeList,
    FeatureCard
  },
  methods: {
    moduleOrder () {
      // req('getSelfHomePlate').then(res => {
      //   console.log(res)
      //   this.arrDate = res
      // })
    }
  }

}

