<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import TeacherLayout from '@/layouts/TeacherLayout.vue'
import StudentLayout from '@/layouts/StudentLayout.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// 根据路由 meta 配置选择布局
const layout = computed(() => {
  const layoutName = route.meta.layout || 'AuthLayout'
  const layouts = {
    AuthLayout,
    TeacherLayout,
    StudentLayout
  }
  return layouts[layoutName] || AuthLayout
})

// 初始化时获取用户信息
watch(() => authStore.token, (token) => {
  if (token && !authStore.isAuthenticated) {
    authStore.fetchUserInfo()
  }
}, { immediate: true })
</script>

<style>
#app {
  width: 100%;
  height: 100vh;
}
</style>
