<template>
  <div class="members-page">
    <div v-if="info.nextLevelempEmployeeDtoList.length !== 0 || historyID !== null" class="members-page-list">
        <div class="group-leader">
            <div class="wrap">
              <div class="header">
                <avatar v-if="info.photoPath" :url="`${$$.BASE_URL}/system/attachments/image/${info.photoPath}`"></avatar>
                <avatar v-else :gender="info.gender"></avatar>
                <div v-if="info.photoPath">
                <i-svg-icon v-if="info.gender === 'F'" iconName="woman" :styleName="iconStyle"></i-svg-icon>
                <i-svg-icon v-else iconName="man" :styleName="iconStyle"></i-svg-icon>
                </div>
              </div>
      
              <div class="info">
                <span class="job-title">{{info.posPositionName}}</span>
                <span>{{info.fullName}}（{{getEmp(info.employeeStatus)}}）{{info.employeeAge}}岁</span>
              </div>
      
              <div class="contact-way">
                <p>工号 {{info.employeeCode}}</p> 
                <time>入职 {{info.hireDate}}</time>
                <div class="phone-number"><i class="iconfont icon-phonenumber"></i>{{info.mobile}}</div>
                <div class="email"><i class="iconfont icon-email"></i>{{info.email}}</div>
              </div>
            </div>
            <div class="go-back" v-show="$route.params.id" @click="goBack">返回上一级</div>
          </div>
          <ul class="group-members">
            <li v-for="(item, index) in info.nextLevelempEmployeeDtoList" :key="index" @click="goNext(item)">
              <member-item :data="item" :class="{'zebra': index%2 !== 0}"></member-item>
            </li>
            <li v-if="info.nextLevelempEmployeeDtoList.length === 0" class="no-member">
                <img src="../../../../assets/images/team-photo.png" alt="" class="">
                <p>此职员没有团队 &nbsp;&nbsp;<span class="go-to-back" @click="goBack">返回上一级团队</span></p>
            </li>
          </ul>
    </div>
    <div v-else class="no-team">
      <div class="no-team-show">
        <img src="../../../../assets/images/team-photo.png" alt="" class="">
        <p>还没有团队记录，去努力的工作吧</p>
      </div>
    </div>
  </div>
</template>

<script>
  import Avatar from 'views/self/pages/my-team/components/avatar'
  import MemberItem from 'views/self/pages/my-team/components/member-item'
  import req from 'api/self/my-team'
  import { globalComponentVariable } from 'config/globalComponentVariable'
  import { getSelectData } from 'utils/index.js'
  import ISvgIcon from 'components/common/i-svg-icon'
  import moment from 'moment'
  export default {
    name: 'Members',
    components: {
      Avatar,
      MemberItem,
      ISvgIcon
    },
    data () {
      return {
        // 团队信息
        info: {
          nextLevelempEmployeeDtoList: []
        },
        empList: [],
        iconStyle: `width: 20px; position: absolute;top: 21px; right: 3px;`,
        // 保存的id
        historyID: null
      }
    },
    created () {
      this.getMyTeam()
      // 用工类型字典
      let empUrl = globalComponentVariable.iSelect['dict'].url('EMPLOYEE_STATUS')
      let empIsCache = globalComponentVariable.iSelect['dict'].isCache
      // 获取用工类型字典
      getSelectData(empUrl, empIsCache).then(res => {
        this.empList = res
      })
      this.settingUpRouting()
    },
    watch: {
      '$route.params.id' (val) {
        if (!val) {
          console.log(1)
          window.sessionStorage.removeItem('TEAM_MEMBER_JUMP_HISTORY')
        }
        this.getMyTeam(val)
      }
    },
    methods: {
      settingUpRouting () {
        if (!window.location.hash.indexOf('#/myTeam/members') && this.$route.params.id === undefined) {
          window.sessionStorage.removeItem('TEAM_MEMBER_JUMP_HISTORY')
        }
      },
      /**
       * 获取团队信息
       * @param {String} id: 员工id
       */
      getMyTeam (id) {
        var params = {}
        if (id) {
          params.empEmployeeId = id
        }
        req('getMyTeam', params).then(res => {
          res.hireDate = moment(res.hireDate).format('LL')
          if (res.nextLevelempEmployeeDtoList) {
            for (let i = 0; i < res.nextLevelempEmployeeDtoList.length; i++) {
              res.nextLevelempEmployeeDtoList[i].hireDate = moment(res.nextLevelempEmployeeDtoList[i].hireDate).format('LL')
            }
          }
          this.info = res
        })
      },
      /**
       * 查看下级员工
       * @param {String} row: 查看目标员工row
       */
      goNext (row) {
        let id = row.empEmployeeId
        this.setTeamJumpHistory(id)
        this.$router.push(`/myTeam/members/${id}`)
        this.historyID = window.sessionStorage.getItem('TEAM_MEMBER_JUMP_HISTORY')
      },
      /**
       * 返回上一级团队
       */
      goBack () {
        let id = this.getLastTeamJumpHistory()
        let teamJumpHistory = JSON.parse(window.sessionStorage.getItem('TEAM_MEMBER_JUMP_HISTORY'))
        if (teamJumpHistory.length) {
          this.$router.push(`/myTeam/members/${id}`)
        } else {
          this.$router.push('/myTeam/members')
        }
      },
      /**
       * 设置团队成员跳转记录
       * @param {String} value: 跳转当前成员id
       */
      setTeamJumpHistory (value) {
        if (window.sessionStorage.getItem('TEAM_MEMBER_JUMP_HISTORY')) {
          let history = JSON.parse(window.sessionStorage.getItem('TEAM_MEMBER_JUMP_HISTORY'))
          history.push(value)
          window.sessionStorage.setItem('TEAM_MEMBER_JUMP_HISTORY', JSON.stringify(history))
        } else {
          window.sessionStorage.setItem('TEAM_MEMBER_JUMP_HISTORY', JSON.stringify([value]))
        }
      },
      /**
       * 获取团队成员跳转记录最后一个
       */
      getLastTeamJumpHistory () {
        if (window.sessionStorage.getItem('TEAM_MEMBER_JUMP_HISTORY')) {
          let history = JSON.parse(window.sessionStorage.getItem('TEAM_MEMBER_JUMP_HISTORY'))
          let last = null
          if (history.length > 1) {
            history.pop()
            last = history[history.length - 1]
          } else {
            last = history[history.length - 1]
            history.pop()
          }
          window.sessionStorage.setItem('TEAM_MEMBER_JUMP_HISTORY', JSON.stringify(history))
          return last
        }
        return false
      },
      /**
       * @param {String} value: 用工类型value
       * @return {String} 对应用工类型的value的label值
       */
      getEmp (value) {
        var list = this.empList
        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i].value === value) {
            return list[i].label
          }
        }
        return null
      }
    }
  }
</script>

<style lang="scss" scoped>
  .members-page {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    overflow: hidden;
    box-shadow: 0 0 2px 0 rgba(0,0,0,0.10);
    border-radius: 1px;
    zoom: 1;
    &:after {
      display: block;
      overflow: hidden;
      visibility: hidden;
      content: '';
      clear: both;
    }
    .members-page-list {
      height: 100%;
    }
    .group-leader {
      position: relative;
      float: left;
      overflow: auto;
      width: 30%;
      height: 100%;
      padding-bottom: 30px;
      box-sizing: border-box;
      border-right: 1px solid rgba(211,211,211,0.5);
      .wrap {
        margin-left: 30%;
      }

      .header {
        position: relative;
        width: 106px;
        height: 106px;
        margin: 19% 0 0 0;
      }

      .info {
        padding: 17px 0 0 0;
      }
      span {
        display: inline-block;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        line-height: 24px;
      }
      .job-title {
        font-size: 18px;
        padding-bottom: 5px;
        display: block;
      }

      .contact-way {
        padding: 50px 0 0 0;
        line-height: 24px;
        .icon-phonenumber,.icon-email {
          padding-right: 5px; 
          color: #959595;
          font-size: 12px;
        }
      }

      .go-back {
        position: absolute;
        top: 14px;
        left: 15px;
        cursor: pointer;
      }
    }

    .group-members {
      position: relative;
      margin-left: 30%;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
      padding: 15px 30px 0;
      li {
        padding-bottom: 15px;
        cursor: pointer;
      }
      .no-member {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        text-align: center;
        p {
          color: #959595;
          padding-top: 10px;
        }
        .go-to-back {
          color: #3599ef; 
          padding-bottom: 5px;
          border-bottom: 1px solid #3599ef;
        }
      }
    }

    .zebra {
      background-color: #F8F8F8;
    }
    .no-team {
      position: relative;
      height: 100%;
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
