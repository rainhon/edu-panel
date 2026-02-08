<template>
  <el-container class="student-layout">
    <el-aside width="200px">
      <AppSidebar :menu-items="studentMenus" />
    </el-aside>
    <el-container>
      <el-header>
        <AppHeader title="学生管理平台" />
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

const studentMenus = ref([
  {
    path: '/student',
    title: '仪表板',
    icon: 'Odometer'
  },
  {
    path: '/student/courses',
    title: '我的课程',
    icon: 'Reading'
  },
  {
    path: '/student/invoices',
    title: '我的账单',
    icon: 'Tickets'
  }
])
</script>

<style scoped>
.student-layout {
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
