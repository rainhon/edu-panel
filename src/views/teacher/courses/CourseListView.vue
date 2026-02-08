<template>
  <div class="course-list-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>课程管理</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新建课程
          </el-button>
        </div>
      </template>

      <el-table :data="courses" :loading="loading" stripe>
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="course_month" label="课程月份" width="120" />
        <el-table-column prop="fee" label="费用" width="100">
          <template #default="{ row }">
            ¥{{ row.fee }}
          </template>
        </el-table-column>
        <el-table-column prop="max_students" label="最大学生数" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ formatStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除此课程吗？"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTeacherCourseStore } from '@/stores/teacher/courses'
import { ElMessage } from 'element-plus'

const router = useRouter()
const courseStore = useTeacherCourseStore()

const loading = computed(() => courseStore.loading)
const courses = computed(() => courseStore.courses)

onMounted(() => {
  courseStore.fetchCourses()
})

const handleCreate = () => {
  router.push('/teacher/courses/create')
}

const handleView = (row) => {
  router.push(`/teacher/courses/${row.id}`)
}

const handleEdit = (row) => {
  router.push(`/teacher/courses/${row.id}/edit`)
}

const handleDelete = async (row) => {
  const result = await courseStore.deleteCourse(row.id)
  if (result.success) {
    ElMessage.success('删除成功')
  } else {
    ElMessage.error(result.message || '删除失败')
  }
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
