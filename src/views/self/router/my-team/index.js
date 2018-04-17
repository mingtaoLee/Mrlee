/**
 * Created by admin on 2018/1/30.
 */
const myTeamLayout = () => import(/* webpackChunkName: "recruit-layout" */'views/self/pages/my-team/my-team-layout')
const members = () => import(/* webpackChunkName: "recruit-layout" */'views/self/pages/my-team/members')
const talentStructure = () => import(/* webpackChunkName: "recruit-layout" */'views/self/pages/my-team/talent-structure')
export default [
  {
    path: '/myTeam',
    name: '我的团队',
    component: myTeamLayout,
    hideIcon: true,
    redirect: '/myTeam/members',
    children: [{
      path: 'members',
      name: '团队成员',
      component: members
    }, {
      path: 'talent-structure',
      name: '人才结构分析',
      component: talentStructure
    }, {
      path: 'members/:id',
      name: '团队成员',
      hide: true,
      component: members
    }]
  }
]
