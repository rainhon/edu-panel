import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const routes = [
  // 公共路由（不需要认证）
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { layout: 'AuthLayout', requiresAuth: false }
  },

  // 教师路由
  {
    path: '/teacher',
    meta: { requiresAuth: true, role: 'teacher', layout: 'TeacherLayout' },
    children: [
      {
        path: '',
        name: 'TeacherDashboard',
        component: () => import('@/views/teacher/DashboardView.vue')
      },
      // 课程管理
      {
        path: 'courses',
        name: 'TeacherCourses',
        component: () => import('@/views/teacher/courses/CourseListView.vue')
      },
      {
        path: 'courses/create',
        name: 'TeacherCourseCreate',
        component: () => import('@/views/teacher/courses/CourseFormView.vue'),
        meta: { action: 'create' }
      },
      {
        path: 'courses/:id',
        name: 'TeacherCourseDetail',
        component: () => import('@/views/teacher/courses/CourseDetailView.vue')
      },
      {
        path: 'courses/:id/edit',
        name: 'TeacherCourseEdit',
        component: () => import('@/views/teacher/courses/CourseFormView.vue'),
        meta: { action: 'edit' }
      },
      // 账单管理
      {
        path: 'invoices',
        name: 'TeacherInvoices',
        component: () => import('@/views/teacher/invoices/InvoiceListView.vue')
      },
      {
        path: 'invoices/create',
        name: 'TeacherInvoiceCreate',
        component: () => import('@/views/teacher/invoices/InvoiceFormView.vue'),
        meta: { action: 'create' }
      },
      {
        path: 'invoices/:id',
        name: 'TeacherInvoiceDetail',
        component: () => import('@/views/teacher/invoices/InvoiceDetailView.vue')
      },
      {
        path: 'invoices/:id/edit',
        name: 'TeacherInvoiceEdit',
        component: () => import('@/views/teacher/invoices/InvoiceFormView.vue'),
        meta: { action: 'edit' }
      }
    ]
  },

  // 学生路由
  {
    path: '/student',
    meta: { requiresAuth: true, role: 'student', layout: 'StudentLayout' },
    children: [
      {
        path: '',
        name: 'StudentDashboard',
        component: () => import('@/views/student/DashboardView.vue')
      },
      // 我的课程
      {
        path: 'courses',
        name: 'StudentCourses',
        component: () => import('@/views/student/courses/CourseListView.vue')
      },
      {
        path: 'courses/:id',
        name: 'StudentCourseDetail',
        component: () => import('@/views/student/courses/CourseDetailView.vue')
      },
      // 我的账单
      {
        path: 'invoices',
        name: 'StudentInvoices',
        component: () => import('@/views/student/invoices/InvoiceListView.vue')
      },
      {
        path: 'invoices/:id',
        name: 'StudentInvoiceDetail',
        component: () => import('@/views/student/invoices/InvoiceDetailView.vue')
      },
      {
        path: 'invoices/:id/pay',
        name: 'StudentInvoicePay',
        component: () => import('@/views/student/invoices/PaymentView.vue')
      }
    ]
  },

  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  },

  // 根路径重定向
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 如果没有 token，跳转到登录页
    if (!authStore.token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // 如果有 token 但没有用户信息，获取用户信息
    if (!authStore.isAuthenticated) {
      try {
        await authStore.fetchUserInfo()
      } catch (error) {
        next('/login')
        return
      }
    }

    // 检查角色权限
    if (to.meta.role) {
      const userStore = useUserStore()
      if (userStore.userType !== to.meta.role) {
        // 角色不匹配，跳转到对应的首页
        const redirectPath = userStore.userType === 'teacher' ? '/teacher' : '/student'
        next(redirectPath)
        return
      }
    }
  } else {
    // 如果已登录且访问登录页，重定向到对应的首页
    if (to.path === '/login' && authStore.token) {
      if (!authStore.isAuthenticated) {
        try {
          await authStore.fetchUserInfo()
        } catch (error) {
          return next()
        }
      }

      const userStore = useUserStore()
      const redirectPath = userStore.userType === 'teacher' ? '/teacher' : '/student'
      next(redirectPath)
      return
    }
  }

  next()
})

export default router
