<template>
  <el-container class="teacher-layout">
    <el-aside width="200px">
      <AppSidebar :menu-items="teacherMenus" />
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader title="教师管理平台" />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'

const teacherMenus = ref([
  {
    path: '/teacher',
    title: '仪表板',
    icon: 'Odometer'
  },
  {
    path: '/teacher/courses',
    title: '课程管理',
    icon: 'Reading'
  },
  {
    path: '/teacher/invoices',
    title: '账单管理',
    icon: 'Tickets'
  }
])
</script>

<style scoped>
.teacher-layout {
  height: 100vh;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid var(--el-border-color, #e6e6e6);
  padding: 0;
  height: 60px;
}

.el-main {
  background-color: var(--el-bg-color-page, #f5f7fa);
  padding: 20px;
}
</style>
