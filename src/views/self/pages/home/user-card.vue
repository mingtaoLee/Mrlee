<template>
  <section class="card user-card">
    <figure v-if="user">
      <div class="user-card-main">
          <div class="picture-wrapper">
              <div class="picture">
                  <!-- <el-upload
                  action="/api/system/attachments/image"
                  list-type="picture-card"
                  :on-success="handleAvatarSuccess"
                  :show-file-list="false"
                  class="uploadPhoto"
                  >
                  <img width="101%" style="border-radius: 50%;" :src="dialogImageUrl" alt="">
                  <i class="el-icon-plus"></i>
                </el-upload> -->
                <router-link to="/essential">
                  <img v-if="user.photoPath" :src="`${$$.BASE_URL}/system/attachments/image/${user.photoPath}`" alt="">
                  <div v-else>
                    <i-svg-icon v-if="user.gender === 'F'" iconName="nvxingtouxiang" :styleName="iconStyle"></i-svg-icon>
                    <i-svg-icon v-else-if="user.gender === 'M'" iconName="nanxingtouxiang" :styleName="iconStyle"></i-svg-icon>
                  </div>
                </router-link>
              </div>
            </div>
            <figcaption>
              <h4 class="name">{{ user.fullName }}</h4>
              <router-link to="/essential">
              <ul class="info">
                  <li>
                      <p>工号：<span>{{ user.employeeCode }}</span></p>
                  </li>
                <li>
                  <p>部门：<span>{{ user.orgUnitName }}</span></p>
                </li>
                <li>
                  <p>职位：<span>{{ user.posPositionName }}</span></p>
                </li>
                <li>
                  <p>司龄：<span v-if="showYear">{{ user.hireDate }}年</span><span v-if="showMouth">{{MonthDate}}个月</span></p>
                </li>
                <li>
                  <p>
                    生日：<span v-if="user.birthDate !== 'Invalid date'">{{ user.birthDate }}</span>
                  </p>
                </li>
              </ul>
            </router-link>
              <p class="birth">
                <!-- 永辉里还有 <span>{{ user.sameBirthday }}</span> 位亲跟我同一天生日 -->
                <!--<i class="iconfont icon-linear-arrow-right"></i>-->
              </p>
            </figcaption>
      </div>
      
    </figure>
  </section>
</template>

<script>
import req from 'api/self/home.js'
import moment from 'moment'
import ISvgIcon from 'components/common/i-svg-icon'
export default {
  components: {
    ISvgIcon
  },
  data () {
    return {
      dialogImageUrl: '',
      MonthDate: '',
      showYear: true,
      showMouth: true,
      user: [],
      iconStyle: `width: 130px;border-radius: 100%;height: 130px;`
    }
  },
  // props: ['user'],
  // filters: {
  //   birthFormat (val) {
  //     return val.replace(/-/, '月') + '日'
  //   }
  // },
  mounted () {
    this.init()
  },
  methods: {
    handleAvatarSuccess (response, file, fileList) {
      this.dialogImageUrl = file.url
    },
    init () {
      req('getHomeEmployeeInfo').then(res => {
        // if (res.birthDate) {
        // res.birthDate = moment(res.birthDate).format('MM月DD日')
        res.birthDate = res.changedBirthDate.slice(5, 7) + '月' + res.changedBirthDate.slice(8, 10) + '日'
        this.MonthDate = moment(new Date()).format('MM') - moment(res.hireDate).format('MM')
        res.hireDate = moment(new Date()).format('YYYY') - moment(res.hireDate).format('YYYY')
        if (this.MonthDate < 0) {
          this.MonthDate = this.MonthDate + 12
          res.hireDate = res.hireDate - 1
        }
        if (!res.hireDate) {
          this.showYear = false
        }
        if (!this.MonthDate) {
          this.showMouth = false
        }
        // console.log(res.hireDate)
        // res.hireDate = moment(res.hireDate).format('YYYY-MM-DD')
        // }
        this.user = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$icon-size: 12px;
.uploadPhoto {
  position: absolute;
  top: -2px;
  left: -2px;
}
.user-card {
  background: #FFFFFF;
  box-shadow: 0 0 2px 0 rgba(0,0,0,0.10);
  border-radius: 1px;
  width: 49%;
  /* padding-bottom: 20px; */

  figure {
    margin: 0;
    display: flex;
  }

  .picture {
    position: relative;
    width: 130px;
    height: 130px;
    /* margin: 30px 55px 19px 55px; */
    overflow: hidden;
    border-radius: 50%;
    img {
      display: block;
      width: 100%;
    }
  }

  .explain {
    color: #3DA5FE;
    width: 130px;
    margin-left: 55px;
    text-align: center;
  }
  .el-upload picture card {
    width: 134px;
    height: 130px;
  }
  figcaption {
    font-family: 'PingFangSC Regular';
    vertical-align: middle;

    .name {
      color: #000000;
      line-height: 24px;
      font: {
        family: 'Microsoft YaHei';
        size: 18px;
        weight: 800;
      }
    }

    .info {
      margin-top: 10px;
      color: #666666;
      font-size: 14px;
      padding: 0;
      word-break:keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      li {
        line-height: 24px;
        color: #666666;
      }
    }
    .birth {
      margin-top: 18px;
      font-size: 12px;
      color: #BDBDBD;
      span {
        color: #EE6723;
      }

      .iconfont {
        font-size: 12px;
      }
    }
  }
}
figure {
  position: relative;
  height: 100%;
  .user-card-main{
    position: absolute;
    box-sizing: border-box;
    top: 50%;
    left: 50%;
    width: 80%;
    text-align: center;
    transform: translate(-50%, -50%);
  } 
  .picture-wrapper {
    vertical-align: middle;
    display: inline-block;
    margin-right: 10%;
  }
    figcaption{
      display: inline-block;
      text-align: left;
      margin-top: 20px;
    }
}
</style>
