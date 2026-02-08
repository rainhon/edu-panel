<template>
  <div class="dashboard-view">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon stat-icon-primary">
              <el-icon size="30"><Reading /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ courseCount }}</h3>
              <p>总课程数</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon stat-icon-success">
              <el-icon size="30"><Tickets /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ invoiceCount }}</h3>
              <p>总账单数</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon stat-icon-warning">
              <el-icon size="30"><User /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ studentCount }}</h3>
              <p>学生总数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="mt-20">
      <template #header>
        <div class="card-header">
          <span>欢迎使用教师管理平台</span>
        </div>
      </template>
      <p>这里是教师仪表板，您可以：</p>
      <ul>
        <li>管理您的课程</li>
        <li>创建和发送账单</li>
        <li>查看学生信息</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTeacherCourseStore } from '@/stores/teacher/courses'
import { useTeacherInvoiceStore } from '@/stores/teacher/invoices'

const courseStore = useTeacherCourseStore()
const invoiceStore = useTeacherInvoiceStore()

const courseCount = ref(0)
const invoiceCount = ref(0)
const studentCount = ref(0)

onMounted(async () => {
  await courseStore.fetchCourses()
  await invoiceStore.fetchInvoices()

  courseCount.value = courseStore.courses.length
  invoiceCount.value = invoiceStore.invoices.length

  // 计算学生总数
  const students = new Set()
  courseStore.courses.forEach(course => {
    if (course.students) {
      course.students.forEach(student => {
        students.add(student.id)
      })
    }
  })
  studentCount.value = students.size
})
</script>

<style scoped>
.dashboard-view {
  padding: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-icon-primary {
  background-color: var(--el-color-primary, #409eff);
}

.stat-icon-success {
  background-color: var(--el-color-success, #67c23a);
}

.stat-icon-warning {
  background-color: var(--el-color-warning, #e6a23c);
}

.stat-info h3 {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.stat-info p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
