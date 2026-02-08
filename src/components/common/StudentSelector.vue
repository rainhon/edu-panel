<template>
  <el-dialog
    v-model="visible"
    title="选择学生"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 搜索框 -->
    <el-input
      v-model="searchKeyword"
      placeholder="搜索学生姓名或邮箱"
      prefix-icon="Search"
      clearable
      @input="handleSearch"
      class="mb-20"
    />

    <!-- 学生列表 -->
    <el-table
      ref="tableRef"
      :data="filteredStudents"
      :loading="loading"
      max-height="400"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.status === 'active'" type="success" size="small">
            活跃
          </el-tag>
          <el-tag v-else type="info" size="small">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="fetchStudents"
      @current-change="fetchStudents"
      class="mt-20"
    />

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :disabled="selectedStudents.length === 0"
        >
          确定添加（{{ selectedStudents.length }} 人）
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getStudents } from '@/api/teacher/students'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  // 已选学生ID列表（用于禁用已选中的学生）
  excludeIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const tableRef = ref()
const loading = ref(false)
const searchKeyword = ref('')
const students = ref([])
const selectedStudents = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 过滤后的学生列表（排除已添加的学生）
const filteredStudents = computed(() => {
  return students.value.filter(student => !props.excludeIds.includes(student.id))
})

// 获取学生列表
const fetchStudents = async () => {
  loading.value = true
  try {
    const response = await getStudents({
      search: searchKeyword.value,
      page: currentPage.value,
      per_page: pageSize.value
    })

    if (response.success) {
      students.value = response.data.data || []
      total.value = response.data.total || 0

      // 清除不再符合条件的选择
      if (searchKeyword.value) {
        const validIds = students.value.map(s => s.id)
        selectedStudents.value = selectedStudents.value.filter(s =>
          validIds.includes(s.id)
        )
      }
    }
  } catch (error) {
    console.error('获取学生列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索处理（带防抖）
let searchTimer = null
const handleSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchStudents()
  }, 500)
}

// 选择变化处理
const handleSelectionChange = (selection) => {
  selectedStudents.value = selection
}

// 确认添加
const handleConfirm = () => {
  if (selectedStudents.value.length === 0) {
    ElMessage.warning('请至少选择一名学生')
    return
  }

  emit('confirm', selectedStudents.value)
  handleClose()
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  searchKeyword.value = ''
  selectedStudents.value = []
  currentPage.value = 1
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
}

// 监听对话框打开
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    fetchStudents()
  }
})
</script>

<style scoped>
.mb-20 {
  margin-bottom: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
