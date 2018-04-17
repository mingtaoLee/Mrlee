import request from '../index.js'

export const config = {
  // 面试管理的列表
  interviewList: {
    url: '/recruit/interviews',
    method: 'get'
  },
  // 录用
  hire: {
    url: '/recruit/interviews/{interviewId}/hire/{isCheck}',
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  },
  // 登记面试
  register: {
    url: '/recruit/interviews/{interviewId}/register',
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  },
  // 合规检查
  compliced: {
    url: '/recruit/interviews/{interviewId}/qualify',
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  }
  // 导出
  // getInterviewList: {
  //   url: '/recruit/interview/hire',
  //   method: 'get'
  // }
}

export default function req (funcName, data, isToken = true, isCancel = true) {
  return request(config, funcName, data, isToken, isCancel)
}
