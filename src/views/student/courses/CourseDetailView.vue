<template>
  <div class="course-detail-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>课程详情</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border v-if="course">
        <el-descriptions-item label="课程名称">{{ course.name }}</el-descriptions-item>
        <el-descriptions-item label="课程月份">{{ course.course_month }}</el-descriptions-item>
        <el-descriptions-item label="授课教师">{{ course.teacher_name }}</el-descriptions-item>
        <el-descriptions-item label="课程费用">¥{{ course.fee }}</el-descriptions-item>
        <el-descriptions-item label="最大学生数">{{ course.max_students }}人</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(course.status)">
            {{ formatStatus(course.status) }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentCourseStore } from '@/stores/student/courses'

const router = useRouter()
const route = useRoute()
const courseStore = useStudentCourseStore()

const courseId = route.params.id
const course = computed(() => courseStore.currentCourse)

onMounted(async () => {
  await courseStore.fetchMyCourseDetail(courseId)
})

const handleBack = () => {
  router.push('/student/courses')
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
.course-detail-view {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
