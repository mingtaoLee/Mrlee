/**
 * Created by Younh on 2017/12/9.
 */
import calMap from './cal-map'
// import req from 'api/compensation/base-setting/formula-calculator'
export default {
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    removeArrEmptyStr (arr) {
      return arr.filter(v => v !== '')
    },
    functionLabelConvertToValue (label, treeNodeData) {
      let labelArr = this.removeArrEmptyStr(label.trim().split(' '))
      // let newArr = []
      ;(treeNodeData.functions.length > 0) && labelArr.forEach((v, i) => {
        treeNodeData.functions.forEach(item => {
          // if (v.match(/^F_\S+\(\S+\)$/)) {
          if (v.match(/^F_/)) {
            let splitArr = v.split('(')
            if (splitArr.length > 2) {
              if (v.match(item.name.split('(')[0])) {
                // console.log(item.name.split('(')[0])
                labelArr[i] = v.replace(new RegExp(item.name.split('(')[0], 'g'), item.formula.split('(')[0])
              }
            } else {
              if (splitArr[0] === 'F_' + item.name.split('(')[0]) {
                let matched = v.match(/\((.*)\)/g)
                if (matched) {
                  if (!item.formula) {
                    throw new Error('函数公式匹配失败，请检查公式(F_ 开头)是否存在。')
                  }
                  labelArr[i] = 'F_' + item.formula.replace(/\((.*)\)/g, matched[0])
                  // newArr.push(item.formula.replace(/\(\S+\)/, matched[0]))
                  // console.log('v', item.formula.replace(/\(\S+\)/, matched[0]), item.formula, v)
                }
              }
            }
          }
        })
      })
      ;(treeNodeData.compensation.length > 0) && labelArr.forEach((v, i) => {
        treeNodeData.compensation.forEach(item => {
          let name = item.name.replace(/(\+|-|\(|\))/g, '\\\\$&')
          let reg = new RegExp('CV_' + name, 'g')
          if (v.match(reg)) {
            labelArr[i] = v.replace(reg, 'CV_' + item.id)
          }
        })
      })
      console.log('transfer:', labelArr)
      return labelArr
    },
    valueConvertToLabel (value) {
      const arr = value.slice(0)
      return arr.join(' ')
    },
    labelConvertToValue (label, currentNodeData) {
      let text = label
      if (currentNodeData && currentNodeData.label) {
        if (currentNodeData.label.match('F_')) {
          text = text.replace(new RegExp(currentNodeData.label, 'g'), currentNodeData.value)
        } else {
          text = text.replace(new RegExp(currentNodeData.label, 'g'), currentNodeData.value)
        }
      }
      let arr = text.trim().split(' ')
      arr.forEach((v) => {
        if (v === calMap.button.v || v === calMap.tree.v) {
          v = calMap.button.v.value
        }
      })
      return arr
    }
  }
}
