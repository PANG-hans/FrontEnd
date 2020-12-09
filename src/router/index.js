import Vue from 'vue'
import Router from 'vue-router'
// import main from '@/components/main'
// import problem from '@/components/mainpage/problem'
// import statue from '@/components/mainpage/statue'
// import user from '@/components/mainpage/user'
// import setting from '@/components/mainpage/setting'
// import contest from '@/components/mainpage/contest'
// import contestdetail from '@/components/contest/contestdetail'
// import problemdetail from '@/components/problem/problemdetail'
// import rank from '@/components/mainpage/rank'
// import admin from '@/components/mainpage/admin'
// import billboard from '@/components/mainpage/billboard'
// import blog from '@/components/mainpage/blog'
// import wiki from '@/components/mainpage/wiki'
// import algorithm from '@/components/wiki/algorithm'
// import mbcode from '@/components/wiki/code'
// import trainning from '@/components/wiki/trainning'
// import viewcode from '@/components/wiki/mbcode/viewcode'
// import viewcodedetail from '@/components/wiki/mbcode/viewcodedetail'
// import codeedit from '@/components/wiki/mbcode/codeedit'
// import wikidetail from '@/components/utils/wikidetail'
// import trainningdetail from '@/components/wiki/trainning/trainningdetail'
// import newalgorithm from '@/components/wiki/newalgorithm'
// import todolist from '@/components/utils/todolist'
// import homework from '@/components/mainpage/homework'
// import givechoiceproblemscore from "@/components/admin/givechoiceproblemscore"

const homepage = r => require.ensure([], () => r(require("@/components/main")), 'main"');
const problem = r => require.ensure([], () => r(require("@/components/mainpage/problem")), 'mainpage');
const statue = r => require.ensure([], () => r(require("@/components/mainpage/statue")), 'mainpage');
const user = r => require.ensure([], () => r(require("@/components/mainpage/user")), 'mainpage');
const setting = r => require.ensure([], () => r(require("@/components/mainpage/setting")), 'mainpage');
const problemdetail = r => require.ensure([], () => r(require("@/components/problem/problemdetail")), 'problem');
const admin = r => require.ensure([], () => r(require("@/components/mainpage/admin")), 'mainpage');


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: homepage
    },
    {
      path: '/problem',
      name: 'problem',
      component: problem,
    },
    {
      path: '/problemdetail',
      name: 'problemdetail',
      component: problemdetail,
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    },
    {
      path: '/statue',
      name: 'statue',
      component: statue
    },
    {
      path: '/user',
      name: 'user',
      component: user
    },
    {
      path: '/setting',
      name: 'setting',
      component: setting
    },
  ]
})
