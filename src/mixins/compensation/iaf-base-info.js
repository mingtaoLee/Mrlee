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
        endowmentEmployeeId: '', // 养老户头专员

        medicareAccountName: '', // 医疗参保户头
        medicareCompPayBase: '', // 医疗单位基数
        medicareEmpPayBase: '', // 医疗个人基数
        medicareAccountPersonalCode: '', // 医疗个人号码
        medicareAreaCode: '', // 医疗参保城市
        medicareEmployeeId: '', // 医疗户头专员

        unemploymentAccountName: '', // 失业参保户头
        unemploymentCompPayBase: '', // 失业单位基数
        unemploymentEmpPayBase: '', // 失业个人基数
        unemploymentAccountPersonalCode: '', // 失业个人号码
        unemploymentAreaCode: '', // 失业参保城市
        unemploymentEmployeeId: '', // 失业户头专员

        employmentInjuryAccountName: '', // 工伤参保户头
        employmentInjuryCompPayBase: '', // 工伤单位基数
        employmentInjuryEmpPayBase: '', // 工伤个人基数
        employmentInjuryAccountPersonalCode: '', // 工伤个人号码
        employmentInjuryAreaCode: '', // 工伤参保城市
        employmentInjuryEmployeeId: '', // 工伤户头专员

        maternityAccountName: '', // 生育参保户头
        maternityCompPayBase: '', // 生育单位基数
        maternityEmpPayBase: '', // 生育个人基数
        maternityAccountPersonalCode: '', // 生育个人号码
        maternityAreaCode: '', // 生育参保城市
        maternityEmployeeId: '', // 生育户头专员

        hpfundAccountName: '', // 公积金参保户头
        hpfundCompPayBase: '', // 公积金单位基数
        hpfundEmpPayBase: '', // 公积金个人基数
        hpfundAccountPersonalCode: '', // 公积金个人号码
        hpfundAreaCode: '', // 公积金参保城市
        hpfundEmployeeId: '', // 公积金户头专员

        supplyEmployeeInjuryAccountName: '', // 补充工伤参保户头
        supplyEmployeeInjuryCompPayBase: '', // 补充工伤单位基数
        supplyEmployeeInjuryEmpPayBase: '', // 补充工伤个人基数
        supplyEmployeeInjuryAccountPersonalCode: '', // 补充工伤个人号码
        supplyEmployeeInjuryAreaCode: '', // 补充工伤参保城市
        supplyEmployeeInjuryEmployeeId: '', // 补充工伤户头专员

        supplyMedicareAccountName: '', // 大病补医保参保户头
        supplyMedicareCompPayBase: '', // 大病补医保单位基数
        supplyMedicareEmpPayBase: '', // 大病补医保个人基数
        supplyMedicareAccountPersonalCode: '', // 大病补医保个人号码
        supplyMedicareAreaCode: '', // 大病补医保参保城市
        supplyMedicareEmployeeId: '' // 大病补医保户头专员
      },
      benchmarks: {
        endowmentEmpPayBaseLimit: '',
        endowmentEmpPayBaseLower: '',
        endowmentEmpPayRatio: '',
        endowmentCompPayBaseLimit: '',
        endowmentCompPayBaseLower: '',
        endowmentCompPayRatio: '',
        endowmentAccountPersonalCode: '', // 养老个人号码
        unemploymentEmpPayBaseLimit: '',
        unemploymentEmpPayBaseLower: '',
        unemploymentEmpPayRatio: '',
        unemploymentCompPayBaseLimit: '',
        unemploymentCompPayBaseLower: '',
        unemploymentCompPayRatio: '',
        unemploymentAccountPersonalCode: '', // 失业个人号码
        medicareEmpPayBaseLimit: '',
        medicareEmpPayBaseLower: '',
        medicareEmpPayRatio: '',
        medicareCompPayBaseLimit: '',
        medicareCompPayBaseLower: '',
        medicareCompPayRatio: '',
        medicareAccountPersonalCode: '', // 医疗个人号码
        employmentInjuryEmpPayBaseLimit: '',
        employmentInjuryEmpPayBaseLower: '',
        employmentInjuryEmpPayRatio: '',
        employmentInjuryCompPayBaseLimit: '',
        employmentInjuryCompPayBaseLower: '',
        employmentInjuryCompPayRatio: '',
        employmentInjuryAccountPersonalCode: '', // 工伤个人号码
        maternityEmpPayBaseLimit: '',
        maternityEmpPayBaseLower: '',
        maternityEmpPayRatio: '',
        maternityCompPayBaseLimit: '',
        maternityCompPayBaseLower: '',
        maternityCompPayRatio: '',
        maternityAccountPersonalCode: '', // 生育个人号码
        hpfundEmpPayBaseLimit: '',
        hpfundEmpPayBaseLower: '',
        hpfundEmpPayRatio: '',
        hpfundCompPayBaseLimit: '',
        hpfundCompPayBaseLower: '',
        hpfundCompPayRatio: '',
        hpfundAccountPersonalCode: '', // 公积金个人号码
        supplyMedicareCompPayBaseLower: '',
        supplyMedicareEmpPayBaseLower: '',
        supplyEmployeeInjuryCompPayBaseLower: '',
        supplyEmployeeInjuryEmpPayBaseLower: '',
        supplyEmployeeInjuryAccountPersonalCode: '', // 补充工伤个人号码
        supplyMedicareAccountPersonalCode: '', // 大病补医保个人号码
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
      .then(() => { this.getBenchmark() })
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
        Object.keys(this.iafInfo).forEach(item => {
          this.iafInfo[item] = ''
        })
        return Promise.reject(err)
      })
    },
    /**
     * 是否显示户口级别
     */
    isDomicileLeve () {
      return this.$store.dispatch('DOMICILE_LEVE', this.iafInfo.employeeCode)
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
        this.loading = false
        return Promise.reject()
      })
    },

    /**
     * 获取参保基数
     */
    getBenchmark () {
      let params = {
        employeeCode: this.iafInfo.employeeCode,
        domicileType: this.iafInfo.domicileType || '',
        domicileGrade: this.iafInfo.domicileGrade || ''
      }
      return this.$store.dispatch('GET_IAFBENCHMARKS', params)
      .then(data => {
        this.benchmarks = data
        this.iafInfo.hpfundAreaId = data.areaId
        this.iafInfo.insuranceAreaId = data.areaId
        // 通过areaId得到参保地中文名
        this.getCityName(data)
        // 判断是否能减员的险种
        this.canInsuranceType(this.getBackInsuranceType)
        // 判断基数是否为null，如果为null才不显示此险种
        this.canShowInsuranceType(data)
        this.loading = false
      })
      .catch(() => {
        Object.keys(this.benchmarks).forEach(key => {
          this.benchmarks[key] = ''
        })
        this.loading = false
      })
    },
    /**
     *  通过areaId得到参保地中文名
     */
    getCityName ({areaId}) {
      if (!sessionStorage.getItem('ALL_ADMINISTRATIVE_REGIONS')) return
      this.iafInfo.insuranceCity = ''
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
    /**
     * 判断基数是否为null，如果为null才不显示此险种
     */
    canShowInsuranceType (data) {
      for (let item of this.typeAll) {
        if ((data[item + 'CompPayBaseLimit'] !== 0 && !data[item + 'CompPayBaseLimit']) && (data[item + 'CompPayBaseLimit'] !== 0 && !data[item + 'EmpPayBaseLimit'])) {
          this.canAddInsuranceType.indexOf(item) > -1 && this.canAddInsuranceType.splice(this.canAddInsuranceType.indexOf(item), 1)
        }
      }
      this.canAddInsuranceTypeNumber = this.canAddInsuranceType.length
      this.selectedInsuranceType = this.canAddInsuranceType
      !this.canAddInsuranceTypeNumber && this.$message.warning('该员工无险种可发起流程')
    },
    /**
     * 通过后端返回的数据获取可增员的险种
     * @param {*} data
     */
    canInsuranceType (data) {
      this.canAddInsuranceType = []
      this.selectedInsuranceType = []
      this.canAddInsuranceType = Object.keys(data).filter(key => !!data[key])
      this.canAddInsuranceTypeNumber = this.canAddInsuranceType.length
    },
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
