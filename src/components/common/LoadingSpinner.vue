<template>
  <div v-if="loading" class="loading-overlay">
    <el-icon class="is-loading" :size="40">
      <Loading />
    </el-icon>
    <p>{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: '加载中...'
  }
})
</script>

<style scoped>
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
}

.loading-overlay p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}
</style>
