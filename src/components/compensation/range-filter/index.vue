<template>
  <div>
    <el-form>
      <template v-if="form.data.length > 0" v-for="(item, index) in form.data">
        <el-row :gutter="10" :index="index">
          <el-col :span="8">
            <el-form-item>
              <el-select v-model="item.type" placeholder="请选择" @change="handleChange(item, index)">
                <el-option label="选择组织" :value="optionType.org"></el-option>
                <el-option label="选择职务" :value="optionType.pos"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <ISelectTree
                key="orgUnitId"
                v-if="item.type===optionType.org"
                lazy
                :multiple="false"
                dataKey="org"
                nodeKey="orgUnitId"
                v-model="item.orgUnitId"
                :selectedNode.sync="item.selectedNode"
                @node-click="handleOrgSelectClick($event, item)"
              ></ISelectTree>
              <i-select
                v-if="item.type===optionType.pos"
                v-model="item.posTitleId"
                :props="posTitlesProps"
                dataKey="posTitles"
                filterable
                @option-click="handlePosChange($event, item)"
              >
              </i-select>
              <!--<ISelectTree-->
                <!--key="posJobFamilyId"-->
                <!--v-if="item.type===optionType.pos"-->
                <!--:lazy="false"-->
                <!--:multiple="false"-->
                <!--dataKey="jobFamilys"-->
                <!--nodeKey="posJobFamilyId"-->
                <!--:props="jobProps"-->
                <!--v-model="item.posTitleId"-->
                <!--:selectedNode.sync="item.selectedNode"-->
                <!--@node-click="handlePosSelectClick($event, item)"-->
              <!--&gt;</ISelectTree>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="text" @click="handleAdd(item, index)">增加</el-button>
            <el-button type="text" @click="handleDel(item, index)">删除</el-button>
          </el-col>
        </el-row>
      </template>
    </el-form>
  </div>
</template>

<script>
  //  import { showMessage, confirmPopover } from 'utils/index'
  import ITable from 'components/common/i-table'
  import ITableCell from 'components/common/i-table-cell'
  import ISelect from 'components/common/i-select/i-select'
  import ISelectTree from 'components/common/i-select-tree/i-select-tree.vue'
  import mixin from 'components/compensation/range-filter/mixin'

  export default {
    name: 'rangeFilter',
    components: {
      ITable,
      ITableCell,
      ISelectTree,
      ISelect
    },
    mixins: [mixin],
    data () {
      return {
        form: {
          data: [],
          text: ''
        },
        optionType: {
          org: 1,
          pos: 2
        },
        jobProps: {
          children: 'children',
          label: 'name'
        },
        posTitlesProps: {
          value: 'posTitleId',
          label: 'name'
        },
        nodeValue: []
      }
    },
    props: {
      value: {
        type: Object,
        default: () => {
          return {
            value: [
            ],
            text: ''
          }
        }
      },
      data: {
        type: Object,
        default: () => {}
      }
    },
    created () {
      this.initData()
    },
    methods: {
      handleOrgSelectClick (data, item) {
        item.orgUnitName = data.orgUnitName
        item.posTitleName = null
        item.posTitleId = null
        this.emitData()
      },
      handlePosSelectClick (data, item) {
        item.posTitleName = data.name
        item.orgUnitId = null
        item.orgUnitName = null
        this.emitData()
      },
      handlePosChange (data, item) {
        console.log('handlePosChange', data, item)
        item.posTitleName = data.name
        item.orgUnitId = null
        item.orgUnitName = null
        this.emitData()
      },
      handleChange (item, index) {
      },
      handleAdd (item, index) {
        this.form.data.splice(index, 0, Object.assign({}, item))
        this.emitData()
      },
      handleDel (item, index) {
        if (this.form.data.length > 1) {
          this.form.data.splice(index, 1)
          this.emitData()
        }
      },
      emitData () {
        const data = this.form.data
        console.log('emit', data, this.convertRangeText(data))
        this.$emit('input', {
          value: data,
          text: this.convertRangeText(data)
        })
      },
      initData () {
        console.log('in:', this.value)
        if (Array.isArray(this.value.value) && this.value.value.length > 0) {
//          let data = Object.assign({}, this.value)
          let publicArr = []
          this.value.value.forEach(v => {
            let type = null
            let selectedNode = {}
            if (v.posTitleId && v.posTitleId !== '') {
              type = this.optionType.pos
              selectedNode.posTitleId = v.posTitleId
              selectedNode.posTitleName = v.posTitleName
            } else if (v.orgUnitId && v.orgUnitId !== '') {
              type = this.optionType.org
              selectedNode.orgUnitId = v.orgUnitId
              selectedNode.orgUnitName = v.orgUnitName
            }
            publicArr.push({
              ...v,
              selectedNode,
              type
            })
          })
          Object.assign(this.form, {
            data: publicArr.map(v => {
              return {...v}
            }),
            text: this.value.text
          })
//          console.log('?:', publicArr)
//          console.log('??????:', this.form.data)
        } else {
          this.form = {
            data: [
              {
                type: this.optionType.org,
//                posTitleId: null,
//                posTitleName: null,
                orgUnitId: '',
                orgUnitName: ''
              }
            ],
            text: ''
          }
          this.emitData()
        }
      }
    },
    watch: {
      'form.data' () {
//        this.emitData()
      },
      'form.text' () {
//        this.emitData()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
