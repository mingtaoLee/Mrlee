/**
 * Created by Younh on 2017/12/9.
 */
export default {
  data () {
    return {
    }
  },
  methods: {
    convertRangeText (list) {
      let str = ''
      const employeeRangeList = list
      const posTitleNameArr = []
      const orgUnitNameArr = []
      employeeRangeList && employeeRangeList.forEach(v => {
        if (v.posTitleName) {
          posTitleNameArr.push(v.posTitleName)
        } else if (v.orgUnitName) {
          orgUnitNameArr.push(v.orgUnitName)
        }
      })
      str = `组织=[${orgUnitNameArr.toString()}]\n职务=[${posTitleNameArr.toString()}]`
      return str
    }
  }
}
