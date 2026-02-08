<template>
  <div class="invoice-list-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>账单管理</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新建账单
          </el-button>
        </div>
      </template>

      <el-table :data="invoices" :loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="学生姓名">
          <template #default="{ row }">
            {{ row.student?.name || row.student_name || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="课程名称">
          <template #default="{ row }">
            {{ row.course?.name || row.course_name || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="billing_month" label="账单月份" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ formatStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              查看
            </el-button>
            <el-button type="warning" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              v-if="row.status === 'draft'"
              type="success"
              size="small"
              @click="handleSend(row)"
            >
              发送
            </el-button>
            <el-popconfirm
              title="确定删除此账单吗？"
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
import { useTeacherInvoiceStore } from '@/stores/teacher/invoices'
import { ElMessage } from 'element-plus'

const router = useRouter()
const invoiceStore = useTeacherInvoiceStore()

const loading = computed(() => invoiceStore.loading)
const invoices = computed(() => invoiceStore.invoices)

onMounted(() => {
  invoiceStore.fetchInvoices()
})

const handleCreate = () => {
  router.push('/teacher/invoices/create')
}

const handleView = (row) => {
  router.push(`/teacher/invoices/${row.id}`)
}

const handleEdit = (row) => {
  router.push(`/teacher/invoices/${row.id}/edit`)
}

const handleSend = async (row) => {
  const result = await invoiceStore.sendInvoice(row.id)
  if (result.success) {
    ElMessage.success('发送成功')
  } else {
    ElMessage.error(result.message || '发送失败')
  }
}

const handleDelete = async (row) => {
  const result = await invoiceStore.deleteInvoice(row.id)
  if (result.success) {
    ElMessage.success('删除成功')
  } else {
    ElMessage.error(result.message || '删除失败')
  }
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
