<template>
  <i-layout>
    <div slot="header">
      <i-form @reset="reset" @search="search">
        <el-form-item label="职务分布">
          <!-- <el-input v-model="formInline.posTitle" placeholder="请输入职务"></el-input> -->
          <el-select v-model="formInline.posTitleId" placeholder="请输入职务">
            <el-option
            v-for="(item,k) in searchList.posTitle"
            :key="k"
            :label="item.name"
            :value="item.mapKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <!-- <el-input v-model="formInline.gender" placeholder="请输入性别"></el-input> -->
          <el-select v-model="formInline.gender" placeholder="请输入性别">
            <el-option
            v-for="(item,k) in searchList.gender"
            :key="k"
            :label="item.name"
            :value="item.mapKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄">
          <!-- <el-input v-model="formInline.age" placeholder="请输入年龄"></el-input> -->
          <el-select v-model="formInline.age" placeholder="请选择年龄">
            <el-option 
            v-for="(item,k) in searchList.age"
            :key="k"
            :label="item.name"
            :value="item.mapKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作经验">
          <!-- <el-input v-model="formInline.workExperience" placeholder="请输入工作经验"></el-input> -->
          <el-select v-model="formInline.workExperience" placeholder="请选择工作经验">
            <el-option
            v-for="(item,k) in searchList.workExperience"
            :key="k"
            :label="item.name"
            :value="item.mapKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学历">
          <!-- <i-select v-model="formInline.educationType" parameter="EDUCATION_TYPE" placeholder="请选择学历"></i-select> -->
          <el-select v-model="formInline.educationType" :placeholder="请输入学历">
            <el-option
            v-for="(item, k) in searchList.educationType"
            :key="k"
            :label="item.name"
            :value="item.mapKey"
            ></el-option>
          </el-select>
        </el-form-item>
      </i-form>
    </div>
    <div slot="section" class="talent-section">
        <!-- -->
        <el-row v-show="classification" :gutter="10">
          <!-- 职务表 -->
          <el-col :md="12" :lg="8" >
            <div class="canvas-structure" >
                <p><span class="canvas-attribute">职务分布</span> <span class="canvas-number">{{this.classification.employeeCount}}人</span></p>
                <div class="canvas-main" id="main">

                </div>
            </div>
          </el-col>
            <!-- 性别表 -->
          <el-col :md="12" :lg="8" >
            <div class="canvas-structure">
                <p><span class="canvas-attribute">性别</span> <span class="canvas-number">{{this.classification.employeeCount}}人</span></p>
                <div class="canvas-main" id ="main1">

                </div>
            </div>
          </el-col>
              <!-- 年龄表 -->
          <el-col :md="12" :lg="8" >
              <!-- class="canvas-structure" -->
            <div class="canvas-structure">
                <p><span class="canvas-attribute">年龄</span> <span class="canvas-number">{{this.classification.employeeCount}}人</span></p>
                <div class="canvas-main" id ="main2">

                </div>
            </div>
          </el-col>
              <!-- 工作经验 -->
          <el-col :md="12" :lg="8" >
              <!-- class="canvas-structure" -->
            <div class="canvas-structure">
                <p><span class="canvas-attribute">工作经验</span> <span class="canvas-number">{{this.classification.employeeCount}}人</span></p>
                <div class="canvas-main" id ="main3">

                </div>
            </div>
          </el-col>
                <!-- 学历表 -->
          <el-col :md="12" :lg="8" >
              <!-- class="canvas-structure" -->
            <div class="canvas-structure">
                <p><span class="canvas-attribute">学历</span> <span class="canvas-number">{{this.classification.employeeCount}}人</span></p>
                <div class="canvas-main" id ="main4">

                </div>
            </div>
          </el-col>
        </el-row>
        <div v-show="!classification" class="no-team">
          <div class="no-team-show">
            <img src="../../../../../assets/images/team-photo.png" alt="" class="">
            <p>暂无数据</p>
          </div>
        </div>
      <i-dialog
      v-model="showPop"
      :title="title"
      size="large"
      :toolbar="toolbar"
      @close="closParameter"
    >
      <talent-detail :transmission="transmission" :personnel.sync="personnel" :headParameters="headParameters"></talent-detail>
    </i-dialog>
      
    </div>
  </i-layout>
</template>
<script type="text/javascript">
  import IDialog from 'components/common/i-dialog/i-dialog.vue'
  import talentDetail from './talent-detail'
  import ISelect from 'components/common/i-select/i-select.vue'
  var echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/tooltip')
  import req from 'api/self/my-team'
  import {dictFormat} from 'utils'
  import moment from 'moment'
  
  export default {
    components: {
      talentDetail,
      ISelect,
      IDialog
    },
    data () {
      return {
        // ...data,
        formInline: {
          posTitleId: '',
          title: '',
          gender: '',
          age: '',
          workExperience: '',
          educationType: ''
        },
        searchList: {
          posTitle: '',
          title: '',
          gender: '',
          age: '',
          workExperience: '',
          educationType: []
        },
        myCharts: null,
        myChartsData: {
          ageData: [],  // 年龄比例
          ageLegendData: [], // 年龄标题
          positionData: [], //  职务比例
          positionLegendData: [], // 职务标题
          experienceData: [], // 工作经验比例
          experienceLegendData: [], // 工作经验标题
          genderData: [], // 性别比例
          genderLegendData: [], // 性别标题
          educationLegendData: [], // 学历标题
          educationData: [] // 学历比例
        },
        classification: {},
        stopwatch: [],
        transmission: {},
        showPop: false,
        personnel: {},
        isRequestAgain: true,
        headParameters: false
      }
    },
    created () {
      this.echartsData({}, '1')
      // window.sessionStorage.setItem('TALENT_STRUCTURE_SEARCH', JSON.stringify())
      // console.log(this.myChartsData.educationData)
    },
    methods: {
      reset () {
        if (this.isRequestAgain) {
          this.formInline.posTitleId = ''
          this.formInline.gender = ''
          this.formInline.age = ''
          this.formInline.workExperience = ''
          this.formInline.educationType = ''
          this.clearDate()
          this.isRequestAgain = false
          this.echartsData({}, 0, this.isRequestAgain)
        }
      },
      percentPeiTest (myChartsElement, legendData, seriesData) {
        // console.log('seriesData', seriesData)
        myChartsElement.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            icon: 'circle',
            orient: 'vertical',
            itemWidth: 8,
            x: '3%',
            data: legendData
          },
          color: ['#2c82be', '#dbecf8', '#76ddfb', '#53a8e2', '#6FD2F4', '#67C8ED', '#58B3E0', '#50A9D9', '#3F95CB'],
          series: [
            {
              name: '结构分析',
              type: 'pie',
              radius: ['50%', '90%'],
              center: ['60%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: true,
                  position: 'inner',
                  formatter: '{d}%'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: seriesData
            }
          ]
        })
      },
      /**
     * 职务分布echarts站位
     * @param main
     * 性别的echarts站位
     * @param main1
     * 年龄的echarts站位
     * @param main2
     * 工作经验echarts站位
     * @param main3
     * 学历echarts站位
     * @param main4
     *
     */
      echartsData (option = {}, Number, isRequest) {
        req('employeeAnalysis', option).then(res => {
          this.classification = res
          // 职务分布
          this.forInData(
            this.classification.positionLegendMap,
            this.classification.positionDataMap,
            this.myChartsData.positionLegendData,
            this.myChartsData.positionData,
            Number
            )

          this.percentPeiTest(
            echarts.init(document.getElementById('main')),
            this.myChartsData.positionData,
            this.myChartsData.positionLegendData
            )
            // echarts的点击事件 职务分布
          echarts.init(document.getElementById('main')).on('click', (params) => {
            this.title = '职务分布：' + params.data.name + '人数' + params.data.value + '人'
            this.transmission =
            {
              posTitleId: params.data.mapKey,
              gender: this.formInline.gender,
              age: this.formInline.age,
              workExperience: this.formInline.workExperience,
              educationType: this.formInline.educationType
            }
            this.fetch(this.transmission)
            // console.log(this.transmission)
            this.headParameters = false
            this.showPop = true
          })
          // 性别
          this.forInData(this.classification.genderLegendMap,
            this.classification.genderDataMap,
            this.myChartsData.genderLegendData,
            this.myChartsData.genderData,
            Number
            )

          this.percentPeiTest(echarts.init(document.getElementById('main1')),
            this.myChartsData.genderData,
            this.myChartsData.genderLegendData)
          echarts.init(document.getElementById('main1')).on('click', (params) => {
            this.title = '性别：' + params.data.name + '人数' + params.data.value + '人'
            this.transmission = {
              gender: params.data.mapKey,
              age: this.formInline.age,
              workExperience: this.formInline.workExperience,
              educationType: this.formInline.educationType,
              posTitleId: this.formInline.posTitleId
            }
            this.fetch(this.transmission)
            this.headParameters = false
            this.showPop = true
          })
          // 年龄
          this.forInData(this.classification.ageLegendMap,
            this.classification.ageDataMap,
            this.myChartsData.ageLegendData,
            this.myChartsData.ageData,
            Number
            )

          this.percentPeiTest(echarts.init(document.getElementById('main2')),
            this.myChartsData.ageData,
            this.myChartsData.ageLegendData)
          echarts.init(document.getElementById('main2')).on('click', (params) => {
            this.title = '年龄：' + params.data.name + '人数' + params.data.value + '人'
            this.transmission = {
              age: params.data.mapKey,
              gender: this.formInline.gender,
              workExperience: this.formInline.workExperience,
              educationType: this.formInline.educationType,
              posTitleId: this.formInline.posTitleId
            }
            this.fetch(this.transmission)
            this.headParameters = false
            this.showPop = true
          })
          // 工作经验
          this.forInData(this.classification.experienceLegendMap,
            this.classification.experienceDataMap,
            this.myChartsData.experienceLegendData,
            this.myChartsData.experienceData,
            Number,
            this.searchList.workExperience
            )

          this.percentPeiTest(echarts.init(document.getElementById('main3')),
            this.myChartsData.experienceData,
            this.myChartsData.experienceLegendData)
          echarts.init(document.getElementById('main3')).on('click', (params) => {
            this.title = '工作经验：' + params.data.name + '人数' + params.data.value + '人'
            this.transmission = {
              workExperience: params.data.mapKey,
              gender: this.formInline.gender,
              age: this.formInline.age,
              educationType: this.formInline.educationType,
              posTitleId: this.formInline.posTitleId
            }
            this.fetch(this.transmission)
            this.headParameters = false
            this.showPop = true
          })
          // 学历
          this.forInData(
            this.classification.educationLegendMap,
            this.classification.educationDataMap,
            this.myChartsData.educationLegendData,
            this.myChartsData.educationData,
            Number
            )
          echarts.init(document.getElementById('main4')).on('click', (params) => {
            this.title = '学历：' + params.data.name + '人数' + params.data.value + '人'
            this.transmission = {
              educationType: params.data.mapKey,
              gender: this.formInline.gender,
              age: this.formInline.age,
              workExperience: this.formInline.workExperience,
              posTitleId: this.formInline.posTitleId
            }
            this.fetch(this.transmission)
            this.headParameters = false
            this.showPop = true
          })
          if (!isRequest) {
            this.isRequestAgain = true
          }
        })
      },
     /**
     * @param {Array}  legend:接收并且将要赋值到echarts中legend的数据
     * @param {Array}  series:接收并且将要赋值到echarts中series的数据
     * @param {Array}  proportion:接收后台返回的数据遍历series
     * @param {Array}  name:接收后台返回的数据遍历到legend
     */
      async forInData (legend, series, proportion, names, Number, searchNames) {
        if (legend === this.classification.educationLegendMap) {
          // console.log(proportion)
          for (let key in legend) {
            if (key === 'O') {
              proportion.push(this.classification.educationLegendMap.O)
              delete this.classification.educationLegendMap.O
            } else {
              var song = dictFormat('EDUCATION_TYPE', this.classification.educationLegendMap[key])
              var songVal = await song
              // console.log(songVal)
              proportion.push(songVal)
              // console.log(this.myChartsData.educationLegendData)
            }
          }
          var index = 0
          for (let key in series) {
            names.push({value: series[key], name: this.myChartsData.educationLegendData[index++], mapKey: key})
          }
          // console.log(proportion)
          // console.log(names)
          this.percentPeiTest(echarts.init(document.getElementById('main4')),
            proportion,
            names)
          let neamsData = this.myChartsData.educationLegendData = names
          if (Number === '1') {
            this.searchList.educationType = neamsData
          }
          return neamsData
        }
        for (let key in legend) {
          names.push(legend[key])
        }
        for (let key in series) {
          proportion.push({value: series[key], name: legend[key], mapKey: key})
        }
        if (Number === '1') {
          if (legend === this.classification.genderLegendMap) {
            this.searchList.gender = proportion
          } else if (legend === this.classification.experienceLegendMap) {
            this.searchList.workExperience = proportion
          } else if (legend === this.classification.ageLegendMap) {
            this.searchList.age = proportion
          } else if (legend === this.classification.ageLegendMap) {
            this.searchList.age = proportion
          } else if (legend === this.classification.positionLegendMap) {
            this.searchList.posTitle = proportion
          }
        }
      },
      fetch (options = {}) {
        req('getMyTeamList', options).then(res => {
          this.personnel = res
          res.map(item => {
            item.hireDate = moment(item.hireDate).format('LL')
          })
        })
      },
      search () {
        // console.log(data)
        if (this.isRequestAgain) {
          this.clearDate()
          this.isRequestAgain = false
          this.echartsData(this.formInline, 0, this.isRequestAgain)
        }
        // this.clearDate()
        // this.echartsData(this.formInline)
      },
      clearDate () {
        this.myChartsData.ageData = []// 年龄比例
        this.myChartsData.ageLegendData = []// 年龄标题
        this.myChartsData.positionData = []//  职务比例
        this.myChartsData.positionLegendData = [] // 职务标题
        this.myChartsData.experienceData = [] // 工作经验比例
        this.myChartsData.experienceLegendData = [] // 工作经验标题
        this.myChartsData.genderData = [] // 性别比例
        this.myChartsData.genderLegendData = [] // 性别标题
        this.myChartsData.educationLegendData = [] // 学历标题
        this.myChartsData.educationData = [] // 学历比例
      },
      // 弹出框的关闭事件
      closParameter () {
        this.headParameters = true
      }
    }
  }
</script>
<style lang="scss" scoped>
.canvas-structure {
    height: 307px;
    margin-bottom: 15px;
    // display: inline-block;
    border: 1px solid #EAEAEA;
     &:nth-child(3n+3) {
         margin-right: 0;
     }
     p {
         padding: 20px; 
         font-size: 14px;
        .canvas-attribute {
            width: 82%;
            display: inline-block;
         }
        .canvas-number {
            width: 16%;
            display: inline-block;
            text-align: right;
        }
     }
     .canvas-main{
       width: 100%;
       height: 247px;
     }
    }
    .talent-section {
      .no-team {
        width: 100%;
        height: 700px;
        position: relative;
        .no-team-show {
          transform: translate(-50%,-50%);
          position: absolute;
          top: 50%;
          left: 50%;
          color: #959595;
          text-align: center;
        }
      }
    }

</style>
<style lang="scss">
  .el-main {
    background: #f8f8f8;
  }
</style>