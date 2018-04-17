/**
 * Created by Administrator on 2017-10-17.
 */
// import { transformToQueryUrl } from 'utils/index'
export const globalComponentVariable = {
  // iSelect Component Variable
  iSelect: {
    dict: {
      isCache: true,
      url (parameter) {
        return `/public-access/dicts/${parameter}/items`
      }
    },
    // 薪资组
    salaryGroup: {
      isCache: false,
      url (parameter = '') {
        return `/compensation/basic/groups/groupsearch?personnelGroupCode=${parameter}`
      }
    },
    // 无权限控制薪资组
    allSalaryGroup: {
      isCache: false,
      url (parameter = '') {
        return `/compensation/basic/groups/groupsearch?personnelGroupCode=${parameter}`
      }
    },
    // 工资项
    salaryItem: {
      isCache: false,
      url (parameter = '') {
        return `/compensation/basic/pay-components/search?componentType=${parameter}`
      }
    },
    // 工资差异项目记录
    paysRecordItem: {
      isCache: false,
      url (parameter = { employeeId: '', checkMonth: '' }) {
        return `/compensation/data/pays/record?employeeId=${parameter.employeeId}&checkMonth=${parameter.checkMonth}`
      }
    },
    // 获取职务列表
    posTitles: {
      isCache: false,
      url () {
        return `/org/pos/titles/available`
      }
    },
    // 公司
    company: {
      url (parameter = '') {
        return `/common/company?companyName=${parameter}`
      }
    },
    // 人事范围
    personalArea: {
      isCache: false,
      url () {
        return '/common/personnelGroup/usable'
      }
    },
    // 成本中心
    costCenter: {
      isCache: false,
      url () {
        return '/pay/cost/transfer/cost-center'
      }
    }
    // TODO: 往这里添加其他与字典数据类似的类型地址
  },
  // iTree Component Variable
  iTree: {
    org: {
      nodeKey: 'orgUnitId',
      parentNodeKey: 'orgParentId',
      searchUrl (keyword) {
        // return `/public-access/orgs?orgUnit=${keyword}`
        return `/org/orgs/${keyword}/like`
      },
      // 懒加载模式下接口地址
      lazy: {
        // 根节点地址, 参数rootId为是否需要根据根节点ID查找队形组织
        rootUrl (rootId, hasGrant = true) {
          return rootId ? `/org/orgs/${rootId}` : hasGrant ? '/org/orgs/roots' : `/org/orgs/root`
        },
        // 子节点地址
        childUrl (id, hasGrant = true) {
          return `/org/orgs/${id}/children/grant?hasGrant=${hasGrant}`
          // return `/org/orgs/${id}/children`
        },
        // 根据id集合查询对应组织集合
        someUrl (ids) {
          return `/org/orgs/organizations?orgUnitIds=${ids}`
        }
      },
      // 静态加载下接口地址
      staticUrl (rootId) {
        return rootId ? `/org/orgs/${rootId}` : '/org/orgs/root'
      }
    },
    jobFamilys: {
      nodeKey: 'posJobFamilyId',
      parentNodeKey: 'parentId',
      // 静态加载下接口地址
      staticUrl () {
        return '/org/pos/jobFamilys/available?type=1&includeEndNode=true'
      }
    },
    jobFamilysAvailable: {
      nodeKey: 'posJobFamilyId',
      parentNodeKey: 'parentId',
      // 静态加载下接口地址
      staticUrl () {
        return '/org/pos/jobFamilys/available?type=2&includeEndNode=true'
      }
    },
    jobFamilysAvailableWithoutClass: {
      nodeKey: 'posJobFamilyId',
      parentNodeKey: 'parentId',
      // 静态加载下接口地址
      staticUrl () {
        return '/org/pos/jobFamilys/available?type=2&includeEndNode=false'
      }
    },
    menus: {
      nodeKey: 'menuId',
      parentNodeKey: 'parentMenuId',
      staticUrl () {
        return '/system/menus/list'
      }
    },
    areaUnit: {
      nodeKey: 'areaId',
      parentNodeKey: 'parentId',
      staticUrl () {
        return '/pay/processes/areas-list'
      }
    }
  },

  iTable: {
    dict: {
      url (dictType) {
        return `/public-access/dicts/${dictType}/items`
      }
    }
  },

  iPersonnelSelect: {
    personnelUrl: '/public-access/employees',
    personnelByIdUrl: '/public-access/employees/search',
    org: {
      props: {
        children: 'children',
        label: 'orgUnitName',
        isLeaf ({isParent}) {
          return !isParent
        }
      },
      nodeKey: 'orgUnitId',
      parentNodeKey: 'orgParentId',
      // 懒加载模式下接口地址
      lazy: {
        // 根节点地址, 参数rootId为是否需要根据根节点ID查找队形组织
        rootUrl (rootId) {
          return rootId ? `/org/orgs/${rootId}` : '/org/orgs/root'
        },
        // 子节点地址
        childUrl (id) {
          return `/org/orgs/${id}/children`
        }
      }
    }
  },

  remoteSelect: {
    // 人事范围
    personnelGroup: {
      searchParams (keyword, num = 50) {
        return {
          personnelGroup: keyword,
          num: num
        }
      },
      searchUrl: '/common/personnelGroup/list'
    },
    // 受权限控制的薪资组
    salaryGroup: {
      searchParams (keyword, num = 50) {
        return {
          keyword: keyword,
          num: num
        }
      },
      searchUrl: '/compensation/basic/groups/groupsearch'
    },
    // 不受权限控制的全部薪资组
    allSalaryGroup: {
      searchParams (keyword, num = 50) {
        return {
          keyword: keyword,
          num: num
        }
      },
      searchUrl: '/compensation/basic/groups/groupsearchdup'
    },
    // 工资项
    salaryItem: {
      searchParams (keyword, num = 50) {
        return {
          componentName: keyword,
          num: num
        }
      },
      searchUrl: '/compensation/basic/pay-components/search'
    },
    // 工资套
    payComponent: {
      searchParams (keyword, num = null) {
        return {
          keyword: keyword,
          num: num
        }
      },
      searchUrl: '/compensation/basic/groups/search'
    },
    // 公司与公司代码
    company: {
      searchParams (keyword, num = 50) {
        return {
          companyName: keyword,
          num: num
        }
      },
      searchUrl: '/common/company/list'
    },
    // 户头
    account: {
      searchParams (keyword, num = 50) {
        return {
          keyword: keyword,
          num: num
        }
      },
      searchUrl: '/iaf/basic/accounts/all-accounts'
    },
    costCenter: {
      searchParams (keyword, num = 50) {
        return {
          keyword: keyword,
          num: num
        }
      },
      searchUrl: '/pay/cost/transfer/cost-center'
    },
    // 职位
    jobName: {
      searchParams (keyword, num = 50) {
        return {
          keyword: keyword,
          num: num
        }
      },
      searchUrl: '/compensation/data/three-clusters/posPosition'
    },
    // 发薪主体
    salaryCompany: {
      searchParams (keyword, num = 50) {
        return {
          keyword: keyword,
          num: num
        }
      },
      searchUrl: '/compensation/basic/pay-account/companycode'
    },
    // 付款单位
    accountsDataGrant: {
      searchParams (keyword, num = 50) {
        return {
          keyword: keyword,
          num: num
        }
      },
      searchUrl: '/iaf/insured/accountsDataGrants'
    },
    // 人事范围
    personnelGroups: {
      searchParams (keyword, num = 50) {
        return {
          personnelGroup: keyword,
          num: num
        }
      },
      searchUrl: '/iaf/basic/personnel-accounts/listsGrant'
    },
    // 人事范围
    personnelGroupsTwo: {
      searchParams (keyword, num = 50) {
        return {
          keyword: keyword,
          num: num
        }
      },
      searchUrl: '/iaf/basic/personnel-accounts/listsGrant'
    },
    // 户头名称
    accounts: {
      searchParams (keyword, num = 50) {
        return {
          keyword: keyword,
          num: num
        }
      },
      searchUrl: '/iaf/basic/personnel-accounts/accountGrant'
    },
    // 户头名称
    accountTwo: {
      searchParams (keyword, num = 50, userId) {
        return {
          keyword: keyword,
          num: num,
          userId: userId
        }
      },
      searchUrl: '/iaf/insured/accountsDataGrants'
    },
    // 品类名称
    category: {
      searchParams (keyword, num = 50) {
        return {
          posCategoryName: keyword,
          num: num
        }
      },
      searchUrl: '/employee/category/get'
    },
    Account: {
      searchParams (employeeCode) {
        return {}
      },
      searchUrl: '/iaf/insured/preOrSupply/account'
    }
  }
}
