<template>
  <div class="course-form-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑课程' : '新建课程' }}</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入课程名称" />
        </el-form-item>

        <el-form-item label="课程月份" prop="course_month">
          <el-date-picker
            v-model="formData.course_month"
            type="month"
            placeholder="选择月份"
            format="YYYY年MM月"
            value-format="YYYY-MM"
          />
        </el-form-item>

        <el-form-item label="课程费用" prop="fee">
          <el-input-number
            v-model="formData.fee"
            :precision="2"
            :min="0"
            :max="999999"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="最大学生数" prop="max_students">
          <el-input-number
            v-model="formData.max_students"
            :min="1"
            :max="100"
          />
          <span class="unit">人</span>
        </el-form-item>

        <el-form-item label="课程状态" prop="status">
          <el-select v-model="formData.status" placeholder="选择状态">
            <el-option label="计划中" value="planning" />
            <el-option label="进行中" value="ongoing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
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
import { useTeacherCourseStore } from '@/stores/teacher/courses'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const courseStore = useTeacherCourseStore()

const formRef = ref()
const loading = ref(false)
const courseId = route.params.id

const isEdit = computed(() => !!courseId && route.meta.action === 'edit')

const formData = reactive({
  name: '',
  course_month: '',
  fee: 0,
  max_students: 10,
  status: 'planning'
})

const rules = {
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' }
  ],
  course_month: [
    { required: true, message: '请选择课程月份', trigger: 'change' }
  ],
  fee: [
    { required: true, message: '请输入课程费用', trigger: 'blur' }
  ],
  max_students: [
    { required: true, message: '请输入最大学生数', trigger: 'blur' }
  ]
}

onMounted(async () => {
  if (isEdit.value) {
    await courseStore.fetchCourseDetail(courseId)
    const course = courseStore.currentCourse
    if (course) {
      Object.assign(formData, course)
    }
  }
})

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true

    let result
    if (isEdit.value) {
      result = await courseStore.updateCourse(courseId, formData)
    } else {
      result = await courseStore.createCourse(formData)
    }

    if (result.success) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      router.push('/teacher/courses')
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
  router.push('/teacher/courses')
}
</script>

<style scoped>
.course-form-view {
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
