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
              <p>我的课程</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon stat-icon-warning">
              <el-icon size="30"><Tickets /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ unpaidCount }}</h3>
              <p>待支付账单</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon stat-icon-success">
              <el-icon size="30"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <h3>{{ paidCount }}</h3>
              <p>已支付账单</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="mt-20">
      <template #header>
        <div class="card-header">
          <span>欢迎使用学生管理平台</span>
        </div>
      </template>
      <p>这里是学生仪表板，您可以：</p>
      <ul>
        <li>查看您的课程</li>
        <li>查看和支付账单</li>
        <li>查看支付记录</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStudentCourseStore } from '@/stores/student/courses'
import { useStudentInvoiceStore } from '@/stores/student/invoices'

const courseStore = useStudentCourseStore()
const invoiceStore = useStudentInvoiceStore()

const courseCount = ref(0)
const unpaidCount = ref(0)
const paidCount = ref(0)

onMounted(async () => {
  await courseStore.fetchMyCourses()
  await invoiceStore.fetchMyInvoices()

  courseCount.value = courseStore.courses.length
  unpaidCount.value = invoiceStore.unpaidInvoices.length
  paidCount.value = invoiceStore.paidInvoices.length
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
