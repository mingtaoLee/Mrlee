import proxy from '../../../config/proxy'
import config from './config'
export default {
  data () {
    return {
      accessMap: {}
    }
  },
  created () {
    let data
    for (let ele in proxy) {
      data = (!proxy[ele].changeOrigin || proxy[ele].authorization) ? config : this.getAccessListByHash()
    }
    data.forEach(ele => {
      this.$set(this.accessMap, ele, true)
    })
  },
  methods: {
    getAccessListByHash () {
      // let path = this.$route.path
      // let params = this.$route.params
      // for (let pa in params) {
      //   path = path.replace(params[pa], ':' + [pa])
      // }
      // return this.$store.state.access.allAccessMap[path] || []
      return this.$store.state.access.accessList || []
    }
  }
}
