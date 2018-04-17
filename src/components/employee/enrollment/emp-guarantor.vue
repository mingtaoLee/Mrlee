<template>
  <section class="emp-guarantor content-follow">
    <h2 class="info-title">联保人信息</h2>
    <el-form label-width="120px" :model="hireInfo.empSuretyList[0]" :rules="rules" v-if="showMap.fullName1 && hireInfo.empPosition.isSurety">
      <el-row><el-col :span="7">
      <el-form-item label="联保人1" prop="cosuretyId" class="box">
            <i-select
            class="input-box"
            v-model="hireInfo.empSuretyList[0].cosuretyId"
            :id="hireInfo.empSuretyList[0].cosuretyId"
            :isShow.sync="isShow1"
            :options="Array.from(cosuretyList)"
            :async="false"
            :props="cosuretyProps"
            :disabled="disabledMap.fullName1 || EssentialList.length>=1"
            @option-click="handleOptionClick1"
          ></i-select>
            <i-show-personnelInfo 
            v-if="showMap.fullName1" 
            :id="hireInfo.empSuretyList[0].cosuretyId" 
            class="btn1" 
            v-show="hireInfo.empSuretyList[0].cosuretyName"
          ></i-show-personnelInfo> 
        </el-form-item>
      </el-col></el-row>
    </el-form>
    <el-form label-width="120px" :model="hireInfo.empSuretyList[1]" :rules="rules2" v-if="showMap.fullName2 && hireInfo.empPosition.isSurety">
        <el-row><el-col :span="7">
      <el-form-item label="联保人2" prop="cosuretyId" class="box">
             <i-select
             class="input-box"
              v-model="hireInfo.empSuretyList[1].cosuretyId"
              :id="hireInfo.empSuretyList[1].cosuretyId"
              :isShow.sync="isShow2"
              :options="Array.from(cosuretyList)"
              :async="false"
              :props="cosuretyProps"
              :disabled="disabledMap.fullName2 || EssentialList.length>=2"
              @option-click="handleOptionClick2"
            ></i-select>
            <i-show-personnelInfo 
                v-if="showMap.fullName2" 
                :id="hireInfo.empSuretyList[1].cosuretyId" 
                class="btn1" 
                v-show="hireInfo.empSuretyList[1].cosuretyName"
             ></i-show-personnelInfo> 
        </el-form-item>
      </el-col></el-row>
    </el-form>
    <down class="down" v-if="showMap.guaPDF"></down>
  </section>
</template>
<script>
  import req from 'api/employee/guarantor'
  import IPersonnelSelect from 'components/common/i-personnel-select/i-personnel-select.vue'
  import Down from 'components/employee/download'
  import IShowPersonnelInfo from 'components/common/i-show-personnelInfo'
  export default {
    components: {
      IPersonnelSelect,
      Down,
      IShowPersonnelInfo
    },
    props: {
      hireInfo: Object,
      isSur: Boolean
    },
    data () {
      let checkCosurety1 = (rule, value, cb) => {
        !value && cb(new Error('联保人不能为空'))
        value === this.hireInfo.empSuretyList[1].cosuretyId ? cb(new Error('不能选择相同的联保人')) : cb()
      }
      let checkCosurety2 = (rule, value, cb) => {
        !value && cb(new Error('联保人不能为空'))
        this.hireInfo.empSuretyList[0].cosuretyId === value ? cb(new Error('不能选择相同的联保人')) : cb()
      }
      return {
        cosuretyList: [],
        cosuretyProps: {
          label: 'name',
          value: 'id'
        },
        flag: false,
         // 存放必选联保人信息
        essentialCosuretyList: [],
        EssentialList: [],
        isShow1: false,
        isShow2: false,
        // guarantorInfo: this.hireInfo.empSuretyList,
        rules: {
          cosuretyId: [{ required: true, validator: checkCosurety1, trigger: 'change' }]
        },
        rules2: {
          cosuretyId: [{ required: true, validator: checkCosurety2, trigger: 'change' }]
        }
      }
    },
    watch: {
      'disabledMap': {
        handler: function (newVal, oldVal) {
          this.cosuretyList = []
          if (!(newVal.fullName1 && newVal.fullName2)) {
            this.hireInfo.empPosition.isSurety && this.getSurInfo({employeeUnitId: this.hireInfo.empPosition.orgUnitId})
          } else {
            let value1 = {'name': this.hireInfo.empSuretyList[0].cosuretyName, 'id': this.hireInfo.empSuretyList[0].cosuretyId}
            this.cosuretyList.push(value1)
            let value2 = {'name': this.hireInfo.empSuretyList[1].cosuretyName, 'id': this.hireInfo.empSuretyList[1].cosuretyId}
            this.cosuretyList.push(value2)
          }
        },
        deep: true
      },
      'hireInfo.empPosition.isSurety': {
        handler: function (newVal, oldVal) {
          // console.log(22222, newVal, oldVal, this.hireInfo.empPosition.orgUnitId)
          this.hireInfo.empSuretyList[0].cosuretyId = ''
          this.hireInfo.empSuretyList[0].cosuretyName = ''
          this.hireInfo.empSuretyList[1].cosuretyId = ''
          this.hireInfo.empSuretyList[1].cosuretyName = ''
          newVal && this.getSurInfo({employeeUnitId: this.hireInfo.empPosition.orgUnitId})
        },
        deep: true
      }
    },
    mounted () {
      this.cosuretyList = []
      if (!(this.disabledMap.fullName1 && this.disabledMap.fullName2)) {
        this.hireInfo.empPosition.isSurety && this.getSurInfo({employeeUnitId: this.hireInfo.empPosition.orgUnitId})
      } else {
        let value1 = {'name': this.hireInfo.empSuretyList[0].cosuretyName, 'id': this.hireInfo.empSuretyList[0].cosuretyId}
        this.cosuretyList.push(value1)
        let value2 = {'name': this.hireInfo.empSuretyList[1].cosuretyName, 'id': this.hireInfo.empSuretyList[1].cosuretyId}
        this.cosuretyList.push(value2)
      }
    },

    methods: {
      // 请求联保人数据
      getSurInfo (item) {
        // console.log(777777)
        // if (this.disabledCheck) {
        this.cosuretyList = []
        this.EssentialList = []
        this.getEssentialCosurety(item)
        this.getNewCosurety(item)
        // }
      },
    // 获取必选联保人essentialCosuretyList
      getEssentialCosurety (item) {
        req('getEssentialCosurety', item)
      .then(data => {
        this.EssentialList = data
        if (data.length === 2) {
          this.hireInfo.empSuretyList[0].cosuretyId = data[0].suretyEmployeeId
          this.hireInfo.empSuretyList[0].cosuretyName = data[0].suretyName
          this.hireInfo.empSuretyList[1].cosuretyId = data[1].suretyEmployeeId
          this.hireInfo.empSuretyList[1].cosuretyName = data[1].suretyName
        } else if (data.length === 1) {
          this.hireInfo.empSuretyList[0].cosuretyId = data[0].suretyEmployeeId
          this.hireInfo.empSuretyList[0].cosuretyName = data[0].suretyName
        }
      })
        // console.log('EssentialList', this.EssentialList)
      },
    // 获取可选联保人
      getNewCosurety (item) {
        req('getOptionalCosurety', item)
        .then(data => {
          data.map(item => {
            let value = {'name': item.suretyName, 'id': item.suretyEmployeeId}
            this.cosuretyList.push(value)
          })
            // 防止获取的联保人数量超过100个且必选联保人不在其中
          this.EssentialList.map(val => {
            this.cosuretyList.map(keyId => {
              if (keyId.id === val.suretyEmployeeId) {
                this.flag = true
              }
            })
            if (!this.flag) {
              let valueEss = {'name': val.suretyName, 'id': val.suretyEmployeeId}
              this.cosuretyList.push(valueEss)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
      },
      handleOptionClick1 (item) {
        this.$set(this.hireInfo.empSuretyList[0], 'cosuretyId', item.id)
        this.$set(this.hireInfo.empSuretyList[0], 'cosuretyName', item.name)
      },
      handleOptionClick2 (item) {
        this.$set(this.hireInfo.empSuretyList[1], 'cosuretyName', item.name)
        this.$set(this.hireInfo.empSuretyList[1], 'cosuretyId', item.id)
      }
    }

  }
</script>

<style lang="scss">
    .input-box{
      .el-input__inner{
        text-indent: 16px;
      }
    }
</style>

<style lang="scss" scoped>
  .emp-guarantor {
    .down {
      margin-left: 120px;
    }
    .box{
        position: relative;
        .btn1{
            position: absolute;
            left:6px;
            top:0px;
        }
    }
  }
</style >



