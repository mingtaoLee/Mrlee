<template>
  <el-row :gutter="5" v-loading="loading" :element-loading-text="$loadingText">
    <!--<el-col :span="10" class="tree-select">-->
      <!--<el-row :gutter="5">-->
        <!--<el-col :span="12">-->
          <!--<h4 class="title">函数</h4>-->
          <!--<el-card :body-style="cardsBodyStyle">-->
            <!--<el-tree-->
              <!--:props="functionsNodeProps"-->
              <!--lazy-->
              <!--:load="loadFuncNode"-->
              <!--@node-click="handleFuncNodeClick">-->
            <!--</el-tree>-->
          <!--</el-card>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<h4 class="title">引用条件</h4>-->
          <!--<el-card :body-style="cardsBodyStyle">-->
            <!--<el-tree-->
              <!--:props="referenceNodeProps"-->
              <!--lazy-->
              <!--:load="loadReferenceNode"-->
              <!--@node-click="handleReferenceNodeClick"></el-tree>-->
          <!--</el-card>-->
        <!--</el-col>-->
        <!--<el-col :span="6">-->
        <!--<h4 class="title">考勤项目</h4>-->
        <!--<el-card :body-style="cardsBodyStyle">-->
        <!--<el-tree-->
        <!--:props="defaultProps"-->
        <!--lazy-->
        <!--:load="loadAttendanceNode"-->
        <!--@node-click="handleAttendanceNodeClick"></el-tree>-->
        <!--</el-card>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<h4 class="title">薪资项目</h4>-->
          <!--<el-card :body-style="cardsBodyStyle">-->
            <!--<el-tree-->
              <!--:props="compensationNodeProps"-->
              <!--lazy-->
              <!--:load="loadCompensationNode"-->
              <!--@node-click="handleCompensationNodeClick"></el-tree>-->
          <!--</el-card>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-card :body-style="cardsBodyStyle">-->
            <!--<el-tree-->
              <!--:props="commonNodeProps"-->
              <!--lazy-->
              <!--:load="loadCommonNode"-->
              <!--@node-click="handleCommonNodeClick"></el-tree>-->
          <!--</el-card>-->
        <!--</el-col>-->
      <!--</el-row>-->
    <!--</el-col>-->
    <el-col :span="6">
      <el-card :body-style="cardsBodyStyle">
        <el-tree
          :props="commonNodeProps"
          lazy
          :load="loadCommonNode"
          @node-click="handleCommonNodeClick"></el-tree>
      </el-card>
    </el-col>
    <el-col :span="18">
      <el-card class="cal-area1" :body-style="cardsBodyStyleCalArea">
        <el-input
          type="textarea"
          class="textarea-input"
          :rows="12"
          ref="textarea"
          v-model="value.label"
          resize="none"
          @blur="handleBlur"
          autofocus
        ></el-input>
        <ButtonGroup @buttonClick="handleButtonClick" @cleanClick="cleanClick"></ButtonGroup>
      </el-card>
    </el-col>
    <!--<el-col :span="14">-->
      <!--<div class="rules-area">-->
        <!--<el-dropdown-->
          <!--v-for="(item, index) in value.value"-->
          <!--:key="index"-->
          <!--size="small"-->
          <!--class="formulaItem"-->
          <!--split-button-->
          <!--trigger="click"-->
          <!--@click="handleSelected(index)"-->
          <!--@command="handleCommand"-->
          <!--:type="getType(index)">-->
          <!--{{value.label[index]}}-->
          <!--<el-dropdown-menu slot="dropdown">-->
          <!--<template v-if="item.match(/^F_/)">-->
            <!--<el-dropdown-item :command="'edit-'+index">修改值</el-dropdown-item>-->
            <!--<el-dropdown-item :command="'embed-'+index">嵌套公式</el-dropdown-item>-->
          <!--</template>-->
          <!--<el-dropdown-item :command="'insertBefore-'+index">前插一项</el-dropdown-item>-->
          <!--<el-dropdown-item :command="'insertAfter-'+index">后插一项</el-dropdown-item>-->
          <!--<el-dropdown-item :command="'del-'+index">删除</el-dropdown-item>-->
        <!--</el-dropdown-menu>-->
        <!--</el-dropdown>-->
        <!--<el-button size="small" type="success" @click="pushFormula">添加</el-button>-->
        <!--<el-popover-->
          <!--width="160"-->
          <!--v-model="popoverVisible"-->
          <!--trigger="click">-->
          <!--<el-input v-model="popoverData.number" type="number"></el-input>-->
          <!--<el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>-->
          <!--<el-button type="primary" size="mini" @click="popoverConfirm">确定</el-button>-->
        <!--</el-popover>-->
        <!--<el-popover-->
          <!--width="160"-->
          <!--v-model="embedVisible"-->
          <!--trigger="click">-->
          <!--<h4>请选择下方的公式，并点击确定按钮嵌套公式</h4>-->
          <!--<el-form labelWidth="50px" :model="embedData">-->
            <!--<el-form-item label="公式:">-->
              <!--<p v-text="embedData.label"></p>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="数值:" v-if="embedData.value.match(/^F_/)">-->
              <!--<el-input v-model="embedData.number" type="number"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-form>-->
          <!--<el-button size="mini" type="text" @click="embedVisible = false">取消</el-button>-->
          <!--<el-button type="primary" size="mini" @click="embedConfirm">确定</el-button>-->
        <!--</el-popover>-->
      <!--</div>-->
    <!--</el-col>-->
  </el-row>
</template>

<script>
  //  import { showMessage, confirmPopover } from 'utils/index'
  import ButtonGroup from './button-group'
  import mixin from 'components/compensation/formula-calculator/mixin'
  import req from 'api/compensation/base-setting/formula-calculator'
//  import calMap from './cal-map'
//  import Focus from '@/directives/focus'

  export default {
    name: 'formula-calculator',
    components: {
      ButtonGroup
    },
    data () {
      return {
        loading: true,
        treeNodeData: {
          functions: [],
          compensation: []
        },
        data: {
          value: [],
          label: ''
        },
        selectedIndex: null,
        popoverVisible: false,
        embedVisible: false,
        popoverData: {
          number: null
        },
        embedData: {
          number: null,
          label: '',
          value: ''
        },
        cardsBodyStyle: {
          padding: '5px',
          height: '382px',
          overflow: 'auto'
        },
        cardsBodyStyleCalArea: {
          height: '382px',
          padding: 0
        },
        currentNodeClickData: {},
        defaultProps: {
          children: 'children',
          label: 'label',
          isLeaf: 'isLeaf'
        },
        referenceNodeProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'isLeaf'
        },
        compensationNodeProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'isLeaf'
        },
        functionsNodeProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'isLeaf'
        },
        commonNodeProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'isLeaf'
        }
      }
    },
    mixins: [mixin],
//    directives: { Focus },
    props: {
      value: {
        label: '',
        value: []
      }
    },
    created () {
      this.loadAllFormulaData()
    },
    mounted () {
      this.$emit('getCalculatorVM', this)
    },
    watch: {
      'value.label' () {
        if (this.value.label) {
          let convertData = this.functionLabelConvertToValue(this.value.label, this.treeNodeData)
          this.value.value = convertData
        } else {
          this.value.value = []
        }
        this.handleChange()
        this.setCursorPosition()
      },
      'embedData.number' () {
        this.embedData.label = this.embedData.label.replace(/\(\S+\)/, '(' + this.embedData.number + ')')
        this.embedData.value = this.embedData.value.replace(/\(\S+\)/, '(' + this.embedData.number + ')')
      }
    },
    computed: {
    },
    methods: {
      loadAllFormulaData () {
//        this.getFunctionsAll()
//          .then(res => {
//            console.log('getFunctionsAll', this.treeNodeData.functions)
//          const data = this.functionLabelConvertToValue('F_开业月数_组织(F_开业月数_组织(4)) 1 + 3', this.treeNodeData.functions)
//          })
        Promise.all([
          this.getFunctionsAll(),
          this.getCompensationsAll()
        ]).then((funcRes) => {
          console.log('getAll', this.treeNodeData.functions, this.treeNodeData.compensation)

          this.loading = false
        })
      },
      getFunctionsAll () {
        return req('getFunctionsAll')
          .then(res => {
            if (res) {
//              res.forEach(v => {
//                v.name = 'F_' + v.name
//              })
              this.treeNodeData.functions = res
              return res
            }
          })
      },
      getCompensationsAll () {
        return this.getCompensations().then((res) => {
          if (res) {
//            res.forEach(v => {
//              v.id = 'CV_' + v.id
//              v.name = 'CV_' + v.name
//            })
            this.treeNodeData.compensation = res
            return res
          }
        })
      },
      popoverConfirm () {
        this.editFunctionalValue(this.selectedIndex, this.popoverData.number)
        this.popoverVisible = false
      },
      embedConfirm () {
        this.embedFormulaValue(this.selectedIndex, this.embedData.label, this.embedData.value)
        this.embedVisible = false
      },
      embedFormulaValue (index, newLabel, newValue) {
        let value = this.value.value
        let label = this.value.label
        value[index] = value[index].replace(/\(\S+\)/, '(' + newValue + ')')
        label[index] = label[index].replace(/\(\S+\)/, '(' + newLabel + ')')
        this.emitData({ value, label })
      },
      editFunctionalValue (index, number) {
        let value = this.value.value
        let label = this.value.label
        value[index] = value[index].replace(/\(\S+\)/, '(' + number + ')')
        label[index] = label[index].replace(/\(\S+\)/, '(' + number + ')')
        this.emitData({ value, label })
      },
      getType (index) {
        let theme = 'default'
        if (this.selectedIndex === index) {
          theme = 'primary'
        }
        return theme
      },
      handleSelected (index) {
        this.selectedIndex = index
      },
      handleCommand (command) {
        let arr = command.split('-')
        switch (arr[0]) {
          case 'insertBefore':
            this.insertBeforeFormula(arr[1])
            break
          case 'del':
            this.delFormula(arr[1])
            break
          case 'edit':
            this.editFormula(arr[1])
            break
          case 'embed':
            this.embedFormula(arr[1])
            break
          default:
            this.insertAfterFormula(arr[1])
        }
      },
      emitData ({ value, label }) {
        this.selectedIndex = null
        this.$emit('input', {
          value, label
        })
      },
      pushFormula () {
        let index = this.value.value.length
        this.insertAfterFormula(index)
      },
      embedFormula (index) {
        this.selectedIndex = index
        this.embedVisible = true
      },
      editFormula (index) {
        this.selectedIndex = index
        this.popoverVisible = true
      },
      insertAfterFormula (index) {
        let value = []
        let label = []
        if (index === 0) {
          value = ['new']
          label = ['new']
        } else {
          value = this.value.value
          label = this.value.label
          value.splice(index + 1, 0, 'empty' + index)
          label.splice(index + 1, 0, 'empty' + index)
        }
        this.emitData({ value, label })
      },
      insertBeforeFormula (index) {
        let value = this.value.value
        let label = this.value.label
        value.splice(index, 0, 'empty' + index)
        label.splice(index, 0, 'empty' + index)
        this.emitData({ value, label })
      },
      delFormula (index) {
        let value = this.value.value
        let label = this.value.label
        value.splice(index, 1)
        label.splice(index, 1)
        this.emitData({ value, label })
      },
      insertFormulaValue (newLabel, newValue, newValueType) {
        const INDEX = this.selectedIndex
        if (INDEX !== null) {
          let value = this.value.value
          let label = this.value.label
          if (!isNaN(Number(newValue)) && !isNaN(Number(value[INDEX]))) {
            value[INDEX] = value[INDEX].toString() + newValue.toString()
            label[INDEX] = label[INDEX].toString() + newLabel.toString()
          } else {
            value[INDEX] = newValue
            label[INDEX] = newLabel
          }
          this.emitData({ value, label })
        } else {
          console.log('not selected')
        }
      },
      getReference (parentId = null) {
        return req('getReference', { parentId })
      },
      getFunctions (id = null) {
        return req('getFunctions', { id })
      },
      getCompensations () {
        return req('getCompensations')
      },
      loadCompensationNode (node, resolve) {
        if (node.level === 0) {
          resolve([{
            name: '薪资列表',
            isLeaf: false
          }])
        } else if (node.level > 0) {
//          this.getCompensations().then((res) => {
//            if (res) {
//              res.forEach(v => {
//                v.isLeaf = true
//              })
//              resolve(res)
//            }
//          })
          let data = [].concat(this.treeNodeData.compensation)
          data.forEach(v => {
            v.isLeaf = true
          })
          resolve(data)
        }
      },
      handleCompensationNodeClick (data, node) {
        if (node.isLeaf && data) {
          const treeData = Object.assign({}, data)
          treeData.label = 'CV_' + treeData.name
          treeData.value = 'CV_' + (treeData.id || treeData.name)
//          this.handleNodeClick(treeData)
          this.insertValue(treeData)
        }
      },
      loadAttendanceNode (node, resolve) {
        if (node.level === 0) {
          resolve([{
            label: '数据列表',
            isLeaf: false
          }])
        } else if (node.level > 0) {
          setTimeout(() => {
            const data = [{
              label: 'one',
              isLeaf: true
            }, {
              label: 'zone',
              isLeaf: true
            }]
            resolve(data)
          }, 500)
        }
      },
      handleAttendanceNodeClick (data, node) {
        if (node.isLeaf && data) {
          const treeData = Object.assign({}, data)
          treeData.label = 'A_' + treeData.label
          treeData.value = 'A_' + (treeData.id || treeData.name)
//          this.handleNodeClick(treeData)
          this.insertValue(treeData)
        }
      },
      loadReferenceNode (node, resolve) {
        if (node.level === 0) {
          this.getReference().then(res => {
            if (res) {
              resolve(res)
            }
          })
        } else if (node.level > 0) {
          this.getReference(node.data.id).then(res => {
            if (res) {
              res.forEach(v => {
                v.isLeaf = true
              })
              resolve(res)
            }
          })
        }
      },
      handleReferenceNodeClick (data, node) {
//        console.log('handleReferenceNodeClick', data, node)
        if (node.isLeaf && data) {
          const treeData = Object.assign({}, data)
          treeData.label = 'R_' + (treeData.longName || treeData.name)
          treeData.value = 'R_' + treeData.name
//          this.handleNodeClick(treeData)
          this.insertValue(treeData)
        }
      },
      loadFuncNode (node, resolve) {
        if (node.level === 0) {
//          console.log('node', node)
          this.getFunctions().then(res => {
            if (res) {
              resolve(res)
            }
          })
        } else if (node.level > 0) {
//          this.getFunctions(node.data.id).then(res => {
//            if (res) {
//              res.forEach(v => {
//                v.isLeaf = true
//              })
//              resolve(res)
//            }
//          })
          let data = [].concat(this.treeNodeData.functions)
          data.forEach(v => {
            v.isLeaf = true
          })
          resolve(data)
        }
      },
      handleFuncNodeClick (data, node) {
//        console.log(data, node)
        if (node.isLeaf && data) {
          const treeData = Object.assign({}, data)
          treeData.label = 'F_' + treeData.name
          treeData.value = 'F_' + treeData.formula
//          this.handleNodeClick(treeData)
          this.insertValue(treeData)
        }
      },
      loadCommonNode (node, resolve) {
        if (node.level === 0) {
          resolve([{
            name: '薪资项目',
            type: 'compensation',
            isLeaf: false
          }, {
            name: '引用条件',
            type: 'reference',
            isLeaf: false
          }, {
            name: '函数公式',
            type: 'functions',
            isLeaf: false
          }])
        } else if (node.level > 0) {
          console.log('watch???', node.data, node.level, node.data.type)
          if (node.data.type === 'compensation') {
//            this.getCompensations().then((res) => {
//              if (res) {
//                res.forEach(v => {
//                  v.isLeaf = true
//                })
//                resolve(res)
//              }
//            })
            let data = [].concat(this.treeNodeData.compensation)
            data.forEach(v => {
              v.isLeaf = true
            })
            resolve(data)
          } else if (node.data.type === 'reference') {
            if (node.level === 1) {
              this.getReference().then(res => {
                if (res) {
                  res.forEach(v => {
                    v.type = 'reference'
                  })
                  resolve(res)
                }
              })
            } else {
              this.getReference(node.data.id).then(res => {
                if (res) {
                  res.forEach(v => {
                    v.isLeaf = true
                    let arr = v.name.split('.')
                    if (arr.length === 2) {
                      v.longName = v.name
                      v.name = arr[1]
                    }
                  })
                  resolve(res)
                }
              })
            }
          } else if (node.data.type === 'functions') {
//            if (node.level === 1) {
//              this.getFunctions().then(res => {
//                if (res) {
//                  res.forEach(v => {
//                    v.type = 'functions'
//                  })
//                  resolve(res)
//                }
//              })
//            } else {
//              this.getFunctions(node.data.id).then(res => {
//                if (res) {
//                  res.forEach(v => {
//                    v.isLeaf = true
//                  })
//                  resolve(res)
//                }
//              })
//            }
            let data = [].concat(this.treeNodeData.functions)
            data.forEach(v => {
              v.isLeaf = true
            })
            resolve(data)
          }
        }
      },
      handleCommonNodeClick (data, node) {
        if (data.isLeaf) {
//          console.log(data, node)
          let type = this.findParentNodeType(node)
          switch (type) {
            case 'compensation':
              this.handleCompensationNodeClick(data, node)
              break
            case 'reference':
              this.handleReferenceNodeClick(data, node)
              break
            case 'functions':
              this.handleFuncNodeClick(data, node)
              break
            default:
          }
        }
      },
      findParentNodeType (node) {
        if (node.parent.data && node.parent.data.type) {
          return node.parent.data.type
        } else {
          this.findParentNodeType(node)
        }
      },
      handleNodeClick (data) {
        this.currentNodeData = data
        if (this.embedVisible) {
          this.insertEmbedValue(this.currentNodeData.label, this.currentNodeData.value)
        } else {
          this.insertFormulaValue(this.currentNodeData.label, this.currentNodeData.value)
        }
      },
      insertEmbedValue (label, value) {
        this.embedData.label = label
        this.embedData.value = value
      },
      setCursorPosition () {
//        let range = this.$refs['textarea'].$refs['textarea'].createTextRange()
//        range.collapse(true)
//        range.moveEnd('character', pos)
//        range.moveStart('character', pos)
//        range.select()
//        const DOM = this.$refs['textarea'].$refs['textarea']
//        const startPos = DOM.selectionStart
//        const endPos = DOM.selectionEnd
        let currentPos = this.getCursorPosition()
        console.log('currentPos', currentPos)
        const DOM = this.$refs['textarea'].$refs['textarea']
        DOM.focus()
        DOM.selectionStart = currentPos.startPos
        DOM.selectionEnd = currentPos.endPos
        console.log('after', this.getCursorPosition())
      },
      getCursorPosition () {
        const DOM = this.$refs['textarea'].$refs['textarea']
        const startPos = DOM.selectionStart
        const endPos = DOM.selectionEnd
        return {
          startPos, endPos
        }
      },
      insertNewStr (str, insertStr, index) {
        let newStr = ''
        if (!index) {
          index = str.length - 1
        }
        if (index === 0) {
          newStr = insertStr + str
        } else if (index === str.length - 1) {
          newStr = str + insertStr
        } else {
          const first = str.substr(0, index)
          const second = str.substr(index)
          newStr = first + insertStr + second
        }
        return newStr
      },
      insertValue (data) {
        const position = this.getCursorPosition()
        const newLabel = this.insertNewStr(this.value.label, data.label, position.endPos)
        console.log(position)
        console.log(newLabel, data)
        this.value.label = newLabel
//        const labels = newLabel.replace(data.label, data.name)
//        console.log('labels', labels.split(' '), data)
//        this.$emit('input', {
//          label: newLabel,
//          value: this.value.value
//        })
      },
      handleButtonClick (data) {
//        this.insertFormulaValue(data.label, data.value)
        this.insertValue(data)
      },
      cleanClick () {
        this.value.label = ''
//        this.emitData({
//          label: [],
//          value: []
//        })
      },
      handleBlur () {
        this.$emit('handleBlur', this.value)
      },
      handleChange () {
        this.$emit('handleChange', this.value)
      },
      validateFormula (formula = this.value.value) {
        return req('validateRules', {
          formula
        })
      },
      initData () {
      }
    }
  }
</script>

<style lang="scss" scoped>
.rules-area{
  height: 280px;
  overflow: auto;
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #fff;
  padding: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.textarea{
  width: 100%;
  height: 280px;
  border: 1px solid #ccc;
}
.cal-area{
  border: 1px solid #cccccc;
}
.textarea-input{
}
.tree-select{
  margin-top: 10px;
  .title{
    padding: 2px 0;
  }
}
.formulaItem{
  margin: 5px;
}
</style>
<style lang="scss">
  .textarea-input{
    .el-textarea__inner {
      border: none;
    }
  }
</style>
