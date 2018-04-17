<script>
    import { getSelectData } from 'utils'

    export default {
      name: 'DictShow',
      render (h) {
        return <div>{this.showText}</div>
      },
      props: {
        // 字典编号
        parameter: {
          type: String
        },
        // 数据类型，目前只支持字典
        dataKey: {
          type: String,
          default: 'dict'
        },
        // 是否异步， 值为true时异步请求， 值为false时则直接拿取传入的options对应的值
        async: {
          type: Boolean,
          default: true
        },
        // 绑定的数据值
        value: null,
        // 用于自定义的数据集,当async为false时才会调用
        options: Array,
        // 用于对自定义的数据集时行取值
        props: {
          type: Object,
          // 数组及对象默认值应由工厂函数返回
          default () {
            return {
              label: 'label',
              value: 'value'
            }
          }
        }
      },
      data () {
        return {
          // 要显示的文本
          showText: ''
        }
      },
      watch: {
        parameter (val) {
          val && this.init(val)
        },
        value (val) {
          val && this.init(val)
        }
      },
      created () {
        this.init()
      },
      methods: {
        init (val) {
          // 当async为true, 异步调取字典值; 当async为false, 获取options对应的值
          this.async ? this.getDictData() : this.getOptionsData()
        },
        handlerUrl () {
          return window.globalComponentVariable.iSelect[this.dataKey].url(this.parameter)
        },
        getIsCache () {
          return window.globalComponentVariable.iSelect[this.dataKey].isCache
        },
        getDictData () {
          let url = this.handlerUrl()
          // isCache为true时,有两个作用： 1. 先找sessionStore里是否有 2. 如果sessionStore里面没有, 拿到数据后写时sessionStore
          const isCache = this.getIsCache()
          getSelectData(url, isCache).then(data => {
            this.getShowText(data)
          })
        },
        getOptionsData () {
          this.getShowText(this.options)
        },
        getShowText (data) {
          this.showText = data.reduce((val, item) => {
            return item[this.props.value] === this.value ? (val = item[this.props.label]) : val
          }, '')
        }
      }
    }
</script>

