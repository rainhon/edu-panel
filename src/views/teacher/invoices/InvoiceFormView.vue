<template>
  <div class="invoice-form-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑账单' : '新建账单' }}</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="课程" prop="course_id">
          <el-select
            v-model="formData.course_id"
            placeholder="请选择课程"
            @change="handleCourseChange"
          >
            <el-option
              v-for="course in courses"
              :key="course.id"
              :label="`${course.name} (${course.course_month})`"
              :value="course.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="学生" prop="student_id">
          <el-select v-model="formData.student_id" placeholder="请选择学生">
            <el-option
              v-for="student in students"
              :key="student.id"
              :label="student.name"
              :value="student.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="金额" prop="amount">
          <el-input-number
            v-model="formData.amount"
            :precision="2"
            :min="0"
            :max="999999"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="账单月份" prop="billing_month">
          <el-date-picker
            v-model="formData.billing_month"
            type="month"
            placeholder="选择月份"
            format="YYYY年MM月"
            value-format="YYYY-MM"
          />
        </el-form-item>

        <el-form-item label="到期日期" prop="due_date">
          <el-date-picker
            v-model="formData.due_date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="formData.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            {{ isEdit ? '更新' : '创建' }}
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
import { useTeacherInvoiceStore } from '@/stores/teacher/invoices'
import { useTeacherCourseStore } from '@/stores/teacher/courses'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const invoiceStore = useTeacherInvoiceStore()
const courseStore = useTeacherCourseStore()

const formRef = ref()
const loading = ref(false)
const invoiceId = route.params.id

const isEdit = computed(() => !!invoiceId && route.meta.action === 'edit')

const courses = computed(() => courseStore.courses)
const students = ref([])

const formData = reactive({
  course_id: null,
  student_id: null,
  amount: 0,
  billing_month: '',
  due_date: '',
  notes: ''
})

const rules = {
  course_id: [
    { required: true, message: '请选择课程', trigger: 'change' }
  ],
  student_id: [
    { required: true, message: '请选择学生', trigger: 'change' }
  ],
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' }
  ],
  billing_month: [
    { required: true, message: '请选择账单月份', trigger: 'change' }
  ]
}

onMounted(async () => {
  await courseStore.fetchCourses()

  if (isEdit.value) {
    await invoiceStore.fetchInvoiceDetail(invoiceId)
    const invoice = invoiceStore.currentInvoice
    if (invoice) {
      Object.assign(formData, invoice)
      await handleCourseChange(invoice.course_id)
    }
  }
})

const handleCourseChange = async (courseId) => {
  const course = courses.value.find(c => c.id === courseId)
  if (course) {
    students.value = course.students || []
    formData.amount = course.fee || 0
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true

    let result
    if (isEdit.value) {
      result = await invoiceStore.updateInvoice(invoiceId, formData)
    } else {
      result = await invoiceStore.createInvoice(formData)
    }

    if (result.success) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      router.push('/teacher/invoices')
    } else {
      ElMessage.error(result.message || '操作失败')
    }
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/teacher/invoices')
}
</script>

<style scoped>
.invoice-form-view {
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
</style>
