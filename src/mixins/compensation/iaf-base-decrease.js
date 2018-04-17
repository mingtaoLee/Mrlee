export default {
  data () {
    return {
      iafInfo: {
        idNumber: '', // 身份证号
        fullName: '', // 姓名
        operateType: '', // 操作类型
        orgUnitName: '', // 组织
        positionName: '', // 职位
        mobile: '', // 电话
        age: '', // 年龄
        gender: '', // 性别
        domicilePlace: '', // 户口所在地
        domicileType: '', // 户口性质
        domicileGrade: '', // 户口级别
        personalArea: '', // 人事范围
        employeeCode: '', // 工号
        effectiveDate: null, // 生效日期
        isCompPayEmp: '', // 单位支付个人部分
        empPaySupplyment: '', // 个人补充公积金
        reason: '',
        applyType: '', // 申请类型
        insuranceCity: '', // 参保城市

        insuranceAreaId: '', // 五险购买区域ID
        hpfundAreaId: '', // 公积金购买区域ID

        endowmentAccountName: '', // 养老参保户头
        endowmentCompPayBase: '', // 养老单位基数
        endowmentEmpPayBase: '', // 养老个人基数
        endowmentAccountPersonalCode: '', // 养老个人号码
        endowmentAreaCode: '', // 养老参保城市

        medicareAccountName: '', // 医疗参保户头
        medicareCompPayBase: '', // 医疗单位基数
        medicareEmpPayBase: '', // 医疗个人基数
        medicareAccountPersonalCode: '', // 医疗个人号码
        medicareAreaCode: '', // 医疗参保城市

        unemploymentAccountName: '', // 失业参保户头
        unemploymentCompPayBase: '', // 失业单位基数
        unemploymentEmpPayBase: '', // 失业个人基数
        unemploymentAccountPersonalCode: '', // 失业个人号码
        unemploymentAreaCode: '', // 失业参保城市

        employmentInjuryAccountName: '', // 工伤参保户头
        employmentInjuryCompPayBase: '', // 工伤单位基数
        employmentInjuryEmpPayBase: '', // 工伤个人基数
        employmentInjuryAccountPersonalCode: '', // 工伤个人号码
        employmentInjuryAreaCode: '', // 工伤参保城市

        maternityAccountName: '', // 生育参保户头
        maternityCompPayBase: '', // 生育单位基数
        maternityEmpPayBase: '', // 生育个人基数
        maternityAccountPersonalCode: '', // 生育个人号码
        maternityAreaCode: '', // 生育参保城市

        hpfundAccountName: '', // 公积金参保户头
        hpfundCompPayBase: '', // 公积金单位基数
        hpfundEmpPayBase: '', // 公积金个人基数
        hpfundAccountPersonalCode: '', // 公积金个人号码
        hpfundAreaCode: '' // 公积金参保城市

      },
      benchmarks: {
        endowmentEmpPayBaseLimit: '',
        endowmentEmpPayBaseLower: '',
        endowmentEmpPayRatio: '',
        endowmentCompPayBaseLimit: '',
        endowmentCompPayBaseLower: '',
        endowmentCompPayRatio: '',
        unemploymentEmpPayBaseLimit: '',
        unemploymentEmpPayBaseLower: '',
        unemploymentEmpPayRatio: '',
        unemploymentCompPayBaseLimit: '',
        unemploymentCompPayBaseLower: '',
        unemploymentCompPayRatio: '',
        medicareEmpPayBaseLimit: '',
        medicareEmpPayBaseLower: '',
        medicareEmpPayRatio: '',
        medicareCompPayBaseLimit: '',
        medicareCompPayBaseLower: '',
        medicareCompPayRatio: '',
        employmentInjuryEmpPayBaseLimit: '',
        employmentInjuryEmpPayBaseLower: '',
        employmentInjuryEmpPayRatio: '',
        employmentInjuryCompPayBaseLimit: '',
        employmentInjuryCompPayBaseLower: '',
        employmentInjuryCompPayRatio: '',
        maternityEmpPayBaseLimit: '',
        maternityEmpPayBaseLower: '',
        maternityEmpPayRatio: '',
        maternityCompPayBaseLimit: '',
        maternityCompPayBaseLower: '',
        maternityCompPayRatio: '',
        hpfundEmpPayBaseLimit: '',
        hpfundEmpPayBaseLower: '',
        hpfundEmpPayRatio: '',
        hpfundCompPayBaseLimit: '',
        hpfundCompPayBaseLower: '',
        hpfundCompPayRatio: '',
        supplyMedicareCompPayBaseLower: '',
        supplyMedicareEmpPayBaseLower: '',
        supplyEmployeeInjuryCompPayBaseLower: '',
        supplyEmployeeInjuryEmpPayBaseLower: '',
        supplyMedicareCompPayBaseLimit: '',
        supplyMedicareEmpPayBaseLimit: '',
        supplyEmployeeInjuryCompPayBaseLimit: '',
        supplyEmployeeInjuryEmpPayBaseLimit: '',
        supplyEmployeeInjuryCompPayRatio: '',
        supplyEmployeeInjuryEmpPayRatio: '',
        supplyMedicareCompPayRatio: '',
        supplyMedicareEmpPayRatio: ''
      }
    }
  },
  methods: {
    /**
     * 校验工号后再获取基本信息
     * @param {Function} customValidator 自定义校验（例如增员流程有是否可增员校验)
     */
    validateAndGetBaseInfo (customValidator) {
      if (!this.iafInfo.employeeCode) return

      return this.validateEmpCode()
      .then(() => {
        return typeof customValidator === 'function'
        ? customValidator()
        : Promise.resolve()
      })
      .then(() => this.getPersonalInfo())
      .then(() => {
        if (this.taskKey === 'undefined') return this.getBenchmark()
      })
    },

    /**
     * 校验工号有效性
     */
    validateEmpCode () {
      return this.$store.dispatch('VALIDATE_EMPCODE', this.iafInfo.employeeCode)
      .catch(err => {
        this.$message({
          type: 'error',
          message: err
        })
        return Promise.reject(err)
      })
    },

    /**
     * 获取基本信息
     */
    getPersonalInfo () {
      return this.$store.dispatch('GET_IAFBASEPERSONALINFO', this.iafInfo.employeeCode)
      .then(data => {
        this.iafInfo = data
      })
      .catch(() => {
        Object.keys(this.iafInfo).forEach(key => {
          if (key !== 'employeeCode') this.iafInfo[key] = ''
        })
        Object.keys(this.iafInfo).forEach(item => {
          this.iafInfo[item] = ''
        })
        this.loading = false
        return Promise.reject()
      })
    },
    /**
     *  通过areaId得到参保地中文名
     */
    getCityName ({areaId}) {
      if (!sessionStorage.getItem('ALL_ADMINISTRATIVE_REGIONS')) return

      let allCity = JSON.parse(sessionStorage.getItem('ALL_ADMINISTRATIVE_REGIONS'))
      this.getAreaName(allCity, areaId, this.iafInfo.insuranceCity)
    },
    /**
     * 递归获取参保地
     * @param {*} allCity 所有参保城市
     * @param {*} areaId  参保id
     * @param {*} areaName 参保名称
     */
    getAreaName (allCity, areaId, areaName = '') {
      if (areaId === 'root') {
        this.iafInfo.insuranceCity = areaName.replace('中国', '')
        return
      }
      allCity.forEach(item => {
        if (item.areaId === areaId) {
          areaName = item.areaName + areaName
          this.getAreaName(allCity, item.parentAreaId, areaName)
        }
      })
    },
    // /**
    //  * 判断基数是否为空，如果为空不显示此险种
    //  */
    // canShowInsuranceType (data) {
    //   for (let item of this.typeAll) {
    //     if (!data[item + 'AccountName']) {
    //       this.canAddInsuranceType.indexOf(item) > -1 && this.canAddInsuranceType.splice(this.canAddInsuranceType.indexOf(item), 1)
    //     }
    //   }
    //   this.canAddInsuranceTypeNumber = this.canAddInsuranceType.length
    //   !this.canAddInsuranceTypeNumber && this.$message.warning('该员工无险种可发起流程')
    // },
    // /**
    //  * 通过后端返回的数据获取可减员的险种
    //  * @param {*} data
    //  */
    // canInsuranceType (data) {
    //   this.canAddInsuranceType = []
    //   this.selectedInsuranceType = []
    //   Object.keys(data).map(item => {
    //     if (data[item]) {
    //       Object.keys(this.insuranceType).forEach(type => {
    //         this.insuranceType[type] === item && this.canAddInsuranceType.push(this.insuranceType[type])
    //       })
    //       this.canAddInsuranceTypeNumber = this.canAddInsuranceType.length
    //     }
    //   })
    // },
    /**
     * 测试权限key
     */
    testKey () {
      let i = 0
      for (let key in this.accessMap) {
        !Object.keys(this.accessKey).includes(key) && i++ && console.log(this.accessKey[key], i)
      }
      !i && console.log('key全部拿到')
      i && console.log(`共${i}个key没拿到`)
    }
  }
}
