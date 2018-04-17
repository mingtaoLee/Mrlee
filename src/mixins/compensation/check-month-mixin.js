import moment from 'moment'
export default {
  data () {
    return {
      checkMonthOptions: {
        disabledDate: (time) => {
          return time.getTime() > moment().startOf('month').valueOf()
        }
      }
    }
  }
}
