import req from 'api/org/setting.js'

export default {
  data () {
    return {
    }
  },
  methods: {
    // 获取组织类别，业态，组织类型，部门属性，上级组织类型中文信息
    asyncGetTypeData (orgData) {
      return Promise.all([
        this.$d('ORG_TYPE', orgData.orgType),
        this.$d('ORG_BUSINESS_TYPE', orgData.businessType),
        this.$d('SAP_ORG_TYPE', orgData.sapOrgType),
        this.$d('SAP_DEPT_PROP', orgData.sapDeptProp),
        this.$d('ORG_TYPE', orgData.parentOrgType ? orgData.parentOrgType : '')
      ]).then(typeData => {
        return {
          orgTypeName: typeData[0],
          businessTypeName: typeData[1],
          sapOrgTypeName: typeData[2],
          sapDeptPropName: typeData[3],
          parentOrgTypeName: typeData[4]
        }
      })
    },

    // 根据地区code获取所在区域，管理分区等信息
    asyncGetAreaData (orgData) {
      let emptyAreaData = {
        areaCode: '',
        areaDescription: '',
        areaName: '',
        areaId: '',
        areaType: '',
        childrenAreas: '',
        isActive: '',
        parentAreaId: '',
        parentAreaName: '',
        areaPathName: ''
      }

      // belongArea在前，managedArea在后
      if (orgData.belongArea && !orgData.managedArea) { // 如果所在区域code有值，而没有管理分区
        return req('getAreaMsg', {code: orgData.belongArea}).then(areaData => {
          if (areaData.length) {
            let pathName = areaData[0].parentAreaName ? areaData[0].parentAreaName + '/' + areaData[0].areaName : areaData[0].areaName + '全区'
            areaData[0] = Object.assign({}, areaData[0], {areaPathName: pathName})
            return [areaData[0], emptyAreaData]
          } else {
            return [emptyAreaData, emptyAreaData]
          }
        })
      } else if (!orgData.belongArea && orgData.managedArea) { // 如果没有所在区域，而管理分区code有值
        return req('getAreaMsg', {code: orgData.managedArea}).then(areaData => {
          if (areaData.length) {
            let names = areaData.map(item => { return item.parentAreaName ? item.parentAreaName + '/' + item.areaName : item.areaName + '全区' }).join(',')
            let codes = areaData.map(item => { return item.areaCode }).join(',')
            let ids = areaData.map(item => { return item.areaId })
            return [emptyAreaData, {names, codes, ids}]
          } else {
            return [emptyAreaData, emptyAreaData]
          }
        }).catch(areaDataErr => {
          console.log('地区信息接口报错')
        })
      } else if (!orgData.belongArea && !orgData.managedArea) { // 如果所在区域和管理分区都没有
        return new Promise((resolve, reject) => {
          resolve([emptyAreaData, emptyAreaData])
        }).catch(areaDataErr => {
          console.log('地区信息接口报错')
        })
      } else if (orgData.belongArea && orgData.managedArea) { // 如果所在区域和管理分区都有
        return Promise.all([
          req('getAreaMsg', {code: orgData.belongArea}),
          req('getAreaMsg', {code: orgData.managedArea})
        ]).then(areaData => {
          if (areaData[0].length && !areaData[1].length) { // 如果所在区域!==[]，而管理分区===[]
            return [areaData[0], emptyAreaData]
          } else if (!areaData[0].length && areaData[1].length) { // 如果所在区域===[]，而管理分区!==[]
            return [emptyAreaData, areaData[1]]
          } else if (!areaData[0].length && !areaData[1].length) { // 如果所在区域===[]，而管理分区===[]
            return [emptyAreaData, emptyAreaData]
          } else if (areaData[0].length && areaData[1].length) { // 如果所在区域!==[]，而管理分区!==[]
            let names = areaData[1].map(item => { return item.parentAreaName ? item.parentAreaName + '/' + item.areaName : item.areaName + '全区' }).join(',')
            let codes = areaData[1].map(item => { return item.areaCode }).join(',')
            let ids = areaData[1].map(item => { return item.areaId })
            return [areaData[0], {names, codes, ids}]
          }
        }).catch(areaDataErr => {
          console.log('地区信息接口报错')
        })
      }
    }
  },
  computed: {

  }
}
