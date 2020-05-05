import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


// Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect:'/index',
    component: Home,
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('../views/Index.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/newContract',
    name: 'NewContract',
    component: () => import('../views/contract_manage/NewContract.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/reviewinglist',
    name: 'ReviewingList',
    component: () => import('../views/contract_manage/ReviewingList.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/contractinfo',
    name: 'ContractInfo',
    component: () => import('../views/contract_manage/ContractInfo.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/reviewing',
    name: 'Reviewing',
    component: () => import('../views/contract_manage/Reviewing.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/executingList',
    name: 'ExecutingList',
    component: () => import('../views/contract_manage/ExecutingList.vue'),
    meta: {
      requireAuth: true,
    }
  },

  {
    path: '/modifycontract',
    component: () => import('../views/contract_manage/ModifyContract.vue'),
    name: 'ModifyContract',
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/executing',
    component: () => import('../views/contract_manage/Executing.vue'),
    name: 'Executing',
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/waitreviewlist',
    component: () => import('@/views/review_list/waitReviewList.vue'),
    name: 'WaitReviewList',
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/approvedlist',
    component: () => import('@/views/review_list/approvedList.vue'),
    name: 'ApprovedList',
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/waitreview',
    component: () => import('@/views/review_list/waitReview.vue'),
    name: 'WaitReview',
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/approved',
    component: () => import('@/views/review_list/approved.vue'),
    name: 'Approved',
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/changecontract',
    component: () => import('@/views/contract_manage/ChangeContract.vue'),
    name: 'ChangeContract',
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/changeReview',
    component: () => import('@/views/review_list/changeReview.vue'),
    name: 'ChangeReview',
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/stopReview',
    component: () => import('@/views/review_list/stopReview.vue'),
    name: 'StopReview',
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/filedlist',
    component: () => import('@/views/contract_manage/FiledList.vue'),
    name: 'FiledList',
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/filed',
    component: () => import('@/views/contract_manage/Filed.vue'),
    name: 'Filed',
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/templatedownload',
    name: 'TemplateDownload',
    component: () => import('../views/template_manage/TemplateDownload.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/templatemanage',
    name: 'TemplateManage',
    component: () => import('../views/template_manage/TemplateManage.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/userinfo',
    name: 'UserInfo',
    component: () => import('../views/UserInfo.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/receipt',
    name: 'MyReceipt',
    component: () => import('../views/receipts_manage/MyReceipt.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path: '/receipt/info',
    name: 'ReceiptInfo',
    component: () => import('../views/receipts_manage/ReceiptInfo.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path:'/receipt/leaderapprove',
    name:'LeaderApprove',
    component: () => import('../views/receipts_manage/LeaderWaitApprove.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path:'/receipt/leaderapprove/info',
    name:'LeaderApproveInfo',
    component: () => import('../views/receipts_manage/LeaderApprove.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path:'/receipt/financeapprove',
    name:'FinanceApprove',
    component: () => import('../views/receipts_manage/FinanceWaitApprove.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path:'/receipt/financeapprove/info',
    name:'FinanceApproveInfo',
    component: () => import('../views/receipts_manage/FinanceApprove.vue'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path:'/receipt/approved',
    name:'ApprovedReceipt',
    component: () => import('../views/receipts_manage/MyApproved.vue'),
    meta: {
      requireAuth: true,
    }
  },
]

const router = new VueRouter({
  routes
})

export default router
