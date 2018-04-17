export default {
  methods: {
    /**
     * 计算传入的对象数组中每一个 updateType !== '3' 的对象
     * 即未被删除的对象的权重的总和
     * @param {any} objArr
     * @returns Number
     */
    calculateInputed (...objArr) {
      let inputed = 0
      for (let i = 0; i < objArr.length; i++) {
        if (objArr[i].length > 0) {
          for (let x of objArr[i]) {
            if (x.updateType !== '3') {
              inputed += parseInt(x.weight)
            }
          }
        }
      }
      return inputed
    },

    /**
     * 计算传入的对象数组中每一个 updateType !== '3' 的对象
     * 即未被删除的对象的 evaluationLeaders 的权重总和
     * @param {any} objArr
     * @returns Object | Boolean
     */
    calculateLeaderInputed (...objArr) {
      let inputed = 0
      for (let i = 0; i < objArr.length; i++) {
        if (objArr[i].length > 0) {
          for (let x of objArr[i]) {
            if (x.updateType !== '3') {
              for (let y of x.evaluationLeaders) {
                if (!y.leaderName || y.leaderName === '') {
                  return {
                    'leaderEmpty': true,
                    'obj': x,
                    'type': i
                  }
                }
                if (!y.weight || y.weight === 0) {
                  return {
                    'weightEmpty': true,
                    'obj': x,
                    'type': i
                  }
                }
                inputed += y.weight
              }
              if (inputed !== 100) {
                return {
                  'leaderEmpty': false,
                  'weightEmpty': false,
                  'obj': x,
                  'type': i
                }
              } else {
                inputed = 0
              }
            }
          }
        }
      }
      return true
    },

    /**
     * 判断传入的对象数组中每一个 updateType !== '3' 的对象
     * 即未被删除的对象的权重是否为空或为0
     * @param {any} objArr
     * @returns Boolean
     */
    isWeightEmpty (...objArr) {
      if (objArr) {
        for (let obj of objArr) {
          for (let x of obj) {
            if (x.updateType !== '3') {
              if (!x.weight || x.weight === 0) {
                return true
              }
            }
          }
        }
      }
      return false
    },

    /**
     * 判断传入的对象数组中每一个 updateType !== '3' 的对象
     * 即未被删除的对象的权重是否为空或为0
     * @param {any} objArr
     * @returns Boolean
     */
    isTargetEmpty (...objArr) {
      if (objArr) {
        for (let obj of objArr) {
          for (let x of obj) {
            if (x.updateType !== '3' && x.evaluationType === '2') {
              if (!x.target || parseInt(x.target) === 0) {
                return true
              }
            }
          }
        }
      }
      return false
    },

    /**
     * 判断传入的对象数组中每一个 updateType !== '3' 的对象
     * 即未被删除的对象的 indicatorName 是否为空
     * @param {any} objArr
     * @returns Boolean
     */
    isNameEmpty (type, ...objArr) {
      if (objArr) {
        for (let obj of objArr) {
          if (obj.length > 0) {
            for (let x of obj) {
              if (x.updateType !== '3') {
                if (!(x[type] &&
                  !(/^\s+$/.test(x[type])))) {
                  return true
                }
              }
            }
          }
        }
        return false
      }
    },

    /**
     * 判断传入的对象数组中每一个 updateType !== '3' 且 evaluationType === '2'的对象
     * 即未被删除的对象的数据收集员是否为空
     * @param {any} objArr
     * @returns Boolean
     */
    isCollectorEmpty (...objArr) {
      if (objArr) {
        for (let obj of objArr) {
          for (let x of obj) {
            if (x.updateType !== '3' && x.evaluationType === '2') {
              if (!x.collectorId || !x.collectManagerId) {
                return true
              }
            }
          }
        }
      }
      return false
    }
  }
}
