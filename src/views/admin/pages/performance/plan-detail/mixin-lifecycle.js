import reqMixin from './mixin-request'

export default {

  mixins: [reqMixin],

  created () {
    this.getData()
    this.allDetail = this.$parent.requestedData
    this.formatEmptyArray(this.allDetail)
  }

}
