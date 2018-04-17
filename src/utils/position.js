/**
 * 获取本节点的最上级的节点label
 * @param {object} node 节点
 */
export function getOccupationGroup (node) {
  if (node.level === 1) {
    return node.label
  }
  return getOccupationGroup(node.parent)
}

/**
 * 获取当前树节点的路径，例如: 职群/职种/子职种
 * @param {object} node 节点
 */
export function getTreeChosen (node) {
  var chosen = []
  chosen.push(node.label)
  if (node.level > 1) {
    chosen = chosen.concat(getTreeChosen(node.parent))
  }
  return chosen.reverse().join('/')
}

/**
 * 根据当前节点状态，返回申请人的操作，例如：‘职群创建’
 * @param {object} node 当前进入节点
 * @param {*} operationType 操作类型，0为创建，1为修改，2为撤销，3为删除
 */
import {operationName} from '../config/dict'
export function getAction (isGroup, operationType) {
  var self = isGroup === true || isGroup === 'true' ? '职群' : '职种'
  var action = operationName[operationType]
  if (!action) {
    throw new Error('字典表无此字段')
  }
  return self + action
}

/**
 * 根据树的status数据，返回需要被撤销的树内容的id,注意status为字符串1和0和2
 * @param {array} tree 传入的树形数据
 * @param {object} config 包含判断的字段名和id字段名
 */
export function getCancel (tree, config) {
  var id = 'posJobFamilyId'
  var status = 'status'
  if (config) {
    if (config.id) {
      id = config.id
    }
    if (config.status) {
      status = config.status
    }
  }
  var cancel = []
  tree.forEach(ele => {
    if (ele[status] === '0' || ele[status] === 0) {
      cancel.push(ele[id])
    }
  })
  return cancel
}

/**
 * 根据树的status数据，返回需要被冻结的树内容的id,注意status为字符串1和0和2
 * @param {array} tree 传入的树形数据
 * @param {object} config 包含判断的字段名和id字段名
 */
export function getFreeze (tree, config) {
  var id = 'posJobFamilyId'
  var status = 'status'
  if (config) {
    if (config.id) {
      id = config.id
    }
    if (config.status) {
      status = config.status
    }
  }
  var freeze = []
  tree.forEach(ele => {
    if (ele[status] === '2' || ele[status] === 2) {
      freeze.push(ele[id])
    }
  })
  return freeze
}

/**
 * 将已撤销的和冻结的过滤掉,注意status为字符串1和0和2
 * @param {object} tree  传入的树形数据
 * @param {*} status 状态键名
 */
export function filterCancel (tree, status = 'status') {
  var newTree = []
  tree.forEach(ele => {
    if (ele[status] !== '0' && ele[status] !== 0) {
      newTree.push(ele)
    }
  })
  return newTree
}

