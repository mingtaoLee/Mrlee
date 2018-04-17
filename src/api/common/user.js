import request from '../index'

export const config = {
  // 获取rsa公钥
  getRSAPublicKey: {
    url: '/public-access/getPublicKey',
    method: 'get'
  },
  // 登入
  login: {
    url: '/security/login',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  },
  // 登出
  logout: {
    url: '/security/logout',
    method: 'post'
  },
  // 用户个人信息
  userInfo: {
    url: '/public-access/employees/login'
  },
  // 用户菜单
  menus: {
    url: '/public-access/menus'
  },
  // 菜单对应权限
  urlCodes: {
    url: '/public-access/urlCode/{menuId}'
  },
  // 获取修改密码地址
  resetPwdUrl: {
    url: '/public-access/resetPwdUrl'
  }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
