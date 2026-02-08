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
        <el-descriptions-item label="课程名称">{{ invoice.course_name }}</el-descriptions-item>
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

    <el-card class="mt-20" v-if="invoice">
      <template #header>
        <span>支付记录</span>
      </template>
      <el-empty v-if="payments.length === 0" description="暂无支付记录" />
      <el-table v-else :data="payments" stripe>
        <el-table-column prop="id" label="支付ID" width="80" />
        <el-table-column prop="amount" label="支付金额" width="100">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getPaymentStatusType(row.status)">
              {{ formatPaymentStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="支付时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentInvoiceStore } from '@/stores/student/invoices'

const router = useRouter()
const route = useRoute()
const invoiceStore = useStudentInvoiceStore()

const invoiceId = route.params.id
const invoice = computed(() => invoiceStore.currentInvoice)
const payments = computed(() => invoiceStore.payments)

onMounted(async () => {
  await invoiceStore.fetchMyInvoiceDetail(invoiceId)
  await invoiceStore.fetchInvoicePayments(invoiceId)
})

const handleBack = () => {
  router.push('/student/invoices')
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

const getPaymentStatusType = (status) => {
  const typeMap = {
    success: 'success',
    failed: 'danger',
    refunding: 'warning',
    refunded: 'info'
  }
  return typeMap[status] || ''
}

const formatPaymentStatus = (status) => {
  const statusMap = {
    success: '成功',
    failed: '失败',
    refunding: '退款中',
    refunded: '已退款'
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
