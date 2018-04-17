/* eslint-disable */
export const RULES = {
  // 银行卡号校验
  bankNumber (rule, value, cb) {
    var value = value.replace(/\s/g, '')
    if (value == '') {
      cb(new Error('银行卡号不能为空'))
      return false
    }
    if (value.length < 12 || value.length > 20) {
      cb(new Error('银行卡号长度必须在12到20之间'))
      return false
    }
    var num = /^\d*$/ // 全数字
    if (!num.exec(value)) {
      cb(new Error('银行卡号必须全为数字'))
      return false
    }
    // 开头6位
    var strBin =
      '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
    if (strBin.indexOf(value.substring(0, 2)) == -1) {
      cb(new Error('银行卡号开头6位不符合规范'))
      return false
    }
    // Luhn校验
    if (!luhnCheck(value)) {
      cb(new Error('银行卡号校验不通过'))
      return false
    }
    cb()
    return true
  },
  // 身份证号
  idNumber (rule, value, cb) {
    let city = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江 ",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北 ",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏 ",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外 "
    }

    let temp = value.replace(/\s+/g,'')

    !temp && cb(new Error('证件号码不能为空'))
    let processType = that.$route.query.processType
    let pass = true
    let isId = this.hireInfo.empEmployeeEmpContacts.idType === '1'
    if (temp) {
      if (!value ||
        !/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
          value) && isId) {
        pass = false
        cb(new Error("证件号码格式错误"))
      } else if (!city[value.substr(0, 2)] && isId) {
        pass = false
        cb(new Error("地址编码错误"))
      } else if (value.length == 18 && isId) {
        const idNumber = value
        value = value.split('')
        let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
        let sum = 0
        let ai = 0
        let wi = 0
        for (let i = 0; i < 17; i++) {
          ai = value[i]
          wi = factor[i]
          sum += ai * wi
        }
        let last = parity[sum % 11]
        if (parity[sum % 11] != value[17]) {
          pass = false
          console.log(value, parity[sum % 11], value[17])
          value[17] === 'x' ? cb(new Error("校验位x必须要大写")) : cb(
            new Error("校验位错误"))
        }
      }
      pass && cb()
    }
  }
}

function luhnCheck (bankno) {
  var lastNum = bankno.substr(bankno.length - 1, 1) // 取出最后一位（与luhn进行比较）

  var first15Num = bankno.substr(0, bankno.length - 1) // 前15或18位
  var newArr = new Array()
  for (var i = first15Num.length - 1; i > -1; i--) {
    // 前15或18位倒序存进数组
    newArr.push(first15Num.substr(i, 1))
  }
  var arrJiShu = new Array() // 奇数位*2的积 <9
  var arrJiShu2 = new Array() // 奇数位*2的积 >9

  var arrOuShu = new Array() // 偶数位数组
  for (var j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 == 1) {
      // 奇数位
      if (parseInt(newArr[j]) * 2 < 9) { arrJiShu.push(parseInt(newArr[j]) * 2) } else arrJiShu2.push(parseInt(newArr[j]) * 2)
    } else arrOuShu.push(newArr[j]) // 偶数位
  }

  var jishu_child1 = new Array() // 奇数位*2 >9 的分割之后的数组个位数
  var jishu_child2 = new Array() // 奇数位*2 >9 的分割之后的数组十位数
  for (var h = 0; h < arrJiShu2.length; h++) {
    jishu_child1.push(parseInt(arrJiShu2[h]) % 10)
    jishu_child2.push(parseInt(arrJiShu2[h]) / 10)
  }

  var sumJiShu = 0 // 奇数位*2 < 9 的数组之和
  var sumOuShu = 0 // 偶数位数组之和
  var sumJiShuChild1 = 0 // 奇数位*2 >9 的分割之后的数组个位数之和
  var sumJiShuChild2 = 0 // 奇数位*2 >9 的分割之后的数组十位数之和
  var sumTotal = 0
  for (var m = 0; m < arrJiShu.length; m++) {
    sumJiShu = sumJiShu + parseInt(arrJiShu[m])
  }

  for (var n = 0; n < arrOuShu.length; n++) {
    sumOuShu = sumOuShu + parseInt(arrOuShu[n])
  }

  for (var p = 0; p < jishu_child1.length; p++) {
    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p])
    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p])
  }
  // 计算总和
  sumTotal =
    parseInt(sumJiShu) +
    parseInt(sumOuShu) +
    parseInt(sumJiShuChild1) +
    parseInt(sumJiShuChild2)

  // 计算luhn值
  var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10
  var luhn = 10 - k

  if (lastNum == luhn) {
    return true
  } else {
    return false
  }
}
