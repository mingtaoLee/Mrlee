import request from '../index'
import { BASE_URL } from '@/config/api'

export const config = {
  // 根据fileList或businessId,businessType请求数据获取附件列表
  getFileList: {
    url: '/system/attachments/files',
    method: 'get'
  },

  // 轮询
  check: {
    url: '/common/imports/{business}/checking'
  },
  // 获取导入下载模板的链接
  getImportDownLoad: {
    url: '/common/imports/{business}/templates/download',
    method: 'post'
  },
  // 导入接口
  postImportFile: {
    url: '/common/imports/{business}',
    method: 'post'
  },
  // 获取导入模板
  getImportFile: {
    url: '/common/imports/templates/{business}',
    method: 'post'
  },
  // 导入失败
  failsUrl: {
    url: '/common/imports/{business}/fails/{id}'
  }
}
// 上传链接，预览链接
export const uploaderLinks = {
  upload: `${BASE_URL}/system/attachments/file`,
  preview: `${BASE_URL}/system/attachments/file`,
  filePreview: `${BASE_URL}/system/attachments/preview`,
  download: `${BASE_URL}/system/attachments/file`
}

export default function req (funcName, data, isToken = true, isCancel = false) {
  return request(config, funcName, data, isToken, isCancel)
}
