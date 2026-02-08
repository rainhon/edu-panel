<template>
  <div class="omise-payment-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>信用卡支付</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>

      <!-- 账单信息 -->
      <el-descriptions :column="2" border v-if="invoice" class="mb-20">
        <el-descriptions-item label="账单ID">{{ invoice.id }}</el-descriptions-item>
        <el-descriptions-item label="课程名称">
          {{ invoice.course?.name || invoice.course_name || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="应付金额">¥{{ invoice.amount }} (JPY)</el-descriptions-item>
        <el-descriptions-item label="账单月份">{{ invoice.billing_month }}</el-descriptions-item>
      </el-descriptions>

      <el-alert
        title="安全支付提示"
        type="info"
        :closable="false"
        show-icon
        class="mb-20"
      >
        <template #default>
          <p>• 使用 Omise 安全支付网关，支持 Visa、Mastercard 等主流信用卡</p>
          <p>• 支付货币：日元（JPY）</p>
          <p>• 测试模式：卡号 4242 4242 4242 4242，过期日期任意未来日期，安全码任意3位数字</p>
        </template>
      </el-alert>

      <!-- 支付金额输入 -->
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="支付金额" prop="amount">
          <el-input-number
            v-model="formData.amount"
            :precision="0"
            :min="0"
            :max="invoice?.amount || 999999"
            :disabled="loading"
          />
          <span class="unit">日元 (JPY)</span>
        </el-form-item>

        <el-divider content-position="left">信用卡信息</el-divider>

        <!-- Omise 信用卡表单 -->
        <div class="card-form">
          <form id="checkoutForm" name="checkoutForm">
            <el-form-item label="卡号" required>
              <input
                type="text"
                v-model="cardNumber"
                placeholder="4242 4242 4242 4242"
                maxlength="20"
                class="card-input"
                :disabled="loading"
                @input="formatCardNumber"
              />
              <div v-if="errors.cardNumber" class="error-text">{{ errors.cardNumber }}</div>
            </el-form-item>

            <el-form-item label="持卡人姓名" required>
              <el-input
                v-model="cardHolderName"
                placeholder="输入持卡人姓名"
                :disabled="loading"
                @input="clearError('cardHolderName')"
              />
              <div v-if="errors.cardHolderName" class="error-text">{{ errors.cardHolderName }}</div>
            </el-form-item>

            <div class="form-row">
              <el-form-item label="过期日期" required class="expiry-item">
                <input
                  type="text"
                  v-model="cardExpiry"
                  placeholder="MM/YY"
                  maxlength="5"
                  class="card-input small-input"
                  :disabled="loading"
                  @input="formatCardExpiry"
                />
                <div v-if="errors.cardExpiry" class="error-text">{{ errors.cardExpiry }}</div>
              </el-form-item>

              <el-form-item label="安全码" required class="cvv-item">
                <input
                  type="text"
                  v-model="cardSecurityCode"
                  placeholder="123"
                  maxlength="4"
                  class="card-input small-input"
                  :disabled="loading"
                />
                <div v-if="errors.cardSecurityCode" class="error-text">{{ errors.cardSecurityCode }}</div>
              </el-form-item>
            </div>
          </form>
        </div>

        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="formData.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注（可选）"
            :disabled="loading"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleSubmit"
            :loading="loading"
            :disabled="!omiseConfigLoaded"
            size="large"
          >
            <template v-if="loading">
              处理中...
            </template>
            <template v-else>
              确认支付 ¥{{ formData.amount }} (JPY)
            </template>
          </el-button>
          <el-button @click="handleCancel" size="large" :disabled="loading">取消</el-button>
        </el-form-item>

        <div v-if="!omiseConfigLoaded" class="loading-config">
          <el-icon class="is-loading"><Loading /></el-icon>
          加载支付配置中...
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentInvoiceStore } from '@/stores/student/invoices'
import { getOmiseConfig, createOmisePayment } from '@/api/omise'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const invoiceStore = useStudentInvoiceStore()

const formRef = ref()
const loading = ref(false)
const omiseConfigLoaded = ref(false)
const invoiceId = route.params.id

const invoice = computed(() => invoiceStore.currentInvoice)

const formData = reactive({
  amount: 0,
  notes: ''
})

// 信用卡信息
const cardNumber = ref('')
const cardHolderName = ref('')
const cardExpiry = ref('')
const cardSecurityCode = ref('')

const errors = reactive({
  cardNumber: null,
  cardHolderName: null,
  cardExpiry: null,
  cardSecurityCode: null
})

const rules = {
  amount: [
    {
      required: true,
      message: '请输入支付金额',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (value === undefined || value === null || value === '') {
          callback(new Error('请输入支付金额'))
        } else if (value <= 0) {
          callback(new Error('支付金额必须大于0'))
        } else {
          callback()
        }
      }
    }
  ]
}

let omiseScript = null

onMounted(async () => {
  await invoiceStore.fetchMyInvoiceDetail(invoiceId)

  // 使用 nextTick 确保 DOM 更新后再设置金额
  await nextTick()

  if (invoice.value) {
    formData.amount = parseFloat(invoice.value.amount) || 0
    console.log('初始化支付金额:', formData.amount)
  }

  await loadOmiseConfig()
})

onUnmounted(() => {
  // 清理 Omise 脚本
  if (omiseScript && document.head.contains(omiseScript)) {
    document.head.removeChild(omiseScript)
  }
})

const loadOmiseConfig = async () => {
  try {
    const response = await getOmiseConfig()
    if (response.success) {
      const publicKey = response.data.public_key

      // 动态加载 Omise.js
      if (typeof Omise === 'undefined') {
        omiseScript = document.createElement('script')
        omiseScript.src = 'https://cdn.omise.co/omise.js'
        omiseScript.onload = () => {
          // 设置 Omise 公钥
          if (typeof Omise !== 'undefined') {
            Omise.setPublicKey(publicKey)
            omiseConfigLoaded.value = true
          }
        }
        omiseScript.onerror = () => {
          ElMessage.error('支付组件加载失败')
        }
        document.head.appendChild(omiseScript)
      } else {
        Omise.setPublicKey(publicKey)
        omiseConfigLoaded.value = true
      }
    }
  } catch (error) {
    ElMessage.error('加载支付配置失败')
    console.error('Failed to load Omise config:', error)
  }
}

// 格式化卡号（每4位加空格）
const formatCardNumber = () => {
  let value = cardNumber.value.replace(/\s/g, '').replace(/\D/g, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  cardNumber.value = formattedValue
  clearError('cardNumber')
}

// 格式化过期日期
const formatCardExpiry = () => {
  let value = cardExpiry.value.replace(/\D/g, '')

  if (value.length >= 2) {
    let month = value.substring(0, 2)
    let year = value.substring(2, 4)

    // 验证月份
    if (parseInt(month) > 12) {
      month = '12'
    }
    if (parseInt(month) < 1 && value.length >= 2) {
      month = '01'
    }

    value = month
    if (year) {
      value += '/' + year
    }
  }

  cardExpiry.value = value
  clearError('cardExpiry')
}

const clearError = (field) => {
  errors[field] = null
}

const validateCard = () => {
  let isValid = true

  // 验证卡号
  const cleanedCardNumber = cardNumber.value.replace(/\s/g, '')
  if (!cleanedCardNumber || cleanedCardNumber.length < 13) {
    errors.cardNumber = '请输入有效的卡号'
    isValid = false
  }

  // 验证持卡人姓名
  if (!cardHolderName.value || cardHolderName.value.trim() === '') {
    errors.cardHolderName = '请输入持卡人姓名'
    isValid = false
  }

  // 验证过期日期
  if (!cardExpiry.value || cardExpiry.value.length < 5) {
    errors.cardExpiry = '请输入有效的过期日期'
    isValid = false
  }

  // 验证安全码
  if (!cardSecurityCode.value || cardSecurityCode.value.length < 3) {
    errors.cardSecurityCode = '请输入有效的安全码'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  try {
    // 调试：打印当前金额
    console.log('当前支付金额:', formData.amount, typeof formData.amount)
    console.log('账单金额:', invoice.value?.amount)

    await formRef.value.validate()

    if (!validateCard()) {
      return
    }

    if (!omiseConfigLoaded.value) {
      ElMessage.error('支付配置未加载完成，请稍后重试')
      return
    }

    // 确保金额有效
    if (!formData.amount || formData.amount <= 0) {
      ElMessage.error('支付金额无效')
      return
    }

    loading.value = true

    // 解析过期日期
    const expiryParts = cardExpiry.value.split('/')
    const expiryMonth = expiryParts[0]
    const expiryYear = '20' + expiryParts[1]

    // 使用 Omise.js 创建 token
    if (typeof Omise === 'undefined') {
      ElMessage.error('支付组件未加载')
      loading.value = false
      return
    }

    const cleanedCardNumber = cardNumber.value.replace(/\s/g, '')

    Omise.createToken('card', {
      name: cardHolderName.value,
      number: cleanedCardNumber,
      expiration_month: parseInt(expiryMonth),
      expiration_year: parseInt(expiryYear),
      security_code: cardSecurityCode.value
    }, function(statusCode, response) {
      if (statusCode === 200) {
        // Token 创建成功，执行支付
        executePayment(response.id)
      } else {
        loading.value = false
        const errorMessage = response.message || '创建支付令牌失败'
        ElMessage.error(errorMessage)
        console.error('Omise token creation failed:', response)
      }
    })
  } catch (error) {
    loading.value = false
    ElMessage.error('请检查表单填写是否正确')
    console.error('Payment error:', error)
  }
}

const executePayment = async (token) => {
  try {
    // 确保金额是数字类型
    const paymentAmount = Number(formData.amount)
    console.log('发送支付金额:', paymentAmount, typeof paymentAmount)

    const result = await createOmisePayment(invoiceId, {
      token: token,
      amount: paymentAmount,
      notes: formData.notes,
      return_uri: `${window.location.origin}/student/invoices`
    })

    if (result.success) {
      const { status, charge_id } = result.data

      if (status === 'successful') {
        ElMessage.success('支付成功')
        setTimeout(() => {
          router.push(`/student/invoices/${invoiceId}`)
        }, 1500)
      } else if (status === 'pending') {
        ElMessage.info('支付处理中，请稍后查看')
        setTimeout(() => {
          router.push(`/student/invoices/${invoiceId}`)
        }, 1500)
      } else {
        ElMessage.error('支付失败，请重试')
      }
    } else {
      ElMessage.error(result.message || '支付失败')
    }
  } catch (error) {
    ElMessage.error('支付请求失败')
    console.error('Execute payment error:', error)
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
.omise-payment-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
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

.card-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-input {
  width: 100%;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 12px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.card-input:hover {
  border-color: #c0c4cc;
}

.card-input:focus {
  outline: none;
  border-color: #409eff;
}

.card-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  color: #909399;
}

.small-input {
  width: 120px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.expiry-item,
.cvv-item {
  flex: 1;
}

.error-text {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.5;
}

.loading-config {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 14px;
}

.loading-config .el-icon {
  margin-right: 8px;
}

.el-divider {
  margin: 30px 0;
}

#checkoutForm {
  width: 100%;
}
</style>
