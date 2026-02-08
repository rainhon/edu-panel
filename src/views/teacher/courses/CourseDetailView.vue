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
        <el-descriptions-item label="课程费用">¥{{ course.fee }}</el-descriptions-item>
        <el-descriptions-item label="最大学生数">{{ course.max_students }}人</el-descriptions-item>
        <el-descriptions-item label="当前学生数">
          {{ course.students?.length || 0 }}人
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(course.status)">
            {{ formatStatus(course.status) }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="mt-20" v-if="course">
      <template #header>
        <div class="card-header">
          <span>学生列表</span>
          <el-button type="primary" @click="showStudentSelector = true">
            <el-icon><Plus /></el-icon>
            添加学生
          </el-button>
        </div>
      </template>

      <el-empty v-if="!course.students || course.students.length === 0" description="暂无学生" />

      <el-table v-else :data="course.students" stripe>
        <el-table-column prop="name" label="学生姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-popconfirm
              title="确定移除此学生吗？"
              @confirm="handleRemoveStudent(row)"
            >
              <template #reference>
                <el-button type="danger" size="small">移除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 学生选择器对话框 -->
    <StudentSelector
      v-model="showStudentSelector"
      :exclude-ids="existingStudentIds"
      @confirm="handleAddStudents"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTeacherCourseStore } from '@/stores/teacher/courses'
import StudentSelector from '@/components/common/StudentSelector.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const courseStore = useTeacherCourseStore()

const courseId = route.params.id
const course = computed(() => courseStore.currentCourse)
const showStudentSelector = ref(false)

// 已添加的学生ID列表
const existingStudentIds = computed(() => {
  return course.value?.students?.map(s => s.id) || []
})

onMounted(async () => {
  await courseStore.fetchCourseDetail(courseId)
})

const handleBack = () => {
  router.push('/teacher/courses')
}

const handleRemoveStudent = async (student) => {
  const result = await courseStore.removeStudent(courseId, student.id)
  if (result.success) {
    ElMessage.success('移除成功')
    await courseStore.fetchCourseDetail(courseId)
  } else {
    ElMessage.error(result.message || '移除失败')
  }
}

// 添加学生
const handleAddStudents = async (students) => {
  const studentIds = students.map(s => s.id)

  const result = await courseStore.addStudents(courseId, {
    student_ids: studentIds
  })

  if (result.success) {
    ElMessage.success(`成功添加 ${students.length} 名学生`)
    await courseStore.fetchCourseDetail(courseId)
  } else {
    ElMessage.error(result.message || '添加失败')
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
.course-detail-view {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
