<template>
  <div class="payment-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>支付账单</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border v-if="invoice" class="mb-20">
        <el-descriptions-item label="账单ID">{{ invoice.id }}</el-descriptions-item>
        <el-descriptions-item label="课程名称">{{ invoice.course_name }}</el-descriptions-item>
        <el-descriptions-item label="应付金额">¥{{ invoice.amount }}</el-descriptions-item>
        <el-descriptions-item label="账单月份">{{ invoice.billing_month }}</el-descriptions-item>
      </el-descriptions>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="支付金额" prop="amount">
          <el-input-number
            v-model="formData.amount"
            :precision="2"
            :min="0"
            :max="invoice?.amount || 999999"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="支付方式" prop="payment_method">
          <el-radio-group v-model="formData.payment_method">
            <el-radio label="wechat">微信支付</el-radio>
            <el-radio label="alipay">支付宝</el-radio>
            <el-radio label="cash">现金</el-radio>
            <el-radio label="bank_transfer">银行转账</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="formData.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注（可选）"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            确认支付
          </el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentInvoiceStore } from '@/stores/student/invoices'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const invoiceStore = useStudentInvoiceStore()

const formRef = ref()
const loading = ref(false)
const invoiceId = route.params.id

const invoice = computed(() => invoiceStore.currentInvoice)

const formData = reactive({
  amount: 0,
  payment_method: 'wechat',
  notes: ''
})

const rules = {
  amount: [
    { required: true, message: '请输入支付金额', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '支付金额必须大于0', trigger: 'blur' }
  ],
  payment_method: [
    { required: true, message: '请选择支付方式', trigger: 'change' }
  ]
}

onMounted(async () => {
  await invoiceStore.fetchMyInvoiceDetail(invoiceId)
  if (invoice.value) {
    formData.amount = invoice.value.amount
  }
})

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true

    const result = await invoiceStore.payInvoice(invoiceId, formData)

    if (result.success) {
      ElMessage.success('支付成功')
      router.push(`/student/invoices/${invoiceId}`)
    } else {
      ElMessage.error(result.message || '支付失败')
    }
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push(`/student/invoices/${invoiceId}`)
}

const handleBack = () => {
  router.push('/student/invoices')
}
</script>

<style scoped>
.payment-view {
  padding: 20px;
  max-width: 800px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit {
  margin-left: 10px;
  color: #909399;
}

.mb-20 {
  margin-bottom: 20px;
}
</style>
