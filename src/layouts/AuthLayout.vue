<template>
  <div class="auth-layout">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color-page, #f5f7fa);
}
</style>
