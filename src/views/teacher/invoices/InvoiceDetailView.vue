<template>
  <div class="invoice-detail-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>账单详情</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border v-if="invoice">
        <el-descriptions-item label="账单ID">{{ invoice.id }}</el-descriptions-item>
        <el-descriptions-item label="学生姓名">{{ invoice.student?.name || invoice.student_name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="课程名称">{{ invoice.course?.name || invoice.course_name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="金额">¥{{ invoice.amount }}</el-descriptions-item>
        <el-descriptions-item label="账单月份">{{ invoice.billing_month }}</el-descriptions-item>
        <el-descriptions-item label="到期日期">{{ invoice.due_date }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(invoice.status)">
            {{ formatStatus(invoice.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ invoice.created_at }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">
          {{ invoice.notes || '-' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTeacherInvoiceStore } from '@/stores/teacher/invoices'

const router = useRouter()
const route = useRoute()
const invoiceStore = useTeacherInvoiceStore()

const invoiceId = route.params.id
const invoice = computed(() => invoiceStore.currentInvoice)

onMounted(async () => {
  await invoiceStore.fetchInvoiceDetail(invoiceId)
})

const handleBack = () => {
  router.push('/teacher/invoices')
}

const getStatusType = (status) => {
  const typeMap = {
    draft: 'info',
    sent: '',
    pending: 'warning',
    paid: 'success',
    cancelled: 'danger',
    refunded: 'danger',
    overdue: 'danger'
  }
  return typeMap[status] || ''
}

const formatStatus = (status) => {
  const statusMap = {
    draft: '草稿',
    sent: '已发送',
    pending: '待支付',
    paid: '已支付',
    cancelled: '已取消',
    refunded: '已退款',
    overdue: '逾期'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.invoice-detail-view {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
