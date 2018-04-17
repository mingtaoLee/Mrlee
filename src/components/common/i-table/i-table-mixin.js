// validate: {
//   req,
//   api: 'postRoster'
// }

export default {
  created () {
    const { $parent: parent = {} } = this
    const { validate } = parent.$options

    if (validate) {
      const { req, api } = validate

      return req(api).then((res = {}) => {
        parent.validate = res
        // this.$set(parent, 'validate', res)
        console.log(parent)
      })
    }
  }
}
