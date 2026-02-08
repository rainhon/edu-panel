<template>
  <div class="invoice-list-view">
    <el-card>
      <template #header>
        <span>我的账单</span>
      </template>

      <el-table :data="invoices" :loading="loading" stripe>
        <el-table-column prop="id" label="账单ID" width="80" />
        <el-table-column prop="course_name" label="课程名称" />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="billing_month" label="账单月份" width="120" />
        <el-table-column prop="due_date" label="到期日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ formatStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button
              v-if="['sent', 'pending'].includes(row.status)"
              type="success"
              size="small"
              @click="handlePay(row)"
            >
              支付
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
import { useStudentInvoiceStore } from '@/stores/student/invoices'

const router = useRouter()
const invoiceStore = useStudentInvoiceStore()

const loading = computed(() => invoiceStore.loading)
const invoices = computed(() => invoiceStore.invoices)

onMounted(() => {
  invoiceStore.fetchMyInvoices()
})

const handleView = (row) => {
  router.push(`/student/invoices/${row.id}`)
}

const handlePay = (row) => {
  router.push(`/student/invoices/${row.id}/pay`)
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
.invoice-list-view {
  padding: 20px;
}
</style>
