<template>
  <div class="course-list-view">
    <el-card>
      <template #header>
        <span>我的课程</span>
      </template>

      <el-table :data="courses" :loading="loading" stripe>
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="course_month" label="课程月份" width="120" />
        <el-table-column prop="teacher_name" label="授课教师" width="120" />
        <el-table-column prop="fee" label="费用" width="100">
          <template #default="{ row }">
            ¥{{ row.fee }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ formatStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentCourseStore } from '@/stores/student/courses'

const router = useRouter()
const courseStore = useStudentCourseStore()

const loading = computed(() => courseStore.loading)
const courses = computed(() => courseStore.courses)

onMounted(() => {
  courseStore.fetchMyCourses()
})

const handleView = (row) => {
  router.push(`/student/courses/${row.id}`)
}

const getStatusType = (status) => {
  const typeMap = {
    planning: 'info',
    ongoing: 'success',
    completed: '',
    cancelled: 'danger'
  }
  return typeMap[status] || ''
}

const formatStatus = (status) => {
  const statusMap = {
    planning: '计划中',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.course-list-view {
  padding: 20px;
}
</style>
